/**
 * API Testing and Development Tools
 * Comprehensive suite for API development, testing, and debugging
 */

// API Request Builder
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'api-request-builder',
    name: 'API Request Builder',
    description: 'Build and test HTTP API requests with full customization',
    category: 'business',
    icon: '🔧',
    fields: [
        { name: 'method', label: 'HTTP Method', type: 'select', options: [
            { value: 'GET', label: 'GET' },
            { value: 'POST', label: 'POST' },
            { value: 'PUT', label: 'PUT' },
            { value: 'PATCH', label: 'PATCH' },
            { value: 'DELETE', label: 'DELETE' },
            { value: 'OPTIONS', label: 'OPTIONS' },
            { value: 'HEAD', label: 'HEAD' }
        ], defaultValue: 'GET', required: true },
        { name: 'url', label: 'Request URL', type: 'url', required: true, placeholder: 'https://api.example.com/endpoint' },
        { name: 'headers', label: 'Headers (JSON format)', type: 'textarea', placeholder: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token"\n}' },
        { name: 'queryParams', label: 'Query Parameters (JSON format)', type: 'textarea', placeholder: '{\n  "page": 1,\n  "limit": 10\n}' },
        { name: 'requestBody', label: 'Request Body (JSON)', type: 'textarea', placeholder: '{\n  "name": "Example",\n  "value": "test"\n}' },
        { name: 'timeout', label: 'Timeout (seconds)', type: 'number', min: 1, max: 300, defaultValue: 30 },
        { name: 'followRedirects', label: 'Follow Redirects', type: 'checkbox', defaultValue: true }
    ],
    generate: (data) => {
        let headers = {};
        let queryParams = {};
        let requestBody = null;
        
        try {
            if (data.headers) headers = JSON.parse(data.headers);
        } catch (e) {
            headers = { 'Content-Type': 'application/json' };
        }
        
        try {
            if (data.queryParams) queryParams = JSON.parse(data.queryParams);
        } catch (e) {
            queryParams = {};
        }
        
        try {
            if (data.requestBody && ['POST', 'PUT', 'PATCH'].includes(data.method)) {
                requestBody = JSON.parse(data.requestBody);
            }
        } catch (e) {
            requestBody = data.requestBody || null;
        }
        
        // Build query string
        const queryString = Object.keys(queryParams).length > 0 
            ? '?' + new URLSearchParams(queryParams).toString() 
            : '';
        
        const fullUrl = data.url + queryString;
        
        // Generate curl command
        let curlCommand = `curl -X ${data.method}`;
        
        Object.entries(headers).forEach(([key, value]) => {
            curlCommand += ` \\\n  -H "${key}: ${value}"`;
        });
        
        if (requestBody && typeof requestBody === 'object') {
            curlCommand += ` \\\n  -d '${JSON.stringify(requestBody, null, 2)}'`;
        } else if (requestBody) {
            curlCommand += ` \\\n  -d '${requestBody}'`;
        }
        
        curlCommand += ` \\\n  --connect-timeout ${data.timeout}`;
        if (!data.followRedirects) curlCommand += ` \\\n  --no-location`;
        curlCommand += ` \\\n  "${data.url}"`;
        
        // Generate JavaScript fetch code
        const fetchCode = `fetch('${fullUrl}', {
  method: '${data.method}',
  headers: ${JSON.stringify(headers, null, 2)},${requestBody ? `\n  body: JSON.stringify(${JSON.stringify(requestBody, null, 2)}),` : ''}
  timeout: ${data.timeout * 1000}
})
.then(response => {
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  return response.json();
})
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
        
        return {
            requestSummary: `API Request Configuration\n\n🌐 ${data.method} ${fullUrl}\n\n📋 Headers:\n${Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`).join('\n') || '  (none)'}\n\n${requestBody ? `📄 Request Body:\n${JSON.stringify(requestBody, null, 2)}\n\n` : ''}⚙️ Settings:\n• Timeout: ${data.timeout}s\n• Follow redirects: ${data.followRedirects ? 'Yes' : 'No'}`,
            curlCommand: curlCommand,
            fetchCode: fetchCode,
            requestDetails: {
                contentLength: requestBody ? JSON.stringify(requestBody).length : 0,
                expectedContentType: headers['Content-Type'] || 'application/json',
                cacheControl: headers['Cache-Control'] || 'no-cache',
                userAgent: headers['User-Agent'] || 'API Request Builder'
            },
            securityNotes: [
                'Never include sensitive API keys in client-side code',
                'Use environment variables for credentials',
                'Consider CORS policies for browser requests',
                'Validate SSL certificates in production'
            ]
        };
    }
}));

