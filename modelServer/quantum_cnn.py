import torch
import torch.nn as nn
import pennylane as qml
from pennylane import numpy as np_qml
from joblib import Parallel, delayed
n_qubits = 6  # Increased number of qubits for better representation
dev = qml.device("lightning.qubit", wires=n_qubits)
# Quantum Convolutional Layer
@qml.qnode(dev)
def quantum_conv_circuit(inputs, weights):
    # Scale inputs to be between -π and π for better quantum encoding
    scaled_inputs = np_qml.clip(inputs, -1, 1) * np_qml.pi

    # Encode selected inputs into quantum states
    for i in range(n_qubits):
        qml.RY(scaled_inputs[i], wires=i)

    # First convolutional-like structure with parameterized rotation gates
    for i in range(n_qubits):
        qml.RX(weights[0, i], wires=i)
        qml.RZ(weights[1, i], wires=i)

    # Entanglement layer (creating quantum "feature maps")
    for i in range(n_qubits - 1):
        qml.CNOT(wires=[i, i + 1])
    qml.CNOT(wires=[n_qubits - 1, 0])  # Circular boundary condition

    # Second rotation layer
    for i in range(n_qubits):
        qml.RY(weights[2, i], wires=i)
        qml.RZ(weights[3, i], wires=i)

    # Additional entanglement for deep feature extraction
    for i in range(0, n_qubits, 2):
        qml.CNOT(wires=[i, (i + 1) % n_qubits])

    # Final rotation layer
    for i in range(n_qubits):
        qml.RX(weights[4, i], wires=i)

    # Measurement: return expectation values for each wire
    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

# Define the hybrid classical-quantum model
class QuantumCNN(nn.Module):
    def __init__(self, n_qubits, n_symptoms, n_departments):
        super(QuantumCNN, self).__init__()

        self.n_qubits = n_qubits

        # Classical pre-processing layers
        self.pre_process = nn.Sequential(
            nn.Linear(n_symptoms, 32),
            nn.ReLU(),
            nn.Dropout(0.2),  # Prevent overfitting
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, n_qubits),
            nn.Tanh()  # Bound to [-1, 1] for quantum input
        )

        # Quantum layer weights (5 layers of rotation gates)
        self.q_weights = nn.Parameter(torch.randn(5, n_qubits))

        # Classical post-processing layers
        self.post_process = nn.Sequential(
            nn.Linear(n_qubits, 16),
            nn.ReLU(),
            nn.Linear(16, n_departments)
        )

    def forward(self, x):
        batch_size = x.shape[0]
        pre_processed = self.pre_process(x)
        print(f"Pre-processed shape: {pre_processed.shape}")  # Debug shape
        weights = self.q_weights
        # Use a simple loop instead of Parallel
        q_results = [
            quantum_conv_circuit(pre_processed[i].detach().numpy(), weights.detach().numpy())
            for i in range(batch_size)
        ]
        print("q_results:", q_results)
        q_results_np = [[float(val) for val in sample] for sample in q_results]
        q_out = torch.tensor(q_results_np, dtype=torch.float32)
        print(f"Quantum output shape: {q_out.shape}")  # Debug shape
        return self.post_process(q_out)


# Training function
