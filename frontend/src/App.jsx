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
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden">
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
