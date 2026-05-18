import {

    HashRouter,

    Routes,

    Route

} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Analytics from "./pages/Analytics";

import Settings from "./pages/Settings";

import Analytics from "./pages/Analytics";

import ForgotPassword from "./pages/ForgotPassword";

import ChangePassword from "./pages/ChangePassword";

import AdminLogin from "./pages/AdminLogin";

import AdminUsers from "./pages/AdminUsers";

function App() {

    return (

        <HashRouter>

            <Routes>

                <Route

                    path="/"

                    element={<Login />}

                />

                <Route

                    path="/dashboard"

                    element={<Dashboard />}

                />
                <Route
    path="/analytics"
    element={<Analytics />}
/>
                <Route

                    path="/analytics"

                    element={<Analytics />}

                />

                <Route

                    path="/settings"

                    element={<Settings />}

                />

                <Route

                    path="/forgot-password"

                    element={<ForgotPassword />}

                />

                <Route

                    path="/change-password"

                    element={<ChangePassword />}

                />

                <Route

                    path="/admin-login"

                    element={<AdminLogin />}

                />

                <Route

                    path="/admin-users"

                    element={<AdminUsers />}

                />

            </Routes>

        </HashRouter>
    );
}

export default App;