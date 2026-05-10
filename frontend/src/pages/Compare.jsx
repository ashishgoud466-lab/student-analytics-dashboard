import { useState } from "react";

import API_BASE from "../services/api";


function Compare() {

    const [roll1, setRoll1] = useState("");

    const [roll2, setRoll2] = useState("");

    const [data, setData] = useState(null);


    const compareStudents = () => {

        fetch(`${API_BASE}/compare/${roll1}/${roll2}`)

            .then((res) => res.json())

            .then((data) => {

                setData(data);

            });

    };


    return (

        <div className="container mt-4">

            <h1 className="mb-4">
                Compare Students
            </h1>


            <div className="row mb-4">

                <div className="col-md-5">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Roll No 1"
                        value={roll1}
                        onChange={(e) => setRoll1(e.target.value)}
                    />

                </div>


                <div className="col-md-5">

                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Roll No 2"
                        value={roll2}
                        onChange={(e) => setRoll2(e.target.value)}
                    />

                </div>


                <div className="col-md-2">

                    <button
                        className="btn btn-dark w-100"
                        onClick={compareStudents}
                    >

                        Compare

                    </button>

                </div>

            </div>



            {data && (

                <div className="row">


                    {/* STUDENT 1 */}

                    <div className="col-md-6">

                        <div className="card shadow p-4">

                            <h3>{data.student1.Student_name}</h3>

                            <hr />

                            <p>
                                <strong>Roll No:</strong> {data.student1.Roll_no}
                            </p>

                            <p>
                                <strong>Programme:</strong> {data.student1.Programme}
                            </p>

                            <p>
                                <strong>SGPA:</strong> {data.student1.SGPA}
                            </p>

                            <p>
                                <strong>Average GP:</strong> {data.student1.Average_GP}
                            </p>

                            <p>
                                <strong>Highest GP:</strong> {data.student1.Highest_GP}
                            </p>

                            <p>
                                <strong>Lowest GP:</strong> {data.student1.Lowest_GP}
                            </p>

                        </div>

                    </div>



                    {/* STUDENT 2 */}

                    <div className="col-md-6">

                        <div className="card shadow p-4">

                            <h3>{data.student2.Student_name}</h3>

                            <hr />

                            <p>
                                <strong>Roll No:</strong> {data.student2.Roll_no}
                            </p>

                            <p>
                                <strong>Programme:</strong> {data.student2.Programme}
                            </p>

                            <p>
                                <strong>SGPA:</strong> {data.student2.SGPA}
                            </p>

                            <p>
                                <strong>Average GP:</strong> {data.student2.Average_GP}
                            </p>

                            <p>
                                <strong>Highest GP:</strong> {data.student2.Highest_GP}
                            </p>

                            <p>
                                <strong>Lowest GP:</strong> {data.student2.Lowest_GP}
                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Compare;
