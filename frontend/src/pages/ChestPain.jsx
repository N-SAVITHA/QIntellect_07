import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const ChestPain = () => {
  const [cp, setCp] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, cp: Number(cp) }); // Ensure cp is a number
    navigate("/trestbps-key");
  };
  const chestPainOptions = [
    { "label": "No", "value": 1 },
    { "label": "Rare", "value": 2 },
    { "label": "Mild", "value": 3 },
    { "label": "Severe", "value": 4 },
  ];

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Chest Pain Type</h3><br></br>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Select Chest Pain Type:</label>
            <select
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              required
            >
              <option value="" disabled>Select...</option>
              {chestPainOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div><br />
          <button type="submit">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default ChestPain;
