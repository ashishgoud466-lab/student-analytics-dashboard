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

            setMessage("");

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

           toast.success("Grades Saved");

        }

        catch (err) {

            console.error(err);

            
                toast.error("Failed to save");
           
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

    // =====================================
    // STYLES
    // =====================================

    const glassCard = {

        background:
            "rgba(255,255,255,0.05)",

        border:
            "1px solid rgba(255,255,255,0.08)",

        borderRadius: "28px",

        backdropFilter: "blur(18px)",

        transition: "0.3s ease"
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

                {/* ================================= */}
                {/* SIDEBAR */}
                {/* ================================= */}

                <div

                    className="col-lg-2 col-md-3 p-4"

                    style={{

                        background:
                            "rgba(15,23,42,0.96)",

                        borderRight:
                            "1px solid rgba(255,255,255,0.08)"
                    }}
                >

                    {/* LOGO */}

                    <div className="mb-5">

                        <h1

                            style={{

                                fontWeight: "700",

                                fontSize: "2.4rem"
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

                        className="mt-5 p-3"

                        style={glassCard}
                    >

                        <div className="d-flex align-items-center gap-3">

                            <div

                                style={{

                                    height: "60px",

                                    width: "60px",

                                    borderRadius: "50%",

                                    background:
                                        "linear-gradient(to right,#3b82f6,#8b5cf6)",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                    fontWeight: "700",

                                    fontSize: "1.5rem"
                                }}
                            >

                                S

                            </div>

                            <div>

                                <h6 className="mb-1">

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

                {/* ================================= */}
                {/* MAIN */}
                {/* ================================= */}

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

                            className="mt-3"

                            style={{

                                color: "#94a3b8",

                                fontSize: "1.1rem"
                            }}
                        >

                            Track semester performance
                            and academic analytics.

                        </p>

                    </div>

                    {/* MESSAGE */}

                    {

                        message && (

                            <div

                                className="alert alert-info border-0"

                                style={{

                                    background:
                                        "rgba(59,130,246,0.12)",

                                    color: "white",

                                    borderRadius: "18px"
                                }}
                            >

                                {message}

                            </div>
                        )
                    }

                    {/* STATS */}

                    <div className="row g-4 mb-5">

                        <div className="col-xl-4 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
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

                        <div className="col-xl-4 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
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

                        <div className="col-xl-4 col-md-6">

                            <div
                                className="p-4 h-100"
                                style={glassCard}
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

                    {/* GRAPH */}

                    <div
                        className="p-5 mb-5"
                        style={glassCard}
                    >

                        <h2 className="mb-5">

                            Semester Performance

                        </h2>

                        <div

                            className="d-flex align-items-end gap-4"

                            style={{
                                height: "250px"
                            }}
                        >

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
                                                        "20px 20px 0 0",

                                                    background:
                                                        "linear-gradient(to top,#3b82f6,#8b5cf6)"
                                                }}
                                            />

                                            <p

                                                className="mt-3"

                                                style={{
                                                    color: "#94a3b8"
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

                    {/* SUBJECT TABLE */}

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

                                    Dynamic semester subjects

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

                                    border: "none"
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

                                    Loading subjects...

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

                                                subjects.length > 0

                                                ?

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

                                                                        setGrades({

                                                                            ...grades,

                                                                            [sub.Cid]:

                                                                                e.target.value
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
                                                                            "14px"
                                                                    }}
                                                                />

                                                            </td>

                                                        </tr>
                                                    )
                                                )

                                                :

                                                (

                                                    <tr>

                                                        <td

                                                            colSpan="4"

                                                            className="text-center py-5"
                                                        >

                                                            No Subjects Found

                                                        </td>

                                                    </tr>
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