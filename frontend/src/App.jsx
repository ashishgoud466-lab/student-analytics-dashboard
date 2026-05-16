import {
    HashRouter,
    Routes,
    Route
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

function App() {

    return (

        <HashRouter>

            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

<Route path="/analytics" element={<Analytics />} />

<Route path="/settings" element={<Settings />} />

                <Route
                    path="/"
                    element={<Dashboard />}
                />
<Route path="/" element={<Login />} />

<Route
path="/dashboard"
element={<Dashboard />}
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

<Route
path="/forgot-password"
element={<ForgotPassword />}
/>
<Toaster />
            </Routes>

        </HashRouter>
    );
}

export default App;