import React, { useEffect, useState } from "react";
import "./Result.css"; // Make sure this CSS file is created and styled
import { useLocation } from "react-router-dom";

const Result = () => {
    const [data, setData] = useState(null);
    const [bm, setBm] = useState("");
    const location = useLocation();
    useEffect(() => {
        // Set data from location.state only once when the component mounts
        if (location.state) {
            setData(location.state);
            if (location.state.bmi > 18.5 && location.state.bmi < 24.9) {
                setBm("Normal");
            }
            else if (location.state.bmi <= 18.5) {
                setBm("Underweight");
            }
            else {
                setBm("Overweight");
            }
            console.log(location.state)
        }
    }, [location.state]);

    const formatResult = (value) => (value ? "Positive" : "Negative");

    return (
        <div className="results-container mt-48 mx-auto">
            <h1 className="font-bold text-2xl mb-5">Health Report</h1>
            <hr></hr>
            {data ? (
                <>
                    <div className="result-item">
                        <span>Diabetes:</span>
                        <span className={data.diabetes ? "positive" : "negative"}>
                            {formatResult(data.diabetes)}
                        </span>
                    </div>

                    <div className="result-item">
                        <span>Heart Disease:</span>
                        <span className={data.heart ? "positive" : "negative"}>
                            {formatResult(data.heart)}
                        </span>
                    </div>

                    <div className="result-item">
                        <span>BMI:</span>
                        <span className={`bmi font-bold ${bm == "Normal" ? "text-myGreen" : "text-myRed"}`}>
                            {bm}
                        </span>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Result;