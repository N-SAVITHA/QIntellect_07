import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnection.js';
import errorHandler from './middleware/errorHandler.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import patientRoutes from './routes/patientRoutes.js';
import doctorRoutes  from "./routes/doctorRoutes.js";
import predictRoutes  from "./routes/predictRoutes.js";
import otpRoutes from "./routes/otpRoutes.js"
// filepath: backend/server.js
import voiceRoutes from './routes/voiceRoutes.js';



dotenv.config();
const app = express();
const port = process.env.PORT || 5003;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/patient", patientRoutes);
app.use("/doctor", doctorRoutes);
app.use("/disease", predictRoutes);
app.use("/otp", otpRoutes);
app.use('/voice', voiceRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectDb();
});