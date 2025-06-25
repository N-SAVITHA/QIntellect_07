import React from "react";
import "./Records.css";
import { FaHeartbeat, FaVials, FaNotesMedical, FaPills } from "react-icons/fa";

const Records = () => {

  return(
    <section className="records-section">
      <h2>Medical Records Dashboard</h2>
      <p>Track your health journey with reports, results, and diagnoses.</p>
  
      <div className="records-grid">
        <div className="record-card blue">
          <div className="card-header">
            <FaVials className="card-icon" />
            <h3>Recent Reports</h3>
          </div>
          <ul>
            <li>Blood Test – Mar 2025</li>
            <li>X-Ray – Feb 2025</li>
            <li>ECG – Jan 2025</li>
          </ul>
        </div>
  
        <div className="record-card green">
          <div className="card-header">
            <FaHeartbeat className="card-icon" />
            <h3>Vitals Overview</h3>
          </div>
          <ul>
            <li>Heart Rate: <strong>72 bpm</strong></li>
            <li>Blood Sugar: <strong>95 mg/dL</strong></li>
            <li>Oxygen: <strong>98%</strong></li>
          </ul>
        </div>
  
        <div className="record-card yellow">
          <div className="card-header">
            <FaNotesMedical className="card-icon" />
            <h3>Diagnosis History</h3>
          </div>
          <ul>
            <li>Hypertension – <em>2023</em></li>
            <li>Allergy – <em>2024</em></li>
          </ul>
        </div>
  
        <div className="record-card purple">
          <div className="card-header">
            <FaPills className="card-icon" />
            <h3>Medications</h3>
          </div>
          <ul>
            <li>Amlodipine – Daily</li>
            <li>Antihistamine – On-demand</li>
            <li>Vitamin D – Weekly</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
  

export default Records;
