import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden -z-20 pointer-events-none bg-background">
            {/* Ambient Multi-Layer Orbs */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 80, 0],
                    y: [0, 40, 0]
                }}
                className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] bg-cyan-600/30 rounded-full blur-[120px] mix-blend-screen"
            />
            
            <motion.div
                animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.2, 0.45, 0.2],
                    x: [0, -70, 0],
                    y: [0, -50, 0]
                }}
                className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] bg-teal-600/30 rounded-full blur-[120px] mix-blend-screen"
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.3, 0.15],
                    y: [0, -80, 0],
                    x: [0, 30, 0]
                }}
                className="absolute top-[20%] left-[30%] w-[45vw] h-[45vw] bg-rose-600/20 rounded-full blur-[130px] mix-blend-screen"
            />
            
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1],
                    y: [0, 60, 0],
                    x: [0, -40, 0]
                }}
                className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen"
            />
        </div>
    );
};

export default AnimatedBackground;
