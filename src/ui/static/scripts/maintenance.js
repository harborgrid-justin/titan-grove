/**
 * Maintenance Management - Advanced Interactive Business Logic
 * Enterprise maintenance operations with predictive analytics, condition-based monitoring,
 * and intelligent preventive scheduling using dependency injection and AI patterns
 */

class MaintenanceManagementEngine {
    constructor() {
        // Service dependencies (dependency injection pattern)
        this.maintenanceService = null;
        this.predictiveAnalytics = null;
        this.conditionMonitoring = null;
        this.messageQueue = null;
        this.cacheManager = null;
        this.logger = null;
        
        // Core business entities
        this.assets = new Map();
        this.maintenanceOrders = new Map();
        this.preventivePlans = new Map();
        this.predictiveModels = new Map();
        this.inventory = new Map();
        this.maintenanceHistory = new Map();
        
        // UI state management
        this.currentView = 'dashboard';
        this.selectedAsset = null;
        this.selectedMaintenanceOrder = null;
        this.realTimeMonitoring = true;
        
        // Predictive analytics state
        this.aiModels = {
            failurePrediction: null,
            conditionBased: null,
            costOptimization: null
        };
        
        // Charts and visualizations
        this.charts = new Map();
        
        this.initialize();
    }

    async initialize() {
        try {
            // Initialize service dependencies
            await this.initializeServices();
            
            // Setup UI interactions
            this.setupEventListeners();
            
            // Load initial business data
            await this.loadInitialData();
            
            // Initialize predictive analytics
            this.initializePredictiveAnalytics();
            
            // Start real-time monitoring
            this.startRealTimeMonitoring();
            
            // Initialize condition-based monitoring
            this.startConditionBasedMonitoring();
            
            console.log('✅ Maintenance Management Engine initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Maintenance Management:', error);
        }
    }

    // ==================== SERVICE INITIALIZATION (DEPENDENCY INJECTION) ====================

    async initializeServices() {
        // Logger service
        this.logger = {
            info: (msg, data) => console.log(`[MAINT INFO] ${msg}`, data),
            warn: (msg, data) => console.warn(`[MAINT WARN] ${msg}`, data),
            error: (msg, data) => console.error(`[MAINT ERROR] ${msg}`, data)
        };

        // Message queue service for enterprise integration
        this.messageQueue = {
            publish: async (queue, type, data, options = {}) => {
                this.logger.info('Publishing maintenance message', { queue, type, data });
                await this.handleMessage(type, data, options);
                return Promise.resolve();
            },
            subscribe: (queue, handler) => {
                this.logger.info('Subscribed to maintenance queue', { queue });
            }
        };

        // Cache manager for performance optimization
        this.cacheManager = new Map();

        // Predictive analytics service
        this.predictiveAnalytics = {
            trainModel: async (modelType, trainingData) => this.trainPredictiveModel(modelType, trainingData),
            predict: async (modelType, assetData) => this.runPrediction(modelType, assetData),
            analyzeCondition: async (assetId, sensorData) => this.analyzeAssetCondition(assetId, sensorData),
            optimizeMaintenance: async (constraints) => this.optimizeMaintenanceSchedule(constraints)
        };

        // Condition monitoring service
        this.conditionMonitoring = {
            processIoTData: async (assetId, sensorData) => this.processIoTSensorData(assetId, sensorData),
            detectAnomalies: async (assetId) => this.detectMaintenanceAnomalies(assetId),
            calculateHealthScore: async (assetId) => this.calculateAssetHealthScore(assetId),
            generateAlerts: async (assetId, condition) => this.generateMaintenanceAlerts(assetId, condition)
        };

        // Maintenance business service
        this.maintenanceService = {
            createMaintenanceOrder: async (orderData) => this.createMaintenanceOrder(orderData),
            schedulePreventiveMaintenance: async (planData) => this.schedulePreventiveMaintenance(planData),
            updateMaintenanceStatus: async (orderId, status) => this.updateMaintenanceStatus(orderId, status),
            calculateMaintenanceKPIs: async () => this.calculateMaintenanceKPIs(),
            optimizeMaintenanceSchedule: async (criteria) => this.optimizeMaintenanceSchedule(criteria),
            performRCA: async (failureData) => this.performRootCauseAnalysis(failureData)
        };
    }

    // ==================== EVENT HANDLING ====================

