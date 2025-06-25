import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.feature_selection import SelectKBest, f_classif
from sklearn.model_selection import train_test_split
import pennylane as qml

# Load and preprocess data
data = pd.read_csv("processed.cleveland.data", header=None)
data.columns = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
]
data.replace('?', pd.NA, inplace=True)
data = data.apply(pd.to_numeric, errors='coerce')
data = data.dropna()

X = data.drop("target", axis=1)
y = (data["target"] > 0).astype(int)

# Feature selection
selector = SelectKBest(f_classif, k=5)
X_selected = selector.fit_transform(X, y.values.ravel())
selected_indices = selector.get_support(indices=True)
selected_feature_names = X.columns[selected_indices]

# Standardization
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_selected)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y.values.ravel(), test_size=0.25, stratify=y.values.ravel(), random_state=42
)

# Use a subset for efficiency
max_train_samples = min(80, len(X_train))
X_train_subset = X_train[:max_train_samples]
y_train_subset = y_train[:max_train_samples]

# Quantum device setup
n_features = X_train_subset.shape[1]
dev = qml.device("default.qubit", wires=n_features, shots=1024)

# Random parameters for embedding
np.random.seed(42)
params = np.random.uniform(0, 2 * np.pi, size=(4, n_features))

# Quantum embedding
def quantum_embedding(x, params):
    for i in range(n_features):
        qml.RX(np.pi * x[i], wires=i)
        qml.RZ(np.pi * x[i], wires=i)
    for i in range(n_features):
        qml.RY(params[0, i], wires=i)
    for i in range(n_features - 1):
        qml.CNOT(wires=[i, i + 1])
    qml.CNOT(wires=[n_features - 1, 0])
    for i in range(n_features):
        qml.RY(params[1, i], wires=i)
        qml.RZ(params[2, i], wires=i)
    for i in range(0, n_features - 1, 2):
        qml.CNOT(wires=[i, (i + 1) % n_features])
    for i in range(1, n_features, 2):
        qml.CNOT(wires=[i, (i + 1) % n_features])
    for i in range(n_features):
        qml.RX(params[3, i], wires=i)

# Quantum kernel function
def quantum_kernel(x1, x2):
    @qml.qnode(dev)
    def circuit(x1, x2):
        quantum_embedding(x1, params)
        qml.adjoint(quantum_embedding)(x2, params)
        return qml.probs(wires=range(n_features))
    return circuit(x1, x2)[0]

# Kernel matrix function
def kernel_matrix(X1, X2):
    K = np.zeros((X1.shape[0], X2.shape[0]))
    for i in range(X1.shape[0]):
        for j in range(X2.shape[0]):
            K[i, j] = quantum_kernel(X1[i], X2[j])
    return K

# Export everything needed
__all__ = ['kernel_matrix', 'X_train_subset', 'selector', 'scaler']
