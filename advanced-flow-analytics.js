// Advanced Flow Analytics and Optimisation Engine
// Provides deep insights, validation, and AI-powered suggestions

const FlowAnalytics = {
    // Real-time Flow Validation Engine
    validation: {
        rules: {
            // Critical Issues (Block deployment)
            critical: [
                {
                    id: 'no-trigger',
                    check: (flow) => flow.nodes.filter(n => n.type === 'trigger').length === 0,
                    message: 'Flow has no trigger - cannot start',
                    fix: 'Add a trigger to initiate your flow'
                },
                {
                    id: 'infinite-loop',
                    check: (flow) => {
                        // Check for SharePoint update triggering on same list it updates
                        const triggers = flow.nodes.filter(n => n.key === 'sharepoint-item-modified');
                        const updates = flow.nodes.filter(n => n.key === 'sharepoint-update-item');
                        return triggers.length > 0 && updates.length > 0 && !flow.hasLoopPrevention;
                    },
                    message: 'Potential infinite loop detected - updating item that triggers the flow',
                    fix: 'Add trigger condition to exclude updates from flow service account'
                },
                {
                    id: 'missing-error-handling',
                    check: (flow) => {
                        const hasScope = flow.nodes.some(n => n.key === 'control-scope');
                        return flow.nodes.length > 10 && !hasScope;
                    },
                    message: 'Complex flow without error handling',
                    fix: 'Add Scope actions for try-catch error handling'
                },
                {
                    id: 'unlicensed-premium',
                    check: (flow) => {
                        const hasPremium = flow.nodes.some(n => n.data?.licence === 'Premium');
                        return hasPremium && flow.config.licence === 'Standard';
                    },
                    message: 'Premium connectors used without appropriate licence',
                    fix: 'Upgrade to Premium or Process licence'
                }
            ],
            
            // Warning Issues (Performance/cost concerns)
            warnings: [
                {
                    id: 'unfiltered-get-items',
                    check: (flow) => {
                        return flow.nodes.some(n => 
                            n.key === 'sharepoint-get-items' && 
                            !n.config?.filterQuery
                        );
                    },
                    message: 'Get Items without filter will retrieve all items (poor performance)',
                    fix: 'Add Filter Query to retrieve only needed items',
                    impact: '90% performance improvement possible'
                },
                {
                    id: 'nested-loops',
                    check: (flow) => {
                        let depth = 0;
                        let maxDepth = 0;
                        flow.nodes.forEach(n => {
                            if (n.key === 'control-apply-each') depth++;
                            if (n.key === 'control-apply-each-end') depth--;
                            maxDepth = Math.max(maxDepth, depth);
                        });
                        return maxDepth > 1;
                    },
                    message: 'Nested loops detected - exponential performance impact',
                    fix: 'Consider using Select or Filter array instead of nested loops',
                    impact: 'Can cause timeout with large datasets'
                },
                {
                    id: 'no-concurrency',
                    check: (flow) => {
                        return flow.nodes.filter(n => 
                            n.key === 'control-apply-each' && 
                            (!n.config?.concurrency || n.config.concurrency === 1)
                        ).length > 0;
                    },
                    message: 'Apply to each without concurrency control',
                    fix: 'Enable concurrency (20-50) for parallel processing',
                    impact: '5-10x performance improvement'
                },
                {
                    id: 'frequent-polling',
                    check: (flow) => {
                        const recurrence = flow.nodes.find(n => n.key === 'recurrence');
                        return recurrence?.config?.frequency === 'Minute' && 
                               recurrence?.config?.interval < 5;
                    },
                    message: 'Very frequent polling detected',
                    fix: 'Consider event-based triggers or longer intervals',
                    impact: 'High PPR consumption'
                },
                {
                    id: 'missing-select',
                    check: (flow) => {
                        // Check if Apply to each directly follows Get items
                        for (let i = 0; i < flow.nodes.length - 1; i++) {
                            if (flow.nodes[i].key === 'sharepoint-get-items' &&
                                flow.nodes[i + 1].key === 'control-apply-each') {
                                return true;
                            }
                        }
                        return false;
                    },
                    message: 'Apply to each directly on Get Items output',
                    fix: 'Use Select action to map data before loop',
                    impact: 'Reduces memory usage and improves performance'
                }
            ],
            
            // Suggestions (Best practice improvements)
            suggestions: [
                {
                    id: 'use-batch',
                    check: (flow) => {
                        const creates = flow.nodes.filter(n => 
                            n.key === 'sharepoint-create-item' || 
                            n.key === 'sql-insert-row'
                        );
                        return creates.length > 3;
                    },
                    message: 'Multiple create/insert operations detected',
                    fix: 'Consider batch operations for better performance'
                },
                {
                    id: 'cache-static-data',
                    check: (flow) => {
                        const gets = flow.nodes.filter(n => 
                            n.key === 'sharepoint-get-items' || 
                            n.key === 'sql-get-rows'
                        );
                        return gets.length > 2;
                    },
                    message: 'Multiple data retrievals detected',
                    fix: 'Cache static data in variables to reduce API calls'
                },
                {
                    id: 'use-odata-expand',
                    check: (flow) => {
                        return flow.nodes.some(n => 
                            n.key === 'sharepoint-get-items' && 
                            n.hasLookups
                        );
                    },
                    message: 'Consider using $expand for lookup fields',
                    fix: 'Use OData $expand to get related data in single call'
                }
            ]
        },
        
        // Run validation
        validateFlow(flow) {
            const results = {
                critical: [],
                warnings: [],
                suggestions: [],
                score: 100
            };
            
            // Check critical issues
            this.rules.critical.forEach(rule => {
                if (rule.check(flow)) {
                    results.critical.push(rule);
                    results.score -= 25;
                }
            });
            
            // Check warnings
            this.rules.warnings.forEach(rule => {
                if (rule.check(flow)) {
                    results.warnings.push(rule);
                    results.score -= 10;
                }
            });
            
            // Check suggestions
            this.rules.suggestions.forEach(rule => {
                if (rule.check(flow)) {
                    results.suggestions.push(rule);
                    results.score -= 5;
                }
            });
            
            results.score = Math.max(0, results.score);
            results.grade = this.getGrade(results.score);
            
            return results;
        },
        
        getGrade(score) {
            if (score >= 90) return { letter: 'A', color: '#107c10', text: 'Excellent' };
            if (score >= 80) return { letter: 'B', color: '#40e0d0', text: 'Good' };
            if (score >= 70) return { letter: 'C', color: '#ff8c00', text: 'Fair' };
            if (score >= 60) return { letter: 'D', color: '#ff8c00', text: 'Poor' };
            return { letter: 'F', color: '#d13438', text: 'Critical Issues' };
        }
    },
    
    // Advanced Cost Calculator with Scenarios
    costCalculator: {
        scenarios: {
            'small-team': {
                name: 'Small Team',
                users: 5,
                runsPerDay: 50,
                description: 'Department automation'
            },
            'department': {
                name: 'Department',
                users: 25,
                runsPerDay: 500,
                description: 'Cross-team processes'
            },
            'enterprise': {
                name: 'Enterprise',
                users: 100,
                runsPerDay: 5000,
                description: 'Organisation-wide'
            },
            'high-volume': {
                name: 'High Volume',
                users: 10,
                runsPerDay: 10000,
                description: 'Transaction processing'
            }
        },
        
        calculateScenarios(flow) {
            const results = {};
            
            Object.entries(this.scenarios).forEach(([key, scenario]) => {
                results[key] = this.calculate(flow, scenario);
            });
            
            return results;
        },
        
        calculate(flow, scenario) {
            const hasPremium = flow.nodes.some(n => n.data?.licence === 'Premium');
            const hasAI = flow.nodes.some(n => n.key?.includes('ai') || n.key?.includes('gpt'));
            
            let monthlyCost = 0;
            let licence = 'Standard';
            let recommendation = '';
            
            // Base licensing
            if (hasPremium) {
                if (scenario.users > 7 || scenario.runsPerDay > 1000) {
                    monthlyCost = 81.90; // Per-flow
                    licence = 'Process';
                    recommendation = 'Per-flow licensing recommended for scale';
                } else {
                    monthlyCost = 12.20 * scenario.users; // Per-user
                    licence = 'Premium Per-User';
                    recommendation = `${scenario.users} Premium licences required`;
                }
            }
            
            // AI costs
            if (hasAI) {
                const aiCalls = scenario.runsPerDay * 30;
                const tokens = aiCalls * 500; // Estimate 500 tokens per call
                const aiCost = (tokens / 1000) * 0.01; // £0.01 per 1K tokens
                monthlyCost += aiCost;
            }
            
            // PPR calculation
            const actionsPerRun = flow.nodes.filter(n => n.type === 'action').length;
            const monthlyPPR = scenario.runsPerDay * actionsPerRun * 30;
            
            // Check if Process licence needed due to PPR
            if (monthlyPPR > 250000 && licence === 'Standard') {
                monthlyCost = 81.90;
                licence = 'Process (PPR limit)';
                recommendation = 'Process licence required due to high PPR usage';
            }
            
            return {
                monthlyCost,
                licence,
                recommendation,
                monthlyPPR,
                costPerRun: monthlyCost / (scenario.runsPerDay * 30),
                costPerUser: monthlyCost / scenario.users
            };
        },
        
        compareOptions(flow, userCount) {
            return {
                perUser: {
                    name: 'Premium Per-User',
                    monthlyCost: 12.20 * userCount,
                    whenBest: 'Best for <7 users with premium needs'
                },
                perFlow: {
                    name: 'Process (Per-Flow)',
                    monthlyCost: 81.90,
                    whenBest: 'Best for >7 users or service accounts'
                },
                hostedRPA: {
                    name: 'Hosted RPA',
                    monthlyCost: 118.60,
                    whenBest: 'Required for desktop automation'
                },
                breakeven: Math.ceil(81.90 / 12.20) // 7 users
            };
        }
    },
    
    // Performance Analyser
    performance: {
        analyseBottlenecks(flow) {
            const bottlenecks = [];
            
            // Analyse each node
            flow.nodes.forEach((node, index) => {
                const perf = this.getNodePerformance(node);
                
                if (perf.impact === 'high') {
                    bottlenecks.push({
                        node: node.name,
                        position: index + 1,
                        estimatedTime: perf.time,
                        issue: perf.issue,
                        solution: perf.solution,
                        potentialImprovement: perf.improvement
                    });
                }
            });
            
            return {
                bottlenecks,
                totalEstimatedTime: this.calculateTotalTime(flow),
                optimisedTime: this.calculateOptimisedTime(flow),
                potentialImprovement: this.calculateImprovement(flow)
            };
        },
        
        getNodePerformance(node) {
            const profiles = {
                'sharepoint-get-items': {
                    base: 2,
                    unfiltered: 30,
                    issue: 'Unfiltered query',
                    solution: 'Add Filter Query',
                    improvement: '90%'
                },
                'control-apply-each': {
                    base: 0.5,
                    perItem: 0.5,
                    issue: 'Sequential processing',
                    solution: 'Enable concurrency',
                    improvement: '80%'
                },
                'http-request': {
                    base: 1,
                    timeout: 30,
                    issue: 'External API call',
                    solution: 'Implement caching',
                    improvement: '50%'
                },
                'sql-get-rows': {
                    base: 3,
                    unindexed: 20,
                    issue: 'Database query',
                    solution: 'Add indexes',
                    improvement: '70%'
                }
            };
            
            const profile = profiles[node.key] || { base: 0.5 };
            
            return {
                time: profile.base,
                impact: profile.base > 5 ? 'high' : profile.base > 2 ? 'medium' : 'low',
                issue: profile.issue,
                solution: profile.solution,
                improvement: profile.improvement
            };
        },
        
        calculateTotalTime(flow) {
            return flow.nodes.reduce((total, node) => {
                return total + this.getNodePerformance(node).time;
            }, 0);
        },
        
        calculateOptimisedTime(flow) {
            return flow.nodes.reduce((total, node) => {
                const perf = this.getNodePerformance(node);
                const optimised = perf.improvement 
                    ? perf.time * (1 - parseInt(perf.improvement) / 100)
                    : perf.time;
                return total + optimised;
            }, 0);
        },
        
        calculateImprovement(flow) {
            const current = this.calculateTotalTime(flow);
            const optimised = this.calculateOptimisedTime(flow);
            return Math.round(((current - optimised) / current) * 100);
        }
    },
    
    // Governance and Compliance Checker
    governance: {
        policies: {
            'data-loss-prevention': {
                name: 'Data Loss Prevention',
                check: (flow) => {
                    // Check for sensitive data exposure
                    const hasExternal = flow.nodes.some(n => 
                        n.key === 'http-request' || 
                        n.key === 'outlook-send-email'
                    );
                    const hasInternal = flow.nodes.some(n => 
                        n.key?.includes('sharepoint') || 
                        n.key?.includes('sql')
                    );
                    return !(hasExternal && hasInternal);
                },
                severity: 'high',
                requirement: 'Prevent sensitive data from leaving organisation'
            },
            'service-account': {
                name: 'Service Account Usage',
                check: (flow) => {
                    return flow.config?.accountType === 'service' || 
                           flow.config?.users === 1;
                },
                severity: 'medium',
                requirement: 'Use service accounts for automated processes'
            },
            'error-handling': {
                name: 'Error Handling',
                check: (flow) => {
                    return flow.nodes.some(n => n.key === 'control-scope');
                },
                severity: 'high',
                requirement: 'All flows must have error handling'
            },
            'naming-convention': {
                name: 'Naming Convention',
                check: (flow) => {
                    const pattern = /^[A-Z]{2,4}-[A-Z][a-z]+-[A-Z][a-z]+/;
                    return pattern.test(flow.name || '');
                },
                severity: 'low',
                requirement: 'Follow naming pattern: DEPT-Process-Action'
            },
            'documentation': {
                name: 'Documentation',
                check: (flow) => {
                    return flow.description && flow.description.length > 50;
                },
                severity: 'medium',
                requirement: 'Flows must have detailed descriptions'
            },
            'approval-required': {
                name: 'Approval for Production',
                check: (flow) => {
                    const isProd = flow.config?.environment === 'production';
                    const hasApproval = flow.metadata?.approved;
                    return !isProd || hasApproval;
                },
                severity: 'high',
                requirement: 'Production flows require approval'
            },
            'retention-policy': {
                name: 'Data Retention',
                check: (flow) => {
                    const hasDelete = flow.nodes.some(n => 
                        n.key?.includes('delete')
                    );
                    return !hasDelete || flow.config?.retentionDays;
                },
                severity: 'medium',
                requirement: 'Define retention period for deleted data'
            },
            'gdpr-compliance': {
                name: 'GDPR Compliance',
                check: (flow) => {
                    const hasPersonalData = flow.nodes.some(n => 
                        n.config?.fields?.includes('email') ||
                        n.config?.fields?.includes('name')
                    );
                    return !hasPersonalData || flow.config?.gdprCompliant;
                },
                severity: 'high',
                requirement: 'Personal data processing must be GDPR compliant'
            }
        },
        
        checkCompliance(flow) {
            const results = {
                compliant: true,
                violations: [],
                warnings: [],
                score: 100
            };
            
            Object.entries(this.policies).forEach(([key, policy]) => {
                const passes = policy.check(flow);
                
                if (!passes) {
                    if (policy.severity === 'high') {
                        results.violations.push(policy);
                        results.compliant = false;
                        results.score -= 20;
                    } else {
                        results.warnings.push(policy);
                        results.score -= 10;
                    }
                }
            });
            
            results.score = Math.max(0, results.score);
            return results;
        }
    },
    
    // AI-Powered Optimisation Suggestions
    optimisation: {
        getSuggestions(flow) {
            const suggestions = [];
            
            // Pattern recognition
            const patterns = this.recognisePatterns(flow);
            
            patterns.forEach(pattern => {
                suggestions.push(this.getOptimisationForPattern(pattern));
            });
            
            // Sort by impact
            suggestions.sort((a, b) => b.impact - a.impact);
            
            return suggestions;
        },
        
        recognisePatterns(flow) {
            const patterns = [];
            
            // Pattern: Sequential operations on same data source
            let lastDataSource = null;
            flow.nodes.forEach(node => {
                if (node.category === lastDataSource && lastDataSource) {
                    patterns.push({
                        type: 'sequential-same-source',
                        nodes: [node],
                        dataSource: lastDataSource
                    });
                }
                lastDataSource = node.category;
            });
            
            // Pattern: Multiple conditions in sequence
            let conditionCount = 0;
            flow.nodes.forEach(node => {
                if (node.key === 'control-condition') {
                    conditionCount++;
                    if (conditionCount > 2) {
                        patterns.push({
                            type: 'multiple-conditions',
                            count: conditionCount
                        });
                    }
                } else {
                    conditionCount = 0;
                }
            });
            
            // Pattern: Repeated operations
            const actionCounts = {};
            flow.nodes.forEach(node => {
                actionCounts[node.key] = (actionCounts[node.key] || 0) + 1;
            });
            
            Object.entries(actionCounts).forEach(([action, count]) => {
                if (count > 2) {
                    patterns.push({
                        type: 'repeated-action',
                        action: action,
                        count: count
                    });
                }
            });
            
            return patterns;
        },
        
        getOptimisationForPattern(pattern) {
            const optimisations = {
                'sequential-same-source': {
                    title: 'Batch Operations Possible',
                    description: `Multiple sequential operations on ${pattern.dataSource}`,
                    solution: 'Combine into single batch operation',
                    impact: 8,
                    difficulty: 'medium',
                    timeReduction: '60%',
                    example: 'Use Send HTTP request to SharePoint with $batch endpoint'
                },
                'multiple-conditions': {
                    title: 'Complex Conditional Logic',
                    description: `${pattern.count} conditions in sequence`,
                    solution: 'Replace with Switch action for cleaner logic',
                    impact: 5,
                    difficulty: 'easy',
                    timeReduction: '20%',
                    example: 'Switch on status field instead of nested conditions'
                },
                'repeated-action': {
                    title: 'Repeated Operations Detected',
                    description: `${pattern.action} used ${pattern.count} times`,
                    solution: 'Consider loop or batch processing',
                    impact: 7,
                    difficulty: 'medium',
                    timeReduction: '40%',
                    example: 'Use Apply to each with array of items'
                }
            };
            
            return optimisations[pattern.type] || {
                title: 'Optimisation Opportunity',
                description: 'Pattern detected',
                solution: 'Review flow structure',
                impact: 3,
                difficulty: 'easy',
                timeReduction: '10%'
            };
        }
    },
    
    // Flow Templates Library
    templates: {
        categories: {
            'approval': {
                name: 'Approval Workflows',
                icon: '✅',
                templates: [
                    {
                        id: 'simple-approval',
                        name: 'Simple Document Approval',
                        description: 'Single-stage approval for documents',
                        nodes: [
                            { key: 'sharepoint-item-created', type: 'trigger' },
                            { key: 'approval-start', type: 'action' },
                            { key: 'control-condition', type: 'action' },
                            { key: 'sharepoint-update-item', type: 'action' },
                            { key: 'outlook-send-email', type: 'action' }
                        ],
                        bestFor: 'Document libraries, simple approvals',
                        estimatedTime: '5 minutes to configure'
                    },
                    {
                        id: 'multi-stage-approval',
                        name: 'Multi-Stage Approval',
                        description: 'Manager then director approval',
                        nodes: [
                            { key: 'forms-response-submitted', type: 'trigger' },
                            { key: 'approval-start', type: 'action' },
                            { key: 'control-condition', type: 'action' },
                            { key: 'approval-start', type: 'action' },
                            { key: 'control-condition', type: 'action' },
                            { key: 'sharepoint-create-item', type: 'action' },
                            { key: 'teams-post-message', type: 'action' }
                        ],
                        bestFor: 'Purchase requests, leave applications',
                        estimatedTime: '15 minutes to configure'
                    }
                ]
            },
            'integration': {
                name: 'System Integration',
                icon: '🔗',
                templates: [
                    {
                        id: 'sharepoint-to-sql',
                        name: 'SharePoint to SQL Sync',
                        description: 'Sync SharePoint list to SQL database',
                        nodes: [
                            { key: 'recurrence', type: 'trigger' },
                            { key: 'sharepoint-get-items', type: 'action' },
                            { key: 'data-select', type: 'action' },
                            { key: 'control-apply-each', type: 'action' },
                            { key: 'sql-insert-row', type: 'action' }
                        ],
                        bestFor: 'Data warehouse, reporting',
                        estimatedTime: '20 minutes to configure',
                        licence: 'Premium'
                    }
                ]
            },
            'notification': {
                name: 'Notifications & Alerts',
                icon: '🔔',
                templates: [
                    {
                        id: 'daily-summary',
                        name: 'Daily Summary Email',
                        description: 'Send daily summary of activities',
                        nodes: [
                            { key: 'recurrence', type: 'trigger' },
                            { key: 'sharepoint-get-items', type: 'action' },
                            { key: 'data-compose', type: 'action' },
                            { key: 'outlook-send-email', type: 'action' }
                        ],
                        bestFor: 'Status reports, daily digests',
                        estimatedTime: '10 minutes to configure'
                    }
                ]
            },
            'data-processing': {
                name: 'Data Processing',
                icon: '📊',
                templates: [
                    {
                        id: 'excel-processing',
                        name: 'Excel File Processing',
                        description: 'Process uploaded Excel files',
                        nodes: [
                            { key: 'sharepoint-file-created', type: 'trigger' },
                            { key: 'excel-get-rows', type: 'action' },
                            { key: 'data-filter', type: 'action' },
                            { key: 'control-apply-each', type: 'action' },
                            { key: 'sharepoint-create-item', type: 'action' }
                        ],
                        bestFor: 'Bulk data import, Excel automation',
                        estimatedTime: '25 minutes to configure'
                    }
                ]
            }
        },
        
        getTemplate(id) {
            for (const category of Object.values(this.categories)) {
                const template = category.templates.find(t => t.id === id);
                if (template) return template;
            }
            return null;
        },
        
        applyTemplate(templateId) {
            const template = this.getTemplate(templateId);
            if (!template) return null;
            
            // Convert template to flow structure
            const flow = {
                name: template.name,
                description: template.description,
                nodes: template.nodes.map((node, index) => ({
                    ...node,
                    id: Date.now() + index,
                    position: index
                }))
            };
            
            return flow;
        }
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlowAnalytics;
}