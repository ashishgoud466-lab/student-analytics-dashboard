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
    // LOCAL STORAGE DATA
    // =====================================

    const rollNo =
        localStorage.getItem("roll_no");

    const studentName =
        localStorage.getItem(
            "student_name"
        );

    const branch =
        localStorage.getItem(
            "branch"
        );

    const programme =
        localStorage.getItem(
            "programme"
        );

    const year = 2;

    const semId = 2;
    // =====================================
    // STATES
    // =====================================

    const [
selectedSem,
setSelectedSem
]

=

useState(2);

    const [subjects, setSubjects] = useState([]);
    const [grades, setGrades] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

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

                const response = await fetch(

                    `${API_BASE}/semester/${selectedSem}/${rollNo}`
                );

                const data =
                    await response.json();
console.log("FULL DATA:", data);

console.log("SUBJECTS:", data.subjects);

console.log(
    "IS ARRAY:",
    Array.isArray(data.subjects)
);
                setSubjects(Array.isArray(data.subjects) ? data.subjects : []);

            }

            catch (err) {

                console.error(err);

                toast.error(
                    "Failed to load subjects"
                );
            }

            finally {

                setLoading(false);
            }
        };

        fetchSubjects();

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
                "Grades Updated Successfully"
            );

        }

        catch (err) {

            console.error(err);

            toast.error(
                "Failed to save grades"
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

        return (subjects || []).reduce(

            (sum, sub) =>

                sum +

                Number(sub.Credits || 0),

            0
        );

    }, [subjects]);

    const sgpa = useMemo(() => {

        if (
            subjects.length === 0
            ||
            totalCredits === 0
        ) {

            return "0.00";
        }

        const weighted =
          (subjects || []).reduce(

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
            weighted / totalCredits
        ).toFixed(2);

    }, [

        subjects,
        grades,
        totalCredits
    ]);

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

    const averageGP = useMemo(() => {

        if (subjects.length === 0) {

            return "0.00";
        }

        const total =
            (subjects || []).reduce(

                (sum, sub) =>

                    sum +

                    Number(

                        grades[sub.Cid]

                        ??

                        sub.Grade_point

                        ??

                        0
                    ),

                0
            );

        return (
            total / subjects.length
        ).toFixed(2);

    }, [subjects, grades]);
const completion = (

subjects.length===0

?0

:

Math.round(

Object.keys(
grades
).length

/

subjects.length

*100

)

);

const level=

Number(sgpa)>=9

?"Elite"

:Number(sgpa)>=8

?"Advanced"

:Number(sgpa)>=7

?"Growing"

:"Starter";
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
"linear-gradient(135deg,#050816,#091226,#101828,#1e1b4b)" ,

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

                    {/* LOGO */}

                    <div className="mb-5">

                        <h1
                            style={{
                                fontWeight: "800",
                                fontSize: "2.5rem"
                            }}
                        >

                            🎓 Student Analytics Portal

                        </h1>

                        <p
                            style={{
                                color: "#94a3b8"
                            }}
                        >

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

                    {/* MENU */}
{/* MENU */}

<div className="d-grid gap-2 mt-5">

<button
className="btn text-start fw-semibold py-3"
onClick={()=>navigate("/dashboard")}
style={{
borderRadius:"18px",
background:
"linear-gradient(to right,#ffffff,#dbeafe)",
color:"#111827",
border:"none"
}}
>

📊 Dashboard

</button>

<button

className="btn text-start text-white py-3"

onClick={()=>
navigate("/Analytics")
}

style={{

borderRadius:"18px",

background:
"rgba(255,255,255,.05)"

}}

>

📈 Statistics

</button>

<button

className="btn text-start text-white py-3"

onClick={()=>
navigate("/Settings")
}

style={{

borderRadius:"18px",

background:
"rgba(255,255,255,0.05)",

transition:
"0.2s"

}}

>

⚙️ Settings

</button>

