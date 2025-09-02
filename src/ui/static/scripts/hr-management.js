/**
 * HR Management System - Titan Grove Enterprise
 * Advanced Human Resources interface with Oracle EBS competitive features
 * Comprehensive employee lifecycle management and analytics
 */

class HRManagementSystem {
    constructor() {
        this.employees = [];
        this.filteredEmployees = [];
        this.currentPage = 1;
        this.itemsPerPage = 25;
        this.sortColumn = 'name';
        this.sortDirection = 'asc';
        this.charts = {};
        this.initialized = false;
        
        // Performance tracking
        this.performanceMetrics = {
            loadTime: 0,
            renderTime: 0,
            apiCalls: 0,
            cacheHits: 0
        };
        
        console.log('🚀 Initializing HR Management System...');
    }

    /**
     * Initialize the HR Management System
     */
    async init() {
        const startTime = performance.now();
        
        try {
            console.log('📊 Loading HR Analytics Framework...');
            
            // Load sample employee data
            await this.loadEmployeeData();
            
            // Initialize charts
            await this.initializeCharts();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup navigation
            this.setupNavigation();
            
            // Initialize search functionality
            this.initializeSearch();
            
            // Setup real-time updates
            this.setupRealTimeUpdates();
            
            this.initialized = true;
            this.performanceMetrics.loadTime = performance.now() - startTime;
            
            console.log(`✅ HR Management System initialized in ${this.performanceMetrics.loadTime.toFixed(2)}ms`);
            console.log('🎯 Oracle EBS competitive HR features active');
            
        } catch (error) {
            console.error('❌ Failed to initialize HR Management System:', error);
        }
    }

    /**
     * Load employee data (in production, this would come from API)
     */
    async loadEmployeeData() {
        console.log('👥 Loading employee database...');
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.employees = [
            {
                id: 'EMP001',
                name: 'John Smith',
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@titangrove.com',
                department: 'Engineering',
                position: 'Senior Software Engineer',
                hireDate: '2022-03-15',
                status: 'active',
                location: 'Headquarters',
                salary: 125000,
                manager: 'Sarah Johnson',
                avatar: 'https://via.placeholder.com/40x40/2563eb/ffffff?text=JS'
            },
            {
                id: 'EMP002',
                name: 'Emily Davis',
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@titangrove.com',
                department: 'Sales',
                position: 'Sales Director',
                hireDate: '2021-08-22',
                status: 'active',
                location: 'Chicago Office',
                salary: 135000,
                manager: 'Michael Brown',
                avatar: 'https://via.placeholder.com/40x40/7c3aed/ffffff?text=ED'
            },
            {
                id: 'EMP003',
                name: 'Michael Chen',
                firstName: 'Michael',
                lastName: 'Chen',
                email: 'michael.chen@titangrove.com',
                department: 'Operations',
                position: 'Operations Manager',
                hireDate: '2023-01-10',
                status: 'active',
                location: 'Austin Office',
                salary: 98000,
                manager: 'Jennifer Wilson',
                avatar: 'https://via.placeholder.com/40x40/059669/ffffff?text=MC'
            },
            {
                id: 'EMP004',
                name: 'Sarah Johnson',
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah.johnson@titangrove.com',
                department: 'Human Resources',
                position: 'HR Director',
                hireDate: '2020-05-18',
                status: 'active',
                location: 'Headquarters',
                salary: 145000,
                manager: 'David Wilson',
                avatar: 'https://via.placeholder.com/40x40/f59e0b/ffffff?text=SJ'
            },
            {
                id: 'EMP005',
                name: 'David Wilson',
                firstName: 'David',
                lastName: 'Wilson',
                email: 'david.wilson@titangrove.com',
                department: 'Finance',
                position: 'CFO',
                hireDate: '2019-11-05',
                status: 'active',
                location: 'Headquarters',
                salary: 185000,
                manager: 'Robert Anderson',
                avatar: 'https://via.placeholder.com/40x40/64748b/ffffff?text=DW'
            }
        ];
        
        // Generate additional sample employees for demonstration
        this.generateSampleEmployees();
        
        this.filteredEmployees = [...this.employees];
        console.log(`✅ Loaded ${this.employees.length} employee records`);
    }

