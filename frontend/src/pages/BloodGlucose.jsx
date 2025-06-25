import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const BloodGlucose = () => {
  const [fasting, setFasting] = useState("");
  const [random, setRandom] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, glucose: fasting });
    // Redirect to Temperature page
    navigate("/temperature");
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Blood Glucose</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Fasting (mg/dL):
              <input
                type="number"
                value={fasting}
                onChange={(e) => setFasting(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="input-group">
            <label>
              Random (mg/dL):
              <input
                type="number"
                value={random}
                onChange={(e) => setRandom(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default BloodGlucose;
