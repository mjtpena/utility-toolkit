// Additional Chart & Visualization Tools
(function() {
    'use strict';

    // 5. Dashboard Metrics Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'dashboard-metrics-generator',
        name: 'Dashboard Metrics Generator',
        description: 'Create KPI dashboards and metric displays',
        category: 'charts',
        icon: '📊',
        fields: [
            {
                name: 'dashboardTitle',
                label: 'Dashboard Title',
                type: 'text',
                placeholder: 'Q4 2024 Performance Dashboard',
                required: true
            },
            {
                name: 'metrics',
                label: 'Metrics (Format: Name,Value,Target,Unit,Type)',
                type: 'textarea',
                placeholder: 'Revenue,125000,100000,$,currency\nUsers,5420,5000,,number\nConversion,3.2,4.0,%,percentage\nSales,89,100,,number',
                required: true,
                rows: 6
            },
            {
                name: 'layout',
                label: 'Dashboard Layout',
                type: 'select',
                options: [
                    { value: 'grid', label: 'Grid Layout' },
                    { value: 'cards', label: 'Card Layout' },
                    { value: 'tiles', label: 'Tile Layout' }
                ],
                value: 'cards'
            },
            {
                name: 'theme',
                label: 'Color Theme',
                type: 'select',
                options: [
                    { value: 'professional', label: 'Professional Blue' },
                    { value: 'success', label: 'Success Green' },
                    { value: 'modern', label: 'Modern Dark' },
                    { value: 'vibrant', label: 'Vibrant Colors' }
                ],
                value: 'professional'
            }
        ],
        generate: (data) => {
            const title = data.dashboardTitle;
            const metricsInput = data.metrics.trim();
            const layout = data.layout;
            const theme = data.theme;

            if (!metricsInput) {
                throw new Error('Please provide metrics data');
            }

            // Parse metrics
            const metricLines = metricsInput.split('\n').filter(line => line.trim());
            const metrics = metricLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 3) {
                    throw new Error(`Invalid metric format on line ${index + 1}. Use: Name,Value,Target,Unit,Type`);
                }

                const [name, valueStr, targetStr, unit = '', type = 'number'] = parts;
                const value = parseFloat(valueStr) || 0;
                const target = parseFloat(targetStr) || 0;
                const performance = target > 0 ? ((value / target) * 100) : 100;
                const status = performance >= 100 ? 'success' : performance >= 75 ? 'warning' : 'danger';

                return { name, value, target, unit, type, performance, status };
            });

            // Theme configurations
            const themes = {
                professional: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    cardBg: '#ffffff',
                    textColor: '#333',
                    successColor: '#28a745',
                    warningColor: '#ffc107',
                    dangerColor: '#dc3545',
                    borderColor: '#e9ecef'
                },
                success: {
                    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    cardBg: '#ffffff',
                    textColor: '#333',
                    successColor: '#155724',
                    warningColor: '#856404',
                    dangerColor: '#721c24',
                    borderColor: '#c3e6cb'
                },
                modern: {
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                    cardBg: '#ffffff',
                    textColor: '#333',
                    successColor: '#00d4aa',
                    warningColor: '#ffb400',
                    dangerColor: '#ff6b6b',
                    borderColor: '#dee2e6'
                },
                vibrant: {
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa726 50%, #42a5f5 100%)',
                    cardBg: '#ffffff',
                    textColor: '#333',
                    successColor: '#4caf50',
                    warningColor: '#ff9800',
                    dangerColor: '#f44336',
                    borderColor: '#e1bee7'
                }
            };

            const currentTheme = themes[theme];

            // Format values based on type
            const formatValue = (metric) => {
                const { value, unit, type } = metric;
                
                switch (type) {
                    case 'currency':
                        return `${unit}${value.toLocaleString()}`;
                    case 'percentage':
                        return `${value.toFixed(1)}${unit}`;
                    case 'number':
                        return `${value.toLocaleString()}${unit}`;
                    default:
                        return `${value}${unit}`;
                }
            };

            // Generate metric cards
            const generateCard = (metric, index) => {
                const statusColor = currentTheme[`${metric.status}Color`];
                const progressWidth = Math.min(100, Math.max(0, metric.performance));
                
                return `
                <div class="metric-card" style="
                    background: ${currentTheme.cardBg};
                    border: 1px solid ${currentTheme.borderColor};
                    border-radius: 12px;
                    padding: 24px;
                    margin: 10px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    min-width: 250px;
                    position: relative;
                    overflow: hidden;
                ">
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 4px;
                        height: 100%;
                        background: ${statusColor};
                    "></div>
                    
                    <div style="margin-left: 8px;">
                        <h3 style="
                            margin: 0 0 8px 0;
                            color: ${currentTheme.textColor};
                            font-size: 16px;
                            font-weight: 600;
                        ">${metric.name}</h3>
                        
                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            color: ${statusColor};
                            margin: 8px 0;
                        ">${formatValue(metric)}</div>
                        
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-top: 12px;
                            font-size: 14px;
                            color: #666;
                        ">
                            <span>Target: ${formatValue({...metric, value: metric.target})}</span>
                            <span style="
                                color: ${statusColor};
                                font-weight: bold;
                            ">${metric.performance.toFixed(1)}%</span>
                        </div>
                        
                        <div style="
                            width: 100%;
                            height: 8px;
                            background: #f0f0f0;
                            border-radius: 4px;
                            margin-top: 8px;
                            overflow: hidden;
                        ">
                            <div style="
                                width: ${progressWidth}%;
                                height: 100%;
                                background: ${statusColor};
                                border-radius: 4px;
                                transition: width 0.3s ease;
                            "></div>
                        </div>
                    </div>
                </div>`;
            };

            // Generate layout
            const layoutStyles = {
                grid: `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;`,
                cards: `display: flex; flex-wrap: wrap; justify-content: center;`,
                tiles: `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;`
            };

            const dashboardHTML = `
<div style="
    background: ${currentTheme.background};
    padding: 30px;
    border-radius: 16px;
    margin: 20px 0;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
">
    <h2 style="
        text-align: center;
        margin: 0 0 30px 0;
        color: white;
        font-size: 28px;
        font-weight: 700;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${title}</h2>
    
    <div style="${layoutStyles[layout]}">
        ${metrics.map(generateCard).join('')}
    </div>
    
    <div style="
        margin-top: 30px;
        text-align: center;
        color: rgba(255,255,255,0.8);
        font-size: 14px;
    ">
        Last updated: ${new Date().toLocaleString()}
    </div>
</div>`;

            // Calculate overall performance
            const overallPerformance = metrics.reduce((sum, metric) => sum + metric.performance, 0) / metrics.length;
            const successCount = metrics.filter(m => m.status === 'success').length;
            const warningCount = metrics.filter(m => m.status === 'warning').length;
            const dangerCount = metrics.filter(m => m.status === 'danger').length;

            return `DASHBOARD METRICS GENERATED

Title: ${title}
Total Metrics: ${metrics.length}
Layout: ${layout}
Theme: ${theme}

${dashboardHTML}

PERFORMANCE SUMMARY:
• Overall Performance: ${overallPerformance.toFixed(1)}%
• Exceeding Target: ${successCount} metrics (${((successCount/metrics.length)*100).toFixed(0)}%)
• Near Target: ${warningCount} metrics (${((warningCount/metrics.length)*100).toFixed(0)}%)
• Below Target: ${dangerCount} metrics (${((dangerCount/metrics.length)*100).toFixed(0)}%)

DETAILED METRICS:
${metrics.map((metric, i) => 
    `${i + 1}. ${metric.name}
   • Current: ${formatValue(metric)}
   • Target: ${formatValue({...metric, value: metric.target})}
   • Performance: ${metric.performance.toFixed(1)}% (${metric.status.toUpperCase()})
   • Gap: ${(metric.value - metric.target).toFixed(0)}${metric.unit}
