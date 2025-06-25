import express from 'express';
import validateToken from '../middleware/validateTokenhandler.js';
import { diseasePrediction } from '../controllers/predictController.js';

const router = express.Router();

router.route("/predict").post(validateToken, diseasePrediction);

export default router;