#!/usr/bin/env node

/**
 * Fix character escaping issues in Rust files
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Get all Rust files
const rustFiles = fs.readdirSync(srcDir)
    .filter(file => file.endsWith('.rs'))
    .map(file => path.join(srcDir, file));

console.log('Fixing character escaping issues...');

let fixedCount = 0;

for (const filePath of rustFiles) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Fix single quote escaping properly
        content = content.replace(/\.replace\('\\'/g, ".replace('\\''");
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`✓ Fixed ${path.basename(filePath)}`);
            fixedCount++;
        }
    } catch (error) {
        console.error(`❌ Error fixing ${path.basename(filePath)}:`, error.message);
    }
}

console.log(`Fixed ${fixedCount} files`);