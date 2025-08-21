// Apply to Each Impact Calculator - Shows the REAL cost of loops
// Critical for understanding API call multiplication and performance impact

const ApplyToEachImpactCalculator = {
    
    // CRITICAL: Each iteration = separate API call for EVERY action inside
    calculateImpact: function(loopConfig) {
        const {
            itemCount,
            actionsInLoop,
            nestedLoops = [],
            concurrency = 1,
            dailyRuns = 10
        } = loopConfig;
        
        // Base calculation - THIS IS THE KILLER
        let totalAPICalls = itemCount * actionsInLoop;
        
        // NESTED LOOPS = EXPONENTIAL DISASTER
        if (nestedLoops.length > 0) {
            nestedLoops.forEach(nested => {
                totalAPICalls *= nested.itemCount * nested.actionsInLoop;
            });
        }
        
        // Daily and monthly projections
        const dailyAPICalls = totalAPICalls * dailyRuns;
        const monthlyAPICalls = dailyAPICalls * 30;
        
        // Time impact (each API call ~0.5-2 seconds)
        const timePerCall = concurrency > 1 ? 0.5 : 1.5; // Concurrent is faster
        const totalTimeSeconds = (totalAPICalls * timePerCall) / concurrency;
        const totalTimeMinutes = totalTimeSeconds / 60;
        
        // Throttling risk calculation
        const callsPerMinute = concurrency > 1 ? 
            (actionsInLoop * concurrency) : 
            actionsInLoop;
        
        const throttlingRisk = this.calculateThrottlingRisk(callsPerMinute);
        
        return {
            singleRunAPICalls: totalAPICalls,
            dailyAPICalls,
            monthlyAPICalls,
            estimatedTimeSeconds: totalTimeSeconds,
            estimatedTimeMinutes: totalTimeMinutes,
            throttlingRisk,
            concurrencyImpact: concurrency > 1 ? 'Reduced time but increased API rate' : 'Sequential - slow but safe',
            
            // THE CRITICAL WARNING
            warning: totalAPICalls > 100 ? 
                'CRITICAL: This loop will make ' + totalAPICalls + ' API calls PER RUN!' : 
                null,
            
            // Recommendations
            recommendations: this.getRecommendations(loopConfig, totalAPICalls)
        };
    },
    
    calculateThrottlingRisk: function(callsPerMinute) {
        // SharePoint limit: 600/min total, 300/min per user
        // SQL limit: 300/min total, 100/min per user
        
        if (callsPerMinute > 300) {
            return {
                level: 'CRITICAL',
                message: 'Will hit API throttling limits!',
                description: 'SharePoint: 300 calls/min per user limit. Your loop: ' + callsPerMinute + ' calls/min'
            };
        } else if (callsPerMinute > 200) {
            return {
                level: 'HIGH',
                message: 'Approaching throttling limits',
                description: 'Getting close to API limits. Consider reducing concurrency or adding delays.'
            };
        } else if (callsPerMinute > 100) {
            return {
                level: 'MEDIUM',
                message: 'Moderate API usage',
                description: 'Within limits but monitor during peak times'
            };
        }
        
        return {
            level: 'LOW',
            message: 'Safe API usage',
            description: 'Well within API limits'
        };
    },
    
    getRecommendations: function(config, totalCalls) {
        const recommendations = [];
        
        // CRITICAL: Filter at source
        if (config.itemCount > 100 && !config.hasFilter) {
            recommendations.push({
                priority: 'CRITICAL',
                title: 'Add Filter Query to Get Items',
                impact: '90% reduction in API calls',
                explanation: 'Instead of getting 1000 items and looping, filter to get only 100 needed items',
                example: "Filter Query: Status eq 'Active' and Modified gt '@{addDays(utcNow(), -7)}'"
            });
        }
        
        // Use Select action
        if (!config.hasSelect) {
            recommendations.push({
                priority: 'HIGH',
                title: 'Use Select Action Before Loop',
                impact: '50% performance improvement',
                explanation: 'Map data to simpler structure before Apply to each',
                example: 'Select only the fields you need, not entire objects'
            });
        }
        
        // Batch operations
        if (config.actionsInLoop > 3) {
            recommendations.push({
                priority: 'HIGH',
                title: 'Consider Batch Operations',
                impact: 'Reduce API calls by 80%',
                explanation: 'Instead of updating items one by one, use batch update',
                example: 'Use "Send HTTP request to SharePoint" with $batch endpoint'
            });
        }
        
        // Nested loop warning
        if (config.nestedLoops && config.nestedLoops.length > 0) {
            recommendations.push({
                priority: 'CRITICAL',
                title: 'ELIMINATE NESTED LOOPS',
                impact: 'Exponential reduction in API calls',
                explanation: 'Nested Apply to each multiplies API calls exponentially!',
                example: '100 outer × 50 inner = 5,000 API calls! Use Filter array or Select instead',
                calculation: `Current: ${config.itemCount} × ${config.nestedLoops[0]?.itemCount || 1} = ${config.itemCount * (config.nestedLoops[0]?.itemCount || 1)} iterations!`
            });
        }
        
        // Concurrency settings
        if (config.concurrency === 1 && totalCalls > 50) {
            recommendations.push({
                priority: 'MEDIUM',
                title: 'Enable Concurrency Control',
                impact: '5-10x speed improvement',
                explanation: 'Process items in parallel, but watch API limits',
                example: 'Set concurrency to 20-50 for parallel processing',
                warning: 'This increases API calls per minute - monitor throttling!'
            });
        } else if (config.concurrency > 50) {
            recommendations.push({
                priority: 'HIGH',
                title: 'Reduce Concurrency',
                impact: 'Avoid throttling',
                explanation: 'Too high concurrency will hit API limits',
                example: 'Reduce to 20-30 for safe parallel processing'
            });
        }
        
        // Alternative approaches
        if (totalCalls > 1000) {
            recommendations.push({
                priority: 'CRITICAL',
                title: 'Consider Alternative Architecture',
                impact: 'Complete redesign needed',
                explanation: 'This many API calls indicates a design problem',
                alternatives: [
                    'Use stored procedures in SQL for bulk operations',
                    'Use Power BI dataflows for large data processing',
                    'Consider Azure Logic Apps with better batching',
                    'Use SharePoint REST API $batch for bulk updates',
                    'Implement pagination with Do Until loop'
                ]
            });
        }
        
        return recommendations;
    },
    
    // Show real examples of impact
    examples: {
        'simple-loop': {
            name: 'Simple Apply to Each',
            scenario: '100 items, 3 actions inside',
            calculation: '100 × 3 = 300 API calls per run',
            monthly: '300 × 10 runs/day × 30 days = 90,000 API calls/month',
            cost: 'Approaching PPR limits quickly'
        },
        
        'nested-disaster': {
            name: 'Nested Apply to Each (AVOID!)',
            scenario: '100 orders × 50 line items, 2 actions per item',
            calculation: '100 × 50 × 2 = 10,000 API calls per run!',
            monthly: '10,000 × 5 runs/day × 30 days = 1,500,000 API calls/month',
            cost: 'WILL EXCEED LIMITS - Flow will fail!'
        },
        
        'optimised': {
            name: 'Optimised with Filter and Select',
            scenario: 'Filter to 20 items, Select fields, 1 batch update',
            calculation: '20 items + 1 batch call = 21 API calls',
            monthly: '21 × 10 runs/day × 30 days = 6,300 API calls/month',
            cost: 'Well within limits, 95% reduction!'
        }
    },
    
    // Visual representation of impact
    generateImpactVisual: function(config) {
        const impact = this.calculateImpact(config);
        
        return {
            type: 'warning-chart',
            data: {
                withoutOptimisation: {
                    apiCalls: impact.singleRunAPICalls,
                    time: impact.estimatedTimeMinutes,
                    risk: impact.throttlingRisk.level
                },
                withOptimisation: {
                    apiCalls: Math.ceil(impact.singleRunAPICalls * 0.1), // 90% reduction possible
                    time: impact.estimatedTimeMinutes * 0.2, // 80% time reduction
                    risk: 'LOW'
                }
            },
            message: impact.warning || 'Loop impact calculated'
        };
    },
    
    // Common patterns to avoid
    antiPatterns: [
        {
            name: 'Get All Then Filter in Loop',
            bad: 'Get Items (5000) → Apply to each → Condition (Status = Active)',
            good: 'Get Items with Filter Query (Status eq Active) → Apply to each',
            impact: '95% reduction in iterations'
        },
        {
            name: 'Nested Loops for Related Data',
            bad: 'Get Orders → Apply to each → Get Line Items → Apply to each',
            good: 'Get Orders with $expand=LineItems → Apply to each with Select',
            impact: 'From O(n²) to O(n) complexity'
        },
        {
            name: 'Individual Updates in Loop',
            bad: 'Apply to each → Update item (one by one)',
            good: 'Build array → Send batch update request',
            impact: 'From N API calls to 1 API call'
        },
        {
            name: 'Sequential Processing of Large Sets',
            bad: 'Apply to each (concurrency: 1) on 1000 items',
            good: 'Apply to each (concurrency: 50) or use Select/Filter',
            impact: '50x speed improvement or eliminate loop entirely'
        }
    ],
    
    // Best practices for loops
    bestPractices: [
        {
            rule: 'ALWAYS filter at source',
            explanation: 'Use OData filters, SQL WHERE, or Graph API $filter',
            example: "$filter=Status eq 'Active' and Created gt '2024-01-01'"
        },
        {
            rule: 'Use Select before Apply to each',
            explanation: 'Map complex objects to simple structure first',
            example: 'Select: Title, ID, Status (not entire 50-field object)'
        },
        {
            rule: 'Enable concurrency with caution',
            explanation: 'Parallel processing is faster but increases API rate',
            safe: 'Concurrency: 20-30 for most scenarios'
        },
        {
            rule: 'Batch operations when possible',
            explanation: 'Combine multiple operations into single API call',
            example: 'SharePoint $batch, SQL bulk insert, Graph API batch'
        },
        {
            rule: 'NEVER nest Apply to each',
            explanation: 'Exponential complexity - find alternatives',
            alternatives: 'Use Filter array, Select, or restructure data model'
        },
        {
            rule: 'Monitor loop metrics',
            explanation: 'Track iterations, duration, and API consumption',
            metrics: 'Set up alerts for >1000 iterations or >5 min duration'
        }
    ],
    
    // Calculate real costs
    calculateCosts: function(impact) {
        const costs = {
            apiCalls: impact.monthlyAPICalls,
            
            // PPR consumption
            pprUsage: impact.monthlyAPICalls,
            pprLimit: 250000, // Process licence limit
            pprPercentage: (impact.monthlyAPICalls / 250000) * 100,
            
            // Time costs (assuming £50/hour for delays)
            timeWasted: impact.estimatedTimeMinutes > 60 ? 
                (impact.estimatedTimeMinutes / 60) * 50 : 0,
            
            // Throttling costs (failures and retries)
            throttlingRisk: impact.throttlingRisk.level === 'CRITICAL' ? 
                'Flow will fail - infinite cost!' : 
                'Within limits',
            
            // Licence implications
            licenceNeeded: impact.monthlyAPICalls > 40000 ? 
                'Premium/Process required' : 
                'Standard sufficient',
            
            monthlyCost: impact.monthlyAPICalls > 40000 ? 81.90 : 0
        };
        
        return costs;
    }
};

