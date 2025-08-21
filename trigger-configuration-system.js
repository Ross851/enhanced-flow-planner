// Power Automate Trigger Configuration System - UK English
// Professional configuration guidance for all trigger types

(function() {
    'use strict';

    // UK English configuration guidance for each trigger type
    const triggerConfigurations = {
        'recurrence': {
            title: 'Configure Recurrence Schedule',
            icon: '🔄',
            fields: [
                {
                    name: 'frequency',
                    label: 'Frequency',
                    type: 'select',
                    options: ['Minute', 'Hour', 'Day', 'Week', 'Month'],
                    required: true,
                    tip: 'Choose the base frequency. For efficiency, avoid "Minute" unless absolutely necessary.'
                },
                {
                    name: 'interval',
                    label: 'Interval',
                    type: 'number',
                    min: 1,
                    max: 500,
                    required: true,
                    tip: 'How often to repeat. E.g., "2" with "Hour" = every 2 hours.'
                },
                {
                    name: 'timezone',
                    label: 'Time Zone',
                    type: 'select',
                    options: ['GMT Standard Time', 'Central European Time', 'Eastern Standard Time'],
                    tip: 'Always specify timezone to avoid daylight saving issues.'
                },
                {
                    name: 'startTime',
                    label: 'Start Time',
                    type: 'datetime',
                    tip: 'Optional: When to start the schedule. Leave blank to start immediately.'
                }
            ],
            bestPractices: [
                '✅ Use the longest interval possible to minimise API calls',
                '✅ Consider business hours - add trigger conditions to skip weekends',
                '✅ Always specify timezone for international organisations',
                '⚠️ Avoid running every minute - this consumes significant PPR',
                '💡 For hourly runs, offset by a few minutes (e.g., 5 past) to avoid peak loads'
            ],
            performance: {
                impact: 'Low',
                apiCalls: '1 per execution',
                recommendation: 'Ideal for scheduled reports and batch processing'
            }
        },
        
        'sharepoint-created': {
            title: 'Configure SharePoint Item Created',
            icon: '📄',
            fields: [
                {
                    name: 'siteAddress',
                    label: 'Site Address',
                    type: 'text',
                    placeholder: 'https://contoso.sharepoint.com/sites/Finance',
                    required: true,
                    tip: 'Use the full URL or select from your favourites'
                },
                {
                    name: 'listName',
                    label: 'List Name',
                    type: 'select',
                    dynamic: true,
                    required: true,
                    tip: 'Select the list or library to monitor'
                },
                {
                    name: 'folder',
                    label: 'Folder',
                    type: 'text',
                    placeholder: '/Invoices/2024',
                    tip: 'Optional: Monitor specific folder only (improves performance)'
                },
                {
                    name: 'includeAttachments',
                    label: 'Include Attachments',
                    type: 'checkbox',
                    tip: 'Whether to retrieve attachments (increases processing time)'
                }
            ],
            bestPractices: [
                '✅ Always specify a folder if monitoring high-volume libraries',
                '✅ Use "Get changes" for large lists instead of triggers',
                '✅ Add trigger conditions to filter early (e.g., Status eq "New")',
                '⚠️ Avoid triggering on root folders with >5000 items',
                '💡 Consider using column indexing in SharePoint for better performance',
                '🔒 Ensure service account has appropriate permissions'
            ],
            performance: {
                impact: 'Medium',
                apiCalls: '1-3 per item',
                recommendation: 'Use OData filters in trigger conditions to reduce executions'
            }
        },

        'email-received': {
            title: 'Configure Email Trigger',
            icon: '📧',
            fields: [
                {
                    name: 'mailbox',
                    label: 'Mailbox',
                    type: 'select',
                    options: ['My Inbox', 'Shared Mailbox'],
                    required: true,
                    tip: 'Select which mailbox to monitor'
                },
                {
                    name: 'folder',
                    label: 'Folder',
                    type: 'text',
                    placeholder: 'Inbox/Automated',
                    tip: 'Monitor specific folder (recommended for automation)'
                },
                {
                    name: 'importance',
                    label: 'Importance',
                    type: 'select',
                    options: ['Any', 'High', 'Normal', 'Low'],
                    tip: 'Filter by importance level'
                },
                {
                    name: 'includeAttachments',
                    label: 'Include Attachments',
                    type: 'checkbox',
                    tip: 'Process email attachments (increases runtime)'
                },
                {
                    name: 'subjectFilter',
                    label: 'Subject Filter',
                    type: 'text',
                    placeholder: '[URGENT]',
                    tip: 'Only trigger for emails containing this text'
                }
            ],
            bestPractices: [
                '✅ Create dedicated folders for automated processing',
                '✅ Use subject line prefixes for reliable filtering',
                '✅ Consider shared mailbox for team automations',
                '⚠️ Avoid monitoring personal inbox - too many triggers',
                '💡 Use "Mark as read" action to prevent reprocessing',
                '🔒 Be cautious with sensitive email content'
            ],
            performance: {
                impact: 'Low',
                apiCalls: '2-5 per email',
                recommendation: 'Efficient for low-volume, high-value processes'
            }
        },

        'teams-message': {
            title: 'Configure Teams Message Trigger',
            icon: '💬',
            fields: [
                {
                    name: 'team',
                    label: 'Team',
                    type: 'select',
                    dynamic: true,
                    required: true,
                    tip: 'Select the Team to monitor'
                },
                {
                    name: 'channel',
                    label: 'Channel',
                    type: 'select',
                    dynamic: true,
                    required: true,
                    tip: 'Select the specific channel'
                },
                {
                    name: 'messageType',
                    label: 'Message Type',
                    type: 'select',
                    options: ['All Messages', 'Mentions Only', 'Keywords'],
                    tip: 'Filter which messages trigger the flow'
                },
                {
                    name: 'keywords',
                    label: 'Keywords',
                    type: 'text',
                    placeholder: 'help, support, urgent',
                    tip: 'Comma-separated keywords to monitor'
                }
            ],
            bestPractices: [
                '✅ Use dedicated automation channels for reliability',
                '✅ Implement keyword filtering to reduce noise',
                '✅ Consider adaptive cards for structured input',
                '⚠️ High-traffic channels can hit API limits quickly',
                '💡 Use bot framework for complex interactions',
                '🔒 Respect privacy - only monitor public channels'
            ],
            performance: {
                impact: 'High',
                apiCalls: '3-6 per message',
                recommendation: 'Best for low-volume, high-value interactions'
            }
        },

        'http-webhook': {
            title: 'Configure HTTP Webhook',
            icon: '🌐',
            fields: [
                {
                    name: 'method',
                    label: 'HTTP Method',
                    type: 'select',
                    options: ['POST', 'GET', 'PUT', 'PATCH'],
                    required: true,
                    tip: 'POST is standard for webhooks'
                },
                {
                    name: 'authentication',
                    label: 'Authentication',
                    type: 'select',
                    options: ['None', 'API Key', 'OAuth 2.0', 'Basic'],
                    tip: 'Always secure your endpoints'
                },
                {
                    name: 'schema',
                    label: 'Request Schema',
                    type: 'textarea',
                    placeholder: '{\n  "type": "object",\n  "properties": {...}\n}',
                    tip: 'Define expected JSON schema for validation'
                },
                {
                    name: 'rateLimiting',
                    label: 'Rate Limiting',
                    type: 'number',
                    placeholder: '100',
                    tip: 'Max requests per minute (prevent abuse)'
                }
            ],
            bestPractices: [
                '✅ Always implement authentication - never use anonymous',
                '✅ Validate incoming data against schema',
                '✅ Implement rate limiting to prevent abuse',
                '✅ Use HTTPS only - never HTTP',
                '⚠️ Premium connector - requires appropriate licence',
                '💡 Return proper HTTP status codes',
                '🔒 Store secrets in Azure Key Vault'
            ],
            performance: {
                impact: 'Very Low',
                apiCalls: 'Minimal',
                recommendation: 'Excellent for real-time integrations'
            }
        },

        'forms-submitted': {
            title: 'Configure Forms Response',
            icon: '📝',
            fields: [
                {
                    name: 'formId',
                    label: 'Form',
                    type: 'select',
                    dynamic: true,
                    required: true,
                    tip: 'Select the Microsoft Form to monitor'
                },
                {
                    name: 'responseDetails',
                    label: 'Include Response Details',
                    type: 'checkbox',
                    checked: true,
                    tip: 'Retrieve full response data'
                },
                {
                    name: 'attachments',
                    label: 'Process File Uploads',
                    type: 'checkbox',
                    tip: 'Handle file upload questions'
                }
            ],
            bestPractices: [
                '✅ Use branching logic in forms to simplify flow logic',
                '✅ Validate required fields at form level',
                '✅ Consider response batching for high-volume forms',
                '⚠️ File uploads count against storage quota',
                '💡 Use forms for structured data collection',
                '🔒 Enable response restrictions for sensitive data'
            ],
            performance: {
                impact: 'Low',
                apiCalls: '2-4 per response',
                recommendation: 'Perfect for surveys and data collection'
            }
        }
    };

    // Action configurations (similar structure)
    const actionConfigurations = {
        'get-items': {
            title: 'Configure Get Items',
            icon: '📋',
            fields: [
                {
                    name: 'filter',
                    label: 'Filter Query (OData)',
                    type: 'text',
                    placeholder: "Status eq 'Active' and Modified gt '2024-01-01'",
                    tip: 'ALWAYS use OData filters for performance'
                },
                {
                    name: 'top',
                    label: 'Top Count',
                    type: 'number',
                    placeholder: '100',
                    tip: 'Limit results - default is 100, max is 5000'
                },
                {
                    name: 'orderBy',
                    label: 'Order By',
                    type: 'text',
                    placeholder: 'Modified desc',
                    tip: 'Sort results at source, not in flow'
                },
                {
                    name: 'select',
                    label: 'Select Columns',
                    type: 'text',
                    placeholder: 'Title,Status,Modified',
                    tip: 'Only retrieve needed columns (massive performance boost)'
                }
            ],
            bestPractices: [
                '✅ ALWAYS use Filter Query - 90% performance improvement',
                '✅ Use Select to retrieve only required columns',
                '✅ Implement pagination for large datasets',
                '⚠️ Never use "Get items" without filters',
                '💡 Index columns used in filters for better performance',
                '🚀 Use "Get changes" for incremental updates'
            ],
            performance: {
                impact: 'High if unfiltered',
                apiCalls: '1 + pagination',
                recommendation: 'Critical to optimise with filters and column selection'
            }
        }
    };

    // Create configuration modal
    window.showTriggerConfiguration = function(element, triggerType) {
        const config = triggerConfigurations[triggerType] || actionConfigurations[triggerType];
        if (!config) {
            showGenericConfiguration(element, triggerType);
            return;
        }

        // Remove any existing modal
        const existingModal = document.getElementById('configModal');
        if (existingModal) existingModal.remove();

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'configModal';
        modal.className = 'config-modal';
        modal.innerHTML = `
            <div class="config-modal-content">
                <div class="config-header">
                    <h2>${config.icon} ${config.title}</h2>
                    <span class="config-close" onclick="closeConfigModal()">×</span>
                </div>
                
                <div class="config-body">
                    <div class="config-tabs">
                        <button class="config-tab active" onclick="switchConfigTab('settings')">
                            Settings
                        </button>
                        <button class="config-tab" onclick="switchConfigTab('practices')">
                            Best Practices
                        </button>
                        <button class="config-tab" onclick="switchConfigTab('performance')">
                            Performance
                        </button>
                    </div>
                    
                    <div class="config-tab-content" id="settings-tab">
                        <form id="configForm">
                            ${config.fields.map(field => createField(field)).join('')}
                        </form>
                    </div>
                    
                    <div class="config-tab-content" id="practices-tab" style="display:none;">
                        <div class="best-practices-list">
                            ${config.bestPractices.map(practice => 
                                `<div class="practice-item">${practice}</div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="config-tab-content" id="performance-tab" style="display:none;">
                        <div class="performance-info">
                            <div class="perf-metric">
                                <label>Impact Level:</label>
                                <span class="perf-value ${config.performance.impact.toLowerCase()}">${config.performance.impact}</span>
                            </div>
                            <div class="perf-metric">
                                <label>API Calls:</label>
                                <span class="perf-value">${config.performance.apiCalls}</span>
                            </div>
                            <div class="perf-metric">
                                <label>Recommendation:</label>
                                <p class="perf-recommendation">${config.performance.recommendation}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="config-footer">
                    <button class="btn btn-secondary" onclick="closeConfigModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="saveConfiguration()">Save Configuration</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add modal styles if not already present
        if (!document.getElementById('configModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'configModalStyles';
            styles.textContent = `
                .config-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.2s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .config-modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 600px;
                    max-width: 90%;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: slideUp 0.3s ease;
                }
                
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .config-header {
                    padding: 20px;
                    border-bottom: 1px solid #e1e4e8;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .config-header h2 {
                    margin: 0;
                    font-size: 20px;
                    color: #24292e;
                }
                
                .config-close {
                    cursor: pointer;
                    font-size: 28px;
                    color: #586069;
                    line-height: 1;
                    transition: color 0.2s;
                }
                
                .config-close:hover {
                    color: #24292e;
                }
                
                .config-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .config-tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #e1e4e8;
                }
                
                .config-tab {
                    padding: 8px 16px;
                    background: none;
                    border: none;
                    color: #586069;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -2px;
                }
                
                .config-tab:hover {
                    color: #24292e;
                }
                
                .config-tab.active {
                    color: #0366d6;
                    border-bottom-color: #0366d6;
                }
                
                .config-field {
                    margin-bottom: 20px;
                }
                
                .config-field label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #24292e;
                    font-size: 14px;
                }
                
                .config-field input,
                .config-field select,
                .config-field textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #e1e4e8;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                }
                
                .config-field input:focus,
                .config-field select:focus,
                .config-field textarea:focus {
                    outline: none;
                    border-color: #0366d6;
                    box-shadow: 0 0 0 3px rgba(3,102,214,0.1);
                }
                
                .config-field .field-tip {
                    margin-top: 4px;
                    font-size: 12px;
                    color: #586069;
                }
                
                .config-field textarea {
                    min-height: 100px;
                    font-family: 'Monaco', 'Menlo', monospace;
                    font-size: 12px;
                }
                
                .best-practices-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                
                .practice-item {
                    padding: 12px;
                    background: #f6f8fa;
                    border-radius: 6px;
                    font-size: 14px;
                    line-height: 1.5;
                    border-left: 3px solid #0366d6;
                }
                
                .performance-info {
                    background: #f6f8fa;
                    padding: 20px;
                    border-radius: 6px;
                }
                
                .perf-metric {
                    margin-bottom: 16px;
                }
                
                .perf-metric label {
                    font-weight: 500;
                    color: #586069;
                    display: inline-block;
                    width: 120px;
                }
                
                .perf-value {
                    font-weight: 600;
                    color: #24292e;
                }
                
                .perf-value.low { color: #28a745; }
                .perf-value.medium { color: #fb8500; }
                .perf-value.high { color: #d73a49; }
                
                .perf-recommendation {
                    margin-top: 8px;
                    line-height: 1.5;
                    color: #24292e;
                }
                
                .config-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #e1e4e8;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }
                
                .btn {
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid transparent;
                }
                
                .btn-secondary {
                    background: white;
                    color: #24292e;
                    border-color: #e1e4e8;
                }
                
                .btn-secondary:hover {
                    background: #f6f8fa;
                }
                
                .btn-primary {
                    background: #0366d6;
                    color: white;
                }
                
                .btn-primary:hover {
                    background: #0256c7;
                }
                
                .required-field::after {
                    content: ' *';
                    color: #d73a49;
                }
            `;
            document.head.appendChild(styles);
        }
    };

    // Helper function to create form fields
    function createField(field) {
        const requiredClass = field.required ? 'required-field' : '';
        let fieldHtml = `<div class="config-field">`;
        fieldHtml += `<label class="${requiredClass}">${field.label}</label>`;
        
        switch(field.type) {
            case 'text':
                fieldHtml += `<input type="text" name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
                break;
            case 'number':
                fieldHtml += `<input type="number" name="${field.name}" min="${field.min || ''}" max="${field.max || ''}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>`;
                break;
            case 'select':
                fieldHtml += `<select name="${field.name}" ${field.required ? 'required' : ''}>`;
                fieldHtml += `<option value="">Select ${field.label}</option>`;
                if (field.options) {
                    field.options.forEach(option => {
                        fieldHtml += `<option value="${option}">${option}</option>`;
                    });
                }
                fieldHtml += `</select>`;
                break;
            case 'checkbox':
                fieldHtml += `<input type="checkbox" name="${field.name}" ${field.checked ? 'checked' : ''}>`;
                break;
            case 'textarea':
                fieldHtml += `<textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>`;
                break;
            case 'datetime':
                fieldHtml += `<input type="datetime-local" name="${field.name}" ${field.required ? 'required' : ''}>`;
                break;
        }
        
        if (field.tip) {
            fieldHtml += `<div class="field-tip">💡 ${field.tip}</div>`;
        }
        
        fieldHtml += `</div>`;
        return fieldHtml;
    }

    // Switch configuration tabs
    window.switchConfigTab = function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.config-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.config-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`${tabName}-tab`).style.display = 'block';
    };

    // Close configuration modal
    window.closeConfigModal = function() {
        const modal = document.getElementById('configModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
    };

    // Save configuration
    window.saveConfiguration = function() {
        const form = document.getElementById('configForm');
        const formData = new FormData(form);
        const config = {};
        
        for (let [key, value] of formData.entries()) {
            config[key] = value;
        }
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'config-toast';
        toast.textContent = '✅ Configuration saved successfully';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10001;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
        closeConfigModal();
        
        // Update flow data bridge if available
        if (window.FlowDataBridge) {
            window.FlowDataBridge.save();
        }
    };

    // Generic configuration for undefined types
    window.showGenericConfiguration = function(element, type) {
        alert(`Configuration for "${type}" coming soon!\n\nBest Practice: Always configure your triggers and actions for optimal performance.`);
    };

    // Initialise configuration system
    window.initConfigurationSystem = function() {
        console.log('Power Automate Configuration System initialised - UK English');
    };

    // Auto-initialise
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConfigurationSystem);
    } else {
        initConfigurationSystem();
    }

})();