import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Smile } from 'lucide-react';

const StressMeter = ({ score = 0 }) => {
    const level = score <= 30 ? 'Calm' : score <= 60 ? 'Mild' : score <= 80 ? 'High' : 'Critical';
    const colors = {
        bg: score <= 30 ? 'bg-emerald-500/20 border-emerald-500/30' : score <= 60 ? 'bg-yellow-500/20 border-yellow-500/30' : score <= 80 ? 'bg-orange-500/20 border-orange-500/30' : 'bg-red-500/20 border-red-500/30',
        bar: score <= 30 ? 'from-emerald-400 to-emerald-500' : score <= 60 ? 'from-yellow-400 to-yellow-500' : score <= 80 ? 'from-orange-400 to-orange-500' : 'from-red-400 to-red-500',
        text: score <= 30 ? 'text-emerald-400' : score <= 60 ? 'text-yellow-400' : score <= 80 ? 'text-orange-400' : 'text-red-400',
        icon: score <= 30 ? Smile : score <= 60 ? AlertTriangle : AlertTriangle,
    };

    const Icon = colors.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`p-5 rounded-2xl border backdrop-blur-sm ${colors.bg} hover:shadow-lg transition-all`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Icon size={20} className={colors.text} />
                    </motion.div>
                    <h4 className="font-bold text-white">Stress Level</h4>
                </div>
                <motion.span
                    key={score}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`text-2xl font-bold ${colors.text}`}
                >
                    {score}
                </motion.span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <motion.div
                    key={score}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: 'easeOut', type: 'spring' }}
                    className={`h-full bg-gradient-to-r ${colors.bar} shadow-lg shadow-current`}
                />
            </div>
            <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-white/60 font-medium">Current Status</p>
                <motion.div
                    key={level}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`text-sm font-bold px-3 py-1 rounded-full ${colors.bg}`}
                >
                    <span className={colors.text}>{level}</span>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default StressMeter;