    setupEventListeners() {
        // Navigation events
        document.addEventListener('click', (e) => {
            if (e.target.matches('.maintenance-nav-item')) {
                this.switchView(e.target.dataset.view);
            }
            if (e.target.matches('#createMaintenanceOrder, #newMaintenanceWorkOrder')) {
                this.openCreateMaintenanceOrderModal();
            }
            if (e.target.matches('#emergencyMaintenance')) {
                this.handleEmergencyMaintenance();
            }
            if (e.target.matches('#scheduleOptimization, #optimizeSchedule')) {
                this.runMaintenanceOptimization();
            }
            if (e.target.matches('#runPrediction')) {
                this.runPredictiveAnalysis();
            }
            if (e.target.matches('#trainModel')) {
                this.trainAIModels();
            }
            if (e.target.matches('.asset-health-card')) {
                this.showAssetHealthDetails(e.target.dataset.assetId);
            }
            if (e.target.matches('.maintenance-order-item')) {
                this.showMaintenanceOrderDetails(e.target.dataset.orderId);
            }
            if (e.target.matches('.health-filter')) {
                this.filterAssetsByHealth(e.target.dataset.filter);
            }
            if (e.target.matches('#createPreventivePlan')) {
                this.openPreventivePlanModal();
            }
            if (e.target.matches('.prediction-card')) {
                this.showPredictionDetails(e.target.dataset.predictionId);
            }
        });

        // Form and filter events
        document.addEventListener('change', (e) => {
            if (e.target.matches('#priorityFilter')) {
                this.filterMaintenanceByPriority(e.target.value);
            }
            if (e.target.matches('#statusFilter')) {
                this.filterMaintenanceByStatus(e.target.value);
            }
            if (e.target.matches('#scheduleDateFilter')) {
                this.updateScheduleDateRange(e.target.value);
            }
        });

        // Real-time search
        document.addEventListener('input', (e) => {
            if (e.target.matches('#maintenanceGlobalSearch')) {
                this.handleGlobalSearch(e.target.value);
            }
            if (e.target.matches('#workOrderSearch')) {
                this.searchMaintenanceOrders(e.target.value);
            }
        });
    }

    // ==================== BUSINESS LOGIC OPERATIONS ====================

    async createMaintenanceOrder(orderData) {
        const maintenanceOrderId = `MO${Date.now()}`;
        
        const maintenanceOrder = {
            maintenanceOrderId,
            assetId: orderData.assetId,
            priority: orderData.priority || 'MEDIUM',
            status: 'PENDING',
            type: orderData.type || 'PREVENTIVE', // PREVENTIVE, CORRECTIVE, EMERGENCY, PREDICTIVE
            description: orderData.description,
            scheduledDate: orderData.scheduledDate,
            estimatedDuration: orderData.estimatedDuration || 240, // minutes
            assignedTechnicians: orderData.assignedTechnicians || [],
            requiredParts: orderData.requiredParts || [],
            instructions: orderData.instructions,
            safetyRequirements: orderData.safetyRequirements || [],
            createdDate: new Date(),
            updatedDate: new Date(),
            cost: {
                estimated: orderData.estimatedCost || 0,
                actual: 0,
                labor: 0,
                parts: 0
            },
            conditions: {
                temperature: null,
                humidity: null,
                operatingHours: null,
                lastMaintenance: null
            }
        };

        this.maintenanceOrders.set(maintenanceOrderId, maintenanceOrder);
        
        // Cache for quick access
        this.cacheManager.set(`maintenance-order:${maintenanceOrderId}`, maintenanceOrder);
        
        // Publish message for enterprise integration
        await this.messageQueue.publish('MAINTENANCE', 'MAINTENANCE_ORDER_CREATED', {
            maintenanceOrderId,
            assetId: maintenanceOrder.assetId,
            priority: maintenanceOrder.priority,
            type: maintenanceOrder.type,
            scheduledDate: maintenanceOrder.scheduledDate,
            timestamp: new Date()
        });

        // Auto-assign technicians if intelligent assignment is enabled
        if (this.shouldAutoAssignTechnicians(maintenanceOrder)) {
            await this.intelligentTechnicianAssignment(maintenanceOrderId);
        }

        // Update predictive model if this is condition-based
        if (maintenanceOrder.type === 'PREDICTIVE') {
            await this.updatePredictiveModel(maintenanceOrder.assetId, maintenanceOrder);
        }

        this.logger.info('Maintenance order created', { maintenanceOrderId, type: maintenanceOrder.type });
        this.refreshMaintenanceDisplay();
        
        return maintenanceOrder;
    }

