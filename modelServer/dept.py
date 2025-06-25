import os
import pickle
import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pennylane as qml
from pennylane import numpy as np_qml
from quantum_cnn import QuantumCNN  # Assuming you save your model class in quantum_cnn.py
app = FastAPI(title="Medical Department Prediction API")

# Load model and components
model_dir = "models"  # Adjust path as per your saved model location
device = qml.device("lightning.qubit", wires=6)  # Match n_qubits from your model

# Load saved model state

model_path = os.path.join(model_dir, "symptoms", "quantum_cnn_model.pth")
if os.path.exists(model_path):
    checkpoint = torch.load(model_path)
    n_symptoms = checkpoint["n_symptoms"]
    n_departments = checkpoint["n_departments"]
    n_qubits = checkpoint["n_qubits"]
    model = QuantumCNN(n_qubits=n_qubits, n_symptoms=n_symptoms, n_departments=n_departments)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()
else:
    raise HTTPException(status_code=500, detail="Model file not found")

# Load scaler
scaler_path = os.path.join(model_dir, "symptoms", "scaler.pkl")
if not os.path.exists(scaler_path):
    raise HTTPException(status_code=500, detail=f"Scaler file not found at {scaler_path}")
with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

# Load symptom and department names
with open(os.path.join(model_dir, "symptoms", "symptom_names.pkl"), "rb") as f:
    symptom_names = pickle.load(f)
    print("symptom_names loaded:", symptom_names)
with open(os.path.join(model_dir, "symptoms", "department_names.pkl"), "rb") as f:
    department_names = pickle.load(f)

# Pydantic model for request validation
class SymptomInput(BaseModel):
    symptoms: dict[str, float]  # e.g., {"Chest Pain": 8.0, "Shortness of Breath": 7.0}

@app.on_event("startup")
async def startup_event():
    print("API started successfully. Model loaded.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Medical Department Prediction API"}
@app.post("/predict/")
async def predict_department(input_data: SymptomInput):
    try:
        symptoms_dict = input_data.symptoms
        print(f"Received symptoms: {symptoms_dict}")  # Debug input
        symptom_array = np.zeros(len(symptom_names))
        print(f"Symptom array initialized with length: {len(symptom_names)}")

        for symptom, value in symptoms_dict.items():
            if symptom not in symptom_names:
                print(f"Warning: Symptom '{symptom}' not in symptom_names: {symptom_names}")
                raise ValueError(f"Symptom '{symptom}' not found in model vocabulary")
            idx = symptom_names.index(symptom)
            symptom_array[idx] = min(max(value, 0), 10) / 10.0
            print(f"Set {symptom} at index {idx} to {symptom_array[idx]}")

        print(f"Symptom array before scaling: {symptom_array}")
        symptoms_scaled = scaler.transform([symptom_array])
        print(f"Scaled symptoms: {symptoms_scaled}")
        symptoms_tensor = torch.tensor(symptoms_scaled, dtype=torch.float32)
        print(f"Tensor shape: {symptoms_tensor.shape}")

        with torch.no_grad():
            output = model(symptoms_tensor)
            print(f"Model output shape: {output.shape}")
            probabilities = torch.softmax(output, dim=1)
            values, indices = torch.topk(probabilities, 3)
            predictions = [
                {"department": department_names[indices[0][i].item()], "probability": values[0][i].item() * 100}
                for i in range(3)
            ]
        return {"predictions": predictions}

    except Exception as e:
        print("Exception in /predict/:", repr(e))
        raise HTTPException(status_code=400, detail=f"Prediction error: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)