import React from 'react';
import { AlertTriangle, Phone, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CrisisModal = ({ open, onClose, helpline = '988', actions = [] }) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="card-elevated w-full max-w-md border-red-500/40 shadow-2xl shadow-red-500/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
                        >
                            <X size={24} />
                        </motion.button>

                        {/* Header */}
                        <div className="mb-8 flex items-start gap-4">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="p-3 bg-red-500/20 rounded-2xl"
                            >
                                <AlertTriangle size={36} className="text-red-400" />
                            </motion.div>
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-red-400 mb-2">Emergency Support Needed</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    Our system detected elevated stress levels. Help is immediately available.
                                </p>
                            </div>
                        </div>

                        {/* Helpline - PROMINENT */}
                        <div className="mb-8 relative">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                href={`tel:${helpline}`}
                                className="flex items-center gap-4 p-6 bg-gradient-to-r from-red-600 to-red-500 rounded-3xl hover:shadow-2xl hover:shadow-red-500/50 transition-all group border-2 border-red-400/50"
                            >
                                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                    <Phone size={32} className="text-white fill-white" />
                                </motion.div>
                                <div>
                                    <p className="text-white/90 text-sm font-semibold">Call 24/7 Crisis Helpline</p>
                                    <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform origin-left">{helpline}</p>
                                </div>
                            </motion.a>
                        </div>

                        {/* Emergency Warning */}
                        <div className="mb-8 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl">
                            <p className="text-white/90 text-sm font-semibold">
                                🚨 If you're in immediate physical danger, call 911 or your local emergency number
                            </p>
                        </div>

                        {/* Support Resources */}
                        <div className="mb-8">
                            <p className="text-white/80 text-sm font-semibold mb-4">Available Support</p>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <Heart size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/90 font-medium text-sm">Crisis Counseling</p>
                                        <p className="text-white/60 text-xs">Free, confidential support anytime</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                                    <AlertTriangle size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-white/90 font-medium text-sm">Immediate Assessment</p>
                                        <p className="text-white/60 text-xs">Professional guidance right now</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Actions */}
                        {actions && actions.length > 0 && (
                            <div className="mb-8">
                                <p className="text-white/80 text-sm font-semibold mb-3">Helpful Actions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {actions.map((action, idx) => (
                                        <motion.button
                                            key={action}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ scale: 1.05 }}
                                            className="px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 rounded-xl text-sm font-medium transition-all text-indigo-300 capitalize text-center"
                                        >
                                            {action.replace(/_/g, ' ')}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-semibold transition-all"
                            >
                                I'm Safe
                            </motion.button>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={`tel:${helpline}`}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-2xl font-bold transition-all shadow-lg shadow-red-500/50 text-white flex items-center justify-center gap-2"
                            >
                                <Phone size={18} /> Call Now
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CrisisModal;
