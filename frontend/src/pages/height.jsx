import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import roboGif from "../assets/robo.gif"; // Adjust path if needed
import { UserContext } from "../UserContext";

const Height = () => {
  const [height, setheight] = useState("");
  const [weight, setweight] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, ht: height, wt: weight });
    navigate("/general-checkup");
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        {/* Add the GIF here */}
        {/* <img src={roboGif} alt="Robo" className="robo-gif" /> */}

        <h3 className="font-semibold">Height & Weight</h3>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Height (cm):
              <input
                type="number"
                value={height}
                onChange={(e) => setheight(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="input-group">
            <label>
              Weight (kg):
              <input
                type="number"
                value={weight}
                onChange={(e) => setweight(e.target.value)}
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

export default Height;
