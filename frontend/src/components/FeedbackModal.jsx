import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { feedbackService } from '../services/api';

const FeedbackModal = ({ open, onClose }) => {
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter your feedback.');
            return;
        }

        setSubmitting(true);
        setError('');
        
        try {
            await feedbackService.submit({ rating, message });
            setSuccess(true);
            setTimeout(() => {
                onClose();
                // Reset after closing
                setTimeout(() => {
                    setSuccess(false);
                    setMessage('');
                    setRating(5);
                }, 300);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit feedback.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-0 pointer-events-auto" 
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-2xl pointer-events-auto"
                    >
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-transparent">Share Feedback</h3>
                                <p className="text-sm text-slate-500 mt-1">Help us improve your wellness experience</p>
                            </div>
                        </div>

                        {success ? (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                                className="py-12 text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                                    <Send size={32} />
                                </div>
                                <h4 className="text-xl font-bold text-slate-800 mb-2">Thank you!</h4>
                                <p className="text-slate-600">Your feedback has been received.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">How was your experience today?</label>
                                    <div className="flex justify-between max-w-xs">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className={`text-3xl transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="feedback" className="block text-sm font-bold text-slate-700 mb-2">Your Thoughts</label>
                                    <textarea 
                                        id="feedback"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Tell us what you loved or what we can do better..."
                                        className="w-full bg-white/50 border border-slate-200 rounded-2xl py-3 px-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all resize-none custom-scrollbar"
                                    ></textarea>
                                </div>

                                {error && <p className="text-sm text-rose-500 font-medium">{error}</p>}

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full btn-primary flex justify-center items-center gap-2"
                                >
                                    {submitting ? 'Sending...' : <>Submit Feedback <Send size={18} /></>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FeedbackModal;
