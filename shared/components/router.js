/**
 * Client-Side Router for Individual Tool Pages
 * Handles routing to individual tool pages with SEO-friendly URLs
 */

class UtilityRouter {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.defaultRoute = '/';
        
        // Initialize router
        this.init();
    }
    
    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            this.navigate(location.pathname, false);
        });
        
        // Handle initial page load
        this.navigate(location.pathname, false);
        
        // Intercept all internal links
        document.addEventListener('click', (event) => {
            if (event.target.matches('a[href^="/"]')) {
                event.preventDefault();
                this.navigate(event.target.getAttribute('href'));
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
        
        // Clear existing content
        appContainer.innerHTML = '';
        
        // Render new component
        if (typeof component === 'function') {
            component(appContainer, path);
        } else {
            appContainer.innerHTML = component;
        }
        
        // Re-initialize any dynamic components
        this.initializeDynamicComponents();
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
        const tool = ToolRegistry.tools.get(toolId);
        
        if (!tool) {
            console.error(`Tool not found: ${toolId}`);
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
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
        if (!resultsContainer) return;
        
        resultsContainer.innerHTML = ResultsRenderer.render(result, toolId);
        resultsContainer.classList.remove('hidden');
        
        // Smooth scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
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
            navigator.clipboard.writeText(text).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
        }
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