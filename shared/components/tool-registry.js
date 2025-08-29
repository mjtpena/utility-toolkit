// Tool registry for managing all available tools
const ToolRegistry = {
    tools: new Map(),
    categories: new Map(),
    
    // Register a tool
    register: (tool) => {
        if (!tool.id) {
            throw new Error('Tool must have an ID');
        }
        
        ToolRegistry.tools.set(tool.id, tool);
        
        // Add to category
        if (!ToolRegistry.categories.has(tool.category)) {
            ToolRegistry.categories.set(tool.category, []);
        }
        ToolRegistry.categories.get(tool.category).push(tool);
        
        return tool;
    },
    
    // Get tool by ID
    get: (id) => {
        return ToolRegistry.tools.get(id);
    },
    
    // Get all tools
    getAllTools: () => {
        return Array.from(ToolRegistry.tools.values());
    },
    
    // Get tools by category
    getByCategory: (category) => {
        return ToolRegistry.categories.get(category) || [];
    },
    
    // Get all categories
    getCategories: () => {
        return Array.from(ToolRegistry.categories.keys());
    },
    
    // Search tools
    search: (query) => {
        const searchTerm = query.toLowerCase();
        return Array.from(ToolRegistry.tools.values()).filter(tool => 
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.description.toLowerCase().includes(searchTerm) ||
            tool.category.toLowerCase().includes(searchTerm)
        );
    },
    
    // Get tool count
    getCount: () => {
        return ToolRegistry.tools.size;
    },
    
    // Get category counts
    getCategoryCounts: () => {
        const counts = {};
        for (const [category, tools] of ToolRegistry.categories.entries()) {
            counts[category] = tools.length;
        }
        return counts;
    }
};

// Initialize with placeholder tools for development
ToolRegistry.register({
    id: 'placeholder',
    name: 'Tool Development in Progress',
    description: 'Tools are being built and will appear here as they are completed.',
    category: 'development',
    icon: '🚧',
    render: () => {
        const container = document.createElement('div');
        container.className = 'text-center py-12';
        container.innerHTML = `
            <div class="text-6xl mb-6">🚧</div>
            <h3 class="text-xl font-semibold mb-4">Development in Progress</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
                We're building 140+ amazing tools for you! Each tool will replace expensive SaaS alternatives 
                with free, client-side utilities.
            </p>
            <div class="bg-gray-50 rounded-lg p-4 max-w-sm mx-auto">
                <div class="text-sm text-gray-600 mb-2">Progress</div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 h-2 rounded-full" style="width: 15%"></div>
                </div>
                <div class="text-xs text-gray-500 mt-2">Foundation complete - tools coming next!</div>
            </div>
        `;
        return container;
    }
});

// Export for global use
if (typeof window !== 'undefined') {
    window.ToolRegistry = ToolRegistry;
}