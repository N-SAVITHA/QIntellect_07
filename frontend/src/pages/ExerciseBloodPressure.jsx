import React, { useContext, useState } from "react";
import "./Checkup.css";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ExerciseBloodPressure = () => {
  const [exang, setExang] = useState("");
  const { medical, setMedical } = useContext(UserContext);
  const navigate = useNavigate();

  const exerciseBPCategories = [
    { "label": "yes", "value": 1 },
    { "label": "no", "value": 0 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMedical = { ...medical, exang };
    setMedical(updatedMedical);
    alert("please wait, while we evaluate your data");
    console.log(updatedMedical); // Log the correct value
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_DOMAIN}/disease/predict`,
        updatedMedical
      );
      navigate("/result", { state: data });
    } catch (e) {
      console.error("Error fetching prediction:", e);
    }
  };

  return (
    <div className="bp-monitor-wrapper">
      <div className="checkup-form">
        <h3 className="font-semibold">Exercise-Induced Blood Pressure</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="exang">Select Exercise-Induced BP Category:</label>
            <select
              id="exang"
              value={exang}
              onChange={(e) => setExang(e.target.value)}
              required
            >
              {exerciseBPCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ExerciseBloodPressure;
