import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const RestBloodPressure = () => {
  const [trestbps, setTrestbps] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  // Define predefined ranges or values for BP
  const bpRanges = [
    { value: "", label: "-- Select --" },
    { value: "90", label: "Low (90 mmHg)" },
    { value: "120", label: "Normal (120 mmHg)" },
    { value: "140", label: "High (140 mmHg)" },
    { value: "160", label: "Very High (160 mmHg)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, trestbps });
    navigate("/chol-key");
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Resting Blood Pressure</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="trestbps">Select Resting BP (mmHg):</label>
            <select
              id="trestbps"
              value={trestbps}
              onChange={(e) => setTrestbps(e.target.value)}
              required
            >
              {bpRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default RestBloodPressure;