`).join('\n')}

CSS STYLES:
.dashboard-container {
    background: ${currentTheme.background};
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.metric-card {
    background: ${currentTheme.cardBg};
    border: 1px solid ${currentTheme.borderColor};
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.metric-card:hover {
    transform: translateY(-4px);
}

JAVASCRIPT INTERACTIVITY:
// Add click handlers for drill-down
document.querySelectorAll('.metric-card').forEach(card => {
    card.addEventListener('click', function() {
        // Add drill-down functionality
        console.log('Metric clicked:', this.querySelector('h3').textContent);
    });
});

// Auto-refresh dashboard
setInterval(() => {
    // Update metrics data
    console.log('Dashboard refreshed');
}, 60000); // Every minute

EXPORT OPTIONS:
• HTML: Copy dashboard HTML for websites
• CSS: Extract styles for custom implementations
• JSON: Export metric data for APIs
• Image: Screenshot for presentations

INTEGRATIONS:
• Google Analytics: Connect to web metrics
• Database: Pull live data from SQL queries
• APIs: Integrate with business systems
• Excel: Import from spreadsheet data

RECOMMENDATIONS:
${overallPerformance < 75 ? '⚠️ Overall performance below target - review underperforming metrics' : ''}
${dangerCount > metrics.length / 2 ? '🔴 Majority of metrics below target - strategic review needed' : ''}
${successCount === metrics.length ? '🎉 All metrics exceeding targets - consider raising targets' : ''}
${warningCount > 0 ? `⚡ ${warningCount} metrics near target - monitor closely` : ''}`;
        }
    }));

    // 6. Organizational Chart Creator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'org-chart-creator',
        name: 'Organizational Chart Creator',
        description: 'Create company organizational charts and hierarchies',
        category: 'charts',
        icon: '🏢',
        fields: [
            {
                name: 'companyName',
                label: 'Company/Department Name',
                type: 'text',
                placeholder: 'Acme Corporation',
                required: true
            },
            {
                name: 'orgData',
                label: 'Organization Data (Format: Name,Title,Manager,Level)',
                type: 'textarea',
                placeholder: 'John Smith,CEO,,1\nJane Doe,CTO,John Smith,2\nBob Wilson,Dev Manager,Jane Doe,3\nAlice Johnson,Developer,Bob Wilson,4',
                required: true,
                rows: 8
            },
            {
                name: 'includePhotos',
                label: 'Include Photo Placeholders',
                type: 'checkbox',
                value: false
            },
            {
                name: 'chartStyle',
                label: 'Chart Style',
                type: 'select',
                options: [
                    { value: 'modern', label: 'Modern Flat' },
                    { value: 'classic', label: 'Classic Boxes' },
                    { value: 'minimal', label: 'Minimal Lines' },
                    { value: 'corporate', label: 'Corporate Blue' }
                ],
                value: 'modern'
            }
        ],
        generate: (data) => {
            const companyName = data.companyName;
            const orgDataInput = data.orgData.trim();
            const includePhotos = data.includePhotos;
            const chartStyle = data.chartStyle;

            if (!orgDataInput) {
                throw new Error('Please provide organization data');
            }

            // Parse organization data
            const orgLines = orgDataInput.split('\n').filter(line => line.trim());
            const employees = orgLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 2) {
                    throw new Error(`Invalid employee format on line ${index + 1}. Use: Name,Title,Manager,Level`);
                }

                const [name, title, manager = '', levelStr = '1'] = parts;
                const level = parseInt(levelStr) || 1;

                return { name, title, manager: manager || null, level };
            });

            // Build hierarchy
            const buildHierarchy = (employees) => {
                const hierarchy = {};
                const roots = [];

                // Create employee lookup
                employees.forEach(emp => {
                    hierarchy[emp.name] = { ...emp, subordinates: [] };
                });

                // Build parent-child relationships
                employees.forEach(emp => {
                    if (emp.manager && hierarchy[emp.manager]) {
                        hierarchy[emp.manager].subordinates.push(hierarchy[emp.name]);
                    } else {
                        roots.push(hierarchy[emp.name]);
                    }
                });

                return { hierarchy, roots };
            };

            const { hierarchy, roots } = buildHierarchy(employees);

            // Style configurations
            const styles = {
                modern: {
                    cardBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: 'white',
                    borderColor: '#e9ecef',
                    shadowColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '12px'
                },
                classic: {
                    cardBg: '#ffffff',
                    textColor: '#333',
                    borderColor: '#333',
                    shadowColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '4px'
                },
                minimal: {
                    cardBg: '#f8f9fa',
                    textColor: '#333',
                    borderColor: '#dee2e6',
                    shadowColor: 'rgba(0,0,0,0.05)',
                    borderRadius: '8px'
                },
                corporate: {
                    cardBg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    textColor: 'white',
                    borderColor: '#2a5298',
                    shadowColor: 'rgba(0,0,0,0.15)',
                    borderRadius: '6px'
                }
            };

            const currentStyle = styles[chartStyle];

            // Generate employee card
            const generateEmployeeCard = (employee, isRoot = false) => {
                const photoPlaceholder = includePhotos ? `
                <div style="
                    width: 60px;
                    height: 60px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    margin: 0 auto 12px auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    color: ${currentStyle.textColor};
                ">👤</div>` : '';

                return `
                <div class="employee-card" style="
                    background: ${currentStyle.cardBg};
                    color: ${currentStyle.textColor};
                    padding: 20px;
                    margin: 10px;
                    border: 2px solid ${currentStyle.borderColor};
                    border-radius: ${currentStyle.borderRadius};
                    box-shadow: 0 4px 8px ${currentStyle.shadowColor};
                    text-align: center;
                    min-width: 180px;
                    max-width: 220px;
                    position: relative;
                    ${isRoot ? 'margin-bottom: 30px;' : ''}
                ">
                    ${photoPlaceholder}
                    <div style="
                        font-weight: bold;
                        font-size: 16px;
                        margin-bottom: 4px;
                        color: ${currentStyle.textColor};
                    ">${employee.name}</div>
                    <div style="
                        font-size: 14px;
                        opacity: 0.9;
                        color: ${currentStyle.textColor};
                    ">${employee.title}</div>
                    ${employee.level > 1 ? `<div style="
                        font-size: 12px;
                        margin-top: 8px;
                        opacity: 0.7;
                        color: ${currentStyle.textColor};
                    ">Reports to: ${employee.manager}</div>` : ''}
                </div>`;
            };

            // Generate hierarchical tree
            const generateTree = (employee, level = 0) => {
                const card = generateEmployeeCard(employee, level === 0);
                
                if (employee.subordinates.length === 0) {
                    return card;
                }

                const subordinatesHTML = employee.subordinates
                    .map(sub => generateTree(sub, level + 1))
                    .join('');

                return `
                <div class="org-level" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 20px 0;
                ">
                    ${card}
                    ${employee.subordinates.length > 0 ? `
                    <div style="
                        width: 2px;
                        height: 30px;
                        background: ${currentStyle.borderColor};
                        margin: 10px 0;
                    "></div>
                    <div style="
                        display: flex;
                        justify-content: center;
                        flex-wrap: wrap;
                        gap: 20px;
                    ">
                        ${subordinatesHTML}
                    </div>` : ''}
                </div>`;
            };

            // Generate complete org chart
            const orgChartHTML = `
            <div style="
                background: #ffffff;
                padding: 30px;
                border-radius: 16px;
                margin: 20px 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                text-align: center;
                overflow-x: auto;
            ">
                <h2 style="
                    margin: 0 0 30px 0;
                    color: #333;
                    font-size: 28px;
                    font-weight: 700;
                ">${companyName} - Organizational Chart</h2>
                
                <div class="org-chart" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    min-width: fit-content;
                ">
                    ${roots.map(root => generateTree(root)).join('')}
                </div>
                
                <div style="
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 14px;
                ">
                    Total Employees: ${employees.length} | Created: ${new Date().toLocaleDateString()}
                </div>
            </div>`;

            // Calculate statistics
            const levelCounts = {};
            employees.forEach(emp => {
                levelCounts[emp.level] = (levelCounts[emp.level] || 0) + 1;
            });

            const maxLevel = Math.max(...employees.map(emp => emp.level));
            const managersCount = employees.filter(emp => 
                employees.some(other => other.manager === emp.name)
            ).length;

            return `ORGANIZATIONAL CHART GENERATED

Company: ${companyName}
Total Employees: ${employees.length}
Management Levels: ${maxLevel}
Managers: ${managersCount}
Style: ${chartStyle}

${orgChartHTML}

HIERARCHY BREAKDOWN:
${Object.entries(levelCounts).map(([level, count]) => 
    `Level ${level}: ${count} ${count === 1 ? 'employee' : 'employees'}`
).join('\n')}

MANAGEMENT STRUCTURE:
${employees.filter(emp => 
    employees.some(other => other.manager === emp.name)
).map(manager => {
    const subordinates = employees.filter(emp => emp.manager === manager.name);
    return `${manager.name} (${manager.title}): ${subordinates.length} direct reports
   └─ ${subordinates.map(sub => sub.name).join(', ')}`;
}).join('\n\n')}

EMPLOYEE DIRECTORY:
${employees.map((emp, i) => 
    `${i + 1}. ${emp.name} - ${emp.title}${emp.manager ? ` (Reports to: ${emp.manager})` : ' (Top Level)'}`
).join('\n')}

CSS CLASSES:
.org-chart {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Arial', sans-serif;
}

.employee-card {
    background: ${currentStyle.cardBg};
    color: ${currentStyle.textColor};
    padding: 20px;
    border: 2px solid ${currentStyle.borderColor};
    border-radius: ${currentStyle.borderRadius};
    box-shadow: 0 4px 8px ${currentStyle.shadowColor};
    transition: transform 0.2s ease;
}

.employee-card:hover {
    transform: translateY(-4px);
}

INTERACTIVE FEATURES:
// Add click handlers for employee details
document.querySelectorAll('.employee-card').forEach(card => {
    card.addEventListener('click', function() {
        const name = this.querySelector('div').textContent;
        alert('Employee details for: ' + name);
    });
});

// Print functionality
function printOrgChart() {
    window.print();
}

EXPORT OPTIONS:
• HTML: Complete interactive org chart
• PDF: Print-ready format
• PNG/SVG: Image formats for presentations
• JSON: Employee data for HR systems

RECOMMENDATIONS:
${maxLevel > 5 ? '⚠️ Deep hierarchy detected - consider flattening structure' : ''}
${managersCount / employees.length > 0.5 ? '⚠️ High manager-to-employee ratio' : ''}
${employees.length > 50 ? '📊 Large organization - consider departmental breakdown' : ''}
${roots.length > 1 ? '🏢 Multiple top-level positions detected' : ''}`;
        }
    }));

    // 7. Timeline Generator  
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'timeline-generator',
        name: 'Timeline Generator',
        description: 'Create project timelines and historical timelines',
        category: 'charts',
        icon: '⏰',
        fields: [
            {
                name: 'timelineTitle',
                label: 'Timeline Title',
                type: 'text',
                placeholder: 'Product Development Timeline',
                required: true
            },
            {
                name: 'timelineData',
                label: 'Timeline Events (Format: Date,Event,Description,Type)',
                type: 'textarea',
                placeholder: '2024-01-01,Project Start,Initial planning phase,milestone\n2024-02-15,Design Complete,UI/UX designs finalized,milestone\n2024-03-01,Development,Start coding phase,task\n2024-04-30,Testing,QA testing phase,task\n2024-05-15,Launch,Product goes live,milestone',
                required: true,
                rows: 8
            },
            {
                name: 'orientation',
                label: 'Timeline Orientation',
                type: 'select',
                options: [
                    { value: 'horizontal', label: 'Horizontal' },
                    { value: 'vertical', label: 'Vertical' }
                ],
                value: 'horizontal'
            },
            {
                name: 'colorScheme',
                label: 'Color Scheme',
                type: 'select',
                options: [
                    { value: 'blue', label: 'Professional Blue' },
                    { value: 'green', label: 'Success Green' },
                    { value: 'purple', label: 'Creative Purple' },
                    { value: 'mixed', label: 'Mixed Colors' }
                ],
                value: 'blue'
            }
        ],
        generate: (data) => {
            const title = data.timelineTitle;
            const timelineDataInput = data.timelineData.trim();
            const orientation = data.orientation;
            const colorScheme = data.colorScheme;

            if (!timelineDataInput) {
                throw new Error('Please provide timeline events');
            }

            // Parse timeline events
            const eventLines = timelineDataInput.split('\n').filter(line => line.trim());
            const events = eventLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 2) {
                    throw new Error(`Invalid event format on line ${index + 1}. Use: Date,Event,Description,Type`);
                }

                const [dateStr, event, description = '', type = 'task'] = parts;
                const date = new Date(dateStr);
                
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid date format on line ${index + 1}. Use YYYY-MM-DD format`);
                }

                return { date, event, description, type, dateStr };
            });

            // Sort events by date
            events.sort((a, b) => a.date - b.date);

            // Color schemes
            const colors = {
                blue: {
                    milestone: '#3498db',
                    task: '#85c1e9',
                    deadline: '#e74c3c',
                    meeting: '#f39c12'
                },
                green: {
                    milestone: '#27ae60',
                    task: '#58d68d',
                    deadline: '#e74c3c',
                    meeting: '#f39c12'
                },
                purple: {
                    milestone: '#9b59b6',
                    task: '#bb8fce',
                    deadline: '#e74c3c',
                    meeting: '#f39c12'
                },
                mixed: {
                    milestone: '#3498db',
                    task: '#27ae60',
                    deadline: '#e74c3c',
                    meeting: '#f39c12'
                }
            };

            const currentColors = colors[colorScheme];

            // Generate timeline based on orientation
            const generateHorizontalTimeline = () => {
                const timelineWidth = Math.max(800, events.length * 200);
                
                return `
                <div style="
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 16px;
                    margin: 20px 0;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    overflow-x: auto;
                ">
                    <h2 style="
                        text-align: center;
                        margin: 0 0 40px 0;
                        color: #333;
                        font-size: 24px;
                        font-weight: 700;
                    ">${title}</h2>
                    
                    <div style="
                        position: relative;
                        width: ${timelineWidth}px;
                        margin: 0 auto;
                        padding: 40px 0;
                    ">
                        <!-- Timeline line -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 4px;
                            background: #e0e0e0;
                            border-radius: 2px;
                        "></div>
                        
                        ${events.map((event, index) => {
                            const leftPercent = (index / Math.max(1, events.length - 1)) * 100;
                            const eventColor = currentColors[event.type] || currentColors.task;
                            const isEven = index % 2 === 0;
                            
                            return `
                            <div style="
                                position: absolute;
                                left: ${leftPercent}%;
                                top: 50%;
                                transform: translateX(-50%);
                            ">
                                <!-- Event dot -->
                                <div style="
                                    width: 20px;
                                    height: 20px;
                                    background: ${eventColor};
                                    border: 4px solid #ffffff;
                                    border-radius: 50%;
                                    position: relative;
                                    z-index: 2;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                "></div>
                                
                                <!-- Event card -->
                                <div style="
                                    position: absolute;
                                    ${isEven ? 'top: -120px;' : 'top: 30px;'}
                                    left: 50%;
                                    transform: translateX(-50%);
                                    background: #ffffff;
                                    padding: 16px;
                                    border: 2px solid ${eventColor};
                                    border-radius: 8px;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                    min-width: 200px;
                                    max-width: 250px;
                                    text-align: center;
                                ">
                                    <div style="
                                        font-weight: bold;
                                        color: ${eventColor};
                                        margin-bottom: 4px;
                                        font-size: 14px;
                                    ">${event.dateStr}</div>
                                    <div style="
                                        font-weight: bold;
                                        color: #333;
                                        margin-bottom: 8px;
                                        font-size: 16px;
                                    ">${event.event}</div>
                                    ${event.description ? `<div style="
                                        font-size: 13px;
                                        color: #666;
                                        line-height: 1.4;
                                    ">${event.description}</div>` : ''}
                                    <div style="
                                        display: inline-block;
                                        background: ${eventColor};
                                        color: white;
                                        padding: 2px 8px;
                                        border-radius: 12px;
                                        font-size: 11px;
                                        margin-top: 8px;
                                        text-transform: uppercase;
                                        font-weight: bold;
                                    ">${event.type}</div>
                                </div>
                                
                                <!-- Connector line -->
                                <div style="
                                    position: absolute;
                                    left: 50%;
                                    ${isEven ? 'top: -100px;' : 'top: 20px;'}
                                    width: 2px;
                                    height: 80px;
                                    background: ${eventColor};
                                    transform: translateX(-50%);
                                "></div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>`;
            };

            const generateVerticalTimeline = () => {
                return `
                <div style="
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 16px;
                    margin: 20px 0;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    max-width: 800px;
                    margin: 20px auto;
                ">
                    <h2 style="
                        text-align: center;
                        margin: 0 0 40px 0;
                        color: #333;
                        font-size: 24px;
                        font-weight: 700;
                    ">${title}</h2>
                    
                    <div style="
                        position: relative;
                        padding-left: 40px;
                    ">
                        <!-- Timeline line -->
                        <div style="
                            position: absolute;
                            left: 20px;
                            top: 0;
                            bottom: 0;
                            width: 4px;
                            background: #e0e0e0;
                            border-radius: 2px;
                        "></div>
                        
                        ${events.map((event, index) => {
                            const eventColor = currentColors[event.type] || currentColors.task;
                            
                            return `
                            <div style="
                                position: relative;
                                margin-bottom: 40px;
                                padding-left: 30px;
                            ">
                                <!-- Event dot -->
                                <div style="
                                    position: absolute;
                                    left: -28px;
                                    top: 20px;
                                    width: 20px;
                                    height: 20px;
                                    background: ${eventColor};
                                    border: 4px solid #ffffff;
                                    border-radius: 50%;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                                "></div>
                                
                                <!-- Event card -->
                                <div style="
                                    background: #ffffff;
                                    padding: 20px;
                                    border: 2px solid ${eventColor};
                                    border-radius: 8px;
                                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                ">
                                    <div style="
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: flex-start;
                                        margin-bottom: 12px;
                                    ">
                                        <div>
                                            <div style="
                                                font-weight: bold;
                                                color: #333;
                                                font-size: 18px;
                                                margin-bottom: 4px;
                                            ">${event.event}</div>
                                            <div style="
                                                font-weight: bold;
                                                color: ${eventColor};
                                                font-size: 14px;
                                            ">${event.dateStr}</div>
                                        </div>
                                        <div style="
                                            background: ${eventColor};
                                            color: white;
                                            padding: 4px 12px;
                                            border-radius: 12px;
                                            font-size: 12px;
                                            text-transform: uppercase;
                                            font-weight: bold;
                                        ">${event.type}</div>
                                    </div>
                                    ${event.description ? `<div style="
                                        color: #666;
                                        line-height: 1.5;
                                        font-size: 14px;
                                    ">${event.description}</div>` : ''}
                                </div>
                            </div>`;
                        }).join('')}
                    </div>
                </div>`;
            };

            const timelineHTML = orientation === 'horizontal' 
                ? generateHorizontalTimeline() 
                : generateVerticalTimeline();

            // Calculate timeline statistics
            const timeSpan = events.length > 1 
                ? Math.ceil((events[events.length - 1].date - events[0].date) / (1000 * 60 * 60 * 24))
                : 0;

            const eventTypes = {};
            events.forEach(event => {
                eventTypes[event.type] = (eventTypes[event.type] || 0) + 1;
            });

            return `TIMELINE GENERATED

Title: ${title}
Total Events: ${events.length}
Time Span: ${timeSpan} days
Orientation: ${orientation}
Color Scheme: ${colorScheme}

${timelineHTML}

EVENT SUMMARY:
${Object.entries(eventTypes).map(([type, count]) => 
    `• ${type.charAt(0).toUpperCase() + type.slice(1)}: ${count} events`
).join('\n')}

CHRONOLOGICAL EVENTS:
${events.map((event, i) => 
    `${i + 1}. ${event.dateStr} - ${event.event} (${event.type})${event.description ? `\n   ${event.description}` : ''}`
).join('\n\n')}

UPCOMING EVENTS:
${events.filter(event => event.date > new Date()).slice(0, 3).map(event => 
    `• ${event.dateStr}: ${event.event}`
).join('\n') || 'No upcoming events'}

RECENT EVENTS:
${events.filter(event => event.date <= new Date()).slice(-3).reverse().map(event => 
    `• ${event.dateStr}: ${event.event}`
).join('\n') || 'No recent events'}

CSS CUSTOMIZATION:
.timeline-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.timeline-event {
    background: #ffffff;
    border: 2px solid ${currentColors.milestone};
    border-radius: 8px;
    transition: transform 0.2s ease;
}

.timeline-event:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

INTERACTIVE FEATURES:
// Add tooltips on hover
document.querySelectorAll('.timeline-event').forEach(event => {
    event.addEventListener('mouseenter', function() {
        // Show detailed tooltip
    });
});

// Filter by event type
function filterTimeline(eventType) {
    document.querySelectorAll('.timeline-event').forEach(event => {
        const type = event.dataset.type;
        event.style.display = eventType === 'all' || type === eventType ? 'block' : 'none';
    });
}

EXPORT OPTIONS:
• HTML: Interactive timeline for websites
• PDF: Print-friendly format
• PNG: Image for presentations
• JSON: Event data for integrations

RECOMMENDATIONS:
${events.length > 20 ? '📊 Large timeline - consider grouping or pagination' : ''}
${timeSpan > 365 ? '📅 Long timeline - consider year/month groupings' : ''}
${eventTypes.milestone ? '🎯 Milestones identified - highlight key achievements' : ''}
${events.filter(e => e.date > new Date()).length === 0 ? '⏰ No future events - consider adding upcoming milestones' : ''}`;
        }
    }));

    // 8. Heatmap Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'heatmap-generator',
        name: 'Heatmap Generator',
        description: 'Create data heatmaps and intensity visualizations',
        category: 'charts',
        icon: '🔥',
        fields: [
            {
                name: 'heatmapTitle',
                label: 'Heatmap Title',
                type: 'text',
                placeholder: 'Website Activity Heatmap',
                required: true
            },
            {
                name: 'heatmapData',
                label: 'Heatmap Data (Format: Row,Column,Value)',
                type: 'textarea',
                placeholder: 'Mon,9AM,45\nMon,10AM,67\nMon,11AM,89\nTue,9AM,34\nTue,10AM,56\nTue,11AM,78',
                required: true,
                rows: 10
            },
            {
                name: 'colorScale',
                label: 'Color Scale',
                type: 'select',
                options: [
                    { value: 'blue', label: 'Blue Scale' },
                    { value: 'green', label: 'Green Scale' },
                    { value: 'red', label: 'Red Scale' },
                    { value: 'rainbow', label: 'Rainbow Scale' },
                    { value: 'heat', label: 'Heat Scale (Red-Yellow)' }
                ],
                value: 'heat'
            },
            {
                name: 'showValues',
                label: 'Show Values in Cells',
                type: 'checkbox',
                value: true
            }
        ],
        generate: (data) => {
            const title = data.heatmapTitle;
            const heatmapDataInput = data.heatmapData.trim();
            const colorScale = data.colorScale;
            const showValues = data.showValues;

            if (!heatmapDataInput) {
                throw new Error('Please provide heatmap data');
            }

            // Parse heatmap data
            const dataLines = heatmapDataInput.split('\n').filter(line => line.trim());
            const dataPoints = dataLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 3) {
                    throw new Error(`Invalid data format on line ${index + 1}. Use: Row,Column,Value`);
                }

                const [row, column, valueStr] = parts;
                const value = parseFloat(valueStr);
                
                if (isNaN(value)) {
                    throw new Error(`Invalid value on line ${index + 1}: ${valueStr}`);
                }

                return { row, column, value };
            });

            // Get unique rows and columns
            const uniqueRows = [...new Set(dataPoints.map(d => d.row))];
            const uniqueColumns = [...new Set(dataPoints.map(d => d.column))];
            
            // Create data matrix
            const dataMatrix = {};
            dataPoints.forEach(point => {
                if (!dataMatrix[point.row]) {
                    dataMatrix[point.row] = {};
                }
                dataMatrix[point.row][point.column] = point.value;
            });

            // Calculate min/max for color scaling
            const values = dataPoints.map(d => d.value);
            const minValue = Math.min(...values);
            const maxValue = Math.max(...values);
            const range = maxValue - minValue;

            // Color scale functions
            const colorScales = {
                blue: (value) => {
                    const intensity = (value - minValue) / range;
                    const blue = Math.round(255 * intensity);
                    return `rgb(${255 - blue}, ${255 - blue}, 255)`;
                },
                green: (value) => {
                    const intensity = (value - minValue) / range;
                    const green = Math.round(255 * intensity);
                    return `rgb(${255 - green}, 255, ${255 - green})`;
                },
                red: (value) => {
                    const intensity = (value - minValue) / range;
                    const red = Math.round(255 * intensity);
                    return `rgb(255, ${255 - red}, ${255 - red})`;
                },
                rainbow: (value) => {
                    const intensity = (value - minValue) / range;
                    const hue = Math.round(240 * (1 - intensity)); // Blue to Red
                    return `hsl(${hue}, 100%, 50%)`;
                },
                heat: (value) => {
                    const intensity = (value - minValue) / range;
                    if (intensity < 0.5) {
                        const red = Math.round(255 * intensity * 2);
                        return `rgb(${red}, 0, 0)`;
                    } else {
                        const yellow = Math.round(255 * (intensity - 0.5) * 2);
                        return `rgb(255, ${yellow}, 0)`;
                    }
                }
            };

            const getColor = colorScales[colorScale];

            // Generate heatmap HTML
            const cellSize = 60;
            const heatmapHTML = `
            <div style="
                background: #ffffff;
                padding: 30px;
                border-radius: 16px;
                margin: 20px 0;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                overflow-x: auto;
            ">
                <h2 style="
                    text-align: center;
                    margin: 0 0 30px 0;
                    color: #333;
                    font-size: 24px;
                    font-weight: 700;
                ">${title}</h2>
                
                <div style="
                    display: inline-block;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    margin: 0 auto;
                ">
                    <!-- Header row -->
                    <div style="display: flex;">
                        <div style="
                            width: ${cellSize}px;
                            height: ${cellSize}px;
                            background: #f8f9fa;
                            border: 1px solid #e0e0e0;
                        "></div>
                        ${uniqueColumns.map(column => `
                            <div style="
                                width: ${cellSize}px;
                                height: ${cellSize}px;
                                background: #f8f9fa;
                                border: 1px solid #e0e0e0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 12px;
                                color: #333;
                            ">${column}</div>
                        `).join('')}
                    </div>
                    
                    ${uniqueRows.map(row => `
                        <div style="display: flex;">
                            <div style="
                                width: ${cellSize}px;
                                height: ${cellSize}px;
                                background: #f8f9fa;
                                border: 1px solid #e0e0e0;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-weight: bold;
                                font-size: 12px;
                                color: #333;
                            ">${row}</div>
                            ${uniqueColumns.map(column => {
                                const value = dataMatrix[row] && dataMatrix[row][column] !== undefined 
                                    ? dataMatrix[row][column] 
                                    : null;
                                const backgroundColor = value !== null ? getColor(value) : '#f0f0f0';
                                const textColor = value !== null && (value - minValue) / range > 0.5 ? 'white' : '#333';
                                
                                return `
                                <div style="
                                    width: ${cellSize}px;
                                    height: ${cellSize}px;
                                    background: ${backgroundColor};
                                    border: 1px solid #e0e0e0;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-weight: bold;
                                    font-size: 11px;
                                    color: ${textColor};
                                    transition: transform 0.2s ease;
                                    cursor: pointer;
                                " title="${row}, ${column}: ${value !== null ? value : 'No data'}" 
                                   onmouseover="this.style.transform='scale(1.1)'" 
                                   onmouseout="this.style.transform='scale(1)'">
                                    ${showValues && value !== null ? value : ''}
                                </div>`;
                            }).join('')}
                        </div>
                    `).join('')}
                </div>
                
                <!-- Color scale legend -->
                <div style="
                    margin-top: 30px;
                    text-align: center;
                ">
                    <div style="
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                    ">
                        <span style="font-size: 14px; color: #333;">Low</span>
                        <div style="
                            display: flex;
                            height: 20px;
                            border-radius: 10px;
                            overflow: hidden;
                            border: 1px solid #ddd;
                        ">
                            ${Array.from({length: 10}, (_, i) => {
                                const value = minValue + (range * i / 9);
                                return `<div style="
                                    width: 20px;
                                    background: ${getColor(value)};
                                "></div>`;
                            }).join('')}
                        </div>
                        <span style="font-size: 14px; color: #333;">High</span>
                    </div>
                    <div style="
                        margin-top: 10px;
                        font-size: 12px;
                        color: #666;
                    ">
                        Range: ${minValue.toFixed(1)} - ${maxValue.toFixed(1)}
                    </div>
                </div>
            </div>`;

            // Calculate statistics
            const averageValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            const hotSpots = dataPoints.filter(d => d.value > averageValue + (range * 0.3));
            const coldSpots = dataPoints.filter(d => d.value < averageValue - (range * 0.3));

            return `HEATMAP GENERATED

