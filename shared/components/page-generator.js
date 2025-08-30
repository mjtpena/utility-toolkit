/**
 * Page Generator for Individual Tool Pages
 * Converts registered tools into individual routable pages
 */

class PageGenerator {
    constructor() {
        this.pageTemplate = this.createPageTemplate();
    }
    
    createPageTemplate() {
        return `
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <header class="bg-white shadow-sm border-b sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <a href="/" class="flex items-center space-x-2 hover:opacity-80">
                                <span class="text-2xl">🛠️</span>
                                <span class="text-lg font-bold text-gray-900">Utility Toolkit</span>
                            </a>
                        </div>
                        <nav class="hidden md:flex items-center space-x-6">
                            <a href="/" class="text-gray-600 hover:text-gray-900 font-medium">All Tools</a>
                            <a href="/category/calculators" class="text-gray-600 hover:text-gray-900">Calculators</a>
                            <a href="/category/converters" class="text-gray-600 hover:text-gray-900">Converters</a>
                            <a href="/category/business" class="text-gray-600 hover:text-gray-900">Business</a>
                            <a href="/category/design" class="text-gray-600 hover:text-gray-900">Design</a>
                        </nav>
                        <div class="flex items-center space-x-3">
                            <button id="mobile-menu-toggle" class="md:hidden p-2">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Menu -->
                <div id="mobile-menu" class="hidden md:hidden border-t bg-white">
                    <div class="px-4 py-2 space-y-1">
                        <a href="/" class="block py-2 text-gray-600 hover:text-gray-900">All Tools</a>
                        <a href="/category/calculators" class="block py-2 text-gray-600 hover:text-gray-900">Calculators</a>
                        <a href="/category/converters" class="block py-2 text-gray-600 hover:text-gray-900">Converters</a>
                        <a href="/category/business" class="block py-2 text-gray-600 hover:text-gray-900">Business</a>
                        <a href="/category/design" class="block py-2 text-gray-600 hover:text-gray-900">Design</a>
                    </div>
                </div>
            </header>

            <!-- Breadcrumbs -->
            <nav class="bg-white border-b">
                <div class="max-w-7xl mx-auto px-4 py-3">
                    <ol id="breadcrumbs" class="flex items-center space-x-1 text-sm">
                        <!-- Breadcrumbs will be populated by router -->
                    </ol>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="max-w-4xl mx-auto px-4 py-8">
                <!-- Tool Header -->
                <div class="text-center mb-8">
                    <div class="text-4xl mb-3">{{TOOL_ICON}}</div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">{{TOOL_NAME}}</h1>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">{{TOOL_DESCRIPTION}}</p>
                </div>

                <!-- Tool Content -->
                <div class="bg-white rounded-xl shadow-sm border p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- Input Form -->
                        <div class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 border-b pb-2">Input</h2>
                            <form id="tool-form" data-tool-id="{{TOOL_ID}}" class="space-y-4">
                                {{FORM_FIELDS}}
                                <button type="submit" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 font-medium transition-colors">
                                    Calculate
                                </button>
                            </form>
                        </div>

                        <!-- Results -->
                        <div class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-900 border-b pb-2">Results</h2>
                            <div id="tool-results" class="hidden">
                                <!-- Results will be populated dynamically -->
                            </div>
                            <div id="results-placeholder" class="text-center py-12 text-gray-500">
                                <div class="text-4xl mb-3">📊</div>
                                <p>Enter values above to see results</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tool Information -->
                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Features -->
                    <div class="bg-white rounded-lg shadow-sm border p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">✨ Features</h3>
                        <ul id="tool-features" class="space-y-2 text-gray-600">
                            {{TOOL_FEATURES}}
                        </ul>
                    </div>

                    <!-- Use Cases -->
                    <div class="bg-white rounded-lg shadow-sm border p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Use Cases</h3>
                        <ul id="tool-use-cases" class="space-y-2 text-gray-600">
                            {{TOOL_USE_CASES}}
                        </ul>
                    </div>
                </div>

                <!-- Related Tools -->
                <div class="mt-8">
                    <div class="bg-white rounded-lg shadow-sm border p-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔗 Related Tools</h3>
                        <div id="related-tools" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <!-- Related tools will be populated dynamically -->
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-900 text-white">
                <div class="max-w-7xl mx-auto px-4 py-12">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div class="flex items-center space-x-2 mb-4">
                                <span class="text-2xl">🛠️</span>
                                <span class="font-bold text-xl">Utility Toolkit</span>
                            </div>
                            <p class="text-gray-400">145+ free, privacy-focused utility tools. No data collection, no servers required.</p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-4">Categories</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li><a href="/category/calculators" class="hover:text-white">Calculators</a></li>
                                <li><a href="/category/converters" class="hover:text-white">Converters</a></li>
                                <li><a href="/category/business" class="hover:text-white">Business Tools</a></li>
                                <li><a href="/category/design" class="hover:text-white">Design Tools</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-4">Features</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li>100% Client-Side</li>
                                <li>No Data Collection</li>
                                <li>Works Offline</li>
                                <li>Mobile Responsive</li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-4">Links</h4>
                            <ul class="space-y-2 text-gray-400">
                                <li><a href="https://github.com/mjtpena/utility-toolkit" target="_blank" class="hover:text-white">GitHub</a></li>
                                <li><a href="/" class="hover:text-white">All Tools</a></li>
                                <li><a href="/sitemap" class="hover:text-white">Sitemap</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Utility Toolkit. Open source and free forever.</p>
                    </div>
                </div>
            </footer>
        </div>`;
    }
    
