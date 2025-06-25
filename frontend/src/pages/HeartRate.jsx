import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const HeartRate = () => {
  const [thalach, setThalach] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, thalach });
    navigate("/exang-key"); 
  };
  const heartRateCategories = [
    { "label": "low", "value": 1 },
    { "label": "medium", "value": 2 },
    { "label": "high", "value": 3 }
  ];

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Heart Rate</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="thalach">Select Heart Rate Category (bpm):</label>
            <select
              id="thalach"
              value={thalach}
              onChange={(e) => setThalach(e.target.value)}
              required
            >
              {heartRateCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
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

export default HeartRate;