    /**
     * Generate additional sample employees for demonstration
     */
    generateSampleEmployees() {
        const departments = ['Engineering', 'Sales', 'Operations', 'Marketing', 'Human Resources', 'Finance'];
        const positions = [
            'Software Engineer', 'Senior Software Engineer', 'Lead Developer', 'Architect',
            'Sales Representative', 'Senior Sales Rep', 'Account Manager', 'Sales Director',
            'Operations Analyst', 'Operations Manager', 'Process Specialist', 'Operations Director',
            'Marketing Specialist', 'Marketing Manager', 'Brand Manager', 'Marketing Director',
            'HR Generalist', 'HR Business Partner', 'Talent Acquisition', 'HR Director',
            'Financial Analyst', 'Senior Analyst', 'Finance Manager', 'Controller'
        ];
        const locations = ['Headquarters', 'Chicago Office', 'Austin Office', 'Remote'];
        const statuses = ['active', 'active', 'active', 'active', 'active', 'onboarding', 'inactive'];
        
        const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        
        for (let i = 6; i <= 1247; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const department = departments[Math.floor(Math.random() * departments.length)];
            const position = positions[Math.floor(Math.random() * positions.length)];
            const hireYear = 2019 + Math.floor(Math.random() * 5);
            const hireMonth = 1 + Math.floor(Math.random() * 12);
            const hireDay = 1 + Math.floor(Math.random() * 28);
            
            this.employees.push({
                id: `EMP${i.toString().padStart(3, '0')}`,
                name: `${firstName} ${lastName}`,
                firstName: firstName,
                lastName: lastName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@titangrove.com`,
                department: department,
                position: position,
                hireDate: `${hireYear}-${hireMonth.toString().padStart(2, '0')}-${hireDay.toString().padStart(2, '0')}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                salary: 45000 + Math.floor(Math.random() * 150000),
                manager: 'Sarah Johnson',
                avatar: `https://via.placeholder.com/40x40/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff?text=${firstName[0]}${lastName[0]}`
            });
        }
    }

    /**
     * Initialize data visualization charts
     */
    async initializeCharts() {
        console.log('📈 Initializing HR Analytics Charts...');
        
        try {
            // Employee Growth Chart
            await this.createEmployeeGrowthChart();
            
            // Department Distribution Chart
            await this.createDepartmentDistributionChart();
            
            // Payroll Expenses Chart
            await this.createPayrollExpensesChart();
            
            console.log('✅ All HR analytics charts initialized');
            
        } catch (error) {
            console.error('❌ Chart initialization failed:', error);
        }
    }