// JSON Schema Validator
ToolRegistry.register(ToolTemplates.createTextProcessor({
    id: 'json-schema-validator',
    name: 'JSON Schema Validator',
    description: 'Validate JSON data against schemas and generate schemas from samples',
    category: 'business',
    icon: '✅',
    fields: [
        { name: 'jsonData', label: 'JSON Data', type: 'textarea', required: true, placeholder: '{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com"\n}' },
        { name: 'schema', label: 'JSON Schema (optional - will generate if empty)', type: 'textarea', placeholder: '{\n  "type": "object",\n  "properties": {\n    "name": {"type": "string"},\n    "age": {"type": "number"}\n  }\n}' },
        { name: 'generateSchema', label: 'Generate Schema from Data', type: 'checkbox', defaultValue: true },
        { name: 'strictValidation', label: 'Strict Validation', type: 'checkbox', defaultValue: false }
    ],
    process: (data) => {
        let parsedData, parsedSchema;
        let validationResult = { valid: false, errors: [] };
        let generatedSchema = null;
        
        try {
            parsedData = JSON.parse(data.jsonData);
        } catch (e) {
            return {
                error: `Invalid JSON data: ${e.message}`,
                validationResult: { valid: false, errors: ['JSON parsing failed'] }
            };
        }
        
        // Generate schema if requested or no schema provided
        if (data.generateSchema || !data.schema) {
            generatedSchema = generateSchemaFromData(parsedData);
        }
        
        // Parse provided schema
        if (data.schema) {
            try {
                parsedSchema = JSON.parse(data.schema);
            } catch (e) {
                return {
                    error: `Invalid schema JSON: ${e.message}`,
                    generatedSchema: generatedSchema ? JSON.stringify(generatedSchema, null, 2) : null
                };
            }
        } else {
            parsedSchema = generatedSchema;
        }
        
        // Perform validation
        if (parsedSchema) {
            validationResult = validateAgainstSchema(parsedData, parsedSchema, data.strictValidation);
        }
        
        const dataStats = analyzeJsonStructure(parsedData);
        
        return {
            validationSummary: `JSON Schema Validation Results\n\n${validationResult.valid ? '✅ VALID' : '❌ INVALID'} - Data ${validationResult.valid ? 'conforms to' : 'violates'} schema\n\n📊 Data Analysis:\n• Type: ${dataStats.type}\n• Properties: ${dataStats.propertyCount}\n• Nesting level: ${dataStats.maxDepth}\n• Array items: ${dataStats.arrayItems}\n• Total size: ${JSON.stringify(parsedData).length} characters\n\n${validationResult.errors.length > 0 ? `🚨 Validation Errors:\n${validationResult.errors.map((err, i) => `${i + 1}. ${err}`).join('\n')}\n\n` : ''}`,
            schemaUsed: JSON.stringify(parsedSchema, null, 2),
            generatedSchema: generatedSchema ? JSON.stringify(generatedSchema, null, 2) : null,
            validationResult: validationResult,
            recommendations: generateValidationRecommendations(parsedData, validationResult),
            dataStats: dataStats
        };
    }
}));

