// Developer Utility Tools
(function() {
    'use strict';

    // 1. Regex Tester
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'regex-tester',
        name: 'Regex Tester',
        description: 'Test regular expressions against text with match highlighting',
        category: 'dev',
        icon: '🔍',
        extraFields: [
            {
                name: 'pattern',
                label: 'Regular Expression Pattern',
                type: 'text',
                required: true,
                placeholder: 'Enter regex pattern (e.g., \\d+|[a-z]+)'
            },
            {
                name: 'flags',
                label: 'Flags',
                type: 'text',
                placeholder: 'g, i, m, s, u, y',
                value: 'g'
            },
            {
                name: 'replacement',
                label: 'Replacement (for replace test)',
                type: 'text',
                placeholder: 'Optional replacement string'
            }
        ],
        process: (data) => {
            const text = data.text;
            const pattern = data.pattern;
            const flags = data.flags || '';
            const replacement = data.replacement || '';
            
            if (!pattern) {
                throw new Error('Please enter a regular expression pattern');
            }
            
            try {
                const regex = new RegExp(pattern, flags);
                const matches = [...text.matchAll(regex)];
                
                let result = `🔍 REGEX TEST RESULTS

Pattern: ${pattern}
Flags: ${flags || '(none)'}
Text length: ${text.length} characters

MATCH SUMMARY:
Total matches: ${matches.length}
`;
                
                if (matches.length > 0) {
                    result += `First match: "${matches[0][0]}" at position ${matches[0].index}\n`;
                    result += `Last match: "${matches[matches.length - 1][0]}" at position ${matches[matches.length - 1].index}\n\n`;
                    
                    result += `ALL MATCHES:\n`;
                    matches.slice(0, 20).forEach((match, i) => {
                        result += `${i + 1}. "${match[0]}" (position ${match.index}`;
                        if (match.length > 1) {
                            result += `, groups: ${match.slice(1).join(', ')}`;
                        }
                        result += `)\n`;
                    });
                    
                    if (matches.length > 20) {
                        result += `... (showing first 20 of ${matches.length} matches)\n`;
                    }
                    
                    // Show replacement result if replacement provided
                    if (replacement) {
                        const replaced = text.replace(regex, replacement);
                        result += `\nREPLACEMENT RESULT:\n${replaced}`;
                    }
                    
                    // Highlight matches in original text
                    let highlighted = text;
                    let offset = 0;
                    matches.forEach(match => {
                        const start = match.index + offset;
                        const end = start + match[0].length;
                        const before = highlighted.slice(0, start);
                        const matchText = highlighted.slice(start, end);
                        const after = highlighted.slice(end);
                        highlighted = before + `[${matchText}]` + after;
                        offset += 2; // Account for added brackets
                    });
                    
                    result += `\nHIGHLIGHTED TEXT (matches in [brackets]):\n${highlighted}`;
                } else {
                    result += `No matches found.\n\nORIGINAL TEXT:\n${text}`;
                }
                
                return result;
                
            } catch (error) {
                throw new Error(`Invalid regular expression: ${error.message}`);
            }
        }
    }));

    // 2. Cron Expression Builder
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'cron-expression-builder',
        name: 'Cron Expression Builder',
        description: 'Build and validate cron expressions for task scheduling',
        category: 'dev',
        icon: '⏰',
        fields: [
            {
                name: 'minute',
                label: 'Minute (0-59)',
                type: 'text',
                value: '*',
                placeholder: '* or 0-59 or */5'
            },
            {
                name: 'hour',
                label: 'Hour (0-23)',
                type: 'text',
                value: '*',
                placeholder: '* or 0-23 or 9-17'
            },
            {
                name: 'day',
                label: 'Day of Month (1-31)',
                type: 'text',
                value: '*',
                placeholder: '* or 1-31 or */2'
            },
            {
                name: 'month',
                label: 'Month (1-12)',
                type: 'text',
                value: '*',
                placeholder: '* or 1-12 or JAN-DEC'
            },
            {
                name: 'weekday',
                label: 'Day of Week (0-7)',
                type: 'text',
                value: '*',
                placeholder: '* or 0-7 or SUN-SAT'
            },
            {
                name: 'preset',
                label: 'Common Presets',
                type: 'select',
                options: [
                    { value: 'custom', label: 'Custom (use fields above)' },
                    { value: 'every_minute', label: 'Every minute' },
                    { value: 'every_hour', label: 'Every hour' },
                    { value: 'daily_midnight', label: 'Daily at midnight' },
                    { value: 'daily_9am', label: 'Daily at 9 AM' },
                    { value: 'weekly_sunday', label: 'Weekly on Sunday' },
                    { value: 'monthly_1st', label: 'Monthly on 1st' },
                    { value: 'workdays_9am', label: 'Workdays at 9 AM' }
                ],
                value: 'custom'
            }
        ],
        generate: (data) => {
            let minute = data.minute.trim();
            let hour = data.hour.trim();
            let day = data.day.trim();
            let month = data.month.trim();
            let weekday = data.weekday.trim();
            const preset = data.preset;
            
            // Apply preset if selected
            const presets = {
                every_minute: { minute: '*', hour: '*', day: '*', month: '*', weekday: '*' },
                every_hour: { minute: '0', hour: '*', day: '*', month: '*', weekday: '*' },
                daily_midnight: { minute: '0', hour: '0', day: '*', month: '*', weekday: '*' },
                daily_9am: { minute: '0', hour: '9', day: '*', month: '*', weekday: '*' },
                weekly_sunday: { minute: '0', hour: '0', day: '*', month: '*', weekday: '0' },
                monthly_1st: { minute: '0', hour: '0', day: '1', month: '*', weekday: '*' },
                workdays_9am: { minute: '0', hour: '9', day: '*', month: '*', weekday: '1-5' }
            };
            
            if (preset !== 'custom' && presets[preset]) {
                const p = presets[preset];
                minute = p.minute;
                hour = p.hour;
                day = p.day;
                month = p.month;
                weekday = p.weekday;
            }
            
            // Build cron expression
            const cronExpression = `${minute} ${hour} ${day} ${month} ${weekday}`;
            
            // Validate each field
            const validateField = (value, min, max, name) => {
                if (value === '*') return true;
                
                // Handle ranges like 1-5
                if (value.includes('-')) {
                    const [start, end] = value.split('-').map(n => parseInt(n));
                    return start >= min && end <= max && start <= end;
                }
                
                // Handle steps like */5
                if (value.includes('/')) {
                    const [base, step] = value.split('/');
                    if (base === '*' || (parseInt(base) >= min && parseInt(base) <= max)) {
                        return parseInt(step) > 0;
                    }
                    return false;
                }
                
                // Handle lists like 1,3,5
                if (value.includes(',')) {
                    return value.split(',').every(v => {
                        const num = parseInt(v.trim());
                        return num >= min && num <= max;
                    });
                }
                
                // Single number
                const num = parseInt(value);
                return num >= min && num <= max;
            };
            
            const errors = [];
            if (!validateField(minute, 0, 59, 'minute')) errors.push('Invalid minute value');
            if (!validateField(hour, 0, 23, 'hour')) errors.push('Invalid hour value');
            if (!validateField(day, 1, 31, 'day')) errors.push('Invalid day value');
            if (!validateField(month, 1, 12, 'month')) errors.push('Invalid month value');
            if (!validateField(weekday, 0, 7, 'weekday')) errors.push('Invalid weekday value');
            
            // Generate human-readable description
            const describe = (value, type) => {
                if (value === '*') return `every ${type}`;
                if (value.includes('/')) {
                    const [base, step] = value.split('/');
                    return base === '*' ? `every ${step} ${type}s` : `every ${step} ${type}s starting from ${base}`;
                }
                if (value.includes('-')) {
                    return `${type}s ${value}`;
                }
                if (value.includes(',')) {
                    return `${type}s ${value}`;
                }
                return `${type} ${value}`;
            };
            
            const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            
            let description = 'Run ';
            if (minute === '0' && hour !== '*') {
                description += `at ${hour === '*' ? 'every hour' : hour + ':00'}`;
            } else {
                description += `at ${describe(minute, 'minute')}`;
                if (hour !== '*') description += ` of ${describe(hour, 'hour')}`;
            }
            
            if (day !== '*') description += ` on ${describe(day, 'day')} of the month`;
            if (month !== '*') description += ` in ${describe(month, 'month')}`;
            if (weekday !== '*') description += ` on ${describe(weekday, 'weekday')}`;
            
            let result = `⏰ CRON EXPRESSION GENERATED

Expression: ${cronExpression}
Description: ${description}
Preset used: ${preset === 'custom' ? 'Custom' : preset.replace(/_/g, ' ')}

FIELD BREAKDOWN:
┌─────────── minute (0 - 59)
│ ┌───────── hour (0 - 23)
│ │ ┌─────── day of month (1 - 31)
│ │ │ ┌───── month (1 - 12)
│ │ │ │ ┌─── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
${minute.padEnd(2)} ${hour.padEnd(2)} ${day.padEnd(2)} ${month.padEnd(2)} ${weekday}

SPECIAL CHARACTERS:
* = any value
, = value list separator
- = range of values
/ = step values
`;
            
            if (errors.length > 0) {
                result += `\n❌ VALIDATION ERRORS:\n${errors.join('\n')}`;
            } else {
                result += `\n✅ Expression is valid!`;
            }
            
            result += `\n\nCOMMON EXAMPLES:
0 0 * * * = Daily at midnight
0 9 * * 1-5 = Weekdays at 9 AM
*/15 * * * * = Every 15 minutes
0 2 1 * * = Monthly on 1st at 2 AM
0 0 * * 0 = Weekly on Sunday
*/5 9-17 * * 1-5 = Every 5 min, 9-5 PM, weekdays`;
            
            return result;
        }
    }));

    // 3. HTTP Status Code Reference
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'http-status-codes',
        name: 'HTTP Status Code Reference',
        description: 'Look up HTTP status codes and their meanings',
        category: 'dev',
        icon: '🌐',
        inputLabel: 'Status Code or Search Term',
        placeholder: 'Enter status code (e.g., 404) or search term (e.g., "not found")',
        process: (data) => {
            const input = data.text.trim().toLowerCase();
            
            const statusCodes = {
                // 1xx Informational
                100: { code: '100', name: 'Continue', description: 'The server has received the request headers and the client should proceed to send the request body.' },
                101: { code: '101', name: 'Switching Protocols', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
                102: { code: '102', name: 'Processing', description: 'The server has received and is processing the request, but no response is available yet.' },
                
                // 2xx Success
                200: { code: '200', name: 'OK', description: 'Standard response for successful HTTP requests.' },
                201: { code: '201', name: 'Created', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
                202: { code: '202', name: 'Accepted', description: 'The request has been accepted for processing, but the processing has not been completed.' },
                204: { code: '204', name: 'No Content', description: 'The server successfully processed the request, but is not returning any content.' },
                
                // 3xx Redirection
                300: { code: '300', name: 'Multiple Choices', description: 'Indicates multiple options for the resource from which the client may choose.' },
                301: { code: '301', name: 'Moved Permanently', description: 'This and all future requests should be directed to the given URI.' },
                302: { code: '302', name: 'Found', description: 'Tells the client to look at another URL.' },
                304: { code: '304', name: 'Not Modified', description: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
                
                // 4xx Client Error
                400: { code: '400', name: 'Bad Request', description: 'The server cannot or will not process the request due to an apparent client error.' },
                401: { code: '401', name: 'Unauthorized', description: 'Authentication is required and has failed or has not yet been provided.' },
                403: { code: '403', name: 'Forbidden', description: 'The request was valid, but the server is refusing action.' },
                404: { code: '404', name: 'Not Found', description: 'The requested resource could not be found but may be available in the future.' },
                405: { code: '405', name: 'Method Not Allowed', description: 'A request method is not supported for the requested resource.' },
                409: { code: '409', name: 'Conflict', description: 'Indicates that the request could not be processed because of conflict in the request.' },
                422: { code: '422', name: 'Unprocessable Entity', description: 'The request was well-formed but was unable to be followed due to semantic errors.' },
                429: { code: '429', name: 'Too Many Requests', description: 'The user has sent too many requests in a given amount of time.' },
                
                // 5xx Server Error
                500: { code: '500', name: 'Internal Server Error', description: 'A generic error message when an unexpected condition was encountered.' },
                501: { code: '501', name: 'Not Implemented', description: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.' },
                502: { code: '502', name: 'Bad Gateway', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
                503: { code: '503', name: 'Service Unavailable', description: 'The server is currently unavailable (because it is overloaded or down for maintenance).' },
                504: { code: '504', name: 'Gateway Timeout', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' }
            };
            
            if (!input) {
                // Show all status codes grouped by category
                const groups = {
                    '1xx - Informational': [100, 101, 102],
                    '2xx - Success': [200, 201, 202, 204],
                    '3xx - Redirection': [300, 301, 302, 304],
                    '4xx - Client Error': [400, 401, 403, 404, 405, 409, 422, 429],
                    '5xx - Server Error': [500, 501, 502, 503, 504]
                };
                
                let result = `🌐 HTTP STATUS CODES REFERENCE

Total codes in database: ${Object.keys(statusCodes).length}

`;
                
                Object.entries(groups).forEach(([groupName, codes]) => {
                    result += `${groupName}:\n`;
                    codes.forEach(code => {
                        const status = statusCodes[code];
                        result += `  ${status.code} - ${status.name}\n`;
                    });
                    result += '\n';
                });
                
                result += `💡 USAGE:
• Enter a status code (e.g., "404") to get detailed info
• Search by name (e.g., "not found", "server error")
• All codes include descriptions and common use cases`;
                
                return result;
            }
            
            // Check if input is a direct status code
            const codeNum = parseInt(input);
            if (statusCodes[codeNum]) {
                const status = statusCodes[codeNum];
                const category = Math.floor(codeNum / 100) + 'xx';
                const categoryNames = {
                    '1xx': 'Informational',
                    '2xx': 'Success',
                    '3xx': 'Redirection',
                    '4xx': 'Client Error',
                    '5xx': 'Server Error'
                };
                
                return `🌐 HTTP STATUS CODE DETAILS

Code: ${status.code}
Name: ${status.name}
Category: ${category} - ${categoryNames[category]}

Description:
${status.description}

Common Usage:
${getUsageExamples(codeNum)}`;
            }
            
            // Search by name or description
            const matches = Object.values(statusCodes).filter(status => 
                status.name.toLowerCase().includes(input) ||
                status.description.toLowerCase().includes(input)
            );
            
            if (matches.length > 0) {
                let result = `🌐 HTTP STATUS CODE SEARCH RESULTS

Search term: "${input}"
Found ${matches.length} match${matches.length === 1 ? '' : 'es'}:

`;
                matches.forEach(status => {
                    result += `${status.code} - ${status.name}\n${status.description}\n\n`;
                });
                
                return result;
            }
            
            return `❌ No HTTP status codes found matching "${input}"

Try:
• A specific code (200, 404, 500)
• A status name ("not found", "server error")
• A description keyword ("authentication", "timeout")

Enter nothing to see all available codes.`;
            
            function getUsageExamples(code) {
                const examples = {
                    200: '• Successful GET requests\n• Successful POST requests with response data\n• API calls returning data',
                    201: '• Creating new resources\n• User registration\n• File uploads',
                    400: '• Invalid JSON in request body\n• Missing required parameters\n• Malformed URLs',
                    401: '• Invalid or missing authentication tokens\n• Expired sessions\n• Protected resources',
                    403: '• Insufficient permissions\n• Rate limiting\n• Blocked IP addresses',
                    404: '• Non-existent pages or resources\n• Deleted content\n• Invalid URLs',
                    500: '• Database connection errors\n• Unhandled exceptions\n• Server crashes'
                };
                
                return examples[code] || '• General use case for this status code\n• Check HTTP specification for details';
            }
        }
    }));

    // 4. MIME Type Checker
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'mime-type-checker',
        name: 'MIME Type Checker',
        description: 'Look up MIME types by file extension or vice versa',
        category: 'dev',
        icon: '📄',
        inputLabel: 'File extension or MIME type',
        placeholder: 'Enter extension (e.g., .jpg) or MIME type (e.g., image/jpeg)',
        process: (data) => {
            const input = data.text.trim().toLowerCase();
            
            const mimeTypes = {
                // Images
                '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
                '.gif': 'image/gif', '.bmp': 'image/bmp', '.webp': 'image/webp',
                '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.tiff': 'image/tiff',
                
                // Audio
                '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
                '.m4a': 'audio/m4a', '.flac': 'audio/flac', '.aac': 'audio/aac',
                
                // Video
                '.mp4': 'video/mp4', '.avi': 'video/x-msvideo', '.mov': 'video/quicktime',
                '.wmv': 'video/x-ms-wmv', '.flv': 'video/x-flv', '.webm': 'video/webm',
                
                // Documents
                '.pdf': 'application/pdf', '.doc': 'application/msword',
                '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                '.xls': 'application/vnd.ms-excel',
                '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                '.ppt': 'application/vnd.ms-powerpoint',
                '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                
                // Text
                '.txt': 'text/plain', '.html': 'text/html', '.htm': 'text/html',
                '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
                '.xml': 'text/xml', '.csv': 'text/csv', '.md': 'text/markdown',
                
                // Archives
                '.zip': 'application/zip', '.rar': 'application/x-rar-compressed',
                '.7z': 'application/x-7z-compressed', '.tar': 'application/x-tar',
                '.gz': 'application/gzip',
                
                // Applications
                '.exe': 'application/octet-stream', '.dmg': 'application/x-apple-diskimage',
                '.deb': 'application/vnd.debian.binary-package',
                '.rpm': 'application/x-redhat-package-manager'
            };
            
            if (!input) {
                const categories = {
                    'Images': ['.jpg', '.png', '.gif', '.svg', '.webp'],
                    'Audio': ['.mp3', '.wav', '.ogg', '.m4a'],
                    'Video': ['.mp4', '.avi', '.mov', '.webm'],
                    'Documents': ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
                    'Text': ['.txt', '.html', '.css', '.js', '.json'],
                    'Archives': ['.zip', '.rar', '.7z', '.tar', '.gz']
                };
                
                let result = `📄 MIME TYPES REFERENCE

Total types in database: ${Object.keys(mimeTypes).length}

COMMON FILE TYPES BY CATEGORY:
`;
                
                Object.entries(categories).forEach(([category, extensions]) => {
                    result += `\n${category}:\n`;
                    extensions.forEach(ext => {
                        result += `  ${ext} → ${mimeTypes[ext]}\n`;
                    });
                });
                
                result += `\n💡 USAGE:
• Enter file extension (.jpg, .pdf) to get MIME type
• Enter MIME type to find matching extensions
• Used for HTTP Content-Type headers
• Important for file uploads and downloads`;
                
                return result;
            }
            
            // Check if input is a file extension
            const normalizedExt = input.startsWith('.') ? input : '.' + input;
            if (mimeTypes[normalizedExt]) {
                const mimeType = mimeTypes[normalizedExt];
                const category = mimeType.split('/')[0];
                
                // Find other extensions with same MIME type
                const otherExtensions = Object.entries(mimeTypes)
                    .filter(([ext, mime]) => mime === mimeType && ext !== normalizedExt)
                    .map(([ext]) => ext);
                
                return `📄 MIME TYPE LOOKUP

File Extension: ${normalizedExt}
MIME Type: ${mimeType}
Category: ${category}
${otherExtensions.length > 0 ? `Other extensions: ${otherExtensions.join(', ')}` : ''}

USAGE EXAMPLES:
• HTTP Header: Content-Type: ${mimeType}
• HTML: <link type="${mimeType}">
• Form upload: accept="${normalizedExt}"

DESCRIPTION:
${getMimeDescription(mimeType)}`;
            }
            
            // Check if input is a MIME type
            const matchingExtensions = Object.entries(mimeTypes)
                .filter(([ext, mime]) => mime.toLowerCase() === input)
                .map(([ext]) => ext);
            
            if (matchingExtensions.length > 0) {
                return `📄 MIME TYPE LOOKUP

MIME Type: ${input}
File Extensions: ${matchingExtensions.join(', ')}
Category: ${input.split('/')[0]}

USAGE EXAMPLES:
• HTTP Header: Content-Type: ${input}
• File detection: Check extension against ${matchingExtensions.join(' or ')}

DESCRIPTION:
${getMimeDescription(input)}`;
            }
            
            // Search for partial matches
            const partialMatches = Object.entries(mimeTypes)
                .filter(([ext, mime]) => 
                    ext.includes(input) || mime.includes(input)
                );
            
            if (partialMatches.length > 0) {
                let result = `📄 PARTIAL MATCHES FOUND

Search term: "${input}"
Found ${partialMatches.length} match${partialMatches.length === 1 ? '' : 'es'}:

`;
                partialMatches.slice(0, 20).forEach(([ext, mime]) => {
                    result += `${ext} → ${mime}\n`;
                });
                
                if (partialMatches.length > 20) {
                    result += `... (showing first 20 of ${partialMatches.length} matches)`;
                }
                
                return result;
            }
            
            return `❌ No MIME type found for "${input}"

Try:
• File extension with dot (.pdf, .jpg)
• File extension without dot (pdf, jpg)
• Full MIME type (image/jpeg, text/html)
• Partial search (image, text, application)

Enter nothing to see all available types.`;
            
            function getMimeDescription(mimeType) {
                const descriptions = {
                    'image/jpeg': 'JPEG image format - widely supported, lossy compression',
                    'image/png': 'PNG image format - lossless compression, supports transparency',
                    'text/html': 'HTML document - web page markup language',
                    'application/json': 'JSON data format - lightweight data interchange',
                    'application/pdf': 'PDF document - portable document format',
                    'text/css': 'Cascading Style Sheets - web page styling',
                    'text/javascript': 'JavaScript code - client-side scripting language',
                    'video/mp4': 'MP4 video format - widely supported video container'
                };
                
                return descriptions[mimeType] || 'Standard MIME type used for content identification';
            }
        }
    }));

    // 5. User Agent Parser
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'user-agent-parser',
        name: 'User Agent Parser',
        description: 'Parse and analyze HTTP User-Agent strings',
        category: 'dev',
        icon: '🔍',
        inputLabel: 'User-Agent String',
        placeholder: 'Enter User-Agent string to parse...',
        process: (data) => {
            const userAgent = data.text.trim();
            
            if (!userAgent) {
                return `🔍 USER AGENT PARSER

Enter a User-Agent string to analyze browser, OS, and device information.

EXAMPLE USER AGENTS:
Chrome on Windows:
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36

Safari on iPhone:
Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1

Firefox on Linux:
Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0

💡 COMMON USES:
• Browser detection
• Feature capability detection
• Analytics and tracking
• Mobile vs desktop detection`;
            }
            
            // Parse browser
            let browser = 'Unknown';
            let browserVersion = '';
            
            if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
                browser = 'Chrome';
                const match = userAgent.match(/Chrome\/([\d.]+)/);
                browserVersion = match ? match[1] : '';
            } else if (userAgent.includes('Firefox/')) {
                browser = 'Firefox';
                const match = userAgent.match(/Firefox\/([\d.]+)/);
                browserVersion = match ? match[1] : '';
            } else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
                browser = 'Safari';
                const match = userAgent.match(/Version\/([\d.]+)/);
                browserVersion = match ? match[1] : '';
            } else if (userAgent.includes('Edg/')) {
                browser = 'Edge';
                const match = userAgent.match(/Edg\/([\d.]+)/);
                browserVersion = match ? match[1] : '';
            } else if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) {
                browser = 'Opera';
                const match = userAgent.match(/(?:Opera\/|OPR\/)?([\d.]+)/);
                browserVersion = match ? match[1] : '';
            }
            
            // Parse operating system
            let os = 'Unknown';
            let osVersion = '';
            
            if (userAgent.includes('Windows NT')) {
                os = 'Windows';
                const versions = {
                    '10.0': '10',
                    '6.3': '8.1',
                    '6.2': '8',
                    '6.1': '7',
                    '6.0': 'Vista',
                    '5.1': 'XP'
                };
                const match = userAgent.match(/Windows NT ([\d.]+)/);
                if (match) {
                    osVersion = versions[match[1]] || match[1];
                }
            } else if (userAgent.includes('Mac OS X') || userAgent.includes('macOS')) {
                os = 'macOS';
                const match = userAgent.match(/Mac OS X ([\d_]+)/);
                if (match) {
                    osVersion = match[1].replace(/_/g, '.');
                }
            } else if (userAgent.includes('Linux')) {
                os = 'Linux';
            } else if (userAgent.includes('iPhone OS')) {
                os = 'iOS';
                const match = userAgent.match(/iPhone OS ([\d_]+)/);
                if (match) {
                    osVersion = match[1].replace(/_/g, '.');
                }
            } else if (userAgent.includes('Android')) {
                os = 'Android';
                const match = userAgent.match(/Android ([\d.]+)/);
                osVersion = match ? match[1] : '';
            }
            
            // Detect device type
            let deviceType = 'Desktop';
            let deviceInfo = '';
            
            if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
                if (userAgent.includes('iPhone')) {
                    deviceType = 'Mobile';
                    deviceInfo = 'iPhone';
                } else if (userAgent.includes('iPad')) {
                    deviceType = 'Tablet';
                    deviceInfo = 'iPad';
                } else if (userAgent.includes('Android')) {
                    deviceType = userAgent.includes('Mobile') ? 'Mobile' : 'Tablet';
                    deviceInfo = 'Android Device';
                } else {
                    deviceType = 'Mobile';
                }
            } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
                deviceType = 'Tablet';
            }
            
            // Detect architecture
            let architecture = '';
            if (userAgent.includes('x64') || userAgent.includes('x86_64')) {
                architecture = '64-bit';
            } else if (userAgent.includes('x86') || userAgent.includes('i686')) {
                architecture = '32-bit';
            } else if (userAgent.includes('ARM') || userAgent.includes('arm64')) {
                architecture = 'ARM';
            }
            
            // Detect rendering engine
            let engine = '';
            if (userAgent.includes('WebKit')) {
                engine = 'WebKit';
            } else if (userAgent.includes('Gecko')) {
                engine = 'Gecko';
            } else if (userAgent.includes('Trident')) {
                engine = 'Trident';
            }
            
            // Check for bot/crawler
            const botIndicators = ['bot', 'crawl', 'spider', 'scrape', 'google', 'bing', 'yahoo'];
            const isBot = botIndicators.some(indicator => 
                userAgent.toLowerCase().includes(indicator)
            );
            
            return `🔍 USER AGENT ANALYSIS

BROWSER INFORMATION:
Browser: ${browser}${browserVersion ? ' ' + browserVersion : ''}
Rendering Engine: ${engine || 'Unknown'}

OPERATING SYSTEM:
OS: ${os}${osVersion ? ' ' + osVersion : ''}
Architecture: ${architecture || 'Unknown'}

DEVICE INFORMATION:
Device Type: ${deviceType}
${deviceInfo ? `Device: ${deviceInfo}` : ''}

ADDITIONAL INFO:
Bot/Crawler: ${isBot ? 'Yes' : 'No'}
Mobile: ${deviceType === 'Mobile' ? 'Yes' : 'No'}
Touch Capable: ${deviceType !== 'Desktop' ? 'Likely' : 'No'}

RAW USER AGENT:
${userAgent}

PARSED COMPONENTS:
${userAgent.split(' ').map((component, i) => `${i + 1}. ${component}`).join('\n')}

💡 SECURITY NOTE:
User-Agent strings can be spoofed and should not be relied upon for security purposes. Use feature detection instead of browser detection when possible.`;
        }
    }));

    // 6. Timestamp Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'timestamp-converter',
        name: 'Timestamp Converter',
        description: 'Convert between Unix timestamps and human-readable dates',
        category: 'dev',
        icon: '⏰',
        fromOptions: [
            { value: 'unix', label: 'Unix Timestamp (seconds)' },
            { value: 'unix_ms', label: 'Unix Timestamp (milliseconds)' },
            { value: 'iso', label: 'ISO 8601 String' },
            { value: 'current', label: 'Current Time' }
        ],
        convert: (value, from, to) => {
            let date;
            
            // Convert input to Date object
            switch (from) {
                case 'unix':
                    date = new Date(parseInt(value) * 1000);
                    break;
                case 'unix_ms':
                    date = new Date(parseInt(value));
                    break;
                case 'iso':
                    date = new Date(value);
                    break;
                case 'current':
                    date = new Date();
                    break;
                default:
                    throw new Error('Invalid input format');
            }
            
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date/timestamp');
            }
            
            // Convert to target format
            switch (to) {
                case 'unix':
                    return Math.floor(date.getTime() / 1000).toString();
                case 'unix_ms':
                    return date.getTime().toString();
                case 'iso':
                    return date.toISOString();
                case 'local':
                    return date.toString();
                case 'utc':
                    return date.toUTCString();
                case 'readable':
                    return date.toLocaleString();
                default:
                    // Return comprehensive format
                    const unix = Math.floor(date.getTime() / 1000);
                    const unixMs = date.getTime();
                    
                    return `TIMESTAMP CONVERSION RESULTS

Input: ${value} (${from})
Converted Date: ${date.toLocaleString()}

ALL FORMATS:
Unix Timestamp (seconds): ${unix}
Unix Timestamp (milliseconds): ${unixMs}
ISO 8601: ${date.toISOString()}
Local Time: ${date.toString()}
UTC: ${date.toUTCString()}
Readable: ${date.toLocaleString()}

COMPONENTS:
Year: ${date.getFullYear()}
Month: ${date.getMonth() + 1} (${date.toLocaleDateString('en', {month: 'long'})})
Day: ${date.getDate()}
Hour: ${date.getHours()} (24-hour)
Minute: ${date.getMinutes()}
Second: ${date.getSeconds()}
Day of Week: ${date.toLocaleDateString('en', {weekday: 'long'})}

TIMEZONE INFO:
Timezone Offset: ${date.getTimezoneOffset()} minutes
Local Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'}

RELATIVE TIME:
${getRelativeTime(date)}`;
            }
        }
    }));
    
    function getRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.abs(Math.floor(diff / 1000));
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        const isInPast = diff > 0;
        const suffix = isInPast ? 'ago' : 'from now';
        
        if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ${suffix}`;
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;
        return `${days} day${days !== 1 ? 's' : ''} ${suffix}`;
    }

    // 7. Epoch Time Converter (specialized timestamp tool)
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'epoch-time-converter',
        name: 'Epoch Time Converter',
        description: 'Convert and generate epoch/Unix timestamps with detailed analysis',
        category: 'dev',
        icon: '📅',
        fields: [
            {
                name: 'inputType',
                label: 'Input Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'current', label: 'Current Time' },
                    { value: 'custom_date', label: 'Custom Date/Time' },
                    { value: 'epoch', label: 'Epoch Timestamp' }
                ],
                value: 'current'
            },
            {
                name: 'customDate',
                label: 'Custom Date (YYYY-MM-DD HH:mm:ss)',
                type: 'text',
                placeholder: '2024-01-01 12:00:00'
            },
            {
                name: 'epochInput',
                label: 'Epoch Timestamp',
                type: 'number',
                placeholder: '1704110400'
            }
        ],
        generate: (data) => {
            const inputType = data.inputType;
            let targetDate;
            
            switch (inputType) {
                case 'current':
                    targetDate = new Date();
                    break;
                case 'custom_date':
                    if (!data.customDate) {
                        throw new Error('Please enter a custom date');
                    }
                    targetDate = new Date(data.customDate);
                    if (isNaN(targetDate.getTime())) {
                        throw new Error('Invalid date format. Use YYYY-MM-DD HH:mm:ss');
                    }
                    break;
                case 'epoch':
                    if (!data.epochInput) {
                        throw new Error('Please enter an epoch timestamp');
                    }
                    const epochValue = parseInt(data.epochInput);
                    // Detect if input is in seconds or milliseconds
                    targetDate = epochValue > 1e10 ? new Date(epochValue) : new Date(epochValue * 1000);
                    break;
            }
            
            const epochSeconds = Math.floor(targetDate.getTime() / 1000);
            const epochMilliseconds = targetDate.getTime();
            
            // Calculate some interesting epoch-related values
            const daysSinceEpoch = Math.floor(epochSeconds / 86400);
            const yearsSinceEpoch = ((targetDate.getFullYear() - 1970));
            
            // Calculate leap seconds (approximate)
            const leapSeconds = Math.floor((targetDate.getFullYear() - 1972) / 4) * 1; // Rough approximation
            
            return `📅 EPOCH TIME CONVERSION

