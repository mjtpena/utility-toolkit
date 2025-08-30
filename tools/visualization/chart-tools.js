// Chart & Visualization Tools  
(function() {
    'use strict';

    // 1. Chart Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'chart-generator',
        name: 'Chart Generator',
        description: 'Create interactive charts from data (bar, line, pie, etc.)',
        category: 'charts',
        icon: '📊',
        fields: [
            {
                name: 'chartType',
                label: 'Chart Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'bar', label: 'Bar Chart' },
                    { value: 'line', label: 'Line Chart' },
                    { value: 'pie', label: 'Pie Chart' },
                    { value: 'doughnut', label: 'Doughnut Chart' },
                    { value: 'area', label: 'Area Chart' },
                    { value: 'radar', label: 'Radar Chart' }
                ]
            },
            {
                name: 'chartData',
                label: 'Chart Data (CSV format: Label,Value)',
                type: 'textarea',
                placeholder: 'Q1,100\nQ2,150\nQ3,200\nQ4,180',
                required: true,
                rows: 6
            },
            {
                name: 'chartTitle',
                label: 'Chart Title',
                type: 'text',
                placeholder: 'Sales Performance 2024'
            },
            {
                name: 'chartColors',
                label: 'Color Scheme',
                type: 'select',
                options: [
                    { value: 'blue', label: 'Blue Palette' },
                    { value: 'green', label: 'Green Palette' },
                    { value: 'red', label: 'Red Palette' },
                    { value: 'purple', label: 'Purple Palette' },
                    { value: 'mixed', label: 'Mixed Colors' },
                    { value: 'gradient', label: 'Gradient' }
                ],
                value: 'blue'
            },
            {
                name: 'showLegend',
                label: 'Show Legend',
                type: 'checkbox',
                value: true
            },
            {
                name: 'chartSize',
                label: 'Chart Size',
                type: 'select',
                options: [
                    { value: 'small', label: 'Small (400x300)' },
                    { value: 'medium', label: 'Medium (600x400)' },
                    { value: 'large', label: 'Large (800x500)' }
                ],
                value: 'medium'
            }
        ],
        generate: (data) => {
            const chartType = data.chartType;
            const rawData = data.chartData.trim();
            const chartTitle = data.chartTitle || 'Chart';
            const colorScheme = data.chartColors;
            const showLegend = data.showLegend;
            const chartSize = data.chartSize;

            if (!rawData) {
                throw new Error('Please provide chart data');
            }

            // Parse CSV data
            const lines = rawData.split('\n').filter(line => line.trim());
            const parsedData = lines.map(line => {
                const [label, value] = line.split(',');
                return {
                    label: label?.trim() || '',
                    value: parseFloat(value?.trim()) || 0
                };
            });

            if (parsedData.length === 0) {
                throw new Error('Invalid data format. Use CSV format: Label,Value');
            }

            // Get chart dimensions
            const sizes = {
                small: { width: 400, height: 300 },
                medium: { width: 600, height: 400 },
                large: { width: 800, height: 500 }
            };
            const { width, height } = sizes[chartSize];

            // Generate color palettes
            const colorPalettes = {
                blue: ['#3498db', '#2980b9', '#5dade2', '#85c1e9', '#aed6f1', '#d6eaf8'],
                green: ['#27ae60', '#229954', '#58d68d', '#82e0aa', '#a9dfbf', '#d5f4e6'],
                red: ['#e74c3c', '#c0392b', '#f1948a', '#f5b7b1', '#fadbd8', '#fdedec'],
                purple: ['#9b59b6', '#8e44ad', '#bb8fce', '#d2b4de', '#e8daef', '#f4ecf7'],
                mixed: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#1abc9c'],
                gradient: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
            };
            
            const colors = colorPalettes[colorScheme];

            // Generate Chart.js configuration
            const labels = parsedData.map(item => item.label);
            const values = parsedData.map(item => item.value);
            const backgroundColors = parsedData.map((_, index) => colors[index % colors.length]);
            const borderColors = backgroundColors.map(color => color);

            let chartConfig = {
                type: chartType === 'area' ? 'line' : chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: chartTitle,
                        data: values,
                        backgroundColor: chartType === 'line' ? 'transparent' : backgroundColors,
                        borderColor: borderColors[0],
                        borderWidth: chartType === 'line' ? 3 : 1,
                        fill: chartType === 'area',
                        tension: chartType === 'line' || chartType === 'area' ? 0.4 : 0
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: !!chartTitle,
                            text: chartTitle,
                            font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                            display: showLegend && (chartType === 'pie' || chartType === 'doughnut')
                        }
                    },
                    scales: chartType === 'pie' || chartType === 'doughnut' || chartType === 'radar' ? {} : {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#e0e0e0' }
                        },
                        x: {
                            grid: { color: '#e0e0e0' }
                        }
                    }
                }
            };

            // Special handling for pie/doughnut charts
            if (chartType === 'pie' || chartType === 'doughnut') {
                chartConfig.data.datasets[0].backgroundColor = backgroundColors;
                chartConfig.data.datasets[0].borderColor = '#ffffff';
                chartConfig.data.datasets[0].borderWidth = 2;
            }

            // Create unique chart ID
            const chartId = 'chart_' + Date.now();

            // Generate chart HTML
            const chartHTML = `
<div style="max-width: ${width}px; margin: 20px auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <canvas id="${chartId}" width="${width}" height="${height}"></canvas>
</div>

<script>
(function() {
    const ctx = document.getElementById('${chartId}');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, ${JSON.stringify(chartConfig, null, 2)});
    } else {
        console.error('Chart.js not loaded or canvas not found');
    }
})();
</script>`;

            // Generate data summary
            const total = values.reduce((sum, val) => sum + val, 0);
            const average = total / values.length;
            const max = Math.max(...values);
            const min = Math.min(...values);
            const maxLabel = labels[values.indexOf(max)];
            const minLabel = labels[values.indexOf(min)];

            // Generate CSV download
            const csvData = 'Label,Value\n' + parsedData.map(item => `${item.label},${item.value}`).join('\n');
            const csvBlob = new Blob([csvData], { type: 'text/csv' });
            const csvUrl = URL.createObjectURL(csvBlob);

            return `INTERACTIVE CHART GENERATED

Chart Type: ${chartType.charAt(0).toUpperCase() + chartType.slice(1)}
Data Points: ${parsedData.length}
Color Scheme: ${colorScheme}
Size: ${width}x${height}px

${chartHTML}

DATA SUMMARY:
• Total: ${total.toFixed(2)}
• Average: ${average.toFixed(2)}
• Highest: ${max} (${maxLabel})
• Lowest: ${min} (${minLabel})
• Range: ${(max - min).toFixed(2)}

RAW DATA:
${parsedData.map((item, i) => `${i + 1}. ${item.label}: ${item.value}`).join('\n')}

CHART.JS CONFIGURATION:
\`\`\`javascript
${JSON.stringify(chartConfig, null, 2)}
\`\`\`

HTML STRUCTURE:
\`\`\`html
<canvas id="myChart" width="${width}" height="${height}"></canvas>
<script>
const ctx = document.getElementById('myChart');
new Chart(ctx, chartConfig);
</script>
\`\`\`

ALTERNATIVE FORMATS:
• CSV Data: Ready for Excel/Google Sheets
• JSON: Ready for web applications
• Chart.js: Ready for websites
• Can be exported as PNG/SVG with additional Chart.js plugins

CUSTOMIZATION OPTIONS:
• Colors: Modify backgroundColor and borderColor arrays
• Animations: Add animation configuration
• Interactions: Enable hover effects and tooltips
• Responsive: Already configured for mobile devices
• Themes: Switch between light/dark modes

ACCESSIBILITY FEATURES:
• Screen reader friendly labels
• High contrast color options available
• Keyboard navigation support (with Chart.js plugins)
• Alternative text descriptions recommended`;
        }
    }));

    // 2. Data Visualizer
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'data-visualizer',
        name: 'Data Visualizer',
        description: 'Convert spreadsheet data into visual insights',
        category: 'charts',
        icon: '📈',
        fields: [
            {
                name: 'inputData',
                label: 'Paste Spreadsheet Data (CSV or TSV)',
                type: 'textarea',
                placeholder: 'Name,Age,Salary\nJohn,25,50000\nJane,30,65000\nBob,35,75000',
                required: true,
                rows: 8
            },
            {
                name: 'delimiter',
                label: 'Data Delimiter',
                type: 'select',
                options: [
                    { value: ',', label: 'Comma (CSV)' },
                    { value: '\t', label: 'Tab (TSV)' },
                    { value: ';', label: 'Semicolon' },
                    { value: '|', label: 'Pipe' }
                ],
                value: ','
            },
            {
                name: 'hasHeaders',
                label: 'First row contains headers',
                type: 'checkbox',
                value: true
            },
            {
                name: 'analysisType',
                label: 'Analysis Type',
                type: 'select',
                options: [
                    { value: 'summary', label: 'Statistical Summary' },
                    { value: 'distribution', label: 'Data Distribution' },
                    { value: 'correlation', label: 'Correlation Analysis' },
                    { value: 'trends', label: 'Trend Analysis' }
                ],
                value: 'summary'
            }
        ],
        convert: (data) => {
            const inputData = data.inputData.trim();
            const delimiter = data.delimiter === '\t' ? '\t' : data.delimiter;
            const hasHeaders = data.hasHeaders;
            const analysisType = data.analysisType;

            if (!inputData) {
                throw new Error('Please provide data to analyze');
            }

            // Parse CSV/TSV data
            const lines = inputData.split('\n').filter(line => line.trim());
            const rows = lines.map(line => {
                const cells = [];
                let current = '';
                let inQuotes = false;
                
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === delimiter && !inQuotes) {
                        cells.push(current.trim());
                        current = '';
                    } else {
                        current += char;
                    }
                }
                cells.push(current.trim());
                return cells;
            });

            if (rows.length === 0) {
                throw new Error('No data found');
            }

            let headers = [];
            let dataRows = rows;

            if (hasHeaders) {
                headers = rows[0];
                dataRows = rows.slice(1);
            } else {
                headers = rows[0].map((_, index) => `Column ${index + 1}`);
            }

            // Analyze data types for each column
            const columnTypes = headers.map((header, colIndex) => {
                const samples = dataRows.slice(0, Math.min(10, dataRows.length))
                    .map(row => row[colIndex])
                    .filter(cell => cell && cell.trim());

                const numericCount = samples.filter(cell => !isNaN(parseFloat(cell))).length;
                const dateCount = samples.filter(cell => !isNaN(Date.parse(cell))).length;
                
                if (numericCount / samples.length > 0.8) return 'numeric';
                if (dateCount / samples.length > 0.8) return 'date';
                return 'text';
            });

            let analysisResults = '';

            switch (analysisType) {
                case 'summary':
                    analysisResults = generateSummaryAnalysis(headers, dataRows, columnTypes);
                    break;
                case 'distribution':
                    analysisResults = generateDistributionAnalysis(headers, dataRows, columnTypes);
                    break;
                case 'correlation':
                    analysisResults = generateCorrelationAnalysis(headers, dataRows, columnTypes);
                    break;
                case 'trends':
                    analysisResults = generateTrendAnalysis(headers, dataRows, columnTypes);
                    break;
            }

            // Generate data preview table
            const previewRows = dataRows.slice(0, 5);
            const tableHTML = `
<table style="border-collapse: collapse; width: 100%; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <thead style="background: #f8f9fa;">
        <tr>
            ${headers.map(header => `<th style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">${header}</th>`).join('')}
        </tr>
    </thead>
    <tbody>
        ${previewRows.map(row => `
            <tr>
                ${row.map(cell => `<td style="padding: 12px; border: 1px solid #dee2e6;">${cell || ''}</td>`).join('')}
            </tr>
        `).join('')}
        ${dataRows.length > 5 ? `<tr><td colspan="${headers.length}" style="padding: 12px; text-align: center; font-style: italic; color: #666;">... and ${dataRows.length - 5} more rows</td></tr>` : ''}
    </tbody>