// API Response Mock Generator
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'api-mock-generator',
    name: 'API Response Mock Generator',
    description: 'Generate realistic mock API responses for testing and development',
    category: 'business',
    icon: '🎭',
    fields: [
        { name: 'responseType', label: 'Response Type', type: 'select', options: [
            { value: 'user', label: 'User Data' },
            { value: 'product', label: 'Product Catalog' },
            { value: 'order', label: 'Order/Transaction' },
            { value: 'article', label: 'Article/Blog Post' },
            { value: 'custom', label: 'Custom Schema' }
        ], defaultValue: 'user', required: true },
        { name: 'recordCount', label: 'Number of Records', type: 'number', min: 1, max: 100, defaultValue: 5 },
        { name: 'includeMetadata', label: 'Include API Metadata', type: 'checkbox', defaultValue: true },
        { name: 'customSchema', label: 'Custom Schema (JSON)', type: 'textarea', placeholder: '{\n  "name": "string",\n  "value": "number"\n}' },
        { name: 'responseFormat', label: 'Response Format', type: 'select', options: [
            { value: 'rest', label: 'REST API' },
            { value: 'graphql', label: 'GraphQL' },
            { value: 'jsonapi', label: 'JSON:API' }
        ], defaultValue: 'rest' },
        { name: 'httpStatus', label: 'HTTP Status Code', type: 'select', options: [
            { value: '200', label: '200 OK' },
            { value: '201', label: '201 Created' },
            { value: '400', label: '400 Bad Request' },
            { value: '401', label: '401 Unauthorized' },
            { value: '404', label: '404 Not Found' },
            { value: '500', label: '500 Internal Server Error' }
        ], defaultValue: '200' }
    ],
    generate: (data) => {
        let mockData = [];
        let schema = {};
        
        // Define schemas for different response types
        const schemas = {
            user: {
                id: 'number',
                name: 'string',
                email: 'string',
                avatar: 'string',
                created_at: 'date',
                is_active: 'boolean'
            },
            product: {
                id: 'number',
                name: 'string',
                description: 'string',
                price: 'number',
                category: 'string',
                in_stock: 'boolean',
                rating: 'number'
            },
            order: {
                id: 'string',
                customer_id: 'number',
                total: 'number',
                status: 'string',
                items: 'array',
                created_at: 'date'
            },
            article: {
                id: 'number',
                title: 'string',
                content: 'string',
                author: 'string',
                published_at: 'date',
                tags: 'array'
            }
        };
        
        // Use custom schema if provided
        if (data.responseType === 'custom' && data.customSchema) {
            try {
                schema = JSON.parse(data.customSchema);
            } catch (e) {
                schema = schemas.user;
            }
        } else {
            schema = schemas[data.responseType] || schemas.user;
        }
        
        // Generate mock data
        for (let i = 0; i < data.recordCount; i++) {
            const record = {};
            Object.entries(schema).forEach(([key, type]) => {
                record[key] = generateMockValue(type, i);
            });
            mockData.push(record);
        }
        
        // Format response based on API type
        let response = {};
        switch (data.responseFormat) {
            case 'rest':
                response = {
                    data: data.recordCount === 1 ? mockData[0] : mockData,
                    ...(data.includeMetadata && {
                        meta: {
                            total: data.recordCount,
                            page: 1,
                            per_page: data.recordCount,
                            timestamp: new Date().toISOString()
                        }
                    })
                };
                break;
                
            case 'graphql':
                response = {
                    data: {
                        [data.responseType + 's']: mockData
                    },
                    ...(data.includeMetadata && {
                        extensions: {
                            tracing: {
                                execution: { duration: Math.floor(Math.random() * 100) + 10 }
                            }
                        }
                    })
                };
                break;
                
            case 'jsonapi':
                response = {
                    data: mockData.map(item => ({
                        type: data.responseType,
                        id: item.id?.toString(),
                        attributes: { ...item, id: undefined }
                    })),
                    ...(data.includeMetadata && {
                        meta: { count: data.recordCount },
                        jsonapi: { version: '1.0' }
                    })
                };
                break;
        }
        
        const responseHeaders = {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': '1000',
            'X-RateLimit-Remaining': '999',
            'Access-Control-Allow-Origin': '*'
        };
        
        return {
            mockResponse: `HTTP/1.1 ${data.httpStatus} ${getStatusText(data.httpStatus)}\n${Object.entries(responseHeaders).map(([k, v]) => `${k}: ${v}`).join('\n')}\n\n${JSON.stringify(response, null, 2)}`,
            responseBody: JSON.stringify(response, null, 2),
            usageExample: generateUsageExample(data.responseFormat, data.responseType),
            testingTips: [
                'Use different HTTP status codes to test error handling',
                'Vary response times by adding delays in your mock server',
                'Test pagination by adjusting meta.total vs actual record count',
                'Include edge cases like empty arrays or null values'
            ],
            integrationCode: generateIntegrationCode(response, data.responseFormat)
        };
    }
}));

