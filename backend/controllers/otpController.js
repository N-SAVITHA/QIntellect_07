import dotenv from 'dotenv';
import bcrypt from "bcrypt";
import NodeCache from 'node-cache';
import asyncHandler from "express-async-handler";
import transporter from "../config/nodeMailerConfig.js";

dotenv.config();

const otpCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// @desc send OTP to mail for verification
// @route POST /otp/send
// @access public
const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Email is required");
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(otp, 10);

    otpCache.set(email, hashedOtp)  // storing in cache

    const mailOptions = {
        from: `"QAI - Health Care" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "OTP for verification",
        text: `Your OTP is: ${otp}. It is valid for 5 minutes`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500);
        throw new Error("Error sending email");
    }
});

// @desc to verify entered OTP is correct
// @route POST /otp/verify
// @access public
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const storedOtp = otpCache.get(email);

    // Check if OTP is expired
    if (!storedOtp) {
        res.status(404);
        throw new Error("OTP not found or expired");
    }

    // Compare the provided OTP with the stored OTP
    const isOtpValid = await bcrypt.compare(otp, storedOtp);

    if (isOtpValid) {
        otpCache.del(email);  // OTP is valid, remove it from cache
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400);
        throw new Error("Invalid OTP");
    }
});

export { sendOtp, verifyOtp }