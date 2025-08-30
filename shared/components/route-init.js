/**
 * Route Initialization
 * Sets up all routes and initializes the router system
 */

class RouteInitializer {
    constructor() {
        this.router = new UtilityRouter(false); // Don't auto-initialize
        this.pageGenerator = new PageGenerator();
        
        this.initializeRoutes();
        this.setupGlobalEventHandlers();
        
        // Initialize router after all routes are set up
        this.router.init();
    }
    
    initializeRoutes() {
        // Homepage route
        this.router.addRoute('/', this.createHomepage.bind(this), {
            title: 'Utility Toolkit - 149+ Free Static Tools',
            description: 'Replace expensive SaaS subscriptions with 149+ free, privacy-focused, client-side utility tools. No data collection, no sign-ups, no servers required.',
            keywords: 'calculator, converter, utility tools, free tools, client-side tools, privacy-focused, no signup'
        });
        
        // Category routes
        this.setupCategoryRoutes();
        
        // Individual tool routes
        this.setupToolRoutes();
        
        // Special routes
        this.setupSpecialRoutes();
    }
    
    setupCategoryRoutes() {
        const categories = this.getCategories();
        
        categories.forEach(category => {
            this.router.addRoute(`/category/${category.name}`, (container) => {
                container.innerHTML = this.pageGenerator.generateCategoryPage(category.name, category.tools);
                this.initializeMobileMenu();
            }, {
                title: `${category.displayName} - Utility Toolkit`,
                description: `${category.tools.length} ${category.displayName.toLowerCase()} to boost your productivity. Free, privacy-focused, client-side tools.`,
                keywords: `${category.displayName.toLowerCase()}, ${category.name}, utility tools, free tools`,
                category: category.name
            });
        });
    }
    
    setupToolRoutes() {
        const tools = Array.from(ToolRegistry.tools.values());
        
        tools.forEach(tool => {
            const route = `/tools/${tool.category}/${tool.id}`;
            
            this.router.addRoute(route, (container) => {
                container.innerHTML = this.pageGenerator.generateToolPage(tool);
                this.initializeToolPage();
                this.initializeMobileMenu();
            }, {
                title: `${tool.name} - Utility Toolkit`,
                description: tool.description,
                keywords: `${tool.name}, ${tool.category}, calculator, converter, tool, utility`,
                category: tool.category,
                icon: tool.icon
            });
        });
    }
    
