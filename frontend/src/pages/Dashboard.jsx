import React, { useState, useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { wellnessService } from '../services/api';
import StressMeter from '../components/StressMeter';
import CrisisModal from '../components/CrisisModal';
import MindfulnessDashboard from '../components/MindfulnessDashboard';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Mic, MicOff, MessageCircle, TrendingUp, History, Info, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_EMOJIS = {
    happy: ['✨', '🌟', '😊', '🎉', '🌻', '☀️'],
    sad: ['🌧️', '🫂', '💙', '☁️', '🪴', '🍵'],
    angry: ['💨', '🌊', '🧘', '🌿', '🍃', '🕊️'],
    neutral: ['🌱', '💭', '🍵', '📚', '🪴', '⚖️'],
    surprise: ['✨', '🌠', '😮', '🎈', '🎇', '🎊'],
    fear: ['🫂', '🛡️', '🕯️', '🌿', '🪶', '🤝'],
    disgust: ['🍃', '🧼', '🌊', '🌬️', '🪴', '🚿']
};

const MOOD_MOTIVATIONS = {
    happy: [
        "Keep shining! Your joy is contagious. ✨",
        "Embrace this positive energy. 🌟",
        "Celebrate the good moments today. 🎉"
    ],
    sad: [
        "It's okay to feel down. Be gentle with yourself. 💙",
        "This feeling will pass. You are not alone. 🫂",
        "Take all the time you need to heal. 🌿"
    ],
    angry: [
        "Take a deep breath. Let it out slowly. 💨",
        "Your feelings are valid. Find a calm release. 🌊",
        "Peace begins with a single step back. 🧘"
    ],
    neutral: [
        "Find balance in the present moment. ⚖️",
        "A calm mind brings inner peace. 🍵",
        "Embrace the stillness of today. 🌿"
    ],
    surprise: [
        "Embrace the unexpected with an open heart. 🎇",
        "Life is full of wonderful surprises. 🌠",
        "A new perspective brings new opportunities. ✨"
    ],
    fear: [
        "You are stronger than your worries. 🛡️",
        "It's okay to be scared. Take it one step at a time. 🤝",
        "Courage is moving forward despite the fear. 🕯️"
    ],
    disgust: [
        "Acknowledge your feelings, then let them wash away. 🌊",
        "Protect your peace and set healthy boundaries. 🛡️",
        "Focus on what brings you clarity and comfort. 🍃"
    ]
};

const Dashboard = () => {
    const { isRecording, startRecording, stopRecording, speak, voiceError } = useVoice();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState(null);
    const [lastDetection, setLastDetection] = useState(null);
    const [crisisOpen, setCrisisOpen] = useState(false);
    const [popupEmoji, setPopupEmoji] = useState(null);
    const [popupMessage, setPopupMessage] = useState(null);

    const fetchHistory = async () => {
        try {
            setLoadingHistory(true);
            setHistoryError(null);
            const { data } = await wellnessService.getHistory();
            setHistory(data);
        } catch (err) {
            console.error('Failed to fetch history');
            setHistoryError('Unable to load your wellness history at this time.');
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleVoiceInteraction = async () => {
        if (isRecording) {
            const audioBlob = await stopRecording();
            if (audioBlob) {
                setLoading(true);
                try {
                    const { data } = await wellnessService.processVoice(audioBlob);
                    setLastDetection(data);
                    speak(data.aiResponse);
                    fetchHistory();

                    if (data && data.emotion) {
                        const emotionKey = data.emotion.toLowerCase();
                        const emojis = MOOD_EMOJIS[emotionKey] || MOOD_EMOJIS['neutral'];
                        const motivations = MOOD_MOTIVATIONS[emotionKey] || MOOD_MOTIVATIONS['neutral'];
                        const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                        const selectedMotivation = motivations[Math.floor(Math.random() * motivations.length)];
                        
                        setPopupEmoji(selectedEmoji);
                        setPopupMessage(selectedMotivation);
                        
                        setTimeout(() => {
                            const guidanceEl = document.getElementById('mindfulness-section');
                            if (guidanceEl) guidanceEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 500);

                        setTimeout(() => {
                            setPopupEmoji(null);
                            setPopupMessage(null);
                        }, 4000);
                    }
                } catch (err) {
                    console.error('Voice processing error');
                } finally {
                    setLoading(false);
                }
            }
        } else {
            startRecording();
        }
    };

    const getMoodColor = (emotion) => {
        const colors = {
            happy: 'text-green-400',
            sad: 'text-blue-400',
            angry: 'text-red-400',
            neutral: 'text-gray-400',
            surprise: 'text-yellow-400',
            fear: 'text-teal-400',
            disgust: 'text-orange-400'
        };
        return colors[emotion] || 'text-white';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Interaction Area */}
            <div className="lg:col-span-8 space-y-8 relative">
                {/* Popup Emoji Overlay */}
                <AnimatePresence>
                    {popupEmoji && (
                        <div className="fixed inset-0 pointer-events-none z-[100] flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-sm transition-all duration-500">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                className="text-[12rem] drop-shadow-2xl animate-emoji-pop-center"
                            >
                                {popupEmoji}
                            </motion.div>
                            {popupMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
                                    className="mt-6 px-8 py-5 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100/50"
                                >
                                    <p className="text-xl md:text-2xl font-bold text-slate-800 text-center tracking-wide">
                                        {popupMessage}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.01, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.15)' }}
                    className="card-elevated relative overflow-hidden h-[450px] flex flex-col items-center justify-center group"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-teal-500/10 pointer-events-none"></div>

                    <h2 className="text-4xl font-bold mb-2 text-center text-gradient">How are you feeling?</h2>
                    <p className="text-slate-600 mb-12 text-center max-w-lg">Press the button and speak. Our AI will listen to your tone and respond with empathy.</p>

                    <div className="relative">
                        <AnimatePresence>
                            {isRecording && (
                                <>
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.6 }}
                                        animate={{ scale: 1.8, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full blur-md"
                                    />
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.8 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 0.4 }}
                                        className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-sm"
                                    />
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.4 }}
                                        animate={{ scale: 2.2, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.1 }}
                                        className="absolute inset-0 bg-cyan-400 rounded-full blur-xl"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={!loading ? { scale: 1.1, boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                            onClick={handleVoiceInteraction}
                            disabled={loading}
                            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl font-bold text-lg ${isRecording
                                ? 'bg-gradient-to-br from-rose-500 to-rose-600 scale-110'
                                : 'bg-gradient-to-br from-cyan-500 to-teal-600 hover:shadow-2xl hover:shadow-cyan-500/50'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isRecording ? <MicOff size={40} /> : <Mic size={40} />}
                        </motion.button>
                    </div>

                    <div className="mt-10 h-12 flex items-center justify-center">
                        {isRecording && (
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 30, 8] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                        className="w-1.5 bg-gradient-to-t from-cyan-500 to-teal-400 rounded-full"
                                    />
                                ))}
                            </div>
                        )}
                        {loading && <p className="text-cyan-400 animate-pulse font-semibold">Analyzing your emotion...</p>}
                        <AnimatePresence>
                            {voiceError && (
                                <motion.p
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-red-400 text-sm font-semibold mt-2"
                                >
                                    {voiceError}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    {lastDetection && (
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="mt-6 p-5 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-start gap-4 max-w-lg shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                        >
                            <MessageCircle className="text-cyan-400 shrink-0 mt-1" size={24} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                                    Detected: <span className={`${getMoodColor(lastDetection.emotion)} font-bold`}>{lastDetection.emotion.toUpperCase()}</span>
                                </p>
                                <p className="text-slate-700 italic leading-relaxed">"{lastDetection.aiResponse}"</p>
                                {typeof lastDetection.stressScore !== 'undefined' && <div className="mt-3"><StressMeter score={lastDetection.stressScore} /></div>}
                                {lastDetection.crisis && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-red-100 border border-red-200 rounded-xl text-red-600 font-bold text-sm">🚨 Crisis Support Activated</motion.div>}
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="card-elevated"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="text-teal-400" />
                        <h3 className="text-xl font-bold">Emotion Trends</h3>
                    </div>
                    {loadingHistory ? (
                        <div className="h-80 space-y-4 pt-10 px-8">
                            <div className="h-4 skeleton w-full"></div>
                            <div className="h-40 skeleton w-full"></div>
                            <div className="h-4 skeleton w-2/3"></div>
                        </div>
                    ) : historyError ? (
                        <div className="h-80 flex flex-col items-center justify-center text-center px-4">
                            <p className="text-red-500 mb-4 font-semibold">{historyError}</p>
                            <button onClick={fetchHistory} className="btn-secondary text-sm px-6 py-2">Retry Loading</button>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="h-80" style={{ minWidth: 0, minHeight: 200 }}>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={history.slice().reverse()}>
                                    <defs>
                                        <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        stroke="#64748b"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                            color: '#0f172a'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                                    <ReferenceLine y={75} stroke="#f43f5e" strokeDasharray="5 5" label={{ value: 'High Stress', fill: '#f43f5e', fontSize: 10, position: 'top' }} />

                                    <Area
                                        type="monotone"
                                        dataKey="confidence"
                                        name="Confidence"
                                        stroke="#06b6d4"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorConf)"
                                        animationDuration={1000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="stressScore"
                                        name="Stress Level"
                                        stroke="#f43f5e"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorStress)"
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-slate-400">
                            <p className="text-center italic">No data yet - start a session to see your trends</p>
                        </div>
                    )}
                </motion.div>

                <div id="mindfulness-section">
                    <MindfulnessDashboard
                        currentEmotion={lastDetection?.emotion}
                        mindfulnessGuidance={lastDetection?.mindfulnessGuidance}
                    />
                </div>
            </div>

            {/* Sidebar / History */}
            <div className="lg:col-span-4 space-y-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="card-elevated"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            <History className="text-cyan-400" size={26} />
                        </motion.div>
                        <h3 className="text-xl font-bold">Session History</h3>
                    </div>
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                        {loadingHistory ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-28 skeleton w-full rounded-2xl opacity-40" />
                                ))}
                            </div>
                        ) : historyError ? (
                            <div className="py-12 text-center">
                                <p className="text-red-400 text-sm italic">{historyError}</p>
                            </div>
                        ) : history.length > 0 ? (
                            history.map((log, idx) => (
                                <motion.div
                                    key={log._id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 182, 212, 0.05)', boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)' }}
                                    className="group p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200 hover:border-cyan-400 transition-all cursor-default relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/0 via-cyan-500/5 to-cyan-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-100 ${getMoodColor(log.emotion)}`}>
                                            {log.emotion}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-3 italic leading-relaxed">"{log.aiResponse}"</p>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-slate-400 py-12">
                                <History size={32} className="mx-auto mb-3 opacity-20" />
                                <p>No sessions yet</p>
                                <p className="text-xs">Start a session to track your progress</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <CrisisModal open={crisisOpen || (lastDetection && lastDetection.crisis)} onClose={() => setCrisisOpen(false)} helpline={(lastDetection && lastDetection.helpline) || '988'} actions={(lastDetection && lastDetection.actions || lastDetection && lastDetection.actionPlan) || []} />

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-cyan-600/20 to-teal-600/10 rounded-3xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                >
                    <div className="flex items-start gap-3">
                        <motion.div animate={{ bounce: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Info className="text-teal-500 mt-1" size={22} />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-2">Daily Wellness Tip</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Take deep breaths throughout the day. Even 2-3 minutes of box breathing can help reset your nervous system and improve focus.
                            </p>
                            <Link 
                                to="/breathing" 
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all w-fit text-sm"
                            >
                                <Wind size={16} /> Start
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