Title: ${title}
Data Points: ${dataPoints.length}
Rows: ${uniqueRows.length}
Columns: ${uniqueColumns.length}
Color Scale: ${colorScale}

${heatmapHTML}

DATA STATISTICS:
• Minimum Value: ${minValue.toFixed(2)}
• Maximum Value: ${maxValue.toFixed(2)}
• Average Value: ${averageValue.toFixed(2)}
• Range: ${range.toFixed(2)}
• Data Coverage: ${((dataPoints.length / (uniqueRows.length * uniqueColumns.length)) * 100).toFixed(1)}%

HOT SPOTS (Above Average + 30%):
${hotSpots.slice(0, 5).map(spot => 
    `• ${spot.row}, ${spot.column}: ${spot.value}`
).join('\n') || 'None detected'}

COLD SPOTS (Below Average - 30%):
${coldSpots.slice(0, 5).map(spot => 
    `• ${spot.row}, ${spot.column}: ${spot.value}`
).join('\n') || 'None detected'}

ROW ANALYSIS:
${uniqueRows.map(row => {
    const rowData = dataPoints.filter(d => d.row === row);
    const rowAvg = rowData.reduce((sum, d) => sum + d.value, 0) / rowData.length;
    const rowMax = Math.max(...rowData.map(d => d.value));
    const rowMin = Math.min(...rowData.map(d => d.value));
    return `${row}: Avg ${rowAvg.toFixed(1)}, Range ${rowMin}-${rowMax}`;
}).join('\n')}

