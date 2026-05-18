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

        const data =
            await res.json();
console.log(data);
        if (data.success) {

            localStorage.setItem(
                "roll_no",
                data.roll_no || ""
            );

            localStorage.setItem(
                "student_name",
                data.name || ""
            );

            localStorage.setItem(
                "branch",
                data.branch || ""
            );

            localStorage.setItem(
                "programme",
                data.programme || ""
            );

            localStorage.setItem(
                "year",
                data.year || "1"
            );

            localStorage.setItem(
                "sem_id",
                data.sem_id || "1"
            );

            localStorage.setItem(
                "email",
                data.email || ""
            );

            localStorage.setItem(
                "role",
                data.role || ""
            );

            window.location.href =
                "/#/dashboard";
        }

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
            "Server error"
        );
    }

    finally {

        setLoading(false);
    }
};


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

            className="container-fluid min-vh-100"

            style={{

                background:
                    "linear-gradient(135deg,#020617,#0f172a,#111827)",

                fontFamily:
                    "'Poppins', sans-serif",

                overflow: "hidden"
            }}
        >

            <div className="row min-vh-100">

                {/* LEFT SIDE */}

                <div

                    className="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5"

                    style={{
                        position: "relative"
                    }}
                >

                    <div
                        style={{
                            maxWidth: "600px"
                        }}
                    >

                        <div
                            className="mb-4"
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "32px",
                                background:
                                    "linear-gradient(to right,#3b82f6,#8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "4rem",
                                boxShadow:
                                    "0 25px 60px rgba(59,130,246,0.35)"
                            }}
                        >

                            🎓

                        </div>

                        <h1
                            className="mt-5"
                            style={{
                                fontSize: "4.5rem",
                                fontWeight: "800",
                                lineHeight: "1.1"
                            }}
                        >

                            <span
                                style={{
                                    background:
                                        "linear-gradient(to right,#38bdf8,#8b5cf6)",
                                    WebkitBackgroundClip:
                                        "text",
                                    WebkitTextFillColor:
                                        "transparent"
                                }}
                            >

                                Student Analytics Portal

                            </span>

                        </h1>

                        <p
                            className="mt-4"
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.2rem",
                                lineHeight: "2"
                            }}
                        >

                            A modern academic analytics platform
                            for monitoring grades, SGPA trends,
                            semester performance and academic insights.

                        </p>

                        <div
                            className="mt-5 p-4"
                            style={{
                                background:
                                    "rgba(255,255,255,0.05)",
                                border:
                                    "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "28px",
                                backdropFilter:
                                    "blur(20px)"
                            }}
                        >

                            <h4>

                                🏛️ JNTUH Hyderabad

                            </h4>

                            <p
                                className="mt-3"
                                style={{
                                    color: "#cbd5e1",
                                    lineHeight: "1.8"
                                }}
                            >

                                Jawaharlal Nehru Technological University Hyderabad

                                <br /><br />

                                Secure student dashboard with
                                performance analytics,
                                grade tracking,
                                semester insights and
                                academic management.

                            </p>

                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div

                    className="col-lg-6 d-flex justify-content-center align-items-center p-4"

                >

                    <div

                        className="p-5"

                        style={{

                            width: "100%",

                            maxWidth: "480px",

                            background:
                                "rgba(15,23,42,0.92)",

                            border:
                                "1px solid rgba(255,255,255,0.08)",

                            borderRadius: "36px",

                            backdropFilter:
                                "blur(20px)",

                            boxShadow:
                                "0 25px 60px rgba(0,0,0,0.35)",

                            color: "white"
                        }}
                    >

                        {/* MOBILE TITLE */}

                        <div className="d-lg-none text-center mb-5">

                            <h1
                                style={{
                                    fontWeight: "800"
                                }}
                            >

                                🎓 Student Portal

                            </h1>

                            <p
                                style={{
                                    color: "#94a3b8"
                                }}
                            >

                                JNTUH Hyderabad

                            </p>

                        </div>

                        {/* LOGIN TITLE */}

                        <h1
                            className="mb-2"
                            style={{
                                fontWeight: "700",
                                fontSize: "3rem"
                            }}
                        >

                            Welcome Back 👋

                        </h1>

                        <p
                            className="mb-5"
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.05rem"
                            }}
                        >

                            Login to continue to your student dashboard

                        </p>

                        {/* ROLL */}

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

                                placeholder="Enter Roll Number"

                                value={roll}

                                onChange={(e) =>
                                    setRoll(e.target.value)
                                }

                                onKeyDown={handleKeyPress}

                                className="form-control"

                                style={{

                                    background:
                                        "#0f172a",

                                    color:
                                        "white",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "18px",

                                    padding:
                                        "16px",

                                    fontSize:
                                        "1rem"
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

                                placeholder="Enter Password"

                                value={password}

                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }

                                onKeyDown={handleKeyPress}

                                className="form-control"

                                style={{

                                    background:
                                        "#0f172a",

                                    color:
                                        "white",

                                    border:
                                        "1px solid rgba(255,255,255,0.08)",

                                    borderRadius:
                                        "18px",

                                    padding:
                                        "16px",

                                    fontSize:
                                        "1rem"
                                }}
                            />

                        </div>

                        {/* FORGOT */}

                        <div className="text-end mb-4">

                            <button

                                className="btn btn-link p-0"

                                style={{
                                    color: "#60a5fa",
                                    textDecoration:
                                        "none"
                                }}

                                onClick={() => {

                                    window.location.href =
                                        "/#/forgot-password";
                                }}
                            >

                                Forgot Password?

                            </button>

                        </div>

                        {/* LOGIN */}

                        <button

                            className="btn w-100"

                            onClick={handleLogin}

                            disabled={loading}

                            style={{

                                background:
                                    "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                color:
                                    "white",

                                padding:
                                    "16px",

                                borderRadius:
                                    "20px",

                                fontWeight:
                                    "700",

                                border:
                                    "none",

                            fontSize:
    "1.05rem",

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

{/* ADMIN */}

<button

    className="btn w-100 mt-3"

    onClick={() => {

        window.location.href =
            "/#/admin-login";
    }}

    style={{

        background:
            "rgba(255,255,255,0.05)",

        color:
            "white",

        padding:
            "16px",

        borderRadius:
            "20px",

        fontWeight:
            "600",

        border:
            "1px solid rgba(255,255,255,0.08)"
    }}
>

    Admin Login

</button>

{/* ERROR MESSAGE */}

{

    message && (

        <div

            className="mt-4 text-center"

            style={{

                color:
                    "#f87171",

                fontWeight:
                    "500"
            }}
        >

            {message}

        </div>
    )
}

{/* FOOTER */}

<div

    className="text-center mt-5"

    style={{

        color:
            "#64748b",

        fontSize:
            "0.9rem"
    }}
>

    Made by Shyam 🚀

</div>

</div>

</div>

</div>

</div>
);
}

export default Login;