    /**
     * Create Employee Growth Trend Chart
     */
    async createEmployeeGrowthChart() {
        const ctx = document.getElementById('employeeGrowthChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const growthData = [1195, 1203, 1218, 1225, 1234, 1241, 1247, 1251, 1258, 1264, 1269, 1247];
        const hireData = [8, 12, 18, 9, 15, 11, 14, 7, 13, 10, 8, 5];
        const terminationData = [3, 4, 3, 2, 6, 4, 8, 3, 6, 4, 3, 27]; // Dec spike for year-end

        this.charts.employeeGrowth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Total Employees',
                        data: growthData,
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'New Hires',
                        data: hireData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Terminations',
                        data: terminationData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label} 2024`;
                            },
                            label: function(context) {
                                const label = context.dataset.label;
                                const value = context.parsed.y;
                                if (label === 'Total Employees') {
                                    return `${label}: ${value.toLocaleString()} employees`;
                                }
                                return `${label}: ${value} employees`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    /**
     * Create Department Distribution Chart
     */
    async createDepartmentDistributionChart() {
        const ctx = document.getElementById('departmentDistributionChart');
        if (!ctx) return;

        const departmentData = {
            'Engineering': 387,
            'Sales': 234,
            'Operations': 189,
            'Marketing': 156,
            'Human Resources': 94,
            'Finance': 87,
            'Customer Service': 75,
            'IT': 45,
            'Legal': 28,
            'Research': 22
        };

        const colors = [
            '#2563eb', '#7c3aed', '#059669', '#dc2626', '#f59e0b',
            '#64748b', '#06b6d4', '#8b5cf6', '#84cc16', '#f97316'
        ];

        this.charts.departmentDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(departmentData),
                datasets: [{
                    data: Object.values(departmentData),
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const label = context.label;
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} employees (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1500,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    /**
     * Create Payroll Expenses Chart
     */
    async createPayrollExpensesChart() {
        const ctx = document.getElementById('payrollExpensesChart');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const grossPayData = [2350000, 2380000, 2410000, 2390000, 2420000, 2450000, 2480000, 2460000, 2490000, 2510000, 2530000, 2400000];
        const netPayData = [1762500, 1785000, 1807500, 1792500, 1815000, 1837500, 1860000, 1845000, 1867500, 1882500, 1897500, 1800000];
        const benefitsData = [517500, 524000, 530750, 526250, 533000, 539250, 546000, 541000, 548250, 552750, 557250, 528000];

        this.charts.payrollExpenses = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Gross Pay',
                        data: grossPayData,
                        backgroundColor: 'rgba(37, 99, 235, 0.8)',
                        borderColor: '#2563eb',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: 'Net Pay',
                        data: netPayData,
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: '#10b981',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: 'Benefits',
                        data: benefitsData,
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderColor: '#f59e0b',
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#f8fafc',
                        bodyColor: '#f8fafc',
                        borderColor: '#334155',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            title: function(context) {
                                return `${context[0].label} 2024 Payroll`;
                            },
                            label: function(context) {
                                const label = context.dataset.label;
                                const value = context.parsed.y;
                                return `${label}: $${(value / 1000000).toFixed(2)}M`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    /**
     * Setup event listeners for all interactive elements
     */
    setupEventListeners() {
        console.log('🎛️ Setting up HR event listeners...');
        
        // Sidebar navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchSection(item.dataset.section);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickAction(btn.dataset.action);
            });
        });
        
        // Employee search
        const searchInput = document.getElementById('employeeSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleEmployeeSearch(e.target.value);
            });
        }
        
        // Filter controls
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', () => {
                this.applyFilters();
            });
        });
        
        // Table sorting
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                this.handleTableSort(header.dataset.column);
            });
        });
        
        // Pagination controls
        this.setupPaginationListeners();
        
        // Notification center
        const notificationIcon = document.querySelector('.titan-notification-center');
        if (notificationIcon) {
            notificationIcon.addEventListener('click', () => {
                this.toggleNotificationDropdown();
            });
        }
        
        // Chart controls
        this.setupChartControlListeners();
        
        console.log('✅ HR event listeners configured');
    }

    /**
     * Setup pagination event listeners
     */
    setupPaginationListeners() {
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        const itemsPerPageSelect = document.getElementById('itemsPerPage');
        
        if (firstPageBtn) {
            firstPageBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.renderEmployeeTable();
            });
        }
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderEmployeeTable();
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderEmployeeTable();
                }
            });
        }
        
        if (lastPageBtn) {
            lastPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
                this.currentPage = totalPages;
                this.renderEmployeeTable();
            });
        }
        
        if (itemsPerPageSelect) {
            itemsPerPageSelect.addEventListener('change', (e) => {
                this.itemsPerPage = parseInt(e.target.value);
                this.currentPage = 1;
                this.renderEmployeeTable();
            });
        }
    }

    /**
     * Setup chart control listeners
     */
    setupChartControlListeners() {
        // Employee growth time filter
        const growthFilter = document.getElementById('employeeGrowthFilter');
        if (growthFilter) {
            growthFilter.addEventListener('change', (e) => {
                this.updateEmployeeGrowthChart(e.target.value);
            });
        }
        
        // Department distribution view toggles
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateDepartmentChart(e.target.dataset.view);
            });
        });
        
        // Payroll data toggles
        document.querySelectorAll('[data-type]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-type]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updatePayrollChart(e.target.dataset.type);
            });
        });
    }

    /**
     * Setup navigation between different sections
     */
    setupNavigation() {
        console.log('🧭 Setting up HR navigation...');
        
        // Main navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update main navigation
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Handle module switching
                const module = item.dataset.module;
                if (module && module !== 'hr-management') {
                    // Navigate to other modules (placeholder for future implementation)
                    console.log(`🔄 Navigating to ${module} module...`);
                    this.navigateToModule(module);
                }
            });
        });
        
        // Set default section
        this.switchSection('dashboard');
    }

    /**
     * Navigate to other modules
     */
    navigateToModule(module) {
        const moduleUrls = {
            'dashboard': 'dashboard.html',
            'manufacturing': 'manufacturing.html',
            'financials': 'financials.html',
            'supply-chain': '#', // To be implemented
            'project': '#', // To be implemented
            'crm': '#', // To be implemented
            'bi': '#' // To be implemented
        };
        
        if (moduleUrls[module] && moduleUrls[module] !== '#') {
            window.location.href = moduleUrls[module];
        }
    }

    /**
     * Switch between HR sections
     */
    switchSection(sectionId) {
        console.log(`📄 Switching to HR section: ${sectionId}`);
        
        // Update sidebar menu
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add('active');
        }
        
        // Show/hide content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId === 'dashboard' ? 'hr-dashboard' : `${sectionId}-management`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Load section-specific data
        this.loadSectionData(sectionId);
    }

    /**
     * Load section-specific data
     */
    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'employees':
                await this.loadEmployeeManagementData();
                break;
            case 'payroll':
                await this.loadPayrollData();
                break;
            case 'performance':
                await this.loadPerformanceData();
                break;
            case 'recruitment':
                await this.loadRecruitmentData();
                break;
            case 'benefits':
                await this.loadBenefitsData();
                break;
            case 'learning':
                await this.loadLearningData();
                break;
            case 'compliance':
                await this.loadComplianceData();
                break;
            case 'analytics':
                await this.loadAnalyticsData();
                break;
        }
    }

    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        console.log('📊 Loading HR dashboard data...');
        // Dashboard is already loaded, update real-time metrics
        this.updateKPICards();
    }

    /**
     * Load employee management data
     */
    async loadEmployeeManagementData() {
        console.log('👥 Loading employee management data...');
        this.renderEmployeeTable();
    }

    /**
     * Update KPI cards with real-time data
     */
    updateKPICards() {
        // Simulate real-time updates
        const kpiUpdates = {
            employees: {
                total: this.employees.filter(emp => emp.status === 'active').length,
                fullTime: this.employees.filter(emp => emp.status === 'active' && emp.position.includes('Senior')).length,
                partTime: this.employees.filter(emp => emp.status === 'active' && !emp.position.includes('Senior')).length
            },
            payroll: {
                monthly: 2400000,
                lastProcessed: 'Dec 28, 2024',
                status: 'Completed'
            },
            recruitment: {
                openPositions: 23,
                inProgress: 15,
                interviews: 8
            },
            turnover: {
                annual: 8.2,
                industryAvg: 12.1
            }
        };
        
        // Update employee count
        const totalEmployeesEl = document.querySelector('.kpi-card.employees .kpi-value');
        if (totalEmployeesEl) {
            totalEmployeesEl.textContent = kpiUpdates.employees.total.toLocaleString();
        }
        
        // Update payroll amount
        const payrollAmountEl = document.querySelector('.kpi-card.payroll .kpi-value');
        if (payrollAmountEl) {
            payrollAmountEl.textContent = '$' + (kpiUpdates.payroll.monthly / 1000000).toFixed(1) + 'M';
        }
        
        // Update recruitment count
        const recruitmentCountEl = document.querySelector('.kpi-card.recruitment .kpi-value');
        if (recruitmentCountEl) {
            recruitmentCountEl.textContent = kpiUpdates.recruitment.openPositions.toString();
        }
        
        // Update turnover rate
        const turnoverRateEl = document.querySelector('.kpi-card.turnover .kpi-value');
        if (turnoverRateEl) {
            turnoverRateEl.textContent = kpiUpdates.turnover.annual + '%';
        }
    }

    /**
     * Handle quick actions
     */
    handleQuickAction(action) {
        console.log(`⚡ Quick action triggered: ${action}`);
        
        switch (action) {
            case 'add-employee':
                this.showAddEmployeeModal();
                break;
            case 'process-payroll':
                this.showProcessPayrollModal();
                break;
            case 'schedule-interview':
                this.showScheduleInterviewModal();
                break;
            case 'generate-report':
                this.showGenerateReportModal();
                break;
        }
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        console.log('🔍 Initializing HR search functionality...');
        
        const globalSearch = document.getElementById('hrGlobalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
            
            globalSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeGlobalSearch(e.target.value);
                }
            });
        }
    }

    /**
     * Handle global search across HR modules
     */
    handleGlobalSearch(query) {
        if (query.length < 2) {
            this.hideSearchSuggestions();
            return;
        }
        
        const suggestions = this.generateSearchSuggestions(query);
        this.showSearchSuggestions(suggestions);
    }

    /**
     * Generate search suggestions
     */
    generateSearchSuggestions(query) {
        const suggestions = [];
        const lowercaseQuery = query.toLowerCase();
        
        // Employee suggestions
        const employeeMatches = this.employees
            .filter(emp => 
                emp.name.toLowerCase().includes(lowercaseQuery) ||
                emp.id.toLowerCase().includes(lowercaseQuery) ||
                emp.email.toLowerCase().includes(lowercaseQuery) ||
                emp.department.toLowerCase().includes(lowercaseQuery)
            )
            .slice(0, 5);
        
        employeeMatches.forEach(emp => {
            suggestions.push({
                type: 'employee',
                title: emp.name,
                subtitle: `${emp.position} - ${emp.department}`,
                icon: 'fas fa-user',
                action: () => this.showEmployeeDetails(emp.id)
            });
        });
        
        // Department suggestions
        const departments = ['Engineering', 'Sales', 'Operations', 'Marketing', 'Human Resources', 'Finance'];
        departments
            .filter(dept => dept.toLowerCase().includes(lowercaseQuery))
            .forEach(dept => {
                suggestions.push({
                    type: 'department',
                    title: dept,
                    subtitle: `View ${dept} employees`,
                    icon: 'fas fa-building',
                    action: () => this.filterByDepartment(dept)
                });
            });
        
        return suggestions;
    }

    /**
     * Show search suggestions dropdown
     */
    showSearchSuggestions(suggestions) {
        const dropdown = document.getElementById('hrSearchSuggestions');
        if (!dropdown) return;
        
        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }
        
        dropdown.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" data-type="${suggestion.type}">
                <div class="suggestion-icon">
                    <i class="${suggestion.icon}"></i>
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${suggestion.title}</div>
                    <div class="suggestion-subtitle">${suggestion.subtitle}</div>
                </div>
            </div>
        `).join('');
        
