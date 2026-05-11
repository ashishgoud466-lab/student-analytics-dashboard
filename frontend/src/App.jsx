import { useEffect, useState }from "react";
import Login from "./pages/Login";


import {
    HashRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import API_BASE from "./services/api";

import StudentProfile from "./pages/StudentProfile";

function App() {

    // ==========================================
    // STATES
    // ==========================================

    const [students, setStudents] = useState([]);

    const [totalStudents, setTotalStudents] = useState(0);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);


    // ==========================================
    // FETCH DATA
    // ==========================================

    useEffect(() => {

        fetch(`${API_BASE}/ranklist`)

            .then((res) => res.json())

            .then((data) => {

                console.log(data);

                setStudents(data.results);

                setTotalStudents(data.total_students);

                setLoading(false);

            })

            .catch((err) => {

                console.error(err);

                setError("Failed to load data");

                setLoading(false);

            });

    }, []);


    // ==========================================
    // SEARCH FILTER
    // ==========================================

    const filteredStudents = students.filter((student) =>

        student.Student_name
            .toLowerCase()
            .includes(search.toLowerCase())

        ||

        student.Roll_no
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    // ==========================================
    // DASHBOARD STATS
    // ==========================================

    const highestSGPA = students.length > 0

        ? Math.max(...students.map((s) => s.SGPA))

        : 0;


    const averageSGPA = students.length > 0

        ? (
            students.reduce((sum, s) => sum + s.SGPA, 0)
            / students.length
        ).toFixed(2)

        : 0;


    const topStudent = students.length > 0

        ? students.reduce((top, current) =>

            current.SGPA > top.SGPA

                ? current

                : top

        )

        : null;


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return <h1 className="text-center mt-5">Loading...</h1>;

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return <h1 className="text-center mt-5">{error}</h1>;

    }


    return (

        <HashRouter>

            <Routes>

                <Route

                    path="/"

                    element={

                        <div className="container mt-4">

                            {/* NAVBAR */}

                            <nav className="navbar navbar-dark bg-dark mb-4 rounded shadow">

                                <div className="container-fluid">

                                    <span className="navbar-brand mb-0 h1">

                                        Student Analytics

                                    </span>

                                </div>

                            </nav>


                            {/* COMPARE BUTTON */}



                            {/* TITLE */}

                            <h1 className="text-center mb-4">

                                Student Analytics Dashboard

                            </h1>


                            {/* DASHBOARD CARDS */}

                            <div className="row mb-4">


                                <div className="col-md-3">

                                    <div className="card shadow">

                                        <div className="card-body">

                                            <h5>Total Students</h5>

                                            <h2>{totalStudents}</h2>

                                        </div>

                                    </div>

                                </div>


                                <div className="col-md-3">

                                    <div className="card shadow">

                                        <div className="card-body">

                                            <h5>Highest SGPA</h5>

                                            <h2>{highestSGPA}</h2>

                                        </div>

                                    </div>

                                </div>


                                <div className="col-md-3">

                                    <div className="card shadow">

                                        <div className="card-body">

                                            <h5>Average SGPA</h5>

                                            <h2>{averageSGPA}</h2>

                                        </div>

                                    </div>

                                </div>


                                <div className="col-md-3">

                                    <div className="card shadow">

                                        <div className="card-body">

                                            <h5>Top Student</h5>

                                            <h6>

                                                {topStudent
                                                    ? topStudent.Student_name
                                                    : "N/A"}

                                            </h6>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* SEARCH */}

                            <input
                                type="text"
                                className="form-control mb-4"
                                placeholder="Search by name or roll number..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />


                            {/* TABLE */}

                            <table className="table table-bordered table-hover shadow">

                                <thead className="table-dark">

                                    <tr>

                                        <th>Roll No</th>
                                        <th>Roll No</th>
                                        <th>Name</th>
                                        <th>Programme</th>
                                        <th>SGPA</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredStudents.map((student, index) => (

                                        <tr key={index}>

                                           

                                            <td>

                                                <Link
                                                    to={`/student/${student.Roll_no}`}
                                                >

                                                    {student.Roll_no}

                                                </Link>

                                            </td>

                                            <td>{student.Student_name}</td>

                                            <td>{student.Programme}</td>

                                            <td>{student.SGPA}</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>


                            {/* FOOTER */}

                            <footer className="text-center mt-5 mb-3 text-muted">

                                Student Analytics Dashboard © 2026

                                <br />

                                <small>

                                    Made by <b>Shyam</b> 🚀

                                </small>

                            </footer>

                        </div>

                    }

                />
<Route path="/" element={<Login />} />

<Route path="/dashboard" element={<Dashboard />} />

                {/* PROFILE PAGE */}

                <Route

                    path="/student/:roll"

                    element={<StudentProfile />}

                />


               

            </Routes>

        </HashRouter>

    );
}

export default App;