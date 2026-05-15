function Dashboard() {

    return (

        <div className="min-h-screen bg-black text-white flex">

            {/* ========================= */}
            {/* SIDEBAR */}
            {/* ========================= */}

            <div className="w-72 bg-zinc-900 p-6">

                <h1 className="text-3xl font-bold mb-10">

                    Student Portal

                </h1>

                <div className="space-y-4">

                    <button className="w-full text-left bg-white text-black px-4 py-3 rounded-2xl">

                        Dashboard

                    </button>

                    <button className="w-full text-left hover:bg-zinc-800 px-4 py-3 rounded-2xl">

                        Semesters

                    </button>

                    <button className="w-full text-left hover:bg-zinc-800 px-4 py-3 rounded-2xl">

                        Analytics

                    </button>

                    <button className="w-full text-left hover:bg-zinc-800 px-4 py-3 rounded-2xl">

                        Settings

                    </button>

                </div>

            </div>

            {/* ========================= */}
            {/* MAIN */}
            {/* ========================= */}

            <div className="flex-1 p-8">

                {/* TOPBAR */}

                <div className="flex justify-between items-center mb-10">

                    <div>

                        <h1 className="text-5xl font-bold">

                            Welcome Back 👋

                        </h1>

                        <p className="text-zinc-400 mt-2">

                            Student analytics dashboard

                        </p>

                    </div>

                    {/* PROFILE */}

                    <div className="flex items-center gap-4">

                        <div className="text-right">

                            <h3 className="font-semibold">

                                Shyam Goud

                            </h3>

                            <p className="text-zinc-400 text-sm">

                                24011M2104

                            </p>

                        </div>

                        <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center text-xl font-bold">

                            S

                        </div>

                    </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    <div className="bg-zinc-900 rounded-3xl p-6">

                        <p className="text-zinc-400 mb-3">

                            SGPA

                        </p>

                        <h1 className="text-5xl font-bold">

                            8.52

                        </h1>

                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-6">

                        <p className="text-zinc-400 mb-3">

                            Highest GP

                        </p>

                        <h1 className="text-5xl font-bold">

                            10

                        </h1>

                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-6">

                        <p className="text-zinc-400 mb-3">

                            Total Subjects

                        </p>

                        <h1 className="text-5xl font-bold">

                            42

                        </h1>

                    </div>

                    <div className="bg-zinc-900 rounded-3xl p-6">

                        <p className="text-zinc-400 mb-3">

                            Backlogs

                        </p>

                        <h1 className="text-5xl font-bold text-red-400">

                            0

                        </h1>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;