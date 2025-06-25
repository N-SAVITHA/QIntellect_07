import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const PulseMonitor = () => {
  const [inputs, setInputs] = useState({
    spo2: "",
    respiration: ""
  });

  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  const handleChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pulse data:", inputs);
    navigate("/blood-glucose");
  };

  const pulseFields = [
    { label: "SPO2", name: "spo2" },
    { label: "Respiration", name: "respiration" }
  ];

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Pulse Monitor</h3>
        <form onSubmit={handleSubmit}>
          {pulseFields.map((field, index) => (
            <div className="input-group" key={index}>
              <label>
                {field.label}:
                <input
                  type="number"
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          ))}
          <button type="submit">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default PulseMonitor;
