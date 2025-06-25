import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { registerDoctor, loginDoctor, logoutDoctor, currentDoctor, changePassDoctor, changePassOtpVerifiedDoctor, getDoctorById } from '../controllers/doctorController.js'

const router = express.Router();

router.route("/register").post(registerDoctor);
router.route("/login").post(loginDoctor);
router.route("/change-pass-otp-verified").post(changePassOtpVerifiedDoctor);
router.route("/current").get(validateToken, currentDoctor);
router.route("/logout").post(validateToken, logoutDoctor);
router.route("/change-pass").post(validateToken, changePassDoctor);
router.route("/:id").get(getDoctorById);


export default router;