// Main application initialization and styling utilities
const App = {
    init: () => {
        // Add dynamic styles for better UX
        App.addDynamicStyles();
        
        // Initialize layout
        if (typeof Layout !== 'undefined') {
            Layout.init();
        }
        
        // Load tools into the interface
        App.loadTools();
        
        // Setup tool categories
        App.updateCategoryNavigation();
    },
    
    addDynamicStyles: () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Smooth transitions */
            .tool-card {
                transition: all 0.2s ease-in-out;
            }
            
            .tool-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            /* Search result highlighting */
            .search-highlight {
                background-color: yellow;
                padding: 1px 2px;
                border-radius: 2px;
            }
            
            /* Loading animations */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .tool-card {
                animation: fadeIn 0.3s ease-out;
            }
            
            /* Modal animations */
            #toolModal {
                animation: modalFadeIn 0.2s ease-out;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            #toolModal > div {
                animation: modalSlideIn 0.2s ease-out;
            }
            
            @keyframes modalSlideIn {
                from { transform: scale(0.9) translateY(10px); opacity: 0; }
                to { transform: scale(1) translateY(0); opacity: 1; }
            }
            
            /* Focus styles */
            .focus-visible {
                outline: 2px solid #3B82F6;
                outline-offset: 2px;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .tool-card {
                    padding: 1rem;
                }
                
                aside {
                    position: fixed;
                    top: 0;
                    left: -100%;
                    height: 100vh;
                    background: white;
                    z-index: 40;
                    transition: left 0.3s ease;
                    width: 280px;
                }
                
                aside.open {
                    left: 0;
                }
                
                .mobile-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 39;
                }
            }
            
            /* Print styles */
            @media print {
                aside, header, .result-actions {
                    display: none !important;
                }
                
                main {
                    margin: 0 !important;
                    max-width: none !important;
                }
            }
            
            /* Dark mode support (user preference) */
            @media (prefers-color-scheme: dark) {
                .tool-card {
                    background: #1f2937;
                    border-color: #374151;
                    color: #f9fafb;
                }
                
                .tool-description {
                    color: #d1d5db;
                }
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .tool-card {
                    border-width: 2px;
                }
                
                button {
                    border-width: 2px;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                * {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);
    },
    
    loadTools: () => {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        const tools = ToolRegistry.getAllTools();
        
        if (tools.length === 0) {
            App.showEmptyState(toolsGrid);
            return;
        }
        
        // Clear loading state
        toolsGrid.innerHTML = '';
        
        // Add tools with staggered animation
        tools.forEach((tool, index) => {
            setTimeout(() => {
                const toolCard = App.createToolCard(tool);
                toolsGrid.appendChild(toolCard);
            }, index * 50);
        });
        
        // Update stats
        App.updateStats();
    },
    
    showEmptyState: (container) => {
        container.innerHTML = `
            <div class="col-span-full text-center py-16">
                <div class="text-8xl mb-6 animate-pulse">🛠️</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Building Amazing Tools</h2>
                <p class="text-gray-600 mb-6 max-w-2xl mx-auto">
                    We're creating 140+ free static tools to replace expensive SaaS subscriptions. 
                    Each tool runs entirely in your browser - no data sent to servers, no sign-ups required.
                </p>
                <div class="bg-white border rounded-lg p-6 max-w-md mx-auto shadow-sm">
                    <div class="text-sm font-medium text-gray-900 mb-3">Development Progress</div>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-3">
                        <div class="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000" style="width: 25%"></div>
                    </div>
                    <div class="text-xs text-gray-600">
                        ✅ Foundation Complete<br>
                        🚧 Building Core Tools<br>
                        📅 Full Launch: 48 Hours
                    </div>
                </div>
            </div>
        `;
    },
    
    createToolCard: (tool) => {
        const card = document.createElement('div');
        card.className = 'tool-card bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer';
        card.dataset.category = tool.category;
        card.dataset.toolId = tool.id;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open ${tool.name} tool`);
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-4">
                <div class="text-3xl" role="img" aria-label="${tool.name} icon">${tool.icon}</div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">${tool.category}</span>
            </div>
            <h3 class="tool-title font-semibold text-gray-900 mb-2 text-lg">${tool.name}</h3>
            <p class="tool-description text-sm text-gray-600 mb-4 line-clamp-2">${tool.description}</p>
            <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 flex items-center">
                    ${tool.premium ? '💎 Premium Alternative' : '🆓 Free Tool'}
                </div>
                <div class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                    Open <span class="ml-1">→</span>
                </div>
            </div>
        `;
        
        // Click handler
        const openTool = () => {
            if (typeof Layout !== 'undefined' && Layout.openTool) {
                Layout.openTool(tool);
            }
        };
        
        card.addEventListener('click', openTool);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTool();
            }
        });
        
        return card;
    },
    
    updateCategoryNavigation: () => {
        const categories = ToolRegistry.getCategories();
        const counts = ToolRegistry.getCategoryCounts();
        
        // Update category links with counts
        categories.forEach(category => {
            const link = document.querySelector(`[data-category="${category}"]`);
            if (link) {
                const count = counts[category];
                const originalText = link.textContent;
                link.innerHTML = `${originalText} <span class="text-xs opacity-60">(${count})</span>`;
            }
        });
    },
    
    updateStats: () => {
        const totalTools = ToolRegistry.getCount();
        const categories = ToolRegistry.getCategories().length;
        
        // Update header subtitle with stats
        const subtitle = document.querySelector('header p');
        if (subtitle) {
            subtitle.textContent = `${totalTools} Free Static Tools • ${categories} Categories`;
        }
    },
    
    // Utility functions
    utils: {
        // Debounce function for search
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Check if device has touch support
        isTouchDevice: () => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },
        
        // Get browser info
        getBrowserInfo: () => {
            const ua = navigator.userAgent;
            return {
                isChrome: ua.includes('Chrome'),
                isFirefox: ua.includes('Firefox'),
                isSafari: ua.includes('Safari') && !ua.includes('Chrome'),
                isEdge: ua.includes('Edge')
            };
        },
        
        // Performance monitoring
        measurePerformance: (name, fn) => {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds`);
            return result;
        }
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}

// Export for global use
if (typeof window !== 'undefined') {
    window.App = App;
}