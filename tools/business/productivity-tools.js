// Productivity & Business Tools
(function() {
    'use strict';

    // 1. Invoice Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'invoice-generator',
        name: 'Invoice Generator',
        description: 'Create professional invoices with automatic calculations',
        category: 'productivity',
        icon: '🧾',
        fields: [
            {
                name: 'invoiceNumber',
                label: 'Invoice Number',
                type: 'text',
                value: `INV-${Date.now().toString().slice(-6)}`,
                required: true
            },
            {
                name: 'issueDate',
                label: 'Issue Date',
                type: 'date',
                value: new Date().toISOString().split('T')[0],
                required: true
            },
            {
                name: 'dueDate',
                label: 'Due Date',
                type: 'date',
                required: true
            },
            {
                name: 'fromName',
                label: 'From (Your Name/Company)',
                type: 'text',
                placeholder: 'Your Company Name',
                required: true
            },
            {
                name: 'fromAddress',
                label: 'Your Address',
                type: 'textarea',
                placeholder: '123 Business St\nCity, State 12345\nCountry',
                rows: 3
            },
            {
                name: 'fromEmail',
                label: 'Your Email',
                type: 'email',
                placeholder: 'your@email.com'
            },
            {
                name: 'toName',
                label: 'Bill To (Client Name)',
                type: 'text',
                placeholder: 'Client Company Name',
                required: true
            },
            {
                name: 'toAddress',
                label: 'Client Address',
                type: 'textarea',
                placeholder: '456 Client Ave\nCity, State 67890\nCountry',
                rows: 3
            },
            {
                name: 'items',
                label: 'Invoice Items (Format: Description,Quantity,Rate)',
                type: 'textarea',
                placeholder: 'Web Development Services,40,75\nConsultation Hours,5,150\nProject Management,1,500',
                required: true,
                rows: 6
            },
            {
                name: 'taxRate',
                label: 'Tax Rate (%)',
                type: 'number',
                value: '0',
                min: '0',
                max: '50',
                step: '0.1'
            },
            {
                name: 'currency',
                label: 'Currency',
                type: 'select',
                options: [
                    { value: 'USD', label: 'USD ($)' },
                    { value: 'EUR', label: 'EUR (€)' },
                    { value: 'GBP', label: 'GBP (£)' },
                    { value: 'JPY', label: 'JPY (¥)' },
                    { value: 'CAD', label: 'CAD ($)' },
                    { value: 'AUD', label: 'AUD ($)' }
                ],
                value: 'USD'
            },
            {
                name: 'notes',
                label: 'Payment Terms/Notes',
                type: 'textarea',
                placeholder: 'Payment due within 30 days. Late fees may apply.',
                rows: 3
            }
        ],
        generate: (data) => {
            const items = data.items.trim();
            if (!items) {
                throw new Error('Please add invoice items');
            }

            // Parse invoice items
            const itemLines = items.split('\n').filter(line => line.trim());
            const parsedItems = itemLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 3) {
                    throw new Error(`Invalid item format on line ${index + 1}. Use: Description,Quantity,Rate`);
                }

                const [description, quantityStr, rateStr] = parts;
                const quantity = parseFloat(quantityStr) || 0;
                const rate = parseFloat(rateStr) || 0;
                const total = quantity * rate;

                return { description, quantity, rate, total };
            });

            // Calculate totals
            const subtotal = parsedItems.reduce((sum, item) => sum + item.total, 0);
            const taxAmount = subtotal * (parseFloat(data.taxRate) / 100);
            const finalTotal = subtotal + taxAmount;

            // Currency formatting
            const formatCurrency = (amount) => {
                const symbols = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'C$', AUD: 'A$' };
                const symbol = symbols[data.currency] || '$';
                return `${symbol}${amount.toFixed(2)}`;
            };

            // Generate invoice HTML
            const invoiceHTML = `
<div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
        <div>
            <h1 style="color: #2c3e50; font-size: 32px; margin: 0; font-weight: 300;">INVOICE</h1>
            <div style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">Invoice #${data.invoiceNumber}</div>
        </div>
        <div style="text-align: right; color: #2c3e50;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">${data.fromName}</div>
            ${data.fromAddress ? `<div style="font-size: 14px; line-height: 1.5; color: #7f8c8d;">${data.fromAddress.replace(/\n/g, '<br>')}</div>` : ''}
            ${data.fromEmail ? `<div style="font-size: 14px; color: #3498db; margin-top: 5px;">${data.fromEmail}</div>` : ''}
        </div>
    </div>

    <!-- Invoice Details -->
    <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
        <div>
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">Bill To:</div>
            <div style="font-size: 16px; font-weight: bold; color: #2c3e50;">${data.toName}</div>
            ${data.toAddress ? `<div style="font-size: 14px; line-height: 1.5; color: #7f8c8d; margin-top: 5px;">${data.toAddress.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        <div style="text-align: right;">
            <div style="margin-bottom: 10px;">
                <span style="color: #7f8c8d; font-size: 14px;">Issue Date: </span>
                <span style="color: #2c3e50; font-weight: bold;">${new Date(data.issueDate).toLocaleDateString()}</span>
            </div>
            <div>
                <span style="color: #7f8c8d; font-size: 14px;">Due Date: </span>
                <span style="color: #e74c3c; font-weight: bold;">${new Date(data.dueDate).toLocaleDateString()}</span>
            </div>
        </div>
    </div>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
            <tr style="background: #34495e; color: white;">
                <th style="padding: 15px; text-align: left; border: none; font-weight: 500;">Description</th>
                <th style="padding: 15px; text-align: center; border: none; font-weight: 500; width: 80px;">Qty</th>
                <th style="padding: 15px; text-align: right; border: none; font-weight: 500; width: 100px;">Rate</th>
                <th style="padding: 15px; text-align: right; border: none; font-weight: 500; width: 100px;">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${parsedItems.map((item, index) => `
                <tr style="border-bottom: 1px solid #ecf0f1;">
                    <td style="padding: 15px; color: #2c3e50;">${item.description}</td>
                    <td style="padding: 15px; text-align: center; color: #7f8c8d;">${item.quantity}</td>
                    <td style="padding: 15px; text-align: right; color: #7f8c8d;">${formatCurrency(item.rate)}</td>
                    <td style="padding: 15px; text-align: right; color: #2c3e50; font-weight: bold;">${formatCurrency(item.total)}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <!-- Totals -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 40px;">
        <div style="width: 300px;">
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ecf0f1;">
                <span style="color: #7f8c8d;">Subtotal:</span>
                <span style="color: #2c3e50; font-weight: bold;">${formatCurrency(subtotal)}</span>
            </div>
            ${parseFloat(data.taxRate) > 0 ? `
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ecf0f1;">
                <span style="color: #7f8c8d;">Tax (${data.taxRate}%):</span>
                <span style="color: #2c3e50; font-weight: bold;">${formatCurrency(taxAmount)}</span>
            </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; padding: 15px 0; background: #34495e; color: white; margin-top: 10px; padding-left: 15px; padding-right: 15px;">
                <span style="font-size: 18px; font-weight: bold;">Total:</span>
                <span style="font-size: 18px; font-weight: bold;">${formatCurrency(finalTotal)}</span>
            </div>
        </div>
    </div>

    <!-- Notes -->
    ${data.notes ? `
    <div style="margin-bottom: 30px;">
        <div style="font-weight: bold; color: #2c3e50; margin-bottom: 10px;">Payment Terms:</div>
        <div style="color: #7f8c8d; line-height: 1.6; background: #f8f9fa; padding: 15px; border-left: 4px solid #3498db;">
            ${data.notes.replace(/\n/g, '<br>')}
        </div>
    </div>
    ` : ''}

    <!-- Footer -->
    <div style="text-align: center; color: #95a5a6; font-size: 12px; border-top: 1px solid #ecf0f1; padding-top: 20px;">
        Thank you for your business!
    </div>
</div>`;

            // Generate payment tracking
            const dueDate = new Date(data.dueDate);
            const issueDate = new Date(data.issueDate);
            const daysToDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
            const paymentTerms = Math.ceil((dueDate - issueDate) / (1000 * 60 * 60 * 24));

            return `PROFESSIONAL INVOICE GENERATED

Invoice #: ${data.invoiceNumber}
Issue Date: ${issueDate.toLocaleDateString()}
Due Date: ${dueDate.toLocaleDateString()}
Payment Terms: ${paymentTerms} days
Amount Due: ${formatCurrency(finalTotal)}

${invoiceHTML}

<div style="text-align: center; margin: 30px 0;">
    <button onclick="printInvoice()" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">🖨️ Print Invoice</button>
    
    <button onclick="downloadInvoicePDF()" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">📄 Save as PDF</button>
</div>

<script>
function printInvoice() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(\`
        <html>
            <head>
                <title>Invoice ${data.invoiceNumber}</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${invoiceHTML}
            </body>
        </html>
    \`);
    printWindow.document.close();
    printWindow.print();
}

function downloadInvoicePDF() {
    // Note: This would require a PDF library in a real implementation
    alert('PDF download feature requires additional PDF library integration. Use Print to PDF from your browser instead.');
}
</script>

INVOICE SUMMARY:
• Items: ${parsedItems.length}
• Subtotal: ${formatCurrency(subtotal)}
${parseFloat(data.taxRate) > 0 ? `• Tax (${data.taxRate}%): ${formatCurrency(taxAmount)}` : ''}
• Total Amount: ${formatCurrency(finalTotal)}
• Payment Due: ${daysToDue > 0 ? `${daysToDue} days` : daysToDue === 0 ? 'Today' : `${Math.abs(daysToDue)} days overdue`}

ITEMIZED BREAKDOWN:
${parsedItems.map((item, i) => 
    `${i + 1}. ${item.description}
   • Quantity: ${item.quantity}
   • Rate: ${formatCurrency(item.rate)}
   • Total: ${formatCurrency(item.total)}`
).join('\n\n')}

PAYMENT TRACKING:
• Status: ${daysToDue > 0 ? '🟡 Pending' : daysToDue === 0 ? '🟠 Due Today' : '🔴 Overdue'}
• Payment Terms: ${paymentTerms} days
• Days Until Due: ${daysToDue}
${daysToDue < 0 ? `• Late Fee Applicable: Consider ${(finalTotal * 0.01).toFixed(2)} (1% monthly)` : ''}

BUSINESS INSIGHTS:
• Average Item Value: ${formatCurrency(subtotal / parsedItems.length)}
• Highest Value Item: ${formatCurrency(Math.max(...parsedItems.map(item => item.total)))}
• Tax Efficiency: ${(taxAmount / subtotal * 100).toFixed(1)}% effective rate
• Revenue Contribution: ${formatCurrency(finalTotal)} to monthly earnings

FOLLOW-UP ACTIONS:
${daysToDue > 7 ? '• Send invoice to client' : ''}
${daysToDue <= 7 && daysToDue > 0 ? '• Send payment reminder' : ''}
${daysToDue <= 0 ? '• Follow up on overdue payment' : ''}
• Track payment in accounting system
• Update client payment history
• Schedule next invoice if recurring

LEGAL COMPLIANCE:
• Include all required business information
• Maintain invoice copies for tax purposes
• Follow local invoicing regulations
• Consider digital signature for authenticity
• Ensure data privacy compliance (GDPR/CCPA)

EMAIL TEMPLATE:
Subject: Invoice ${data.invoiceNumber} - Payment Due ${dueDate.toLocaleDateString()}

Dear ${data.toName},

Please find attached Invoice ${data.invoiceNumber} for ${formatCurrency(finalTotal)}.

Payment is due by ${dueDate.toLocaleDateString()}.

${data.notes || 'Thank you for your business!'}

Best regards,
${data.fromName}`;
        }
    }));

    // 2. Time Zone Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'timezone-converter',
        name: 'Time Zone Converter',
        description: 'Convert times between different time zones for global meetings',
        category: 'productivity',
        icon: '🌍',
        fields: [
            {
                name: 'sourceTime',
                label: 'Time',
                type: 'time',
                value: new Date().toTimeString().slice(0, 5),
                required: true
            },
            {
                name: 'sourceDate',
                label: 'Date',
                type: 'date',
                value: new Date().toISOString().split('T')[0],
                required: true
            },
            {
                name: 'sourceTimezone',
                label: 'From Time Zone',
                type: 'select',
                required: true,
                options: [
                    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
                    { value: 'America/New_York', label: 'Eastern Time (ET)' },
                    { value: 'America/Chicago', label: 'Central Time (CT)' },
                    { value: 'America/Denver', label: 'Mountain Time (MT)' },
                    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                    { value: 'Europe/London', label: 'London (GMT/BST)' },
                    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
                    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
                    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
                    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
                    { value: 'Asia/Kolkata', label: 'India (IST)' },
                    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
                    { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' }
                ]
            },
            {
                name: 'targetTimezones',
                label: 'Convert To (select multiple)',
                type: 'checkboxGroup',
                options: [
                    { value: 'UTC', label: 'UTC', checked: false },
                    { value: 'America/New_York', label: 'New York (ET)', checked: true },
                    { value: 'America/Los_Angeles', label: 'Los Angeles (PT)', checked: true },
                    { value: 'Europe/London', label: 'London (GMT/BST)', checked: true },
                    { value: 'Europe/Paris', label: 'Paris (CET/CEST)', checked: false },
                    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', checked: false },
                    { value: 'Asia/Shanghai', label: 'Shanghai (CST)', checked: false },
                    { value: 'Asia/Kolkata', label: 'Mumbai (IST)', checked: false },
                    { value: 'Australia/Sydney', label: 'Sydney (AEST)', checked: false }
                ]
            }
        ],
        convert: (data) => {
            const sourceTime = data.sourceTime;
            const sourceDate = data.sourceDate;
            const sourceTimezone = data.sourceTimezone;
            const targetTimezones = data.targetTimezones || [];

            if (!sourceTime || !sourceDate || !sourceTimezone) {
                throw new Error('Please provide time, date, and source timezone');
            }

            if (targetTimezones.length === 0) {
                throw new Error('Please select at least one target timezone');
            }

            // Create source datetime
            const sourceDatetime = new Date(`${sourceDate}T${sourceTime}:00`);
            
            // Timezone display names
            const timezoneNames = {
                'UTC': 'UTC',
                'America/New_York': 'New York',
                'America/Chicago': 'Chicago',
                'America/Denver': 'Denver',
                'America/Los_Angeles': 'Los Angeles',
                'Europe/London': 'London',
                'Europe/Paris': 'Paris',
                'Europe/Berlin': 'Berlin',
                'Asia/Tokyo': 'Tokyo',
                'Asia/Shanghai': 'Shanghai',
                'Asia/Kolkata': 'Mumbai',
                'Australia/Sydney': 'Sydney',
                'Pacific/Auckland': 'Auckland'
            };

            // Convert to each target timezone
            const conversions = [];
            
            try {
                targetTimezones.forEach(targetTz => {
                    // Get timezone offset for source and target
                    const sourceOffset = getTimezoneOffset(sourceDatetime, sourceTimezone);
                    const targetOffset = getTimezoneOffset(sourceDatetime, targetTz);
                    
                    // Calculate the time difference in minutes
                    const diffMinutes = targetOffset - sourceOffset;
                    
                    // Apply the difference to source time
                    const targetTime = new Date(sourceDatetime.getTime() + diffMinutes * 60000);
                    
                    // Format the result
                    const timeStr = targetTime.toTimeString().slice(0, 8);
                    const dateStr = targetTime.toISOString().split('T')[0];
                    const dayDiff = getDayDifference(sourceDate, dateStr);
                    
                    conversions.push({
                        timezone: targetTz,
                        name: timezoneNames[targetTz] || targetTz,
                        time: timeStr,
                        date: dateStr,
                        dayDiff: dayDiff,
                        formatted: formatDateTime(targetTime, targetTz)
                    });
                });
            } catch (error) {
                throw new Error('Error converting timezones. Please check your input values.');
            }

            // Create visual time zone table
            const timeTable = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: #343a40; color: white;">
                            <th style="padding: 15px; text-align: left; border: none;">Location</th>
                            <th style="padding: 15px; text-align: center; border: none;">Date</th>
                            <th style="padding: 15px; text-align: center; border: none;">Time</th>
                            <th style="padding: 15px; text-align: center; border: none;">Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="background: #e3f2fd; border-left: 4px solid #2196f3;">
                            <td style="padding: 15px; font-weight: bold; color: #1976d2;">
                                📍 ${timezoneNames[sourceTimezone]} (Source)
                            </td>
                            <td style="padding: 15px; text-align: center; color: #1976d2; font-weight: bold;">
                                ${sourceDate}
                            </td>
                            <td style="padding: 15px; text-align: center; font-family: monospace; font-size: 16px; color: #1976d2; font-weight: bold;">
                                ${sourceTime}:00
                            </td>
                            <td style="padding: 15px; text-align: center; color: #1976d2;">
                                Reference
                            </td>
                        </tr>
                        ${conversions.map((conv, index) => {
                            const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                            const dayColor = conv.dayDiff === 0 ? '#28a745' : conv.dayDiff > 0 ? '#fd7e14' : '#dc3545';
                            const dayText = conv.dayDiff === 0 ? 'Same Day' : conv.dayDiff > 0 ? `+${conv.dayDiff} Day${conv.dayDiff > 1 ? 's' : ''}` : `${conv.dayDiff} Day${Math.abs(conv.dayDiff) > 1 ? 's' : ''}`;
                            
                            return `<tr style="background: ${bgColor};">
                                <td style="padding: 15px; color: #495057;">
                                    🌍 ${conv.name}
                                </td>
                                <td style="padding: 15px; text-align: center; color: #495057;">
                                    ${conv.date}
                                </td>
                                <td style="padding: 15px; text-align: center; font-family: monospace; font-size: 16px; color: #495057; font-weight: bold;">
                                    ${conv.time}
                                </td>
                                <td style="padding: 15px; text-align: center; color: ${dayColor}; font-weight: bold; font-size: 12px;">
                                    ${dayText}
                                </td>
                            </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>`;

            // Generate meeting scheduler
            const meetingTimes = findBestMeetingTimes(conversions);

            return `TIME ZONE CONVERSION COMPLETE

Source: ${timezoneNames[sourceTimezone]}
Date & Time: ${sourceDate} ${sourceTime}:00

${timeTable}

CONVERSION RESULTS:
${conversions.map(conv => 
    `• ${conv.name}: ${conv.date} ${conv.time} ${conv.dayDiff !== 0 ? `(${conv.dayDiff > 0 ? '+' : ''}${conv.dayDiff} day${Math.abs(conv.dayDiff) > 1 ? 's' : ''})` : ''}`
).join('\n')}

MEETING PLANNER:
${meetingTimes}

QUICK COPY FORMATS:

EMAIL FORMAT:
Meeting scheduled for ${sourceDate} at ${sourceTime} ${timezoneNames[sourceTimezone]}
${conversions.map(conv => `• ${conv.name}: ${conv.time} on ${conv.date}`).join('\n')}

CALENDAR INVITE:
${conversions.map(conv => `${conv.name}: ${conv.formatted}`).join(' | ')}

SLACK/TEAMS FORMAT:
📅 Meeting Time:
${conversions.map(conv => `${conv.name}: ${conv.time} (${conv.date})`).join('\n')}

BUSINESS HOURS ANALYSIS:
${generateBusinessHoursAnalysis(conversions)}

DAYLIGHT SAVING TIME NOTES:
⚠️ Results may vary during DST transitions
• Check local DST rules for accuracy
• Verify times closer to meeting date
• Consider using UTC for international coordination

PRODUCTIVITY TIPS:
• Use UTC for global team coordination
• Schedule recurring meetings at optimal times
• Consider team member work preferences
• Factor in commute times for in-person meetings
• Allow buffer time for technical setup

TOOLS INTEGRATION:
• Add to Google Calendar with multiple time zones
• Set Outlook meetings with global times
• Use World Clock apps for quick reference
• Configure Slack with team time zones
• Set up calendar time zone preferences`;

            function getTimezoneOffset(date, timezone) {
                // This is a simplified implementation
                // In a real app, you'd use a proper timezone library like Luxon or date-fns-tz
                const offsets = {
                    'UTC': 0,
                    'America/New_York': -5 * 60, // EST (varies with DST)
                    'America/Chicago': -6 * 60,
                    'America/Denver': -7 * 60,
                    'America/Los_Angeles': -8 * 60,
                    'Europe/London': 0, // GMT (varies with DST)
                    'Europe/Paris': 1 * 60,
                    'Europe/Berlin': 1 * 60,
                    'Asia/Tokyo': 9 * 60,
                    'Asia/Shanghai': 8 * 60,
                    'Asia/Kolkata': 5.5 * 60,
                    'Australia/Sydney': 10 * 60, // AEST (varies with DST)
                    'Pacific/Auckland': 12 * 60
                };
                
                return offsets[timezone] || 0;
            }

            function getDayDifference(sourceDate, targetDate) {
                const source = new Date(sourceDate);
                const target = new Date(targetDate);
                return Math.round((target - source) / (1000 * 60 * 60 * 24));
            }

            function formatDateTime(date, timezone) {
                return date.toLocaleString('en-US', {
                    timeZone: timezone,
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }

            function findBestMeetingTimes(conversions) {
                // Analyze business hours (9 AM - 6 PM local time)
                const businessHours = conversions.map(conv => {
                    const hour = parseInt(conv.time.split(':')[0]);
                    const isBusinessHours = hour >= 9 && hour <= 18;
                    const isLateNight = hour >= 22 || hour <= 6;
                    const isEarlyMorning = hour >= 6 && hour < 9;
                    const isEvening = hour > 18 && hour < 22;
                    
                    return {
                        ...conv,
                        hour,
                        isBusinessHours,
                        isLateNight,
                        isEarlyMorning,
                        isEvening
                    };
                });

                const inBusinessHours = businessHours.filter(bh => bh.isBusinessHours).length;
                const lateNight = businessHours.filter(bh => bh.isLateNight).length;
                
                let recommendation = '';
                if (inBusinessHours === businessHours.length) {
                    recommendation = '✅ Perfect timing! All participants are in business hours.';
                } else if (inBusinessHours >= businessHours.length * 0.7) {
                    recommendation = '👍 Good timing! Most participants are in business hours.';
                } else if (lateNight > 0) {
                    recommendation = '⚠️ Some participants have very late hours. Consider rescheduling.';
                } else {
                    recommendation = '⚠️ Mixed timing. Consider alternative times for better participation.';
                }

                return `${recommendation}

Business Hours Analysis:
${businessHours.map(bh => {
    let status = '';
    if (bh.isBusinessHours) status = '✅ Business Hours';
    else if (bh.isEarlyMorning) status = '🌅 Early Morning';
    else if (bh.isEvening) status = '🌆 Evening';
    else if (bh.isLateNight) status = '🌙 Late Night';
    
    return `• ${bh.name}: ${status}`;
}).join('\n')}`;
            }

            function generateBusinessHoursAnalysis(conversions) {
                return conversions.map(conv => {
                    const hour = parseInt(conv.time.split(':')[0]);
                    let analysis = '';
                    
                    if (hour >= 9 && hour <= 17) {
                        analysis = '✅ Standard business hours';
                    } else if (hour >= 6 && hour < 9) {
                        analysis = '🌅 Early morning';
                    } else if (hour > 17 && hour <= 21) {
                        analysis = '🌆 Evening hours';
                    } else {
                        analysis = '🌙 Outside business hours';
                    }
                    
                    return `• ${conv.name}: ${analysis}`;
                }).join('\n');
            }
        }
    }));

    // 3. Meeting Cost Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'meeting-cost-calculator',
        name: 'Meeting Cost Calculator',
        description: 'Calculate the real cost of meetings based on attendee salaries and time',
        category: 'productivity',
        icon: '💰',
        fields: [
            {
                name: 'meetingDuration',
                label: 'Meeting Duration (minutes)',
                type: 'number',
                value: '60',
                min: '15',
                max: '480',
                required: true
            },
            {
                name: 'attendees',
                label: 'Attendees (Format: Name,Hourly Rate or Annual Salary)',
                type: 'textarea',
                placeholder: 'John Manager,150000\nJane Developer,75\nBob Designer,65\nAlice Analyst,45000',
                required: true,
                rows: 6
            },
            {
                name: 'preparationTime',
                label: 'Average Preparation Time per Person (minutes)',
                type: 'number',
                value: '15',
                min: '0',
                max: '120'
            },
            {
                name: 'followUpTime',
                label: 'Average Follow-up Time per Person (minutes)',
                type: 'number',
                value: '10',
                min: '0',
                max: '60'
            },
            {
                name: 'overheadRate',
                label: 'Company Overhead Rate (%)',
                type: 'number',
                value: '30',
                min: '0',
                max: '100',
                step: '5'
            },
            {
                name: 'meetingType',
                label: 'Meeting Type',
                type: 'select',
                options: [
                    { value: 'regular', label: 'Regular Team Meeting' },
                    { value: 'planning', label: 'Planning Session' },
                    { value: 'review', label: 'Review Meeting' },
                    { value: 'brainstorm', label: 'Brainstorming' },
                    { value: 'training', label: 'Training Session' },
                    { value: 'client', label: 'Client Meeting' },
                    { value: 'all-hands', label: 'All-Hands Meeting' }
                ],
                value: 'regular'
            }
        ],
        calculate: (data) => {
            const duration = parseInt(data.meetingDuration);
            const prepTime = parseInt(data.preparationTime) || 0;
            const followUpTime = parseInt(data.followUpTime) || 0;
            const overheadRate = parseFloat(data.overheadRate) / 100;
            const meetingType = data.meetingType;

            if (!data.attendees.trim()) {
                throw new Error('Please add meeting attendees with their hourly rates or salaries');
            }

            // Parse attendees
            const attendeeLines = data.attendees.trim().split('\n').filter(line => line.trim());
            const attendees = attendeeLines.map((line, index) => {
                const parts = line.split(',').map(part => part.trim());
                if (parts.length < 2) {
                    throw new Error(`Invalid attendee format on line ${index + 1}. Use: Name,Hourly Rate or Annual Salary`);
                }

                const [name, rateStr] = parts;
                const rate = parseFloat(rateStr) || 0;
                
                // Determine if it's hourly rate or annual salary
                let hourlyRate;
                if (rate > 1000) {
                    // Assume annual salary, convert to hourly (2080 work hours per year)
                    hourlyRate = rate / 2080;
                } else {
                    // Assume hourly rate
                    hourlyRate = rate;
                }

                return { name, hourlyRate, originalRate: rate };
            });

            // Calculate costs
            const totalTime = duration + prepTime + followUpTime; // minutes
            const totalHours = totalTime / 60;

            const attendeeCosts = attendees.map(attendee => {
                const baseCost = attendee.hourlyRate * totalHours;
                const overheadCost = baseCost * overheadRate;
                const totalCost = baseCost + overheadCost;

                return {
                    ...attendee,
                    baseCost,
                    overheadCost,
                    totalCost,
                    meetingCost: (attendee.hourlyRate * duration / 60),
                    prepCost: (attendee.hourlyRate * prepTime / 60),
                    followUpCost: (attendee.hourlyRate * followUpTime / 60)
                };
            });

            // Calculate totals
            const totalBaseCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.baseCost, 0);
            const totalOverheadCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.overheadCost, 0);
            const totalMeetingCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.totalCost, 0);

            // Meeting cost breakdown
            const meetingOnlyCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.meetingCost, 0);
            const prepCost = attendeeCosts.reduce((sum, attendee) => sum + attendee.prepCost, 0);
            const followUpCostTotal = attendeeCosts.reduce((sum, attendee) => sum + attendee.followUpCost, 0);

            // Generate insights
            const insights = generateMeetingInsights(attendeeCosts, duration, meetingType, totalMeetingCost);

            // Create attendee cost table
            const attendeeTable = `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <thead>
                        <tr style="background: #343a40; color: white;">
                            <th style="padding: 12px; text-align: left; border: none;">Attendee</th>
                            <th style="padding: 12px; text-align: right; border: none;">Hourly Rate</th>
                            <th style="padding: 12px; text-align: right; border: none;">Meeting Cost</th>
                            <th style="padding: 12px; text-align: right; border: none;">Prep Cost</th>
                            <th style="padding: 12px; text-align: right; border: none;">Follow-up</th>
                            <th style="padding: 12px; text-align: right; border: none;">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendeeCosts.map((attendee, index) => {
                            const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                            return `<tr style="background: ${bgColor};">
                                <td style="padding: 12px; color: #495057; font-weight: 500;">${attendee.name}</td>
                                <td style="padding: 12px; text-align: right; color: #495057;">$${attendee.hourlyRate.toFixed(0)}/hr</td>
                                <td style="padding: 12px; text-align: right; color: #495057;">$${attendee.meetingCost.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; color: #6c757d;">$${attendee.prepCost.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; color: #6c757d;">$${attendee.followUpCost.toFixed(2)}</td>
                                <td style="padding: 12px; text-align: right; color: #28a745; font-weight: bold;">$${attendee.totalCost.toFixed(2)}</td>
                            </tr>`;
                        }).join('')}
                        <tr style="background: #e9ecef; font-weight: bold; border-top: 2px solid #dee2e6;">
                            <td style="padding: 12px; color: #495057;">TOTALS</td>
                            <td style="padding: 12px; text-align: right; color: #495057;">-</td>
                            <td style="padding: 12px; text-align: right; color: #495057;">$${meetingOnlyCost.toFixed(2)}</td>
                            <td style="padding: 12px; text-align: right; color: #6c757d;">$${prepCost.toFixed(2)}</td>
                            <td style="padding: 12px; text-align: right; color: #6c757d;">$${followUpCostTotal.toFixed(2)}</td>
                            <td style="padding: 12px; text-align: right; color: #dc3545; font-weight: bold; font-size: 16px;">$${totalMeetingCost.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>`;

            return `MEETING COST ANALYSIS

Meeting Details:
• Duration: ${duration} minutes
• Attendees: ${attendees.length} people
• Type: ${meetingType.charAt(0).toUpperCase() + meetingType.slice(1).replace('-', ' ')}
• Preparation Time: ${prepTime} minutes per person
• Follow-up Time: ${followUpTime} minutes per person

${attendeeTable}

COST BREAKDOWN:
• Meeting Time: $${meetingOnlyCost.toFixed(2)} (${duration} min × ${attendees.length} people)
• Preparation: $${prepCost.toFixed(2)} (${prepTime} min × ${attendees.length} people)
• Follow-up: $${followUpCostTotal.toFixed(2)} (${followUpTime} min × ${attendees.length} people)
• Overhead (${(overheadRate * 100).toFixed(0)}%): $${totalOverheadCost.toFixed(2)}

TOTAL MEETING COST: $${totalMeetingCost.toFixed(2)}

COST PER MINUTE: $${(totalMeetingCost / (duration + prepTime + followUpTime)).toFixed(2)}

ATTENDEE ANALYSIS:
• Highest Cost: ${attendeeCosts.sort((a, b) => b.totalCost - a.totalCost)[0].name} ($${attendeeCosts.sort((a, b) => b.totalCost - a.totalCost)[0].totalCost.toFixed(2)})
• Lowest Cost: ${attendeeCosts.sort((a, b) => a.totalCost - b.totalCost)[0].name} ($${attendeeCosts.sort((a, b) => a.totalCost - b.totalCost)[0].totalCost.toFixed(2)})
• Average Cost per Person: $${(totalMeetingCost / attendees.length).toFixed(2)}

${insights}

ANNUAL IMPACT:
If held weekly: $${(totalMeetingCost * 52).toFixed(2)} per year
If held bi-weekly: $${(totalMeetingCost * 26).toFixed(2)} per year
If held monthly: $${(totalMeetingCost * 12).toFixed(2)} per year

EFFICIENCY RECOMMENDATIONS:
${generateEfficiencyRecommendations(totalMeetingCost, duration, attendees.length, meetingType)}

COST OPTIMIZATION STRATEGIES:
• Reduce meeting duration by 15 minutes: Save $${(totalMeetingCost * 0.25).toFixed(2)} per meeting
• Remove lowest-necessity attendees: Evaluate if all ${attendees.length} people need to attend
• Use async updates: Replace status meetings with written updates
• Set clear agendas: Reduce preparation and follow-up time
• Time-box discussions: Prevent meetings from running over

MEETING ROI CALCULATION:
For this meeting to be cost-effective, it should generate value of at least $${(totalMeetingCost * 1.2).toFixed(2)} (20% return threshold)

Example value metrics:
• Decisions made worth: $______
• Problems solved worth: $______
• Opportunities identified worth: $______
• Team alignment value: $______

VALUE TRACKING:
□ Clear objectives set before meeting
□ Specific outcomes achieved
□ Action items assigned with deadlines  
□ Decision quality improved
□ Time saved in future work
□ Revenue opportunities identified
□ Cost savings implemented
□ Team productivity increased`;

            function generateMeetingInsights(attendeeCosts, duration, type, totalCost) {
                const insights = [];
                const avgHourlyRate = attendeeCosts.reduce((sum, a) => sum + a.hourlyRate, 0) / attendeeCosts.length;
                const costPerMinute = totalCost / duration;

                // Cost insights
                if (totalCost > 500) {
                    insights.push('💰 High-cost meeting - ensure maximum value delivery');
                } else if (totalCost > 200) {
                    insights.push('💼 Medium-cost meeting - optimize for key decisions');
                } else {
                    insights.push('✅ Reasonable cost meeting - good for regular collaboration');
                }

                // Duration insights
                if (duration > 90) {
                    insights.push('⏰ Long meeting - consider breaking into smaller focused sessions');
                } else if (duration === 60) {
                    insights.push('📅 Standard 1-hour meeting - common but evaluate necessity');
                } else if (duration <= 30) {
                    insights.push('⚡ Short meeting - efficient duration for focused discussions');
                }

                // Team size insights
                const teamSize = attendeeCosts.length;
                if (teamSize > 8) {
                    insights.push('👥 Large group - consider if all attendees add value');
                } else if (teamSize >= 4) {
                    insights.push('👥 Good group size for collaboration and decision-making');
                } else {
                    insights.push('👥 Small focused group - ideal for deep work discussions');
                }

                // Rate disparity insights
                const maxRate = Math.max(...attendeeCosts.map(a => a.hourlyRate));
                const minRate = Math.min(...attendeeCosts.map(a => a.hourlyRate));
                if (maxRate / minRate > 3) {
                    insights.push('⚖️ Large salary range - ensure meeting value matches senior time investment');
                }

                return `MEETING INSIGHTS:
${insights.map(insight => `• ${insight}`).join('\n')}

BENCHMARKS:
• Your cost/minute: $${costPerMinute.toFixed(2)}
• Industry average: $8.50/minute (10-person meeting)
• Efficient meeting: <$5/minute
• High-value meeting: >$15/minute justified`;
            }

            function generateEfficiencyRecommendations(cost, duration, attendeeCount, type) {
                const recommendations = [];

                if (cost > 300) {
                    recommendations.push('• Consider if this meeting could be an email or document');
                }

                if (duration > 60) {
                    recommendations.push('• Break long meetings into focused 30-minute sessions');
                }

                if (attendeeCount > 6) {
                    recommendations.push('• Question if all attendees need to be present for entire duration');
                }

                if (type === 'regular') {
                    recommendations.push('• Evaluate frequency - could this be bi-weekly instead of weekly?');
                }

                recommendations.push('• Set clear agenda with time allocations');
                recommendations.push('• Start and end on time to respect attendee costs');
                recommendations.push('• Assign action items with owners and deadlines');
                recommendations.push('• Send pre-read materials to reduce meeting prep time');

                return recommendations.join('\n');
            }
        }
    }));

})();