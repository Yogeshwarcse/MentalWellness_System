import fs from 'fs';
import path from 'path';

const basePath = path.join('c:', 'Users', 'HP', 'OneDrive', 'Documents', 'MainProjects', 'MentalWellness', 'frontend', 'src', 'pages');

const filesToFix = ['Login.jsx', 'Register.jsx'];

filesToFix.forEach(file => {
    try {
        const filePath = path.join(basePath, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Color replacements
        content = content.replace(/text-indigo-400/g, 'text-cyan-400');
        content = content.replace(/border-indigo-400\/50/g, 'border-cyan-400/50');
        content = content.replace(/border-indigo-400\/0/g, 'border-cyan-400/0');
        content = content.replace(/from-indigo-600\/30 to-purple-600\/30/g, 'from-cyan-600/30 to-teal-600/30');
        content = content.replace(/hover:from-indigo-600\/50 hover:to-purple-600\/50/g, 'hover:from-cyan-600/50 hover:to-teal-600/50');
        content = content.replace(/border-indigo-400\/20/g, 'border-cyan-400/20');
        content = content.replace(/hover:border-indigo-400\/40/g, 'hover:border-cyan-400/40');
        content = content.replace(/text-indigo-300/g, 'text-cyan-300');
        content = content.replace(/rgba\(99,\s?102,\s?241,\s?0.5\)/g, 'rgba(6, 182, 212, 0.5)'); // Framer motion boxShadow

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Successfully updated ${file} colors`);
    } catch (error) {
        console.error(`Error updating ${file}:`, error);
    }
});