INPUT:
Type: ${inputType.replace('_', ' ')}
${inputType === 'custom_date' ? `Date: ${data.customDate}` : ''}
${inputType === 'epoch' ? `Timestamp: ${data.epochInput}` : ''}

EPOCH TIMESTAMPS:
Seconds: ${epochSeconds}
Milliseconds: ${epochMilliseconds}
Microseconds: ${epochMilliseconds}000
Nanoseconds: ${epochMilliseconds}000000

FORMATTED DATES:
Local: ${targetDate.toLocaleString()}
UTC: ${targetDate.toUTCString()}
ISO 8601: ${targetDate.toISOString()}
Unix date: ${targetDate.toString()}

DATE COMPONENTS:
Year: ${targetDate.getFullYear()}
Month: ${targetDate.getMonth() + 1} (${targetDate.toLocaleDateString('en', {month: 'long'})})
Day: ${targetDate.getDate()}
Hour: ${targetDate.getHours()} (24-hour format)
Minute: ${targetDate.getMinutes()}
Second: ${targetDate.getSeconds()}
Millisecond: ${targetDate.getMilliseconds()}
Day of Week: ${targetDate.getDay()} (${targetDate.toLocaleDateString('en', {weekday: 'long'})})
Day of Year: ${getDayOfYear(targetDate)}