    async schedulePreventiveMaintenance(planData) {
        const preventivePlanId = `PP${Date.now()}`;
        
        const preventivePlan = {
            preventivePlanId,
            assetId: planData.assetId,
            name: planData.name,
            description: planData.description,
            frequency: planData.frequency, // DAILY, WEEKLY, MONTHLY, QUARTERLY, ANNUALLY
            interval: planData.interval || 1,
            tasks: planData.tasks || [],
            estimatedDuration: planData.estimatedDuration || 120,
            requiredSkills: planData.requiredSkills || [],
            safetyProcedures: planData.safetyProcedures || [],
            active: true,
            nextScheduledDate: this.calculateNextMaintenanceDate(planData.frequency, planData.interval),
            createdDate: new Date(),
            updatedDate: new Date(),
            completionHistory: []
        };

        this.preventivePlans.set(preventivePlanId, preventivePlan);
        
        // Generate initial maintenance orders based on the plan
        await this.generateMaintenanceOrdersFromPlan(preventivePlan);
        
        // Cache the plan
        this.cacheManager.set(`preventive-plan:${preventivePlanId}`, preventivePlan);
        
        // Publish message
        await this.messageQueue.publish('MAINTENANCE', 'PREVENTIVE_PLAN_CREATED', {
            preventivePlanId,
            assetId: preventivePlan.assetId,
            frequency: preventivePlan.frequency,
            nextScheduledDate: preventivePlan.nextScheduledDate,
            timestamp: new Date()
        });

        this.logger.info('Preventive maintenance plan created', { preventivePlanId, frequency: planData.frequency });
        
        return preventivePlan;
    }

    async runPredictiveAnalysis() {
        this.logger.info('Running predictive analysis for all assets');

        const predictions = [];
        
        for (const [assetId, asset] of this.assets) {
            try {
                // Get latest sensor data for the asset
                const sensorData = await this.getLatestSensorData(assetId);
                
                // Run failure prediction
                const failurePrediction = await this.predictiveAnalytics.predict('failurePrediction', {
                    assetId,
                    sensorData,
                    maintenanceHistory: this.getAssetMaintenanceHistory(assetId),
                    operatingConditions: asset.operatingConditions
                });

                // Analyze condition
                const conditionAnalysis = await this.conditionMonitoring.analyzeCondition(assetId, sensorData);
                
                // Calculate health score
                const healthScore = await this.conditionMonitoring.calculateHealthScore(assetId);

                const prediction = {
                    predictionId: `PRED${Date.now()}_${assetId}`,
                    assetId,
                    assetName: asset.name,
                    failureRisk: failurePrediction.riskLevel,
                    failureProbability: failurePrediction.probability,
                    predictedFailureDate: failurePrediction.predictedDate,
                    conditionScore: conditionAnalysis.score,
                    healthScore: healthScore.overall,
                    recommendations: this.generateMaintenanceRecommendations(failurePrediction, conditionAnalysis),
                    timestamp: new Date(),
                    confidence: failurePrediction.confidence
                };

                predictions.push(prediction);

                // Generate alerts for high-risk assets
                if (failurePrediction.riskLevel === 'HIGH' || failurePrediction.riskLevel === 'CRITICAL') {
                    await this.generatePredictiveAlert(prediction);
                }

            } catch (error) {
                this.logger.error(`Failed to run prediction for asset ${assetId}`, error);
            }
        }

        // Update predictions display
        this.displayPredictiveAnalysisResults(predictions);
        
        // Publish results
        await this.messageQueue.publish('MAINTENANCE', 'PREDICTIVE_ANALYSIS_COMPLETED', {
            totalAssets: this.assets.size,
            predictions: predictions.length,
            highRiskAssets: predictions.filter(p => p.failureRisk === 'HIGH' || p.failureRisk === 'CRITICAL').length,
            timestamp: new Date()
        });

        return predictions;
    }

