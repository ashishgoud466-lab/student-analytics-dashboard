import { useState } from "react";

import API_BASE from "../services/api";

function ChangePassword() {

    const [roll, setRoll] = useState("");

    const [password, setPassword] = useState("");

    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async () => {

        const res = await fetch(
            `${API_BASE}/change-password`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    roll_no: roll,

                    new_password: password,

                    email: email

                })

            }
        );

        const data = await res.json();

        if (data.success) {

            setMessage("Password updated successfully");

        } else {

            setMessage("Something went wrong");
        }
    };

    return (

        <div className="container mt-5">

            <div
                className="card shadow p-4 mx-auto"
                style={{ maxWidth: "400px" }}
            >

                <h2 className="text-center mb-4">

                    Change Password

                </h2>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Roll Number"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                />

                <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-dark"
                    onClick={handleSubmit}
                >

                    Update Password

                </button>

                {

                    message &&

                    <p className="mt-3 text-center">

                        {message}

                    </p>
                }

            </div>

        </div>
    );
}

export default ChangePassword;