EPOCH CALCULATIONS:
Days since Unix Epoch: ${daysSinceEpoch.toLocaleString()}
Years since Unix Epoch: ${yearsSinceEpoch}
Approximate leap seconds: ${leapSeconds}

TIMEZONE INFO:
Local Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown'}
UTC Offset: ${getUTCOffset(targetDate)}
DST Active: ${isDSTActive(targetDate)}

RELATIVE TIME:
${getRelativeTime(targetDate)}

BINARY REPRESENTATION:
32-bit (seconds): ${epochSeconds.toString(2).padStart(32, '0')}
64-bit (milliseconds): ${epochMilliseconds.toString(2)}

HEX REPRESENTATION:
Seconds: 0x${epochSeconds.toString(16).toUpperCase()}
Milliseconds: 0x${epochMilliseconds.toString(16).toUpperCase()}

💡 EPOCH FACTS:
• Unix Epoch started: January 1, 1970 00:00:00 UTC
• Y2K38 Problem: 32-bit timestamps overflow on January 19, 2038
• Leap seconds are not included in Unix timestamps
• Unix timestamps are always in UTC`;
        }
    }));
    
    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    function getUTCOffset(date) {
        const offset = date.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset <= 0 ? '+' : '-';
        return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    function isDSTActive(date) {
        const jan = new Date(date.getFullYear(), 0, 1);
        const jul = new Date(date.getFullYear(), 6, 1);
        const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
        return date.getTimezoneOffset() < stdOffset ? 'Yes' : 'No';
    }

})();