import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { User, Mail, Lock, UserPlus, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [strength, setStrength] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const calculateStrength = (pass) => {
        let score = 0;
        if (pass.length > 6) score += 25;
        if (/[A-Z]/.test(pass)) score += 25;
        if (/[0-9]/.test(pass)) score += 25;
        if (/[^A-Za-z0-9]/.test(pass)) score += 25;
        setStrength(score);
    };

    const handlePasswordChange = (e) => {
        const pass = e.target.value;
        setFormData({ ...formData, password: pass });
        calculateStrength(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { data } = await authService.register(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-float"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Welcome Section */}
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-3 text-gradient">Join Serenity</h1>
                    <p className="text-white/70 text-lg">Start your journey to mindful wellness today.</p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="card-elevated"
                >
                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mb-6 bg-red-500/15 border border-red-500/30 text-red-300 p-4 rounded-2xl flex items-start gap-3 shadow-lg shadow-red-500/10"
                            >
                                <AlertCircle size={20} className="shrink-0 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            <label className="text-sm font-semibold text-white/90 block">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="input-base pl-12 group-focus-within:input-focus"
                                    placeholder="John Calm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    autoComplete="name"
                                />
                            </div>
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-3"
                        >
                            <label className="text-sm font-semibold text-white/90 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="input-base pl-12 group-focus-within:input-focus"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    autoComplete="email"
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-3"
                        >
                            <label className="text-sm font-semibold text-white/90 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    minLength="6"
                                    className="input-base pl-12 group-focus-within:input-focus"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Strength Meter */}
                            <div className="mt-2 space-y-1.5">
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${strength}%`,
                                            backgroundColor: strength < 50 ? '#f87171' : strength < 75 ? '#fbbf24' : '#34d399'
                                        }}
                                        className="h-full transition-all duration-500"
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                                    <span>Security Score</span>
                                    <span className={strength < 50 ? 'text-red-400' : strength < 75 ? 'text-yellow-400' : 'text-emerald-400'}>
                                        {strength < 25 ? 'Weak' : strength < 50 ? 'Fair' : strength < 75 ? 'Good' : 'Very Strong'}
                                    </span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/30 italic">Tip: Use mix of uppercase, numbers and symbols</p>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-8 text-white font-semibold"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} /> Create Account
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-slate-800/50 text-white/50">Already a member?</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link to="/login" className="block text-center px-4 py-3 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 rounded-2xl border border-indigo-400/20 hover:border-indigo-400/40 text-indigo-300 font-semibold transition-all group flex items-center justify-center gap-2">
                            Sign In Instead <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;
