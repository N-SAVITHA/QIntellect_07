import mongoose from "mongoose";

const doctorSchema = mongoose.Schema({
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
    department: {
        type: String,
        required: [true, "Please enter your department"]
    }
}, {
    timestamps: true
});

export default mongoose.model("Doctor", doctorSchema); 