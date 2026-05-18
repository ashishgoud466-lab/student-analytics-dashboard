import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid

} from "recharts";

import { useEffect, useState } from "react";

function Analytics() {

    const [sgpaData, setSgpaData] = useState([]);

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const rollNo = localStorage.getItem("roll_no");

                const res = await fetch(

                    `https://student-analytics-dashboard-ekzt.onrender.com/analytics/${rollNo}`
                );

                const data = await res.json();

                console.log(data);

                setSgpaData(data.analytics || []);

            }

            catch (err) {

                console.log(err);
            }
        };

        fetchAnalytics();

    }, []);

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

                    <ResponsiveContainer width="100%" height="100%">

                        <LineChart data={sgpaData}>

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis dataKey="Sem_id" />

                            <YAxis />

                            <Tooltip />

                            <Line

                                type="monotone"

                                dataKey="SGPA"

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