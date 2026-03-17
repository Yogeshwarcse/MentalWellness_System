import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await authService.login(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            <AnimatedBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md z-10 perspective-1000"
            >
                {/* Welcome Section */}
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
                    <motion.div variants={itemVariants} className="mb-4">
                        <h1 className="text-5xl font-bold mb-3 text-gradient">Welcome Back</h1>
                        <p className="text-white/70 text-lg leading-relaxed">Take a deep breath and log into your wellness journey.</p>
                    </motion.div>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="card-elevated"
                >
                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mb-6 bg-red-500/15 border border-red-500/30 text-red-300 p-4 rounded-2xl flex items-start gap-3"
                        >
                            <AlertCircle size={20} className="shrink-0 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </motion.div>
                    )}

                    <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <motion.div variants={itemVariants} className="space-y-3">
                            <label className="text-sm font-semibold text-white/90 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="input-base pl-12 group-focus-within:input-focus transition-all duration-300 shadow-inner"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    autoComplete="email"
                                />
                                <div className="absolute inset-0 border rounded-2xl border-cyan-400/0 group-focus-within:border-cyan-400/50 pointer-events-none transition-all duration-500 scale-105 group-focus-within:scale-100"></div>
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div variants={itemVariants} className="space-y-3">
                            <label className="text-sm font-semibold text-white/90 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="input-base pl-12 group-focus-within:input-focus transition-all duration-300 shadow-inner"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    autoComplete="current-password"
                                />
                                <div className="absolute inset-0 border rounded-2xl border-cyan-400/0 group-focus-within:border-cyan-400/50 pointer-events-none transition-all duration-500 scale-105 group-focus-within:scale-100"></div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-8 text-white font-semibold"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} /> Sign In
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-slate-800/50 text-white/50">New here?</span>
                        </div>
                    </div>

                    {/* Signup Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link to="/register" className="block text-center px-4 py-3 bg-gradient-to-r from-cyan-600/30 to-teal-600/30 hover:from-cyan-600/50 hover:to-teal-600/50 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-300 font-semibold transition-all group flex items-center justify-center gap-2">
                            Create an Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
