import { useState } from "react";

import API_BASE from "../services/api";

function Login() {

    const [roll, setRoll] = useState("");

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async () => {

        const res = await fetch(`${API_BASE}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                roll_no: roll,
                password: password
            })

        });

        const data = await res.json();

        if (data.success) {

    // =====================================
    // FIRST LOGIN
    // =====================================

    if (data.first_login) {

        window.location.href =
            "/#/change-password";

    }

    // =====================================
    // NORMAL LOGIN
    // =====================================

    else {

        window.location.href =
            `/#/student/${data.roll_no}`;
    }

} else {

    setMessage("Invalid credentials");
}
    // ==========================================
    // REGISTER
    // ==========================================

    const handleRegister = async () => {

        const res = await fetch(`${API_BASE}/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                roll_no: roll,
                password: password
            })

        });

        const data = await res.json();

        if (data.success) {

            setMessage("Registration successful");

        } else {

            setMessage(data.message);
        }
    };

    return (

        <div className="container mt-5">

            <div
                className="card shadow p-4 mx-auto"
                style={{ maxWidth: "400px" }}
            >

                <h2 className="text-center mb-4">
                    Student Login
                </h2>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Roll Number"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-dark mb-2"
                    onClick={handleLogin}
                >

                    Login

                </button>

                <button
                    className="btn btn-secondary"
                    onClick={handleRegister}
                >

                    Register

                </button>

                {

                    message &&

                    <p className="mt-3 text-center">

                        {message}

                    </p>
                }

            </div>

        </div>
    );
}

export default Login;