        dropdown.style.display = 'block';
        
        // Add click listeners to suggestions
        dropdown.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                suggestions[index].action();
                this.hideSearchSuggestions();
            });
        });
    }

    /**
     * Hide search suggestions
     */
    hideSearchSuggestions() {
        const dropdown = document.getElementById('hrSearchSuggestions');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    /**
     * Render employee table
     */
    renderEmployeeTable() {
        const startTime = performance.now();
        console.log('📋 Rendering employee table...');
        
        const tbody = document.getElementById('employeeTableBody');
        if (!tbody) return;
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredEmployees.length);
        const pageEmployees = this.filteredEmployees.slice(startIndex, endIndex);
        
        // Generate table rows
        tbody.innerHTML = pageEmployees.map(employee => `
            <tr class="employee-row" data-employee-id="${employee.id}">
                <td class="checkbox-column">
                    <input type="checkbox" class="employee-checkbox" value="${employee.id}">
                </td>
                <td class="employee-cell">
                    <div class="employee-info">
                        <img src="${employee.avatar}" alt="${employee.name}" class="employee-avatar">
                        <div class="employee-details">
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-email">${employee.email}</div>
                        </div>
                    </div>
                </td>
                <td class="employee-id">${employee.id}</td>
                <td class="department-cell">
                    <span class="department-tag" data-department="${employee.department.toLowerCase()}">
                        ${employee.department}
                    </span>
                </td>
                <td class="position-cell">${employee.position}</td>
                <td class="hire-date-cell">${this.formatDate(employee.hireDate)}</td>
                <td class="status-cell">
                    <span class="status-badge ${employee.status}">
                        ${this.formatStatus(employee.status)}
                    </span>
                </td>
                <td class="location-cell">${employee.location}</td>
                <td class="actions-cell">
                    <div class="action-buttons">
                        <button class="action-btn-small" onclick="hrSystem.showEmployeeDetails('${employee.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn-small" onclick="hrSystem.editEmployee('${employee.id}')" title="Edit Employee">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn-small danger" onclick="hrSystem.deleteEmployee('${employee.id}')" title="Delete Employee">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update pagination info
        this.updatePaginationInfo();
        
        this.performanceMetrics.renderTime = performance.now() - startTime;
        console.log(`✅ Employee table rendered in ${this.performanceMetrics.renderTime.toFixed(2)}ms`);
    }

    /**
     * Apply filters to employee list
     */
    applyFilters() {
        const departmentFilter = document.getElementById('departmentFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';
        const locationFilter = document.getElementById('locationFilter')?.value || '';
        
        this.filteredEmployees = this.employees.filter(employee => {
            const departmentMatch = !departmentFilter || employee.department.toLowerCase() === departmentFilter;
            const statusMatch = !statusFilter || employee.status === statusFilter;
            const locationMatch = !locationFilter || employee.location.toLowerCase().includes(locationFilter.toLowerCase());
            
            return departmentMatch && statusMatch && locationMatch;
        });
        
        this.currentPage = 1;
        this.renderEmployeeTable();
        
        console.log(`🔍 Applied filters: ${this.filteredEmployees.length} employees shown`);
    }

    /**
     * Handle employee search
     */
    handleEmployeeSearch(query) {
        if (!query.trim()) {
            this.filteredEmployees = [...this.employees];
            document.getElementById('clearSearch').style.display = 'none';
        } else {
            const lowercaseQuery = query.toLowerCase();
            this.filteredEmployees = this.employees.filter(employee => 
                employee.name.toLowerCase().includes(lowercaseQuery) ||
                employee.id.toLowerCase().includes(lowercaseQuery) ||
                employee.email.toLowerCase().includes(lowercaseQuery) ||
                employee.department.toLowerCase().includes(lowercaseQuery) ||
                employee.position.toLowerCase().includes(lowercaseQuery)
            );
            document.getElementById('clearSearch').style.display = 'block';
        }
        
        this.currentPage = 1;
        this.renderEmployeeTable();
    }

    /**
     * Handle table sorting
     */
    handleTableSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
        });
        
        const currentHeader = document.querySelector(`[data-column="${column}"]`);
        if (currentHeader) {
            currentHeader.classList.add(`sorted-${this.sortDirection}`);
        }
        
        // Sort the data
        this.filteredEmployees.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];
            
            // Handle date columns
            if (column === 'hire_date') {
                valueA = new Date(a.hireDate);
                valueB = new Date(b.hireDate);
            }
            
            // Handle string columns
            if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }
            
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.renderEmployeeTable();
        console.log(`📊 Table sorted by ${column} (${this.sortDirection})`);
    }

    /**
     * Update pagination information
     */
    updatePaginationInfo() {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredEmployees.length);
        const total = this.filteredEmployees.length;
        
        const startEl = document.getElementById('paginationStart');
        const endEl = document.getElementById('paginationEnd');
        const totalEl = document.getElementById('paginationTotal');
        
        if (startEl) startEl.textContent = startIndex.toLocaleString();
        if (endEl) endEl.textContent = endIndex.toLocaleString();
        if (totalEl) totalEl.textContent = total.toLocaleString();
        
        // Update pagination buttons
        const totalPages = Math.ceil(total / this.itemsPerPage);
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        
        if (firstPageBtn) firstPageBtn.disabled = this.currentPage === 1;
        if (prevPageBtn) prevPageBtn.disabled = this.currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = this.currentPage === totalPages;
        if (lastPageBtn) lastPageBtn.disabled = this.currentPage === totalPages;
        
        this.updatePageNumbers(totalPages);
    }

    /**
     * Update page numbers display
     */
    updatePageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById('pageNumbers');
        if (!pageNumbersContainer) return;
        
        let pageButtons = [];
        
        // Always show first page
        pageButtons.push(1);
        
        // Add pages around current page
        const start = Math.max(2, this.currentPage - 1);
        const end = Math.min(totalPages - 1, this.currentPage + 1);
        
        if (start > 2) {
            pageButtons.push('...');
        }
        
        for (let i = start; i <= end; i++) {
            if (i > 1 && i < totalPages) {
                pageButtons.push(i);
            }
        }
        
        if (end < totalPages - 1) {
            pageButtons.push('...');
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pageButtons.push(totalPages);
        }
        
        pageNumbersContainer.innerHTML = pageButtons.map(page => {
            if (page === '...') {
                return '<span class="page-ellipsis">...</span>';
            }
            
            const isActive = page === this.currentPage;
            return `
                <button class="page-number ${isActive ? 'active' : ''}" onclick="hrSystem.goToPage(${page})">
                    ${page}
                </button>
            `;
        }).join('');
    }

    /**
     * Go to specific page
     */
    goToPage(page) {
        this.currentPage = page;
        this.renderEmployeeTable();
    }

    /**
     * Setup real-time updates
     */
    setupRealTimeUpdates() {
        console.log('🔄 Setting up real-time HR updates...');
        
        // Simulate real-time data updates every 30 seconds
        setInterval(() => {
            this.updateKPICards();
            this.updateNotificationsBadge();
        }, 30000);
        
        // Update charts every 5 minutes
        setInterval(() => {
            this.refreshChartData();
        }, 300000);
    }

    /**
     * Toggle notification dropdown
     */
    toggleNotificationDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        }
    }

    /**
     * Update notifications badge
     */
    updateNotificationsBadge() {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            // Simulate changing notification count
            const currentCount = parseInt(badge.textContent);
            const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
            badge.textContent = newCount.toString();
            
            if (newCount === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'block';
            }
        }
    }

    /**
     * Utility function to format dates
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Utility function to format status
     */
    formatStatus(status) {
        const statusMap = {
            'active': 'Active',
            'inactive': 'Inactive',
            'onboarding': 'Onboarding',
            'offboarding': 'Offboarding',
            'terminated': 'Terminated'
        };
        return statusMap[status] || status;
    }

    /**
     * Show employee details modal
     */
    showEmployeeDetails(employeeId) {
        const employee = this.employees.find(emp => emp.id === employeeId);
        if (!employee) return;
        
        const modal = document.getElementById('employeeModalOverlay');
        const modalTitle = document.getElementById('employeeModalTitle');
        const modalContent = document.getElementById('employeeModalContent');
        
        if (!modal || !modalTitle || !modalContent) return;
        
        modalTitle.textContent = `${employee.name} - Employee Details`;
        
        modalContent.innerHTML = `
            <div class="employee-detail-card">
                <div class="employee-detail-header">
                    <img src="${employee.avatar}" alt="${employee.name}" class="employee-detail-avatar">
                    <div class="employee-detail-info">
                        <h3 class="employee-detail-name">${employee.name}</h3>
                        <p class="employee-detail-position">${employee.position}</p>
                        <p class="employee-detail-department">${employee.department}</p>
                    </div>
                    <span class="status-badge ${employee.status}">
                        ${this.formatStatus(employee.status)}
                    </span>
                </div>
                
                <div class="employee-detail-content">
                    <div class="detail-section">
                        <h4 class="detail-section-title">Basic Information</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="detail-label">Employee ID:</span>
                                <span class="detail-value">${employee.id}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${employee.email}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Hire Date:</span>
                                <span class="detail-value">${this.formatDate(employee.hireDate)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Location:</span>
                                <span class="detail-value">${employee.location}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Manager:</span>
                                <span class="detail-value">${employee.manager}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Annual Salary:</span>
                                <span class="detail-value">$${employee.salary.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h4 class="detail-section-title">Performance & Career</h4>
                        <div class="performance-summary">
                            <div class="performance-metric">
                                <span class="metric-label">Overall Rating:</span>
                                <div class="rating-stars">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="far fa-star"></i>
                                    <span class="rating-text">4.2/5.0</span>
                                </div>
                            </div>
                            <div class="performance-metric">
                                <span class="metric-label">Last Review:</span>
                                <span class="metric-value">Q3 2024</span>
                            </div>
                            <div class="performance-metric">
                                <span class="metric-label">Next Review:</span>
                                <span class="metric-value">Q1 2025</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="titan-btn titan-btn-primary">
                            <i class="fas fa-edit"></i>
                            Edit Employee
                        </button>
                        <button class="titan-btn titan-btn-secondary">
                            <i class="fas fa-file-alt"></i>
                            Generate Report
                        </button>
                        <button class="titan-btn titan-btn-secondary">
                            <i class="fas fa-envelope"></i>
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }

    /**
     * Show add employee modal (placeholder)
     */
    showAddEmployeeModal() {
        console.log('👤 Opening add employee modal...');
        alert('Add Employee functionality - To be implemented in Phase 2');
    }

    /**
     * Show process payroll modal (placeholder)
     */
    showProcessPayrollModal() {
        console.log('💰 Opening payroll processing modal...');
        alert('Payroll Processing functionality - To be implemented in Phase 2');
    }

    /**
     * Show schedule interview modal (placeholder)
     */
    showScheduleInterviewModal() {
        console.log('📅 Opening interview scheduling modal...');
        alert('Interview Scheduling functionality - To be implemented in Phase 2');
    }

    /**
     * Show generate report modal (placeholder)
     */
    showGenerateReportModal() {
        console.log('📊 Opening report generation modal...');
        alert('Report Generation functionality - To be implemented in Phase 2');
    }

    /**
     * Filter employees by department
     */
    filterByDepartment(department) {
        const departmentFilter = document.getElementById('departmentFilter');
        if (departmentFilter) {
            departmentFilter.value = department.toLowerCase();
            this.applyFilters();
            this.switchSection('employees');
        }
    }

    /**
     * Refresh chart data
     */
    refreshChartData() {
        console.log('🔄 Refreshing HR chart data...');
        
        // Add slight variations to simulate real-time updates
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.data && chart.data.datasets) {
                chart.data.datasets.forEach(dataset => {
                    dataset.data = dataset.data.map(value => {
                        const variation = 0.95 + Math.random() * 0.1; // ±5% variation
                        return Math.round(value * variation);
                    });
                });
                chart.update('none');
            }
        });
    }

    /**
     * Update employee growth chart based on time filter
     */
    updateEmployeeGrowthChart(timeframe) {
        console.log(`📈 Updating employee growth chart for ${timeframe}`);
        
        // In a real application, this would fetch different data based on timeframe
        // For demo purposes, we'll just update the chart title
        const chart = this.charts.employeeGrowth;
        if (chart) {
            chart.update();
        }
    }

    /**
     * Update department chart view
     */
    updateDepartmentChart(viewType) {
        console.log(`🏢 Updating department chart view: ${viewType}`);
        
        // In a real application, this would switch between count and percentage views
        const chart = this.charts.departmentDistribution;
        if (chart) {
            chart.update();
        }
    }

    /**
     * Update payroll chart data type
     */
    updatePayrollChart(dataType) {
        console.log(`💰 Updating payroll chart for: ${dataType}`);
        
        // In a real application, this would show different payroll data
        const chart = this.charts.payrollExpenses;
        if (chart) {
            chart.update();
        }
    }

    /**
     * Export HR data (placeholder)
     */
    exportHRData() {
        console.log('📤 Exporting HR data...');
        alert('HR Data Export functionality - To be implemented in Phase 2');
    }

    /**
     * Open HR settings (placeholder)
     */
    openHRSettings() {
        console.log('⚙️ Opening HR settings...');
        alert('HR Settings functionality - To be implemented in Phase 2');
    }

    /**
     * Performance monitoring
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            employeeCount: this.employees.length,
            filteredCount: this.filteredEmployees.length,
            chartsInitialized: Object.keys(this.charts).length,
            memoryUsage: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A'
        };
    }

    /**
     * Log system performance
     */
    logPerformance() {
        const metrics = this.getPerformanceMetrics();
        console.log('🎯 HR System Performance Metrics:');
        console.log('  Load Time:', metrics.loadTime.toFixed(2) + 'ms');
        console.log('  Render Time:', metrics.renderTime.toFixed(2) + 'ms');
        console.log('  Employee Records:', metrics.employeeCount.toLocaleString());
        console.log('  Charts Initialized:', metrics.chartsInitialized);
        console.log('  Memory Usage:', metrics.memoryUsage + 'MB');
    }
}