<button
className="btn text-start text-danger py-3"
onClick={handleLogout}
style={{
borderRadius:"18px",
background:
"rgba(239,68,68,0.08)"
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

                borderRadius: "24px",

                background:
                    "linear-gradient(to right,#3b82f6,#8b5cf6)",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                fontSize: "2rem",

                fontWeight: "700",

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

            {

                studentName ||

                "Student"
            }

        </h5>

        <p
            style={{
                color: "#94a3b8",
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

            {

                localStorage.getItem("email")

                ||

                "No Email Added"
            }

        </p>

        <div
            className="mt-3 p-3"
            style={{
                background:
                    "rgba(255,255,255,0.03)",
                borderRadius: "18px"
            }}
        >

            <p
                style={{
                    color: "#cbd5e1",
                    marginBottom: "6px",
                    fontSize: "0.9rem"
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

                Year {year} • Semester {semId}

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

                Active Student

            </span>

        </div>

    </div>

</div>
                    {/* UNIVERSITY CARD */}

                    <div
                        className="mt-4 p-4"
                        style={glassCard}
                    >

                        <h5
                            style={{
                                fontWeight: "700"
                            }}
                        >

                            🏫 University

                        </h5>

                        <p
                            className="mt-3"
                            style={{
                                color: "#cbd5e1",
                                lineHeight: "1.7"
                            }}
                        >

                            Jawaharlal Nehru
                            Technological University
                            Hyderabad

                        </p>

                        <small
                            style={{
                                color: "#64748b"
                            }}
                        >

                            Academic Analytics Portal

                        </small>

                    </div>

                </div>

                {/* MAIN */}

                <div className="col-lg-10 col-md-9 p-5">

                    {/* HEADER */}

                    <div className="mb-5">

                        <h1
                            style={{
                                fontSize: "2.7rem",
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

                               Welcome back,
{studentName}

                            </span>

                        </h1>

                        <p
                            style={{
                                color: "#94a3b8",
                                fontSize: "1.1rem"
                            }}
                        >

                            Academic analytics and performance tracking dashboard.

                        </p>

                        <div
                            className="mt-4 badge"
                            style={{
                                background:
                                    "rgba(59,130,246,0.18)",
                                color: "#93c5fd",
                                padding: "12px 18px",
                                borderRadius: "20px",
                                fontSize: "1rem"
                            }}
                        >


</div>



                    <div

style={glassCard}

className="p-3 mt-4"

>


{

Object.keys(
grades
).length

}

</div>

<div
style={glassCard}
className="p-4"
>



{new Date().toLocaleDateString()}

</div>
<div
className="mb-5"
style={{

background:
"linear-gradient(135deg,#2563eb,#7c3aed)",

padding:"36px",

borderRadius:"32px",

boxShadow:
"0 20px 60px rgba(59,130,246,.35)"

}}
>

<h5>

Current SGPA

</h5>

<h1
style={{
fontSize:"5rem",
fontWeight:"800"
}}
>

{sgpa}

</h1>

<p>

Semester {selectedSem}

</p>

</div>
                    <div className="row g-4 mb-4">

                        {

                            [

                                {
                                    title: "SGPA",
                                    value: sgpa
                                },

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
                                }
,
{
title:"Completion",
value:`${completion}%`
}
                            ].map((item, index) => (

                                <div
                                    className="col-xl-2 col-lg-4 col-md-6"
                                    key={index}
                                >

                                    <div
                                        className="p-4 h-100"
                                        style={glassCard}
                                    >

                                        <p>{item.title}</p>

                                        <h1
                                            style={{
                                                fontSize: "2.5rem",
                                                fontWeight: "700"
                                            }}
                                        >

                                            {item.value}

                                        </h1>

                                    </div>

                                </div>
                            ))
                        }

                    </div>
</div>
                    {/* QUICK INFO */}

                    <div
                        className="p-4 mb-5"
                        style={glassCard}
                    >

                        <div className="row g-4">

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(59,130,246,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >

                                    <h5>

                                        📚 Programme

                                    </h5>

                                    <h3 className="mt-3">

                                        {programme}

                                    </h3>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(34,197,94,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >

                                    <h5>🎯 Current Year</h5>

<h1>2</h1>

<p>Second Academic Year</p>

                                </div>

                            </div>

                            <div className="col-md-4">

                                <div
                                    className="p-4"
                                    style={{
                                        background:
                                            "rgba(139,92,246,0.12)",
                                        borderRadius: "24px"
                                    }}
                                >

                                    
<h5>

📖 Active Semester

</h5>

<select

value={selectedSem}

onChange={(e)=>{

setSelectedSem(

Number(
e.target.value
)

);

}}

className="form-select"

style={{

background:
"#172554",

color:
"white",

border:
"1px solid #3b82f6",

borderRadius:
"18px"

}}

>

{

[1,2,3,4]

.map((s)=>(

<option
key={s}
value={s}
>

Semester {s}

</option>

))

}

</select>
                                </div>

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
                                                        "linear-gradient(180deg,#38bdf8,#6366f1,#8b5cf6)",

                                                    transition:
                                                        "0.5s ease",

                                                    cursor:
                                                        "pointer",

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

                    {/* INSIGHTS */}

                    <div
                        className="p-5 mb-5"
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

                                        {

                                            subjects.length > 0

                                            ?

                                            [...subjects].sort(

                                                (a, b) =>

                                                    Number(b.Grade_point || 0)

                                                    -

                                                    Number(a.Grade_point || 0)

                                            )[0]?.Course_name

                                            :

                                            "N/A"
                                        }

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

                                    <h5>

                                        📉 Weakest Subject

                                    </h5>

                                    <h3 className="mt-4">

                                        {

                                            subjects.length > 0

                                            ?

                                            [...subjects].sort(

                                                (a, b) =>

                                                    Number(a.Grade_point || 0)

                                                    -

                                                    Number(b.Grade_point || 0)

                                            )[0]?.Course_name

                                            :

                                            "N/A"
                                        }

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
<h5>

🎯 Academic Status

</h5>

<h2 className="mt-4">

{

Number(sgpa)>=9

?

"Excellent"

:

Number(sgpa)>=8

?

"Very Good"

:

Number(sgpa)>=7

?

"Good"

:

"Needs Improvement"

}

</h2>

                                    
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* SEM BUTTONS */}


                    {/* TABLE */}
<div

className="mb-4 p-4"

style={{
background:
"linear-gradient(90deg,#2563eb,#7c3aed)",

borderRadius:
"22px"
}}

>

{

Number(sgpa)>=8

?

"🚀 Excellent pace"

:

"🌱 Keep improving"

}

</div>
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
<small

style={{

color:"#94a3b8"

}}

>

Changes save only after pressing Save

</small>
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

            {

                [

                    "CID",

                    "Subject",

                    "Credits",

                    "Grade Point"
                ].map((head, index) => (

                    <th

                        key={index}

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
                ))
            }

        </tr>

    </thead>

    <tbody>

{subjects.map((sub, index) => (

<tr key={index}>

<td
style={{
background:"rgba(255,255,255,0.03)",
padding:"18px"
}}
>
{sub.Cid}
</td>

<td
style={{
background:"rgba(255,255,255,0.03)",
padding:"18px"
}}
>

<div>

{sub.Course_name}

<div
style={{
color:"#60a5fa",
fontSize:"12px"
}}
>

Semester Subject

</div>

</div>

</td>

<td
style={{
background:"rgba(255,255,255,0.03)",
padding:"18px"
}}
>
{sub.Credits}
</td>

<td
style={{
background:"rgba(255,255,255,0.03)",
padding:"18px"
}}
>

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
onChange={(e)=>{

const value =
Math.max(
0,
Math.min(
10,
Number(e.target.value)||0
)
);

setGrades({

...grades,

[sub.Cid]:
value

});

}}
className="form-control"
/>

</td>

</tr>

))}

</tbody>
</table>

                                </div>
                            )
                        }

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

export default Dashboard;