/**
 * Client-Side Router for Individual Tool Pages
 * Handles routing to individual tool pages with SEO-friendly URLs
 */

class UtilityRouter {
    constructor(autoInit = true) {
        this.routes = new Map();
        this.currentRoute = null;
        this.defaultRoute = '/';
        
        // Initialize router only if autoInit is true
        if (autoInit) {
            this.init();
        }
    }
    
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            this.navigate(location.pathname, false);
        });
        
        // Handle initial page load with optimized delay
        const initializeRouter = () => {
            // Check if tools are loaded before navigating
            if (typeof ToolRegistry !== 'undefined' && ToolRegistry.tools && ToolRegistry.tools.size > 0) {
                this.navigate(location.pathname, false);
            } else {
                // Retry with shorter interval for faster loading
                setTimeout(initializeRouter, 25);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeRouter);
        } else {
            initializeRouter();
        }
        
        // Intercept all internal links with delegation
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                event.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
    }
    
    // Register a route
    addRoute(path, component, options = {}) {
        this.routes.set(path, {
            component,
            title: options.title || 'Utility Toolkit',
            description: options.description || '',
            keywords: options.keywords || '',
            category: options.category || '',
            icon: options.icon || '🛠️'
        });
    }
    
    // Navigate to a route
    navigate(path, pushState = true) {
        // Handle tool routes that might not be registered yet
        if (path.startsWith('/tools/')) {
            const pathParts = path.split('/');
            if (pathParts.length === 4) {
                const [, , category, toolId] = pathParts;
                // Check if this is a valid tool that just wasn't registered yet
                if (typeof ToolRegistry !== 'undefined' && ToolRegistry.tools) {
                    const tool = ToolRegistry.tools.get(toolId);
                    if (tool && !this.routes.has(path)) {
                        // Tool exists but route wasn't registered yet - redirect to 404 for now
                        console.warn(`Tool exists but route not registered: ${toolId}`);
                        path = '/404';
                    }
                }
            }
        }
        
        const route = this.routes.get(path) || this.routes.get('/404') || this.routes.get('/');
        
        if (!route) {
            console.error(`Route not found: ${path}`);
            return;
        }
        
        this.currentRoute = path;
        
        // Update browser history
        if (pushState) {
            history.pushState({ path }, '', path);
        }
        
        // Update page metadata
        this.updatePageMetadata(route, path);
        
        // Render the component
        this.renderComponent(route.component, path);
        
        // Update navigation active states
        this.updateNavigation(path);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    updatePageMetadata(route, path) {
        // Update document title
        document.title = route.title;
        
        // Update meta description
        this.updateMetaTag('description', route.description);
        
        // Update meta keywords
        this.updateMetaTag('keywords', route.keywords);
        
        // Update Open Graph tags
        this.updateMetaTag('og:title', route.title, 'property');
        this.updateMetaTag('og:description', route.description, 'property');
        this.updateMetaTag('og:url', window.location.origin + path, 'property');
        this.updateMetaTag('og:type', 'website', 'property');
        this.updateMetaTag('og:image', window.location.origin + '/og-image.png', 'property');
        
        // Update Twitter tags
        this.updateMetaTag('twitter:card', 'summary_large_image');
        this.updateMetaTag('twitter:title', route.title);
        this.updateMetaTag('twitter:description', route.description);
        this.updateMetaTag('twitter:image', window.location.origin + '/og-image.png');
        
        // Update canonical URL
        this.updateLinkTag('canonical', window.location.origin + path);
        
        // Update breadcrumb structured data
        this.updateBreadcrumbData(path, route);
    }
    
    updateMetaTag(name, content, attribute = 'name') {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    }
    
    updateLinkTag(rel, href) {
        let tag = document.querySelector(`link[rel="${rel}"]`);
        if (!tag) {
            tag = document.createElement('link');
            tag.setAttribute('rel', rel);
            document.head.appendChild(tag);
        }
        tag.setAttribute('href', href);
    }
    
    updateBreadcrumbData(path, route) {
        const breadcrumbs = this.generateBreadcrumbs(path, route);
        
        // Remove existing breadcrumb structured data
        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Add new breadcrumb structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": breadcrumb.name,
                "item": window.location.origin + breadcrumb.url
            }))
        });
        document.head.appendChild(script);
    }
    
    generateBreadcrumbs(path, route) {
        const breadcrumbs = [{ name: 'Home', url: '/' }];
        
        if (path !== '/') {
            const pathParts = path.split('/').filter(part => part);
            
            if (pathParts[0] === 'tools' && pathParts[1] && pathParts[2]) {
                // Add category breadcrumb
                breadcrumbs.push({
                    name: this.formatCategoryName(pathParts[1]),
                    url: `/category/${pathParts[1]}`
                });
                
                // Add tool breadcrumb
                breadcrumbs.push({
                    name: route.title.replace(' - Utility Toolkit', ''),
                    url: path
                });
            }
        }
        
        return breadcrumbs;
    }
    
    formatCategoryName(category) {
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
        return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    renderComponent(component, path) {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            console.error('App container not found');
            return;
        }
        
        // Show loading state for complex routes
        if (path.startsWith('/tools/')) {
            appContainer.innerHTML = `
                <div class="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div class="text-center">
                        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p class="text-gray-600">Loading tool...</p>
                    </div>
                </div>
            `;
        }
        
        // Use requestAnimationFrame for smoother rendering
        requestAnimationFrame(() => {
            // Render new component
            if (typeof component === 'function') {
                component(appContainer, path);
            } else {
                appContainer.innerHTML = component;
            }
            
            // Re-initialize any dynamic components
            this.initializeDynamicComponents();
        });
    }
    
    initializeDynamicComponents() {
        // Re-initialize tool functionality if on a tool page
        if (this.currentRoute.startsWith('/tools/')) {
            this.initializeToolComponents();
        }
    }
    
    initializeToolComponents() {
        // Initialize form handling
        const forms = document.querySelectorAll('form[data-tool-id]');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleToolSubmit(form);
            });
        });
        
        // Initialize input change handlers
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.handleInputChange(input);
            });
        });
        
        // Initialize copy buttons
        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCopyClick(button);
            });
        });
    }
    
    handleToolSubmit(form) {
        const toolId = form.getAttribute('data-tool-id');
        
        if (!ToolRegistry || !ToolRegistry.tools) {
            this.displayToolError('Tool registry not available. Please refresh the page.');
            return;
        }
        
        const tool = ToolRegistry.tools.get(toolId);
        
        if (!tool) {
            console.error(`Tool not found: ${toolId}`);
            this.displayToolError(`Tool "${toolId}" not found. This tool may not be available.`);
            return;
        }
        
        // Collect form data with proper type handling
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Handle different input types
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                switch (input.type) {
                    case 'number':
                    case 'range':
                        data[key] = parseFloat(value) || 0;
                        break;
                    case 'checkbox':
                        data[key] = input.checked;
                        break;
                    case 'file':
                        data[key] = input.files[0] || null;
                        break;
                    default:
                        data[key] = value;
                }
            } else {
                data[key] = value;
            }
        }
        
        // Handle checkboxes that aren't checked (not in FormData)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!formData.has(checkbox.name)) {
                data[checkbox.name] = false;
            }
        });
        
        // Process with tool
        const result = this.processToolData(tool, data);
        
        // Display results
        this.displayToolResults(result, toolId);
    }
    
    processToolData(tool, data) {
        try {
            if (tool.calculate) {
                return tool.calculate(data);
            } else if (tool.generate) {
                return tool.generate(data);
            } else if (tool.process) {
                return tool.process(data);
            } else {
                throw new Error('Tool has no processing method');
            }
        } catch (error) {
            return { error: error.message };
        }
    }
    
    displayToolResults(result, toolId) {
        const resultsContainer = document.getElementById('tool-results');
        const resultsPlaceholder = document.getElementById('results-placeholder');
        
        if (!resultsContainer) return;
        
        // Hide placeholder and show results
        if (resultsPlaceholder) {
            resultsPlaceholder.classList.add('hidden');
        }
        
        // Render results using the enhanced renderer
        if (typeof ResultsRenderer !== 'undefined') {
            resultsContainer.innerHTML = ResultsRenderer.render(result, toolId);
        } else {
            // Fallback to basic rendering
            resultsContainer.innerHTML = this.renderBasicResult(result);
        }
        
        resultsContainer.classList.remove('hidden');
        
        // Smooth scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    renderBasicResult(result) {
        if (result.error) {
            return `<div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">${result.error}</div>`;
        }
        
        if (typeof result === 'object') {
            return `<pre class="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">${JSON.stringify(result, null, 2)}</pre>`;
        }
        
        return `<div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-2xl font-bold text-green-800">${result}</div>`;
    }
    
    displayToolError(message) {
        const resultsContainer = document.getElementById('tool-results');
        const resultsPlaceholder = document.getElementById('results-placeholder');
        
        if (!resultsContainer) return;
        
        // Hide placeholder and show error
        if (resultsPlaceholder) {
            resultsPlaceholder.classList.add('hidden');
        }
        
        resultsContainer.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div class="text-red-600 text-2xl mb-2">⚠️</div>
                <h3 class="text-red-800 font-semibold mb-2">Tool Error</h3>
                <p class="text-red-700">${message}</p>
                <button onclick="location.reload()" class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Reload Page
                </button>
            </div>
        `;
        
        resultsContainer.classList.remove('hidden');
    }
    
    handleInputChange(input) {
        // Real-time validation or preview updates can go here
        const form = input.closest('form');
        if (form && input.hasAttribute('data-live-update')) {
            // Debounced live update
            clearTimeout(input.updateTimer);
            input.updateTimer = setTimeout(() => {
                this.handleToolSubmit(form);
            }, 300);
        }
    }
    
    handleCopyClick(button) {
        const targetId = button.getAttribute('data-copy-target');
        const target = document.getElementById(targetId);
        
        if (target) {
            const text = target.textContent || target.value;
            
            // Use modern clipboard API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = 'Copy';
                    }, 2000);
                }).catch(() => {
                    // Fallback to older method
                    this.fallbackCopyText(text, button);
                });
            } else {
                this.fallbackCopyText(text, button);
            }
        }
    }
    
    fallbackCopyText(text, button) {
        // Create temporary textarea for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        
        try {
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            const successful = document.execCommand('copy');
            
            if (successful) {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            } else {
                button.textContent = 'Copy failed';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        } catch (err) {
            button.textContent = 'Copy failed';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 2000);
        }
        
        document.body.removeChild(textarea);
    }
    
    updateNavigation(currentPath) {
        // Update main navigation active states
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update category navigation
        this.updateCategoryNavigation(currentPath);
        
        // Update breadcrumbs
        this.updateBreadcrumbsUI(currentPath);
    }
    
    updateCategoryNavigation(currentPath) {
        const categoryLinks = document.querySelectorAll('[data-category]');
        categoryLinks.forEach(link => {
            const category = link.getAttribute('data-category');
            if (currentPath.includes(`/tools/${category}/`) || 
                (currentPath === `/category/${category}`)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    updateBreadcrumbsUI(currentPath) {
        const breadcrumbContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbContainer) return;
        
        const route = this.routes.get(currentPath);
        const breadcrumbs = this.generateBreadcrumbs(currentPath, route);
        
        breadcrumbContainer.innerHTML = breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return `
                <li class="flex items-center">
                    ${index > 0 ? '<svg class="w-5 h-5 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' : ''}
                    ${isLast 
                        ? `<span class="text-gray-500">${breadcrumb.name}</span>`
                        : `<a href="${breadcrumb.url}" class="text-blue-600 hover:text-blue-800">${breadcrumb.name}</a>`
                    }
                </li>
            `;
        }).join('');
    }
    
    // Get all registered routes
    getAllRoutes() {
        return Array.from(this.routes.entries());
    }
    
    // Generate sitemap
    generateSitemap() {
        const routes = this.getAllRoutes();
        const baseUrl = window.location.origin;
        
        return routes.map(([path, route]) => ({
            url: baseUrl + path,
            title: route.title,
            description: route.description,
            category: route.category
        }));
    }
}

// Export router instance
window.UtilityRouter = UtilityRouter;

console.log('✅ Router system loaded successfully');