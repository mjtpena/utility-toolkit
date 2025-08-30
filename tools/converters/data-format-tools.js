// Data Format Converter Tools
(function() {
    'use strict';

    // 1. JSON Formatter/Minifier
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'json-formatter',
        name: 'JSON Formatter & Minifier',
        description: 'Format, minify, and validate JSON data',
        category: 'data',
        icon: '📋',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'format', label: 'Format (Pretty Print)' },
                    { value: 'minify', label: 'Minify (Compact)' },
                    { value: 'validate', label: 'Validate Only' }
                ]
            },
            {
                name: 'indentSize',
                label: 'Indent Size',
                type: 'number',
                value: '2',
                min: '1',
                max: '8'
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const operation = data.operation;
            const indentSize = parseInt(data.indentSize || 2);
            
            if (!text) {
                throw new Error('Please enter JSON data to process');
            }
            
            try {
                const parsed = JSON.parse(text);
                
                if (operation === 'validate') {
                    const size = new Blob([text]).size;
                    const keys = JSON.stringify(parsed).match(/"[^"]*":/g) || [];
                    const uniqueKeys = new Set(keys).size;
                    
                    return `✅ JSON VALIDATION SUCCESSFUL

Original size: ${size} bytes
Keys found: ${keys.length}
Unique keys: ${uniqueKeys}
Data type: ${Array.isArray(parsed) ? 'Array' : typeof parsed}

The JSON is valid and well-formed.

PARSED PREVIEW:
${JSON.stringify(parsed, null, 2).substring(0, 500)}${JSON.stringify(parsed, null, 2).length > 500 ? '...' : ''}`;
                }
                
                let result;
                if (operation === 'format') {
                    result = JSON.stringify(parsed, null, indentSize);
                } else { // minify
                    result = JSON.stringify(parsed);
                }
                
                const originalSize = new Blob([text]).size;
                const newSize = new Blob([result]).size;
                const savings = originalSize - newSize;
                const compression = originalSize > 0 ? ((savings / originalSize) * 100).toFixed(1) : 0;
                
                return `JSON ${operation.toUpperCase()} COMPLETE

Original size: ${originalSize} bytes
New size: ${newSize} bytes
${operation === 'minify' ? 'Compression' : 'Expansion'}: ${Math.abs(savings)} bytes (${Math.abs(compression)}%)

RESULT:
${result}`;
                
            } catch (error) {
                throw new Error(`Invalid JSON: ${error.message}`);
            }
        }
    }));

    // 2. XML Formatter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'xml-formatter',
        name: 'XML Formatter',
        description: 'Format and validate XML data',
        category: 'data',
        icon: '📄',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'format', label: 'Format (Pretty Print)' },
                    { value: 'minify', label: 'Minify (Remove Whitespace)' },
                    { value: 'validate', label: 'Validate Structure' }
                ]
            },
            {
                name: 'indentSize',
                label: 'Indent Size',
                type: 'number',
                value: '2',
                min: '1',
                max: '8'
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const operation = data.operation;
            const indentSize = parseInt(data.indentSize || 2);
            
            if (!text) {
                throw new Error('Please enter XML data to process');
            }
            
            // Basic XML validation and formatting
            const formatXML = (xml, indent) => {
                const PADDING = ' '.repeat(indent);
                const reg = /(>)(<)(\/*)/g;
                let formatted = xml.replace(reg, '$1\r\n$2$3');
                let pad = 0;
                
                return formatted.split('\r\n').map((line) => {
                    let indent = 0;
                    if (line.match(/.+<\/\w[^>]*>$/)) {
                        indent = 0;
                    } else if (line.match(/^<\/\w/)) {
                        if (pad !== 0) {
                            pad -= 1;
                        }
                    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
                        indent = 1;
                    } else {
                        indent = 0;
                    }
                    
                    const padding = PADDING.repeat(pad);
                    pad += indent;
                    
                    return padding + line;
                }).join('\n');
            };
            
            const minifyXML = (xml) => {
                return xml.replace(/>\s*</g, '><').replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
            };
            
            const validateXML = (xml) => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, "text/xml");
                const errors = xmlDoc.getElementsByTagName("parsererror");
                return errors.length === 0;
            };
            
            try {
                if (operation === 'validate') {
                    const isValid = validateXML(text);
                    const tagMatches = text.match(/<\/?[\w\s="'.-]+>/g) || [];
                    const openTags = text.match(/<[^\/][^>]*>/g) || [];
                    const closeTags = text.match(/<\/[^>]*>/g) || [];
                    
                    return `${isValid ? '✅' : '❌'} XML VALIDATION ${isValid ? 'SUCCESSFUL' : 'FAILED'}

Tags found: ${tagMatches.length}
Opening tags: ${openTags.length}
Closing tags: ${closeTags.length}
Size: ${new Blob([text]).size} bytes

${isValid ? 'The XML structure appears to be valid.' : 'The XML contains syntax errors or malformed structure.'}

SAMPLE STRUCTURE:
${text.substring(0, 300)}${text.length > 300 ? '...' : ''}`;
                }
                
                let result;
                if (operation === 'format') {
                    result = formatXML(text, indentSize);
                } else { // minify
                    result = minifyXML(text);
                }
                
                const originalSize = new Blob([text]).size;
                const newSize = new Blob([result]).size;
                const savings = originalSize - newSize;
                
                return `XML ${operation.toUpperCase()} COMPLETE

Original size: ${originalSize} bytes
New size: ${newSize} bytes
Change: ${savings} bytes

RESULT:
${result}`;
                
            } catch (error) {
                throw new Error(`XML processing error: ${error.message}`);
            }
        }
    }));

    // 3. CSV to JSON Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'csv-to-json-converter',
        name: 'CSV to JSON Converter',
        description: 'Convert CSV data to JSON format',
        category: 'data',
        icon: '📊',
        extraFields: [
            {
                name: 'delimiter',
                label: 'CSV Delimiter',
                type: 'select',
                options: [
                    { value: ',', label: 'Comma (,)' },
                    { value: ';', label: 'Semicolon (;)' },
                    { value: '\t', label: 'Tab' },
                    { value: '|', label: 'Pipe (|)' }
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
                name: 'outputFormat',
                label: 'JSON Format',
                type: 'select',
                options: [
                    { value: 'array_of_objects', label: 'Array of Objects' },
                    { value: 'object_of_arrays', label: 'Object of Arrays' },
                    { value: 'array_of_arrays', label: 'Array of Arrays' }
                ],
                value: 'array_of_objects'
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const delimiter = data.delimiter === '\t' ? '\t' : data.delimiter;
            const hasHeaders = data.hasHeaders;
            const outputFormat = data.outputFormat;
            
            if (!text) {
                throw new Error('Please enter CSV data to convert');
            }
            
            try {
                const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                if (lines.length === 0) {
                    throw new Error('No valid CSV data found');
                }
                
                const rows = lines.map(line => {
                    // Simple CSV parsing (handles basic cases)
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
                    
                    return cells.map(cell => cell.replace(/^"|"$/g, '')); // Remove surrounding quotes
                });
                
                let headers = [];
                let dataRows = rows;
                
                if (hasHeaders) {
                    headers = rows[0];
                    dataRows = rows.slice(1);
                } else {
                    // Generate generic headers
                    const maxColumns = Math.max(...rows.map(row => row.length));
                    headers = Array.from({length: maxColumns}, (_, i) => `Column_${i + 1}`);
                }
                
                let result;
                
                switch (outputFormat) {
                    case 'array_of_objects':
                        result = dataRows.map(row => {
                            const obj = {};
                            headers.forEach((header, index) => {
                                obj[header] = row[index] || '';
                            });
                            return obj;
                        });
                        break;
                        
                    case 'object_of_arrays':
                        result = {};
                        headers.forEach((header, index) => {
                            result[header] = dataRows.map(row => row[index] || '');
                        });
                        break;
                        
                    case 'array_of_arrays':
                        result = hasHeaders ? [headers, ...dataRows] : dataRows;
                        break;
                }
                
                const jsonString = JSON.stringify(result, null, 2);
                
                return `CSV TO JSON CONVERSION COMPLETE

Input: ${lines.length} rows, ${headers.length} columns
Headers: ${hasHeaders ? 'Yes' : 'No (generated)'}
Delimiter: "${delimiter}"
Output format: ${outputFormat.replace(/_/g, ' ')}
JSON size: ${new Blob([jsonString]).size} bytes

HEADERS:
${headers.join(', ')}

RESULT:
${jsonString}`;
                
            } catch (error) {
                throw new Error(`CSV parsing error: ${error.message}`);
            }
        }
    }));

    // 4. JSON to CSV Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'json-to-csv-converter',
        name: 'JSON to CSV Converter',
        description: 'Convert JSON data to CSV format',
        category: 'data',
        icon: '📄',
        extraFields: [
            {
                name: 'delimiter',
                label: 'CSV Delimiter',
                type: 'select',
                options: [
                    { value: ',', label: 'Comma (,)' },
                    { value: ';', label: 'Semicolon (;)' },
                    { value: '\t', label: 'Tab' },
                    { value: '|', label: 'Pipe (|)' }
                ],
                value: ','
            },
            {
                name: 'includeHeaders',
                label: 'Include headers row',
                type: 'checkbox',
                value: true
            },
            {
                name: 'quoteFields',
                label: 'Quote text fields',
                type: 'checkbox',
                value: true
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const delimiter = data.delimiter === '\t' ? '\t' : data.delimiter;
            const includeHeaders = data.includeHeaders;
            const quoteFields = data.quoteFields;
            
            if (!text) {
                throw new Error('Please enter JSON data to convert');
            }
            
            try {
                const parsed = JSON.parse(text);
                
                if (!Array.isArray(parsed) || parsed.length === 0) {
                    throw new Error('JSON must be a non-empty array for CSV conversion');
                }
                
                // Get all unique keys from all objects
                const allKeys = new Set();
                parsed.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        Object.keys(item).forEach(key => allKeys.add(key));
                    }
                });
                
                const headers = Array.from(allKeys);
                
                if (headers.length === 0) {
                    throw new Error('No object properties found to convert to CSV columns');
                }
                
                const escapeCsvValue = (value) => {
                    let stringValue = String(value);
                    
                    // Handle null/undefined
                    if (value === null || value === undefined) {
                        stringValue = '';
                    }
                    
                    // Quote if contains delimiter, quotes, or newlines
                    if (quoteFields || stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')) {
                        stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
                    }
                    
                    return stringValue;
                };
                
                const csvRows = [];
                
                // Add headers
                if (includeHeaders) {
                    csvRows.push(headers.map(header => escapeCsvValue(header)).join(delimiter));
                }
                
                // Add data rows
                parsed.forEach(item => {
                    const row = headers.map(header => {
                        const value = typeof item === 'object' && item !== null ? item[header] : item;
                        return escapeCsvValue(value);
                    });
                    csvRows.push(row.join(delimiter));
                });
                
                const csvString = csvRows.join('\n');
                
                return `JSON TO CSV CONVERSION COMPLETE

Input: ${parsed.length} objects
Columns: ${headers.length}
Headers included: ${includeHeaders}
Delimiter: "${delimiter}"
Quoted fields: ${quoteFields}
CSV size: ${new Blob([csvString]).size} bytes

COLUMNS:
${headers.join(', ')}

RESULT:
${csvString}`;
                
            } catch (error) {
                if (error.name === 'SyntaxError') {
                    throw new Error(`Invalid JSON: ${error.message}`);
                }
                throw new Error(`Conversion error: ${error.message}`);
            }
        }
    }));

    // 5. Base64 Encoder/Decoder
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'base64-encoder-decoder',
        name: 'Base64 Encoder/Decoder',
        description: 'Encode and decode Base64 data',
        category: 'data',
        icon: '🔒',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'encode', label: 'Encode to Base64' },
                    { value: 'decode', label: 'Decode from Base64' }
                ]
            },
            {
                name: 'urlSafe',
                label: 'URL-safe Base64',
                type: 'checkbox',
                value: false
            }
        ],
        process: (data) => {
            const text = data.text;
            const operation = data.operation;
            const urlSafe = data.urlSafe;
            
            if (!text) {
                throw new Error('Please enter text to encode/decode');
            }
            
            try {
                let result;
                
                if (operation === 'encode') {
                    // Encode to Base64
                    result = btoa(unescape(encodeURIComponent(text)));
                    
                    if (urlSafe) {
                        result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
                    }
                    
                    const originalSize = new Blob([text]).size;
                    const encodedSize = new Blob([result]).size;
                    const expansion = encodedSize - originalSize;
                    
                    return `BASE64 ENCODING COMPLETE

Original text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}
Original size: ${originalSize} bytes
Encoded size: ${encodedSize} bytes
Size increase: ${expansion} bytes (+${((expansion / originalSize) * 100).toFixed(1)}%)
URL-safe: ${urlSafe}

ENCODED RESULT:
${result}`;
                    
                } else {
                    // Decode from Base64
                    let base64Text = text;
                    
                    if (urlSafe) {
                        // Convert URL-safe back to standard Base64
                        base64Text = base64Text.replace(/-/g, '+').replace(/_/g, '/');
                        // Add padding if necessary
                        while (base64Text.length % 4) {
                            base64Text += '=';
                        }
                    }
                    
                    result = decodeURIComponent(escape(atob(base64Text)));
                    
                    const encodedSize = new Blob([text]).size;
                    const decodedSize = new Blob([result]).size;
                    
                    return `BASE64 DECODING COMPLETE

Encoded text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}
Encoded size: ${encodedSize} bytes
Decoded size: ${decodedSize} bytes
URL-safe: ${urlSafe}

DECODED RESULT:
${result}`;
                }
                
            } catch (error) {
                if (operation === 'decode') {
                    throw new Error('Invalid Base64 data. Please check your input.');
                }
                throw new Error(`${operation} error: ${error.message}`);
            }
        }
    }));

    // 6. URL Encoder/Decoder
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'url-encoder-decoder',
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URL/URI components',
        category: 'data',
        icon: '🌐',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'encode', label: 'URL Encode' },
                    { value: 'decode', label: 'URL Decode' },
                    { value: 'encode_component', label: 'Encode Component Only' },
                    { value: 'decode_component', label: 'Decode Component Only' }
                ]
            }
        ],
        process: (data) => {
            const text = data.text;
            const operation = data.operation;
            
            if (!text) {
                throw new Error('Please enter text to encode/decode');
            }
            
            try {
                let result;
                let description;
                
                switch (operation) {
                    case 'encode':
                        result = encodeURI(text);
                        description = 'Full URL encoding (preserves URL structure)';
                        break;
                    case 'decode':
                        result = decodeURI(text);
                        description = 'Full URL decoding';
                        break;
                    case 'encode_component':
                        result = encodeURIComponent(text);
                        description = 'Component encoding (encodes all special characters)';
                        break;
                    case 'decode_component':
                        result = decodeURIComponent(text);
                        description = 'Component decoding';
                        break;
                }
                
                const originalSize = new Blob([text]).size;
                const resultSize = new Blob([result]).size;
                const difference = resultSize - originalSize;
                
                return `URL ${operation.toUpperCase().replace('_', ' ')} COMPLETE

Method: ${description}
Original: ${text}
Original size: ${originalSize} bytes
Result size: ${resultSize} bytes
Size change: ${difference > 0 ? '+' : ''}${difference} bytes

RESULT:
${result}

COMMON URL ENCODING:
Space → %20
! → %21
# → %23
$ → %24
& → %26
' → %27
( → %28
) → %29
+ → %2B`;
                
            } catch (error) {
                throw new Error(`URL ${operation} error: ${error.message}`);
            }
        }
    }));

    // 7. HTML Encoder/Decoder
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'html-encoder-decoder',
        name: 'HTML Encoder/Decoder',
        description: 'Encode and decode HTML entities',
        category: 'data',
        icon: '🏷️',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'encode', label: 'Encode HTML Entities' },
                    { value: 'decode', label: 'Decode HTML Entities' }
                ]
            },
            {
                name: 'encodeType',
                label: 'Encoding Type',
                type: 'select',
                options: [
                    { value: 'basic', label: 'Basic (< > & " \')' },
                    { value: 'all', label: 'All Special Characters' },
                    { value: 'numeric', label: 'Numeric Entities Only' }
                ],
                value: 'basic'
            }
        ],
        process: (data) => {
            const text = data.text;
            const operation = data.operation;
            const encodeType = data.encodeType;
            
            if (!text) {
                throw new Error('Please enter text to encode/decode');
            }
            
            try {
                let result;
                
                if (operation === 'encode') {
                    const htmlEntities = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#x27;',
                        '©': '&copy;',
                        '®': '&reg;',
                        '™': '&trade;',
                        ' ': '&nbsp;'
                    };
                    
                    if (encodeType === 'basic') {
                        result = text
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#x27;');
                    } else if (encodeType === 'numeric') {
                        result = text.replace(/[^\w\s]/g, (char) => {
                            return '&#' + char.charCodeAt(0) + ';';
                        });
                    } else { // all
                        result = text.replace(/[&<>"'©®™]/g, (char) => {
                            return htmlEntities[char] || char;
                        });
                    }
                    
                } else {
                    // Decode HTML entities
                    const entityMap = {
                        '&amp;': '&',
                        '&lt;': '<',
                        '&gt;': '>',
                        '&quot;': '"',
                        '&#x27;': "'",
                        '&#39;': "'",
                        '&apos;': "'",
                        '&nbsp;': ' ',
                        '&copy;': '©',
                        '&reg;': '®',
                        '&trade;': '™'
                    };
                    
                    result = text
                        // Named entities
                        .replace(/&[a-zA-Z]+;/g, (entity) => {
                            return entityMap[entity] || entity;
                        })
                        // Numeric entities
                        .replace(/&#(\d+);/g, (match, dec) => {
                            return String.fromCharCode(parseInt(dec));
                        })
                        // Hex entities
                        .replace(/&#x([a-fA-F0-9]+);/g, (match, hex) => {
                            return String.fromCharCode(parseInt(hex, 16));
                        });
                }
                
                const entitiesCount = operation === 'encode' 
                    ? (result.match(/&[#\w]+;/g) || []).length
                    : (text.match(/&[#\w]+;/g) || []).length;
                
                return `HTML ${operation.toUpperCase()} COMPLETE

Original: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}
Encoding type: ${encodeType}
Entities ${operation === 'encode' ? 'created' : 'decoded'}: ${entitiesCount}

RESULT:
${result}

COMMON HTML ENTITIES:
&amp; → &
&lt; → <
&gt; → >
&quot; → "
&copy; → ©
&nbsp; → (space)`;
                
            } catch (error) {
                throw new Error(`HTML ${operation} error: ${error.message}`);
            }
        }
    }));

    // 8. Markdown to HTML Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'markdown-to-html-converter',
        name: 'Markdown to HTML Converter',
        description: 'Convert Markdown text to HTML',
        category: 'data',
        icon: '📝',
        extraFields: [
            {
                name: 'includeCSS',
                label: 'Include basic CSS styling',
                type: 'checkbox',
                value: false
            },
            {
                name: 'openLinksNewTab',
                label: 'Open links in new tab',
                type: 'checkbox',
                value: true
            }
        ],
        process: (data) => {
            const text = data.text;
            const includeCSS = data.includeCSS;
            const openLinksNewTab = data.openLinksNewTab;
            
            if (!text) {
                throw new Error('Please enter Markdown text to convert');
            }
            
            try {
                let html = text;
                
                // Headers
                html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
                html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
                html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
                
                // Bold and Italic
                html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
                html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
                
                // Code
                html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
                html = html.replace(/`(.*?)`/g, '<code>$1</code>');
                
                // Links
                const linkTarget = openLinksNewTab ? ' target="_blank" rel="noopener"' : '';
                html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2"${linkTarget}>$1</a>`);
                
                // Images
                html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');
                
                // Lists
                html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
                html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
                html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
                
                // Line breaks and paragraphs
                html = html.replace(/\n\n/g, '</p><p>');
                html = html.replace(/\n/g, '<br>');
                html = '<p>' + html + '</p>';
                
                // Clean up empty paragraphs
                html = html.replace(/<p><\/p>/g, '');
                
                // Blockquotes
                html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
                
                // Horizontal rules
                html = html.replace(/^---$/gm, '<hr>');
                
                let fullHTML = html;
                
                if (includeCSS) {
                    const css = `<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
h1, h2, h3 { color: #333; margin-top: 24px; }
code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: Monaco, Consolas, monospace; }
pre { background: #f4f4f4; padding: 16px; border-radius: 6px; overflow-x: auto; }
blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
ul, ol { padding-left: 20px; }
hr { border: none; border-top: 1px solid #eee; margin: 24px 0; }
a { color: #0066cc; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>`;
                    fullHTML = `<!DOCTYPE html><html><head><meta charset="UTF-8">${css}</head><body>${html}</body></html>`;
                }
                
                const markdownLines = text.split('\n').length;
                const htmlSize = new Blob([fullHTML]).size;
                
                return `MARKDOWN TO HTML CONVERSION COMPLETE

Input: ${markdownLines} lines of Markdown
Output: ${htmlSize} bytes of HTML
CSS included: ${includeCSS}
Links open new tab: ${openLinksNewTab}

CONVERTED HTML:
${fullHTML}`;
                
            } catch (error) {
                throw new Error(`Markdown conversion error: ${error.message}`);
            }
        }
    }));

    // 9. SQL Formatter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'sql-formatter',
        name: 'SQL Formatter',
        description: 'Format and beautify SQL queries',
        category: 'data',
        icon: '🗃️',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'format', label: 'Format (Pretty Print)' },
                    { value: 'minify', label: 'Minify (Compact)' },
                    { value: 'analyze', label: 'Analyze Structure' }
                ]
            },
            {
                name: 'indentSize',
                label: 'Indent Size',
                type: 'number',
                value: '2',
                min: '1',
                max: '8'
            },
            {
                name: 'uppercaseKeywords',
                label: 'Uppercase keywords',
                type: 'checkbox',
                value: true
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const operation = data.operation;
            const indentSize = parseInt(data.indentSize || 2);
            const uppercaseKeywords = data.uppercaseKeywords;
            
            if (!text) {
                throw new Error('Please enter SQL to process');
            }
            
            const sqlKeywords = [
                'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON',
                'GROUP', 'BY', 'HAVING', 'ORDER', 'LIMIT', 'OFFSET', 'INSERT', 'INTO',
                'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'ALTER', 'DROP',
                'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL',
                'DEFAULT', 'AUTO_INCREMENT', 'UNIQUE', 'AND', 'OR', 'IN', 'LIKE',
                'BETWEEN', 'IS', 'AS', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
                'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'EXISTS'
            ];
            
            try {
                if (operation === 'analyze') {
                    const keywords = [];
                    const tables = [];
                    const columns = [];
                    
                    sqlKeywords.forEach(keyword => {
                        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                        const matches = text.match(regex);
                        if (matches) {
                            keywords.push({ keyword, count: matches.length });
                        }
                    });
                    
                    // Simple table detection (FROM and JOIN clauses)
                    const tableMatches = text.match(/(?:FROM|JOIN)\s+(\w+)/gi) || [];
                    tableMatches.forEach(match => {
                        const table = match.replace(/(?:FROM|JOIN)\s+/gi, '');
                        if (!tables.includes(table)) tables.push(table);
                    });
                    
                    const queryTypes = [];
                    if (/\bSELECT\b/i.test(text)) queryTypes.push('SELECT');
                    if (/\bINSERT\b/i.test(text)) queryTypes.push('INSERT');
                    if (/\bUPDATE\b/i.test(text)) queryTypes.push('UPDATE');
                    if (/\bDELETE\b/i.test(text)) queryTypes.push('DELETE');
                    if (/\bCREATE\b/i.test(text)) queryTypes.push('CREATE');
                    
                    return `SQL ANALYSIS COMPLETE

Query types: ${queryTypes.join(', ') || 'Unknown'}
Query length: ${text.length} characters
Lines: ${text.split('\n').length}

TABLES REFERENCED:
${tables.length > 0 ? tables.join(', ') : 'None detected'}

KEYWORDS FOUND:
${keywords.slice(0, 10).map(k => `${k.keyword}: ${k.count}`).join(', ')}

ORIGINAL SQL:
${text}`;
                }
                
                let result = text;
                
                if (operation === 'format') {
                    const indent = ' '.repeat(indentSize);
                    
                    // Apply keyword casing
                    if (uppercaseKeywords) {
                        sqlKeywords.forEach(keyword => {
                            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                            result = result.replace(regex, keyword.toUpperCase());
                        });
                    }
                    
                    // Basic formatting
                    result = result
                        .replace(/\s*,\s*/g, ',\n' + indent)
                        .replace(/\s*(SELECT|FROM|WHERE|GROUP BY|HAVING|ORDER BY|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)\s*/gi, '\n$1 ')
                        .replace(/\s*AND\s*/gi, '\n' + indent + 'AND ')
                        .replace(/\s*OR\s*/gi, '\n' + indent + 'OR ')
                        .replace(/\(\s*/g, '(\n' + indent)
                        .replace(/\s*\)/g, '\n)')
                        .replace(/;\s*/g, ';\n\n')
                        .trim();
                        
                } else if (operation === 'minify') {
                    result = result
                        .replace(/\s+/g, ' ')
                        .replace(/\s*,\s*/g, ',')
                        .replace(/\s*\(\s*/g, '(')
                        .replace(/\s*\)\s*/g, ')')
                        .replace(/\s*=\s*/g, '=')
                        .replace(/\s*;\s*/g, ';')
                        .trim();
                }
                
                const originalSize = new Blob([text]).size;
                const resultSize = new Blob([result]).size;
                const difference = resultSize - originalSize;
                
                return `SQL ${operation.toUpperCase()} COMPLETE

Original size: ${originalSize} bytes
New size: ${resultSize} bytes
Size change: ${difference > 0 ? '+' : ''}${difference} bytes
Keywords uppercase: ${uppercaseKeywords}

RESULT:
${result}`;
                
            } catch (error) {
                throw new Error(`SQL ${operation} error: ${error.message}`);
            }
        }
    }));

    // 10. YAML to JSON Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'yaml-to-json-converter',
        name: 'YAML to JSON Converter',
        description: 'Convert YAML data to JSON format (basic support)',
        category: 'data',
        icon: '📋',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'yaml_to_json', label: 'YAML to JSON' },
                    { value: 'json_to_yaml', label: 'JSON to YAML' }
                ]
            },
            {
                name: 'indentSize',
                label: 'Indent Size',
                type: 'number',
                value: '2',
                min: '1',
                max: '8'
            }
        ],
        process: (data) => {
            const text = data.text.trim();
            const operation = data.operation;
            const indentSize = parseInt(data.indentSize || 2);
            
            if (!text) {
                throw new Error('Please enter YAML or JSON data to convert');
            }
            
            try {
                if (operation === 'yaml_to_json') {
                    // Basic YAML parsing (simplified)
                    const lines = text.split('\n').map(line => line.replace(/^\s+/, match => match));
                    const result = {};
                    let current = result;
                    const stack = [result];
                    
                    lines.forEach(line => {
                        line = line.trim();
                        if (!line || line.startsWith('#')) return;
                        
                        if (line.includes(':')) {
                            const [key, ...valueParts] = line.split(':');
                            const value = valueParts.join(':').trim();
                            
                            if (value) {
                                // Try to parse as number, boolean, or string
                                if (value === 'true' || value === 'false') {
                                    current[key.trim()] = value === 'true';
                                } else if (!isNaN(value) && !isNaN(parseFloat(value))) {
                                    current[key.trim()] = parseFloat(value);
                                } else {
                                    // Remove quotes if present
                                    current[key.trim()] = value.replace(/^['"]|['"]$/g, '');
                                }
                            } else {
                                current[key.trim()] = {};
                            }
                        } else if (line.startsWith('- ')) {
                            // List item (simplified)
                            const item = line.substring(2).trim();
                            if (!Array.isArray(current)) {
                                current = [];
                            }
                            current.push(item.replace(/^['"]|['"]$/g, ''));
                        }
                    });
                    
                    const jsonString = JSON.stringify(result, null, indentSize);
                    
                    return `YAML TO JSON CONVERSION COMPLETE

Input: ${lines.length} lines of YAML
Output: ${new Blob([jsonString]).size} bytes of JSON

Note: This is basic YAML parsing. Complex YAML features may not be supported.

RESULT:
${jsonString}`;
                    
                } else {
                    // JSON to YAML
                    const parsed = JSON.parse(text);
                    
                    const jsonToYaml = (obj, indent = 0) => {
                        const spaces = ' '.repeat(indent);
                        let yaml = '';
                        
                        if (Array.isArray(obj)) {
                            obj.forEach(item => {
                                if (typeof item === 'object') {
                                    yaml += `${spaces}- \n${jsonToYaml(item, indent + 2)}`;
                                } else {
                                    yaml += `${spaces}- ${item}\n`;
                                }
                            });
                        } else if (typeof obj === 'object' && obj !== null) {
                            Object.keys(obj).forEach(key => {
                                const value = obj[key];
                                if (typeof value === 'object' && value !== null) {
                                    yaml += `${spaces}${key}:\n${jsonToYaml(value, indent + indentSize)}`;
                                } else {
                                    const valueStr = typeof value === 'string' && value.includes(' ') 
                                        ? `"${value}"` 
                                        : String(value);
                                    yaml += `${spaces}${key}: ${valueStr}\n`;
                                }
                            });
                        }
                        
                        return yaml;
                    };
                    
                    const yamlString = jsonToYaml(parsed).trim();
                    
                    return `JSON TO YAML CONVERSION COMPLETE

Input: ${new Blob([text]).size} bytes of JSON
Output: ${yamlString.split('\n').length} lines of YAML

RESULT:
${yamlString}`;
                }
                
            } catch (error) {
                if (error.name === 'SyntaxError') {
                    throw new Error(`Invalid JSON: ${error.message}`);
                }
                throw new Error(`Conversion error: ${error.message}`);
            }
        }
    }));

})();