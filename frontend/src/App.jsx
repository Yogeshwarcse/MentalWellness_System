import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Breathing from './pages/Breathing';
import Navbar from './components/Navbar';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        } else {
            // Clear any stale data
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <Router>
            <div className="min-h-screen relative overflow-x-hidden text-slate-900 font-sans">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#e0f2fe,transparent_60%),radial-gradient(circle_at_bottom_right,#fce7f3,transparent_60%),radial-gradient(circle_at_top_right,#dcfce3,transparent_60%)]" />
                <div className="pointer-events-none absolute -top-32 -left-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow" />
                <div className="pointer-events-none absolute -bottom-40 right-0 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-float-slow" />
                <Navbar user={user} onLogout={logout} />
                <main className="container mx-auto px-4 py-10">
                    <Routes>
                        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
                        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
                        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
                        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                        <Route path="/breathing" element={user ? <Breathing /> : <Navigate to="/login" />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
