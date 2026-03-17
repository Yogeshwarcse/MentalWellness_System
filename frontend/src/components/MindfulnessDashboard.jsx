import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MindfulnessDashboard = ({ currentEmotion, mindfulnessGuidance }) => {
    const [dailyTip, setDailyTip] = useState('');

    const quotes = {
        happy: "Your joy is a light—share it with the world today.",
        sad: "It's okay to feel. Be as kind to yourself as you would be to a friend.",
        angry: "Take a deep breath. You are stronger than this moment's frustration.",
        neutral: "In the stillness, you can find the clarity you seek.",
        anxious: "Ground yourself in the present. You are safe here.",
        fallback: "Every breath is a new beginning. Stay mindful."
    };

    const dynamicTip = useMemo(() => {
        if (mindfulnessGuidance && (mindfulnessGuidance.message || mindfulnessGuidance.title)) {
            const title = mindfulnessGuidance.title ? `${mindfulnessGuidance.title}` : 'Mindfulness Guidance';
            const message = mindfulnessGuidance.message || '';
            return { title, message };
        }
        const key = (currentEmotion || '').toLowerCase();
        if (quotes[key]) return { title: 'Reflect & Breathe', message: quotes[key] };
        return { title: 'Reflect & Breathe', message: quotes.fallback };
    }, [currentEmotion, mindfulnessGuidance]);

    useEffect(() => {
        setDailyTip(dynamicTip.message);
    }, [dynamicTip]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-elevated"
        >
            <div className="flex items-center gap-3 mb-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <Sparkles className="text-teal-400" size={28} />
                </motion.div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Mindfulness Guidance</h3>
                    <p className="text-xs text-slate-500">Your personalized wellness companion</p>
                </div>
            </div>

            {/* Daily Tip Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="mb-8 p-6 bg-gradient-to-br from-cyan-500/20 to-teal-600/10 rounded-3xl border border-cyan-400/20 relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl -z-10 group-hover:scale-150 transition-transform duration-1000"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 mb-2">{dynamicTip.title}</p>
                <p className="text-lg font-medium italic text-slate-700 leading-relaxed">
                    "{dailyTip}"
                </p>
                {mindfulnessGuidance?.practice?.steps?.length > 0 && (
                    <div className="mt-4 p-4 bg-white/60 rounded-2xl border border-slate-200">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                            {mindfulnessGuidance.practice.name || 'Try this'}
                            {typeof mindfulnessGuidance.practice.durationMinutes === 'number' ? ` • ${mindfulnessGuidance.practice.durationMinutes} min` : ''}
                        </p>
                        <ul className="text-sm text-slate-700 space-y-1.5">
                            {mindfulnessGuidance.practice.steps.slice(0, 5).map((step) => (
                                <li key={step} className="leading-relaxed">- {step}</li>
                            ))}
                        </ul>
                        {mindfulnessGuidance?.suggestion && (
                            <p className="text-xs text-slate-500 mt-3 leading-relaxed">{mindfulnessGuidance.suggestion}</p>
                        )}
                    </div>
                )}
            </motion.div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-3">Fun Stress-Reducing Games & Activities</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <motion.a
                        href="https://xhalr.com/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50/50 border border-cyan-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">Breath Bubble</p>
                        <p className="text-xs text-slate-600">
                            Interactive visual breathing exercise to calm your mind and lower heart rate.
                        </p>
                    </motion.a>
                    <motion.a
                        href="http://weavesilk.com/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50/50 border border-purple-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">Weave Silk</p>
                        <p className="text-xs text-slate-600">
                            Create stunning, relaxing generative art with just a swipe of your finger.
                        </p>
                    </motion.a>
                    <motion.a
                        href="https://paveldogreat.github.io/WebGL-Fluid-Simulation/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">Fluid Simulation</p>
                        <p className="text-xs text-slate-600">
                            Play with beautiful, mesmerizing colorful fluid dynamics on your screen.
                        </p>
                    </motion.a>
                    <motion.a
                        href="https://asoftmurmur.com/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">A Soft Murmur</p>
                        <p className="text-xs text-slate-600">
                            Mix your own perfect ambient background noise to relax and focus your mind.
                        </p>
                    </motion.a>
                    <motion.a
                        href="https://color.method.ac/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/50 border border-pink-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">Color Match</p>
                        <p className="text-xs text-slate-600">
                            A highly satisfying and visually pleasing color matching game to ground your thoughts.
                        </p>
                    </motion.a>
                    <motion.a
                        href="https://slowroads.io/" target="_blank" rel="noopener noreferrer"
                        whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        className="block p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-sky-50/50 border border-blue-200 text-left transition-all"
                    >
                        <p className="text-sm font-semibold text-slate-800 mb-1">Slow Roads</p>
                        <p className="text-xs text-slate-600">
                            Endless, relaxing driving through procedurally generated picturesque landscapes.
                        </p>
                    </motion.a>
                </div>
            </div>
        </motion.div>
    );
};

export default MindfulnessDashboard;
