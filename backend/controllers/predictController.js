import dotenv from 'dotenv';
import asyncHandler from "express-async-handler";
import axios from 'axios';

dotenv.config();

// @desc send OTP to mail for verification
// @route POST /predict
// @access public
const diseasePrediction = asyncHandler(async (req, res) => {
    const { cp, trestbps, chol, thalach, exang, smoking, glucose, ht, wt } = req.body;
    const heartDiseaseData = {
        age: req.user.age,
        sex: (req.user.gender == "m" ? 1 : 0),
        cp,
        trestbps,
        chol,
        thalach,
        exang,
        fbs: 0,
        restecg: 1,
        oldpeak: 1.8,
        slope: 2,
        ca: 0,
        thal: 2,
    }
    console.log("1");
    let { data } = await axios.post(`${process.env.HEART_DOMAIN}/predict/heartDisease`, heartDiseaseData);
    const heartDiseaseRes = data.prediction[0];
    console.log("1");
    const bmi = parseInt(wt) / ((parseInt(ht) * parseInt(ht)) / 10000);

    const diabetesData = {
        gender: (req.user.gender == "m" ? "male" : "female"),
        age: req.user.age,
        hypertension: trestbps,
        heart_disease: heartDiseaseRes,
        smoking_history: smoking,
        bmi: bmi,
        HbA1c_level: 5,
        blood_glucose_level: glucose
    }
    const diaRes = await axios.post(`${process.env.DIABETES_DOMAIN}/predict`, diabetesData);
    const diabetesRes = diaRes.data.prediction;
    console.log("1");
    res.status(200).json({
        message: "Prediction sent successfully",
        heart: (heartDiseaseRes == 1 ? true : false),
        diabetes: (diabetesRes == 1 ? true : false),
        bmi: bmi
    });
});

export { diseasePrediction }