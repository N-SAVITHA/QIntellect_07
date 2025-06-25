import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import roboGif from "../assets/robo.gif"; // Adjust path if needed
import { UserContext } from "../UserContext";

const BPMonitor = () => {
  const [inputs, setInputs] = useState({
    systolic: "",
    diastolic: ""
  });

  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Systolic:", inputs.systolic);
    console.log("Diastolic:", inputs.diastolic);
    navigate("/pulse-monitor");
  };

  const bpFields = [
    { label: "Systolic Pressure (mmHg)", name: "systolic" },
    { label: "Diastolic Pressure (mmHg)", name: "diastolic" }
  ];

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        {/* Add the GIF here */}
        {/* <img src={roboGif} alt="Robo" className="robo-gif" /> */}

        <h3 className="font-semibold">Blood Pressure Monitor</h3>

        <form onSubmit={handleSubmit}>
          {bpFields.map((field, index) => (
            <div className="input-group" key={index}>
              <label>
                {field.label}
                <input
                  type="number"
                  name={field.name}
                  value={inputs[field.name]}
                  onChange={(e) => setInputs({ ...inputs, [field.name]: e.target.value })}
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

export default BPMonitor;
