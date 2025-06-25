import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Login() {
    const [user, setUser] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    
    async function loginUser(e) {
        e.preventDefault();

        if (user.email === "" || user.password === "") {
            alert("All fields are mandatory");
            setLoading(false);
            return;
        }

        try {
            await axios.post("/patient/login", {
                email: user.email,
                password: user.password
            });
            alert("Login Successful");
            setUser({
                email: "",
                password: ""
            });
            navigate("/");
        } catch (e) {
            alert("Login Failed")
            setUser({
                email: "",
                password: ""
            });
        }
    }

    return (
        <div className="flex justify-around">
            <div className={`border rounded-xl p-7 shadow-md w-full sm:w-96 mx-6 mt-40 max-h-fit min-w-80`}>
                <h1 className="text-3xl text-center ">Login</h1>
                <form className="flex flex-col mt-7" onSubmit={(e) => loginUser(e)}>
                    <input type="email"
                        placeholder="your@email.com"
                        className="border rounded-2xl py-2 px-3"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                    <input type="password"
                        placeholder="password"
                        className="border rounded-2xl py-2 px-3 mt-3"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <Link to="/" className="ps-2 mt-1 text-gray-500 hover:text-black hover:underline max-w-fit">
                        Forgot password?
                    </Link>

                    <button className={`border bg-primary text-white rounded-2xl p-1 mt-5 mb-1 hover:shadow-md`}>Login</button>

                    <div className="text-center text-gray-500">
                        Don't have an account? <Link to="/register" className="text-black underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;