import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Play, Pause, RefreshCw, Info } from 'lucide-react';

const Breathing = () => {
    const [phase, setPhase] = useState('Breathe In');
    const [isActive, setIsActive] = useState(false);
    const [counter, setCounter] = useState(4);
    const [totalCycles, setTotalCycles] = useState(0);

    useEffect(() => {
        let timer;
        if (isActive) {
            timer = setInterval(() => {
                setCounter((prev) => {
                    if (prev === 1) {
                        if (phase === 'Breathe In') {
                            setPhase('Hold');
                            return 4;
                        } else if (phase === 'Hold') {
                            setPhase('Breathe Out');
                            return 4;
                        } else {
                            setPhase('Breathe In');
                            setTotalCycles(c => c + 1);
                            return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isActive, phase]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setPhase('Breathe In');
        setCounter(4);
        setTotalCycles(0);
    };

    const phaseColors = {
        'Breathe In': { glow: 'rgba(6, 182, 212, 0.6)', bg: 'rgba(6, 182, 212, 0.15)', text: 'text-cyan-400', label: 'Inhale' },
        'Hold': { glow: 'rgba(20, 184, 166, 0.6)', bg: 'rgba(20, 184, 166, 0.15)', text: 'text-teal-400', label: 'Hold' },
        'Breathe Out': { glow: 'rgba(244, 63, 94, 0.6)', bg: 'rgba(244, 63, 94, 0.15)', text: 'text-rose-400', label: 'Exhale' },
    };

    const colors = phaseColors[phase];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 max-w-3xl"
            >
                <motion.div className="flex items-center justify-center gap-3 mb-5">
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                        <Wind className="text-cyan-400" size={40} />
                    </motion.div>
                    <h1 className="text-6xl font-bold text-gradient">Guided Breathing</h1>
                </motion.div>
                <p className="text-xl text-slate-700 mb-3 font-semibold">The 4-4-4 Box Breathing Technique</p>
                <p className="text-slate-600">Inhale for 4 seconds, hold for 4, exhale for 4 to calm your nervous system and reduce stress</p>
            </motion.div>

            {/* Main Breathing Circle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                className="relative w-80 h-80 flex items-center justify-center mb-16"
            >
                {/* Outer glow background */}
                <motion.div
                    animate={{ opacity: isActive ? [0.4, 0.7, 0.4] : [0.2, 0.3, 0.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full blur-3xl"
                    style={{ backgroundColor: colors.glow }}
                />

                {/* Background circles */}
                <motion.div
                    animate={{ opacity: isActive ? 0.8 : 0.4 }}
                    className="absolute inset-0 rounded-full border-2 border-white/15"
                />
                <motion.div
                    animate={{ opacity: isActive ? 0.5 : 0.2 }}
                    className="absolute inset-12 rounded-full border-2 border-white/10"
                />
                <motion.div
                    animate={{ opacity: isActive ? 0.3 : 0.1 }}
                    className="absolute inset-24 rounded-full border border-white/5"
                />

                {/* Animated Breathing Circle */}
                <motion.div
                    animate={{
                        scale: phase === 'Breathe In' ? 1.8 : (phase === 'Breathe Out' ? 1.1 : 1.45),
                    }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    className="relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 border-white/30 shadow-2xl"
                    style={{ backgroundColor: colors.bg }}
                >
                    <motion.div
                        animate={{ scale: isActive ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                    >
                        <motion.p
                            key={phase}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`text-xl font-bold mb-3 uppercase tracking-wider ${colors.text}`}
                        >
                            {colors.label}
                        </motion.p>
                        <motion.span
                            key={counter}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.8 }}
                            className="text-8xl font-black text-slate-800 block h-28 flex items-center justify-center -mt-6"
                        >
                            {counter}
                        </motion.span>
                    </motion.div>
                </motion.div>

                {/* Orbiting particles */}
                {isActive && [1, 2, 3, 4, 5].map(i => (
                    <motion.div
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 5 + i * 0.3, ease: 'linear' }}
                        className="absolute inset-0"
                    >
                        <div
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                                top: '0%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: colors.glow,
                                filter: 'blur(0.5px)',
                                boxShadow: `0 0 10px ${colors.glow}`,
                            }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Session Stats */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <p className="text-slate-600 mb-3 font-semibold tracking-wide uppercase text-sm">Breathing Cycles Completed</p>
                    <motion.p
                        key={totalCycles}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
                    >
                        {totalCycles}
                    </motion.p>
                </motion.div>
            )}

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 mb-16"
            >
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggle}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 text-white transition-all text-lg"
                >
                    {isActive ? (
                        <>
                            <Pause size={24} /> Pause
                        </>
                    ) : (
                        <>
                            <Play size={24} /> Start Breathing
                        </>
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={reset}
                    className="flex items-center gap-3 px-10 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl font-bold transition-all text-lg"
                >
                    <RefreshCw size={24} /> Reset
                </motion.button>
            </motion.div>

            {/* Breathing Pattern Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full max-w-4xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    {[
                        { time: '4s', phase: 'Inhale', desc: 'Breathe in deeply through your nose', icon: '🫁', color: 'from-cyan-600/30 to-cyan-600/10' },
                        { time: '4s', phase: 'Hold', desc: 'Keep the breath in your lungs gently', icon: '⏸️', color: 'from-teal-600/30 to-teal-600/10' },
                        { time: '4s', phase: 'Exhale', desc: 'Release the breath through your mouth', icon: '💨', color: 'from-rose-600/30 to-rose-600/10' },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className={`card-elevated text-center border-2 transition-all ${
                                (phase === 'Breathe In' && idx === 0) || (phase === 'Hold' && idx === 1) || (phase === 'Breathe Out' && idx === 2)
                                    ? 'border-white/40 shadow-lg shadow-white/20'
                                    : 'border-white/10'
                            }`}
                        >
                            <span className="text-5xl mb-3 mt-4 block">{item.icon}</span>
                            <span className="block text-2xl font-bold text-slate-800 mb-2">{item.time}</span>
                            <span className="block text-lg font-semibold text-slate-700 mb-2">{item.phase}</span>
                            <span className="block text-sm text-slate-600 mb-4">{item.desc}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Tips */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-br from-cyan-600/20 to-teal-600/10 border-2 border-cyan-500/30 rounded-3xl p-8 shadow-lg"
                >
                    <div className="flex items-start gap-4">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="p-2 bg-cyan-500/20 rounded-xl"
                        >
                            <Info className="text-cyan-400" size={24} />
                        </motion.div>
                        <div>
                            <p className="font-bold text-slate-800 mb-3 text-lg">Pro Tips for Better Results</p>
                            <ul className="text-slate-700 space-y-2 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="text-cyan-600 font-bold">•</span> Find a quiet, comfortable space to practice
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-teal-600 font-bold">•</span> Start with 2-3 cycles, gradually increase to 5-10
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-rose-600 font-bold">•</span> Keep your posture upright but relaxed for best oxygen flow
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-cyan-600 font-bold">•</span> Practice daily for maximum stress relief benefits
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Breathing;
