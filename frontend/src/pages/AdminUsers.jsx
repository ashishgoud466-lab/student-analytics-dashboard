import { useEffect, useState } from "react";

import API_BASE from "../services/api";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetch(`${API_BASE}/admin/users`)

            .then((res) => res.json())

            .then((data) => {

                setUsers(data);

            });

    }, []);

    return (

        <div className="container mt-4">

            <h1 className="mb-4">

                Admin Users Panel

            </h1>

            <table className="table table-bordered table-hover shadow">

                <thead className="table-dark">

                    <tr>

                        <th>Roll No</th>

                        <th>Temp Password</th>

                        <th>Password</th>

                        <th>Email</th>

                        <th>First Login</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map((user, index) => (

                        <tr key={index}>

                            <td>{user.Roll_no}</td>

                            <td>{user.Temp_Password}</td>

                            <td>{user.Password}</td>

                            <td>{user.Email}</td>

                            <td>

                                {

                                    user.First_Login

                                        ? "Pending"

                                        : "Completed"
                                }

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AdminUsers;