COLUMN ANALYSIS:
${uniqueColumns.map(column => {
    const colData = dataPoints.filter(d => d.column === column);
    const colAvg = colData.reduce((sum, d) => sum + d.value, 0) / colData.length;
    const colMax = Math.max(...colData.map(d => d.value));
    const colMin = Math.min(...colData.map(d => d.value));
    return `${column}: Avg ${colAvg.toFixed(1)}, Range ${colMin}-${colMax}`;
}).join('\n')}

CSS STYLING:
.heatmap-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    overflow-x: auto;
}

.heatmap-cell {
    transition: transform 0.2s ease;
    cursor: pointer;
}

.heatmap-cell:hover {
    transform: scale(1.1);
    z-index: 10;
    position: relative;
}

JAVASCRIPT ENHANCEMENTS:
// Add cell click handlers
document.querySelectorAll('.heatmap-cell').forEach(cell => {
    cell.addEventListener('click', function() {
        const value = this.dataset.value;
        const row = this.dataset.row;
        const col = this.dataset.column;
        alert(\`Cell clicked: \${row}, \${col} = \${value}\`);
    });
});

// Export heatmap data
function exportHeatmapData() {
    const csvData = [
        'Row,Column,Value',
        ...dataPoints.map(d => \`\${d.row},\${d.column},\${d.value}\`)
    ].join('\\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'heatmap-data.csv';
    a.click();
}

EXPORT OPTIONS:
• HTML: Interactive heatmap for websites
• CSV: Raw data for analysis
• PNG: Static image for reports
• JSON: Data format for APIs

USE CASES:
• Website analytics (time vs page views)
• Sales data (region vs product performance)  
• Employee productivity (time vs task completion)
• Scientific data visualization
• A/B testing results

RECOMMENDATIONS:
${dataPoints.length < uniqueRows.length * uniqueColumns.length ? '⚠️ Sparse data detected - consider data aggregation' : ''}
${range < maxValue * 0.1 ? '📊 Low variance - consider adjusting value ranges' : ''}
${hotSpots.length > 0 ? `🔥 ${hotSpots.length} high-activity areas identified` : ''}
${uniqueRows.length > 20 || uniqueColumns.length > 20 ? '📱 Large heatmap - consider responsive design' : ''}`;
        }
    }));

})();