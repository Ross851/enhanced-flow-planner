// Power Automate Optimization Engine
// Advanced analytics and real-time optimization recommendations

(function() {
    'use strict';

    window.PowerAutomateOptimizer = {
        // Core optimization rules
        rules: {
            applyToEach: {
                severity: 'CRITICAL',
                category: 'Performance',
                check: function(flow) {
                    const loops = flow.nodes.filter(n => n.type === 'apply-to-each');
                    const issues = [];
                    
                    loops.forEach(loop => {
                        // Check for nested loops - EXPONENTIAL DISASTER
                        const nestedLoops = this.findNestedLoops(loop, flow);
                        if (nestedLoops.length > 0) {
                            issues.push({
                                severity: 'CRITICAL',
                                node: loop.id,
                                title: 'NESTED APPLY TO EACH DETECTED - EXPONENTIAL API CALLS',
                                description: `This creates ${this.calculateNestedImpact(loop, nestedLoops)} API calls!`,
                                impact: 'SYSTEM OVERLOAD',
                                solution: 'Use Filter Query in source action or batch processing',
                                savings: '99% reduction in API calls possible'
                            });
                        }
                        
                        // Check for unfiltered loops
                        if (!this.hasFilterBeforeLoop(loop, flow)) {
                            issues.push({
                                severity: 'HIGH',
                                node: loop.id,
                                title: 'Unfiltered Apply to Each',
                                description: 'Processing all items without filtering multiplies API calls',
                                impact: `${loop.estimatedItems || 100} items × ${loop.innerActions || 3} actions = ${(loop.estimatedItems || 100) * (loop.innerActions || 3)} API calls`,
                                solution: 'Add OData filter to source action',
                                savings: '90% reduction possible with filtering'
                            });
                        }
                        
                        // Check for operations that could be batched
                        if (this.hasBatchableOperations(loop, flow)) {
                            issues.push({
                                severity: 'MEDIUM',
                                node: loop.id,
                                title: 'Batchable Operations in Loop',
                                description: 'These operations could be batched',
                                solution: 'Use batch operations or Microsoft Graph batch API',
                                savings: 'Reduce API calls by 20x'
                            });
                        }
                    });
                    
                    return issues;
                },
                
                findNestedLoops: function(parentLoop, flow) {
                    const childNodes = flow.nodes.filter(n => 
                        n.parentId === parentLoop.id && n.type === 'apply-to-each'
                    );
                    return childNodes;
                },
                
                calculateNestedImpact: function(parentLoop, nestedLoops) {
                    const parentItems = parentLoop.estimatedItems || 100;
                    let total = parentItems;
                    nestedLoops.forEach(nested => {
                        total *= (nested.estimatedItems || 50);
                    });
                    return total.toLocaleString();
                },
                
                hasFilterBeforeLoop: function(loop, flow) {
                    const sourceAction = flow.nodes.find(n => n.id === loop.sourceId);
                    return sourceAction && (
                        sourceAction.config?.filter || 
                        sourceAction.config?.odata || 
                        sourceAction.config?.top
                    );
                },
                
                hasBatchableOperations: function(loop, flow) {
                    const innerActions = flow.nodes.filter(n => n.parentId === loop.id);
                    return innerActions.some(a => 
                        a.action?.includes('create') || 
                        a.action?.includes('update') ||
                        a.action?.includes('send')
                    );
                }
            },
            
            premiumConnectors: {
                severity: 'HIGH',
                category: 'Licensing',
                check: function(flow) {
                    const issues = [];
                    const premiumNodes = flow.nodes.filter(n => n.isPremium);
                    
                    if (premiumNodes.length > 0) {
                        const monthlyPrice = flow.userCount > 6 ? 81.90 : (12.20 * flow.userCount);
                        
                        issues.push({
                            severity: 'HIGH',
                            title: 'Premium Connectors Detected',
                            nodes: premiumNodes.map(n => n.id),
                            description: `Using ${premiumNodes.length} premium connector(s)`,
                            impact: `£${monthlyPrice.toFixed(2)}/month licensing cost`,
                            solution: flow.userCount > 6 
                                ? 'Per-flow license recommended (£81.90) - cheaper than per-user'
                                : 'Consider standard connector alternatives',
                            alternatives: this.findStandardAlternatives(premiumNodes)
                        });
                    }
                    
                    return issues;
                },
                
                findStandardAlternatives: function(premiumNodes) {
                    const alternatives = {
                        'SQL': 'SharePoint Lists or Dataverse',
                        'HTTP': 'Power Automate Management connector',
                        'Azure Functions': 'Office Scripts or Power Fx',
                        'Custom Connector': 'Built-in connectors with workarounds'
                    };
                    
                    return premiumNodes.map(n => alternatives[n.connectorType] || 'Check documentation').join(', ');
                }
            },
            
            throttlingRisks: {
                severity: 'HIGH',
                category: 'Performance',
                check: function(flow) {
                    const issues = [];
                    const connectorUsage = this.calculateConnectorUsage(flow);
                    
                    Object.entries(connectorUsage).forEach(([connector, usage]) => {
                        const limit = this.getConnectorLimit(connector, flow.accountType);
                        const usagePercent = (usage.callsPerMinute / limit) * 100;
                        
                        if (usagePercent > 80) {
                            issues.push({
                                severity: usagePercent > 100 ? 'CRITICAL' : 'HIGH',
                                connector: connector,
                                title: `${connector} Throttling Risk`,
                                description: `${usagePercent.toFixed(0)}% of API limit (${usage.callsPerMinute}/${limit} calls/min)`,
                                impact: usagePercent > 100 ? 'FLOW WILL FAIL' : 'High failure risk',
                                solution: this.getThrottlingSolution(connector, usagePercent),
                                pattern: usage.pattern
                            });
                        }
                    });
                    
                    return issues;
                },
                
                calculateConnectorUsage: function(flow) {
                    const usage = {};
                    
                    flow.nodes.forEach(node => {
                        if (node.connector) {
                            if (!usage[node.connector]) {
                                usage[node.connector] = {
                                    callsPerMinute: 0,
                                    pattern: 'distributed'
                                };
                            }
                            
                            // Calculate based on execution frequency
                            let callsPerMin = flow.executionsPerDay / (24 * 60);
                            
                            // Multiply by loop iterations if in Apply to Each
                            if (node.parentType === 'apply-to-each') {
                                callsPerMin *= (node.parentIterations || 100);
                            }
                            
                            usage[node.connector].callsPerMinute += callsPerMin;
                            
                            // Detect burst patterns
                            if (flow.trigger === 'scheduled' || flow.trigger === 'recurrence') {
                                usage[node.connector].pattern = 'burst';
                                usage[node.connector].callsPerMinute *= 3; // Concentrate in peak
                            }
                        }
                    });
                    
                    return usage;
                },
                
                getConnectorLimit: function(connector, accountType) {
                    const limits = {
                        'SharePoint': { user: 300, service: 600 },
                        'SQL': { user: 100, service: 300 },
                        'Dataverse': { user: 500, service: 6000 },
                        'Teams': { user: 300, service: 1800 },
                        'Outlook': { user: 150, service: 300 },
                        'OneDrive': { user: 500, service: 2000 }
                    };
                    
                    const connectorLimits = limits[connector] || { user: 100, service: 500 };
                    return accountType === 'service' ? connectorLimits.service : connectorLimits.user;
                },
                
                getThrottlingSolution: function(connector, usagePercent) {
                    if (usagePercent > 200) {
                        return 'URGENT: Implement request queuing, caching, and batch operations';
                    } else if (usagePercent > 100) {
                        return 'Add delays between operations, implement retry logic with exponential backoff';
                    } else {
                        return 'Consider implementing caching or reducing execution frequency';
                    }
                }
            },
            
            performanceBottlenecks: {
                severity: 'MEDIUM',
                category: 'Performance',
                check: function(flow) {
                    const issues = [];
                    
                    // Check for sequential operations that could be parallel
                    const sequentialOps = this.findSequentialOperations(flow);
                    if (sequentialOps.length > 3) {
                        issues.push({
                            severity: 'MEDIUM',
                            title: 'Sequential Operations Detected',
                            description: `${sequentialOps.length} operations running sequentially`,
                            impact: `Flow takes ${sequentialOps.length * 2.5}s instead of ${Math.ceil(sequentialOps.length/3) * 2.5}s`,
                            solution: 'Use parallel branches for independent operations',
                            timeReduction: `${Math.round((1 - Math.ceil(sequentialOps.length/3)/sequentialOps.length) * 100)}%`
                        });
                    }
                    
                    // Check for unnecessary variables
                    const unusedVars = this.findUnusedVariables(flow);
                    if (unusedVars.length > 0) {
                        issues.push({
                            severity: 'LOW',
                            title: 'Unused Variables',
                            description: `${unusedVars.length} variable(s) initialized but never used`,
                            impact: 'Unnecessary memory usage and complexity',
                            solution: 'Remove unused variables',
                            variables: unusedVars
                        });
                    }
                    
                    // Check for inefficient data operations
                    const inefficientOps = this.findInefficientOperations(flow);
                    inefficientOps.forEach(op => {
                        issues.push({
                            severity: 'MEDIUM',
                            title: op.title,
                            node: op.nodeId,
                            description: op.description,
                            impact: op.impact,
                            solution: op.solution
                        });
                    });
                    
                    return issues;
                },
                
                findSequentialOperations: function(flow) {
                    return flow.nodes.filter(n => 
                        n.type === 'action' && 
                        !n.dependsOn && 
                        !n.parentId
                    );
                },
                
                findUnusedVariables: function(flow) {
                    const variables = flow.nodes.filter(n => n.action === 'initialize-variable');
                    const unused = [];
                    
                    variables.forEach(v => {
                        const references = flow.nodes.filter(n => 
                            n.id !== v.id && 
                            n.references?.includes(v.name)
                        );
                        if (references.length === 0) {
                            unused.push(v.name);
                        }
                    });
                    
                    return unused;
                },
                
                findInefficientOperations: function(flow) {
                    const inefficient = [];
                    
                    flow.nodes.forEach(node => {
                        // Check for Get Items without filters
                        if (node.action === 'get-items' && !node.config?.filter) {
                            inefficient.push({
                                nodeId: node.id,
                                title: 'Unfiltered Get Items',
                                description: 'Retrieving all items without filtering',
                                impact: 'Slow performance, high memory usage',
                                solution: 'Add OData filter or use Get Item by ID'
                            });
                        }
                        
                        // Check for multiple Get operations that could be combined
                        if (node.action === 'get-item' && this.hasMultipleGets(node, flow)) {
                            inefficient.push({
                                nodeId: node.id,
                                title: 'Multiple Individual Gets',
                                description: 'Multiple Get Item operations in sequence',
                                impact: 'Each Get is a separate API call',
                                solution: 'Use Get Items with filter to retrieve multiple items at once'
                            });
                        }
                        
                        // Check for Compose actions that could be expressions
                        if (node.action === 'compose' && this.isSimpleCompose(node)) {
                            inefficient.push({
                                nodeId: node.id,
                                title: 'Simple Compose Action',
                                description: 'Compose used for simple concatenation',
                                impact: 'Unnecessary action consuming PPR',
                                solution: 'Use expressions directly in subsequent actions'
                            });
                        }
                    });
                    
                    return inefficient;
                },
                
                hasMultipleGets: function(node, flow) {
                    const siblingGets = flow.nodes.filter(n => 
                        n.action === 'get-item' && 
                        n.id !== node.id &&
                        Math.abs(n.order - node.order) <= 3
                    );
                    return siblingGets.length > 2;
                },
                
                isSimpleCompose: function(node) {
                    return node.config?.inputs && 
                           typeof node.config.inputs === 'string' &&
                           !node.config.inputs.includes('json(') &&
                           !node.config.inputs.includes('xml(');
                }
            },
            
            costOptimization: {
                severity: 'MEDIUM',
                category: 'Cost',
                check: function(flow) {
                    const issues = [];
                    const projectedCost = this.calculateProjectedCost(flow);
                    const optimizedCost = this.calculateOptimizedCost(flow);
                    
                    if (projectedCost.monthly > 50) {
                        issues.push({
                            severity: projectedCost.monthly > 100 ? 'HIGH' : 'MEDIUM',
                            title: 'High Projected Costs',
                            description: `Current design: £${projectedCost.monthly.toFixed(2)}/month`,
                            breakdown: projectedCost.breakdown,
                            optimized: `Could be: £${optimizedCost.monthly.toFixed(2)}/month`,
                            savings: `£${(projectedCost.monthly - optimizedCost.monthly).toFixed(2)}/month`,
                            recommendations: optimizedCost.recommendations
                        });
                    }
                    
                    // Check for AI token usage
                    if (flow.hasAIActions) {
                        const tokenCost = this.calculateAITokenCost(flow);
                        if (tokenCost.monthly > 10) {
                            issues.push({
                                severity: 'MEDIUM',
                                title: 'AI Token Costs',
                                description: `Estimated: £${tokenCost.monthly.toFixed(2)}/month`,
                                tokens: tokenCost.tokensPerMonth.toLocaleString(),
                                solution: 'Cache AI responses, use smaller models where possible',
                                optimization: tokenCost.optimizations
                            });
                        }
                    }
                    
                    return issues;
                },
                
                calculateProjectedCost: function(flow) {
                    let licenseCost = 0;
                    const breakdown = [];
                    
                    // License costs
                    if (flow.hasPremiumConnectors) {
                        if (flow.accountType === 'service' || flow.userCount > 6) {
                            licenseCost = 81.90;
                            breakdown.push('Per-flow license: £81.90');
                        } else {
                            licenseCost = 12.20 * flow.userCount;
                            breakdown.push(`Per-user licenses (${flow.userCount}): £${licenseCost.toFixed(2)}`);
                        }
                    }
                    
                    // PPR overage costs (if exceeding limits)
                    const monthlyPPR = flow.executionsPerDay * flow.actionsPerRun * 30;
                    const includedPPR = flow.userCount * 40000;
                    if (monthlyPPR > includedPPR) {
                        const overagePPR = monthlyPPR - includedPPR;
                        const overageCost = (overagePPR / 10000) * 1.50; // Example rate
                        breakdown.push(`PPR overage: £${overageCost.toFixed(2)}`);
                        licenseCost += overageCost;
                    }
                    
                    return {
                        monthly: licenseCost,
                        breakdown: breakdown
                    };
                },
                
                calculateOptimizedCost: function(flow) {
                    const recommendations = [];
                    let optimizedCost = 0;
                    
                    // Optimization strategies
                    if (flow.hasPremiumConnectors && flow.userCount <= 6) {
                        // Check if premium is really needed
                        recommendations.push('Replace SQL with SharePoint Lists (save £' + (12.20 * flow.userCount).toFixed(2) + ')');
                    }
                    
                    if (flow.userCount > 6 && flow.hasPremiumConnectors) {
                        optimizedCost = 81.90;
                        recommendations.push('Use per-flow license instead of per-user');
                    }
                    
                    if (flow.hasApplyToEach) {
                        recommendations.push('Optimize loops with filtering (reduce PPR by 90%)');
                    }
                    
                    return {
                        monthly: optimizedCost,
                        recommendations: recommendations
                    };
                },
                
                calculateAITokenCost: function(flow) {
                    const aiActions = flow.nodes.filter(n => n.isAI);
                    const tokensPerRun = aiActions.reduce((sum, a) => sum + (a.estimatedTokens || 1000), 0);
                    const runsPerMonth = flow.executionsPerDay * 30;
                    const tokensPerMonth = tokensPerRun * runsPerMonth;
                    
                    // GPT-4o mini: ~£0.15 per 1M tokens
                    const costPerMillion = 0.15;
                    const monthly = (tokensPerMonth / 1000000) * costPerMillion;
                    
                    return {
                        monthly: monthly,
                        tokensPerMonth: tokensPerMonth,
                        optimizations: [
                            'Cache frequently requested AI responses',
                            'Use GPT-3.5 for non-critical tasks',
                            'Implement response length limits',
                            'Batch similar requests'
                        ]
                    };
                }
            },
            
            governance: {
                severity: 'LOW',
                category: 'Governance',
                check: function(flow) {
                    const issues = [];
                    
                    // Check naming conventions
                    if (!flow.name || flow.name === 'New Flow' || flow.name.length < 10) {
                        issues.push({
                            severity: 'LOW',
                            title: 'Poor Flow Naming',
                            description: 'Flow name is not descriptive',
                            impact: 'Difficult to manage and maintain',
                            solution: 'Use format: [Department]_[Process]_[Trigger]_v[Version]'
                        });
                    }
                    
                    // Check for error handling
                    const hasErrorHandling = flow.nodes.some(n => 
                        n.type === 'scope' && n.runAfter?.includes('Failed')
                    );
                    
                    if (!hasErrorHandling) {
                        issues.push({
                            severity: 'MEDIUM',
                            title: 'No Error Handling',
                            description: 'Flow lacks proper error handling',
                            impact: 'Silent failures, no notifications',
                            solution: 'Add Try-Catch pattern with Scope actions'
                        });
                    }
                    
                    // Check for logging
                    const hasLogging = flow.nodes.some(n => 
                        n.action?.includes('log') || n.action?.includes('compose')
                    );
                    
                    if (!hasLogging) {
                        issues.push({
                            severity: 'LOW',
                            title: 'No Logging',
                            description: 'Flow lacks logging for debugging',
                            impact: 'Difficult to troubleshoot issues',
                            solution: 'Add Compose actions for key data points'
                        });
                    }
                    
                    // Check for documentation
                    if (!flow.description || flow.description.length < 50) {
                        issues.push({
                            severity: 'LOW',
                            title: 'Missing Documentation',
                            description: 'Flow lacks proper description',
                            impact: 'Difficult for team to understand purpose',
                            solution: 'Add description with: Purpose, Owner, Dependencies, Change log'
                        });
                    }
                    
                    return issues;
                }
            }
        },
        
        // Analyze flow and return all issues
        analyzeFlow: function(flow) {
            const allIssues = [];
            
            Object.values(this.rules).forEach(rule => {
                const issues = rule.check.call(rule, flow);
                allIssues.push(...issues);
            });
            
            // Sort by severity
            const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
            allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
            
            return {
                issues: allIssues,
                score: this.calculateHealthScore(allIssues),
                summary: this.generateSummary(allIssues),
                topRecommendations: this.getTopRecommendations(allIssues)
            };
        },
        
        calculateHealthScore: function(issues) {
            let score = 100;
            
            issues.forEach(issue => {
                switch(issue.severity) {
                    case 'CRITICAL': score -= 25; break;
                    case 'HIGH': score -= 15; break;
                    case 'MEDIUM': score -= 8; break;
                    case 'LOW': score -= 3; break;
                }
            });
            
            return Math.max(0, score);
        },
        
        generateSummary: function(issues) {
            const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
            issues.forEach(i => counts[i.severity]++);
            
            return {
                total: issues.length,
                critical: counts.CRITICAL,
                high: counts.HIGH,
                medium: counts.MEDIUM,
                low: counts.LOW,
                categories: this.categorizeIssues(issues)
            };
        },
        
        categorizeIssues: function(issues) {
            const categories = {};
            issues.forEach(issue => {
                if (!categories[issue.category]) {
                    categories[issue.category] = [];
                }
                categories[issue.category].push(issue);
            });
            return categories;
        },
        
        getTopRecommendations: function(issues) {
            const recommendations = [];
            
            // Always prioritize Apply to Each issues
            const applyToEachIssues = issues.filter(i => i.title.includes('Apply to Each'));
            if (applyToEachIssues.length > 0) {
                recommendations.push({
                    priority: 1,
                    title: 'URGENT: Optimize Apply to Each Loops',
                    description: 'Your loops are creating massive API multiplication',
                    action: 'Add filters before loops, consider batch operations',
                    impact: 'Reduce API calls by 90-99%'
                });
            }
            
            // Premium connector optimization
            const premiumIssues = issues.filter(i => i.category === 'Licensing');
            if (premiumIssues.length > 0) {
                recommendations.push({
                    priority: 2,
                    title: 'Optimize Licensing Costs',
                    description: 'Premium connectors detected',
                    action: premiumIssues[0].solution,
                    savings: premiumIssues[0].savings
                });
            }
            
            // Throttling risks
            const throttlingIssues = issues.filter(i => i.title.includes('Throttling'));
            if (throttlingIssues.length > 0) {
                recommendations.push({
                    priority: 3,
                    title: 'Prevent API Throttling',
                    description: 'High risk of hitting API limits',
                    action: 'Implement request queuing and caching',
                    impact: 'Ensure flow reliability'
                });
            }
            
            return recommendations.slice(0, 5);
        },
        
        // Generate optimization report
        generateReport: function(flow, analysis) {
            return {
                flowName: flow.name,
                timestamp: new Date().toISOString(),
                healthScore: analysis.score,
                summary: analysis.summary,
                criticalFindings: analysis.issues.filter(i => i.severity === 'CRITICAL'),
                recommendations: analysis.topRecommendations,
                estimatedSavings: this.calculateTotalSavings(analysis.issues),
                performanceImpact: this.calculatePerformanceImpact(analysis.issues),
                nextSteps: this.generateNextSteps(analysis)
            };
        },
        
        calculateTotalSavings: function(issues) {
            let totalSavings = 0;
            issues.forEach(issue => {
                if (issue.savings) {
                    const savingsNum = parseFloat(issue.savings.replace(/[^0-9.]/g, ''));
                    if (!isNaN(savingsNum)) {
                        totalSavings += savingsNum;
                    }
                }
            });
            return `£${totalSavings.toFixed(2)}/month`;
        },
        
        calculatePerformanceImpact: function(issues) {
            const performanceIssues = issues.filter(i => i.category === 'Performance');
            if (performanceIssues.length === 0) return 'No performance issues';
            
            const critical = performanceIssues.filter(i => i.severity === 'CRITICAL');
            if (critical.length > 0) {
                return 'SEVERE: Flow likely to fail or timeout';
            }
            
            const high = performanceIssues.filter(i => i.severity === 'HIGH');
            if (high.length > 0) {
                return 'HIGH: Significant performance degradation expected';
            }
            
            return 'MODERATE: Some performance optimization possible';
        },
        
        generateNextSteps: function(analysis) {
            const steps = [];
            
            if (analysis.summary.critical > 0) {
                steps.push('1. ADDRESS CRITICAL ISSUES IMMEDIATELY - Flow may fail in production');
            }
            
            if (analysis.issues.some(i => i.title.includes('Apply to Each'))) {
                steps.push('2. Optimize all Apply to Each loops with filtering and batching');
            }
            
            if (analysis.issues.some(i => i.category === 'Licensing')) {
                steps.push('3. Review licensing strategy - potential cost savings available');
            }
            
            if (analysis.score < 50) {
                steps.push('4. Consider redesigning flow architecture for better performance');
            }
            
            steps.push('5. Implement monitoring and alerting for production flows');
            
            return steps;
        }
    };

    // Auto-initialize
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.PowerAutomateOptimizer;
    }
})();