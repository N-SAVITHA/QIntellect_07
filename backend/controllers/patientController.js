import asyncHandler from "express-async-handler";
import Patient from "../models/patientModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// @desc Register a patient
// @route POST /patient/register
// @access public
const registerPatient = asyncHandler(async (req, res) => {
    const { name, gender, phone, email, password, age, height, weight, bloodGroup, history } = req.body;

    if (!name || !email || !password || !phone || !age || !height || !weight || !bloodGroup || !gender) {
        res.status(400);
        throw new Error("All mandatory fields are required");
    }
    const patientAvailableEmail = await Patient.findOne({ email });
    if (patientAvailableEmail) {
        res.status(400);
        throw new Error("Email already registered");
    }

    const patientAvailablePhone = await Patient.findOne({ phone });
    if (patientAvailablePhone) {
        res.status(400);
        throw new Error("Phone already registered");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // When you write patientname and email directly inside the object, it's using object property shorthand, assumes the key and the value are the same.
    const patient = await Patient.create({
        name,
        gender,
        phone,
        email,
        password: hashedPassword,
        age,
        height,
        weight,
        bloodGroup,
        history
    });

    if (patient) {
        res.status(201).json({ id: patient.id, message: "patient registered successfully" });
    } else {
        res.status(400);
        throw new Error("patient data not valid");
    }
});

// @desc Login a patient
// @route POST /patient/login
// @access public
const loginPatient = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const patient = await Patient.findOne({ email });
    if (patient && (await bcrypt.compare(password, patient.password))) {
        const accessToken = jwt.sign({
            user: {
                id: patient.id,
                name: patient.name,
                gender: patient.gender,
                phone: patient.phone,
                email: patient.email,
                age: patient.age,
                height: patient.height,
                weight: patient.weight,
                bloodGroup: patient.bloodGroup
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "12h" });

        res.status(200).cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: process.env.COOKIE_SAME_SITE,
            secure: process.env.COOKIE_SECURE_STATE,
        }).json({ message: "login successful" });
    } else {
        res.status(400);
        throw new Error("login credentials not valid");
    }
});

// @desc Current patient information
// @route GET /patient/current
// @access private
const currentPatient = asyncHandler(async (req, res) => {
    res.status(200).json({ ...req.user });
});

// @desc Logout a patient
// @route POST /patient/logout
// @access private
const logoutPatient = asyncHandler(async (req, res) => {
    res.status(200).cookie('accessToken', '', {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({ message: "logout successful" });
});

// @desc change password of patient by verifying current password
// @route POST /patient/change-pass
// @access private
const changePassPatient = asyncHandler(async (req, res) => {
    const { curPass, newPass } = req.body;

    const patient = await Patient.findById(req.user.id).select("password");
    const curPassValid = await bcrypt.compare(curPass, patient.password);

    if (curPassValid) {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await Patient.findByIdAndUpdate(req.user.id, { password: hashedPassword });
        res.status(200).json({ message: "password changed successfully" })
    } else {
        res.status(400);
        throw new Error("current password is incorrect");
    }
});

// @desc change password of patient after OTP verification
// @route POST /patient/change-pass-otp-verified
// @access private
const changePassOtpVerifiedPatient = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
        res.status(400);
        throw new Error("No patient found with the entered email ID");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Patient.findByIdAndUpdate(patient.id, { password: hashedPassword });
    res.status(200).json({ message: "password changed successfully" })
});

// @desc Get patient data by id
// @route GET /patient/:id
// @access public
const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(400);
        throw new Error("patient not found");
    }

    res.json(patient).status(200);
});

export { registerPatient, loginPatient, currentPatient, logoutPatient, getPatientById, changePassPatient, changePassOtpVerifiedPatient }