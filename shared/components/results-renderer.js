/**
 * Enhanced Results Renderer for Routing System
 * Integrates with existing Results utility for consistent display
 */

class ResultsRenderer {
    static render(result, toolId) {
        if (!result) {
            return this.renderEmptyState();
        }

        if (result.error) {
            return this.renderError(result.error);
        }

        // Handle different result types based on tool patterns
        if (typeof result === 'object') {
            return this.renderObjectResult(result, toolId);
        } else {
            return this.renderSimpleResult(result, toolId);
        }
    }

    static renderEmptyState() {
        return `
            <div class="text-center py-12 text-gray-500">
                <div class="text-4xl mb-3">📊</div>
                <p class="text-lg font-medium">Enter values above to see results</p>
                <p class="text-sm text-gray-400 mt-1">All calculations are performed locally in your browser</p>
            </div>
        `;
    }

    static renderError(error) {
        return `
            <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <h3 class="text-sm font-medium text-red-800">Calculation Error</h3>
                        <p class="mt-1 text-sm text-red-700">${error}</p>
                        <div class="mt-3">
                            <button onclick="this.closest('.bg-red-50').style.display='none'" class="text-sm text-red-600 hover:text-red-800 underline">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderSimpleResult(result, toolId) {
        const formattedResult = this.formatValue(result);
        
        return `
            <div class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                <div class="text-center">
                    <div class="text-3xl font-bold text-gray-800 mb-4">${formattedResult}</div>
                    <div class="flex justify-center space-x-2">
                        ${this.renderCopyButton(result.toString(), 'result')}
                        ${this.renderShareButton(toolId, result)}
                    </div>
                </div>
            </div>
        `;
    }

    static renderObjectResult(result, toolId) {
        // Determine the best rendering approach based on result structure
        if (this.hasNumericResults(result)) {
            return this.renderNumericResults(result, toolId);
        } else if (this.hasTableData(result)) {
            return this.renderTableResults(result, toolId);
        } else if (this.hasTextResults(result)) {
            return this.renderTextResults(result, toolId);
        } else {
            return this.renderGenericResults(result, toolId);
        }
    }

    static hasNumericResults(result) {
        // Check if result contains primarily numeric values
        const numericFields = ['result', 'total', 'amount', 'value', 'bmi', 'rate', 'percentage', 'score'];
        return numericFields.some(field => result.hasOwnProperty(field) && typeof result[field] === 'number');
    }

    static hasTableData(result) {
        // Check if result contains array data suitable for tables
        return Object.values(result).some(value => 
            Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'
        );
    }

    static hasTextResults(result) {
        // Check if result is primarily text-based
        const textFields = ['text', 'content', 'output', 'processed', 'generated'];
        return textFields.some(field => result.hasOwnProperty(field) && typeof result[field] === 'string');
    }

    static renderNumericResults(result, toolId) {
        const mainResults = this.extractMainResults(result);
        const supplementaryResults = this.extractSupplementaryResults(result);
        
        let html = '<div class="space-y-6">';
        
        // Main results in cards
        if (mainResults.length > 0) {
            html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            mainResults.forEach(item => {
                html += `
                    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
                        <div class="text-sm font-medium text-gray-600 mb-2">${item.label}</div>
                        <div class="text-2xl font-bold text-gray-900">${this.formatValue(item.value, item.type)}</div>
                        ${item.description ? `<div class="text-sm text-gray-500 mt-2">${item.description}</div>` : ''}
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // Supplementary information
        if (supplementaryResults.length > 0) {
            html += '<div class="bg-white border rounded-lg p-4">';
            html += '<h4 class="font-medium text-gray-900 mb-3">Additional Information</h4>';
            html += '<div class="space-y-2 text-sm">';
            supplementaryResults.forEach(item => {
                html += `
                    <div class="flex justify-between">
                        <span class="text-gray-600">${item.label}:</span>
                        <span class="font-medium">${this.formatValue(item.value, item.type)}</span>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        // Action buttons
        html += '<div class="flex justify-center space-x-2 pt-4">';
        html += this.renderCopyButton(JSON.stringify(result, null, 2), 'results');
        html += this.renderShareButton(toolId, result);
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    static renderTableResults(result, toolId) {
        const tableData = this.extractTableData(result);
        let html = '<div class="space-y-4">';
        
        tableData.forEach(table => {
            html += `
                <div class="bg-white border rounded-lg overflow-hidden">
                    <div class="px-4 py-3 bg-gray-50 border-b">
                        <h4 class="font-medium text-gray-900">${table.title}</h4>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    ${table.headers.map(header => 
                                        `<th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">${header}</th>`
                                    ).join('')}
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                ${table.rows.map(row => 
                                    `<tr class="hover:bg-gray-50">
                                        ${row.map(cell => 
                                            `<td class="px-4 py-2 text-sm text-gray-900">${this.formatValue(cell)}</td>`
                                        ).join('')}
                                    </tr>`
                                ).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });
        
        // Action buttons
        html += '<div class="flex justify-center space-x-2 pt-4">';
        html += this.renderCopyButton(JSON.stringify(result, null, 2), 'table-data');
        html += this.renderDownloadButton(tableData, 'csv', 'results.csv');
        html += this.renderShareButton(toolId, result);
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    static renderTextResults(result, toolId) {
        const textData = this.extractTextData(result);
        let html = '<div class="space-y-4">';
        
        textData.forEach(section => {
            html += `
                <div class="bg-white border rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-3">${section.title}</h4>
                    <div class="prose prose-sm max-w-none">
                        ${section.formatted ? section.content : `<pre class="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-3 rounded">${section.content}</pre>`}
                    </div>
                </div>
            `;
        });
        
        // Action buttons
        html += '<div class="flex justify-center space-x-2 pt-4">';
        html += this.renderCopyButton(textData.map(s => s.content).join('\n\n'), 'text-results');
        html += this.renderDownloadButton(textData.map(s => s.content).join('\n\n'), 'txt', 'results.txt');
        html += this.renderShareButton(toolId, result);
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    static renderGenericResults(result, toolId) {
        let html = '<div class="space-y-4">';
        
        Object.entries(result).forEach(([key, value]) => {
            if (key === 'error') return; // Skip error fields
            
            html += `
                <div class="bg-white border rounded-lg p-4">
                    <h4 class="font-medium text-gray-900 mb-2 capitalize">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <div class="text-gray-700">
                        ${typeof value === 'object' ? 
                            `<pre class="text-sm bg-gray-50 p-3 rounded overflow-auto">${JSON.stringify(value, null, 2)}</pre>` : 
                            `<div class="text-lg">${this.formatValue(value)}</div>`
                        }
                    </div>
                </div>
            `;
        });
        
        // Action buttons
        html += '<div class="flex justify-center space-x-2 pt-4">';
        html += this.renderCopyButton(JSON.stringify(result, null, 2), 'generic-results');
        html += this.renderShareButton(toolId, result);
        html += '</div>';
        
        html += '</div>';
        return html;
    }

    // Helper methods for extracting and formatting data
    static extractMainResults(result) {
        const mainFields = [
            { key: 'result', label: 'Result', type: 'auto' },
            { key: 'total', label: 'Total', type: 'currency' },
            { key: 'amount', label: 'Amount', type: 'currency' },
            { key: 'bmi', label: 'BMI', type: 'decimal' },
            { key: 'percentage', label: 'Percentage', type: 'percentage' },
            { key: 'score', label: 'Score', type: 'number' }
        ];
        
        return mainFields
            .filter(field => result.hasOwnProperty(field.key))
            .map(field => ({
                label: field.label,
                value: result[field.key],
                type: field.type,
                description: result[field.key + 'Description'] || result[field.key + '_description']
            }));
    }

    static extractSupplementaryResults(result) {
        const mainKeys = ['result', 'total', 'amount', 'bmi', 'percentage', 'score', 'error'];
        return Object.entries(result)
            .filter(([key, value]) => 
                !mainKeys.includes(key) && 
                (typeof value === 'number' || typeof value === 'string') &&
                !key.includes('Description') &&
                !key.includes('_description')
            )
            .map(([key, value]) => ({
                label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value: value,
                type: 'auto'
            }));
    }

    static extractTableData(result) {
        const tables = [];
        
        Object.entries(result).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                const headers = Object.keys(value[0]);
                const rows = value.map(item => headers.map(header => item[header]));
                
                tables.push({
                    title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    headers: headers.map(h => h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
                    rows: rows
                });
            }
        });
        
        return tables;
    }

    static extractTextData(result) {
        const textFields = ['text', 'content', 'output', 'processed', 'generated', 'analysis', 'summary'];
        const sections = [];
        
        textFields.forEach(field => {
            if (result.hasOwnProperty(field) && typeof result[field] === 'string') {
                sections.push({
                    title: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    content: result[field],
                    formatted: result[field].includes('<') // Basic HTML detection
                });
            }
        });
        
        return sections;
    }

    static formatValue(value, type = 'auto') {
        if (value === null || value === undefined) return 'N/A';
        
        if (typeof value === 'number') {
            switch (type) {
                case 'currency':
                    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
                case 'percentage':
                    return `${value.toFixed(2)}%`;
                case 'decimal':
                    return value.toFixed(2);
                default:
                    return value % 1 === 0 ? value.toString() : value.toFixed(2);
            }
        }
        
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        
        return value.toString();
    }

    static renderCopyButton(content, type) {
        const id = `copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        return `
            <button 
                id="${id}"
                data-copy-target="${type}"
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onclick="this.copyContent('${content.replace(/'/g, "\\'")}', this)"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy
            </button>
        `;
    }

    static renderDownloadButton(content, format, filename) {
        return `
            <button 
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onclick="this.downloadContent('${typeof content === 'string' ? content.replace(/'/g, "\\'") : JSON.stringify(content).replace(/'/g, "\\'")}', '${filename}', '${format}')"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Download
            </button>
        `;
    }

    static renderShareButton(toolId, result) {
        if (!navigator.share) return '';
        
        return `
            <button 
                class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                onclick="this.shareResult('${toolId}', '${JSON.stringify(result).replace(/'/g, "\\'")}')"
            >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
                Share
            </button>
        `;
    }
}

// Add helper methods to button elements
if (typeof window !== 'undefined') {
    HTMLButtonElement.prototype.copyContent = function(content, button) {
        navigator.clipboard.writeText(content).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = button.innerHTML.replace('Copy', 'Copied!');
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            const originalText = button.innerHTML;
            button.innerHTML = button.innerHTML.replace('Copy', 'Copied!');
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        });
    };
    
    HTMLButtonElement.prototype.downloadContent = function(content, filename, format) {
        const blob = new Blob([content], { 
            type: format === 'csv' ? 'text/csv' : 'text/plain' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    HTMLButtonElement.prototype.shareResult = function(toolId, result) {
        if (navigator.share) {
            navigator.share({
                title: 'Calculation Result - Utility Toolkit',
                text: `Check out this calculation result from ${toolId}`,
                url: window.location.href
            }).catch(console.error);
        }
    };
}

// Export for use in routing system
window.ResultsRenderer = ResultsRenderer;

console.log('✅ Enhanced Results Renderer loaded successfully');