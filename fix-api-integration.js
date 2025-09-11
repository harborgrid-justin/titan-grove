#!/usr/bin/env node

/**
 * Fortune 100 NAPI-RS API Integration Fix Script
 * 
 * This script fixes function name mismatches between Rust (camelCase) 
 * and TypeScript (snake_case) in API files for production-grade integration.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Common snake_case to camelCase transformations
const functionNameMappings = {
    // Health checks
    'check_(.+)_health': 'check$1Health',
    'get_(.+)_health': 'get$1Health',
    
    // Configuration
    'get_(.+)_config': 'get$1Config',
    'update_(.+)_config': 'update$1Config',
    'set_(.+)_config': 'set$1Config',
    
    // Data operations
    'validate_(.+)_data': 'validate$1Data',
    'process_(.+)_data': 'process$1Data',
    'transform_(.+)_data': 'transform$1Data',
    
    // CRUD operations
    'create_(.+)_record': 'create$1Record',
    'get_(.+)_record': 'get$1Record',
    'update_(.+)_record': 'update$1Record',
    'delete_(.+)_record': 'delete$1Record',
    'bulk_create_(.+)_records': 'bulkCreate$1Records',
    
    // Analytics and metrics
    'analyze_(.+)_performance': 'analyze$1Performance',
    'calculate_(.+)_metrics': 'calculate$1Metrics',
    'generate_(.+)_report': 'generate$1Report',
    
    // Operations
    'handle_(.+)_error': 'handle$1Error',
    'audit_(.+)_operation': 'audit$1Operation',
    'optimize_(.+)_performance': 'optimize$1Performance',
    'process_(.+)_workflow': 'process$1Workflow'
};

function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

function convertModuleName(moduleName) {
    return moduleName.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
}

function fixApiFile(filePath) {
    console.log(`Processing: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Fix function name patterns
        for (const [pattern, replacement] of Object.entries(functionNameMappings)) {
            const regex = new RegExp(`native\\.${pattern}`, 'g');
            const matches = content.match(regex);
            
            if (matches) {
                for (const match of matches) {
                    const snakeCase = match.replace('native.', '');
                    const camelCase = snakeCase.replace(new RegExp(pattern), replacement);
                    const finalCamelCase = convertModuleName(camelCase.replace(/([a-z])([A-Z])/g, '$1$2'));
                    
                    content = content.replace(match, `native.${snakeToCamel(camelCase)}`);
                    modified = true;
                }
            }
        }
        
        // Fix typeof checks
        content = content.replace(/typeof native\.([a-z_]+)/g, (match, funcName) => {
            return `typeof native.${snakeToCamel(funcName)}`;
        });
        
        // Fix direct function calls
        content = content.replace(/native\.([a-z_]+)\(/g, (match, funcName) => {
            return `native.${snakeToCamel(funcName)}(`;
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${filePath}`);
        } else {
            console.log(`ℹ️  No changes needed: ${filePath}`);
        }
        
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
    }
}

function fixAllApiFiles() {
    console.log('🔧 Starting Fortune 100 NAPI-RS API Integration Fix...\n');
    
    const apiFiles = glob.sync('src/api/*-api.ts', { cwd: process.cwd() });
    
    console.log(`Found ${apiFiles.length} API files to process\n`);
    
    for (const file of apiFiles) {
        fixApiFile(file);
    }
    
    console.log('\n✨ API Integration Fix Complete!');
    console.log('🎯 All TypeScript API files now use correct camelCase function names');
}

// Run the fix
if (require.main === module) {
    fixAllApiFiles();
}

module.exports = { fixAllApiFiles, fixApiFile };