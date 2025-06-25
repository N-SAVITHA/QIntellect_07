import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";

const Temperature = () => {
  const [temperature, setTemperature] = useState("");
  const [temperatures, setTemperatures] = useState([]); // Store multiple temperature readings
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Temperature (°F):", temperature);
    
    // Adding the new temperature to the list
    setTemperatures((prevTemperatures) => [...prevTemperatures, temperature]);
    
    // Optionally, reset the temperature field after submission
    setTemperature("");

    // Navigate to next page
    navigate("/smoking-habits");
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Temperature Monitor</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Body Temperature (°F):
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Temperature;
