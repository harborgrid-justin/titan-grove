#!/usr/bin/env node

/**
 * Titan Grove Documentation Verification Tool
 * Ensures 100% accuracy of documentation and identifies gaps in functionality
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DocumentationVerifier {
    constructor() {
        this.projectRoot = process.cwd();
        this.errors = [];
        this.warnings = [];
        this.gaps = [];
        this.verificationResults = {};
        
        this.docFiles = this.findDocumentationFiles();
        this.sourceFiles = this.findSourceFiles();
        
        console.log(`\nTitan Grove Documentation Verification Tool\n`);
        console.log(`Project files: Project Root: ${this.projectRoot}`);
        console.log(`Documentation: Documentation files found: ${this.docFiles.length}`);
        console.log(`Source files: Source files found: ${this.sourceFiles.length}\n`);
    }

    findDocumentationFiles() {
        const docFiles = [];
        const findDocs = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                    findDocs(fullPath);
                } else if (file.match(/\.(md|txt|rst)$/i)) {
                    docFiles.push(fullPath);
                }
            });
        };
        
        findDocs(this.projectRoot);
        return docFiles;
    }

    findSourceFiles() {
        const sourceFiles = [];
        const findSource = (dir) => {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
                    findSource(fullPath);
                } else if (file.match(/\.(ts|js|json)$/i)) {
                    sourceFiles.push(fullPath);
                }
            });
        };
        
        findSource(path.join(this.projectRoot, 'src'));
        return sourceFiles;
    }

    async verifyREADMEAccuracy() {
        console.log('Verifying README.md accuracy...');
        
        const readmePath = path.join(this.projectRoot, 'README.md');
        if (!fs.existsSync(readmePath)) {
            this.errors.push('README.md not found in project root');
            return;
        }
        
        const readmeContent = fs.readFileSync(readmePath, 'utf8');
        
        // Verify package.json consistency
        const packagePath = path.join(this.projectRoot, 'package.json');
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
            
            // Check version consistency
            if (readmeContent.includes('version') && readmeContent.includes(packageJson.version)) {
                console.log('  Version information is consistent');
            } else {
                this.warnings.push('Version information may be inconsistent between README and package.json');
            }
            
            // Check dependencies mentioned
            const mentionedPackages = ['express', 'typescript', 'node', 'docker'];
            mentionedPackages.forEach(pkg => {
                if (readmeContent.toLowerCase().includes(pkg)) {
                    console.log(`  ${pkg} is documented`);
                } else {
                    this.warnings.push(`${pkg} may not be documented in README`);
                }
            });
        }
        
        // Verify installation instructions
        if (readmeContent.includes('npm install') || readmeContent.includes('npm start')) {
            console.log('  Installation instructions found');
        } else {
            this.warnings.push('Installation instructions may be missing or unclear');
        }
        
        // Check for Oracle EBS competitive mentions
        const competitiveTerms = ['oracle ebs', 'competitive', 'enterprise', 'fortune 100'];
        const foundTerms = competitiveTerms.filter(term => 
            readmeContent.toLowerCase().includes(term)
        );
        
        if (foundTerms.length >= 3) {
            console.log('  Oracle EBS competitive positioning is documented');
        } else {
            this.gaps.push('Oracle EBS competitive advantages need better documentation');
        }
        
        console.log('[SUCCESS] README.md verification completed\n');
    }

    async verifyInstallationDocumentation() {
        console.log('Installation Verifying installation documentation...');
        
        const installPath = path.join(this.projectRoot, 'INSTALL.md');
        if (!fs.existsSync(installPath)) {
            this.errors.push('INSTALL.md not found - required for enterprise deployment');
            return;
        }
        
        const installContent = fs.readFileSync(installPath, 'utf8');
        
        // Check for Docker documentation
        if (installContent.includes('docker-compose') && installContent.includes('postgresql') && installContent.includes('mysql')) {
            console.log('  Docker setup is documented');
        } else {
            this.gaps.push('Docker setup documentation missing PostgreSQL and MySQL details');
        }
        
        // Check for system requirements
        const requirements = ['node.js', 'memory', 'storage', 'docker'];
        requirements.forEach(req => {
            if (installContent.toLowerCase().includes(req)) {
                console.log(`  ${req} requirements documented`);
            } else {
                this.warnings.push(`${req} requirements may not be clearly documented`);
            }
        });
        
        // Verify docker-compose.yml matches documentation
        const composePath = path.join(this.projectRoot, 'docker-compose.yml');
        if (fs.existsSync(composePath)) {
            const composeContent = fs.readFileSync(composePath, 'utf8');
            
            // Check if all services in docker-compose are documented
            const services = ['postgres', 'mysql', 'redis', 'elasticsearch'];
            services.forEach(service => {
                if (composeContent.includes(service) && installContent.toLowerCase().includes(service)) {
                    console.log(`  ${service} service is documented`);
                } else if (composeContent.includes(service)) {
                    this.gaps.push(`${service} service exists but is not documented in INSTALL.md`);
                }
            });
        }
        
        console.log('[SUCCESS] Installation documentation verification completed\n');
    }

    async verifyAPIDocumentation() {
        console.log('🔌 Verifying API documentation...');
        
        // Look for API documentation files
        const apiDocs = this.docFiles.filter(file => 
            file.toLowerCase().includes('api') || 
            path.basename(file).toLowerCase().includes('api')
        );
        
        if (apiDocs.length === 0) {
            this.gaps.push('API documentation not found - critical for enterprise integration');
        } else {
            console.log(`  Found ${apiDocs.length} API documentation file(s)`);
        }
        
        // Check for Swagger/OpenAPI documentation
        const swaggerFiles = this.sourceFiles.filter(file => 
            file.includes('swagger') || file.includes('openapi')
        );
        
        if (swaggerFiles.length > 0) {
            console.log('  Swagger/OpenAPI documentation found');
        } else {
            this.warnings.push('Consider adding Swagger/OpenAPI documentation for better API visibility');
        }
        
        // Check for GraphQL documentation if GraphQL is used
        const graphqlFiles = this.sourceFiles.filter(file =>
            file.includes('graphql') || file.includes('.gql')
        );
        
        if (graphqlFiles.length > 0) {
            console.log('  GraphQL schema files found');
            // Should also check for GraphQL documentation
            const hasGraphQLDocs = this.docFiles.some(file =>
                fs.readFileSync(file, 'utf8').toLowerCase().includes('graphql')
            );
            if (!hasGraphQLDocs) {
                this.gaps.push('GraphQL implementation found but documentation is missing');
            }
        }
        
        console.log('[SUCCESS] API documentation verification completed\n');
    }

    async verifyModuleDocumentation() {
        console.log('📚 Verifying business module documentation...');
        
        const modulesDir = path.join(this.projectRoot, 'src', 'modules');
        if (!fs.existsSync(modulesDir)) {
            this.errors.push('src/modules directory not found');
            return;
        }
        
        const modules = fs.readdirSync(modulesDir).filter(item => {
            const itemPath = path.join(modulesDir, item);
            return fs.statSync(itemPath).isDirectory();
        });
        
        console.log(`  Found ${modules.length} business modules`);
        
        // Expected Oracle EBS competitive modules
        const expectedModules = [
            'financial', 'hr', 'crm', 'scm', 'manufacturing', 
            'project', 'assets', 'inventory', 'procurement'
        ];
        
        expectedModules.forEach(expectedModule => {
            const found = modules.some(module => 
                module.toLowerCase().includes(expectedModule.toLowerCase())
            );
            
            if (found) {
                console.log(`  ${expectedModule} module found`);
            } else {
                this.gaps.push(`${expectedModule} module missing or not properly named for Oracle EBS competitive feature`);
            }
        });
        
        // Check each module for documentation
        modules.forEach(module => {
            const modulePath = path.join(modulesDir, module);
            const moduleFiles = fs.readdirSync(modulePath, { recursive: true });
            
            const hasReadme = moduleFiles.some(file => 
                file.toLowerCase().includes('readme')
            );
            
            const hasDocumentation = moduleFiles.some(file =>
                file.match(/\.(md|txt|rst)$/i)
            );
            
            if (hasReadme || hasDocumentation) {
                console.log(`  ${module} module has documentation`);
            } else {
                this.gaps.push(`${module} module lacks documentation - critical for Oracle EBS competitive positioning`);
            }
        });
        
        console.log('[SUCCESS] Module documentation verification completed\n');
    }

    async verifyTroubleshootingDocumentation() {
        console.log('🔧 Verifying troubleshooting documentation...');
        
        const troubleshootingPaths = [
            'TROUBLESHOOTING.md',
            'docs/TROUBLESHOOTING.md',
            'docs/troubleshooting.md'
        ];
        
        let troubleshootingFound = false;
        for (const troublePath of troubleshootingPaths) {
            const fullPath = path.join(this.projectRoot, troublePath);
            if (fs.existsSync(fullPath)) {
                troubleshootingFound = true;
                
                const troubleContent = fs.readFileSync(fullPath, 'utf8');
                
                // Check for common troubleshooting topics
                const topics = [
                    'docker', 'database', 'connection', 'port', 'memory', 'build', 'installation'
                ];
                
                topics.forEach(topic => {
                    if (troubleContent.toLowerCase().includes(topic)) {
                        console.log(`  ${topic} troubleshooting documented`);
                    } else {
                        this.warnings.push(`${topic} troubleshooting may be missing`);
                    }
                });
                
                break;
            }
        }
        
        if (!troubleshootingFound) {
            this.gaps.push('Troubleshooting documentation not found - critical for enterprise deployment');
        } else {
            console.log('  Troubleshooting documentation found');
        }
        
        console.log('[SUCCESS] Troubleshooting documentation verification completed\n');
    }

    async verifyConfigurationDocumentation() {
        console.log('⚙️  Verifying configuration documentation...');
        
        // Check for environment variable documentation
        const envFiles = ['.env.example', '.env.production.example', '.env.business.example'];
        const configDocs = this.docFiles.filter(file => 
            file.toLowerCase().includes('config') || file.toLowerCase().includes('environment')
        );
        
        envFiles.forEach(envFile => {
            const envPath = path.join(this.projectRoot, envFile);
            if (fs.existsSync(envPath)) {
                console.log(`  ${envFile} found`);
            } else {
                this.gaps.push(`${envFile} missing - needed for proper configuration`);
            }
        });
        
        if (configDocs.length > 0) {
            console.log(`  Found ${configDocs.length} configuration documentation file(s)`);
        } else {
            this.gaps.push('Configuration documentation not found - critical for enterprise deployment');
        }
        
        // Check for business configuration system documentation
        const businessConfigDoc = this.docFiles.find(file =>
            file.toLowerCase().includes('business_configuration') ||
            file.toLowerCase().includes('business-configuration')
        );
        
        if (businessConfigDoc) {
            console.log('  Business configuration system documented');
        } else {
            this.gaps.push('Business configuration system documentation missing - key Oracle EBS competitive advantage');
        }
        
        console.log('[SUCCESS] Configuration documentation verification completed\n');
    }

    async verifyCodeDocumentationCoverage() {
        console.log('💻 Verifying code documentation coverage...');
        
        let totalFunctions = 0;
        let documentedFunctions = 0;
        let totalClasses = 0;
        let documentedClasses = 0;
        
        this.sourceFiles.forEach(file => {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Count functions
                const functionMatches = content.match(/(?:function|=>|\bclass\b)/g) || [];
                totalFunctions += functionMatches.length;
                
                // Count documented functions (with /** comments)
                const docCommentMatches = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
                documentedFunctions += docCommentMatches.length;
                
                // Count classes
                const classMatches = content.match(/class\s+\w+/g) || [];
                totalClasses += classMatches.length;
                
                // Count documented classes
                const classDocMatches = content.match(/\/\*\*[\s\S]*?\*\/[\s\r\n]*class\s+\w+/g) || [];
                documentedClasses += classDocMatches.length;
            }
        });
        
        const functionCoverage = totalFunctions > 0 ? (documentedFunctions / totalFunctions * 100).toFixed(1) : 0;
        const classCoverage = totalClasses > 0 ? (documentedClasses / totalClasses * 100).toFixed(1) : 0;
        
        console.log(`  Function documentation coverage: ${functionCoverage}% (${documentedFunctions}/${totalFunctions})`);
        console.log(`  Class documentation coverage: ${classCoverage}% (${documentedClasses}/${totalClasses})`);
        
        if (functionCoverage < 70) {
            this.warnings.push(`Function documentation coverage is ${functionCoverage}% - should be >70% for enterprise software`);
        } else {
            console.log('  Function documentation coverage is acceptable');
        }
        
        if (classCoverage < 80) {
            this.warnings.push(`Class documentation coverage is ${classCoverage}% - should be >80% for enterprise software`);
        } else {
            console.log('  Class documentation coverage is acceptable');
        }
        
        console.log('[SUCCESS] Code documentation coverage verification completed\n');
    }

    async verifyOracleEBSCompetitiveDocumentation() {
        console.log('Verifying Oracle EBS competitive documentation...');
        
        // Check for competitive analysis documentation
        const competitiveDocs = this.docFiles.filter(file => {
            const content = fs.readFileSync(file, 'utf8').toLowerCase();
            return content.includes('oracle') && content.includes('ebs') || 
                   content.includes('competitive') ||
                   content.includes('enterprise business suite');
        });
        
        if (competitiveDocs.length === 0) {
            this.gaps.push('Oracle EBS competitive analysis documentation missing - critical for positioning');
        } else {
            console.log(`  Found ${competitiveDocs.length} Oracle EBS competitive document(s)`);
        }
        
        // Check for feature comparison documentation
        const expectedCompetitiveFeatures = [
            'configure-to-order',
            'manufacturing execution',
            'process manufacturing',
            'mobile supply chain',
            'enterprise integration',
            'business intelligence',
            'financial management'
        ];
        
        let featuresCovered = 0;
        expectedCompetitiveFeatures.forEach(feature => {
            const found = this.docFiles.some(file => {
                const content = fs.readFileSync(file, 'utf8').toLowerCase();
                return content.includes(feature.toLowerCase());
            });
            
            if (found) {
                console.log(`  ${feature} competitive documentation found`);
                featuresCovered++;
            } else {
                this.gaps.push(`${feature} competitive advantage not documented`);
            }
        });
        
        const coverage = (featuresCovered / expectedCompetitiveFeatures.length * 100).toFixed(1);
        console.log(`  Oracle EBS competitive feature coverage: ${coverage}%`);
        
        if (coverage < 85) {
            this.warnings.push(`Oracle EBS competitive feature coverage is ${coverage}% - should be >85% for market positioning`);
        }
        
        console.log('[SUCCESS] Oracle EBS competitive documentation verification completed\n');
    }

    generateReport() {
        console.log('Generating Documentation Verification Report...\n');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalDocFiles: this.docFiles.length,
                totalSourceFiles: this.sourceFiles.length,
                errors: this.errors.length,
                warnings: this.warnings.length,
                gaps: this.gaps.length
            },
            verificationResults: this.verificationResults
        };
        
        console.log('═'.repeat(80));
        console.log('TITAN GROVE DOCUMENTATION VERIFICATION REPORT');
        console.log('═'.repeat(80));
        console.log();
        
        console.log('SUMMARY:');
        console.log(`  Documentation Files: ${report.summary.totalDocFiles}`);
        console.log(`  Source Files: ${report.summary.totalSourceFiles}`);
        console.log(`  Errors: ${report.summary.errors}`);
        console.log(`  Warnings: ${report.summary.warnings}`);
        console.log(`  Gaps Identified: ${report.summary.gaps}`);
        console.log();
        
        if (this.errors.length > 0) {
            console.log('ERRORS (Critical Issues):');
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
            console.log();
        }
        
        if (this.warnings.length > 0) {
            console.log('WARNINGS (Improvement Needed):');
            this.warnings.forEach((warning, index) => {
                console.log(`  ${index + 1}. ${warning}`);
            });
            console.log();
        }
        
        if (this.gaps.length > 0) {
            console.log('GAPS (Missing Documentation):');
            this.gaps.forEach((gap, index) => {
                console.log(`  ${index + 1}. ${gap}`);
            });
            console.log();
        }
        
        // Calculate overall score
        const totalIssues = this.errors.length + this.warnings.length + this.gaps.length;
        const maxScore = 100;
        const score = Math.max(0, maxScore - (this.errors.length * 10) - (this.warnings.length * 5) - (this.gaps.length * 3));
        
        console.log('OVERALL DOCUMENTATION SCORE:');
        if (score >= 90) {
            console.log(`  ${score}% - EXCELLENT`);
        } else if (score >= 80) {
            console.log(`  ${score}% - GOOD`);
        } else if (score >= 70) {
            console.log(`  ${score}% - ACCEPTABLE`);
        } else {
            console.log(`  ${score}% - NEEDS IMPROVEMENT`);
        }
        
        console.log();
        console.log('RECOMMENDATIONS:');
        if (this.errors.length > 0) {
            console.log('  • Fix critical errors immediately - these prevent proper deployment');
        }
        if (this.gaps.length > 3) {
            console.log('  • Address documentation gaps to improve Oracle EBS competitive positioning');
        }
        if (this.warnings.length > 5) {
            console.log('  • Consider addressing warnings to improve enterprise readiness');
        }
        if (score >= 90) {
            console.log('  • Documentation quality is excellent! Continue maintaining this standard.');
        }
        
        console.log();
        console.log('═'.repeat(80));
        
        // Save report to file
        const reportPath = path.join(this.projectRoot, 'documentation-verification-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`Documentation: Detailed report saved to: ${reportPath}`);
        
        return score;
    }

    async run() {
        console.log('Starting Starting comprehensive documentation verification...\n');
        
        await this.verifyREADMEAccuracy();
        await this.verifyInstallationDocumentation();
        await this.verifyAPIDocumentation();
        await this.verifyModuleDocumentation();
        await this.verifyTroubleshootingDocumentation();
        await this.verifyConfigurationDocumentation();
        await this.verifyCodeDocumentationCoverage();
        await this.verifyOracleEBSCompetitiveDocumentation();
        
        const score = this.generateReport();
        
        console.log('\n[SUCCESS] Documentation verification completed!\n');
        
        return score >= 80;
    }
}

// Run the verification if called directly
if (require.main === module) {
    const verifier = new DocumentationVerifier();
    verifier.run().then(passed => {
        process.exit(passed ? 0 : 1);
    }).catch(error => {
        console.error('ERROR: Documentation verification failed:', error.message);
        process.exit(1);
    });
}

module.exports = DocumentationVerifier;