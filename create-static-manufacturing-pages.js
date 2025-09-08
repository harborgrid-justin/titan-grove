const fs = require('fs');
const path = require('path');

const manufacturingPages = [
  // Production Management Pages (10 pages)
  { name: 'production-planning', title: 'Production Planning', description: 'Manage production plans and capacity planning' },
  { name: 'production-scheduling', title: 'Production Scheduling', description: 'Schedule and optimize production activities' },
  { name: 'capacity-management', title: 'Capacity Management', description: 'Manage production capacity and utilization' },
  { name: 'work-order-management', title: 'Work Order Management', description: 'Create and manage work orders' },
  { name: 'bill-of-materials', title: 'Bill of Materials', description: 'Manage product BOMs and components' },
  { name: 'routing-management', title: 'Routing Management', description: 'Define production routing and operations' },
  { name: 'master-production-schedule', title: 'Master Production Schedule', description: 'Manage master production schedules' },
  { name: 'material-requirements', title: 'Material Requirements Planning', description: 'Plan material requirements' },
  { name: 'production-control', title: 'Production Control', description: 'Monitor and control production processes' },
  { name: 'flow-manufacturing', title: 'Flow Manufacturing', description: 'Manage flow manufacturing processes' },

  // Quality Control Pages (8 pages)
  { name: 'quality-inspection', title: 'Quality Inspection', description: 'Manage quality inspections and tests' },
  { name: 'quality-assurance', title: 'Quality Assurance', description: 'Quality assurance processes and procedures' },
  { name: 'defect-tracking', title: 'Defect Tracking', description: 'Track and manage product defects' },
  { name: 'quality-metrics', title: 'Quality Metrics', description: 'Monitor quality performance metrics' },
  { name: 'six-sigma-projects', title: 'Six Sigma Projects', description: 'Manage Six Sigma improvement projects' },
  { name: 'iso9001-compliance', title: 'ISO 9001 Compliance', description: 'Manage ISO 9001 compliance requirements' },
  { name: 'regulatory-compliance', title: 'Regulatory Compliance', description: 'Ensure regulatory compliance' },
  { name: 'continuous-improvement', title: 'Continuous Improvement', description: 'Drive continuous improvement initiatives' },

  // Shop Floor Control Pages (7 pages)
  { name: 'shop-floor-control', title: 'Shop Floor Control', description: 'Control and monitor shop floor operations' },
  { name: 'work-center-management', title: 'Work Center Management', description: 'Manage work centers and resources' },
  { name: 'operator-interface', title: 'Operator Interface', description: 'Operator workstation interface' },
  { name: 'machine-monitoring', title: 'Machine Monitoring', description: 'Monitor machine status and performance' },
  { name: 'production-tracking', title: 'Production Tracking', description: 'Track production progress in real-time' },
  { name: 'labor-tracking', title: 'Labor Tracking', description: 'Track labor time and efficiency' },
  { name: 'inventory-tracking', title: 'Inventory Tracking', description: 'Track inventory movements on shop floor' },

  // Manufacturing Analytics Pages (6 pages)
  { name: 'oee-analytics', title: 'OEE Analytics', description: 'Overall Equipment Effectiveness analytics' },
  { name: 'production-analytics', title: 'Production Analytics', description: 'Production performance analytics' },
  { name: 'cost-analytics', title: 'Cost Analytics', description: 'Manufacturing cost analysis' },
  { name: 'efficiency-analytics', title: 'Efficiency Analytics', description: 'Manufacturing efficiency metrics' },
  { name: 'throughput-analysis', title: 'Throughput Analysis', description: 'Production throughput analysis' },
  { name: 'performance-dashboard', title: 'Performance Dashboard', description: 'Manufacturing performance dashboard' },

  // Process Management Pages (6 pages)  
  { name: 'process-manufacturing', title: 'Process Manufacturing', description: 'Manage process manufacturing operations' },
  { name: 'batch-management', title: 'Batch Management', description: 'Manage batch production processes' },
  { name: 'recipe-management', title: 'Recipe Management', description: 'Manage production recipes and formulas' },
  { name: 'process-control', title: 'Process Control', description: 'Control manufacturing processes' },
  { name: 'process-optimization', title: 'Process Optimization', description: 'Optimize manufacturing processes' },
  { name: 'process-validation', title: 'Process Validation', description: 'Validate manufacturing processes' },

  // Equipment Management Pages (5 pages)
  { name: 'equipment-management', title: 'Equipment Management', description: 'Manage manufacturing equipment' },
  { name: 'maintenance-scheduling', title: 'Maintenance Scheduling', description: 'Schedule equipment maintenance' },
  { name: 'predictive-maintenance', title: 'Predictive Maintenance', description: 'Predictive maintenance analytics' },
  { name: 'equipment-efficiency', title: 'Equipment Efficiency', description: 'Monitor equipment efficiency' },
  { name: 'tool-management', title: 'Tool Management', description: 'Manage manufacturing tools and fixtures' },

  // Cost Management Pages (4 pages)
  { name: 'manufacturing-costs', title: 'Manufacturing Costs', description: 'Track and analyze manufacturing costs' },
  { name: 'cost-rollup', title: 'Cost Rollup', description: 'Product cost rollup and analysis' },
  { name: 'variance-analysis', title: 'Variance Analysis', description: 'Analyze cost variances' },
  { name: 'activity-based-costing', title: 'Activity-Based Costing', description: 'Activity-based cost management' },

  // Compliance & Safety Pages (3 pages)
  { name: 'safety-management', title: 'Safety Management', description: 'Workplace safety management' },
  { name: 'environmental-compliance', title: 'Environmental Compliance', description: 'Environmental compliance tracking' },
  { name: 'audit-management', title: 'Audit Management', description: 'Manage manufacturing audits' }
];