// Global HR System instance
let hrSystem;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🏗️ DOM loaded, initializing HR Management System...');
    
    hrSystem = new HRManagementSystem();
    await hrSystem.init();
    
    // Setup modal close functionality
    const closeModalBtn = document.getElementById('closeEmployeeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('employeeModalOverlay').classList.remove('active');
        });
    }
    
    // Close modal when clicking overlay
    const modalOverlay = document.getElementById('employeeModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }
    
    // Setup header action buttons
    const exportBtn = document.getElementById('exportHRData');
    const settingsBtn = document.getElementById('hrSettings');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => hrSystem.exportHRData());
    }
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => hrSystem.openHRSettings());
    }
    
    // Clear search functionality
    const clearSearchBtn = document.getElementById('clearSearch');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('employeeSearch');
            if (searchInput) {
                searchInput.value = '';
                hrSystem.handleEmployeeSearch('');
            }
        });
    }
    
    console.log('🎉 HR Management System fully operational!');
    console.log('🏆 Oracle EBS competitive advantages:');
    console.log('   ✅ Modern responsive interface (vs Oracle forms-based UI)');
    console.log('   ✅ Real-time analytics and monitoring');
    console.log('   ✅ Advanced search and filtering capabilities');
    console.log('   ✅ Mobile-first design with touch optimization');
    console.log('   ✅ Integrated employee lifecycle management');
    console.log('   ✅ Enterprise-grade performance and scalability');
    
    // Log performance metrics after 2 seconds
    setTimeout(() => {
        hrSystem.logPerformance();
    }, 2000);
});

// Global utility functions
window.hrSystem = null; // Will be set when system initializes

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+K or Cmd+K for global search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('hrGlobalSearch');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HRManagementSystem };
}