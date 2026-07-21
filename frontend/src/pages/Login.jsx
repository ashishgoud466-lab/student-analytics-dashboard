import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE from "../services/api";

function Login() {

    // =====================================
    // STATES
    // =====================================

    const [roll, setRoll] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // =====================================
    // LOGIN
    // =====================================

    const handleLogin = async () => {

        if (!roll.trim()) {
            setMessage("Please enter your roll number");
            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const res = await fetch(
                `${API_BASE}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        roll_no: roll.trim()
                    })
                }
            );

            const data = await res.json();

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
                    data.year || "2"
                );

                localStorage.setItem(
                    "sem_id",
                    data.sem_id || "2"
                );

                localStorage.setItem(
                    "email",
                    data.email || ""
                );

                localStorage.setItem(
                    "role",
                    data.role || "student"
                );

                window.location.href = "/#/dashboard";

            } else {

                setMessage(
                    data.message || "Invalid roll number"
                );
            }

        } catch (err) {

            console.error(err);

            setMessage(
                "Unable to connect to the server"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================
    // ENTER KEY
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
            className="container-fluid min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg,#020617,#0f172a,#111827)",

                fontFamily:
                    "'Poppins', sans-serif",

                overflowX: "hidden"
            }}
        >

            <div className="row min-vh-100">


                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <div
                    className="
                        col-lg-6
                        d-none
                        d-lg-flex
                        flex-column
                        justify-content-center
                        p-5
                    "
                    style={{
                        position: "relative"
                    }}
                >

                    <div
                        style={{
                            maxWidth: "620px"
                        }}
                    >


                        {/* LOGO */}

                        <div
                            className="mb-4"
                            style={{
                                width: "120px",

                                height: "120px",

                                borderRadius: "32px",

                                background:
                                    "linear-gradient(135deg,#3b82f6,#8b5cf6)",

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


                        {/* TITLE */}

                        <h1
                            className="mt-5"
                            style={{
                                fontSize: "4.5rem",

                                fontWeight: "800",

                                lineHeight: "1.15",

                                letterSpacing: "-1px"
                            }}
                        >

                            <span
                                style={{
                                    background:
                                        "linear-gradient(to right,#38bdf8,#8b5cf6)",

                                    WebkitBackgroundClip: "text",

                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                Student Analytics
                                <br />
                                Portal
                            </span>

                        </h1>


                        {/* DESCRIPTION */}

                        <p
                            className="mt-4"
                            style={{
                                color: "#a5b4c8",

                                fontSize: "1.15rem",

                                lineHeight: "2"
                            }}
                        >
                            A modern academic analytics platform
                            for monitoring grades, SGPA trends,
                            semester performance and academic
                            insights.
                        </p>


                        {/* UNIVERSITY CARD */}

                        <div
                            className="mt-5 p-4"
                            style={{
                                background:
                                    "rgba(30,41,59,0.72)",

                                border:
                                    "1px solid rgba(148,163,184,0.14)",

                                borderRadius: "28px",

                                backdropFilter: "blur(20px)",

                                boxShadow:
                                    "0 18px 50px rgba(0,0,0,0.18)"
                            }}
                        >

                            <h4
                                style={{
                                    color: "#60a5fa",

                                    fontWeight: "700",

                                    marginBottom: "0"
                                }}
                            >
                                🏛️ JNTUH Hyderabad
                            </h4>


                            <p
                                className="mt-3"
                                style={{
                                    color: "#d1d9e6",

                                    lineHeight: "1.8",

                                    marginBottom: "0"
                                }}
                            >
                                Jawaharlal Nehru Technological
                                University Hyderabad

                                <br />
                                <br />

                                Student dashboard with performance
                                analytics, grade tracking, semester
                                insights and academic management.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <div
                    className="
                        col-lg-6
                        d-flex
                        justify-content-center
                        align-items-center
                        p-4
                    "
                >


                    {/* LOGIN CARD */}

                    <div
                        className="p-5"
                        style={{
                            width: "100%",

                            maxWidth: "500px",

                            background:
                                "rgba(15,23,42,0.94)",

                            border:
                                "1px solid rgba(148,163,184,0.14)",

                            borderRadius: "36px",

                            backdropFilter: "blur(20px)",

                            boxShadow:
                                "0 25px 70px rgba(0,0,0,0.38)",

                            color: "#f8fafc"
                        }}
                    >


                        {/* MOBILE TITLE */}

                        <div
                            className="
                                d-lg-none
                                text-center
                                mb-5
                            "
                        >

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
                            className="mb-3"
                            style={{
                                fontWeight: "800",

                                fontSize: "3rem",

                                color: "#f8fafc",

                                letterSpacing: "-1px"
                            }}
                        >
                            Welcome Back 👋
                        </h1>


                        <p
                            className="mb-5"
                            style={{
                                color: "#94a3b8",

                                fontSize: "1.05rem",

                                lineHeight: "1.7"
                            }}
                        >
                            Enter your roll number to continue
                            to your student dashboard.
                        </p>


                        {/* ================================= */}
                        {/* ROLL NUMBER */}
                        {/* ================================= */}

                        <div className="mb-4 text-center">

                            <label
                                className="mb-3 d-block"
                                style={{
                                    color: "#cbd5e1",

                                    fontWeight: "600",

                                    fontSize: "1rem"
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

                                autoComplete="username"

                                className="form-control"

                                style={{
                                    background: "#111c31",

                                    color: "#f8fafc",

                                    border:
                                        "1px solid rgba(96,165,250,0.25)",

                                    borderRadius: "18px",

                                    padding: "17px 20px",

                                    fontSize: "1.05rem",

                                    textAlign: "center",

                                    outline: "none",

                                    boxShadow:
                                        "inset 0 1px 3px rgba(0,0,0,0.15)"
                                }}
                            />

                        </div>


                        {/* ================================= */}
                        {/* LOGIN BUTTON */}
                        {/* ================================= */}

                        <button
                            className="btn w-100"

                            onClick={handleLogin}

                            disabled={
                                loading ||
                                !roll.trim()
                            }

                            style={{
                                background:
                                    "linear-gradient(to right,#3b82f6,#7c3aed)",

                                color: "#ffffff",

                                padding: "16px",

                                borderRadius: "20px",

                                fontWeight: "700",

                                fontSize: "1.05rem",

                                border: "none",

                                boxShadow:
                                    "0 10px 30px rgba(59,130,246,0.25)"
                            }}
                        >

                            {
                                loading
                                    ? "Logging In..."
                                    : "Login"
                            }

                        </button>


                        {/* ================================= */}
                        {/* ERROR MESSAGE */}
                        {/* ================================= */}

                        {message && (

                            <div
                                className="
                                    mt-4
                                    text-center
                                "

                                style={{
                                    color: "#f87171",

                                    fontWeight: "600",

                                    background:
                                        "rgba(239,68,68,0.08)",

                                    border:
                                        "1px solid rgba(239,68,68,0.15)",

                                    borderRadius: "14px",

                                    padding: "12px"
                                }}
                            >
                                {message}
                            </div>

                        )}


                        {/* ================================= */}
                        {/* LOGIN INFO */}
                        {/* ================================= */}

                        <div
                            className="
                                mt-4
                                p-3
                                text-center
                            "

                            style={{
                                background:
                                    "rgba(59,130,246,0.08)",

                                border:
                                    "1px solid rgba(59,130,246,0.18)",

                                borderRadius: "18px",

                                color: "#93c5fd",

                                fontSize: "0.9rem"
                            }}
                        >
                            🔐 Student access using your
                            registered roll number
                        </div>


                        {/* ================================= */}
                        {/* FOOTER */}
                        {/* ================================= */}

                        <div
                            className="
                                text-center
                                mt-5
                            "

                            style={{
                                color: "#64748b",

                                fontSize: "0.9rem"
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