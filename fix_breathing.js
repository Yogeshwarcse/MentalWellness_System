import fs from 'fs';
import path from 'path';

const filePath = path.join('c:', 'Users', 'HP', 'OneDrive', 'Documents', 'MainProjects', 'MentalWellness', 'frontend', 'src', 'pages', 'Breathing.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix phase colors
    content = content.replace(
        /const phaseColors = {[\s\S]*?};/,
        `const phaseColors = {
        'Breathe In': { glow: 'rgba(6, 182, 212, 0.6)', bg: 'rgba(6, 182, 212, 0.15)', text: 'text-cyan-400', label: 'Inhale' },
        'Hold': { glow: 'rgba(20, 184, 166, 0.6)', bg: 'rgba(20, 184, 166, 0.15)', text: 'text-teal-400', label: 'Hold' },
        'Breathe Out': { glow: 'rgba(244, 63, 94, 0.6)', bg: 'rgba(244, 63, 94, 0.15)', text: 'text-rose-400', label: 'Exhale' },
    };`
    );

    // Fix Wind icon color
    content = content.replace(/<Wind className="text-indigo-400" size={40} \/>/g, '<Wind className="text-cyan-400" size={40} />');

    // Fix Breathing Cycles Completed text color
    content = content.replace(/className="text-6xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"/g, 'className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"');

    // Fix Start/Pause button color
    content = content.replace(/className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl font-bold hover:shadow-2xl hover:shadow-indigo-500\/50 text-white transition-all text-lg"/g, 'className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl font-bold hover:shadow-2xl hover:shadow-cyan-500/50 text-white transition-all text-lg"');

    // Fix breathing pattern info colors & emojis
    content = content.replace(
        /\[[\s\S]*?\]\.map\(\(item, idx\) => \(/,
        `[
                        { time: '4s', phase: 'Inhale', desc: 'Breathe in deeply through your nose', icon: '🫁', color: 'from-cyan-600/30 to-cyan-600/10' },
                        { time: '4s', phase: 'Hold', desc: 'Keep the breath in your lungs gently', icon: '⏸️', color: 'from-teal-600/30 to-teal-600/10' },
                        { time: '4s', phase: 'Exhale', desc: 'Release the breath through your mouth', icon: '💨', color: 'from-rose-600/30 to-rose-600/10' },
                    ].map((item, idx) => (`
    );

    // Fix Tips section background and icon color
    content = content.replace(
        /className="bg-gradient-to-br from-indigo-600\/20 to-purple-600\/10 border-2 border-indigo-500\/30 rounded-3xl p-8 shadow-lg"/g,
        'className="bg-gradient-to-br from-cyan-600/20 to-teal-600/10 border-2 border-cyan-500/30 rounded-3xl p-8 shadow-lg"'
    );
    content = content.replace(/className="p-2 bg-indigo-500\/20 rounded-xl"/g, 'className="p-2 bg-cyan-500/20 rounded-xl"');
    content = content.replace(/<Info className="text-indigo-400" size={24} \/>/g, '<Info className="text-cyan-400" size={24} />');

    // Fix Tips list items colors & bullets
    content = content.replace(
        /<ul className="text-white\/80 space-y-2">[\s\S]*?<\/ul>/,
        `<ul className="text-white/80 space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold">•</span> Find a quiet, comfortable space to practice
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-teal-400 font-bold">•</span> Start with 2-3 cycles, gradually increase to 5-10
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-rose-400 font-bold">•</span> Keep your posture upright but relaxed for best oxygen flow
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-cyan-400 font-bold">•</span> Practice daily for maximum stress relief benefits
                                </li>
                            </ul>`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated Breathing.jsx');
} catch (error) {
    console.error('Error updating file:', error);
}
