import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API_BASE from "../services/api";


function StudentProfile() {

    const { roll } = useParams();

    const [student, setStudent] = useState(null);

    const [subjects, setSubjects] = useState([]);


    useEffect(() => {

        fetch(`${API_BASE}/student/${roll}`)

            .then((res) => res.json())

            .then((data) => {

                setStudent(data.student);

                setSubjects(data.subjects);

            });

    }, [roll]);


    if (!student) {

        return <h1>Loading...</h1>;

    }


    return (

        <div className="container mt-4">


            <h1 className="mb-4">
                Student Profile
            </h1>


            {/* ================================= */}
            {/* PROFILE CARD */}
            {/* ================================= */}

            <div className="card shadow p-4 mb-4">

                <h3>{student.Student_name}</h3>

                <hr />


                <p>
                    <strong>Roll No:</strong> {student.Roll_no}
                </p>

                <p>
                    <strong>Programme:</strong> {student.Programme}
                </p>

                <p>
                    <strong>Branch:</strong> {student.Branch}
                </p>

                <p>
                    <strong>Admission Year:</strong> {student.Admission_Year}
                </p>

                <p>
                    <strong>SGPA:</strong> {student.SGPA}

                    {

                        Number(student.Backlogs) > 0

                        &&

                        <span className="text-danger">

                            {" "}
                            (with backlogs)

                        </span>

                    }

                </p>

                <p>
                    <strong>Average GP:</strong> {student.Average_GP}
                </p>

                <p>
                    <strong>Highest GP:</strong> {student.Highest_GP}
                </p>

                <p>
                    <strong>Lowest GP:</strong> {student.Lowest_GP}
                </p>

                <p>
                    <strong>Total Subjects:</strong> {student.Total_Subjects}
                </p>

                <p>
                    <strong>Backlogs:</strong>

                    {

                        Number(student.Backlogs) > 0

                            ? `${student.Backlogs} backlog(s)`

                            : "No Backlogs"

                    }

                </p>

            </div>



            {/* ================================= */}
            {/* SUBJECT TABLE */}
            {/* ================================= */}

            <h3 className="mb-3">
                Subject Grades
            </h3>


            <table className="table table-bordered table-hover shadow">

                <thead className="table-dark">

                    <tr>

                        <th>Course ID</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Grade Point</th>

                    </tr>

                </thead>


                <tbody>

                    {subjects.map((sub, index) => (

                        <tr key={index}>

                            <td>{sub.Cid}</td>

                            <td>{sub.Course_name}</td>

                            <td>{sub.Credits}</td>

                            <td>{sub.Grade_point}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default StudentProfile;