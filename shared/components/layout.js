// Layout and navigation management
const Layout = {
    // Initialize the main application
    init: () => {
        Layout.setupSearch();
        Layout.setupNavigation();
        Layout.loadTools();
        Layout.setupModal();
        Layout.setupKeyboardShortcuts();
    },
    
    // Setup search functionality
    setupSearch: () => {
        const searchInput = document.getElementById('searchTools');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            Layout.filterTools(searchTerm);
        });
        
        // Search suggestions
        searchInput.addEventListener('focus', () => {
            Layout.showSearchSuggestions();
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target)) {
                Layout.hideSearchSuggestions();
            }
        });
    },
    
    // Filter tools based on search term
    filterTools: (searchTerm) => {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            const title = card.querySelector('.tool-title').textContent.toLowerCase();
            const description = card.querySelector('.tool-description').textContent.toLowerCase();
            const category = card.dataset.category.toLowerCase();
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          category.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
        });
        
        Layout.updateResultCount(searchTerm);
    },
    
    // Update result count
    updateResultCount: (searchTerm) => {
        const visibleCards = document.querySelectorAll('.tool-card[style="display: block"], .tool-card:not([style*="display: none"])');
        const count = visibleCards.length;
        
        let resultText = document.querySelector('.search-results-count');
        if (!resultText) {
            resultText = document.createElement('div');
            resultText.className = 'search-results-count text-sm text-gray-600 mb-4';
            document.getElementById('toolsGrid').parentNode.insertBefore(resultText, document.getElementById('toolsGrid'));
        }
        
        if (searchTerm) {
            resultText.textContent = `${count} tool${count !== 1 ? 's' : ''} found for "${searchTerm}"`;
            resultText.style.display = 'block';
        } else {
            resultText.style.display = 'none';
        }
    },
    
    // Setup category navigation
    setupNavigation: () => {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('border-blue-500', 'text-blue-600'));
                navLinks.forEach(l => l.classList.add('border-transparent', 'text-gray-500'));
                
                link.classList.remove('border-transparent', 'text-gray-500');
                link.classList.add('border-blue-500', 'text-blue-600');
                
                // Filter tools by category
                const category = link.dataset.category;
                if (category) {
                    Layout.filterByCategory(category);
                } else {
                    Layout.showAllTools();
                }
            });
        });
    },
    
    // Filter tools by category
    filterByCategory: (category) => {
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
            if (card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Clear search
        const searchInput = document.getElementById('searchTools');
        if (searchInput) {
            searchInput.value = '';
        }
        
        Layout.updateResultCount('');
    },
    
    // Show all tools
    showAllTools: () => {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.style.display = 'block';
        });
        
        Layout.updateResultCount('');
    },
    
    // Load and display tools
    loadTools: () => {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        toolsGrid.innerHTML = '';
        
        // Get tools from ToolRegistry (will be defined later)
        if (typeof ToolRegistry !== 'undefined') {
            const tools = ToolRegistry.getAllTools();
            
            tools.forEach(tool => {
                const toolCard = Layout.createToolCard(tool);
                toolsGrid.appendChild(toolCard);
            });
        } else {
            // Placeholder content while tools are being developed
            toolsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-4xl mb-4">🚧</div>
                    <h3 class="text-xl font-semibold mb-2">Tools Loading...</h3>
                    <p class="text-gray-600">The toolkit is being built. Tools will appear here as they're completed.</p>
                </div>
            `;
        }
    },
    
    // Create tool card element
    createToolCard: (tool) => {
        const card = document.createElement('div');
        card.className = 'tool-card bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer';
        card.dataset.category = tool.category;
        card.dataset.toolId = tool.id;
        
        card.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="text-2xl">${tool.icon}</div>
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${tool.category}</span>
            </div>
            <h3 class="tool-title font-semibold text-gray-900 mb-2">${tool.name}</h3>
            <p class="tool-description text-sm text-gray-600 mb-4">${tool.description}</p>
            <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                    ${tool.premium ? '💎 Premium Alternative' : '🆓 Free'}
                </div>
                <button class="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Open →
                </button>
            </div>
        `;
        
        card.addEventListener('click', () => {
            Layout.openTool(tool);
        });
        
        return card;
    },
    
    // Open tool in modal
    openTool: (tool) => {
        const modal = document.getElementById('toolModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        if (!modal || !modalTitle || !modalContent) return;
        
        modalTitle.textContent = tool.name;
        
        // Clear previous content
        modalContent.innerHTML = '';
        
        // Create tool interface
        if (typeof tool.render === 'function') {
            const toolInterface = tool.render();
            modalContent.appendChild(toolInterface);
        } else {
            modalContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-4xl mb-4">${tool.icon}</div>
                    <h3 class="text-lg font-semibold mb-2">${tool.name}</h3>
                    <p class="text-gray-600 mb-4">${tool.description}</p>
                    <p class="text-sm text-gray-500">This tool is under development.</p>
                </div>
            `;
        }
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Track tool usage
        if (typeof Storage !== 'undefined') {
            Storage.setPreference('lastUsedTool', tool.id);
        }
    },
    
    // Setup modal functionality
    setupModal: () => {
        const modal = document.getElementById('toolModal');
        const closeBtn = document.getElementById('closeModal');
        
        if (!modal || !closeBtn) return;
        
        // Close button
        closeBtn.addEventListener('click', () => {
            Layout.closeModal();
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                Layout.closeModal();
            }
        });
    },
    
    // Close modal
    closeModal: () => {
        const modal = document.getElementById('toolModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts: () => {
        document.addEventListener('keydown', (e) => {
            // ESC to close modal
            if (e.key === 'Escape') {
                Layout.closeModal();
            }
            
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchTools');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }
            
            // Ctrl/Cmd + / to show shortcuts help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                Layout.showShortcutsHelp();
            }
        });
    },
    
    // Show keyboard shortcuts help
    showShortcutsHelp: () => {
        const shortcuts = `
            <div class="space-y-4">
                <h3 class="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                <div class="grid grid-cols-1 gap-3">
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-700">Search tools</span>
                        <kbd class="px-2 py-1 bg-gray-100 text-xs font-mono rounded">Ctrl/⌘ + K</kbd>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-700">Close modal</span>
                        <kbd class="px-2 py-1 bg-gray-100 text-xs font-mono rounded">Esc</kbd>
                    </div>
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-700">Show this help</span>
                        <kbd class="px-2 py-1 bg-gray-100 text-xs font-mono rounded">Ctrl/⌘ + /</kbd>
                    </div>
                    <div class="flex items-center justify-between py-2">
                        <span class="text-gray-700">Copy result</span>
                        <kbd class="px-2 py-1 bg-gray-100 text-xs font-mono rounded">Ctrl/⌘ + C</kbd>
                    </div>
                </div>
            </div>
        `;
        
        UI.createModal('Keyboard Shortcuts', shortcuts);
    },
    
    // Search suggestions
    showSearchSuggestions: () => {
        // Popular tools or recent searches
        const suggestions = [
            'tip calculator',
            'password generator',
            'unit converter',
            'color picker',
            'qr code generator'
        ];
        
        // Implementation would show these as dropdown suggestions
    },
    
    hideSearchSuggestions: () => {
        // Hide search suggestions dropdown
    },
    
    // Responsive utilities
    isMobile: () => window.innerWidth < 768,
    isTablet: () => window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: () => window.innerWidth >= 1024,
    
    // Update layout for different screen sizes
    updateLayout: () => {
        const sidebar = document.querySelector('aside');
        const main = document.querySelector('main');
        
        if (!sidebar || !main) return;
        
        if (Layout.isMobile()) {
            // Mobile layout adjustments
            sidebar.classList.add('hidden', 'md:block');
        } else {
            sidebar.classList.remove('hidden');
        }
    }
};

// Initialize layout when DOM is ready
function initializeApp() {
    Layout.init();
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(Layout.updateLayout, 150);
    });
    
    // Initial layout update
    Layout.updateLayout();
}

// Export for global use
if (typeof window !== 'undefined') {
    window.Layout = Layout;
}