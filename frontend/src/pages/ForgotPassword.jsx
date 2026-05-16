function ForgotPassword() {

    return (

        <div
            className="container min-vh-100 d-flex justify-content-center align-items-center text-white"
            style={{
                background:
                    "linear-gradient(135deg, #020617, #0f172a, #111827)"
            }}
        >

            <div
                className="card p-5 border-0"
                style={{
                    background:
                        "rgba(255,255,255,0.05)",
                    borderRadius: "30px",
                    width: "100%",
                    maxWidth: "500px",
                    color: "white"
                }}
            >

                <h1 className="mb-4">

                    Forgot Password

                </h1>

                <p
                    style={{
                        color: "#94a3b8"
                    }}
                >

                    Contact admin to reset your password.

                </p>

            </div>

        </div>
    );
}

export default ForgotPassword;