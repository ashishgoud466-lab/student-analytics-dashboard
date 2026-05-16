import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import API_BASE from "../services/api";

function Dashboard() {

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

    const [selectedSem, setSelectedSem] =
        useState(1);

    const [subjects, setSubjects] =
        useState([]);

    const [grades, setGrades] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    // =====================================
    // LOGIN PROTECTION
    // =====================================

    useEffect(() => {

        if (!rollNo) {

            navigate("/");
        }

    }, [rollNo, navigate]);

    // =====================================
    // FETCH SUBJECTS
    // =====================================

    useEffect(() => {

        const fetchSubjects = async () => {

            try {

                setLoading(true);

                setMessage("");

                const response = await fetch(

                    `${API_BASE}/semester/${selectedSem}/${rollNo}`
                );

                if (!response.ok) {

                    throw new Error(
                        "Failed to fetch subjects"
                    );
                }

                const data =
                    await response.json();

                if (!Array.isArray(data)) {

                    setSubjects([]);

                    return;
                }

                setSubjects(data);

            }

            catch (err) {

                console.error(err);

                setMessage(
                    "Unable to load subjects"
                );
            }

            finally {

                setLoading(false);
            }
        };

        if (rollNo) {

            fetchSubjects();
        }

    }, [selectedSem, rollNo]);

    // =====================================
    // SAVE GRADES
    // =====================================

    const saveGrades = async () => {

        try {

            setSaving(true);

            for (const cid in grades) {

                await fetch(

                    `${API_BASE}/update-grade`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            roll_no: rollNo,

                            cid: cid,

                            grade_point:
                                Number(grades[cid])
                        })
                    }
                );
            }

            toast.success(
                "Grades Saved Successfully"
            );

        }

        catch (err) {

            console.error(err);

            toast.error(
                "Failed to Save Grades"
            );
        }

        finally {

            setSaving(false);
        }
    };

    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {

        localStorage.clear();

        navigate("/");
    };

    // =====================================
    // CALCULATIONS
    // =====================================

    const totalCredits = useMemo(() => {

        return subjects.reduce(

            (sum, sub) =>

                sum +

                Number(sub.Credits || 0),

            0
        );

    }, [subjects]);

    const averageGP = useMemo(() => {

        if (subjects.length === 0) {

            return 0;
        }

        const total = subjects.reduce(

            (sum, sub) => {

                return (

                    sum +

                    Number(

                        grades[sub.Cid]

                        ??

                        sub.Grade_point

                        ??

                        0
                    )
                );
            },

            0
        );

        return (
            total / subjects.length
        ).toFixed(2);

    }, [subjects, grades]);

    const highestGP = useMemo(() => {

        if (subjects.length === 0) {

            return 0;
        }

        return Math.max(

            ...subjects.map(

                (sub) =>

                    Number(

                        grades[sub.Cid]

                        ??

                        sub.Grade_point

                        ??

                        0
                    )
            )
        );

    }, [subjects, grades]);

    const lowestGP = useMemo(() => {

        if (subjects.length === 0) {

            return 0;
        }

        return Math.min(

            ...subjects.map(

                (sub) =>

                    Number(

                        grades[sub.Cid]

                        ??

                        sub.Grade_point

                        ??

                        0
                    )
            )
        );

    }, [subjects, grades]);

    const sgpa = useMemo(() => {

        if (
            subjects.length === 0
            ||
            totalCredits === 0
        ) {

            return 0;
        }

        const weightedTotal = subjects.reduce(

            (sum, sub) => {

                const gp = Number(

                    grades[sub.Cid]

                    ??

                    sub.Grade_point

                    ??

                    0
                );

                return (

                    sum +

                    gp *

                    Number(sub.Credits || 0)
                );
            },

            0
        );

        return (

            weightedTotal

            /

            totalCredits

        ).toFixed(2);

    }, [

        subjects,
        grades,
        totalCredits
    ]);

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

        transition: "0.3s ease",

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

                            Student Analytics

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

                            className="btn text-start fw-semibold py-3"

                            onClick={() =>
                                navigate("/dashboard")
                            }

                            style={{

                                borderRadius: "18px",

                                background:
                                    "linear-gradient(to right,#ffffff,#dbeafe)",

                                color: "#111827",

                                border: "none"
                            }}
                        >

                            📊 Dashboard

                        </button>

                        <button

                            className="btn text-start text-white py-3"

                            onClick={() =>
                                navigate("/analytics")
                            }

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

                            onClick={() =>
                                navigate("/settings")
                            }

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

                        <button

                            className="btn text-start text-danger py-3"

                            onClick={handleLogout}

                            style={{

                                borderRadius: "18px",

                                background:
                                    "rgba(239,68,68,0.08)",

                                border:
                                    "1px solid rgba(239,68,68,0.15)"
                            }}
                        >

                            🚪 Logout

                        </button>

                    </div>

                    {/* PROFILE */}

                    <div
                        className="mt-5 p-4"
                        style={glassCard}
                    >

                        <div className="d-flex align-items-center gap-3">

                            <div

                                style={{

                                    width: "65px",

                                    height: "65px",

                                    borderRadius: "50%",

                                    background:
                                        "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    fontSize: "1.6rem",

                                    fontWeight: "700"
                                }}
                            >

                                S

                            </div>

                            <div>

                                <h6>

                                    Student

                                </h6>

                                <small
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    {rollNo}

                                </small>

                            </div>

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

                            Welcome Back 👋

                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.1rem"
                            }}
                        >

                            Track your academic
                            performance and grades.

                        </p>

                    </div>

                    {/* STATS */}

                    <div className="row g-4 mb-5">

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={{
                                    ...glassCard,
                                    background:
                                        "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.18))"
                                }}
                            >

                                <p>SGPA</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {sgpa}

                                </h1>

                            </div>

                        </div>

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
                            >

                                <p>Highest</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {highestGP}

                                </h1>

                            </div>

                        </div>

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
                            >

                                <p>Lowest</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {lowestGP}

                                </h1>

                            </div>

                        </div>

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
                            >

                                <p>Average</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {averageGP}

                                </h1>

                            </div>

                        </div>

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
                            >

                                <p>Credits</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {totalCredits}

                                </h1>

                            </div>

                        </div>

                        <div className="col-xl-2 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
                            >

                                <p>Subjects</p>

                                <h1
                                    style={{
                                        fontSize: "2.8rem",
                                        fontWeight: "700"
                                    }}
                                >

                                    {subjects.length}

                                </h1>

                            </div>

                        </div>

                    </div>

                    {/* GRAPH */}

                    <div
                        className="p-5 mb-5"
                        style={glassCard}
                    >

                        <h2 className="mb-5">

                            📈 Semester Performance

                        </h2>

                        <div

                            className="d-flex align-items-end gap-4"

                            style={{
                                height: "320px"
                            }}
                        >

                            {

                                subjects.length === 0 && (

                                    <div className="w-100 text-center">

                                        No Performance Data

                                    </div>
                                )
                            }

                            {

                                subjects.map(

                                    (subject, index) => (

                                        <div
                                            key={index}
                                            className="flex-fill text-center"
                                        >

                                            <div

                                                style={{

                                                    height:

                                                        `${Number(

                                                            grades[subject.Cid]

                                                            ??

                                                            subject.Grade_point

                                                            ??

                                                            0

                                                        ) * 10}%`,

                                                    borderRadius:
                                                        "24px 24px 0 0",

                                                    background:
                                                        "linear-gradient(to top,#2563eb,#7c3aed,#c084fc)",

                                                    transition:
                                                        "0.5s ease",

                                                    boxShadow:
                                                        "0 10px 25px rgba(124,58,237,0.35)"
                                                }}
                                            />

                                            <p
                                                className="mt-3"
                                                style={{
                                                    color: "#cbd5e1"
                                                }}
                                            >

                                                {subject.Cid}

                                            </p>

                                        </div>
                                    )
                                )
                            }

                        </div>

                    </div>

                    {/* SEM BUTTONS */}

                    <div
                        className="p-4 mb-5"
                        style={glassCard}
                    >

                        <div className="d-flex gap-3 flex-wrap">

                            {

                                [1,2,3,4].map(

                                    (sem) => (

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

                                                background:

                                                    selectedSem === sem

                                                        ?

                                                        "linear-gradient(to right,#3b82f6,#8b5cf6)"

                                                        :

                                                        "rgba(255,255,255,0.05)",

                                                color: "white",

                                                border:
                                                    "1px solid rgba(255,255,255,0.08)"
                                            }}
                                        >

                                            Semester {sem}

                                        </button>
                                    )
                                )
                            }

                        </div>

                    </div>

                    {/* TABLE */}

                    <div
                        className="p-4"
                        style={glassCard}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h2>

                                    Semester {selectedSem}

                                </h2>

                                <p
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >

                                    Subject Grade Management

                                </p>

                            </div>

                            <button

                                className="btn"

                                onClick={saveGrades}

                                disabled={saving}

                                style={{

                                    background:
                                        "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                    color: "white",

                                    borderRadius: "18px",

                                    padding:
                                        "12px 24px",

                                    fontWeight: "600",

                                    border: "none",

                                    boxShadow:
                                        "0 10px 30px rgba(59,130,246,0.35)"
                                }}
                            >

                                {

                                    saving

                                        ?

                                        "Saving..."

                                        :

                                        "Save Grades"
                                }

                            </button>

                        </div>

                        {

                            loading

                            ?

                            (

                                <div className="text-center py-5">

                                    Loading Subjects...

                                </div>

                            )

                            :

                            (

                                <div className="table-responsive">

                                    <table
                                        className="table align-middle"
                                        style={{
                                            color: "white"
                                        }}
                                    >

                                        <thead>

                                            <tr>

                                                <th>CID</th>

                                                <th>Subject</th>

                                                <th>Credits</th>

                                                <th>Grade Point</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {

                                                subjects.map(

                                                    (sub, index) => (

                                                        <tr key={index}>

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

                                                                    value={

                                                                        grades[sub.Cid]

                                                                        ??

                                                                        sub.Grade_point

                                                                        ??

                                                                        ""
                                                                    }

                                                                    onChange={(e) => {

                                                                        const value = Math.max(

                                                                            0,

                                                                            Math.min(
                                                                                10,
                                                                                Number(e.target.value)
                                                                            )
                                                                        );

                                                                        setGrades({

                                                                            ...grades,

                                                                            [sub.Cid]:
                                                                                value
                                                                        });
                                                                    }}

                                                                    className="form-control"

                                                                    style={{

                                                                        background:
                                                                            "#0f172a",

                                                                        color:
                                                                            "white",

                                                                        border:
                                                                            "1px solid rgba(255,255,255,0.08)",

                                                                        borderRadius:
                                                                            "14px",

                                                                        padding:
                                                                            "10px",

                                                                        fontWeight:
                                                                            "600"
                                                                    }}
                                                                />

                                                            </td>

                                                        </tr>
                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>
                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;