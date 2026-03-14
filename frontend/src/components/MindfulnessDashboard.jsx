import React, { useEffect, useState } from 'react';
import { mindfulnessService } from '../services/api';
import { Sparkles, Calendar, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const MindfulnessDashboard = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dailyTip, setDailyTip] = useState('');

    const quotes = {
        happy: "Your joy is a light—share it with the world today.",
        sad: "It's okay to feel. Be as kind to yourself as you would be to a friend.",
        angry: "Take a deep breath. You are stronger than this moment's frustration.",
        neutral: "In the stillness, you can find the clarity you seek.",
        anxious: "Ground yourself in the present. You are safe here.",
        fallback: "Every breath is a new beginning. Stay mindful."
    };

    useEffect(() => {
        // For demo, pick a random one if no mood history, or we could pass mood prop
        const keys = Object.keys(quotes);
        setDailyTip(quotes[keys[Math.floor(Math.random() * keys.length)]]);
    }, []);

    const [generating, setGenerating] = useState(false);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await mindfulnessService.getPlans();
            setPlans(data);
        } catch (err) {
            console.error('Failed to fetch plans');
            setError('Could not retrieve mindfulness plans. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            await mindfulnessService.generate();
            await fetchPlans();
        } catch (err) {
            console.error('Failed to generate plan');
            setError('AI generation failed. Please check your connection.');
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-elevated"
        >
            <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Sparkles className="text-purple-400" size={28} />
                    </motion.div>
                    <div>
                        <h3 className="text-xl font-bold">Mindfulness Guidance</h3>
                        <p className="text-xs text-white/60">Your personalized wellness companion</p>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={generating || loading}
                    className="btn-primary text-[10px] px-3 py-1.5 flex items-center gap-2"
                >
                    {generating ? '...' : <><Sparkles size={12} /> Generate</>}
                </button>
            </div>

            {/* Daily Tip Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 bg-gradient-to-br from-indigo-500/20 to-purple-600/10 rounded-3xl border border-indigo-400/20 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Reflect & Breathe</p>
                <p className="text-lg font-medium italic text-indigo-100/90 leading-relaxed">
                    "{dailyTip}"
                </p>
            </motion.div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="h-24 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl animate-pulse border border-white/5"
                        />
                    ))}
                </div>
            ) : error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 px-4 bg-red-500/5 rounded-2xl border border-red-500/10"
                >
                    <p className="text-red-300 text-sm mb-4">{error}</p>
                    <button
                        onClick={fetchPlans}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 transition-all"
                    >
                        Try Again
                    </button>
                </motion.div>
            ) : plans.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 px-4"
                >
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                        <BookOpen size={48} className="mx-auto text-purple-400/30 mb-4" />
                    </motion.div>
                    <p className="text-white/70 font-semibold mb-2">No plans yet</p>
                    <p className="text-sm text-white/50 mb-6">Let our AI analyze your recent mood and create a plan.</p>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="btn-primary px-8 py-3 w-full max-w-xs mx-auto flex items-center justify-center gap-3 font-bold"
                    >
                        {generating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Crafting Plan...
                            </>
                        ) : (
                            <><Sparkles size={20} /> Generate Weekly Plan</>
                        )}
                    </button>
                </motion.div>
            ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 hover:bg-gradient-to-br hover:from-purple-500/15 hover:shadow-lg hover:shadow-purple-500/10 transition-all group cursor-pointer"
                        >
                            <div className="flex items-start gap-3">
                                <motion.div
                                    className="mt-1 p-2 bg-purple-500/20 rounded-lg"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Calendar size={18} className="text-purple-400" />
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Weekly Plan</span>
                                        <span className="text-xs text-white/40 text-right">
                                            {new Date(plan.weekStart).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/75 line-clamp-2 leading-relaxed">{plan.summary || 'Personalized mindfulness guidance'}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default MindfulnessDashboard;
