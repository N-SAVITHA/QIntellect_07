import express from 'express'
import { sendOtp, verifyOtp } from '../controllers/otpController.js'

const router = express.Router();

router.route("/send").post(sendOtp);
router.route("/verify").post(verifyOtp);

export default router;
