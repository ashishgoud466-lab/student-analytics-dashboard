import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid

} from "recharts";

function Analytics() {

    const sgpaData = [

        {
            semester: "Sem 1",
            sgpa: 7.8
        },

        {
            semester: "Sem 2",
            sgpa: 8.2
        },

        {
            semester: "Sem 3",
            sgpa: 8.9
        },

        {
            semester: "Sem 4",
            sgpa: 9.1
        }
    ];

    return (

        <div

            className="container-fluid min-vh-100 text-white p-5"

            style={{

                background:
                    "linear-gradient(135deg,#020617,#0f172a,#111827)",

                fontFamily:
                    "'Poppins', sans-serif"
            }}
        >

            <h1
                className="mb-5"
                style={{
                    fontWeight: "700"
                }}
            >

                📈 Analytics Dashboard

            </h1>

            <div

                className="p-5"

                style={{

                    background:
                        "rgba(255,255,255,0.05)",

                    border:
                        "1px solid rgba(255,255,255,0.08)",

                    borderRadius: "30px"
                }}
            >

                <h3 className="mb-4">

                    SGPA Progress

                </h3>

                <div style={{ height: "400px" }}>

                    <ResponsiveContainer>

                        <LineChart data={sgpaData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="semester" />

                            <YAxis />

                            <Tooltip />

                            <Line

                                type="monotone"

                                dataKey="sgpa"

                                stroke="#8b5cf6"

                                strokeWidth={4}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>
    );
}

export default Analytics;