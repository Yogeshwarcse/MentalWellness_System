import fs from 'fs';
import path from 'path';

const filePath = path.join('c:', 'Users', 'HP', 'OneDrive', 'Documents', 'MainProjects', 'MentalWellness', 'frontend', 'src', 'pages', 'Dashboard.jsx');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Gradients
    content = content.replace(/from-indigo-500\/10 via-transparent to-purple-500\/10/g, 'from-cyan-500/10 via-transparent to-teal-500/10');
    content = content.replace(/from-indigo-500 to-purple-500/g, 'from-cyan-500 to-teal-500');
    content = content.replace(/from-red-500 to-red-600/g, 'from-rose-500 to-rose-600');
    content = content.replace(/from-indigo-500 to-purple-600/g, 'from-cyan-500 to-teal-600');
    content = content.replace(/from-indigo-500 to-purple-400/g, 'from-cyan-500 to-teal-400');
    content = content.replace(/from-indigo-500\/0 via-indigo-500\/10 to-indigo-500\/0/g, 'from-cyan-500/0 via-cyan-500/10 to-cyan-500/0');
    content = content.replace(/from-indigo-600\/20 to-purple-600\/10/g, 'from-cyan-600/20 to-teal-600/10');
    
    // 2. Backgrounds, Borders, Text
    content = content.replace(/bg-indigo-400/g, 'bg-cyan-400');
    content = content.replace(/text-indigo-400/g, 'text-cyan-400');
    content = content.replace(/bg-indigo-500\/10/g, 'bg-cyan-500/10');
    content = content.replace(/border-indigo-500\/20/g, 'border-cyan-500/20');
    content = content.replace(/border-indigo-500\/40/g, 'border-cyan-500/40');
    content = content.replace(/text-purple-400/g, 'text-teal-400');
    
    // 3. Shadows and Colors (Hex/RGBA)
    content = content.replace(/rgba\(99,\s?102,\s?241,\s?0.6\)/g, 'rgba(6, 182, 212, 0.6)');
    content = content.replace(/shadow-\[0_0_20px_rgba\(99,102,241,0.15\)\]/g, 'shadow-[0_0_20px_rgba(6,182,212,0.15)]');
    content = content.replace(/shadow-indigo-500\/50/g, 'shadow-cyan-500/50');
    content = content.replace(/rgba\(99,\s?102,\s?241,\s?0.15\)/g, 'rgba(6, 182, 212, 0.15)');
    content = content.replace(/rgba\(99,\s?102,\s?241,\s?0.1\)/g, 'rgba(6, 182, 212, 0.1)');
    content = content.replace(/#6366f1/g, '#06b6d4'); // Tailwind indigo-500 to cyan-500
    
    // 4. Also fix some AreaChart colors if we used red for stress
    content = content.replace(/#ef4444/g, '#f43f5e'); // Tailwind red-500 to rose-500

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated Dashboard.jsx colors');
} catch (error) {
    console.error('Error updating Dashboard.jsx:', error);
}