    generateToolPage(tool) {
        let template = this.pageTemplate;
        
        // Replace basic placeholders
        template = template.replace(/{{TOOL_ID}}/g, tool.id);
        template = template.replace(/{{TOOL_NAME}}/g, tool.name);
        template = template.replace(/{{TOOL_DESCRIPTION}}/g, tool.description);
        template = template.replace(/{{TOOL_ICON}}/g, tool.icon || '🛠️');
        
        // Generate form fields
        const formFields = this.generateFormFields(tool.fields || []);
        template = template.replace('{{FORM_FIELDS}}', formFields);
        
        // Generate features
        const features = this.generateToolFeatures(tool);
        template = template.replace('{{TOOL_FEATURES}}', features);
        
        // Generate use cases
        const useCases = this.generateToolUseCases(tool);
        template = template.replace('{{TOOL_USE_CASES}}', useCases);
        
        return template;
    }
    
    generateFormFields(fields) {
        return fields.map(field => {
            let fieldHtml = '';
            
            switch (field.type) {
                case 'text':
                case 'number':
                case 'email':
                case 'url':
                case 'password':
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <input
                                type="${field.type}"
                                id="${field.name}"
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                ${field.min !== undefined ? `min="${field.min}"` : ''}
                                ${field.max !== undefined ? `max="${field.max}"` : ''}
                                ${field.step !== undefined ? `step="${field.step}"` : ''}
                                ${field.defaultValue !== undefined ? `value="${field.defaultValue}"` : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                        </div>`;
                    break;
                    
                case 'textarea':
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <textarea
                                id="${field.name}"
                                name="${field.name}"
                                rows="4"
                                ${field.required ? 'required' : ''}
                                ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >${field.defaultValue || ''}</textarea>
                        </div>`;
                    break;
                    
                case 'select':
                    const options = (field.options || []).map(option => 
                        `<option value="${option.value}" ${field.defaultValue === option.value ? 'selected' : ''}>${option.label}</option>`
                    ).join('');
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <select
                                id="${field.name}"
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${field.multiple ? 'multiple' : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                ${options}
                            </select>
                        </div>`;
                    break;
                    
                case 'checkbox':
                    fieldHtml = `
                        <div class="form-group">
                            <label class="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="${field.name}"
                                    name="${field.name}"
                                    value="true"
                                    ${field.defaultValue ? 'checked' : ''}
                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                >
                                <span class="text-sm font-medium text-gray-700">${field.label}</span>
                            </label>
                        </div>`;
                    break;
                    
                case 'range':
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <div class="flex items-center space-x-4">
                                <span class="text-sm text-gray-500">${field.min || 0}</span>
                                <input
                                    type="range"
                                    id="${field.name}"
                                    name="${field.name}"
                                    min="${field.min || 0}"
                                    max="${field.max || 100}"
                                    step="${field.step || 1}"
                                    value="${field.defaultValue || field.min || 0}"
                                    class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    oninput="document.getElementById('${field.name}_value').textContent = this.value"
                                >
                                <span class="text-sm text-gray-500">${field.max || 100}</span>
                            </div>
                            <div class="text-center mt-2">
                                <span class="text-sm font-medium">Value: <span id="${field.name}_value">${field.defaultValue || field.min || 0}</span></span>
                            </div>
                        </div>`;
                    break;
                    
                case 'file':
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <input
                                type="file"
                                id="${field.name}"
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${field.accept ? `accept="${field.accept}"` : ''}
                                ${field.multiple ? 'multiple' : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            >
                        </div>`;
                    break;
                    
                case 'color':
                case 'date':
                case 'time':
                case 'datetime-local':
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <input
                                type="${field.type}"
                                id="${field.name}"
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${field.defaultValue !== undefined ? `value="${field.defaultValue}"` : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                        </div>`;
                    break;
                    
                default:
                    fieldHtml = `
                        <div class="form-group">
                            <label for="${field.name}" class="block text-sm font-medium text-gray-700 mb-2">
                                ${field.label}${field.required ? ' *' : ''}
                            </label>
                            <input
                                type="text"
                                id="${field.name}"
                                name="${field.name}"
                                ${field.required ? 'required' : ''}
                                ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                ${field.defaultValue !== undefined ? `value="${field.defaultValue}"` : ''}
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                        </div>`;
            }
            
            return fieldHtml;
        }).join('');
    }
    
    generateToolFeatures(tool) {
        const commonFeatures = [
            'Fast client-side processing',
            'No data sent to servers',
            'Works offline once loaded',
            'Mobile-responsive design'
        ];
        
        const categoryFeatures = {
            calculators: [
                'Real-time calculations',
                'Detailed step-by-step results',
                'Multiple input formats supported',
                'Accurate mathematical computations'
            ],
            converters: [
                'Bidirectional conversion',
                'Multiple unit systems',
                'Precision control',
                'Historical conversion rates'
            ],
            generators: [
                'Customizable output formats',
                'Bulk generation support',
                'Export functionality',
                'Template system'
            ],
            business: [
                'Professional formatting',
                'Export to multiple formats',
                'Template customization',
                'Business logic validation'
            ]
        };
        
        const features = [...commonFeatures];
        if (categoryFeatures[tool.category]) {
            features.push(...categoryFeatures[tool.category]);
        }
        
        return features.map(feature => `<li class="flex items-start space-x-2"><span class="text-green-500">✓</span><span>${feature}</span></li>`).join('');
    }
    
    generateToolUseCases(tool) {
        const useCases = {
            'tip-calculator': [
                'Restaurant bill splitting',
                'Service industry calculations',
                'Group dining expenses',
                'Delivery fee calculations'
            ],
            'mortgage-calculator': [
                'Home buying planning',
                'Refinancing analysis',
                'Payment schedule planning',
                'Interest rate comparisons'
            ],
            'bmi-calculator': [
                'Health assessments',
                'Fitness goal planning',
                'Medical consultations',
                'Wellness tracking'
            ],
            'length-converter': [
                'International measurements',
                'Construction projects',
                'Recipe conversions',
                'Scientific calculations'
            ],
            'color-converter': [
                'Web development',
                'Graphic design',
                'Print design',
                'Brand color matching'
            ]
        };
        
        const toolUseCases = useCases[tool.id] || [
            'Professional workflows',
            'Educational purposes',
            'Personal projects',
            'Business applications'
        ];
        
        return toolUseCases.map(useCase => `<li class="flex items-start space-x-2"><span class="text-blue-500">▸</span><span>${useCase}</span></li>`).join('');
    }
    
    generateCategoryPage(categoryName, tools) {
        const categoryTemplate = `
        <div class="min-h-screen bg-gray-50">
            <!-- Header (same as tool page) -->
            <header class="bg-white shadow-sm border-b sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <a href="/" class="flex items-center space-x-2 hover:opacity-80">
                                <span class="text-2xl">🛠️</span>
                                <span class="text-lg font-bold text-gray-900">Utility Toolkit</span>
                            </a>
                        </div>
                        <nav class="hidden md:flex items-center space-x-6">
                            <a href="/" class="text-gray-600 hover:text-gray-900 font-medium">All Tools</a>
                            <a href="/category/calculators" class="text-gray-600 hover:text-gray-900">Calculators</a>
                            <a href="/category/converters" class="text-gray-600 hover:text-gray-900">Converters</a>
                            <a href="/category/business" class="text-gray-600 hover:text-gray-900">Business</a>
                            <a href="/category/design" class="text-gray-600 hover:text-gray-900">Design</a>
                        </nav>
                    </div>
                </div>
            </header>

            <!-- Category Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div class="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 class="text-4xl font-bold mb-4">{{CATEGORY_NAME}}</h1>
                    <p class="text-xl opacity-90">{{TOOL_COUNT}} powerful tools to boost your productivity</p>
                </div>
            </div>

            <!-- Tools Grid -->
            <main class="max-w-7xl mx-auto px-4 py-12">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {{TOOLS_LIST}}
                </div>
            </main>
        </div>`;
        
        let template = categoryTemplate;
        template = template.replace('{{CATEGORY_NAME}}', this.formatCategoryName(categoryName));
        template = template.replace('{{TOOL_COUNT}}', tools.length);
        
        const toolsHtml = tools.map(tool => `
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
        `).join('');
        
        template = template.replace('{{TOOLS_LIST}}', toolsHtml);
        
        return template;
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
}

// Export page generator
window.PageGenerator = PageGenerator;

console.log('✅ Page Generator loaded successfully');