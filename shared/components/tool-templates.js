// Master template system for creating tools
const ToolTemplates = {
    // Base tool template
    createTool: (config) => {
        return {
            id: config.id,
            name: config.name,
            description: config.description,
            category: config.category,
            icon: config.icon,
            premium: config.premium || false,
            render: config.render,
            calculate: config.calculate
        };
    },

    // Calculator template - for single calculation tools
    createCalculator: (config) => {
        const tool = ToolTemplates.createTool(config);
        
        tool.render = () => {
            const container = document.createElement('div');
            container.className = 'calculator-tool space-y-6';
            
            // Description
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-4';
            description.textContent = config.description;
            container.appendChild(description);
            
            // Form
            const formConfig = {
                fields: config.fields,
                onSubmit: (formData) => {
                    try {
                        const result = config.calculate(formData);
                        ToolTemplates.showCalculatorResult(resultContainer, result, config.resultConfig);
                        
                        // Save to history
                        if (typeof Storage !== 'undefined') {
                            Storage.saveToHistory(config.name, formData, result);
                        }
                    } catch (error) {
                        UI.showNotification(error.message || 'Calculation error', 'error');
                    }
                },
                submitText: config.submitText || 'Calculate'
            };
            
            const { form } = Forms.createForm(formConfig);
            container.appendChild(form);
            
            // Result container
            const resultContainer = Results.createResultContainer(config.resultTitle || 'Result');
            container.appendChild(resultContainer.container);
            
            return container;
        };
        
        return tool;
    },

    // Converter template - for unit/format conversions
    createConverter: (config) => {
        const tool = ToolTemplates.createTool(config);
        
        tool.render = () => {
            const container = document.createElement('div');
            container.className = 'converter-tool space-y-6';
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-4';
            description.textContent = config.description;
            container.appendChild(description);
            
            const formConfig = {
                fields: [
                    {
                        name: 'value',
                        label: 'Value to Convert',
                        type: 'number',
                        required: true,
                        step: 'any'
                    },
                    {
                        name: 'from',
                        label: 'From',
                        type: 'select',
                        options: config.fromOptions,
                        required: true
                    },
                    {
                        name: 'to',
                        label: 'To', 
                        type: 'select',
                        options: config.toOptions || config.fromOptions,
                        required: true
                    }
                ],
                onSubmit: (formData) => {
                    try {
                        const result = config.convert(formData.value, formData.from, formData.to);
                        ToolTemplates.showConverterResult(resultContainer, result, formData, config);
                    } catch (error) {
                        UI.showNotification(error.message || 'Conversion error', 'error');
                    }
                },
                submitText: 'Convert'
            };
            
            const { form } = Forms.createForm(formConfig);
            container.appendChild(form);
            
            const resultContainer = Results.createResultContainer('Conversion Result');
            container.appendChild(resultContainer.container);
            
            return container;
        };
        
        return tool;
    },

    // Generator template - for content generation tools
    createGenerator: (config) => {
        const tool = ToolTemplates.createTool(config);
        
        tool.render = () => {
            const container = document.createElement('div');
            container.className = 'generator-tool space-y-6';
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-4';
            description.textContent = config.description;
            container.appendChild(description);
            
            const formConfig = {
                fields: config.fields || [],
                onSubmit: (formData) => {
                    try {
                        const result = config.generate(formData);
                        ToolTemplates.showGeneratorResult(resultContainer, result, config);
                    } catch (error) {
                        UI.showNotification(error.message || 'Generation error', 'error');
                    }
                },
                submitText: config.submitText || 'Generate'
            };
            
            const { form } = Forms.createForm(formConfig);
            container.appendChild(form);
            
            const resultContainer = Results.createResultContainer(config.resultTitle || 'Generated Result');
            container.appendChild(resultContainer.container);
            
            return container;
        };
        
        return tool;
    },

    // Text processor template
    createTextProcessor: (config) => {
        const tool = ToolTemplates.createTool(config);
        
        tool.render = () => {
            const container = document.createElement('div');
            container.className = 'text-processor-tool space-y-6';
            
            const description = document.createElement('p');
            description.className = 'text-gray-600 mb-4';
            description.textContent = config.description;
            container.appendChild(description);
            
            const formConfig = {
                fields: [
                    {
                        name: 'text',
                        label: config.inputLabel || 'Input Text',
                        type: 'textarea',
                        required: true,
                        placeholder: config.placeholder || 'Enter your text here...'
                    },
                    ...(config.extraFields || [])
                ],
                onSubmit: (formData) => {
                    try {
                        const result = config.process(formData);
                        ToolTemplates.showTextResult(resultContainer, result, config);
                    } catch (error) {
                        UI.showNotification(error.message || 'Processing error', 'error');
                    }
                },
                submitText: config.submitText || 'Process'
            };
            
            const { form } = Forms.createForm(formConfig);
            container.appendChild(form);
            
            const resultContainer = Results.createResultContainer(config.resultTitle || 'Processed Text');
            container.appendChild(resultContainer.container);
            
            return container;
        };
        
        return tool;
    },

    // Result display helpers
    showCalculatorResult: (container, result, config = {}) => {
        container.content.innerHTML = '';
        
        if (typeof result === 'object' && result.multiple) {
            // Multiple results
            Results.showMultipleResults(container.content, result.values);
        } else if (typeof result === 'number') {
            // Numeric result
            Results.showNumericResult(container.content, result, config);
        } else {
            // Simple result
            Results.showResult(container.content, result.toString(), { copyable: true });
        }
        
        container.show();
    },

    showConverterResult: (container, result, formData, config) => {
        container.content.innerHTML = '';
        
        const resultText = `${Formatters.number.decimal(formData.value, 6)} ${formData.from} = ${Formatters.number.decimal(result, 6)} ${formData.to}`;
        
        Results.showResult(container.content, resultText, {
            copyable: true,
            title: 'Conversion Result'
        });
        
        container.show();
    },

    showGeneratorResult: (container, result, config) => {
        container.content.innerHTML = '';
        
        const options = {
            copyable: true,
            downloadable: config.downloadable || false,
            filename: config.filename || 'generated.txt',
            title: config.resultTitle || 'Generated Result'
        };
        
        if (config.outputType === 'json') {
            options.format = 'json';
        } else if (config.outputType === 'html') {
            options.format = 'html';
        }
        
        Results.showResult(container.content, result, options);
        container.show();
    },

    showTextResult: (container, result, config) => {
        container.content.innerHTML = '';
        
        const options = {
            copyable: true,
            downloadable: true,
            filename: config.filename || 'processed-text.txt',
            title: config.resultTitle || 'Processed Text'
        };
        
        Results.showResult(container.content, result, options);
        container.show();
    },

    // Utility templates for common patterns
    templates: {
        // Financial calculator fields
        financial: {
            principal: {
                name: 'principal',
                label: 'Principal Amount ($)',
                type: 'number',
                required: true,
                step: '0.01',
                min: '0'
            },
            rate: {
                name: 'rate', 
                label: 'Interest Rate (%)',
                type: 'number',
                required: true,
                step: '0.01',
                min: '0'
            },
            time: {
                name: 'time',
                label: 'Time Period (years)',
                type: 'number',
                required: true,
                step: '0.1',
                min: '0'
            }
        },

        // Health calculator fields
        health: {
            weight: (unit = 'kg') => ({
                name: 'weight',
                label: `Weight (${unit})`,
                type: 'number',
                required: true,
                step: '0.1',
                min: '0'
            }),
            height: (unit = 'cm') => ({
                name: 'height',
                label: `Height (${unit})`,
                type: 'number',
                required: true,
                step: '0.1',
                min: '0'
            }),
            age: {
                name: 'age',
                label: 'Age (years)',
                type: 'number',
                required: true,
                step: '1',
                min: '0',
                max: '150'
            },
            gender: {
                name: 'gender',
                label: 'Gender',
                type: 'select',
                options: [
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' }
                ],
                required: true
            }
        },

        // Unit conversion options
        units: {
            length: [
                { value: 'meter', label: 'Meters' },
                { value: 'kilometer', label: 'Kilometers' },
                { value: 'centimeter', label: 'Centimeters' },
                { value: 'millimeter', label: 'Millimeters' },
                { value: 'inch', label: 'Inches' },
                { value: 'foot', label: 'Feet' },
                { value: 'yard', label: 'Yards' },
                { value: 'mile', label: 'Miles' }
            ],
            weight: [
                { value: 'kilogram', label: 'Kilograms' },
                { value: 'gram', label: 'Grams' },
                { value: 'pound', label: 'Pounds' },
                { value: 'ounce', label: 'Ounces' },
                { value: 'stone', label: 'Stone' },
                { value: 'ton', label: 'Tonnes' }
            ],
            volume: [
                { value: 'liter', label: 'Liters' },
                { value: 'milliliter', label: 'Milliliters' },
                { value: 'gallon', label: 'Gallons' },
                { value: 'quart', label: 'Quarts' },
                { value: 'pint', label: 'Pints' },
                { value: 'cup', label: 'Cups' },
                { value: 'fluid_ounce', label: 'Fluid Ounces' }
            ]
        }
    }
};