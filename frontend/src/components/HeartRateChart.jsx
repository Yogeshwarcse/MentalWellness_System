import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const HeartRateChart = ({ data = [] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card-elevated"
        >
            <div className="flex items-center gap-2 mb-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Heart className="text-red-500 fill-red-400" size={24} />
                </motion.div>
                <div>
                    <h4 className="font-bold text-lg">Heart Rate</h4>
                    <p className="text-xs text-white/50">Real-time biometric data</p>
                </div>
            </div>
            {data && data.length > 0 ? (
                <div style={{ width: '100%' }} className="hover:shadow-lg transition-all">
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorHeartRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t) => new Date(t).toLocaleTimeString('', { hour: '2-digit', minute: '2-digit' })}
                                stroke="#ffffff40"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#ffffff40" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '12px',
                                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
                                }}
                                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                                formatter={(value) => [`${Math.round(value)} BPM`, 'Heart Rate']}
                            />
                            <Line
                                type="monotone"
                                dataKey="heartRate"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={false}
                                isAnimationActive={true}
                                animationDuration={600}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-48 flex items-center justify-center text-white/40">
                    <p className="text-center">No heart rate data available yet</p>
                </div>
            )}
        </motion.div>
    );
};

export default HeartRateChart;