// Webhook Tester
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'webhook-tester',
    name: 'Webhook Payload Tester',
    description: 'Generate and validate webhook payloads for different services',
    category: 'business',
    icon: '🔗',
    fields: [
        { name: 'webhookType', label: 'Webhook Type', type: 'select', options: [
            { value: 'github', label: 'GitHub Push Event' },
            { value: 'stripe', label: 'Stripe Payment' },
            { value: 'slack', label: 'Slack Message' },
            { value: 'discord', label: 'Discord Webhook' },
            { value: 'custom', label: 'Custom Webhook' }
        ], defaultValue: 'github', required: true },
        { name: 'webhookUrl', label: 'Webhook URL', type: 'url', placeholder: 'https://your-app.com/webhooks/endpoint' },
        { name: 'secretKey', label: 'Secret Key (for signature)', type: 'password' },
        { name: 'customPayload', label: 'Custom Payload (JSON)', type: 'textarea' },
        { name: 'includeSignature', label: 'Include HMAC Signature', type: 'checkbox', defaultValue: true },
        { name: 'testMode', label: 'Test Mode', type: 'checkbox', defaultValue: true }
    ],
    generate: (data) => {
        let payload = {};
        let headers = {};
        
        // Generate payload based on webhook type
        switch (data.webhookType) {
            case 'github':
                payload = {
                    ref: 'refs/heads/main',
                    before: '0000000000000000000000000000000000000000',
                    after: 'abcdef1234567890abcdef1234567890abcdef12',
                    repository: {
                        id: 123456789,
                        name: 'test-repo',
                        full_name: 'user/test-repo',
                        html_url: 'https://github.com/user/test-repo'
                    },
                    pusher: {
                        name: 'testuser',
                        email: 'test@example.com'
                    },
                    head_commit: {
                        id: 'abcdef1234567890abcdef1234567890abcdef12',
                        message: 'Test commit message',
                        timestamp: new Date().toISOString(),
                        author: { name: 'Test Author', email: 'test@example.com' }
                    },
                    commits: []
                };
                headers = {
                    'Content-Type': 'application/json',
                    'X-GitHub-Event': 'push',
                    'X-GitHub-Delivery': generateUUID(),
                    'User-Agent': 'GitHub-Hookshot/abc123'
                };
                break;
                
            case 'stripe':
                payload = {
                    id: 'evt_' + generateRandomString(24),
                    object: 'event',
                    api_version: '2020-08-27',
                    created: Math.floor(Date.now() / 1000),
                    type: 'payment_intent.succeeded',
                    data: {
                        object: {
                            id: 'pi_' + generateRandomString(24),
                            object: 'payment_intent',
                            amount: 2000,
                            currency: 'usd',
                            status: 'succeeded',
                            metadata: {}
                        }
                    },
                    livemode: !data.testMode
                };
                headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Stripe/1.0'
                };
                break;
                
            case 'slack':
                payload = {
                    token: 'verification_token_here',
                    team_id: 'T1234567890',
                    team_domain: 'test-workspace',
                    channel_id: 'C1234567890',
                    channel_name: 'general',
                    user_id: 'U1234567890',
                    user_name: 'testuser',
                    command: '/test',
                    text: 'test command',
                    response_url: 'https://hooks.slack.com/commands/1234/5678',
                    trigger_id: '13345224609.738474920.8088930838d88f008e0'
                };
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                break;
                
            case 'discord':
                payload = {
                    content: 'Hello from webhook tester!',
                    username: 'Webhook Bot',
                    avatar_url: 'https://example.com/avatar.png',
                    embeds: [{
                        title: 'Test Webhook',
                        description: 'This is a test webhook payload',
                        color: 3447003,
                        timestamp: new Date().toISOString()
                    }]
                };
                headers = {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Discord-Webhook'
                };
                break;
                
            case 'custom':
                if (data.customPayload) {
                    try {
                        payload = JSON.parse(data.customPayload);
                    } catch (e) {
                        payload = { message: 'Invalid JSON provided', timestamp: new Date().toISOString() };
                    }
                } else {
                    payload = {
                        event: 'test.webhook',
                        data: { message: 'Test webhook payload' },
                        timestamp: new Date().toISOString()
                    };
                }
                headers = { 'Content-Type': 'application/json' };
                break;
        }
        
        // Add signature if requested
        if (data.includeSignature && data.secretKey) {
            const signature = generateHMACSignature(JSON.stringify(payload), data.secretKey);
            headers['X-Webhook-Signature'] = `sha256=${signature}`;
        }
        
        // Generate curl command
        const curlCommand = `curl -X POST ${data.webhookUrl || 'https://your-endpoint.com/webhook'} \\
${Object.entries(headers).map(([k, v]) => `  -H "${k}: ${v}"`).join(' \\\n')} \\
  -d '${JSON.stringify(payload, null, 2)}'`;
        
        return {
            webhookTest: `Webhook Payload Test\n\n🔗 Type: ${data.webhookType.toUpperCase()}\n🎯 URL: ${data.webhookUrl || 'Not specified'}\n${data.includeSignature ? '🔐 Signature: Included' : '🔓 Signature: None'}\n\n📋 Headers:\n${Object.entries(headers).map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n\n📄 Payload Size: ${JSON.stringify(payload).length} bytes`,
            payloadJson: JSON.stringify(payload, null, 2),
            curlCommand: curlCommand,
            validationTips: [
                'Verify webhook URL is accessible and returns 200 OK',
                'Test signature validation if using HMAC',
                'Check payload structure matches your webhook handler',
                'Test with both valid and invalid payloads for error handling'
            ],
            debugInfo: {
                contentType: headers['Content-Type'],
                payloadSize: JSON.stringify(payload).length,
                signatureIncluded: !!headers['X-Webhook-Signature'],
                testMode: data.testMode
            }
        };
    }
}));

