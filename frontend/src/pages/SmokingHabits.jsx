import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkup.css";
import { UserContext } from "../UserContext";

const SmokingHabits = () => {
  const [smoking, setSmoking] = useState("");
  const navigate = useNavigate();
  const { medical, setMedical } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMedical({ ...medical, smoking });
    navigate("/cp-key"); 
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form w-80">
        <h3 className="font-semibold">Smoking Habits</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Do you smoke?</label>
            <div><br />
              <label>
                <input
                  type="radio"
                  value="never"
                  checked={smoking === "never"}
                  onChange={(e) => setSmoking(e.target.value)}
                  required
                />{" "}
                Never
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="radio"
                  value="current"
                  checked={smoking === "current"}
                  onChange={(e) => setSmoking(e.target.value)}
                />{" "}
                Current
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="radio"
                  value="former"
                  checked={smoking === "former"}
                  onChange={(e) => setSmoking(e.target.value)}
                />{" "}
                Former
              </label>
            </div>
          </div>
          <button type="submit">Proceed</button>
        </form>
      </div>
    </div>
  );
};

export default SmokingHabits;
