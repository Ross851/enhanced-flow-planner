// Flow Data Bridge - Shares data between Flow Builder and User Impact Analyzer
// This creates a unified experience where both tools work together

(function() {
    'use strict';

    // Flow data model that both tools share
    window.FlowDataBridge = {
        // User configuration
        userConfig: {
            userCount: 1,
            accountType: 'user', // 'user' or 'service'
            peakHours: false,
            environment: 'production'
        },

        // Flow structure
        flowStructure: {
            name: 'New Flow',
            triggers: [],
            actions: [],
            controls: [],
            totalNodes: 0,
            connectors: new Set(),
            hasPremiumConnectors: false,
            hasAIActions: false
        },

        // Calculated metrics
        metrics: {
            estimatedRuntime: 0,
            actionsPerRun: 0,
            dailyExecutions: 0,
            monthlyPPR: 0,
            apiCallsPerMinute: 0,
            monthlyCost: 0,
            licenseType: 'Standard',
            throttlingRisk: 'low'
        },

        // Connector usage tracking
        connectorUsage: {
            sharepoint: { count: 0, operations: [] },
            sql: { count: 0, operations: [] },
            dataverse: { count: 0, operations: [] },
            teams: { count: 0, operations: [] },
            outlook: { count: 0, operations: [] },
            onedrive: { count: 0, operations: [] },
            http: { count: 0, operations: [] }
        },

        // API Limits (per minute)
        apiLimits: {
            sharepoint: { total: 600, perUser: 300 },
            sql: { total: 300, perUser: 100 },
            dataverse: { total: 6000, perUser: 500 },
            teams: { total: 1800, perUser: 300 },
            outlook: { total: 300, perUser: 150 },
            onedrive: { total: 2000, perUser: 500 },
            http: { total: 100, perUser: 50 }
        },

        // Initialize or restore from localStorage
        init() {
            const saved = localStorage.getItem('flowDataBridge');
            if (saved) {
                const data = JSON.parse(saved);
                Object.assign(this.userConfig, data.userConfig || {});
                Object.assign(this.flowStructure, data.flowStructure || {});
                Object.assign(this.metrics, data.metrics || {});
                Object.assign(this.connectorUsage, data.connectorUsage || {});
            }
            this.attachListeners();
        },

        // Save current state
        save() {
            const data = {
                userConfig: this.userConfig,
                flowStructure: this.flowStructure,
                metrics: this.metrics,
                connectorUsage: this.connectorUsage,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem('flowDataBridge', JSON.stringify(data));
            
            // Broadcast change to other windows/tabs
            window.dispatchEvent(new CustomEvent('flowDataChanged', { detail: data }));
            
            // If in iframe or popup, post message to parent
            if (window.opener || window.parent !== window) {
                const target = window.opener || window.parent;
                target.postMessage({ type: 'flowDataUpdate', data }, '*');
            }
        },

        // Update user configuration
        updateUserConfig(config) {
            Object.assign(this.userConfig, config);
            this.recalculateMetrics();
            this.save();
        },

        // Add flow node
        addFlowNode(nodeType, nodeData) {
            if (nodeType === 'trigger') {
                this.flowStructure.triggers.push(nodeData);
            } else if (nodeType === 'action') {
                this.flowStructure.actions.push(nodeData);
                this.trackConnectorUsage(nodeData);
            } else if (nodeType === 'control') {
                this.flowStructure.controls.push(nodeData);
            }
            
            this.flowStructure.totalNodes++;
            this.updateConnectorsList();
            this.recalculateMetrics();
            this.save();
        },

        // Remove flow node
        removeFlowNode(nodeId) {
            // Remove from appropriate array
            ['triggers', 'actions', 'controls'].forEach(type => {
                const index = this.flowStructure[type].findIndex(n => n.id === nodeId);
                if (index > -1) {
                    this.flowStructure[type].splice(index, 1);
                    this.flowStructure.totalNodes--;
                }
            });
            
            this.updateConnectorsList();
            this.recalculateMetrics();
            this.save();
        },

        // Track connector usage
        trackConnectorUsage(nodeData) {
            const connector = this.identifyConnector(nodeData.action);
            if (connector && this.connectorUsage[connector]) {
                this.connectorUsage[connector].count++;
                this.connectorUsage[connector].operations.push({
                    action: nodeData.action,
                    timestamp: new Date().toISOString()
                });
            }
        },

        // Identify connector from action name
        identifyConnector(action) {
            if (action.includes('sharepoint') || action.includes('item') || action.includes('file')) {
                return 'sharepoint';
            } else if (action.includes('sql')) {
                return 'sql';
            } else if (action.includes('dataverse') || action.includes('row')) {
                return 'dataverse';
            } else if (action.includes('teams') || action.includes('message') || action.includes('chat')) {
                return 'teams';
            } else if (action.includes('email') || action.includes('outlook') || action.includes('calendar')) {
                return 'outlook';
            } else if (action.includes('onedrive')) {
                return 'onedrive';
            } else if (action.includes('http')) {
                return 'http';
            }
            return null;
        },

        // Update connectors list
        updateConnectorsList() {
            this.flowStructure.connectors.clear();
            Object.keys(this.connectorUsage).forEach(connector => {
                if (this.connectorUsage[connector].count > 0) {
                    this.flowStructure.connectors.add(connector);
                }
            });
            
            // Check for premium connectors
            this.flowStructure.hasPremiumConnectors = 
                this.connectorUsage.sql.count > 0 || 
                this.connectorUsage.http.count > 0;
            
            // Check for AI actions
            this.flowStructure.hasAIActions = 
                this.flowStructure.actions.some(a => 
                    a.action.includes('ai') || 
                    a.action.includes('gpt') || 
                    a.action.includes('copilot')
                );
        },

        // Recalculate all metrics
        recalculateMetrics() {
            const { userCount, accountType, peakHours } = this.userConfig;
            const { totalNodes, hasPremiumConnectors, hasAIActions } = this.flowStructure;
            
            // Calculate runtime (estimated 2.5 seconds per action)
            this.metrics.estimatedRuntime = totalNodes * 2.5;
            
            // Actions per run
            this.metrics.actionsPerRun = this.flowStructure.actions.length;
            
            // Daily executions (example: assume hourly for automated flows)
            const trigger = this.flowStructure.triggers[0];
            if (trigger) {
                if (trigger.action.includes('recurrence') || trigger.action.includes('scheduled')) {
                    this.metrics.dailyExecutions = 24 * userCount; // Hourly
                } else if (trigger.action.includes('created') || trigger.action.includes('modified')) {
                    this.metrics.dailyExecutions = 50 * userCount; // Estimated 50 events per user
                } else {
                    this.metrics.dailyExecutions = 10 * userCount; // Manual/instant
                }
            } else {
                this.metrics.dailyExecutions = userCount;
            }
            
            // Calculate PPR
            this.metrics.monthlyPPR = this.metrics.dailyExecutions * this.metrics.actionsPerRun * 30;
            
            // Calculate API calls per minute
            this.metrics.apiCallsPerMinute = Math.ceil(
                (this.metrics.dailyExecutions * this.metrics.actionsPerRun) / (24 * 60)
            );
            
            // Adjust for peak hours
            if (peakHours) {
                this.metrics.apiCallsPerMinute *= 3; // Peak concentration
            }
            
            // Calculate throttling risk
            this.calculateThrottlingRisk();
            
            // Calculate licensing and cost
            this.calculateLicensing();
        },

        // Calculate throttling risk
        calculateThrottlingRisk() {
            let maxUsagePercent = 0;
            
            Object.keys(this.connectorUsage).forEach(connector => {
                if (this.connectorUsage[connector].count > 0) {
                    const limit = this.userConfig.accountType === 'service' 
                        ? this.apiLimits[connector].total 
                        : this.apiLimits[connector].perUser;
                    
                    const usage = this.metrics.apiCallsPerMinute * 
                        (this.userConfig.accountType === 'service' ? this.userConfig.userCount : 1);
                    
                    const usagePercent = (usage / limit) * 100;
                    maxUsagePercent = Math.max(maxUsagePercent, usagePercent);
                }
            });
            
            if (maxUsagePercent > 80) {
                this.metrics.throttlingRisk = 'high';
            } else if (maxUsagePercent > 50) {
                this.metrics.throttlingRisk = 'medium';
            } else {
                this.metrics.throttlingRisk = 'low';
            }
        },

        // Calculate licensing requirements
        calculateLicensing() {
            const { userCount, accountType } = this.userConfig;
            const { hasPremiumConnectors, hasAIActions } = this.flowStructure;
            
            if (accountType === 'service') {
                // Service account licensing
                if (this.metrics.monthlyPPR > 250000) {
                    this.metrics.licenseType = 'Hosted RPA';
                    this.metrics.monthlyCost = 118.60;
                } else {
                    this.metrics.licenseType = 'Process';
                    this.metrics.monthlyCost = 81.90;
                }
            } else {
                // User licensing
                if (hasPremiumConnectors) {
                    this.metrics.licenseType = 'Premium';
                    this.metrics.monthlyCost = 12.20 * userCount;
                } else if (this.metrics.monthlyPPR > 40000 * userCount) {
                    this.metrics.licenseType = 'Process';
                    this.metrics.monthlyCost = 81.90;
                } else {
                    this.metrics.licenseType = 'Standard';
                    this.metrics.monthlyCost = 0;
                }
            }
            
            // Add AI costs if applicable
            if (hasAIActions) {
                const aiCalls = this.flowStructure.actions.filter(a => 
                    a.action.includes('ai') || a.action.includes('gpt')
                ).length * this.metrics.dailyExecutions * 30;
                
                // Estimate: 1000 AI calls = £1
                this.metrics.monthlyCost += (aiCalls / 1000);
            }
        },

        // Get recommendations based on current configuration
        getRecommendations() {
            const recommendations = [];
            
            // BEST PRACTICE: Plan for scale - breakeven is ~7 users
            if (this.userConfig.userCount >= 7 && this.userConfig.accountType === 'user' && this.flowStructure.hasPremiumConnectors) {
                recommendations.push({
                    priority: 'high',
                    title: '💰 Switch to Per-Flow Licensing',
                    description: `BEST PRACTICE: With ${this.userConfig.userCount} users needing Premium, per-flow (£81.90) is cheaper than ${this.userConfig.userCount} per-user licenses (£${(12.20 * this.userConfig.userCount).toFixed(2)}/month). This is the breakeven point!`,
                    savings: (12.20 * this.userConfig.userCount) - 81.90,
                    bestPractice: 'Plan for Scale'
                });
            }
            
            // BEST PRACTICE: Service accounts should always use per-flow
            if (this.userConfig.accountType === 'service' && this.metrics.licenseType !== 'Process') {
                recommendations.push({
                    priority: 'critical',
                    title: '🔐 Service Account Requires Per-Flow License',
                    description: 'BEST PRACTICE: Service accounts concentrate all API calls through one account. Always use Process license (£81.90) to avoid throttling and comply with licensing.',
                    bestPractice: 'Map Users Before Licensing'
                });
            }
            
            // Throttling recommendations
            if (this.metrics.throttlingRisk === 'high') {
                recommendations.push({
                    priority: 'high',
                    title: 'High Throttling Risk',
                    description: 'Implement request batching and queuing to avoid API limits.',
                    impact: 'Critical for reliability'
                });
            }
            
            // BEST PRACTICE: Check premium connectors
            if (this.connectorUsage.sql.count > 0) {
                recommendations.push({
                    priority: 'medium',
                    title: '⚠️ Premium Connector Detected',
                    description: 'BEST PRACTICE: SQL requires Premium licensing. Consider SharePoint Lists for non-critical data to stay on Standard (free) licensing. This could save £' + (this.userConfig.accountType === 'user' ? (12.20 * this.userConfig.userCount).toFixed(2) : '81.90') + '/month.',
                    savings: this.userConfig.accountType === 'user' ? 12.20 * this.userConfig.userCount : 81.90,
                    bestPractice: 'Check Premium Connectors'
                });
            }
            
            // BEST PRACTICE: Combine smartly
            if (this.flowStructure.hasPremiumConnectors && this.flowStructure.actions.length < 3) {
                recommendations.push({
                    priority: 'low',
                    title: '📊 Consider Splitting Flow',
                    description: 'BEST PRACTICE: This simple flow uses premium connectors. Consider splitting: use CD (free) license for basic SharePoint/Teams actions, reserve Premium for critical SQL/HTTP operations.',
                    bestPractice: 'Combine Smartly'
                });
            }
            
            // BEST PRACTICE: Audit regularly
            if (this.metrics.monthlyPPR < 1000 && this.metrics.licenseType === 'Premium') {
                recommendations.push({
                    priority: 'medium',
                    title: '🔍 Low Usage Detected',
                    description: 'BEST PRACTICE: This flow has very low PPR usage. Audit whether Premium licensing is necessary or if the flow can be redesigned with Standard connectors only.',
                    bestPractice: 'Audit Regularly'
                });
            }
            
            // Performance recommendations
            if (this.metrics.estimatedRuntime > 30) {
                recommendations.push({
                    priority: 'medium',
                    title: 'Optimize Flow Performance',
                    description: 'Consider parallel branches and filtering at source to reduce runtime.',
                    impact: `Reduce runtime from ${this.metrics.estimatedRuntime}s to ~${(this.metrics.estimatedRuntime * 0.4).toFixed(1)}s`
                });
            }
            
            return recommendations;
        },

        // Attach event listeners
        attachListeners() {
            // Listen for changes from other windows
            window.addEventListener('storage', (e) => {
                if (e.key === 'flowDataBridge') {
                    const data = JSON.parse(e.newValue);
                    Object.assign(this.userConfig, data.userConfig || {});
                    Object.assign(this.flowStructure, data.flowStructure || {});
                    Object.assign(this.metrics, data.metrics || {});
                    Object.assign(this.connectorUsage, data.connectorUsage || {});
                    
                    // Trigger UI update
                    window.dispatchEvent(new CustomEvent('flowDataUpdated', { detail: data }));
                }
            });
            
            // Listen for messages from iframes/popups
            window.addEventListener('message', (e) => {
                if (e.data.type === 'flowDataUpdate') {
                    Object.assign(this.userConfig, e.data.data.userConfig || {});
                    Object.assign(this.flowStructure, e.data.data.flowStructure || {});
                    Object.assign(this.metrics, e.data.data.metrics || {});
                    Object.assign(this.connectorUsage, e.data.data.connectorUsage || {});
                    
                    // Trigger UI update
                    window.dispatchEvent(new CustomEvent('flowDataUpdated', { detail: e.data.data }));
                }
            });
        },

        // Export flow data for sharing
        exportData() {
            return {
                userConfig: this.userConfig,
                flowStructure: this.flowStructure,
                metrics: this.metrics,
                connectorUsage: this.connectorUsage,
                recommendations: this.getRecommendations(),
                exportDate: new Date().toISOString()
            };
        },

        // Import flow data
        importData(data) {
            if (data.userConfig) this.userConfig = data.userConfig;
            if (data.flowStructure) this.flowStructure = data.flowStructure;
            if (data.metrics) this.metrics = data.metrics;
            if (data.connectorUsage) this.connectorUsage = data.connectorUsage;
            this.save();
        },

        // Reset all data
        reset() {
            this.userConfig = { userCount: 1, accountType: 'user', peakHours: false };
            this.flowStructure = { 
                name: 'New Flow', 
                triggers: [], 
                actions: [], 
                controls: [], 
                totalNodes: 0,
                connectors: new Set(),
                hasPremiumConnectors: false,
                hasAIActions: false
            };
            this.metrics = {
                estimatedRuntime: 0,
                actionsPerRun: 0,
                dailyExecutions: 0,
                monthlyPPR: 0,
                apiCallsPerMinute: 0,
                monthlyCost: 0,
                licenseType: 'Standard',
                throttlingRisk: 'low'
            };
            this.connectorUsage = {
                sharepoint: { count: 0, operations: [] },
                sql: { count: 0, operations: [] },
                dataverse: { count: 0, operations: [] },
                teams: { count: 0, operations: [] },
                outlook: { count: 0, operations: [] },
                onedrive: { count: 0, operations: [] },
                http: { count: 0, operations: [] }
            };
            this.save();
        }
    };

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.FlowDataBridge.init();
        });
    } else {
        window.FlowDataBridge.init();
    }

    // Make it globally available
    window.FlowDataBridge = window.FlowDataBridge;
})();