    setupSpecialRoutes() {
        // 404 Page
        this.router.addRoute('/404', (container) => {
            container.innerHTML = this.create404Page();
            this.initializeMobileMenu();
        }, {
            title: 'Page Not Found - Utility Toolkit',
            description: 'The page you are looking for could not be found.'
        });
        
        // Sitemap
        this.router.addRoute('/sitemap', (container) => {
            container.innerHTML = this.createSitemapPage();
            this.initializeMobileMenu();
        }, {
            title: 'Sitemap - Utility Toolkit',
            description: 'Complete list of all 149+ utility tools available in the toolkit.'
        });
        
        // Search results
        this.router.addRoute('/search', (container) => {
            let query = '';
            try {
                // Use URLSearchParams with fallback for older browsers
                if (typeof URLSearchParams !== 'undefined') {
                    query = new URLSearchParams(window.location.search).get('q') || '';
                } else {
                    // Fallback for older browsers
                    const params = window.location.search.substring(1).split('&');
                    for (let param of params) {
                        const [key, value] = param.split('=');
                        if (key === 'q') {
                            query = decodeURIComponent(value || '');
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn('Error parsing search query:', e);
                query = '';
            }
            
            container.innerHTML = this.createSearchPage(query);
            this.initializeMobileMenu();
        }, {
            title: 'Search Results - Utility Toolkit',
            description: 'Search results for utility tools.'
        });
    }
    
    getCategories() {
        const tools = Array.from(ToolRegistry.tools.values());
        const categoryMap = new Map();
        
        tools.forEach(tool => {
            if (!categoryMap.has(tool.category)) {
                categoryMap.set(tool.category, []);
            }
            categoryMap.get(tool.category).push(tool);
        });
        
        const categoryNames = {
            'calculators': 'Calculators',
            'converters': 'Converters',
            'generators': 'Generators',
            'utilities': 'Text & Utilities',
            'design': 'Design Tools',
            'visualization': 'Charts & Visualization',
            'media': 'Image Tools',
            'business': 'Business Tools'
        };
        
        return Array.from(categoryMap.entries()).map(([category, tools]) => ({
            name: category,
            displayName: categoryNames[category] || category,
            tools: tools,
            count: tools.length
        }));
    }
    
    createHomepage(container) {
        const categories = this.getCategories();
        const totalTools = categories.reduce((sum, cat) => sum + cat.count, 0);
        
        const homepage = `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <!-- Hero Header -->
            <header class="relative">
                <!-- Navigation -->
                <nav class="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
                    <div class="max-w-7xl mx-auto px-4 py-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-3xl">🛠️</span>
                                <div>
                                    <h1 class="text-xl font-bold text-gray-900">Utility Toolkit</h1>
                                    <p class="text-sm text-gray-600">${totalTools}+ Free Tools</p>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="relative">
                                    <input 
                                        type="search" 
                                        id="searchTools" 
                                        placeholder="Search tools..." 
                                        class="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                    <svg class="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                                <button id="mobile-menu-toggle" class="md:hidden p-2">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                
                <!-- Hero Section -->
                <div class="max-w-7xl mx-auto px-4 pt-16 pb-24">
                    <div class="text-center">
                        <div class="text-6xl mb-6">🛠️</div>
                        <h1 class="text-5xl font-bold text-gray-900 mb-6">
                            Replace Expensive SaaS with
                            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                149+ Free Tools
                            </span>
                        </h1>
                        <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Privacy-focused, client-side utility tools. No data collection, no sign-ups, no servers required. 
                            All calculations run in your browser.
                        </p>
                        <div class="flex flex-wrap justify-center gap-4 mb-12">
                            <div class="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-medium">100% Client-Side</span>
                            </div>
                            <div class="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-medium">Privacy Focused</span>
                            </div>
                            <div class="flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-medium">Works Offline</span>
                            </div>
                            <div class="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"></path>
                                </svg>
                                <span class="font-medium">Free Forever</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Tool Categories -->
            <main class="max-w-7xl mx-auto px-4 pb-20">
                <!-- Quick Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    ${categories.map(category => `
                        <div class="text-center">
                            <div class="text-3xl font-bold text-blue-600">${category.count}</div>
                            <div class="text-gray-600">${category.displayName}</div>
                        </div>
                    `).join('')}
                </div>
                
                <!-- Categories Grid -->
                <div class="space-y-16">
                    ${categories.map(category => `
                        <section>
                            <div class="flex items-center justify-between mb-8">
                                <h2 class="text-3xl font-bold text-gray-900">${category.displayName}</h2>
                                <a href="/category/${category.name}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                    View All ${category.count}
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                ${category.tools.slice(0, 8).map(tool => `
                                    <div class="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                        <div class="p-6">
                                            <div class="text-3xl mb-3">${tool.icon || '🛠️'}</div>
                                            <h3 class="text-lg font-semibold text-gray-900 mb-2">${tool.name}</h3>
                                            <p class="text-gray-600 text-sm mb-4 line-clamp-2">${tool.description}</p>
                                            <a href="/tools/${tool.category}/${tool.id}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                                Use Tool
                                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            ${category.tools.length > 8 ? `
                                <div class="text-center mt-8">
                                    <a href="/category/${category.name}" class="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                                        View ${category.tools.length - 8} More Tools
                                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </a>
                                </div>
                            ` : ''}
                        </section>
                    `).join('')}
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-900 text-white">
                <div class="max-w-7xl mx-auto px-4 py-16">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div class="flex items-center space-x-2 mb-6">
                                <span class="text-2xl">🛠️</span>
                                <span class="font-bold text-xl">Utility Toolkit</span>
                            </div>
                            <p class="text-gray-400 mb-6">${totalTools}+ free, privacy-focused utility tools. No data collection, no servers required.</p>
                            <a href="https://github.com/mjtpena/utility-toolkit" target="_blank" class="inline-flex items-center text-gray-400 hover:text-white">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                View on GitHub
                            </a>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-6">Categories</h4>
                            <ul class="space-y-3">
                                ${categories.slice(0, 6).map(category => `
                                    <li><a href="/category/${category.name}" class="text-gray-400 hover:text-white transition-colors">${category.displayName}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-6">Features</h4>
                            <ul class="space-y-3 text-gray-400">
                                <li>100% Client-Side Processing</li>
                                <li>No Data Collection</li>
                                <li>Works Offline</li>
                                <li>Mobile Responsive</li>
                                <li>Open Source</li>
                                <li>Free Forever</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-6">Quick Links</h4>
                            <ul class="space-y-3">
                                <li><a href="/sitemap" class="text-gray-400 hover:text-white transition-colors">All Tools</a></li>
                                <li><a href="https://github.com/mjtpena/utility-toolkit" target="_blank" class="text-gray-400 hover:text-white transition-colors">Source Code</a></li>
                                <li><a href="https://github.com/mjtpena/utility-toolkit/issues" target="_blank" class="text-gray-400 hover:text-white transition-colors">Report Bug</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-gray-800 mt-12 pt-8 text-center">
                        <p class="text-gray-400">&copy; 2024 Utility Toolkit. Open source and free forever.</p>
                    </div>
                </div>
            </footer>
        </div>`;
        
        container.innerHTML = homepage;
        this.initializeMobileMenu();
        this.initializeSearch();
    }
    
    create404Page() {
        return `
        <div class="min-h-screen bg-gray-50 flex items-center justify-center">
            <div class="text-center">
                <div class="text-6xl mb-6">🔍</div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p class="text-gray-600 mb-8">The tool or page you're looking for doesn't exist.</p>
                <a href="/" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Back to Home
                </a>
            </div>
        </div>`;
    }
    
    createSitemapPage() {
        const categories = this.getCategories();
        
        return `
        <div class="min-h-screen bg-gray-50">
            <header class="bg-white shadow-sm">
                <div class="max-w-7xl mx-auto px-4 py-6">
                    <h1 class="text-3xl font-bold text-gray-900">Sitemap</h1>
                    <p class="text-gray-600 mt-2">Complete list of all ${categories.reduce((sum, cat) => sum + cat.count, 0)} utility tools</p>
                </div>
            </header>
            <main class="max-w-7xl mx-auto px-4 py-8">
                ${categories.map(category => `
                    <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                            <a href="/category/${category.name}" class="hover:text-blue-600">
                                ${category.displayName} (${category.count})
                            </a>
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${category.tools.map(tool => `
                                <div class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                                    <span class="text-xl">${tool.icon || '🛠️'}</span>
                                    <a href="/tools/${tool.category}/${tool.id}" class="text-blue-600 hover:text-blue-800 font-medium">
                                        ${tool.name}
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </main>
        </div>`;
    }
    
    createSearchPage(query) {
        const tools = Array.from(ToolRegistry.tools.values());
        const filteredTools = tools.filter(tool => 
            tool.name.toLowerCase().includes(query.toLowerCase()) ||
            tool.description.toLowerCase().includes(query.toLowerCase()) ||
            tool.category.toLowerCase().includes(query.toLowerCase())
        );
        
        return `
        <div class="min-h-screen bg-gray-50">
            <header class="bg-white shadow-sm">
                <div class="max-w-7xl mx-auto px-4 py-6">
                    <h1 class="text-3xl font-bold text-gray-900">Search Results</h1>
                    <p class="text-gray-600 mt-2">${filteredTools.length} results for "${query}"</p>
                </div>
            </header>
            <main class="max-w-7xl mx-auto px-4 py-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${filteredTools.map(tool => `
                        <div class="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div class="p-6">
                                <div class="text-3xl mb-3">${tool.icon || '🛠️'}</div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-2">${tool.name}</h3>
                                <p class="text-gray-600 text-sm mb-4">${tool.description}</p>
                                <a href="/tools/${tool.category}/${tool.id}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                    Use Tool
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${filteredTools.length === 0 ? `
                    <div class="text-center py-12">
                        <div class="text-4xl mb-4">🔍</div>
                        <p class="text-gray-600">No tools found for "${query}". Try a different search term.</p>
                    </div>
                ` : ''}
            </main>
        </div>`;
    }
    
    initializeToolPage() {
        // Already handled in router.js handleToolSubmit method
        // This is a placeholder for additional tool-specific initialization
    }
    
    initializeMobileMenu() {
        const toggleButton = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (toggleButton && mobileMenu) {
            toggleButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
    
    initializeSearch() {
        const searchInput = document.getElementById('searchTools');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.router.navigate(`/search?q=${encodeURIComponent(query)}`);
                    }
                }
            });
        }
    }
    
    setupGlobalEventHandlers() {
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                const searchInput = document.getElementById('searchTools');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
        
        // Handle service worker for offline functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
            });
        }
    }
}

// Initialize routing when DOM is ready and tools are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for tools to be loaded with optimized timing
    const initializeWhenReady = () => {
        if (typeof ToolRegistry !== 'undefined' && ToolRegistry.tools && ToolRegistry.tools.size > 0) {
            window.routeInitializer = new RouteInitializer();
        } else {
            // Use shorter interval for faster initialization
            setTimeout(initializeWhenReady, 25);
        }
    };
    
    initializeWhenReady();
});

console.log('✅ Route Initializer loaded successfully');