// Helper function to analyse existing flow
function analyseExistingLoop(flowNodes) {
    const loops = flowNodes.filter(n => n.key === 'control-apply-each');
    const analysis = [];
    
    loops.forEach((loop, index) => {
        // Check what's inside the loop
        const actionsInLoop = countActionsInLoop(flowNodes, loop);
        const isNested = isLoopNested(flowNodes, loop);
        
        const config = {
            itemCount: loop.config?.estimatedItems || 100,
            actionsInLoop: actionsInLoop,
            nestedLoops: isNested ? [{ itemCount: 50, actionsInLoop: 2 }] : [],
            concurrency: loop.config?.concurrency || 1,
            dailyRuns: 10,
            hasFilter: checkForFilter(flowNodes, loop),
            hasSelect: checkForSelect(flowNodes, loop)
        };
        
        const impact = ApplyToEachImpactCalculator.calculateImpact(config);
        
        analysis.push({
            loopIndex: index + 1,
            location: `Loop at position ${loop.position}`,
            impact: impact,
            severity: impact.singleRunAPICalls > 500 ? 'CRITICAL' : 
                     impact.singleRunAPICalls > 100 ? 'HIGH' : 'MEDIUM'
        });
    });
    
    return analysis;
}

function countActionsInLoop(nodes, loop) {
    // Count actions between loop start and end
    let count = 0;
    let inLoop = false;
    
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === loop) {
            inLoop = true;
            continue;
        }
        if (inLoop && nodes[i].key === 'control-apply-each-end') {
            break;
        }
        if (inLoop && nodes[i].type === 'action') {
            count++;
        }
    }
    
    return count || 3; // Default to 3 if can't determine
}

function isLoopNested(nodes, loop) {
    // Check if this loop is inside another loop
    let loopDepth = 0;
    
    for (let i = 0; i < nodes.indexOf(loop); i++) {
        if (nodes[i].key === 'control-apply-each') loopDepth++;
        if (nodes[i].key === 'control-apply-each-end') loopDepth--;
    }
    
    return loopDepth > 0;
}

function checkForFilter(nodes, loop) {
    // Check if there's a filter before the loop
    const index = nodes.indexOf(loop);
    for (let i = index - 1; i >= 0 && i > index - 5; i--) {
        if (nodes[i].key === 'sharepoint-get-items' && nodes[i].config?.filterQuery) {
            return true;
        }
    }
    return false;
}

function checkForSelect(nodes, loop) {
    // Check if there's a Select action before the loop
    const index = nodes.indexOf(loop);
    for (let i = index - 1; i >= 0 && i > index - 3; i--) {
        if (nodes[i].key === 'data-select') {
            return true;
        }
    }
    return false;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApplyToEachImpactCalculator;
}