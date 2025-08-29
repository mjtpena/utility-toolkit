// Result display utilities
const Results = {
    // Create result display container
    createResultContainer: (title = 'Result') => {
        const container = document.createElement('div');
        container.className = 'result-container bg-gray-50 rounded-lg p-6 mt-6';
        container.style.display = 'none';
        
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'text-lg font-semibold text-gray-900';
        titleEl.textContent = title;
        
        const actions = document.createElement('div');
        actions.className = 'result-actions flex gap-2';
        
        header.appendChild(titleEl);
        header.appendChild(actions);
        container.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'result-content';
        container.appendChild(content);
        
        return { container, content, actions, show: () => {
            container.style.display = 'block';
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, hide: () => {
            container.style.display = 'none';
        }};
    },
    
    // Display simple result
    showResult: (container, result, options = {}) => {
        const { 
            title = 'Result',
            copyable = true,
            downloadable = false,
            filename = 'result.txt',
            format = 'text',
            className = ''
        } = options;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = '';
        container.className = `result-display bg-white border rounded-lg p-4 ${className}`;
        
        // Header with actions
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-3';
        
        const titleEl = document.createElement('h4');
        titleEl.className = 'font-medium text-gray-900';
        titleEl.textContent = title;
        
        const actions = document.createElement('div');
        actions.className = 'flex gap-2';
        
        if (copyable) {
            const copyBtn = UI.createButton('Copy', 'ghost', () => {
                UI.copyToClipboard(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
            });
            copyBtn.className = 'text-sm px-2 py-1 text-blue-600 hover:bg-blue-50';
            actions.appendChild(copyBtn);
        }
        
        if (downloadable) {
            const downloadBtn = UI.createButton('Download', 'ghost', () => {
                const content = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
                UI.downloadFile(content, filename);
            });
            downloadBtn.className = 'text-sm px-2 py-1 text-blue-600 hover:bg-blue-50';
            actions.appendChild(downloadBtn);
        }
        
        header.appendChild(titleEl);
        header.appendChild(actions);
        container.appendChild(header);
        
        // Result content
        const content = document.createElement('div');
        content.className = 'result-content';
        
        if (format === 'json') {
            content.innerHTML = `<pre class="bg-gray-100 p-3 rounded text-sm overflow-auto"><code>${JSON.stringify(result, null, 2)}</code></pre>`;
        } else if (format === 'html') {
            content.innerHTML = result;
        } else {
            content.className += ' text-gray-800';
            content.textContent = result;
        }
        
        container.appendChild(content);
        
        return container;
    },
    
    // Display numeric result with formatting
    showNumericResult: (container, value, options = {}) => {
        const {
            label = 'Result',
            unit = '',
            precision = 2,
            currency = null,
            percentage = false,
            comparison = null
        } = options;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        let formattedValue;
        
        if (currency) {
            formattedValue = Formatters.number.currency(value, currency);
        } else if (percentage) {
            formattedValue = Formatters.number.percentage(value, precision);
        } else {
            formattedValue = Formatters.number.decimal(value, precision);
            if (unit) formattedValue += ` ${unit}`;
        }
        
        const resultHtml = `
            <div class="numeric-result text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div class="text-sm text-gray-600 mb-2">${label}</div>
                <div class="text-3xl font-bold text-gray-900 mb-2">${formattedValue}</div>
                ${comparison ? `<div class="text-sm text-gray-500">${comparison}</div>` : ''}
            </div>
        `;
        
        return Results.showResult(container, resultHtml, { format: 'html', copyable: true });
    },
    
    // Display multiple results in a grid
    showMultipleResults: (container, results, options = {}) => {
        const { columns = 2 } = options;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = '';
        container.className = `results-grid grid grid-cols-1 md:grid-cols-${columns} gap-4`;
        
        results.forEach(result => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card bg-white border rounded-lg p-4';
            
            const label = document.createElement('div');
            label.className = 'text-sm font-medium text-gray-600 mb-1';
            label.textContent = result.label;
            
            const value = document.createElement('div');
            value.className = 'text-xl font-semibold text-gray-900';
            value.textContent = result.value;
            
            if (result.unit) {
                const unit = document.createElement('span');
                unit.className = 'text-sm font-normal text-gray-500 ml-1';
                unit.textContent = result.unit;
                value.appendChild(unit);
            }
            
            resultCard.appendChild(label);
            resultCard.appendChild(value);
            
            if (result.description) {
                const description = document.createElement('div');
                description.className = 'text-xs text-gray-500 mt-1';
                description.textContent = result.description;
                resultCard.appendChild(description);
            }
            
            container.appendChild(resultCard);
        });
        
        return container;
    },
    
    // Display table results
    showTableResult: (container, data, options = {}) => {
        const { 
            headers = null,
            title = 'Results',
            searchable = false,
            sortable = false,
            exportable = true
        } = options;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = '';
        
        // Table container
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-result bg-white border rounded-lg overflow-hidden';
        
        // Header
        const header = document.createElement('div');
        header.className = 'px-4 py-3 border-b bg-gray-50 flex items-center justify-between';
        
        const titleEl = document.createElement('h4');
        titleEl.className = 'font-medium text-gray-900';
        titleEl.textContent = title;
        
        const headerActions = document.createElement('div');
        headerActions.className = 'flex gap-2';
        
        if (exportable) {
            const exportBtn = UI.createButton('Export CSV', 'ghost', () => {
                const csv = Results.convertToCSV(data, headers);
                UI.downloadFile(csv, 'results.csv', 'text/csv');
            });
            exportBtn.className = 'text-sm px-2 py-1 text-blue-600 hover:bg-blue-50';
            headerActions.appendChild(exportBtn);
        }
        
        header.appendChild(titleEl);
        header.appendChild(headerActions);
        tableContainer.appendChild(header);
        
        // Search bar
        if (searchable) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'px-4 py-2 border-b bg-gray-50';
            
            const searchInput = document.createElement('input');
            searchInput.type = 'search';
            searchInput.placeholder = 'Search results...';
            searchInput.className = 'w-full px-3 py-1 border border-gray-300 rounded text-sm';
            
            searchContainer.appendChild(searchInput);
            tableContainer.appendChild(searchContainer);
            
            // Search functionality
            searchInput.addEventListener('input', (e) => {
                Results.filterTable(tableContainer.querySelector('table'), e.target.value);
            });
        }
        
        // Table
        const table = document.createElement('table');
        table.className = 'w-full';
        
        // Table header
        const thead = document.createElement('thead');
        thead.className = 'bg-gray-50';
        const headerRow = document.createElement('tr');
        
        const keys = headers || (data.length > 0 ? Object.keys(data[0]) : []);
        
        keys.forEach(key => {
            const th = document.createElement('th');
            th.className = 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';
            th.textContent = key;
            
            if (sortable) {
                th.className += ' cursor-pointer hover:bg-gray-100';
                th.addEventListener('click', () => {
                    Results.sortTable(table, key);
                });
            }
            
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Table body
        const tbody = document.createElement('tbody');
        tbody.className = 'bg-white divide-y divide-gray-200';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            
            keys.forEach(key => {
                const td = document.createElement('td');
                td.className = 'px-4 py-2 text-sm text-gray-900';
                td.textContent = row[key] || '';
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);
        
        return container;
    },
    
    // Helper function to convert data to CSV
    convertToCSV: (data, headers = null) => {
        if (!data.length) return '';
        
        const keys = headers || Object.keys(data[0]);
        let csv = keys.join(',') + '\n';
        
        data.forEach(row => {
            const values = keys.map(key => {
                const value = row[key] || '';
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            });
            csv += values.join(',') + '\n';
        });
        
        return csv;
    },
    
    // Filter table rows
    filterTable: (table, searchTerm) => {
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    },
    
    // Sort table by column
    sortTable: (table, column) => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const headers = Array.from(table.querySelector('thead tr').children);
        const columnIndex = headers.findIndex(th => th.textContent === column);
        
        if (columnIndex === -1) return;
        
        rows.sort((a, b) => {
            const aValue = a.children[columnIndex].textContent;
            const bValue = b.children[columnIndex].textContent;
            
            // Try numeric sort first
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            
            // Fall back to string sort
            return aValue.localeCompare(bValue);
        });
        
        // Re-append sorted rows
        rows.forEach(row => tbody.appendChild(row));
    },
    
    // Show chart result (placeholder for Chart.js integration)
    showChartResult: (container, data, options = {}) => {
        const { type = 'bar', title = 'Chart' } = options;
        
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        
        container.innerHTML = '';
        
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container bg-white border rounded-lg p-4';
        
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 200;
        
        chartContainer.appendChild(canvas);
        container.appendChild(chartContainer);
        
        // Chart.js implementation would go here
        // For now, show placeholder
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#374151';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${title} Chart`, canvas.width / 2, canvas.height / 2);
        
        return container;
    }
};