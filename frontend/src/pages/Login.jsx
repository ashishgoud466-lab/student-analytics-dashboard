import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const [rollNo, setRollNo] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleStudentLogin = () => {

        if (!rollNo.trim()) {

            alert("Enter Roll Number");
            return;
        }

        navigate(`/student/${rollNo}`);
    };

    const handleAdminLogin = () => {

        if (
            username === "admin" &&
            password === "admin123"
        ) {

            navigate("/dashboard");

        } else {

            alert("Invalid Admin Credentials");
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f5f5f5",
                padding: "20px"
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: "40px",
                    borderRadius: "12px",
                    width: "350px",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
                }}
            >

                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "30px"
                    }}
                >
                    Student Analytics Login
                </h1>

                <h3>Student Login</h3>

                <input
                    type="text"
                    placeholder="Enter Roll Number"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <button
                    onClick={handleStudentLogin}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "30px",
                        cursor: "pointer"
                    }}
                >
                    Login as Student
                </button>

                <h3>Admin Login</h3>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                />

                <button
                    onClick={handleAdminLogin}
                    style={{
                        width: "100%",
                        padding: "10px",
                        cursor: "pointer"
                    }}
                >
                    Login as Admin
                </button>

            </div>

        </div>
    );
}

export default Login;