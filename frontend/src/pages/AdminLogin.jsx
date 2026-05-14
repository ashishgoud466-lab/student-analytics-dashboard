import { useState } from "react";

function AdminLogin() {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleLogin = () => {

        // SIMPLE ADMIN LOGIN

        if (

            username === "admin"

            &&

            password === "admin123"

        ) {

            window.location.href =
                "/#/admin/users";

        }

        else {

            setMessage("Invalid admin credentials");
        }
    };

    return (

        <div className="container mt-5">

            <div
                className="card shadow p-4 mx-auto"
                style={{ maxWidth: "400px" }}
            >

                <h2 className="text-center mb-4">

                    Admin Login

                </h2>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Admin Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="btn btn-dark"
                    onClick={handleLogin}
                >

                    Login

                </button>

                {

                    message &&

                    <p className="mt-3 text-center text-danger">

                        {message}

                    </p>
                }

            </div>

        </div>
    );
}

export default AdminLogin;