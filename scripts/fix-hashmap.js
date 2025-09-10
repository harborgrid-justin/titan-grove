#!/usr/bin/env node

/**
 * Fix HashMap imports in generated modules
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

// Get only the newly created modules that need HashMap import
const newModules = [
    'advanced_manufacturing', 'production_planning', 'lean_manufacturing',
    'product_lifecycle', 'factory_automation', 'international_trade',
    'multi_currency', 'corporate_governance', 'regulatory_compliance',
    'business_continuity', 'algorithmic_trading', 'credit_risk',
    'payment_processing', 'investment_portfolio', 'regulatory_reporting',
    'quantum_computing', 'edge_computing', 'augmented_reality',
    'neural_networks', 'computer_vision', 'digital_twin',
    'smart_city', 'autonomous_systems', 'predictive_analytics',
    'smart_grid', 'professional_services', 'research_development',
    'testing_validation', 'advisory_consulting', 'digital_forensics'
];

console.log('Fixing HashMap imports in generated modules...');

let fixedCount = 0;

for (const module of newModules) {
    const filePath = path.join(srcDir, `${module}.rs`);
    
    if (fs.existsSync(filePath)) {
        try {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Add HashMap import after the existing imports
            if (!content.includes('use std::collections::HashMap;')) {
                content = content.replace(
                    'use serde::{Deserialize, Serialize};',
                    'use serde::{Deserialize, Serialize};\nuse std::collections::HashMap;'
                );
                
                fs.writeFileSync(filePath, content);
                console.log(`✓ Fixed ${module}.rs`);
                fixedCount++;
            } else {
                console.log(`- ${module}.rs already has HashMap import`);
            }
        } catch (error) {
            console.error(`❌ Error fixing ${module}.rs:`, error.message);
        }
    }
}

console.log(`Fixed ${fixedCount} modules with HashMap imports`);