    async optimizeMaintenanceSchedule(criteria) {
        this.logger.info('Optimizing maintenance schedule', { criteria });

        const pendingOrders = Array.from(this.maintenanceOrders.values())
            .filter(order => order.status === 'PENDING');
        
        const availableResources = this.getAvailableMaintenanceResources();
        
        // Advanced optimization algorithm
        const optimizedSchedule = await this.calculateOptimalMaintenanceSchedule(
            pendingOrders,
            availableResources,
            criteria
        );

        // Apply optimized assignments
        for (const assignment of optimizedSchedule.assignments) {
            const order = this.maintenanceOrders.get(assignment.maintenanceOrderId);
            if (order) {
                order.scheduledDate = assignment.optimizedDate;
                order.assignedTechnicians = assignment.assignedTechnicians;
                order.updatedDate = new Date();
                
                // Update cache
                this.cacheManager.set(`maintenance-order:${assignment.maintenanceOrderId}`, order);
            }
        }

        // Display optimization results
        this.displayMaintenanceOptimizationResults(optimizedSchedule);

        await this.messageQueue.publish('MAINTENANCE', 'SCHEDULE_OPTIMIZED', {
            totalOrders: pendingOrders.length,
            optimizedAssignments: optimizedSchedule.assignments.length,
            costSavings: optimizedSchedule.metrics.costSavings,
            efficiencyGain: optimizedSchedule.metrics.efficiencyGain,
            timestamp: new Date()
        });

        return optimizedSchedule;
    }

    // ==================== PREDICTIVE ANALYTICS ====================

    async trainPredictiveModel(modelType, trainingData) {
        this.logger.info('Training predictive model', { modelType, dataPoints: trainingData.length });

        // Simulate AI model training (in real implementation, this would use ML libraries)
        const model = {
            modelId: `MODEL_${modelType}_${Date.now()}`,
            type: modelType,
            trainingData: trainingData,
            accuracy: 0.85 + Math.random() * 0.1, // Simulate 85-95% accuracy
            lastTrained: new Date(),
            version: '1.0',
            features: this.extractModelFeatures(trainingData),
            hyperparameters: this.optimizeHyperparameters(modelType)
        };

        this.aiModels[modelType] = model;
        this.predictiveModels.set(model.modelId, model);

        // Cache the model
        this.cacheManager.set(`ai-model:${modelType}`, model);

        await this.messageQueue.publish('MAINTENANCE', 'AI_MODEL_TRAINED', {
            modelType,
            modelId: model.modelId,
            accuracy: model.accuracy,
            trainingDataSize: trainingData.length,
            timestamp: new Date()
        });

        return model;
    }

    async runPrediction(modelType, assetData) {
        const model = this.aiModels[modelType];
        if (!model) {
            throw new Error(`Predictive model ${modelType} not trained`);
        }

        // Simulate prediction algorithm
        const baseRisk = this.calculateBaseRisk(assetData);
        const adjustedRisk = this.adjustRiskForConditions(baseRisk, assetData.sensorData);
        
        const prediction = {
            riskLevel: this.classifyRiskLevel(adjustedRisk),
            probability: adjustedRisk,
            predictedDate: this.calculatePredictedFailureDate(adjustedRisk, assetData.maintenanceHistory),
            confidence: model.accuracy * (0.8 + Math.random() * 0.2), // Simulate confidence
            factors: this.identifyRiskFactors(assetData),
            mitigationActions: this.generateMitigationActions(adjustedRisk, assetData)
        };

        return prediction;
    }

    async analyzeAssetCondition(assetId, sensorData) {
        const asset = this.assets.get(assetId);
        if (!asset) {
            throw new Error(`Asset ${assetId} not found`);
        }

        // Condition analysis algorithm
        const vibrationScore = this.analyzeVibrationData(sensorData.vibration);
        const temperatureScore = this.analyzeTemperatureData(sensorData.temperature);
        const pressureScore = this.analyzePressureData(sensorData.pressure);
        const lubricationScore = this.analyzeLubricationData(sensorData.lubrication);

        const overallScore = (vibrationScore + temperatureScore + pressureScore + lubricationScore) / 4;

        const conditionAnalysis = {
            assetId,
            timestamp: new Date(),
            score: overallScore,
            status: this.classifyConditionStatus(overallScore),
            componentScores: {
                vibration: vibrationScore,
                temperature: temperatureScore,
                pressure: pressureScore,
                lubrication: lubricationScore
            },
            anomalies: this.detectConditionAnomalies(sensorData),
            recommendations: this.generateConditionRecommendations(overallScore, sensorData)
        };

        // Update asset condition history
        if (!asset.conditionHistory) {
            asset.conditionHistory = [];
        }
        asset.conditionHistory.push(conditionAnalysis);

        return conditionAnalysis;
    }

    // ==================== REAL-TIME MONITORING ====================

