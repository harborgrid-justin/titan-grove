/**
 * Titan Grove Enterprise Project Management Suite
 * Advanced project management system with Gantt charts, resource allocation, and task management
 * Oracle EBS competitive alternative with modern PM capabilities
 */

class TitanProjectManagementSuite {
    constructor() {
        this.projects = new Map();
        this.tasks = new Map();
        this.resources = new Map();
        this.ganttChart = null;
        this.currentView = 'overview';
        this.draggedTask = null;
        this.filters = {
            status: 'all',
            priority: 'all',
            assignee: 'all',
            dateRange: 'all'
        };
        this.realTimeUpdates = false;
        this.notifications = [];
        this.initialize();
    }

    async initialize() {
        try {
            this.setupEventListeners();
            this.loadInitialData();
            this.initializeGanttChart();
            this.setupDragAndDrop();
            this.startNotificationSystem();
            this.initializeRealTimeSync();
            console.log('✅ Titan Project Management Suite initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize PM Suite:', error);
        }
    }

    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.pm-nav-item')) {
                this.switchView(e.target.dataset.view);
            }
            if (e.target.matches('.pm-btn-create-project')) {
                this.openProjectModal();
            }
            if (e.target.matches('.pm-btn-create-task')) {
                this.openTaskModal();
            }
            if (e.target.matches('.pm-project-action')) {
                this.handleProjectAction(e.target.dataset.action, e.target.dataset.projectId);
            }
            if (e.target.matches('.pm-task-action')) {
                this.handleTaskAction(e.target.dataset.action, e.target.dataset.taskId);
            }
            if (e.target.matches('.pm-gantt-view-btn')) {
                this.switchGanttView(e.target.dataset.view);
            }
            if (e.target.matches('.pm-modal-close') || e.target.matches('.pm-modal-overlay')) {
                this.closeModal();
            }
        });

        // Form events
        document.addEventListener('submit', (e) => {
            if (e.target.matches('#projectForm')) {
                e.preventDefault();
                this.submitProject(new FormData(e.target));
            }
            if (e.target.matches('#taskForm')) {
                e.preventDefault();
                this.submitTask(new FormData(e.target));
            }
        });

        // Filter events
        document.addEventListener('change', (e) => {
            if (e.target.matches('.pm-filter-select')) {
                this.applyFilters();
            }
            if (e.target.matches('.pm-status-toggle')) {
                this.toggleTaskStatus(e.target.dataset.taskId, e.target.checked);
            }
            if (e.target.matches('.pm-priority-select')) {
                this.updateTaskPriority(e.target.dataset.taskId, e.target.value);
            }
        });

        // Search events
        document.addEventListener('input', (e) => {
            if (e.target.matches('.pm-search-input')) {
                this.handleSearch(e.target.value);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'n':
                        e.preventDefault();
                        this.openProjectModal();
                        break;
                    case 't':
                        e.preventDefault();
                        this.openTaskModal();
                        break;
                    case 'f':
                        e.preventDefault();
                        document.querySelector('.pm-search-input')?.focus();
                        break;
                }
            }
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // Window events
        window.addEventListener('resize', () => {
            if (this.ganttChart) {
                this.ganttChart.resize();
            }
        });
    }

    async loadInitialData() {
        try {
            // Load sample data - in production this would come from API
            const sampleProjects = this.generateSampleProjects();
            const sampleTasks = this.generateSampleTasks();
            const sampleResources = this.generateSampleResources();

            sampleProjects.forEach(project => this.projects.set(project.id, project));
            sampleTasks.forEach(task => this.tasks.set(task.id, task));
            sampleResources.forEach(resource => this.resources.set(resource.id, resource));

            this.updateOverviewDashboard();
            this.updateProjectList();
            this.updateResourceAllocation();
            this.updateTaskBoard();

        } catch (error) {
            console.error('Failed to load initial data:', error);
            this.showNotification('Failed to load project data', 'error');
        }
    }

    generateSampleProjects() {
        return [
            {
                id: 'proj-001',
                name: 'Oracle EBS Migration',
                description: 'Migration from Oracle EBS 12 to Titan Grove Enterprise Suite',
                status: 'in-progress',
                priority: 'critical',
                startDate: new Date('2024-01-15'),
                endDate: new Date('2024-06-30'),
                progress: 65,
                budget: 2500000,
                spent: 1625000,
                manager: 'Sarah Johnson',
                team: ['Alice Cooper', 'Bob Wilson', 'Carol Davis', 'David Brown'],
                milestones: [
                    { name: 'Requirements Analysis', date: new Date('2024-02-15'), completed: true },
                    { name: 'System Design', date: new Date('2024-03-30'), completed: true },
                    { name: 'Development Phase 1', date: new Date('2024-05-15'), completed: false },
                    { name: 'Testing & QA', date: new Date('2024-06-15'), completed: false },
                    { name: 'Go-Live', date: new Date('2024-06-30'), completed: false }
                ]
            },
            {
                id: 'proj-002',
                name: 'Financial Reporting Enhancement',
                description: 'Enhanced financial reporting capabilities with real-time dashboards',
                status: 'in-progress',
                priority: 'high',
                startDate: new Date('2024-02-01'),
                endDate: new Date('2024-05-15'),
                progress: 45,
                budget: 800000,
                spent: 360000,
                manager: 'Mike Chen',
                team: ['Eva Martinez', 'Frank Liu', 'Grace Kim'],
                milestones: [
                    { name: 'Dashboard Design', date: new Date('2024-02-28'), completed: true },
                    { name: 'Backend Integration', date: new Date('2024-04-01'), completed: false },
                    { name: 'User Testing', date: new Date('2024-05-01'), completed: false },
                    { name: 'Deployment', date: new Date('2024-05-15'), completed: false }
                ]
            },
            {
                id: 'proj-003',
                name: 'Mobile App Development',
                description: 'Native mobile application for field service management',
                status: 'planning',
                priority: 'medium',
                startDate: new Date('2024-03-01'),
                endDate: new Date('2024-08-31'),
                progress: 15,
                budget: 1200000,
                spent: 180000,
                manager: 'Jennifer White',
                team: ['Henry Garcia', 'Isabella Rodriguez', 'Jack Thompson'],
                milestones: [
                    { name: 'Market Research', date: new Date('2024-03-15'), completed: true },
                    { name: 'UI/UX Design', date: new Date('2024-04-30'), completed: false },
                    { name: 'iOS Development', date: new Date('2024-06-30'), completed: false },
                    { name: 'Android Development', date: new Date('2024-07-31'), completed: false },
                    { name: 'App Store Release', date: new Date('2024-08-31'), completed: false }
                ]
            },
            {
                id: 'proj-004',
                name: 'Supply Chain Optimization',
                description: 'AI-powered supply chain optimization and predictive analytics',
                status: 'completed',
                priority: 'high',
                startDate: new Date('2023-09-01'),
                endDate: new Date('2024-01-31'),
                progress: 100,
                budget: 1500000,
                spent: 1450000,
                manager: 'Robert Anderson',
                team: ['Laura Wilson', 'Mark Davis', 'Nancy Brown', 'Oscar Green'],
                milestones: [
                    { name: 'Data Analysis', date: new Date('2023-10-15'), completed: true },
                    { name: 'Algorithm Development', date: new Date('2023-12-01'), completed: true },
                    { name: 'Integration Testing', date: new Date('2024-01-15'), completed: true },
                    { name: 'Production Deployment', date: new Date('2024-01-31'), completed: true }
                ]
            }
        ];
    }

    generateSampleTasks() {
        return [
            // Oracle EBS Migration tasks
            {
                id: 'task-001',
                projectId: 'proj-001',
                name: 'Data Mapping Analysis',
                description: 'Map existing Oracle EBS data structures to Titan Grove schema',
                status: 'in-progress',
                priority: 'critical',
                assignee: 'Alice Cooper',
                startDate: new Date('2024-03-01'),
                dueDate: new Date('2024-03-15'),
                progress: 80,
                estimatedHours: 40,
                actualHours: 32,
                dependencies: []
            },
            {
                id: 'task-002',
                projectId: 'proj-001',
                name: 'User Training Material',
                description: 'Create comprehensive training materials for end users',
                status: 'not-started',
                priority: 'medium',
                assignee: 'Bob Wilson',
                startDate: new Date('2024-04-01'),
                dueDate: new Date('2024-04-30'),
                progress: 0,
                estimatedHours: 60,
                actualHours: 0,
                dependencies: ['task-001']
            },
            {
                id: 'task-003',
                projectId: 'proj-001',
                name: 'Security Configuration',
                description: 'Configure security roles and permissions',
                status: 'completed',
                priority: 'high',
                assignee: 'Carol Davis',
                startDate: new Date('2024-02-15'),
                dueDate: new Date('2024-03-01'),
                progress: 100,
                estimatedHours: 30,
                actualHours: 28,
                dependencies: []
            },
            // Financial Reporting tasks
            {
                id: 'task-004',
                projectId: 'proj-002',
                name: 'Dashboard Wireframes',
                description: 'Design wireframes for financial reporting dashboards',
                status: 'completed',
                priority: 'high',
                assignee: 'Eva Martinez',
                startDate: new Date('2024-02-01'),
                dueDate: new Date('2024-02-15'),
                progress: 100,
                estimatedHours: 25,
                actualHours: 22,
                dependencies: []
            },
            {
                id: 'task-005',
                projectId: 'proj-002',
                name: 'API Integration',
                description: 'Integrate with existing financial data APIs',
                status: 'in-progress',
                priority: 'critical',
                assignee: 'Frank Liu',
                startDate: new Date('2024-03-01'),
                dueDate: new Date('2024-03-30'),
                progress: 60,
                estimatedHours: 45,
                actualHours: 27,
                dependencies: ['task-004']
            },
            // Mobile App tasks
            {
                id: 'task-006',
                projectId: 'proj-003',
                name: 'User Research Survey',
                description: 'Conduct survey to understand user needs for mobile app',
                status: 'completed',
                priority: 'medium',
                assignee: 'Henry Garcia',
                startDate: new Date('2024-03-01'),
                dueDate: new Date('2024-03-10'),
                progress: 100,
                estimatedHours: 20,
                actualHours: 18,
                dependencies: []
            },
            {
                id: 'task-007',
                projectId: 'proj-003',
                name: 'Prototype Development',
                description: 'Create interactive prototype for user testing',
                status: 'not-started',
                priority: 'high',
                assignee: 'Isabella Rodriguez',
                startDate: new Date('2024-04-01'),
                dueDate: new Date('2024-04-20'),
                progress: 0,
                estimatedHours: 35,
                actualHours: 0,
                dependencies: ['task-006']
            }
        ];
    }

    generateSampleResources() {
        return [
            {
                id: 'res-001',
                name: 'Alice Cooper',
                role: 'Senior Business Analyst',
                department: 'IT',
                email: 'alice.cooper@titangrove.com',
                skills: ['Business Analysis', 'Process Mapping', 'Requirements Gathering'],
                currentWorkload: 85,
                maxCapacity: 40,
                currentProjects: ['proj-001'],
                hourlyRate: 125,
                availability: {
                    monday: 8,
                    tuesday: 8,
                    wednesday: 8,
                    thursday: 8,
                    friday: 8
                }
            },
            {
                id: 'res-002',
                name: 'Bob Wilson',
                role: 'Technical Writer',
                department: 'Documentation',
                email: 'bob.wilson@titangrove.com',
                skills: ['Technical Writing', 'Training Development', 'User Documentation'],
                currentWorkload: 60,
                maxCapacity: 40,
                currentProjects: ['proj-001'],
                hourlyRate: 85,
                availability: {
                    monday: 8,
                    tuesday: 8,
                    wednesday: 6,
                    thursday: 8,
                    friday: 8
                }
            },
            {
                id: 'res-003',
                name: 'Carol Davis',
                role: 'Security Specialist',
                department: 'IT Security',
                email: 'carol.davis@titangrove.com',
                skills: ['Security Configuration', 'Risk Assessment', 'Compliance'],
                currentWorkload: 75,
                maxCapacity: 40,
                currentProjects: ['proj-001', 'proj-002'],
                hourlyRate: 140,
                availability: {
                    monday: 8,
                    tuesday: 8,
                    wednesday: 8,
                    thursday: 8,
                    friday: 6
                }
            },
            {
                id: 'res-004',
                name: 'Eva Martinez',
                role: 'UX Designer',
                department: 'Design',
                email: 'eva.martinez@titangrove.com',
                skills: ['UI/UX Design', 'Wireframing', 'User Research'],
                currentWorkload: 90,
                maxCapacity: 40,
                currentProjects: ['proj-002', 'proj-003'],
                hourlyRate: 110,
                availability: {
                    monday: 8,
                    tuesday: 8,
                    wednesday: 8,
                    thursday: 8,
                    friday: 8
                }
            },
            {
                id: 'res-005',
                name: 'Frank Liu',
                role: 'Full Stack Developer',
                department: 'Development',
                email: 'frank.liu@titangrove.com',
                skills: ['JavaScript', 'Python', 'API Integration', 'Database Design'],
                currentWorkload: 95,
                maxCapacity: 40,
                currentProjects: ['proj-002'],
                hourlyRate: 130,
                availability: {
                    monday: 8,
                    tuesday: 8,
                    wednesday: 8,
                    thursday: 8,
                    friday: 8
                }
            }
        ];
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.pm-view').forEach(view => {
            view.classList.add('pm-hidden');
        });

        // Show selected view
        const targetView = document.getElementById(`pm-view-${viewName}`);
        if (targetView) {
            targetView.classList.remove('pm-hidden');
            this.currentView = viewName;
        }

        // Update navigation
        document.querySelectorAll('.pm-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`)?.classList.add('active');

        // Load view-specific data
        switch (viewName) {
            case 'overview':
                this.updateOverviewDashboard();
                break;
            case 'projects':
                this.updateProjectList();
                break;
            case 'gantt':
                this.updateGanttChart();
                break;
            case 'resources':
                this.updateResourceAllocation();
                break;
            case 'tasks':
                this.updateTaskBoard();
                break;
            case 'reports':
                this.updateReports();
                break;
        }
    }

    updateOverviewDashboard() {
        const overviewData = this.calculateOverviewMetrics();
        
        // Update KPI cards
        this.updateKPICard('total-projects', overviewData.totalProjects, '+5 this month');
        this.updateKPICard('active-tasks', overviewData.activeTasks, '+12 this week');
        this.updateKPICard('team-utilization', `${overviewData.utilization}%`, '+3.2% from last month');
        this.updateKPICard('on-time-delivery', `${overviewData.onTimeDelivery}%`, '+2.1% improvement');

        // Update charts
        this.updateProjectStatusChart(overviewData.projectsByStatus);
        this.updateResourceUtilizationChart(overviewData.resourceUtilization);
        this.updateBudgetChart(overviewData.budgetData);
    }

    calculateOverviewMetrics() {
        const totalProjects = this.projects.size;
        const activeTasks = Array.from(this.tasks.values())
            .filter(task => task.status === 'in-progress').length;
        
        const totalCapacity = Array.from(this.resources.values())
            .reduce((sum, resource) => sum + resource.maxCapacity, 0);
        const totalWorkload = Array.from(this.resources.values())
            .reduce((sum, resource) => sum + (resource.currentWorkload * resource.maxCapacity / 100), 0);
        const utilization = Math.round((totalWorkload / totalCapacity) * 100);

        const projectsByStatus = this.groupProjectsByStatus();
        const resourceUtilization = this.calculateResourceUtilization();
        const budgetData = this.calculateBudgetData();

        // Calculate on-time delivery (simulated)
        const onTimeDelivery = 87; // This would be calculated from historical data

        return {
            totalProjects,
            activeTasks,
            utilization,
            onTimeDelivery,
            projectsByStatus,
            resourceUtilization,
            budgetData
        };
    }

    groupProjectsByStatus() {
        const statusCounts = { 'planning': 0, 'in-progress': 0, 'on-hold': 0, 'completed': 0, 'cancelled': 0 };
        
        Array.from(this.projects.values()).forEach(project => {
            statusCounts[project.status] = (statusCounts[project.status] || 0) + 1;
        });

        return statusCounts;
    }

    calculateResourceUtilization() {
        return Array.from(this.resources.values()).map(resource => ({
            name: resource.name,
            utilization: resource.currentWorkload
        }));
    }

    calculateBudgetData() {
        let totalBudget = 0;
        let totalSpent = 0;

        Array.from(this.projects.values()).forEach(project => {
            totalBudget += project.budget;
            totalSpent += project.spent;
        });

        return {
            budget: totalBudget,
            spent: totalSpent,
            remaining: totalBudget - totalSpent,
            utilizationRate: Math.round((totalSpent / totalBudget) * 100)
        };
    }

    updateKPICard(cardId, value, change) {
        const card = document.getElementById(cardId);
        if (card) {
            const valueElement = card.querySelector('.pm-overview-value');
            const changeElement = card.querySelector('.pm-overview-change');
            
            if (valueElement) valueElement.textContent = value;
            if (changeElement) changeElement.textContent = change;
        }
    }

    updateProjectStatusChart(data) {
        const ctx = document.getElementById('projectStatusChart');
        if (!ctx) return;

        if (this.projectStatusChart) {
            this.projectStatusChart.destroy();
        }

        this.projectStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [
                        data.planning,
                        data['in-progress'],
                        data['on-hold'],
                        data.completed,
                        data.cancelled
                    ],
                    backgroundColor: [
                        '#6b7280',
                        '#3b82f6',
                        '#f59e0b',
                        '#10b981',
                        '#9ca3af'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    updateResourceUtilizationChart(data) {
        const ctx = document.getElementById('resourceUtilizationChart');
        if (!ctx) return;

        if (this.resourceChart) {
            this.resourceChart.destroy();
        }

        this.resourceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Utilization %',
                    data: data.map(d => d.utilization),
                    backgroundColor: data.map(d => 
                        d.utilization > 90 ? '#ef4444' :
                        d.utilization > 80 ? '#f59e0b' :
                        d.utilization > 60 ? '#3b82f6' : '#10b981'
                    )
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateBudgetChart(data) {
        const ctx = document.getElementById('budgetChart');
        if (!ctx) return;

        if (this.budgetChart) {
            this.budgetChart.destroy();
        }

        this.budgetChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Budget', 'Spent', 'Remaining'],
                datasets: [{
                    data: [data.budget, data.spent, data.remaining],
                    backgroundColor: ['#e5e7eb', '#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    updateProjectList() {
        const projectList = document.getElementById('projectList');
        if (!projectList) return;

        const filteredProjects = this.getFilteredProjects();
        
        projectList.innerHTML = filteredProjects.map(project => `
            <tr class="pm-project-row" data-project-id="${project.id}">
                <td>
                    <div class="pm-project-info">
                        <h4 class="pm-project-name">${project.name}</h4>
                        <p class="pm-project-description">${project.description}</p>
                    </div>
                </td>
                <td>
                    <span class="pm-status-badge ${project.status}">
                        <span class="pm-status-dot"></span>
                        ${project.status.replace('-', ' ').toUpperCase()}
                    </span>
                </td>
                <td>
                    <span class="pm-priority-badge ${project.priority}">
                        ${project.priority.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="pm-progress">
                        <div class="pm-progress-bar progress-${Math.floor(project.progress / 25) * 25}" 
                             style="width: ${project.progress}%"></div>
                    </div>
                    <div class="pm-progress-text">${project.progress}% Complete</div>
                </td>
                <td>
                    <div class="pm-budget-info">
                        <div class="pm-budget-spent">$${(project.spent / 1000000).toFixed(1)}M spent</div>
                        <div class="pm-budget-total">of $${(project.budget / 1000000).toFixed(1)}M total</div>
                    </div>
                </td>
                <td>${this.formatDate(project.endDate)}</td>
                <td>
                    <div class="pm-project-actions">
                        <button class="pm-btn pm-btn-sm pm-project-action" 
                                data-action="edit" data-project-id="${project.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="pm-btn pm-btn-sm pm-project-action" 
                                data-action="view" data-project-id="${project.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredProjects() {
        let projects = Array.from(this.projects.values());

        if (this.filters.status !== 'all') {
            projects = projects.filter(p => p.status === this.filters.status);
        }
        if (this.filters.priority !== 'all') {
            projects = projects.filter(p => p.priority === this.filters.priority);
        }

        return projects.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    }

    initializeGanttChart() {
        const ganttContainer = document.getElementById('ganttChart');
        if (!ganttContainer) return;

        this.ganttChart = new GanttChart(ganttContainer, {
            data: this.prepareGanttData(),
            viewMode: 'Month',
            onClick: (task) => this.onGanttTaskClick(task),
            onProgressChange: (task, progress) => this.onGanttProgressChange(task, progress),
            onDateChange: (task, start, end) => this.onGanttDateChange(task, start, end)
        });
    }

    prepareGanttData() {
        return Array.from(this.projects.values()).map(project => ({
            id: project.id,
            name: project.name,
            start: project.startDate,
            end: project.endDate,
            progress: project.progress,
            dependencies: []
        }));
    }

    switchGanttView(viewMode) {
        if (this.ganttChart) {
            this.ganttChart.change_view_mode(viewMode);
        }

        // Update active view button
        document.querySelectorAll('.pm-gantt-view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewMode}"]`)?.classList.add('active');
    }

    onGanttTaskClick(task) {
        this.openProjectDetailModal(task.id);
    }

    onGanttProgressChange(task, progress) {
        const project = this.projects.get(task.id);
        if (project) {
            project.progress = progress;
            this.saveProject(project);
            this.showNotification(`Updated progress for ${project.name}`, 'success');
        }
    }

    onGanttDateChange(task, start, end) {
        const project = this.projects.get(task.id);
        if (project) {
            project.startDate = start;
            project.endDate = end;
            this.saveProject(project);
            this.showNotification(`Updated dates for ${project.name}`, 'success');
        }
    }

    updateResourceAllocation() {
        const resourceGrid = document.getElementById('resourceGrid');
        if (!resourceGrid) return;

        const resources = Array.from(this.resources.values());
        
        resourceGrid.innerHTML = resources.map(resource => `
            <div class="pm-resource-card">
                <div class="pm-resource-header">
                    <div class="pm-resource-avatar">
                        ${resource.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="pm-resource-info">
                        <h4>${resource.name}</h4>
                        <p>${resource.role} • ${resource.department}</p>
                    </div>
                </div>
                <div class="pm-resource-workload">
                    <div class="pm-workload-label">
                        <span>Workload</span>
                        <span class="pm-workload-percentage">${resource.currentWorkload}%</span>
                    </div>
                    <div class="pm-progress">
                        <div class="pm-progress-bar ${this.getWorkloadClass(resource.currentWorkload)}" 
                             style="width: ${resource.currentWorkload}%"></div>
                    </div>
                </div>
                <div class="pm-resource-projects">
                    <h5>Current Projects</h5>
                    ${resource.currentProjects.map(projectId => {
                        const project = this.projects.get(projectId);
                        return project ? `
                            <div class="pm-resource-project-item">
                                <div class="pm-project-color-dot"></div>
                                <span>${project.name}</span>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
                <div class="pm-resource-skills">
                    ${resource.skills.map(skill => `
                        <span class="pm-skill-badge">${skill}</span>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    getWorkloadClass(workload) {
        if (workload > 90) return 'progress-100';
        if (workload > 75) return 'progress-75';
        if (workload > 50) return 'progress-50';
        if (workload > 25) return 'progress-25';
        return 'progress-0';
    }

    updateTaskBoard() {
        const taskColumns = ['not-started', 'in-progress', 'on-hold', 'completed'];
        
        taskColumns.forEach(status => {
            const column = document.getElementById(`taskColumn${status.replace('-', '_')}`);
            if (!column) return;

            const tasks = Array.from(this.tasks.values())
                .filter(task => task.status === status);

            const taskList = column.querySelector('.pm-task-list');
            if (taskList) {
                taskList.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
            }

            // Update column count
            const countElement = column.querySelector('.pm-task-column-count');
            if (countElement) {
                countElement.textContent = tasks.length;
            }
        });
    }

    createTaskCard(task) {
        const project = this.projects.get(task.projectId);
        const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
        
        return `
            <div class="pm-task-card" draggable="true" data-task-id="${task.id}">
                <div class="pm-task-priority-indicator ${task.priority}"></div>
                <h4 class="pm-task-title">${task.name}</h4>
                <p class="pm-task-description">${task.description}</p>
                <div class="pm-task-project">
                    <i class="fas fa-folder"></i>
                    <span>${project ? project.name : 'Unknown Project'}</span>
                </div>
                <div class="pm-task-progress">
                    <div class="pm-progress">
                        <div class="pm-progress-bar progress-${Math.floor(task.progress / 25) * 25}" 
                             style="width: ${task.progress}%"></div>
                    </div>
                    <span class="pm-progress-text">${task.progress}%</span>
                </div>
                <div class="pm-task-meta">
                    <div class="pm-task-assignee">
                        <div class="pm-task-avatar">
                            ${task.assignee.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>${task.assignee}</span>
                    </div>
                    <div class="pm-task-due-date ${isOverdue ? 'overdue' : ''}">
                        <i class="fas fa-calendar"></i>
                        ${this.formatDate(task.dueDate)}
                    </div>
                </div>
                <div class="pm-task-actions">
                    <button class="pm-btn pm-btn-sm pm-task-action" 
                            data-action="edit" data-task-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="pm-btn pm-btn-sm pm-task-action" 
                            data-action="comment" data-task-id="${task.id}">
                        <i class="fas fa-comment"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.matches('.pm-task-card')) {
                this.draggedTask = e.target.dataset.taskId;
                e.target.classList.add('dragging');
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.matches('.pm-task-card')) {
                e.target.classList.remove('dragging');
                this.draggedTask = null;
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.pm-task-column')) {
                e.preventDefault();
            }
        });

        document.addEventListener('drop', (e) => {
            const column = e.target.closest('.pm-task-column');
            if (column && this.draggedTask) {
                e.preventDefault();
                const newStatus = column.dataset.status;
                this.moveTask(this.draggedTask, newStatus);
            }
        });
    }

    moveTask(taskId, newStatus) {
        const task = this.tasks.get(taskId);
        if (task && task.status !== newStatus) {
            task.status = newStatus;
            if (newStatus === 'completed') {
                task.progress = 100;
            }
            
            this.saveTask(task);
            this.updateTaskBoard();
            this.showNotification(`Task moved to ${newStatus.replace('-', ' ')}`, 'success');
        }
    }

    openProjectModal(projectId = null) {
        const modal = document.getElementById('projectModal');
        const form = document.getElementById('projectForm');
        
        if (projectId) {
            // Edit mode
            const project = this.projects.get(projectId);
            if (project) {
                this.populateProjectForm(form, project);
                modal.querySelector('.pm-modal-title').textContent = 'Edit Project';
            }
        } else {
            // Create mode
            form.reset();
            modal.querySelector('.pm-modal-title').textContent = 'Create New Project';
        }

        this.showModal(modal);
    }

    openTaskModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        
        if (taskId) {
            // Edit mode
            const task = this.tasks.get(taskId);
            if (task) {
                this.populateTaskForm(form, task);
                modal.querySelector('.pm-modal-title').textContent = 'Edit Task';
            }
        } else {
            // Create mode
            form.reset();
            modal.querySelector('.pm-modal-title').textContent = 'Create New Task';
        }

        this.populateProjectOptions(form.querySelector('#taskProject'));
        this.populateResourceOptions(form.querySelector('#taskAssignee'));
        this.showModal(modal);
    }

    showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.querySelectorAll('.pm-modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    submitProject(formData) {
        const project = {
            id: formData.get('projectId') || this.generateId('proj'),
            name: formData.get('projectName'),
            description: formData.get('projectDescription'),
            status: formData.get('projectStatus'),
            priority: formData.get('projectPriority'),
            startDate: new Date(formData.get('projectStartDate')),
            endDate: new Date(formData.get('projectEndDate')),
            budget: parseFloat(formData.get('projectBudget')),
            manager: formData.get('projectManager'),
            progress: parseFloat(formData.get('projectProgress')) || 0,
            spent: parseFloat(formData.get('projectSpent')) || 0,
            team: [],
            milestones: []
        };

        this.saveProject(project);
        this.closeModal();
        this.updateProjectList();
        this.showNotification(`Project ${project.id ? 'updated' : 'created'} successfully`, 'success');
    }

    submitTask(formData) {
        const task = {
            id: formData.get('taskId') || this.generateId('task'),
            projectId: formData.get('taskProject'),
            name: formData.get('taskName'),
            description: formData.get('taskDescription'),
            status: formData.get('taskStatus'),
            priority: formData.get('taskPriority'),
            assignee: formData.get('taskAssignee'),
            startDate: new Date(formData.get('taskStartDate')),
            dueDate: new Date(formData.get('taskDueDate')),
            estimatedHours: parseFloat(formData.get('taskEstimatedHours')),
            progress: parseFloat(formData.get('taskProgress')) || 0,
            actualHours: parseFloat(formData.get('taskActualHours')) || 0,
            dependencies: []
        };

        this.saveTask(task);
        this.closeModal();
        this.updateTaskBoard();
        this.showNotification(`Task ${task.id ? 'updated' : 'created'} successfully`, 'success');
    }

    saveProject(project) {
        this.projects.set(project.id, project);
        // In a real application, this would save to the server
        this.syncToServer('project', project);
    }

    saveTask(task) {
        this.tasks.set(task.id, task);
        // In a real application, this would save to the server
        this.syncToServer('task', task);
    }

    handleProjectAction(action, projectId) {
        switch (action) {
            case 'edit':
                this.openProjectModal(projectId);
                break;
            case 'view':
                this.openProjectDetailModal(projectId);
                break;
            case 'duplicate':
                this.duplicateProject(projectId);
                break;
            case 'archive':
                this.archiveProject(projectId);
                break;
        }
    }

    handleTaskAction(action, taskId) {
        switch (action) {
            case 'edit':
                this.openTaskModal(taskId);
                break;
            case 'comment':
                this.openTaskCommentModal(taskId);
                break;
            case 'delete':
                this.deleteTask(taskId);
                break;
        }
    }

    applyFilters() {
        this.filters.status = document.getElementById('statusFilter')?.value || 'all';
        this.filters.priority = document.getElementById('priorityFilter')?.value || 'all';
        this.filters.assignee = document.getElementById('assigneeFilter')?.value || 'all';

        this.updateProjectList();
        this.updateTaskBoard();
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.clearSearch();
            return;
        }

        const results = this.searchProjects(query);
        this.displaySearchResults(results);
    }

    searchProjects(query) {
        const queryLower = query.toLowerCase();
        const results = [];

        // Search projects
        Array.from(this.projects.values()).forEach(project => {
            if (project.name.toLowerCase().includes(queryLower) ||
                project.description.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'project',
                    item: project,
                    relevance: this.calculateSearchRelevance(query, project.name + ' ' + project.description)
                });
            }
        });

        // Search tasks
        Array.from(this.tasks.values()).forEach(task => {
            if (task.name.toLowerCase().includes(queryLower) ||
                task.description.toLowerCase().includes(queryLower)) {
                results.push({
                    type: 'task',
                    item: task,
                    relevance: this.calculateSearchRelevance(query, task.name + ' ' + task.description)
                });
            }
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    calculateSearchRelevance(query, text) {
        const queryLower = query.toLowerCase();
        const textLower = text.toLowerCase();
        
        if (textLower.includes(queryLower)) {
            return 100 - textLower.indexOf(queryLower);
        }
        
        const queryWords = queryLower.split(' ');
        let score = 0;
        queryWords.forEach(word => {
            if (textLower.includes(word)) {
                score += 50;
            }
        });
        
        return score;
    }

    startNotificationSystem() {
        // Check for overdue tasks every 5 minutes
        setInterval(() => {
            this.checkOverdueTasks();
        }, 5 * 60 * 1000);

        // Check for upcoming deadlines every hour
        setInterval(() => {
            this.checkUpcomingDeadlines();
        }, 60 * 60 * 1000);

        // Initial checks
        this.checkOverdueTasks();
        this.checkUpcomingDeadlines();
    }

    checkOverdueTasks() {
        const now = new Date();
        const overdueTasks = Array.from(this.tasks.values())
            .filter(task => new Date(task.dueDate) < now && task.status !== 'completed');

        if (overdueTasks.length > 0) {
            this.showNotification(
                `${overdueTasks.length} task(s) are overdue`,
                'error',
                'View Tasks',
                () => this.switchView('tasks')
            );
        }
    }

    checkUpcomingDeadlines() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        const upcomingTasks = Array.from(this.tasks.values())
            .filter(task => {
                const dueDate = new Date(task.dueDate);
                return dueDate >= now && dueDate <= tomorrow && task.status !== 'completed';
            });

        if (upcomingTasks.length > 0) {
            this.showNotification(
                `${upcomingTasks.length} task(s) due tomorrow`,
                'warning',
                'View Tasks',
                () => this.switchView('tasks')
            );
        }
    }

    initializeRealTimeSync() {
        // Simulate real-time updates
        setInterval(() => {
            if (this.realTimeUpdates) {
                this.syncFromServer();
            }
        }, 30000); // Sync every 30 seconds
    }

    async syncToServer(type, data) {
        // Simulate API call
        try {
            console.log(`Syncing ${type}:`, data);
            // In a real application, this would make an HTTP request
        } catch (error) {
            console.error('Sync failed:', error);
            this.showNotification('Sync failed - changes saved locally', 'warning');
        }
    }

    async syncFromServer() {
        // Simulate receiving updates from server
        try {
            // In a real application, this would fetch updates from the server
            console.log('Syncing from server...');
        } catch (error) {
            console.error('Server sync failed:', error);
        }
    }

    showNotification(message, type = 'info', actionText = null, actionCallback = null) {
        const notification = document.createElement('div');
        notification.className = `pm-notification ${type}`;
        
        const notificationContent = `
            <div class="pm-notification-content">
                <div class="pm-notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                </div>
                <div class="pm-notification-message">${message}</div>
                ${actionText ? `<button class="pm-notification-action">${actionText}</button>` : ''}
                <button class="pm-notification-close">&times;</button>
            </div>
        `;
        
        notification.innerHTML = notificationContent;
        document.body.appendChild(notification);

        // Add event listeners
        notification.querySelector('.pm-notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        if (actionCallback) {
            const actionButton = notification.querySelector('.pm-notification-action');
            if (actionButton) {
                actionButton.addEventListener('click', () => {
                    actionCallback();
                    this.removeNotification(notification);
                });
            }
        }

        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Store notification
        this.notifications.push({
            id: Date.now(),
            message,
            type,
            timestamp: new Date(),
            element: notification
        });
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    generateId(prefix) {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    formatDate(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    populateProjectOptions(selectElement) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Select Project</option>' +
            Array.from(this.projects.values())
                .map(project => `<option value="${project.id}">${project.name}</option>`)
                .join('');
    }

    populateResourceOptions(selectElement) {
        if (!selectElement) return;
        
        selectElement.innerHTML = '<option value="">Select Assignee</option>' +
            Array.from(this.resources.values())
                .map(resource => `<option value="${resource.name}">${resource.name}</option>`)
                .join('');
    }

    // Utility method to export project data
    exportProjectData(format = 'json') {
        const data = {
            projects: Array.from(this.projects.values()),
            tasks: Array.from(this.tasks.values()),
            resources: Array.from(this.resources.values()),
            exportDate: new Date(),
            version: '1.0'
        };

        let content, filename, mimeType;

        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `titan-projects-${Date.now()}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.convertProjectsToCSV(data.projects);
                filename = `titan-projects-${Date.now()}.csv`;
                mimeType = 'text/csv';
                break;
            default:
                console.error('Unsupported export format:', format);
                return;
        }

        this.downloadFile(content, filename, mimeType);
    }

    convertProjectsToCSV(projects) {
        if (projects.length === 0) return '';

        const headers = ['Name', 'Description', 'Status', 'Priority', 'Start Date', 'End Date', 'Progress', 'Budget', 'Spent', 'Manager'];
        const rows = projects.map(project => [
            project.name,
            project.description,
            project.status,
            project.priority,
            this.formatDate(project.startDate),
            this.formatDate(project.endDate),
            `${project.progress}%`,
            `$${project.budget}`,
            `$${project.spent}`,
            project.manager
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Simple Gantt Chart implementation for demonstration
class GanttChart {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.viewMode = options.viewMode || 'Month';
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="gantt-timeline">
                <div class="gantt-header">
                    <div class="gantt-task-column">Tasks</div>
                    <div class="gantt-date-columns">${this.renderDateColumns()}</div>
                </div>
                <div class="gantt-body">
                    ${this.options.data.map(task => this.renderTaskRow(task)).join('')}
                </div>
            </div>
        `;
    }

    renderDateColumns() {
        // Simplified date column rendering
        const dates = [];
        const start = new Date(2024, 0, 1);
        const end = new Date(2024, 11, 31);
        
        for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
            dates.push(new Date(d));
        }

        return dates.map(date => 
            `<div class="gantt-date-column">${date.toLocaleString('default', { month: 'short' })}</div>`
        ).join('');
    }

    renderTaskRow(task) {
        const duration = Math.floor((task.end - task.start) / (1000 * 60 * 60 * 24));
        const startOffset = Math.floor((task.start - new Date(2024, 0, 1)) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="gantt-task-row">
                <div class="gantt-task-name">${task.name}</div>
                <div class="gantt-task-timeline">
                    <div class="gantt-task-bar" 
                         style="left: ${startOffset * 2}px; width: ${duration * 2}px;"
                         onclick="this.dispatchEvent(new CustomEvent('taskClick', {detail: '${task.id}'}))">
                        <div class="gantt-task-progress" style="width: ${task.progress}%"></div>
                        ${task.name}
                    </div>
                </div>
            </div>
        `;
    }

    change_view_mode(mode) {
        this.viewMode = mode;
        this.render();
    }

    resize() {
        // Handle resize if needed
        this.render();
    }
}

// Initialize the Project Management Suite when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.titanPM = new TitanProjectManagementSuite();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TitanProjectManagementSuite, GanttChart };
}