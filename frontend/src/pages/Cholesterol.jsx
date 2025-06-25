import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const Cholesterol = () => {
  const [chol, setChol] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  // Define predefined cholesterol categories
  const cholLevels = [
    { value: "", label: "-- Select --" },
    { value: "200", label: "Normal (200 mg/dL)" },
    { value: "240", label: "Borderline High (240 mg/dL)" },
    { value: "300", label: "High (300 mg/dL)" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, chol });
    navigate("/thalach-key");
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Cholesterol Level</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="chol">Select Cholesterol Level (mg/dL):</label>
            <select
              id="chol"
              value={chol}
              onChange={(e) => setChol(e.target.value)}
              required
            >
              {cholLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
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

export default Cholesterol;
