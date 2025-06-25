import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkup from "./pages/Checkup";
import Records from "./pages/Records";
import Admin from "./pages/Admin";
import BPMonitor from "./pages/BPMonitor"; 
import PulseMonitor from "./pages/PulseMonitor";
import BloodGlucose from "./pages/BloodGlucose";
import Temperature from "./pages/Temperature";
import SmokingHabits from "./pages/SmokingHabits";
import VoiceRecorder from "./pages/symptomModule/VoiceRecorder";
import ChestPain from "./pages/ChestPain";
import RestBloodPressure from "./pages/RestBloodPressure";
import Cholesterol from "./pages/Cholesterol";
import HeartRate from "./pages/HeartRate";
import ExerciseBloodPressure from "./pages/ExerciseBloodPressure";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import Height from "./pages/height";
import Result from "./pages/result";

axios.defaults.baseURL = `${import.meta.env.VITE_API_DOMAIN}`;
axios.defaults.withCredentials = true;     

const App = () => {
  return (
    <Router>
      <div className="min-h-screen text-gray-800">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/result" element={<Result />} />
          <Route path="/height" element={<Height />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkup" element={<Checkup />} />
          <Route path="/records" element={<Records />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/general-checkup" element={<BPMonitor />} />
          <Route path="/bp-monitor" element={<BPMonitor />} />
          <Route path="/pulse-monitor" element={<PulseMonitor />} />
          <Route path="/blood-glucose" element={<BloodGlucose />} />
          <Route path="/temperature" element={<Temperature />} />
          <Route path="/smoking-habits" element={<SmokingHabits />} />
          <Route path="/test" element={<VoiceRecorder />} />
          <Route path="/cp-key" element={<ChestPain />} />
          <Route path="/trestbps-key" element={<RestBloodPressure />} />
          <Route path="/chol-key" element={<Cholesterol />} />
          <Route path="/thalach-key" element={<HeartRate />} />
          <Route path="/exang-key" element={<ExerciseBloodPressure />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