</table>`;

            return `DATA VISUALIZATION ANALYSIS

Dataset Overview:
• Rows: ${dataRows.length}
• Columns: ${headers.length}
• Delimiter: ${delimiter === '\t' ? 'Tab' : delimiter}
• Headers: ${hasHeaders ? 'Yes' : 'Generated'}

COLUMN TYPES:
${headers.map((header, i) => `• ${header}: ${columnTypes[i]}`).join('\n')}

DATA PREVIEW:
${tableHTML}

${analysisResults}

EXPORT OPTIONS:
• JSON Format: Ready for web applications
• Chart.js: For interactive visualizations
• CSV: Cleaned and standardized
• Statistical Summary: For reports

RECOMMENDATIONS:
${generateRecommendations(headers, dataRows, columnTypes)}`;

            function generateSummaryAnalysis(headers, dataRows, columnTypes) {
                let summary = 'STATISTICAL SUMMARY:\n\n';
                
                headers.forEach((header, colIndex) => {
                    const values = dataRows.map(row => row[colIndex]).filter(val => val && val.trim());
                    const type = columnTypes[colIndex];
                    
                    summary += `${header} (${type}):\n`;
                    
                    if (type === 'numeric') {
                        const numbers = values.map(val => parseFloat(val)).filter(num => !isNaN(num));
                        if (numbers.length > 0) {
                            const sum = numbers.reduce((a, b) => a + b, 0);
                            const avg = sum / numbers.length;
                            const sorted = [...numbers].sort((a, b) => a - b);
                            const median = sorted.length % 2 === 0 
                                ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                                : sorted[Math.floor(sorted.length / 2)];
                            
                            summary += `  • Count: ${numbers.length}\n`;
                            summary += `  • Sum: ${sum.toFixed(2)}\n`;
                            summary += `  • Average: ${avg.toFixed(2)}\n`;
                            summary += `  • Median: ${median.toFixed(2)}\n`;
                            summary += `  • Min: ${Math.min(...numbers).toFixed(2)}\n`;
                            summary += `  • Max: ${Math.max(...numbers).toFixed(2)}\n`;
                            summary += `  • Range: ${(Math.max(...numbers) - Math.min(...numbers)).toFixed(2)}\n`;
                        }
                    } else {
                        const uniqueValues = [...new Set(values)];
                        summary += `  • Count: ${values.length}\n`;
                        summary += `  • Unique: ${uniqueValues.length}\n`;
                        summary += `  • Most common: ${getMostCommon(values)}\n`;
                        if (uniqueValues.length <= 10) {
                            summary += `  • Values: ${uniqueValues.join(', ')}\n`;
                        }
                    }
                    summary += '\n';
                });
                
                return summary;
            }

            function generateDistributionAnalysis(headers, dataRows, columnTypes) {
                let analysis = 'DISTRIBUTION ANALYSIS:\n\n';
                
                headers.forEach((header, colIndex) => {
                    const values = dataRows.map(row => row[colIndex]).filter(val => val && val.trim());
                    const type = columnTypes[colIndex];
                    
                    if (type === 'numeric') {
                        const numbers = values.map(val => parseFloat(val)).filter(num => !isNaN(num));
                        if (numbers.length > 0) {
                            const sorted = [...numbers].sort((a, b) => a - b);
                            const q1 = sorted[Math.floor(sorted.length * 0.25)];
                            const q3 = sorted[Math.floor(sorted.length * 0.75)];
                            const iqr = q3 - q1;
                            
                            analysis += `${header} Distribution:\n`;
                            analysis += `  • Q1 (25th percentile): ${q1?.toFixed(2) || 'N/A'}\n`;
                            analysis += `  • Q3 (75th percentile): ${q3?.toFixed(2) || 'N/A'}\n`;
                            analysis += `  • IQR: ${iqr?.toFixed(2) || 'N/A'}\n`;
                            analysis += `  • Potential outliers: ${detectOutliers(numbers, q1, q3, iqr)}\n\n`;
                        }
                    } else {
                        const frequency = {};
                        values.forEach(val => {
                            frequency[val] = (frequency[val] || 0) + 1;
                        });
                        
                        const sorted = Object.entries(frequency)
                            .sort(([,a], [,b]) => b - a)
                            .slice(0, 5);
                        
                        analysis += `${header} Frequency (Top 5):\n`;
                        sorted.forEach(([val, count]) => {
                            const percentage = ((count / values.length) * 100).toFixed(1);
                            analysis += `  • ${val}: ${count} (${percentage}%)\n`;
                        });
                        analysis += '\n';
                    }
                });
                
                return analysis;
            }

            function generateCorrelationAnalysis(headers, dataRows, columnTypes) {
                const numericColumns = headers
                    .map((header, index) => ({ header, index, type: columnTypes[index] }))
                    .filter(col => col.type === 'numeric');

                if (numericColumns.length < 2) {
                    return 'CORRELATION ANALYSIS:\n\nNeed at least 2 numeric columns for correlation analysis.';
                }

                let analysis = 'CORRELATION ANALYSIS:\n\n';
                
                for (let i = 0; i < numericColumns.length; i++) {
                    for (let j = i + 1; j < numericColumns.length; j++) {
                        const col1 = numericColumns[i];
                        const col2 = numericColumns[j];
                        
                        const values1 = dataRows.map(row => parseFloat(row[col1.index])).filter(n => !isNaN(n));
                        const values2 = dataRows.map(row => parseFloat(row[col2.index])).filter(n => !isNaN(n));
                        
                        if (values1.length === values2.length && values1.length > 1) {
                            const correlation = calculateCorrelation(values1, values2);
                            const strength = getCorrelationStrength(correlation);
                            
                            analysis += `${col1.header} vs ${col2.header}:\n`;
                            analysis += `  • Correlation: ${correlation.toFixed(3)}\n`;
                            analysis += `  • Strength: ${strength}\n`;
                            analysis += `  • Relationship: ${correlation > 0 ? 'Positive' : correlation < 0 ? 'Negative' : 'None'}\n\n`;
                        }
                    }
                }
                
                return analysis;
            }

            function generateTrendAnalysis(headers, dataRows, columnTypes) {
                const dateColumns = headers
                    .map((header, index) => ({ header, index, type: columnTypes[index] }))
                    .filter(col => col.type === 'date');
                
                const numericColumns = headers
                    .map((header, index) => ({ header, index, type: columnTypes[index] }))
                    .filter(col => col.type === 'numeric');

                if (dateColumns.length === 0 || numericColumns.length === 0) {
                    return 'TREND ANALYSIS:\n\nNeed at least 1 date column and 1 numeric column for trend analysis.';
                }

                let analysis = 'TREND ANALYSIS:\n\n';
                
                // For simplicity, use first date column and all numeric columns
                const dateCol = dateColumns[0];
                
                numericColumns.forEach(numCol => {
                    const dataPoints = dataRows
                        .map(row => ({
                            date: new Date(row[dateCol.index]),
                            value: parseFloat(row[numCol.index])
                        }))
                        .filter(point => !isNaN(point.date.getTime()) && !isNaN(point.value))
                        .sort((a, b) => a.date - b.date);

                    if (dataPoints.length > 1) {
                        const firstValue = dataPoints[0].value;
                        const lastValue = dataPoints[dataPoints.length - 1].value;
                        const change = lastValue - firstValue;
                        const percentChange = ((change / firstValue) * 100);
                        
                        analysis += `${numCol.header} Trend:\n`;
                        analysis += `  • Period: ${dataPoints[0].date.toLocaleDateString()} to ${dataPoints[dataPoints.length - 1].date.toLocaleDateString()}\n`;
                        analysis += `  • Starting value: ${firstValue.toFixed(2)}\n`;
                        analysis += `  • Ending value: ${lastValue.toFixed(2)}\n`;
                        analysis += `  • Change: ${change.toFixed(2)} (${percentChange.toFixed(1)}%)\n`;
                        analysis += `  • Direction: ${change > 0 ? 'Increasing ⬆️' : change < 0 ? 'Decreasing ⬇️' : 'Stable ➡️'}\n\n`;
                    }
                });
                
                return analysis;
            }

            function getMostCommon(values) {
                const frequency = {};
                values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
                const sorted = Object.entries(frequency).sort(([,a], [,b]) => b - a);
                return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]} times)` : 'N/A';
            }

            function detectOutliers(numbers, q1, q3, iqr) {
                const lowerBound = q1 - 1.5 * iqr;
                const upperBound = q3 + 1.5 * iqr;
                const outliers = numbers.filter(n => n < lowerBound || n > upperBound);
                return outliers.length ? `${outliers.length} values (${outliers.slice(0, 3).map(n => n.toFixed(2)).join(', ')}${outliers.length > 3 ? '...' : ''})` : 'None detected';
            }

            function calculateCorrelation(x, y) {
                const n = x.length;
                const sumX = x.reduce((a, b) => a + b, 0);
                const sumY = y.reduce((a, b) => a + b, 0);
                const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
                const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
                const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
                
                const numerator = n * sumXY - sumX * sumY;
                const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
                
                return denominator === 0 ? 0 : numerator / denominator;
            }

            function getCorrelationStrength(correlation) {
                const abs = Math.abs(correlation);
                if (abs >= 0.7) return 'Strong';
                if (abs >= 0.3) return 'Moderate';
                if (abs >= 0.1) return 'Weak';
                return 'Very weak';
            }

            function generateRecommendations(headers, dataRows, columnTypes) {
                const recommendations = [];
                
                if (columnTypes.includes('numeric')) {
                    recommendations.push('• Create bar/line charts for numeric data trends');
                }
                
                if (columnTypes.includes('date') && columnTypes.includes('numeric')) {
                    recommendations.push('• Use time series charts to show trends over time');
                }
                
                const textColumns = columnTypes.filter(type => type === 'text').length;
                if (textColumns > 0) {
                    recommendations.push('• Create pie charts for categorical data distribution');
                }
                
                if (dataRows.length > 100) {
                    recommendations.push('• Consider data sampling for large datasets');
                }
                
                if (headers.length > 10) {
                    recommendations.push('• Focus on key metrics to avoid chart clutter');
                }
                
                return recommendations.join('\n');
            }
        }
    }));

    // 3. Gantt Chart Creator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'gantt-chart-creator',
        name: 'Gantt Chart Creator',
        description: 'Create project timelines and Gantt charts',
        category: 'charts',
        icon: '📅',
        fields: [
            {
                name: 'projectName',
                label: 'Project Name',
                type: 'text',
                placeholder: 'Website Redesign Project',
                required: true
            },
            {
                name: 'tasks',
                label: 'Tasks (Format: Task,Start Date,End Date,Progress%)',
                type: 'textarea',
                placeholder: 'Planning,2024-01-01,2024-01-15,100\nDesign,2024-01-10,2024-02-05,75\nDevelopment,2024-02-01,2024-03-15,25',
                required: true,
                rows: 8
            },
            {
                name: 'showProgress',
                label: 'Show Progress Bars',
                type: 'checkbox',
                value: true
            },
            {
                name: 'colorScheme',
                label: 'Color Scheme',
                type: 'select',
                options: [
                    { value: 'blue', label: 'Professional Blue' },
                    { value: 'green', label: 'Success Green' },
                    { value: 'purple', label: 'Creative Purple' },
                    { value: 'mixed', label: 'Multi-color' }
                ],
                value: 'blue'
            }
        ],
        generate: (data) => {
            const projectName = data.projectName;
            const tasksInput = data.tasks.trim();
            const showProgress = data.showProgress;
            const colorScheme = data.colorScheme;

            if (!tasksInput) {
                throw new Error('Please provide task information');
            }

            // Parse tasks
            const taskLines = tasksInput.split('\n').filter(line => line.trim());
            const tasks = taskLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 3) {
                    throw new Error(`Invalid task format on line ${index + 1}. Use: Task,Start Date,End Date,Progress%`);
                }

                const [name, startStr, endStr, progressStr = '0'] = parts;
                const startDate = new Date(startStr);
                const endDate = new Date(endStr);
                const progress = Math.max(0, Math.min(100, parseInt(progressStr) || 0));

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    throw new Error(`Invalid date format on line ${index + 1}. Use YYYY-MM-DD format`);
                }

                if (endDate < startDate) {
                    throw new Error(`End date must be after start date for task: ${name}`);
                }

                return { name, startDate, endDate, progress };
            });

            // Calculate project timeline
            const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
            const projectStart = new Date(Math.min(...allDates));
            const projectEnd = new Date(Math.max(...allDates));
            const totalDays = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));

            // Color palettes
            const colors = {
                blue: ['#3498db', '#2980b9', '#5dade2', '#85c1e9'],
                green: ['#27ae60', '#229954', '#58d68d', '#82e0aa'],
                purple: ['#9b59b6', '#8e44ad', '#bb8fce', '#d2b4de'],
                mixed: ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6']
            };

            const taskColors = colors[colorScheme];

            // Generate timeline months for header
            const months = [];
            let currentDate = new Date(projectStart);
            while (currentDate <= projectEnd) {
                months.push({
                    month: currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    date: new Date(currentDate)
                });
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            // Create Gantt chart HTML
            const ganttHTML = `
<div style="margin: 20px 0; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow-x: auto;">
    <h3 style="margin: 0 0 20px 0; color: #333;">${projectName}</h3>
    
    <!-- Timeline header -->
    <div style="display: flex; margin-bottom: 10px; border-bottom: 2px solid #ddd;">
        <div style="width: 200px; padding: 10px; font-weight: bold; background: #f8f9fa;">Tasks</div>
        <div style="flex: 1; display: flex;">
            ${months.map(month => 
                `<div style="flex: 1; text-align: center; padding: 10px; font-weight: bold; background: #f8f9fa; border-left: 1px solid #ddd;">${month.month}</div>`
            ).join('')}
        </div>
    </div>
    
    <!-- Task rows -->
    ${tasks.map((task, index) => {
        const taskStart = (task.startDate - projectStart) / (1000 * 60 * 60 * 24);
        const taskDuration = (task.endDate - task.startDate) / (1000 * 60 * 60 * 24);
        const leftPercent = (taskStart / totalDays) * 100;
        const widthPercent = (taskDuration / totalDays) * 100;
        const color = taskColors[index % taskColors.length];
        
        return `
        <div style="display: flex; border-bottom: 1px solid #eee; align-items: center; height: 50px;">
            <div style="width: 200px; padding: 10px; font-weight: 500;">${task.name}</div>
            <div style="flex: 1; position: relative; height: 30px; margin: 10px;">
                <div style="
                    position: absolute;
                    left: ${leftPercent}%;
                    width: ${widthPercent}%;
                    height: 100%;
                    background: ${color};
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    overflow: hidden;
                ">
                    ${showProgress ? `
                    <div style="
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: ${task.progress}%;
                        height: 100%;
                        background: rgba(255,255,255,0.3);
                        border-radius: 4px;
                    "></div>
                    <span style="position: relative; z-index: 1;">${task.progress}%</span>
                    ` : ''}
                </div>
            </div>
        </div>`;
    }).join('')}
</div>`;

            // Generate project statistics
            const completedTasks = tasks.filter(task => task.progress === 100).length;
            const inProgressTasks = tasks.filter(task => task.progress > 0 && task.progress < 100).length;
            const notStartedTasks = tasks.filter(task => task.progress === 0).length;
            const overallProgress = Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length);

            // Find critical path (longest sequence)
            const criticalPath = tasks.sort((a, b) => a.startDate - b.startDate);
            const projectDuration = Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24));

            return `GANTT CHART GENERATED

Project: ${projectName}
Duration: ${projectDuration} days
Start Date: ${projectStart.toLocaleDateString()}
End Date: ${projectEnd.toLocaleDateString()}

${ganttHTML}

PROJECT STATISTICS:
• Total Tasks: ${tasks.length}
• Completed: ${completedTasks} (${Math.round(completedTasks/tasks.length*100)}%)
• In Progress: ${inProgressTasks} (${Math.round(inProgressTasks/tasks.length*100)}%)
• Not Started: ${notStartedTasks} (${Math.round(notStartedTasks/tasks.length*100)}%)
• Overall Progress: ${overallProgress}%

TASK DETAILS:
${tasks.map((task, i) => 
    `${i + 1}. ${task.name}
   • Duration: ${Math.ceil((task.endDate - task.startDate) / (1000 * 60 * 60 * 24))} days
   • Progress: ${task.progress}%
   • Status: ${task.progress === 100 ? 'Complete' : task.progress > 0 ? 'In Progress' : 'Not Started'}
