
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";

function Settings() {

    // =====================================
    // NAVIGATION
    // =====================================

    const navigate = useNavigate();

    // =====================================
    // USER
    // =====================================

    const rollNo =
        localStorage.getItem("roll_no");

    // =====================================
    // STATES
    // =====================================

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [oldPassword, setOldPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [verified, setVerified] =
        useState(false);

    // =====================================
    // UI ACTIONS
    // =====================================

    const handleSendOTP = () => {

        if (!email) {

            toast.error(
                "Enter Email"
            );

            return;
        }

        toast.success(
            "OTP Sent Successfully"
        );
    };

    const handleVerifyOTP = () => {

        if (!otp) {

            toast.error(
                "Enter OTP"
            );

            return;
        }

        setVerified(true);

        toast.success(
            "Email Verified"
        );
    };

    const handlePasswordChange = () => {

        if (
            !oldPassword
            ||
            !newPassword
            ||
            !confirmPassword
        ) {

            toast.error(
                "Fill all fields"
            );

            return;
        }

        if (
            newPassword !== confirmPassword
        ) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }

        toast.success(
            "Password Updated"
        );
    };

    // =====================================
    // STYLES
    // =====================================

    const glassCard = {

        background:
            "rgba(255,255,255,0.05)",

        border:
            "1px solid rgba(255,255,255,0.08)",

        borderRadius: "30px",

        backdropFilter: "blur(20px)",

        boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)"
    };

    // =====================================
    // UI
    // =====================================

    return (

        <div

            className="container-fluid min-vh-100 text-white"

            style={{

                background:
                    "linear-gradient(135deg,#020617,#0f172a,#111827)",

                fontFamily:
                    "'Poppins', sans-serif"
            }}
        >

            <div className="row min-vh-100">

                {/* SIDEBAR */}

                <div

                    className="col-lg-2 col-md-3 p-4"

                    style={{

                        background:
                            "rgba(15,23,42,0.96)",

                        borderRight:
                            "1px solid rgba(255,255,255,0.08)"
                    }}
                >

                    <div className="mb-5">

                        <h1
                            style={{
                                fontWeight: "700",
                                fontSize: "2.5rem"
                            }}
                        >

                            🎓 Portal

                        </h1>

                        <p
                            style={{
                                color: "#94a3b8"
                            }}
                        >

                            Account Center

                        </p>

                        <div
                            className="mt-3"
                            style={{
                                height: "2px",
                                background:
                                    "linear-gradient(to right,#3b82f6,#8b5cf6)"
                            }}
                        />

                    </div>

                    {/* MENU */}

                    <div className="d-grid gap-3">

                        <button

                            className="btn text-start text-white py-3"

                            onClick={() =>
                                navigate("/dashboard")
                            }

                            style={{

                                borderRadius: "18px",

                                background:
                                    "rgba(255,255,255,0.05)",

                                border:
                                    "1px solid rgba(255,255,255,0.08)"
                            }}
                        >

                            📊 Dashboard

                        </button>

                        <button

                            className="btn text-start fw-semibold py-3"

                            style={{

                                borderRadius: "18px",

                                background:
                                    "linear-gradient(to right,#ffffff,#dbeafe)",

                                color: "#111827",

                                border: "none"
                            }}
                        >

                            ⚙️ Settings

                        </button>

                    </div>

                    {/* PROFILE */}

                    <div
                        className="mt-5 p-4"
                        style={glassCard}
                    >

                        <div className="text-center">

                            <div

                                className="mx-auto mb-4"

                                style={{

                                    width: "90px",

                                    height: "90px",

                                    borderRadius: "50%",

                                    background:
                                        "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    fontSize: "2rem",

                                    fontWeight: "700"
                                }}
                            >

                                S

                            </div>

                            <h4>

                                Student

                            </h4>

                            <p
                                style={{
                                    color: "#94a3b8"
                                }}
                            >

                                {rollNo}

                            </p>

                            <span
                                className="badge"
                                style={{
                                    background:

                                        verified

                                        ?

                                        "rgba(34,197,94,0.18)"

                                        :

                                        "rgba(239,68,68,0.18)",

                                    color:

                                        verified

                                        ?

                                        "#4ade80"

                                        :

                                        "#f87171",

                                    padding:
                                        "10px 16px",

                                    borderRadius:
                                        "20px"
                                }}
                            >

                                {

                                    verified

                                    ?

                                    "✅ Verified"

                                    :

                                    "⚠️ Not Verified"
                                }

                            </span>

                        </div>

                    </div>

                </div>

                {/* MAIN */}

                <div className="col-lg-10 col-md-9 p-5">

                    {/* HEADER */}

                    <div className="mb-5">

                        <h1
                            style={{
                                fontSize: "4rem",
                                fontWeight: "700"
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

                                ⚙️ Account Settings

                            </span>

                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.1rem"
                            }}
                        >

                            Manage your account,
                            recovery options and security.

                        </p>

                    </div>

                    {/* ACCOUNT INFO */}

                    <div
                        className="p-5 mb-5"
                        style={glassCard}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h2>

                                    👤 Account Information

                                </h2>

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Student account details

                                </p>

                            </div>

                            <div>

                                <span
                                    className="badge"
                                    style={{
                                        background:
                                            "rgba(59,130,246,0.18)",
                                        color:
                                            "#93c5fd",
                                        padding:
                                            "10px 16px",
                                        borderRadius:
                                            "20px"
                                    }}
                                >

                                    Active Account

                                </span>

                            </div>

                        </div>

                        <div className="row g-4">

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.03)",
                                        borderRadius:
                                            "24px"
                                    }}
                                >

                                    <h6>

                                        Roll Number

                                    </h6>

                                    <h3 className="mt-3">

                                        {rollNo}

                                    </h3>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.03)",
                                        borderRadius:
                                            "24px"
                                    }}
                                >

                                    <h6>

                                        Recovery Email

                                    </h6>

                                    <h5 className="mt-3">

                                        {

                                            email

                                            ?

                                            email

                                            :

                                            "Not Added"
                                        }

                                    </h5>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.03)",
                                        borderRadius:
                                            "24px"
                                    }}
                                >

                                    <h6>

                                        Verification

                                    </h6>

                                    <h5 className="mt-3">

                                        {

                                            verified

                                            ?

                                            "Verified"

                                            :

                                            "Pending"
                                        }

                                    </h5>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* EMAIL VERIFICATION */}

                    <div
                        className="p-5 mb-5"
                        style={glassCard}
                    >

                        <h2 className="mb-4">

                            ✉️ Verify Recovery Email

                        </h2>

                        <div className="row g-4">

                            <div className="col-md-6">

                                <input

                                    type="email"

                                    placeholder="Enter Recovery Email"

                                    value={email}

                                    onChange={(e) =>

                                        setEmail(
                                            e.target.value
                                        )
                                    }

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
                                            "16px"
                                    }}
                                />

                            </div>

                            <div className="col-md-6">

                                <button

                                    className="btn w-100"

                                    onClick={handleSendOTP}

                                    style={{

                                        background:
                                            "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                        color:
                                            "white",

                                        borderRadius:
                                            "18px",

                                        padding:
                                            "16px",

                                        border:
                                            "none"
                                    }}
                                >

                                    Send OTP

                                </button>

                            </div>

                            <div className="col-md-6">

                                <input

                                    type="text"

                                    placeholder="Enter OTP"

                                    value={otp}

                                    onChange={(e) =>

                                        setOtp(
                                            e.target.value
                                        )
                                    }

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
                                            "16px"
                                    }}
                                />

                            </div>

                            <div className="col-md-6">

                                <button

                                    className="btn w-100"

                                    onClick={handleVerifyOTP}

                                    style={{

                                        background:
                                            "linear-gradient(to right,#22c55e,#16a34a)",

                                        color:
                                            "white",

                                        borderRadius:
                                            "18px",

                                        padding:
                                            "16px",

                                        border:
                                            "none"
                                    }}
                                >

                                    Verify OTP

                                </button>

                            </div>

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div
                        className="p-5 mb-5"
                        style={glassCard}
                    >

                        <h2 className="mb-4">

                            🔐 Security & Password

                        </h2>

                        <div className="row g-4">

                            <div className="col-md-4">

                                <input

                                    type="password"

                                    placeholder="Old Password"

                                    value={oldPassword}

                                    onChange={(e) =>

                                        setOldPassword(
                                            e.target.value
                                        )
                                    }

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
                                            "16px"
                                    }}
                                />

                            </div>

                            <div className="col-md-4">

                                <input

                                    type="password"

                                    placeholder="New Password"

                                    value={newPassword}

                                    onChange={(e) =>

                                        setNewPassword(
                                            e.target.value
                                        )
                                    }

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
                                            "16px"
                                    }}
                                />

                            </div>

                            <div className="col-md-4">

                                <input

                                    type="password"

                                    placeholder="Confirm Password"

                                    value={confirmPassword}

                                    onChange={(e) =>

                                        setConfirmPassword(
                                            e.target.value
                                        )
                                    }

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
                                            "16px"
                                    }}
                                />

                            </div>

                        </div>

                        <button

                            className="btn mt-4"

                            onClick={handlePasswordChange}

                            style={{

                                background:
                                    "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                color:
                                    "white",

                                borderRadius:
                                    "18px",

                                padding:
                                    "14px 28px",

                                border:
                                    "none"
                            }}
                        >

                            Update Password

                        </button>

                    </div>

                    {/* FOOTER */}

                    <div
                        className="text-center mt-5"
                        style={{
                            color: "#64748b",
                            fontSize: "0.95rem"
                        }}
                    >

                        Made by Shyam 🚀

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Settings;