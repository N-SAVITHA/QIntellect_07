import React from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";

const Checkup = () => {
  const navigate = useNavigate();

  const checkupOptions = [
    { label: "General Checkup", route: "/general-checkup", className: "general-btn" },
    { label: "Symptom-Based Checkup", route: "/test", className: "symptom-btn" }
  ];

  return (
    <section className="checkup-section">
      <br></br>
      
      <h1 style={{fontWeight:700, marginTop:37}}>GENERAL AND SYMPTOM-BASED DIAGNOSIS</h1><br></br>
      <h2>SELECT DIAGNOSIS MODE</h2>
      <div className="checkup-buttons">
        <button className="general-btn" onClick={() => navigate("/height")}>
          General Diagnosis
        </button>
        <button className="symptom-btn" onClick={() => navigate("/test")}>
          Symptom-Based Diagnosis
        </button>
      </div>
    </section>
  );
};

export default Checkup;