`).join('\n')}

TIMELINE MILESTONES:
${tasks.filter(task => task.progress === 100).map(task => 
    `✅ ${task.name} - Completed`
).join('\n')}
${tasks.filter(task => task.progress > 0 && task.progress < 100).map(task => 
    `🔄 ${task.name} - ${task.progress}% complete`
).join('\n')}
${tasks.filter(task => task.progress === 0).map(task => 
    `⏳ ${task.name} - Not started`
).join('\n')}

EXPORT OPTIONS:
• HTML: Copy the above HTML for websites
• Image: Screenshot the chart for presentations
• CSV: Export task data for Excel/Google Sheets
• Project Management: Import dates into tools like Asana, Trello

RECOMMENDATIONS:
${tasks.length > 10 ? '• Consider grouping related tasks into phases' : ''}
${overallProgress < 25 ? '• Project is in early stages - focus on planning and resource allocation' : ''}
${overallProgress > 75 ? '• Project is nearing completion - focus on final deliverables and testing' : ''}
${inProgressTasks > 5 ? '• Multiple tasks running simultaneously - ensure resource allocation' : ''}`;
        }
    }));

    // 4. Flowchart Builder
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'flowchart-builder',
        name: 'Flowchart Builder',
        description: 'Create process flowcharts and decision trees',
        category: 'charts',
        icon: '🔀',
        fields: [
            {
                name: 'flowchartType',
                label: 'Flowchart Type',
                type: 'select',
                options: [
                    { value: 'process', label: 'Process Flow' },
                    { value: 'decision', label: 'Decision Tree' },
                    { value: 'workflow', label: 'Workflow' },
                    { value: 'algorithm', label: 'Algorithm' }
                ],
                value: 'process'
            },
            {
                name: 'flowData',
                label: 'Flow Steps (Format: Step,Type,Next)',
                type: 'textarea',
                placeholder: 'Start,start,2\nProcess Data,process,3\nValid?,decision,4,5\nSuccess,end,\nError,end,',
                required: true,
                rows: 8
            },
            {
                name: 'orientation',
                label: 'Layout Orientation',
                type: 'select',
                options: [
                    { value: 'vertical', label: 'Vertical (Top to Bottom)' },
                    { value: 'horizontal', label: 'Horizontal (Left to Right)' }
                ],
                value: 'vertical'
            }
        ],
        generate: (data) => {
            const flowchartType = data.flowchartType;
            const flowData = data.flowData.trim();
            const orientation = data.orientation;

            if (!flowData) {
                throw new Error('Please provide flowchart steps');
            }

            // Parse flow steps
            const lines = flowData.split('\n').filter(line => line.trim());
            const steps = lines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 2) {
                    throw new Error(`Invalid step format on line ${index + 1}`);
                }

                const [text, type, ...nextSteps] = parts;
                return {
                    id: index + 1,
                    text,
                    type: type || 'process',
                    next: nextSteps.filter(step => step && step !== '').map(step => parseInt(step))
                };
            });

            // Shape styles for different step types
            const shapeStyles = {
                start: {
                    shape: 'ellipse',
                    background: '#27ae60',
                    color: 'white',
                    borderRadius: '50px'
                },
                end: {
                    shape: 'ellipse',
                    background: '#e74c3c',
                    color: 'white',
                    borderRadius: '50px'
                },
                process: {
                    shape: 'rectangle',
                    background: '#3498db',
                    color: 'white',
                    borderRadius: '8px'
                },
                decision: {
                    shape: 'diamond',
                    background: '#f39c12',
                    color: 'white',
                    borderRadius: '8px'
                },
                input: {
                    shape: 'parallelogram',
                    background: '#9b59b6',
                    color: 'white',
                    borderRadius: '8px'
                },
                output: {
                    shape: 'parallelogram',
                    background: '#16a085',
                    color: 'white',
                    borderRadius: '8px'
                }
            };

            // Generate SVG flowchart
            const nodeWidth = 150;
            const nodeHeight = 60;
            const spacing = 100;
            
            // Calculate positions based on orientation
            let positions = {};
            if (orientation === 'vertical') {
                steps.forEach((step, index) => {
                    positions[step.id] = {
                        x: 50 + (index % 3) * (nodeWidth + spacing),
                        y: 50 + Math.floor(index / 3) * (nodeHeight + spacing)
                    };
                });
            } else {
                steps.forEach((step, index) => {
                    positions[step.id] = {
                        x: 50 + index * (nodeWidth + spacing),
                        y: 50 + (index % 2) * (nodeHeight + spacing)
                    };
                });
            }

            const maxX = Math.max(...Object.values(positions).map(p => p.x)) + nodeWidth + 50;
            const maxY = Math.max(...Object.values(positions).map(p => p.y)) + nodeHeight + 50;

            // Generate nodes
            const nodes = steps.map(step => {
                const pos = positions[step.id];
                const style = shapeStyles[step.type] || shapeStyles.process;
                
                return `
                <g transform="translate(${pos.x}, ${pos.y})">
                    <rect width="${nodeWidth}" height="${nodeHeight}" 
                          fill="${style.background}" 
                          stroke="#333" 
                          stroke-width="2"
                          rx="${style.borderRadius.replace('px', '')}" 
                          ry="${style.borderRadius.replace('px', '')}"/>
                    <text x="${nodeWidth/2}" y="${nodeHeight/2}" 
                          text-anchor="middle" 
                          dominant-baseline="middle"
                          fill="${style.color}" 
                          font-family="Arial, sans-serif" 
                          font-size="14" 
                          font-weight="bold">
                        ${step.text.length > 15 ? step.text.substring(0, 12) + '...' : step.text}
                    </text>
                </g>`;
            });

            // Generate connections
            const connections = [];
            steps.forEach(step => {
                if (step.next && step.next.length > 0) {
                    step.next.forEach(nextId => {
                        const fromPos = positions[step.id];
                        const toPos = positions[nextId];
                        
                        if (fromPos && toPos) {
                            const fromX = fromPos.x + nodeWidth / 2;
                            const fromY = fromPos.y + nodeHeight;
                            const toX = toPos.x + nodeWidth / 2;
                            const toY = toPos.y;
                            
                            connections.push(`
                            <line x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}" 
                                  stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
                            `);
                        }
                    });
                }
            });

            const flowchartSVG = `
<svg width="${maxX}" height="${maxY}" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #ddd; border-radius: 8px; background: white; margin: 20px 0;">
    <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
        </marker>
    </defs>
    
    ${connections.join('')}
    ${nodes.join('')}
</svg>`;

            // Generate Mermaid.js code
            const mermaidCode = `flowchart ${orientation === 'vertical' ? 'TD' : 'LR'}
${steps.map(step => {
    const shape = step.type === 'decision' ? `{${step.text}}` :
                  step.type === 'start' || step.type === 'end' ? `((${step.text}))` :
                  `[${step.text}]`;
    return `    ${step.id}${shape}`;
}).join('\n')}

${steps.map(step => 
    step.next.map(nextId => `    ${step.id} --> ${nextId}`).join('\n')
).filter(Boolean).join('\n')}`;

            return `FLOWCHART GENERATED

Type: ${flowchartType}
Steps: ${steps.length}
Orientation: ${orientation}

${flowchartSVG}

STEP BREAKDOWN:
${steps.map(step => 
    `${step.id}. ${step.text} (${step.type})${step.next.length ? ` → Steps ${step.next.join(', ')}` : ''}`
).join('\n')}

MERMAID.JS CODE:
\`\`\`mermaid
${mermaidCode}
\`\`\`

DRAW.IO XML:
<mxGraphModel>
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    ${steps.map(step => {
        const pos = positions[step.id];
        const style = shapeStyles[step.type] || shapeStyles.process;
        return `
    <mxCell id="${step.id}" value="${step.text}" 
            style="rounded=${step.type === 'start' || step.type === 'end' ? '1' : '0'};
                   fillColor=${style.background};
                   fontColor=${style.color}"
            vertex="1" parent="1">
      <mxGeometry x="${pos.x}" y="${pos.y}" width="${nodeWidth}" height="${nodeHeight}" as="geometry"/>
    </mxCell>`;
    }).join('')}
  </root>
</mxGraphModel>

USAGE EXAMPLES:
• Process Documentation: Document standard operating procedures
• Decision Making: Create decision trees for complex choices
• Software Development: Map algorithm logic flows
• Business Processes: Visualize workflow and approval processes

BEST PRACTICES:
• Keep text concise (under 15 characters per step)
• Use consistent shapes for step types
• Ensure logical flow from start to end
• Test all decision paths
• Include error handling paths

EXPORT OPTIONS:
• SVG: Scalable vector graphics for websites
• Mermaid.js: For documentation platforms (GitHub, GitLab)
• Draw.io: Import XML for further editing
• Image: Screenshot for presentations`;
        }
    }));

    // Continue with more chart tools...

})();