// Helper functions for mock generation
function generateMockValue(type, index) {
    const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
    const products = ['Laptop Pro', 'Wireless Mouse', 'Coffee Maker', 'Desk Lamp', 'Keyboard'];
    const statuses = ['pending', 'completed', 'cancelled', 'processing'];
    
    switch (type) {
        case 'string':
            return names[index % names.length];
        case 'number':
            return Math.floor(Math.random() * 1000) + 1;
        case 'boolean':
            return Math.random() > 0.5;
        case 'date':
            return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString();
        case 'array':
            return ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(Math.random() * 3) + 1);
        default:
            return `mock_${type}_${index}`;
    }
}

function generateSchemaFromData(data) {
    if (Array.isArray(data)) {
        return {
            type: 'array',
            items: data.length > 0 ? generateSchemaFromData(data[0]) : { type: 'object' }
        };
    } else if (typeof data === 'object' && data !== null) {
        const properties = {};
        Object.keys(data).forEach(key => {
            properties[key] = generateSchemaFromData(data[key]);
        });
        return {
            type: 'object',
            properties: properties,
            required: Object.keys(properties)
        };
    } else {
        return { type: typeof data };
    }
}

function validateAgainstSchema(data, schema, strict = false) {
    // Simplified validation - in production, use a proper JSON Schema validator
    const errors = [];
    
    if (schema.type && typeof data !== schema.type) {
        errors.push(`Expected type ${schema.type}, got ${typeof data}`);
    }
    
    if (schema.type === 'object' && schema.properties) {
        Object.keys(schema.properties).forEach(key => {
            if (schema.required && schema.required.includes(key) && !(key in data)) {
                errors.push(`Missing required property: ${key}`);
            }
        });
        
        if (strict) {
            Object.keys(data).forEach(key => {
                if (!(key in schema.properties)) {
                    errors.push(`Unexpected property: ${key}`);
                }
            });
        }
    }
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}

function analyzeJsonStructure(data) {
    function getDepth(obj) {
        if (typeof obj !== 'object' || obj === null) return 0;
        return 1 + Math.max(0, ...Object.values(obj).map(getDepth));
    }
    
    return {
        type: Array.isArray(data) ? 'array' : typeof data,
        propertyCount: typeof data === 'object' ? Object.keys(data).length : 0,
        maxDepth: getDepth(data),
        arrayItems: Array.isArray(data) ? data.length : 0
    };
}

function generateValidationRecommendations(data, result) {
    const recommendations = [];
    
    if (!result.valid) {
        recommendations.push('Fix validation errors before proceeding');
        recommendations.push('Consider using optional properties for non-critical fields');
    } else {
        recommendations.push('Schema validation passed - data is well-formed');
        recommendations.push('Consider adding format validators for strings (email, date, etc.)');
    }
    
    return recommendations;
}

function generateUsageExample(format, type) {
    switch (format) {
        case 'graphql':
            return `query {\n  ${type}s {\n    id\n    name\n  }\n}`;
        case 'jsonapi':
            return `GET /api/${type}s\nAccept: application/vnd.api+json`;
        default:
            return `GET /api/${type}s\nAccept: application/json`;
    }
}

function generateIntegrationCode(response, format) {
    return `// Integration example\nconst response = await fetch('/api/endpoint');\nconst data = await response.json();\nconsole.log(data);`;
}

function getStatusText(code) {
    const statuses = {
        '200': 'OK',
        '201': 'Created',
        '400': 'Bad Request',
        '401': 'Unauthorized',
        '404': 'Not Found',
        '500': 'Internal Server Error'
    };
    return statuses[code] || 'Unknown';
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateHMACSignature(payload, secret) {
    // Simplified signature generation - in production, use crypto library
    return 'mock_signature_' + btoa(payload + secret).slice(0, 32);
}

console.log('✅ API Tools loaded successfully (4 tools)');