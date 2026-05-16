import { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import API_BASE from "../services/api";

function Login() {

    // =====================================
    // STATES
    // =====================================

    const [roll, setRoll] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =====================================
    // LOGIN
    // =====================================

    const handleLogin = async () => {

        try {

            setLoading(true);

            setMessage("");

            const res = await fetch(

                `${API_BASE}/login`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        roll_no: roll,

                        password: password

                    })
                }
            );

            const data = await res.json();

            // ============================
            // SUCCESS
            // ============================

            if (data.success) {

                // SAVE LOGIN

                localStorage.setItem(

                    "roll_no",

                    data.roll_no
                );

                localStorage.setItem(

                    "role",

                    data.role
                );

                // ======================
                // FIRST LOGIN
                // ======================

                if (data.first_login) {

                    window.location.href =
                        "/#/change-password";
                }

                // ======================
                // NORMAL LOGIN
                // ======================

                else {

                    window.location.href =
                        "/#/dashboard";
                }

            }

            // ============================
            // FAILED LOGIN
            // ============================

            else {

                setMessage(

                    data.message ||

                    "Invalid credentials"
                );
            }

        }

        catch (err) {

            console.error(err);

            setMessage(

                "Server error. Try again."
            );
        }

        finally {

            setLoading(false);
        }
    };

    // =====================================
    // ENTER KEY LOGIN
    // =====================================

    const handleKeyPress = (e) => {

        if (e.key === "Enter") {

            handleLogin();
        }
    };

    // =====================================
    // UI
    // =====================================

    return (

        <div
            className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
            style={{
                background:
                    "linear-gradient(135deg, #020617, #0f172a, #111827)",
                fontFamily:
                    "'Poppins', sans-serif"
            }}
        >

            <div
                className="card border-0 shadow-lg p-5"
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    borderRadius: "32px",
                    background:
                        "rgba(15,23,42,0.92)",
                    backdropFilter:
                        "blur(20px)",
                    color: "white"
                }}
            >

                {/* LOGO */}

                <div className="text-center mb-4">

                    <div
                        style={{
                            width: "90px",
                            height: "90px",
                            borderRadius: "50%",
                            margin: "0 auto",
                            background:
                                "linear-gradient(to right, #3b82f6, #8b5cf6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "2rem",
                            fontWeight: "700",
                            boxShadow:
                                "0 20px 40px rgba(59,130,246,0.35)"
                        }}
                    >

                        🎓

                    </div>

                </div>

                {/* TITLE */}

                <h1
                    className="text-center mb-2"
                    style={{
                        fontWeight: "700",
                        fontSize: "2.5rem"
                    }}
                >

                    Welcome Back

                </h1>

                <p
                    className="text-center mb-5"
                    style={{
                        color: "#94a3b8"
                    }}
                >

                    Login to Student Analytics Portal

                </p>

                {/* ROLL INPUT */}

                <div className="mb-4">

                    <label
                        className="mb-2"
                        style={{
                            color: "#cbd5e1"
                        }}
                    >

                        Roll Number

                    </label>

                    <input
                        type="text"

                        className="form-control"

                        placeholder="Enter Roll Number"

                        value={roll}

                        onChange={(e) =>
                            setRoll(e.target.value)
                        }

                        onKeyDown={handleKeyPress}

                        style={{
                            background: "#0f172a",
                            border:
                                "1px solid rgba(255,255,255,0.08)",
                            color: "white",
                            padding: "14px",
                            borderRadius: "16px"
                        }}
                    />

                </div>

                {/* PASSWORD */}

                <div className="mb-3">

                    <label
                        className="mb-2"
                        style={{
                            color: "#cbd5e1"
                        }}
                    >

                        Password

                    </label>

                    <input
                        type="password"

                        className="form-control"

                        placeholder="Enter Password"

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                        onKeyDown={handleKeyPress}

                        style={{
                            background: "#0f172a",
                            border:
                                "1px solid rgba(255,255,255,0.08)",
                            color: "white",
                            padding: "14px",
                            borderRadius: "16px"
                        }}
                    />

                </div>

                {/* FORGOT PASSWORD */}

                <div className="text-end mb-4">

                    <button
                        className="btn btn-link p-0"
                        style={{
                            color: "#60a5fa",
                            textDecoration: "none"
                        }}
                        onClick={() => {

                            window.location.href =
                                "/#/forgot-password";
                        }}
                    >

                        Forgot Password?

                    </button>

                </div>

                {/* LOGIN BUTTON */}

                <button

                    className="btn w-100"

                    onClick={handleLogin}

                    disabled={loading}

                    style={{

                        background:
                            "linear-gradient(to right, #3b82f6, #8b5cf6)",

                        color: "white",

                        padding: "14px",

                        borderRadius: "18px",

                        fontWeight: "600",

                        border: "none",

                        fontSize: "1.05rem",

                        boxShadow:
                            "0 15px 35px rgba(59,130,246,0.25)"
                    }}
                >

                    {

                        loading

                            ?

                            "Logging In..."

                            :

                            "Login"
                    }

                </button>

                {/* ADMIN BUTTON */}

                <button

                    className="btn w-100 mt-3"

                    onClick={() => {

                        window.location.href =
                            "/#/admin-login";
                    }}

                    style={{

                        background:
                            "rgba(255,255,255,0.05)",

                        color: "white",

                        padding: "14px",

                        borderRadius: "18px",

                        fontWeight: "600",

                        border:
                            "1px solid rgba(255,255,255,0.08)"
                    }}
                >

                    Admin Login

                </button>

                {/* MESSAGE */}

                {

                    message && (

                        <div
                            className="mt-4 text-center"
                            style={{
                                color: "#f87171",
                                fontWeight: "500"
                            }}
                        >

                            {message}

                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default Login;