    startRealTimeMonitoring() {
        if (!this.realTimeMonitoring) return;

        // Update maintenance KPIs every 45 seconds
        setInterval(() => {
            this.updateMaintenanceKPIs();
        }, 45000);

        // Update asset health monitoring every 30 seconds
        setInterval(() => {
            this.updateAssetHealthMonitoring();
        }, 30000);

        // Check for overdue maintenance every 60 seconds
        setInterval(() => {
            this.checkOverdueMaintenance();
        }, 60000);

        // Process IoT sensor data every 15 seconds
        setInterval(() => {
            this.processRealtimeIoTData();
        }, 15000);
    }

    startConditionBasedMonitoring() {
        // Simulate IoT sensor data processing
        setInterval(async () => {
            for (const [assetId, asset] of this.assets) {
                if (asset.monitoringEnabled && asset.sensorData) {
                    try {
                        // Simulate real-time sensor data
                        const realtimeSensorData = this.simulateIoTSensorData(asset);
                        
                        // Process the data
                        await this.conditionMonitoring.processIoTData(assetId, realtimeSensorData);
                        
                        // Check for anomalies
                        const anomalies = await this.conditionMonitoring.detectAnomalies(assetId);
                        
                        if (anomalies.length > 0) {
                            await this.handleConditionAnomalies(assetId, anomalies);
                        }
                        
                    } catch (error) {
                        this.logger.error(`Error processing IoT data for asset ${assetId}`, error);
                    }
                }
            }
        }, 20000); // Every 20 seconds
    }

    updateMaintenanceKPIs() {
        const kpis = this.calculateMaintenanceKPIs();
        
        // Update UI elements
        document.getElementById('assetUptime').textContent = `${kpis.assetUptime.toFixed(1)}%`;
        document.getElementById('mttr').textContent = `${kpis.mttr.toFixed(1)}h`;
        document.getElementById('plannedMaintenance').textContent = `${kpis.plannedMaintenanceRatio.toFixed(1)}%`;
        document.getElementById('maintenanceCost').textContent = `$${(kpis.monthlyCost / 1000).toFixed(1)}K`;
        
        // Update header metrics
        document.getElementById('pendingMaintenanceCount').textContent = kpis.pendingMaintenance;
        document.getElementById('overdueItemsCount').textContent = kpis.overdueMaintenance;
        document.getElementById('systemUptime').textContent = `${kpis.systemUptime.toFixed(1)}%`;
    }