const htmlTemplate = (page) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${page.title} - Titan Grove Manufacturing Excellence</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../styles/dashboard.css">
    <link rel="stylesheet" href="../styles/manufacturing.css">
</head>
<body>
    <div class="titan-enterprise-app">
        <!-- Header -->
        <header class="titan-enterprise-header">
            <div class="titan-header-left">
                <div class="titan-logo-enterprise">
                    <i class="fas fa-mountain"></i>
                    <span class="titan-logo-text">Titan Grove</span>
                    <span class="titan-edition-badge">Manufacturing</span>
                </div>
                <div class="titan-global-search">
                    <div class="search-container">
                        <i class="fas fa-search search-icon"></i>
                        <input type="text" placeholder="Search ${page.title.toLowerCase()}..." class="global-search-input">
                    </div>
                </div>
            </div>
            
            <div class="titan-header-center">
                <nav class="titan-main-navigation">
                    <div class="nav-item" data-module="dashboard">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </div>
                    <div class="nav-item active" data-module="manufacturing">
                        <i class="fas fa-industry"></i>
                        <span>Manufacturing</span>
                    </div>
                    <div class="nav-item" data-module="supply-chain">
                        <i class="fas fa-truck"></i>
                        <span>Supply Chain</span>
                    </div>
                </nav>
            </div>
            
            <div class="titan-header-right">
                <div class="titan-notifications">
                    <div class="notification-bell">
                        <i class="fas fa-bell"></i>
                        <span class="notification-count">3</span>
                    </div>
                </div>
                <div class="titan-user-menu">
                    <div class="user-avatar">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User Avatar">
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="titan-main-content">
            <!-- Sidebar -->
            <aside class="titan-sidebar manufacturing-sidebar">
                <div class="sidebar-header">
                    <h3>${page.title}</h3>
                    <div class="sidebar-actions">
                        <button class="sidebar-btn" title="Create New">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="sidebar-btn" title="Export">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="sidebar-btn" title="Settings">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>

                <div class="sidebar-content">
                    <div class="sidebar-section">
                        <h4>Quick Actions</h4>
                        <ul class="sidebar-menu">
                            <li class="menu-item active">
                                <i class="fas fa-chart-line"></i>
                                <span>Overview</span>
                            </li>
                            <li class="menu-item">
                                <i class="fas fa-table"></i>
                                <span>Data View</span>
                            </li>
                            <li class="menu-item">
                                <i class="fas fa-plus-circle"></i>
                                <span>Create New</span>
                            </li>
                            <li class="menu-item">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </li>
                        </ul>
                    </div>

                    <div class="sidebar-section">
                        <h4>Related Modules</h4>
                        <ul class="sidebar-menu">
                            <li class="menu-item">
                                <i class="fas fa-industry"></i>
                                <span>Production Planning</span>
                            </li>
                            <li class="menu-item">
                                <i class="fas fa-clipboard-check"></i>
                                <span>Quality Control</span>
                            </li>
                            <li class="menu-item">
                                <i class="fas fa-tools"></i>
                                <span>Shop Floor</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>

            <!-- Content Area -->
            <div class="titan-content-area manufacturing-content">
                <!-- Page Header -->
                <div class="page-header manufacturing-page-header">
                    <div class="page-title-section">
                        <h1 class="page-title">${page.title}</h1>
                        <p class="page-description">${page.description}</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-outline">
                            <i class="fas fa-download"></i>
                            Export
                        </button>
                        <button class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Create New
                        </button>
                    </div>
                </div>

                <!-- KPI Section -->
                <div class="kpi-grid manufacturing-kpis">
                    <div class="kpi-card">
                        <div class="kpi-header">
                            <h4>Total Items</h4>
                            <i class="fas fa-boxes kpi-icon"></i>
                        </div>
                        <div class="kpi-value">1,247</div>
                        <div class="kpi-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+5.2%</span>
                        </div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-header">
                            <h4>Efficiency</h4>
                            <i class="fas fa-chart-line kpi-icon"></i>
                        </div>
                        <div class="kpi-value">94.8%</div>
                        <div class="kpi-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+2.1%</span>
                        </div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-header">
                            <h4>Performance</h4>
                            <i class="fas fa-tachometer-alt kpi-icon"></i>
                        </div>
                        <div class="kpi-value">87.3%</div>
                        <div class="kpi-change negative">
                            <i class="fas fa-arrow-down"></i>
                            <span>-0.8%</span>
                        </div>
                    </div>

                    <div class="kpi-card">
                        <div class="kpi-header">
                            <h4>Quality</h4>
                            <i class="fas fa-shield-alt kpi-icon"></i>
                        </div>
                        <div class="kpi-value">99.1%</div>
                        <div class="kpi-change positive">
                            <i class="fas fa-arrow-up"></i>
                            <span>+0.3%</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Section -->
                <div class="content-section">
                    <div class="section-header">
                        <h2>${page.title} Management</h2>
                        <div class="section-actions">
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-filter"></i>
                                Filter
                            </button>
                            <button class="btn btn-outline btn-sm">
                                <i class="fas fa-search"></i>
                                Search
                            </button>
                        </div>
                    </div>

                    <!-- Data Table -->
                    <div class="data-table-container">
                        <table class="data-table manufacturing-table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" class="select-all"></th>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th>Modified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="dataTableBody">
                                <tr>
                                    <td><input type="checkbox"></td>
                                    <td>${page.name.toUpperCase()}_001</td>
                                    <td>Sample ${page.title}</td>
                                    <td><span class="status-badge status-active">Active</span></td>
                                    <td>2024-01-15</td>
                                    <td>2024-01-20</td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn-icon" title="Edit">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon" title="View">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn-icon" title="Delete">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="pagination-container">
                        <div class="pagination-info">
                            Showing 1-1 of 1 entries
                        </div>
                        <div class="pagination">
                            <button class="pagination-btn" disabled>Previous</button>
                            <button class="pagination-btn active">1</button>
                            <button class="pagination-btn" disabled>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="../scripts/manufacturing.js"></script>
    <script>
        // Initialize ${page.title} module
        document.addEventListener('DOMContentLoaded', function() {
            console.log('${page.title} module loaded');
            
            // Load data from API
            fetch('/api/manufacturing/${page.name}')
                .then(response => response.json())
                .then(data => {
                    console.log('${page.title} data:', data);
                    // Update UI with real data
                })
                .catch(error => {
                    console.error('Error loading ${page.title} data:', error);
                });
        });
    </script>
</body>
</html>`;

// Create static manufacturing pages directory
const staticPagesDir = path.join(__dirname, 'src/ui/static/manufacturing-pages');
if (!fs.existsSync(staticPagesDir)) {
  fs.mkdirSync(staticPagesDir, { recursive: true });
}

// Generate all static HTML pages
manufacturingPages.forEach(page => {
  const filePath = path.join(staticPagesDir, `${page.name}.html`);
  fs.writeFileSync(filePath, htmlTemplate(page));
  console.log(`Created: ${page.name}.html`);
});

console.log(`Successfully created ${manufacturingPages.length} static manufacturing pages!`);
