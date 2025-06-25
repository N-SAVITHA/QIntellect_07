import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"]
    },
    gender: {
        type: String,
        required: [true, "Please provide your gender"]
    },
    phone: {
        type: Number,
        required: [true, "Please provide an phone"],
        unique: [true, "Phone number already exists"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: [true, "email already exists"]
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    age: {
        type: Number,
        required: [true, "Please provide your age"]
    },
    height: {
        type: String,
        required: [true, "Please provide your height"]
    },
    weight: {
        type: String,
        required: [true, "Please provide your weight"]
    },
    bloodGroup: {
        type: String,
        required: [true, "Please provide your blood group"]
    },
    history: {
        type: String,
    },
}, {
    timestamps: true
});

export default mongoose.model("Patient", patientSchema); 