import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import API_BASE from "../services/api";

function Dashboard() {

    // =========================================
    // STATES
    // =========================================

    const [selectedSem, setSelectedSem] =
        useState(1);

    const [subjects, setSubjects] =
        useState([]);

    // =========================================
    // FETCH SUBJECTS
    // =========================================

    useEffect(() => {

        fetch(
            `${API_BASE}/semester/${selectedSem}`
        )

            .then((res) => res.json())

            .then((data) => {

                setSubjects(data);

            })

            .catch((err) => {

                console.error(err);

            });

    }, [selectedSem]);

    // =========================================
    // CALCULATIONS
    // =========================================

    const totalCredits = subjects.reduce(

        (sum, sub) =>

            sum + Number(sub.Credits || 0),

        0
    );

    const averageGP = subjects.length > 0

        ?

        (
            subjects.reduce(

                (sum, sub) =>

                    sum +
                    Number(sub.Grade_point || 0),

                0

            ) / subjects.length

        ).toFixed(2)

        :

        0;

    const highestGP = subjects.length > 0

        ?

        Math.max(

            ...subjects.map(

                (s) => Number(s.Grade_point || 0)
            )
        )

        :

        0;

    // =========================================
    // UI
    // =========================================

    return (

        <div
            className="container-fluid min-vh-100 text-white"
            style={{
                background:
                    "linear-gradient(135deg, #020617, #0f172a, #111827)",
                fontFamily:
                    "'Poppins', sans-serif"
            }}
        >

            <div className="row min-vh-100">

                {/* ================================= */}
                {/* SIDEBAR */}
                {/* ================================= */}

                <div
                    className="col-lg-2 col-md-3 p-4"
                    style={{
                        background:
                            "rgba(15, 23, 42, 0.95)",
                        borderRight:
                            "1px solid rgba(255,255,255,0.08)",
                        backdropFilter:
                            "blur(20px)"
                    }}
                >

                    <div className="mb-5">

                        <h1
                            style={{
                                fontWeight: "700",
                                fontSize: "2.3rem",
                                letterSpacing: "-1px"
                            }}
                        >

                            🎓 Portal

                        </h1>

                        <p
                            className="mt-2"
                            style={{
                                color: "#94a3b8",
                                fontSize: "0.95rem"
                            }}
                        >

                            Student Analytics Dashboard

                        </p>

                    </div>

                    {/* MENU */}

                    <div className="d-grid gap-3">

                        <button
                            className="btn text-start fw-semibold py-3"
                            style={{
                                borderRadius: "18px",
                                background:
                                    "linear-gradient(to right, #ffffff, #dbeafe)",
                                color: "#111827",
                                border: "none",
                                boxShadow:
                                    "0 10px 30px rgba(255,255,255,0.1)"
                            }}
                        >

                            📊 Dashboard

                        </button>

                        <button
                            className="btn text-start text-white py-3"
                            style={{
                                borderRadius: "18px",
                                background:
                                    "rgba(255,255,255,0.05)",
                                border:
                                    "1px solid rgba(255,255,255,0.08)"
                            }}
                        >

                            📚 Semesters

                        </button>

                        <button
                            className="btn text-start text-white py-3"
                            style={{
                                borderRadius: "18px",
                                background:
                                    "rgba(255,255,255,0.05)",
                                border:
                                    "1px solid rgba(255,255,255,0.08)"
                            }}
                        >

                            📈 Analytics

                        </button>

                        <button
                            className="btn text-start text-white py-3"
                            style={{
                                borderRadius: "18px",
                                background:
                                    "rgba(255,255,255,0.05)",
                                border:
                                    "1px solid rgba(255,255,255,0.08)"
                            }}
                        >

                            ⚙️ Settings

                        </button>

                    </div>

                    {/* PROFILE */}

                    <div
                        className="mt-5 p-3"
                        style={{
                            background:
                                "rgba(255,255,255,0.05)",
                            borderRadius: "24px",
                            border:
                                "1px solid rgba(255,255,255,0.08)"
                        }}
                    >

                        <div className="d-flex align-items-center gap-3">

                            <div
                                style={{
                                    height: "60px",
                                    width: "60px",
                                    borderRadius: "50%",
                                    background:
                                        "linear-gradient(to right, #3b82f6, #8b5cf6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    fontSize: "1.5rem",
                                    boxShadow:
                                        "0 10px 30px rgba(59,130,246,0.3)"
                                }}
                            >

                                S

                            </div>

                            <div>

                                <h6
                                    className="mb-1"
                                    style={{
                                        fontWeight: "600"
                                    }}
                                >

                                    Shyam Goud

                                </h6>

                                <small
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    24011M2104

                                </small>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================================= */}
                {/* MAIN */}
                {/* ================================= */}

                <div className="col-lg-10 col-md-9 p-5">

                    {/* TOP */}

                    <div className="mb-5">

                        <h1
                            style={{
                                fontSize: "4rem",
                                fontWeight: "700",
                                letterSpacing: "-2px"
                            }}
                        >

                            Welcome Back 👋

                        </h1>

                        <p
                            className="mt-3"
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.1rem"
                            }}
                        >

                            Monitor semester performance,
                            analytics and subject insights.

                        </p>

                    </div>

                    {/* ================================= */}
                    {/* STATS */}
                    {/* ================================= */}

                    <div className="row g-4 mb-5">

                        {/* CARD */}

                        <div className="col-xl-3 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={{
                                    borderRadius: "30px",
                                    background:
                                        "rgba(255,255,255,0.05)",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter:
                                        "blur(20px)",
                                    boxShadow:
                                        "0 20px 40px rgba(0,0,0,0.3)"
                                }}
                            >

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Average GP

                                </p>

                                <h1
                                    style={{
                                        fontSize: "3.5rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {averageGP}

                                </h1>

                            </div>

                        </div>

                        {/* CARD */}

                        <div className="col-xl-3 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={{
                                    borderRadius: "30px",
                                    background:
                                        "rgba(255,255,255,0.05)",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter:
                                        "blur(20px)"
                                }}
                            >

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Highest GP

                                </p>

                                <h1
                                    style={{
                                        fontSize: "3.5rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {highestGP}

                                </h1>

                            </div>

                        </div>

                        {/* CARD */}

                        <div className="col-xl-3 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={{
                                    borderRadius: "30px",
                                    background:
                                        "rgba(255,255,255,0.05)",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)"
                                }}
                            >

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Subjects

                                </p>

                                <h1
                                    style={{
                                        fontSize: "3.5rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {subjects.length}

                                </h1>

                            </div>

                        </div>

                        {/* CARD */}

                        <div className="col-xl-3 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={{
                                    borderRadius: "30px",
                                    background:
                                        "rgba(255,255,255,0.05)",
                                    border:
                                        "1px solid rgba(255,255,255,0.08)"
                                }}
                            >

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Total Credits

                                </p>

                                <h1
                                    style={{
                                        fontSize: "3.5rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {totalCredits}

                                </h1>

                            </div>

                        </div>

                    </div>

                    {/* ================================= */}
                    {/* GRAPH */}
                    {/* ================================= */}

                    <div
                        className="p-5 mb-5"
                        style={{
                            borderRadius: "30px",
                            background:
                                "rgba(255,255,255,0.05)",
                            border:
                                "1px solid rgba(255,255,255,0.08)"
                        }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-5">

                            <div>

                                <h2
                                    style={{
                                        fontWeight: "700"
                                    }}
                                >

                                    Semester Performance

                                </h2>

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    SGPA trend visualization

                                </p>

                            </div>

                        </div>

                        {/* BAR GRAPH */}

                        <div
                            className="d-flex align-items-end gap-4"
                            style={{
                                height: "250px"
                            }}
                        >

                            {[70, 85, 90, 100].map(
                                (height, index) => (

                                    <div
                                        key={index}
                                        className="flex-fill text-center"
                                    >

                                        <div
                                            style={{
                                                height:
                                                    `${height}%`,
                                                borderRadius:
                                                    "20px 20px 0 0",
                                                background:
                                                    "linear-gradient(to top, #3b82f6, #8b5cf6)",
                                                boxShadow:
                                                    "0 20px 40px rgba(59,130,246,0.25)"
                                            }}
                                        />

                                        <p
                                            className="mt-3"
                                            style={{
                                                color:
                                                    "#94a3b8"
                                            }}
                                        >

                                            Sem {index + 1}

                                        </p>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* ================================= */}
                    {/* SEMESTER BUTTONS */}
                    {/* ================================= */}

                    <div
                        className="p-4 mb-5"
                        style={{
                            borderRadius: "30px",
                            background:
                                "rgba(255,255,255,0.05)",
                            border:
                                "1px solid rgba(255,255,255,0.08)"
                        }}
                    >

                        <div className="d-flex gap-3 flex-wrap">

                            {[1,2,3,4].map((sem) => (

                                <button
                                    key={sem}
                                    className="btn"
                                    onClick={() =>
                                        setSelectedSem(sem)
                                    }
                                    style={{

                                        borderRadius:
                                            "18px",

                                        padding:
                                            "14px 28px",

                                        fontWeight:
                                            "600",

                                        background:

                                            selectedSem === sem

                                                ?

                                                "linear-gradient(to right, #3b82f6, #8b5cf6)"

                                                :

                                                "rgba(255,255,255,0.05)",

                                        color: "white",

                                        border:
                                            "1px solid rgba(255,255,255,0.08)"
                                    }}
                                >

                                    Semester {sem}

                                </button>

                            ))}

                        </div>

                    </div>

                    {/* ================================= */}
                    {/* SUBJECT TABLE */}
                    {/* ================================= */}

                    <div
                        className="p-4"
                        style={{
                            borderRadius: "30px",
                            background:
                                "rgba(255,255,255,0.05)",
                            border:
                                "1px solid rgba(255,255,255,0.08)"
                        }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h2
                                    style={{
                                        fontWeight: "700"
                                    }}
                                >

                                    Semester {selectedSem} Subjects

                                </h2>

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Dynamic SQL-powered subjects

                                </p>

                            </div>

                            <button
                                className="btn"
                                style={{
                                    background:
                                        "linear-gradient(to right, #3b82f6, #8b5cf6)",
                                    color: "white",
                                    borderRadius: "18px",
                                    padding:
                                        "12px 24px",
                                    fontWeight: "600"
                                }}
                            >

                                Save Grades

                            </button>

                        </div>

                        {/* TABLE */}

                        <div className="table-responsive">

                            <table
                                className="table align-middle"
                                style={{
                                    color: "white"
                                }}
                            >

                                <thead>

                                    <tr
                                        style={{
                                            borderColor:
                                                "rgba(255,255,255,0.08)"
                                        }}
                                    >

                                        <th>CID</th>

                                        <th>Subject</th>

                                        <th>Credits</th>

                                        <th>Grade Point</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {subjects.map(
                                        (sub, index) => (

                                            <tr
                                                key={index}
                                                style={{
                                                    borderColor:
                                                        "rgba(255,255,255,0.05)"
                                                }}
                                            >

                                                <td>

                                                    {sub.Cid}

                                                </td>

                                                <td>

                                                    {sub.Course_name}

                                                </td>

                                                <td>

                                                    {sub.Credits}

                                                </td>

                                                <td>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        defaultValue={
                                                            sub.Grade_point || ""
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
                                                                "14px"
                                                        }}
                                                    />

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;