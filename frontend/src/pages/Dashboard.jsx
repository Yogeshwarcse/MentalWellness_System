import React, { useState, useEffect } from 'react';
import { useVoice } from '../hooks/useVoice';
import { wellnessService } from '../services/api';
import StressMeter from '../components/StressMeter';
import CrisisModal from '../components/CrisisModal';
import MindfulnessDashboard from '../components/MindfulnessDashboard';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Mic, MicOff, MessageCircle, TrendingUp, History, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { isRecording, startRecording, stopRecording, speak, voiceError } = useVoice();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState(null);
    const [lastDetection, setLastDetection] = useState(null);
    const [crisisOpen, setCrisisOpen] = useState(false);

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
            fear: 'text-purple-400',
            disgust: 'text-orange-400'
        };
        return colors[emotion] || 'text-white';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Interaction Area */}
            <div className="lg:col-span-8 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="card-elevated relative overflow-hidden h-[450px] flex flex-col items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

                    <h2 className="text-4xl font-bold mb-2 text-center text-gradient">How are you feeling?</h2>
                    <p className="text-white/70 mb-12 text-center max-w-lg">Press the button and speak. Our AI will listen to your tone and respond with empathy.</p>

                    <div className="relative">
                        <AnimatePresence>
                            {isRecording && (
                                <>
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.3 }}
                                        animate={{ scale: 1.6, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                                        className="absolute inset-0 bg-indigo-500 rounded-full"
                                    />
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.3, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                                        className="absolute inset-0 bg-purple-500 rounded-full"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={!loading ? { scale: 1.1 } : {}}
                            whileTap={!loading ? { scale: 0.95 } : {}}
                            onClick={handleVoiceInteraction}
                            disabled={loading}
                            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl font-bold text-lg ${isRecording
                                ? 'bg-gradient-to-br from-red-500 to-red-600 scale-110'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-2xl hover:shadow-indigo-500/50'
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
                                        className="w-1.5 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                                    />
                                ))}
                            </div>
                        )}
                        {loading && <p className="text-indigo-400 animate-pulse font-semibold">Analyzing your emotion...</p>}
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
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mt-6 p-5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-start gap-4 max-w-lg"
                        >
                            <MessageCircle className="text-indigo-400 shrink-0 mt-1" size={24} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider">
                                    Detected: <span className={`${getMoodColor(lastDetection.emotion)} font-bold`}>{lastDetection.emotion.toUpperCase()}</span>
                                </p>
                                <p className="text-white/90 italic leading-relaxed">"{lastDetection.aiResponse}"</p>
                                {typeof lastDetection.stressScore !== 'undefined' && <div className="mt-3"><StressMeter score={lastDetection.stressScore} /></div>}
                                {lastDetection.crisis && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 font-bold text-sm">🚨 Crisis Support Activated</motion.div>}
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
                        <TrendingUp className="text-purple-400" />
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
                            <p className="text-red-400 mb-4 font-semibold glow-text">{historyError}</p>
                            <button onClick={fetchHistory} className="btn-secondary text-sm px-6 py-2">Retry Loading</button>
                        </div>
                    ) : history.length > 0 ? (
                        <div className="h-80" style={{ minWidth: 0, minHeight: 200 }}>
                            <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={history.slice().reverse()}>
                                    <defs>
                                        <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis
                                        dataKey="timestamp"
                                        tickFormatter={(str) => new Date(str).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        stroke="#ffffff40"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#ffffff40"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '16px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                                            backdropFilter: 'blur(8px)'
                                        }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                                    <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'High Stress', fill: '#ef4444', fontSize: 10, position: 'top' }} />

                                    <Area
                                        type="monotone"
                                        dataKey="confidence"
                                        name="Confidence"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorConf)"
                                        animationDuration={1000}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="stressScore"
                                        name="Stress Level"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorStress)"
                                        animationDuration={1200}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-80 flex items-center justify-center text-white/40">
                            <p className="text-center italic">No data yet - start a session to see your trends</p>
                        </div>
                    )}
                </motion.div>

                <div>
                    <MindfulnessDashboard />
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
                            <History className="text-indigo-400" size={26} />
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
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    whileHover={{ x: 5, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                    className="group p-4 bg-gradient-to-br from-white/8 to-white/3 rounded-2xl border border-white/10 hover:border-indigo-500/30 transition-all cursor-default"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-white/5 ${getMoodColor(log.emotion)}`}>
                                            {log.emotion}
                                        </span>
                                        <span className="text-[11px] text-white/40 font-medium">
                                            {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/75 line-clamp-3 italic leading-relaxed">"{log.aiResponse}"</p>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white/40 py-12">
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
                    className="bg-gradient-to-br from-indigo-600/20 to-purple-600/10 rounded-3xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
                >
                    <div className="flex items-start gap-3">
                        <motion.div animate={{ bounce: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Info className="text-indigo-400 mt-1" size={22} />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-white mb-2">Daily Wellness Tip</h4>
                            <p className="text-sm text-white/80 leading-relaxed">
                                Take deep breaths throughout the day. Even 2-3 minutes of box breathing can help reset your nervous system and improve focus.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
