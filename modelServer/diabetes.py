import numpy as np
import pandas as pd
import torch
import pennylane as qml
import torch.nn as nn
import joblib
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

# Define the input data model
class DiabetesInput(BaseModel):
    gender: str = Field(..., description="Gender of the patient")
    age: float = Field(..., description="Age of the patient")
    hypertension: int = Field(..., description="Hypertension (0 or 1)")
    heart_disease: int = Field(..., description="Heart disease (0 or 1)")
    smoking_history: str = Field(..., description="Smoking history")
    bmi: float = Field(..., description="Body Mass Index")
    HbA1c_level: float = Field(..., description="HbA1c level")
    blood_glucose_level: int = Field(..., description="Blood glucose level")

    class Config:
        schema_extra = {
            "example": {
                "gender": "Female",
                "age": 45.0,
                "hypertension": 0,
                "heart_disease": 0,
                "smoking_history": "never",
                "bmi": 27.32,
                "HbA1c_level": 5.7,
                "blood_glucose_level": 95
            }
        }

class PredictionResponse(BaseModel):
    prediction: int
    probability: float

# Define the quantum model class
class QCNNModel(nn.Module):
    def __init__(self, n_qubits):  # Corrected method name
        super(QCNNModel, self).__init__()
        # Initialize weights for the quantum circuit
        self.weights_conv = nn.Parameter(torch.randn(4, n_qubits) * 0.1)
        self.weights_pool = nn.Parameter(torch.randn(1, n_qubits // 2) * 0.1)

        # Classical layers
        self.dense1 = nn.Linear(1, 16)
        self.dense2 = nn.Linear(16, 1)
        self.activation = nn.ReLU()
        self.output_activation = nn.Sigmoid()

    def forward(self, x):
        batch_size = x.shape[0]
        quantum_outputs = torch.zeros(batch_size, 1, device=x.device)

        # Process each input in the batch individually
        for i in range(batch_size):
            quantum_outputs[i] = quantum_circuit(x[i], self.weights_conv, self.weights_pool)

        # Pass through classical layers
        x = self.activation(self.dense1(quantum_outputs))
        return self.output_activation(self.dense2(x))

# Load the saved components
n_qubits = 8  # Set to the same number used in training
dev = qml.device("default.qubit", wires=n_qubits)

# Define the quantum circuit
@qml.qnode(dev, interface="torch")
def quantum_circuit(inputs, weights_conv, weights_pool):
    # Encode the classical input data into quantum state
    for i in range(n_qubits):
        qml.RY(inputs[i], wires=i)

    # First convolutional layer
    for i in range(n_qubits):
        qml.RY(weights_conv[0, i], wires=i)
        qml.RZ(weights_conv[1, i], wires=i)

    # Entanglement
    for i in range(n_qubits-1):
        qml.CNOT(wires=[i, i+1])

    # Second convolutional layer
    for i in range(n_qubits):
        qml.RY(weights_conv[2, i], wires=i)
        qml.RZ(weights_conv[3, i], wires=i)

    # Pooling layer (measure half of the qubits)
    for i in range(n_qubits // 2):
        qml.RY(weights_pool[0, i], wires=i)

    # Return expectation values of Pauli-Z for the first qubit
    return qml.expval(qml.PauliZ(0))

# Function to load model and components
def load_model_components():
    model = QCNNModel(n_qubits)
    model.load_state_dict(torch.load('C:\\Users\\savit\\OneDrive\\Desktop\\project\\quantum pod\\Health_Care_Bot\\modelServer\\models\\diabetes\\qcnn_diabetes_model.pth'))
    model.eval()

    preprocessor = joblib.load('C:\\Users\\savit\\OneDrive\\Desktop\\project\\quantum pod\\Health_Care_Bot\\modelServer\\models\\diabetes\\preprocessor.joblib')
    pca = joblib.load('C:\\Users\\savit\\OneDrive\\Desktop\\project\\quantum pod\\Health_Care_Bot\\modelServer\\models\\diabetes\\pca.joblib')
    feature_scaler = joblib.load('C:\\Users\\savit\\OneDrive\\Desktop\\project\\quantum pod\\Health_Care_Bot\\modelServer\\models\\diabetes\\feature_scaler.joblib')

    return model, preprocessor, pca, feature_scaler

# Create FastAPI app
app = FastAPI(
    title="QCNN Diabetes Prediction API",
    description="API for predicting diabetes using a Quantum Convolutional Neural Network",
    version="1.0.0", port=8001
)

# Load model and components at startup
model, preprocessor, pca, feature_scaler = None, None, None, None

@app.on_event("startup")
async def startup_event():
    global model, preprocessor, pca, feature_scaler
    model, preprocessor, pca, feature_scaler = load_model_components()

@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: DiabetesInput):
    try:
        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data.model_dump()])
        
        # Preprocess the input
        input_preprocessed = preprocessor.transform(input_df)
        
        # Apply PCA
        input_pca = pca.transform(input_preprocessed)
        
        # Scale for quantum circuit input
        input_quantum = feature_scaler.transform(input_pca)
        
        # Convert to PyTorch tensor
        input_tensor = torch.tensor(input_quantum, dtype=torch.float32)
        
        # Make prediction
        with torch.no_grad():
            output = model(input_tensor).numpy()[0][0]
        
        # Get binary prediction and probability
        prediction = int(output > 0.5)
        probability = float(output)
        
        return {"prediction": prediction, "probability": probability}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}