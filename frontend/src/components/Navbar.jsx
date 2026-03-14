import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, User, LogOut, Activity, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
                    >
                        <motion.div
                            whileHover={{ rotate: 20, scale: 1.1 }}
                            className="text-2xl font-bold"
                        >
                            <Heart className="text-indigo-500 fill-indigo-400 drop-shadow-lg" size={28} />
                        </motion.div>
                        <span className="hidden sm:inline text-lg font-bold">Serenity</span>
                    </motion.div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-white/70 hover:text-indigo-400 transition-colors flex items-center gap-2 font-medium hover:gap-3">
                                <Activity size={18} /> Dashboard
                            </Link>
                            <Link to="/breathing" className="text-white/70 hover:text-purple-400 transition-colors font-medium">Mindfulness</Link>
                            <div className="h-6 w-[1px] bg-gradient-to-b from-white/0 via-white/20 to-white/0"></div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:bg-indigo-500/15"
                            >
                                <User size={18} className="text-indigo-400" />
                                <span className="font-medium text-white/90">{user.name?.split(' ')[0]}</span>
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onLogout}
                                className="p-2 hover:bg-red-500/20 rounded-xl text-red-400 transition-all group"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white/70 hover:text-indigo-400 transition-colors font-medium">Login</Link>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/register" className="btn-primary">Get Started</Link>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 hover:bg-indigo-500/20 rounded-lg transition-all"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="md:hidden glass border-t border-white/10 p-4 space-y-3"
                >
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block px-4 py-2.5 text-white/80 hover:text-indigo-400 rounded-xl hover:bg-indigo-500/10 transition-all font-medium">
                                <div className="flex items-center gap-2">
                                    <Activity size={18} /> Dashboard
                                </div>
                            </Link>
                            <Link to="/breathing" className="block px-4 py-2.5 text-white/80 hover:text-purple-400 rounded-xl hover:bg-purple-500/10 transition-all font-medium">
                                Mindfulness
                            </Link>
                            <div className="h-[1px] bg-white/10 my-2"></div>
                            <div className="px-4 py-2.5 text-white/80 flex items-center gap-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <User size={18} className="text-indigo-400" /> {user.name}
                            </div>
                            <button
                                onClick={() => {
                                    onLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-2 font-medium"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-4 py-2.5 text-white/80 hover:text-indigo-400 rounded-xl hover:bg-indigo-500/10 transition-all font-medium">
                                Login
                            </Link>
                            <motion.div whileTap={{ scale: 0.95 }}>
                                <Link to="/register" className="block px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all text-center font-semibold">
                                    Get Started
                                </Link>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            )}
        </nav>
    );
};

export default Navbar;
