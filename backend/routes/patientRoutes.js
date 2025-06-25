import express from 'express'
import validateToken from '../middleware/validateTokenhandler.js'
import { registerPatient, loginPatient, currentPatient, logoutPatient, getPatientById, changePassPatient, changePassOtpVerifiedPatient } from '../controllers/patientController.js'

const router = express.Router();

router.route("/register").post(registerPatient);
router.route("/login").post(loginPatient);
router.route("/change-pass-otp-verified").post(changePassOtpVerifiedPatient);
router.route("/current").get(currentPatient);
router.route("/logout").post(validateToken, logoutPatient);
router.route("/change-pass").post(validateToken, changePassPatient);
router.route("/:id").get(getPatientById);

export default router;