import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

function Register() {
    const [user, setUser] = useState({ name: "", gender: "", phone: "", email: "", password: "-", age: "", height: "", weight: "", bloodGroup: "", history: "" });
    const [pass, setPass] = useState({ one: "", two: "" });
    const navigate = useNavigate();

    async function addUser(e) {
        e.preventDefault();
        const { history, ...requiredFields } = user;

        if (!Object.values(requiredFields).every(val => val !== "")) {
            alert("Please fill out all the required fields.");
            return;
        }
        if (pass.one !== pass.two) {
            alert("Passwords do not match.");
            return;
        }
        if (pass.one.length < 8) {
            alert("Password should be 8 characters long");
            return;
        }
        user.password = pass.one;
        if (user.phone.length !== 10) {
            alert("Please enter a valid phone number.");
            return;
        }

        try {
            await axios.post("/patient/register", user);
            alert("Registration Successful");
            setUser({ name: "", gender: "", phone: "", email: "", password: "-", age: "", height: "", weight: "", bloodGroup: "", history: "" })
            navigate("/login");
        } catch (e) {
            alert("Login Failed")
            setUser({ name: "", gender: "", phone: "", email: "", password: "-", age: "", height: "", weight: "", bloodGroup: "", history: "" });
        }
    }

    return (
        <div className="w-96 border rounded-xl p-7 shadow-md mx-auto mt-32 min-w-80">
            <h1 className="text-3xl text-center">Register</h1>
            <form className="flex flex-col mt-7" onSubmit={(e) => addUser(e)}>

                <input type="text"
                    placeholder="your name"
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <select
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.gender}
                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                >
                    <option value="">Select Gender</option>
                    <option value="m">Male</option>
                    <option value="f">Female</option>
                </select>
                <input type="number"
                    placeholder="phone number"
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
                <input type="email"
                    placeholder="email id"
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                <input type="text"
                    placeholder="age"
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.age}
                    onChange={(e) => setUser({ ...user, age: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2 ">
                    <input type="text"
                        placeholder="height"
                        className="border rounded-2xl py-2 px-3 mb-2"
                        value={user.height}
                        onChange={(e) => setUser({ ...user, height: e.target.value })}
                    />
                    <input type="text"
                        placeholder="weight"
                        className="border rounded-2xl py-2 px-3 mb-2"
                        value={user.weight}
                        onChange={(e) => setUser({ ...user, weight: e.target.value })}
                    />
                </div>
                <select
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.bloodGroup}
                    onChange={(e) => setUser({ ...user, bloodGroup: e.target.value })}
                >
                    <option value="">Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>

                <textarea
                    placeholder="Medical history"
                    rows="4"
                    className="border rounded-2xl py-2 px-3 mb-2"
                    value={user.history}
                    onChange={(e) => setUser({ ...user, history: e.target.value })}
                />

                <input type="password"
                    placeholder="Enter password"
                    className="border rounded-2xl py-2 px-3 mb-2 mt-6"
                    value={pass.one}
                    onChange={(e) => setPass({ ...pass, one: e.target.value })}
                />
                <input type="text"
                    placeholder="Re-enter password"
                    className="border rounded-2xl py-2 px-3 mb-4"
                    value={pass.two}
                    onChange={(e) => setPass({ ...pass, two: e.target.value })}
                />

                <button className={`border bg-primary text-white rounded-2xl p-1 mt-5 mb-1`} type="submit">Register</button>

                <div className="text-center text-gray-500">
                    Already a member? <Link to="/login" className="text-black underline">Login</Link>
                </div>

            </form>
        </div>
    );
}

export default Register;