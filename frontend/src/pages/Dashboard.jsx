import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import API_BASE from "../services/api";

function Dashboard() {
    const navigate = useNavigate();

    const rollNo = localStorage.getItem("roll_no");
    const studentName = localStorage.getItem("student_name");
    const branch = localStorage.getItem("branch");
    const programme = localStorage.getItem("programme");

    const year = 2;

    const [selectedSem, setSelectedSem] = useState(2);
    const [subjects, setSubjects] = useState([]);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!rollNo) {
            navigate("/");
        }
    }, [rollNo, navigate]);

    useEffect(() => {
        if (!rollNo) return;

        const fetchSubjects = async () => {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_BASE}/semester/${selectedSem}/${rollNo}`
                );

                const data = await response.json();

                if (!response.ok || data.success === false) {
                    throw new Error(data.message || "Failed to load subjects");
                }

                setSubjects(
                    Array.isArray(data.subjects) ? data.subjects : []
                );

                // Clear unsaved edits when switching semesters.
                setGrades({});
            } catch (err) {
                console.error(err);
                setSubjects([]);
                toast.error("Failed to load subjects");
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [selectedSem, rollNo]);

    const saveGrades = async () => {
        if (Object.keys(grades).length === 0) {
            toast("No grade changes to save");
            return;
        }

        try {
            setSaving(true);

            for (const cid of Object.keys(grades)) {
                const response = await fetch(`${API_BASE}/update-grade`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        roll_no: rollNo,
                        cid,
                        grade_point: Number(grades[cid])
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || data.success === false) {
                    throw new Error(
                        data.message || `Failed to save grade for ${cid}`
                    );
                }
            }

            toast.success("Grades updated successfully");

            // Make saved edits the displayed baseline.
            setSubjects((current) =>
                current.map((sub) => ({
                    ...sub,
                    Grade_point:
                        grades[sub.Cid] ?? sub.Grade_point
                }))
            );

            setGrades({});
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to save grades");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const gradeFor = (sub) =>
        Number(grades[sub.Cid] ?? sub.Grade_point ?? 0);

    const totalCredits = useMemo(
        () =>
            subjects.reduce(
                (sum, sub) => sum + Number(sub.Credits || 0),
                0
            ),
        [subjects]
    );

    const sgpa = useMemo(() => {
        if (subjects.length === 0 || totalCredits === 0) {
            return "0.00";
        }

        const weighted = subjects.reduce(
            (sum, sub) =>
                sum +
                Number(
                    grades[sub.Cid] ?? sub.Grade_point ?? 0
                ) *
                    Number(sub.Credits || 0),
            0
        );

        return (weighted / totalCredits).toFixed(2);
    }, [subjects, grades, totalCredits]);

    const gradePoints = useMemo(
        () =>
            subjects.map((sub) =>
                Number(
                    grades[sub.Cid] ?? sub.Grade_point ?? 0
                )
            ),
        [subjects, grades]
    );

    const highestGP =
        gradePoints.length > 0 ? Math.max(...gradePoints) : 0;

    const lowestGP =
        gradePoints.length > 0 ? Math.min(...gradePoints) : 0;

    const averageGP =
        gradePoints.length > 0
            ? (
                  gradePoints.reduce((a, b) => a + b, 0) /
                  gradePoints.length
              ).toFixed(2)
            : "0.00";

    const completedCount = subjects.filter(
        (sub) =>
            grades[sub.Cid] !== undefined ||
            (sub.Grade_point !== null &&
                sub.Grade_point !== undefined &&
                sub.Grade_point !== "")
    ).length;

    const completion =
        subjects.length === 0
            ? 0
            : Math.round(
                  (completedCount / subjects.length) * 100
              );

    const level =
        Number(sgpa) >= 9
            ? "Elite"
            : Number(sgpa) >= 8
              ? "Advanced"
              : Number(sgpa) >= 7
                ? "Growing"
                : "Starter";

    const strongestSubject =
        subjects.length > 0
            ? [...subjects].sort(
                  (a, b) => gradeFor(b) - gradeFor(a)
              )[0]?.Course_name
            : "N/A";

    const weakestSubject =
        subjects.length > 0
            ? [...subjects].sort(
                  (a, b) => gradeFor(a) - gradeFor(b)
              )[0]?.Course_name
            : "N/A";

    const glassCard = {
        background: "#111827",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "0 8px 24px rgba(0,0,0,.25)"
    };

    return (
        <div
            className="container-fluid min-vh-100 text-white"
            style={{
                background:
                    "linear-gradient(135deg,#050816,#091226,#101828,#1e1b4b)",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <div className="row min-vh-100">
                {/* SIDEBAR */}
                <aside
                    className="col-lg-2 col-md-3 p-4"
                    style={{
                        background: "rgba(15,23,42,0.96)",
                        borderRight:
                            "1px solid rgba(255,255,255,0.08)"
                    }}
                >
                    <div className="mb-5">
                        <h1
                            style={{
                                fontWeight: "800",
                                fontSize: "2.5rem"
                            }}
                        >
                            🎓 Student Analytics Portal
                        </h1>

                        <p style={{ color: "#94a3b8" }}>
                            Academic Analytics
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

                    {/* MENU — Settings removed */}
                    <div className="d-grid gap-2 mt-5">
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
                                    "rgba(37,99,235,.12)",
                                border: "none"
                            }}
                        >
                            📈 Statistics
                        </button>

                        <button
                            className="btn text-start text-danger py-3"
                            onClick={handleLogout}
                            style={{
                                borderRadius: "18px",
                                background:
                                    "rgba(239,68,68,0.08)",
                                border: "none"
                            }}
                        >
                            🚪 Logout
                        </button>
                    </div>

                    {/* PROFILE */}
                    <div
                        className="mt-5 p-4"
                        style={{
                            ...glassCard,
                            overflow: "hidden"
                        }}
                    >
                        <div className="text-center">
                            <div
                                className="mx-auto mb-4"
                                style={{
                                    width: "82px",
                                    height: "82px",
                                    borderRadius: "30px",
                                    background:
                                        "linear-gradient(to right,#3b82f6,#8b5cf6)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "2rem",
                                    boxShadow:
                                        "0 10px 30px rgba(59,130,246,0.35)"
                                }}
                            >
                                🎓
                            </div>

                            <h5
                                style={{
                                    fontWeight: "700",
                                    marginBottom: "4px"
                                }}
                            >
                                {studentName || "Student"}
                            </h5>

                            <p
                                style={{
                                    color: "#93c5fd",
                                    marginBottom: "6px",
                                    fontSize: "0.9rem"
                                }}
                            >
                                {rollNo}
                            </p>

                            <p
                                style={{
                                    color: "#60a5fa",
                                    marginBottom: "10px",
                                    fontSize: "0.82rem",
                                    wordBreak: "break-word"
                                }}
                            >
                                {localStorage.getItem("email") ||
                                    "No Email Added"}
                            </p>

                            <div
                                className="mt-3 p-3"
                                style={{
                                    background: "#111827",
                                    borderRadius: "18px"
                                }}
                            >
                                <p
                                    style={{
                                        color: "#a5b4fc",
                                        marginBottom: "6px",
                                        fontSize: "0.9rem",
                                        fontWeight: "600"
                                    }}
                                >
                                    {programme}
                                </p>

                                <p
                                    style={{
                                        color: "#94a3b8",
                                        marginBottom: "6px",
                                        fontSize: "0.85rem"
                                    }}
                                >
                                    {branch}
                                </p>

                                <p
                                    style={{
                                        color: "#64748b",
                                        fontSize: "0.82rem",
                                        marginBottom: "0"
                                    }}
                                >
                                    Year {year} • Semester{" "}
                                    {selectedSem}
                                </p>
                            </div>

                            <div className="mt-3">
                                <span
                                    className="badge"
                                    style={{
                                        background:
                                            "rgba(34,197,94,0.18)",
                                        color: "#4ade80",
                                        borderRadius: "20px",
                                        padding: "8px 14px"
                                    }}
                                >
                                    🏅 {level}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* UNIVERSITY */}
                    <div
                        className="mt-4 p-4"
                        style={glassCard}
                    >
                        <h5 style={{ fontWeight: "700" }}>
                            🏫 University
                        </h5>

                        <p
                            className="mt-3"
                            style={{
                                color: "#cbd5e1",
                                lineHeight: "1.7"
                            }}
                        >
                            Jawaharlal Nehru Technological
                            University Hyderabad
                        </p>

                        <small style={{ color: "#64748b" }}>
                            Academic Analytics Portal
                        </small>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="col-lg-10 col-md-9 p-5">
                    {/* HEADER */}
                    <div className="mb-5">
                        <h1
                            style={{
                                fontSize: "3.2rem",
                                fontWeight: "700"
                            }}
                        >
                            <span
                                style={{
                                    background:
                                        "linear-gradient(to right,#93c5fd,#c4b5fd)",
                                    WebkitBackgroundClip:
                                        "text",
                                    WebkitTextFillColor:
                                        "transparent"
                                }}
                            >
                                Welcome back, {studentName} 👋
                            </span>
                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.1rem"
                            }}
                        >
                            Academic analytics and performance
                            tracking dashboard.
                        </p>
                    </div>

                    {/* SGPA HERO */}
                    <div
                        className="mb-4"
                        style={{
                            background:
                                "linear-gradient(135deg,#2563eb 0%,#7c3aed 100%)",
                            padding: "40px",
                            borderRadius: "34px",
                            border:
                                "1px solid rgba(255,255,255,.12)",
                            boxShadow:
                                "0 25px 80px rgba(59,130,246,.35)",
                            position: "relative",
                            overflow: "hidden"
                        }}
                    >
                        <h6
                            style={{
                                opacity: 0.8,
                                letterSpacing: "1px"
                            }}
                        >
                            CURRENT SGPA
                        </h6>

                        <h1
                            style={{
                                fontSize: "5.2rem",
                                fontWeight: "800",
                                marginBottom: "0"
                            }}
                        >
                            {sgpa}
                        </h1>

                        <p style={{ margin: 0 }}>
                            Semester {selectedSem} • Academic
                            Tracker
                        </p>

                        <div
                            style={{
                                marginTop: "18px",
                                opacity: 0.9,
                                fontSize: "1rem"
                            }}
                        >
                            Level • {level}
                        </div>
                    </div>

                    {/* STATS */}
                    <div className="row g-4 mb-5">
                        {[
                            {
                                title: "Highest",
                                value: highestGP
                            },
                            {
                                title: "Lowest",
                                value: lowestGP
                            },
                            {
                                title: "Average",
                                value: averageGP
                            },
                            {
                                title: "Credits",
                                value: totalCredits
                            },
                            {
                                title: "Subjects",
                                value: subjects.length
                            },
                            {
                                title: "Completion",
                                value: `${completion}%`
                            }
                        ].map((item) => (
                            <div
                                className="col-xl-2 col-lg-4 col-md-6"
                                key={item.title}
                            >
                                <div
                                    className="h-100"
                                    style={glassCard}
                                >
                                    <p
                                        style={{
                                            color: "#94a3b8",
                                            marginBottom: "10px"
                                        }}
                                    >
                                        {item.title}
                                    </p>

                                    <h1
                                        style={{
                                            fontSize: "2.2rem",
                                            fontWeight: "800",
                                            margin: 0
                                        }}
                                    >
                                        {item.value}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* QUICK INFO */}
                    <div
                        className="mb-5"
                        style={glassCard}
                    >
                        <div className="row g-4">
                            <div className="col-md-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(59,130,246,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>📚 Programme</h5>

                                    <h3
                                        className="mt-3"
                                        style={{
                                            color: "#60a5fa"
                                        }}
                                    >
                                        {programme}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(34,197,94,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>🎯 Current Year</h5>
                                    <h1>2</h1>
                                    <p
                                        style={{
                                            color: "#cbd5e1",
                                            marginBottom: 0
                                        }}
                                    >
                                        Second Academic Year
                                    </p>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(139,92,246,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>📖 Active Semester</h5>

                                    <select
                                        value={selectedSem}
                                        onChange={(e) =>
                                            setSelectedSem(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="form-select mt-3"
                                        style={{
                                            background: "#0b1220",
                                            color: "white",
                                            border:
                                                "1px solid #3b82f6",
                                            borderRadius: "18px"
                                        }}
                                    >
                                        {[1, 2, 3, 4].map(
                                            (sem) => (
                                                <option
                                                    key={sem}
                                                    value={sem}
                                                >
                                                    Semester {sem}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PERFORMANCE GRAPH */}
                    <div
                        className="mb-5"
                        style={glassCard}
                    >
                        <h2 className="mb-5">
                            📈 Semester Performance
                        </h2>

                        {subjects.length === 0 ? (
                            <p
                                style={{
                                    color: "#94a3b8"
                                }}
                            >
                                No subjects available for this
                                semester.
                            </p>
                        ) : (
                            <div
                                className="d-flex align-items-end gap-4"
                                style={{
                                    height: "260px",
                                    overflowX: "auto"
                                }}
                            >
                                {subjects.map((subject) => {
                                    const gp =
                                        gradeFor(subject);

                                    return (
                                        <div
                                            key={subject.Cid}
                                            className="flex-fill text-center"
                                            style={{
                                                minWidth: "70px"
                                            }}
                                        >
                                            <div
                                                title={`${subject.Course_name}: ${gp}`}
                                                style={{
                                                    height: `${Math.max(
                                                        45,
                                                        gp * 20
                                                    )}px`,
                                                    borderRadius:
                                                        "24px 24px 0 0",
                                                    background:
                                                        "linear-gradient(180deg,#38bdf8,#6366f1,#8b5cf6)",
                                                    transition:
                                                        "0.5s ease",
                                                    cursor: "pointer",
                                                    boxShadow:
                                                        "0 10px 25px rgba(124,58,237,0.35)"
                                                }}
                                            />

                                            <p
                                                className="mt-3"
                                                style={{
                                                    color: "#93c5fd",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {subject.Cid}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* INSIGHTS */}
                    <div
                        className="mb-5"
                        style={glassCard}
                    >
                        <h2 className="mb-4">
                            📊 Performance Insights
                        </h2>

                        <div className="row g-4">
                            <div className="col-lg-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(34,197,94,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>
                                        🚀 Strongest Subject
                                    </h5>
                                    <h3 className="mt-4">
                                        {strongestSubject}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(239,68,68,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>📉 Weakest Subject</h5>
                                    <h3 className="mt-4">
                                        {weakestSubject}
                                    </h3>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div
                                    className="p-4 h-100"
                                    style={{
                                        background:
                                            "rgba(59,130,246,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >
                                    <h5>🎯 Academic Status</h5>
                                    <h2 className="mt-4">
                                        {Number(sgpa) >= 9
                                            ? "Excellent"
                                            : Number(sgpa) >= 8
                                              ? "Very Good"
                                              : Number(sgpa) >=
                                                  7
                                                ? "Good"
                                                : "Needs Improvement"}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STATUS BANNER */}
                    <div
                        className="mb-4 p-4"
                        style={{
                            background:
                                "linear-gradient(90deg,#2563eb,#7c3aed)",
                            borderRadius: "22px"
                        }}
                    >
                        {Number(sgpa) >= 8
                            ? "🚀 Excellent pace"
                            : "🌱 Keep improving"}
                    </div>

                    {/* SUBJECT TABLE */}
                    <div style={glassCard}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                            <div>
                                <h2
                                    style={{
                                        marginBottom: "8px"
                                    }}
                                >
                                    Semester {selectedSem}
                                </h2>

                                <p
                                    style={{
                                        color: "#94a3b8",
                                        marginBottom: "6px"
                                    }}
                                >
                                    Subject Grade Management
                                </p>

                                <small
                                    style={{
                                        color: "#94a3b8"
                                    }}
                                >
                                    Progress • {completion}%
                                </small>
                            </div>

                            <div className="text-end">
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
                                        fontWeight: "700",
                                        border: "none",
                                        boxShadow:
                                            "0 8px 25px rgba(59,130,246,.35)"
                                    }}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "💾 Save Grades"}
                                </button>

                                <div className="mt-2">
                                    <small
                                        style={{
                                            color: "#94a3b8"
                                        }}
                                    >
                                        Changes save only after
                                        pressing Save
                                    </small>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                Loading Subjects...
                            </div>
                        ) : subjects.length === 0 ? (
                            <div
                                className="text-center py-5"
                                style={{
                                    color: "#94a3b8"
                                }}
                            >
                                No subjects found for Semester{" "}
                                {selectedSem}.
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table
                                    className="table align-middle border-0"
                                    style={{
                                        color: "white",
                                        borderCollapse:
                                            "separate",
                                        borderSpacing:
                                            "0 14px"
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            {[
                                                "CID",
                                                "Subject",
                                                "Credits",
                                                "Grade Point"
                                            ].map((head) => (
                                                <th
                                                    key={head}
                                                    style={{
                                                        background:
                                                            "rgba(59,130,246,0.12)",
                                                        color:
                                                            "#93c5fd",
                                                        border:
                                                            "none",
                                                        padding:
                                                            "18px",
                                                        fontWeight:
                                                            "600",
                                                        fontSize:
                                                            "0.95rem"
                                                    }}
                                                >
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {subjects.map(
                                            (sub) => (
                                                <tr
                                                    key={
                                                        sub.Cid
                                                    }
                                                >
                                                    <td
                                                        style={{
                                                            background:
                                                                "#0b1220",
                                                            padding:
                                                                "18px",
                                                            color:
                                                                "#93c5fd",
                                                            fontWeight:
                                                                "600"
                                                        }}
                                                    >
                                                        {
                                                            sub.Cid
                                                        }
                                                    </td>

                                                    <td
                                                        style={{
                                                            background:
                                                                "#172554",
                                                            padding:
                                                                "18px",
                                                            color:
                                                                "#f8fafc"
                                                        }}
                                                    >
                                                        <div>
                                                            {
                                                                sub.Course_name
                                                            }

                                                            <div
                                                                style={{
                                                                    color:
                                                                        "#60a5fa",
                                                                    fontSize:
                                                                        "12px"
                                                                }}
                                                            >
                                                                {
                                                                    sub.Credits
                                                                }{" "}
                                                                Credits
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td
                                                        style={{
                                                            background:
                                                                "#111827",
                                                            padding:
                                                                "18px",
                                                            color:
                                                                "#c4b5fd",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >
                                                        {
                                                            sub.Credits
                                                        }
                                                    </td>

                                                    <td
                                                        style={{
                                                            background:
                                                                "#111827",
                                                            padding:
                                                                "18px"
                                                        }}
                                                    >
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="10"
                                                            value={
                                                                grades[
                                                                    sub
                                                                        .Cid
                                                                ] ??
                                                                sub.Grade_point ??
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) => {
                                                                const raw =
                                                                    e
                                                                        .target
                                                                        .value;

                                                                if (
                                                                    raw ===
                                                                    ""
                                                                ) {
                                                                    setGrades(
                                                                        (
                                                                            current
                                                                        ) => ({
                                                                            ...current,
                                                                            [sub.Cid]:
                                                                                ""
                                                                        })
                                                                    );
                                                                    return;
                                                                }

                                                                const value =
                                                                    Math.max(
                                                                        0,
                                                                        Math.min(
                                                                            10,
                                                                            Number(
                                                                                raw
                                                                            )
                                                                        )
                                                                    );

                                                                setGrades(
                                                                    (
                                                                        current
                                                                    ) => ({
                                                                        ...current,
                                                                        [sub.Cid]:
                                                                            value
                                                                    })
                                                                );
                                                            }}
                                                            onFocus={(
                                                                e
                                                            ) => {
                                                                e.target.style.border =
                                                                    "2px solid #60a5fa";
                                                            }}
                                                            onBlur={(
                                                                e
                                                            ) => {
                                                                e.target.style.border =
                                                                    "2px solid #3b82f6";
                                                            }}
                                                            className="form-control"
                                                            style={{
                                                                background:
                                                                    "#172554",
                                                                color:
                                                                    "#a5b4fc",
                                                                border:
                                                                    "2px solid #3b82f6",
                                                                height:
                                                                    "58px",
                                                                width:
                                                                    "120px",
                                                                fontWeight:
                                                                    "800",
                                                                fontSize:
                                                                    "22px",
                                                                textAlign:
                                                                    "center",
                                                                borderRadius:
                                                                    "18px",
                                                                outline:
                                                                    "none",
                                                                transition:
                                                                    ".2s"
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div
                        className="text-center mt-5"
                        style={{
                            color: "#64748b",
                            fontSize: "0.95rem"
                        }}
                    >
                        Made by Shyam 🚀
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
