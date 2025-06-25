from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from quantum_kernel_config import kernel_matrix, X_train_subset, selector, scaler

app = FastAPI()

# Load trained model
model = joblib.load("models\\heartDisease\\heartDisease.pkl")

class InputData(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

@app.post("/predict/heartDisease")
def predict_heart_disease(input: InputData):
    input_df = pd.DataFrame([input.model_dump()])
    X_selected = selector.transform(input_df)
    X_scaled = scaler.transform(X_selected)
    K_test = kernel_matrix(X_scaled, X_train_subset)
    prediction = model.predict(K_test)
    return {"prediction": prediction.tolist()}

@app.get("/test/")
def test_endpoint():
    return {"message": "hi"}