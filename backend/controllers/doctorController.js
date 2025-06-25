import asyncHandler from "express-async-handler";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// @desc Register a doctor
// @route POST /doctor/register
// @access public
const registerDoctor = asyncHandler(async (req, res) => {
    const { name, gender, phone, email, password, age, department } = req.body;

    if (!name || !gender || !email || !password || !phone || !age || !department) {
        res.status(400);
        throw new Error("All mandatory fields are required");
    }
    const doctorAvailableEmail = await Doctor.findOne({ email });
    if (doctorAvailableEmail) {
        res.status(400);
        throw new Error("Email already registered");
    }

    const doctorAvailablePhone = await Doctor.findOne({ phone });
    if (doctorAvailablePhone) {
        res.status(400);
        throw new Error("Phone number already registered");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // When you write doctorname and email directly inside the object, it's using object property shorthand, assumes the key and the value are the same.
    const doctor = await Doctor.create({
        name,
        gender,
        phone,
        email,
        password: hashedPassword,
        age,
        department
    });

    if (doctor) {
        res.status(201).json({ id: doctor.id, message: "doctor registered successfully" });
    } else {
        res.status(400);
        throw new Error("doctor data not valid");
    }
});

// @desc Login a doctor
// @route POST /doctor/login
// @access public
const loginDoctor = asyncHandler(async (req, res) => {
    const { email, phone, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }
    const doctor = await Doctor.findOne({ email });
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
        const accessToken = jwt.sign({
            user: {
                id: doctor.id,
                name: doctor.name,
                gender: doctor.gender,
                phone: doctor.phone,
                email: doctor.email,
                age: doctor.age,
                department: doctor.department
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

// @desc Current doctor information
// @route GET /doctor/current
// @access private
const currentDoctor = asyncHandler(async (req, res) => {
    res.status(200).json({ ...req.user });
});

// @desc Logout a doctor
// @route POST /doctor/logout
// @access private
const logoutDoctor = asyncHandler(async (req, res) => {
    res.status(200).cookie('accessToken', '', {
        httpOnly: true,
        sameSite: process.env.COOKIE_SAME_SITE,
        secure: process.env.COOKIE_SECURE_STATE,
    }).json({ message: "logout successful" });
});

// @desc change password of doctor by verifying current password
// @route POST /doctor/change-pass
// @access private
const changePassDoctor = asyncHandler(async (req, res) => {
    const { curPass, newPass } = req.body;

    const doctor = await Doctor.findById(req.user.id).select("password");

    const curPassValid = await bcrypt.compare(curPass, doctor.password);
    if (curPassValid) {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        await Doctor.findByIdAndUpdate(req.user.id, { password: hashedPassword });
        res.status(200).json({ message: "password changed successfully" })
    } else {
        res.status(400);
        throw new Error("current password is incorrect");
    }
});

// @desc change password of doctor after OTP verification
// @route POST /doctor/change-pass-otp-verified
// @access private
const changePassOtpVerifiedDoctor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
        res.status(400);
        throw new Error("No doctor found with the entered email ID");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Doctor.findByIdAndUpdate(doctor.id, { password: hashedPassword });
    res.status(200).json({ message: "password changed successfully" })
});

// @desc Get doctor data by id
// @route GET /doctor/:id
// @access public
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
        res.status(400);
        throw new Error("doctor not found");
    }

    res.json({ name: doctor.name, email: doctor.email, phone: doctor.phone, id: doctor.id }).status(200);
});

export { registerDoctor, loginDoctor, logoutDoctor, currentDoctor, changePassDoctor, changePassOtpVerifiedDoctor, getDoctorById }