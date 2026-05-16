import { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import API_BASE from "../services/api";

function AdminUsers() {

    // =====================================
    // STATES
    // =====================================

    const [users, setUsers] =
        useState([]);

    const [message, setMessage] =
        useState("");

    // =====================================
    // FETCH USERS
    // =====================================

    useEffect(() => {

        fetch(`${API_BASE}/admin/users`)

            .then((res) => res.json())

            .then((data) => {

                setUsers(data);

            })

            .catch((err) => {

                console.error(err);

                setMessage(
                    "Failed to load users"
                );
            });

    }, []);

    // =====================================
    // RESET PASSWORD
    // =====================================

    const resetPassword = async (
        rollNo
    ) => {

        const tempPassword =
            prompt(
                "Enter Temporary Password"
            );

        if (!tempPassword) return;

        try {

            const res = await fetch(

                `${API_BASE}/admin-reset-password`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        roll_no: rollNo,

                        temp_password:
                            tempPassword
                    })
                }
            );

            const data =
                await res.json();

            if (data.success) {

                setMessage(
                    `Password reset for ${rollNo}`
                );
            }

            else {

                setMessage(
                    "Reset failed"
                );
            }

        }

        catch (err) {

            console.error(err);

            setMessage(
                "Server Error"
            );
        }
    };

    // =====================================
    // UI
    // =====================================

    return (

        <div

            className="container-fluid min-vh-100 p-5 text-white"

            style={{

                background:
                    "linear-gradient(135deg,#020617,#0f172a,#111827)",

                fontFamily:
                    "'Poppins', sans-serif"
            }}
        >

            {/* HEADER */}

            <div className="mb-5">

                <h1
                    style={{
                        fontSize: "3rem",
                        fontWeight: "700"
                    }}
                >

                    👨‍💼 Admin Users Panel

                </h1>

                <p
                    style={{
                        color: "#94a3b8"
                    }}
                >

                    Manage student accounts,
                    passwords and login status.

                </p>

            </div>

            {/* MESSAGE */}

            {

                message && (

                    <div
                        className="alert alert-info border-0"
                        style={{
                            borderRadius: "18px"
                        }}
                    >

                        {message}

                    </div>
                )
            }

            {/* TABLE CARD */}

            <div

                className="p-4"

                style={{

                    background:
                        "rgba(255,255,255,0.05)",

                    borderRadius: "28px",

                    border:
                        "1px solid rgba(255,255,255,0.08)"
                }}
            >

                <div className="table-responsive">

                    <table

                        className="table align-middle"

                        style={{
                            color: "white"
                        }}
                    >

                        {/* TABLE HEAD */}

                        <thead>

                            <tr>

                                <th>Roll No</th>

                                <th>Temp Password</th>

                                <th>Password</th>

                                <th>Email</th>

                                <th>Status</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        {/* TABLE BODY */}

                        <tbody>

                            {

                                users.map(

                                    (user, index) => (

                                        <tr
                                            key={index}
                                        >

                                            <td>

                                                {user.Roll_no}

                                            </td>

                                            <td>

                                                {

                                                    user.Temp_Password

                                                    ||

                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {

                                                    user.Password

                                                    ||

                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {

                                                    user.Email

                                                    ||

                                                    "-"
                                                }

                                            </td>

                                            <td>

                                                {

                                                    user.First_Login

                                                    ?

                                                    (

                                                        <span
                                                            className="badge bg-warning text-dark"
                                                        >

                                                            Pending

                                                        </span>
                                                    )

                                                    :

                                                    (

                                                        <span
                                                            className="badge bg-success"
                                                        >

                                                            Completed

                                                        </span>
                                                    )
                                                }

                                            </td>

                                            {/* ACTION BUTTONS */}

                                            <td>

                                                <div className="d-flex gap-2">

                                                    {/* RESET PASSWORD */}

                                                    <button

                                                        className="btn btn-warning btn-sm"

                                                        onClick={() =>

                                                            resetPassword(

                                                                user.Roll_no
                                                            )
                                                        }
                                                    >

                                                        Reset Password

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

export default AdminUsers;