    // ==================== UI UPDATES ====================

    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.maintenance-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.view === viewName);
        });

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === this.getViewSectionId(viewName));
        });

        this.currentView = viewName;
        
        // Load view-specific data
        this.loadViewData(viewName);
    }

    refreshMaintenanceDisplay() {
        this.displayMaintenanceTimeline();
        this.updateAssetHealthGrid();
        this.updateMaintenanceKPIs();
    }

    displayMaintenanceTimeline() {
        const timelineContainer = document.getElementById('maintenanceTimeline');
        if (!timelineContainer) return;

        const today = new Date();
        const todaysOrders = Array.from(this.maintenanceOrders.values())
            .filter(order => {
                return order.scheduledDate && 
                       this.isSameDay(new Date(order.scheduledDate), today) &&
                       order.status !== 'CANCELLED';
            })
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

        timelineContainer.innerHTML = todaysOrders.map(order => `
            <div class="maintenance-timeline-item ${order.status.toLowerCase()} ${order.type.toLowerCase()}">
                <div class="timeline-time">${this.formatTime(order.scheduledDate)}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <span class="order-id">#${order.maintenanceOrderId}</span>
                        <span class="order-type ${order.type.toLowerCase()}">${order.type}</span>
                        <span class="priority-indicator ${order.priority.toLowerCase()}"></span>
                    </div>
                    <div class="timeline-description">${order.description}</div>
                    <div class="timeline-asset">
                        <i class="fas fa-cube"></i> ${this.getAssetName(order.assetId)}
                    </div>
                    <div class="timeline-technicians">
                        ${order.assignedTechnicians.length > 0 ? 
                            `<i class="fas fa-users"></i> ${order.assignedTechnicians.length} technician(s)` :
                            '<i class="fas fa-user-slash"></i> Unassigned'
                        }
                    </div>
                </div>
                <div class="timeline-actions">
                    ${order.status === 'PENDING' ? 
                        `<button class="start-maintenance-btn" data-order-id="${order.maintenanceOrderId}">Start</button>` :
                        order.status === 'IN_PROGRESS' ?
                        `<button class="complete-maintenance-btn" data-order-id="${order.maintenanceOrderId}">Complete</button>` :
                        ''
                    }
                </div>
            </div>
        `).join('');
    }

    updateAssetHealthGrid() {
        const healthGrid = document.getElementById('assetHealthGrid');
        if (!healthGrid) return;

        const assetsWithHealth = Array.from(this.assets.values())
            .filter(asset => asset.healthScore !== undefined)
            .sort((a, b) => a.healthScore - b.healthScore) // Worst health first
            .slice(0, 12); // Show top 12

        healthGrid.innerHTML = assetsWithHealth.map(asset => `
            <div class="asset-health-card ${this.getHealthStatusClass(asset.healthScore)}" data-asset-id="${asset.assetId}">
                <div class="health-card-header">
                    <div class="asset-info">
                        <div class="asset-name">${asset.name}</div>
                        <div class="asset-type">${asset.type}</div>
                    </div>
                    <div class="health-score ${this.getHealthStatusClass(asset.healthScore)}">
                        ${asset.healthScore.toFixed(0)}%
                    </div>
                </div>
                <div class="health-indicators">
                    <div class="health-indicator">
                        <span class="indicator-label">Vibration</span>
                        <div class="indicator-bar">
                            <div class="indicator-fill" style="width: ${asset.conditionScores?.vibration || 50}%"></div>
                        </div>
                    </div>
                    <div class="health-indicator">
                        <span class="indicator-label">Temperature</span>
                        <div class="indicator-bar">
                            <div class="indicator-fill" style="width: ${asset.conditionScores?.temperature || 50}%"></div>
                        </div>
                    </div>
                </div>
                <div class="health-actions">
                    <button class="health-action-btn" data-action="schedule" data-asset-id="${asset.assetId}">
                        <i class="fas fa-calendar-plus"></i>
                        Schedule
                    </button>
                    <button class="health-action-btn" data-action="predict" data-asset-id="${asset.assetId}">
                        <i class="fas fa-brain"></i>
                        Predict
                    </button>
                </div>
                <div class="last-maintenance">
                    Last: ${asset.lastMaintenanceDate ? this.formatDate(asset.lastMaintenanceDate) : 'Never'}
                </div>
            </div>
        `).join('');
    }

    displayPredictiveAnalysisResults(predictions) {
        const predictionsContainer = document.getElementById('predictionsContainer');
        if (!predictionsContainer) return;

        predictionsContainer.innerHTML = `
            <div class="predictions-summary">
                <h4>Predictive Analysis Results</h4>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-value">${predictions.length}</span>
                        <span class="stat-label">Assets Analyzed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value critical">${predictions.filter(p => p.failureRisk === 'CRITICAL').length}</span>
                        <span class="stat-label">Critical Risk</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value high">${predictions.filter(p => p.failureRisk === 'HIGH').length}</span>
                        <span class="stat-label">High Risk</span>
                    </div>
                </div>
            </div>
            <div class="predictions-list">
                ${predictions.slice(0, 5).map(prediction => `
                    <div class="prediction-card ${prediction.failureRisk.toLowerCase()}" data-prediction-id="${prediction.predictionId}">
                        <div class="prediction-header">
                            <span class="asset-name">${prediction.assetName}</span>
                            <span class="risk-badge ${prediction.failureRisk.toLowerCase()}">${prediction.failureRisk}</span>
                        </div>
                        <div class="prediction-details">
                            <div class="prediction-metric">
                                <span class="metric-label">Failure Probability</span>
                                <span class="metric-value">${(prediction.failureProbability * 100).toFixed(1)}%</span>
                            </div>
                            <div class="prediction-metric">
                                <span class="metric-label">Predicted Failure</span>
                                <span class="metric-value">${this.formatDate(prediction.predictedFailureDate)}</span>
                            </div>
                            <div class="prediction-metric">
                                <span class="metric-label">Confidence</span>
                                <span class="metric-value">${(prediction.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                        <div class="prediction-recommendations">
                            ${prediction.recommendations.slice(0, 2).map(rec => `
                                <div class="recommendation">${rec}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==================== BUSINESS CALCULATIONS ====================

    calculateMaintenanceKPIs() {
        const allOrders = Array.from(this.maintenanceOrders.values());
        const completedOrders = allOrders.filter(o => o.status === 'COMPLETED');
        const pendingOrders = allOrders.filter(o => o.status === 'PENDING');
        const overdueOrders = allOrders.filter(o => 
            o.status === 'PENDING' && 
            o.scheduledDate && 
            new Date(o.scheduledDate) < new Date()
        );

        // Calculate asset uptime
        const totalAssets = this.assets.size;
        const operationalAssets = Array.from(this.assets.values()).filter(a => a.status === 'OPERATIONAL').length;
        const assetUptime = totalAssets > 0 ? (operationalAssets / totalAssets) * 100 : 100;

        // Calculate Mean Time to Repair (MTTR)
        const mttr = completedOrders.length > 0 ?
            completedOrders.reduce((sum, order) => {
                if (order.startTime && order.completionTime) {
                    return sum + (new Date(order.completionTime) - new Date(order.startTime)) / (1000 * 60 * 60); // hours
                }
                return sum + (order.estimatedDuration / 60); // convert minutes to hours
            }, 0) / completedOrders.length : 2.4;

        // Calculate planned vs unplanned maintenance ratio
        const plannedOrders = allOrders.filter(o => o.type === 'PREVENTIVE' || o.type === 'PREDICTIVE').length;
        const plannedMaintenanceRatio = allOrders.length > 0 ? (plannedOrders / allOrders.length) * 100 : 87.5;

        // Calculate monthly maintenance cost
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyOrders = allOrders.filter(order => {
            const orderDate = new Date(order.createdDate);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
        });
        const monthlyCost = monthlyOrders.reduce((sum, order) => sum + (order.cost.actual || order.cost.estimated), 0);

        return {
            assetUptime,
            mttr,
            plannedMaintenanceRatio,
            monthlyCost,
            pendingMaintenance: pendingOrders.length,
            overdueMaintenance: overdueOrders.length,
            systemUptime: 99.2 // This would come from actual system monitoring
        };
    }

    // ==================== DATA MANAGEMENT ====================

    async loadInitialData() {
        // Load sample assets
        this.loadSampleAssets();
        
        // Load sample maintenance orders
        this.loadSampleMaintenanceOrders();
        
        // Load sample preventive plans
        this.loadSamplePreventivePlans();
        
        // Update initial displays
        this.updateMaintenanceKPIs();
        this.displayMaintenanceTimeline();
        this.updateAssetHealthGrid();
    }

    loadSampleAssets() {
        const sampleAssets = [
            {
                assetId: 'ASSET001',
                name: 'Production Line A - Conveyor',
                type: 'Conveyor System',
                location: 'Manufacturing Floor 1',
                status: 'OPERATIONAL',
                healthScore: 75.2,
                lastMaintenanceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
                monitoringEnabled: true,
                conditionScores: {
                    vibration: 72,
                    temperature: 85,
                    pressure: 90,
                    lubrication: 68
                },
                operatingConditions: {
                    temperature: 75, // Fahrenheit
                    humidity: 45, // percentage
                    operatingHours: 16, // hours per day
                    loadFactor: 0.85
                }
            },
            {
                assetId: 'ASSET002',
                name: 'HVAC System - Building A',
                type: 'HVAC System',
                location: 'Building A',
                status: 'OPERATIONAL',
                healthScore: 92.5,
                lastMaintenanceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                monitoringEnabled: true,
                conditionScores: {
                    vibration: 95,
                    temperature: 88,
                    pressure: 92,
                    lubrication: 94
                },
                operatingConditions: {
                    temperature: 72,
                    humidity: 50,
                    operatingHours: 24,
                    loadFactor: 0.65
                }
            },
            {
                assetId: 'ASSET003',
                name: 'Hydraulic Press #3',
                type: 'Hydraulic Press',
                location: 'Manufacturing Floor 2',
                status: 'WARNING',
                healthScore: 58.7,
                lastMaintenanceDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
                monitoringEnabled: true,
                conditionScores: {
                    vibration: 45,
                    temperature: 62,
                    pressure: 70,
                    lubrication: 58
                },
                operatingConditions: {
                    temperature: 85,
                    humidity: 40,
                    operatingHours: 12,
                    loadFactor: 0.95
                }
            }
        ];

        sampleAssets.forEach(asset => {
            this.assets.set(asset.assetId, asset);
        });
    }

    loadSampleMaintenanceOrders() {
        const sampleOrders = [
            {
                maintenanceOrderId: 'MO001',
                assetId: 'ASSET003',
                priority: 'HIGH',
                status: 'PENDING',
                type: 'CORRECTIVE',
                description: 'Hydraulic press showing unusual vibration patterns',
                scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
                estimatedDuration: 180, // 3 hours
                assignedTechnicians: ['TECH001', 'TECH002'],
                requiredParts: ['Hydraulic Seal Kit', 'Pressure Relief Valve'],
                instructions: 'Check hydraulic fluid levels, inspect seals, test pressure systems',
                safetyRequirements: ['Lockout/Tagout', 'Hydraulic PPE', 'Pressure Testing'],
                createdDate: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
                updatedDate: new Date(Date.now() - 60 * 60 * 1000),
                cost: {
                    estimated: 850,
                    actual: 0,
                    labor: 0,
                    parts: 0
                }
            },
            {
                maintenanceOrderId: 'MO002',
                assetId: 'ASSET002',
                priority: 'MEDIUM',
                status: 'SCHEDULED',
                type: 'PREVENTIVE',
                description: 'Quarterly HVAC system maintenance',
                scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
                estimatedDuration: 240, // 4 hours
                assignedTechnicians: ['TECH003'],
                requiredParts: ['Air Filters', 'Belt Set', 'Lubricants'],
                instructions: 'Replace filters, check belts, lubricate motors, test controls',
                safetyRequirements: ['Electrical Lockout', 'Fall Protection'],
                createdDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
                updatedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
                cost: {
                    estimated: 450,
                    actual: 0,
                    labor: 0,
                    parts: 0
                }
            }
        ];

        sampleOrders.forEach(order => {
            this.maintenanceOrders.set(order.maintenanceOrderId, order);
        });
    }

    loadSamplePreventivePlans() {
        const samplePlans = [
            {
                preventivePlanId: 'PP001',
                assetId: 'ASSET001',
                name: 'Conveyor Monthly Maintenance',
                description: 'Monthly preventive maintenance for production conveyor',
                frequency: 'MONTHLY',
                interval: 1,
                tasks: [
                    'Check belt tension and alignment',
                    'Lubricate bearings and rollers',
                    'Inspect electrical connections',
                    'Test emergency stops'
                ],
                estimatedDuration: 120,
                requiredSkills: ['Mechanical', 'Electrical'],
                safetyProcedures: ['Lockout/Tagout', 'Confined Space'],
                active: true,
                nextScheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                updatedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                completionHistory: []
            }
        ];

        samplePlans.forEach(plan => {
            this.preventivePlans.set(plan.preventivePlanId, plan);
        });
    }

    // ==================== UTILITY METHODS ====================

    getAssetName(assetId) {
        const asset = this.assets.get(assetId);
        return asset ? asset.name : 'Unknown Asset';
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    }

    getHealthStatusClass(healthScore) {
        if (healthScore >= 90) return 'excellent';
        if (healthScore >= 75) return 'good';
        if (healthScore >= 60) return 'warning';
        return 'critical';
    }

    getViewSectionId(viewName) {
        const viewMap = {
            'dashboard': 'maintenance-dashboard',
            'preventive': 'preventive-maintenance',
            'predictive': 'predictive-maintenance',
            'work-orders': 'maintenance-work-orders',
            'assets': 'assets-management',
            'inventory': 'parts-inventory',
            'analytics': 'maintenance-analytics'
        };
        return viewMap[viewName] || 'maintenance-dashboard';
    }

    // Simulate IoT sensor data for demonstration
    simulateIoTSensorData(asset) {
        const baselineTemp = asset.operatingConditions.temperature;
        const baselineHumidity = asset.operatingConditions.humidity;
        
        return {
            temperature: baselineTemp + (Math.random() - 0.5) * 10,
            humidity: baselineHumidity + (Math.random() - 0.5) * 20,
            vibration: {
                x: Math.random() * 2,
                y: Math.random() * 2,
                z: Math.random() * 2
            },
            pressure: 14.7 + (Math.random() - 0.5) * 2, // PSI
            lubrication: {
                level: 0.7 + Math.random() * 0.3,
                temperature: baselineTemp + 15 + (Math.random() - 0.5) * 5
            },
            timestamp: new Date()
        };
    }

    async handleMessage(type, data, options) {
        switch (type) {
            case 'MAINTENANCE_ORDER_CREATED':
                this.logger.info('Maintenance order created message processed', data);
                break;
            case 'PREVENTIVE_PLAN_CREATED':
                this.logger.info('Preventive plan created message processed', data);
                break;
            case 'PREDICTIVE_ANALYSIS_COMPLETED':
                this.logger.info('Predictive analysis completed message processed', data);
                break;
            default:
                this.logger.info('Message processed', { type, data });
        }
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MaintenanceManagementEngine();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaintenanceManagementEngine;
}