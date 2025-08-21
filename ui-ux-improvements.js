// Enhanced UI/UX Improvements for Flow Builder
// This script adds better animations, visual feedback, and user experience enhancements

(function() {
    'use strict';

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add ripple effect to buttons
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .action-item, .flow-node');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size/2;
                const y = e.clientY - rect.top - size/2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // Enhanced drag feedback
    function enhanceDragAndDrop() {
        let dragGhost = null;
        
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('action-item')) {
                // Create custom drag image
                dragGhost = e.target.cloneNode(true);
                dragGhost.style.position = 'fixed';
                dragGhost.style.pointerEvents = 'none';
                dragGhost.style.opacity = '0.8';
                dragGhost.style.transform = 'rotate(2deg) scale(1.05)';
                dragGhost.style.zIndex = '10000';
                dragGhost.style.transition = 'none';
                document.body.appendChild(dragGhost);
                
                e.dataTransfer.setDragImage(dragGhost, e.offsetX, e.offsetY);
                
                // Add dragging class to body
                document.body.classList.add('is-dragging');
                
                // Highlight drop zones
                document.querySelectorAll('.add-node-btn').forEach(zone => {
                    zone.classList.add('drop-zone-highlight');
                });
            }
        });
        
        document.addEventListener('dragend', () => {
            if (dragGhost) {
                dragGhost.remove();
                dragGhost = null;
            }
            document.body.classList.remove('is-dragging');
            document.querySelectorAll('.drop-zone-highlight').forEach(zone => {
                zone.classList.remove('drop-zone-highlight');
            });
        });
    }

    // Auto-save indicator
    function addAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.innerHTML = '<span class="save-icon">💾</span> <span class="save-text">All changes saved</span>';
        document.body.appendChild(indicator);
        
        // Simulate auto-save
        let saveTimeout;
        document.addEventListener('change', () => {
            indicator.querySelector('.save-text').textContent = 'Saving...';
            indicator.classList.add('saving');
            
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                indicator.querySelector('.save-text').textContent = 'All changes saved';
                indicator.classList.remove('saving');
            }, 1000);
        });
    }

    // Keyboard shortcuts
    function addKeyboardShortcuts() {
        const shortcuts = {
            'ctrl+s': () => saveFlow(),
            'ctrl+z': () => undo(),
            'ctrl+y': () => redo(),
            'ctrl+d': () => duplicateSelected(),
            'delete': () => deleteSelected(),
            'escape': () => deselectAll(),
            'ctrl+a': () => selectAll(),
            'ctrl+/': () => toggleHelp()
        };
        
        document.addEventListener('keydown', (e) => {
            const key = `${e.ctrlKey ? 'ctrl+' : ''}${e.key.toLowerCase()}`;
            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        });
        
        // Show shortcuts hint
        const shortcutHint = document.createElement('div');
        shortcutHint.className = 'shortcut-hint';
        shortcutHint.innerHTML = 'Press <kbd>Ctrl</kbd> + <kbd>/</kbd> for keyboard shortcuts';
        document.body.appendChild(shortcutHint);
        
        setTimeout(() => {
            shortcutHint.style.opacity = '0';
            setTimeout(() => shortcutHint.remove(), 500);
        }, 5000);
    }

    // Improved tooltips
    function enhanceTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[title], .metric, .badge, .action-icon');
        
        elementsWithTooltips.forEach(element => {
            let tooltip = null;
            let tooltipTimeout = null;
            
            element.addEventListener('mouseenter', (e) => {
                const text = element.getAttribute('title') || element.dataset.tooltip || getTooltipText(element);
                if (!text) return;
                
                tooltipTimeout = setTimeout(() => {
                    tooltip = document.createElement('div');
                    tooltip.className = 'enhanced-tooltip';
                    tooltip.textContent = text;
                    document.body.appendChild(tooltip);
                    
                    const rect = element.getBoundingClientRect();
                    tooltip.style.left = rect.left + rect.width/2 - tooltip.offsetWidth/2 + 'px';
                    tooltip.style.top = rect.bottom + 8 + 'px';
                    
                    // Adjust if tooltip goes off screen
                    const tooltipRect = tooltip.getBoundingClientRect();
                    if (tooltipRect.right > window.innerWidth) {
                        tooltip.style.left = window.innerWidth - tooltipRect.width - 10 + 'px';
                    }
                    if (tooltipRect.left < 0) {
                        tooltip.style.left = '10px';
                    }
                    
                    tooltip.classList.add('show');
                }, 500);
            });
            
            element.addEventListener('mouseleave', () => {
                clearTimeout(tooltipTimeout);
                if (tooltip) {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        tooltip?.remove();
                        tooltip = null;
                    }, 200);
                }
            });
        });
    }

    function getTooltipText(element) {
        if (element.classList.contains('badge-standard')) return 'No additional licensing required';
        if (element.classList.contains('badge-premium')) return 'Requires Premium license - £12.20/user/month';
        if (element.classList.contains('badge-performance')) return 'Performance optimization available';
        if (element.classList.contains('icon-trigger')) return 'Drag to start your flow';
        if (element.classList.contains('icon-action')) return 'Drag to add this action';
        return null;
    }

    // Progress indicator for flow testing
    function addTestProgressIndicator() {
        window.testFlow = function() {
            const progressBar = document.createElement('div');
            progressBar.className = 'test-progress-bar';
            progressBar.innerHTML = `
                <div class="test-progress-header">
                    <span>Testing Flow...</span>
                    <span class="test-progress-close">×</span>
                </div>
                <div class="test-progress-track">
                    <div class="test-progress-fill"></div>
                </div>
                <div class="test-progress-status">Initializing...</div>
            `;
            document.body.appendChild(progressBar);
            
            const steps = [
                'Validating connections...',
                'Checking trigger configuration...',
                'Testing action 1: Get items...',
                'Testing action 2: Send email...',
                'Analyzing performance...',
                'Generating report...'
            ];
            
            let currentStep = 0;
            const interval = setInterval(() => {
                if (currentStep < steps.length) {
                    progressBar.querySelector('.test-progress-status').textContent = steps[currentStep];
                    progressBar.querySelector('.test-progress-fill').style.width = 
                        ((currentStep + 1) / steps.length * 100) + '%';
                    currentStep++;
                } else {
                    clearInterval(interval);
                    progressBar.querySelector('.test-progress-status').textContent = '✅ Test completed successfully!';
                    progressBar.querySelector('.test-progress-fill').style.background = 'var(--ms-green)';
                    
                    setTimeout(() => {
                        progressBar.style.opacity = '0';
                        setTimeout(() => progressBar.remove(), 500);
                    }, 2000);
                }
            }, 800);
            
            progressBar.querySelector('.test-progress-close').addEventListener('click', () => {
                clearInterval(interval);
                progressBar.remove();
            });
        };
    }

    // Contextual help system
    function addContextualHelp() {
        const helpButton = document.createElement('button');
        helpButton.className = 'contextual-help-btn';
        helpButton.innerHTML = '?';
        helpButton.title = 'Get help for this section';
        
        document.querySelectorAll('.palette-section, .sidebar-content > div').forEach(section => {
            const helpBtn = helpButton.cloneNode(true);
            section.style.position = 'relative';
            section.appendChild(helpBtn);
            
            helpBtn.addEventListener('click', () => {
                showContextualHelp(section);
            });
        });
    }

    function showContextualHelp(section) {
        const helpContent = getHelpContent(section);
        const helpModal = document.createElement('div');
        helpModal.className = 'help-modal';
        helpModal.innerHTML = `
            <div class="help-modal-content">
                <div class="help-modal-header">
                    <h3>${helpContent.title}</h3>
                    <span class="help-modal-close">×</span>
                </div>
                <div class="help-modal-body">
                    ${helpContent.content}
                </div>
            </div>
        `;
        document.body.appendChild(helpModal);
        
        setTimeout(() => helpModal.classList.add('show'), 10);
        
        helpModal.querySelector('.help-modal-close').addEventListener('click', () => {
            helpModal.classList.remove('show');
            setTimeout(() => helpModal.remove(), 300);
        });
    }

    function getHelpContent(section) {
        const title = section.querySelector('.palette-title')?.textContent || 'Help';
        let content = '';
        
        if (title.includes('TRIGGERS')) {
            content = `
                <p><strong>Triggers start your flow.</strong></p>
                <ul>
                    <li>Choose triggers based on your data source</li>
                    <li>Green badges = Standard (free)</li>
                    <li>Red badges = Premium (paid)</li>
                    <li>Add trigger conditions to filter when flows run</li>
                </ul>
                <p><em>Tip: Use recurrence for scheduled tasks, or manual trigger for testing.</em></p>
            `;
        } else if (title.includes('SHAREPOINT')) {
            content = `
                <p><strong>SharePoint actions work with lists and libraries.</strong></p>
                <ul>
                    <li>Always use OData filters for better performance</li>
                    <li>Limit items retrieved with Top Count</li>
                    <li>Use Select to get only needed columns</li>
                    <li>Consider pagination for large datasets</li>
                </ul>
                <p><em>Best practice: Filter at source, not after retrieval!</em></p>
            `;
        } else {
            content = '<p>Drag and drop actions to build your flow. Click on actions to configure them.</p>';
        }
        
        return { title, content };
    }

    // Initialize all enhancements
    function initialize() {
        addRippleEffect();
        enhanceDragAndDrop();
        addAutoSaveIndicator();
        addKeyboardShortcuts();
        enhanceTooltips();
        addTestProgressIndicator();
        addContextualHelp();
        
        // Add enhancement styles
        const style = document.createElement('style');
        style.textContent = `
            /* Ripple Effect */
            .btn, .action-item, .flow-node {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Drag and Drop Enhancements */
            body.is-dragging {
                cursor: grabbing !important;
            }
            
            .drop-zone-highlight {
                animation: pulse-highlight 1s infinite;
                background: var(--success-bg) !important;
                border-color: var(--ms-green) !important;
            }
            
            @keyframes pulse-highlight {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            
            /* Auto-save Indicator */
            .auto-save-indicator {
                position: fixed;
                top: 20px;
                right: 400px;
                background: white;
                padding: 8px 16px;
                border-radius: 20px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                z-index: 1000;
                transition: all 0.3s;
            }
            
            .auto-save-indicator.saving .save-icon {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* Keyboard Shortcut Hint */
            .shortcut-hint {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--ms-gray-130);
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                transition: opacity 0.5s;
            }
            
            kbd {
                background: rgba(255,255,255,0.2);
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
            }
            
            /* Enhanced Tooltips */
            .enhanced-tooltip {
                position: fixed;
                background: var(--ms-gray-130);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 10001;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
                max-width: 250px;
                line-height: 1.4;
            }
            
            .enhanced-tooltip.show {
                opacity: 1;
            }
            
            .enhanced-tooltip::before {
                content: '';
                position: absolute;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                width: 8px;
                height: 8px;
                background: var(--ms-gray-130);
                transform: rotate(45deg);
            }
            
            /* Test Progress Bar */
            .test-progress-bar {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                padding: 24px;
                width: 400px;
                z-index: 10000;
                transition: opacity 0.5s;
            }
            
            .test-progress-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                font-weight: 600;
            }
            
            .test-progress-close {
                cursor: pointer;
                font-size: 24px;
                line-height: 1;
                color: var(--ms-gray-90);
            }
            
            .test-progress-track {
                height: 8px;
                background: var(--ms-gray-30);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 12px;
            }
            
            .test-progress-fill {
                height: 100%;
                background: var(--ms-blue);
                border-radius: 4px;
                transition: width 0.5s ease, background 0.3s;
                width: 0;
            }
            
            .test-progress-status {
                font-size: 13px;
                color: var(--ms-gray-90);
            }
            
            /* Contextual Help */
            .contextual-help-btn {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--ms-gray-40);
                color: var(--ms-gray-90);
                border: none;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                opacity: 0.5;
                transition: all 0.2s;
            }
            
            .contextual-help-btn:hover {
                opacity: 1;
                background: var(--ms-blue);
                color: white;
            }
            
            .help-modal {
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
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .help-modal.show {
                opacity: 1;
            }
            
            .help-modal-content {
                background: white;
                border-radius: 8px;
                width: 500px;
                max-width: 90%;
                max-height: 80vh;
                overflow: auto;
                transform: scale(0.9);
                transition: transform 0.3s;
            }
            
            .help-modal.show .help-modal-content {
                transform: scale(1);
            }
            
            .help-modal-header {
                padding: 20px;
                border-bottom: 1px solid var(--ms-gray-30);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .help-modal-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .help-modal-close {
                cursor: pointer;
                font-size: 24px;
                line-height: 1;
                color: var(--ms-gray-90);
            }
            
            .help-modal-body {
                padding: 20px;
                line-height: 1.6;
            }
            
            .help-modal-body ul {
                margin: 12px 0;
                padding-left: 24px;
            }
            
            .help-modal-body li {
                margin: 6px 0;
            }
            
            /* Smooth animations for all elements */
            * {
                transition: background-color 0.2s, border-color 0.2s, transform 0.2s;
            }
        `;
        document.head.appendChild(style);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();