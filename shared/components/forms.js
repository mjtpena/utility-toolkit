// Form creation and management utilities
const Forms = {
    // Create a complete form with validation
    createForm: (config) => {
        const form = document.createElement('form');
        form.className = 'space-y-4';
        
        const { fields, onSubmit, submitText = 'Calculate', resetText = 'Reset' } = config;
        
        // Create fields
        const fieldElements = {};
        fields.forEach(field => {
            const fieldElement = Forms.createField(field);
            form.appendChild(fieldElement.container);
            fieldElements[field.name] = fieldElement.input;
        });
        
        // Create buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'flex gap-3 pt-4';
        
        const submitButton = UI.createButton(submitText, 'primary');
        submitButton.type = 'submit';
        
        const resetButton = UI.createButton(resetText, 'outline', () => {
            form.reset();
            Forms.clearValidation(form);
        });
        resetButton.type = 'button';
        
        buttonContainer.appendChild(submitButton);
        buttonContainer.appendChild(resetButton);
        form.appendChild(buttonContainer);
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = Forms.getFormData(form);
            const validation = Forms.validateForm(formData, fields);
            
            Forms.clearValidation(form);
            
            if (!validation.isValid) {
                Forms.showValidationErrors(form, validation.errors);
                return;
            }
            
            if (onSubmit) {
                onSubmit(formData, form);
            }
        });
        
        return { form, fields: fieldElements };
    },
    
    // Create individual field
    createField: (field) => {
        const { 
            type = 'text', 
            name, 
            label, 
            placeholder = '', 
            required = false,
            options = [],
            step = null,
            min = null,
            max = null,
            value = ''
        } = field;
        
        const container = document.createElement('div');
        container.className = 'form-field';
        
        if (label) {
            const labelEl = document.createElement('label');
            labelEl.setAttribute('for', name);
            labelEl.textContent = label + (required ? ' *' : '');
            labelEl.className = 'block text-sm font-medium text-gray-700 mb-2';
            container.appendChild(labelEl);
        }
        
        let input;
        
        switch (type) {
            case 'select':
                input = document.createElement('select');
                input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
                
                options.forEach(option => {
                    const optionEl = document.createElement('option');
                    optionEl.value = typeof option === 'object' ? option.value : option;
                    optionEl.textContent = typeof option === 'object' ? option.label : option;
                    if (optionEl.value === value) optionEl.selected = true;
                    input.appendChild(optionEl);
                });
                break;
                
            case 'textarea':
                input = document.createElement('textarea');
                input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
                input.rows = 4;
                break;
                
            case 'checkbox':
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = 'flex items-center';
                
                input = document.createElement('input');
                input.type = 'checkbox';
                input.className = 'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
                input.checked = value;
                
                const checkboxLabel = document.createElement('label');
                checkboxLabel.setAttribute('for', name);
                checkboxLabel.textContent = label;
                checkboxLabel.className = 'ml-2 text-sm text-gray-700';
                
                checkboxContainer.appendChild(input);
                checkboxContainer.appendChild(checkboxLabel);
                container.appendChild(checkboxContainer);
                
                // Don't add the input separately for checkboxes
                input.name = name;
                input.id = name;
                if (required) input.required = true;
                
                return { container, input };
                
            default:
                input = document.createElement('input');
                input.type = type;
                input.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
                if (placeholder) input.placeholder = placeholder;
                if (value) input.value = value;
                if (step !== null) input.step = step;
                if (min !== null) input.min = min;
                if (max !== null) input.max = max;
                break;
        }
        
        input.name = name;
        input.id = name;
        if (required) input.required = true;
        
        container.appendChild(input);
        
        // Error message container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'validation-error text-red-500 text-sm mt-1 hidden';
        container.appendChild(errorContainer);
        
        return { container, input };
    },
    
    // Get form data as object
    getFormData: (form) => {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Handle checkboxes that aren't checked
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (!data.hasOwnProperty(checkbox.name)) {
                data[checkbox.name] = checkbox.checked;
            }
        });
        
        return data;
    },
    
    // Validate form data
    validateForm: (data, fields) => {
        const errors = {};
        
        fields.forEach(field => {
            const { name, required, validation = [] } = field;
            const value = data[name];
            
            // Required validation
            if (required && (!value || (typeof value === 'string' && value.trim() === ''))) {
                if (!errors[name]) errors[name] = [];
                errors[name].push(`${field.label || name} is required`);
                return;
            }
            
            // Skip other validations if field is empty and not required
            if (!value && !required) return;
            
            // Custom validations
            validation.forEach(rule => {
                const { type, message, ...params } = rule;
                
                switch (type) {
                    case 'min':
                        if (parseFloat(value) < params.value) {
                            if (!errors[name]) errors[name] = [];
                            errors[name].push(message || `Minimum value is ${params.value}`);
                        }
                        break;
                        
                    case 'max':
                        if (parseFloat(value) > params.value) {
                            if (!errors[name]) errors[name] = [];
                            errors[name].push(message || `Maximum value is ${params.value}`);
                        }
                        break;
                        
                    case 'pattern':
                        if (!new RegExp(params.value).test(value)) {
                            if (!errors[name]) errors[name] = [];
                            errors[name].push(message || 'Invalid format');
                        }
                        break;
                        
                    case 'custom':
                        if (!params.validator(value)) {
                            if (!errors[name]) errors[name] = [];
                            errors[name].push(message || 'Invalid value');
                        }
                        break;
                }
            });
        });
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    },
    
    // Show validation errors
    showValidationErrors: (form, errors) => {
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const container = field.closest('.form-field');
                const errorContainer = container.querySelector('.validation-error');
                
                field.classList.add('border-red-500');
                errorContainer.textContent = errors[fieldName].join(', ');
                errorContainer.classList.remove('hidden');
            }
        });
    },
    
    // Clear validation errors
    clearValidation: (form) => {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('border-red-500');
        });
        
        const errorContainers = form.querySelectorAll('.validation-error');
        errorContainers.forEach(container => {
            container.classList.add('hidden');
            container.textContent = '';
        });
    },
    
    // Preset form configurations
    templates: {
        // Financial calculator form
        financial: (fields = []) => ({
            fields: [
                { name: 'principal', label: 'Principal Amount', type: 'number', required: true, step: '0.01', min: '0' },
                { name: 'rate', label: 'Interest Rate (%)', type: 'number', required: true, step: '0.01', min: '0' },
                { name: 'time', label: 'Time Period', type: 'number', required: true, step: '1', min: '0' },
                ...fields
            ]
        }),
        
        // Unit converter form
        converter: (fromOptions, toOptions) => ({
            fields: [
                { name: 'value', label: 'Value', type: 'number', required: true, step: 'any' },
                { name: 'from', label: 'From', type: 'select', options: fromOptions, required: true },
                { name: 'to', label: 'To', type: 'select', options: toOptions, required: true }
            ]
        }),
        
        // BMI calculator form
        bmi: () => ({
            fields: [
                { name: 'weight', label: 'Weight', type: 'number', required: true, step: '0.1', min: '0' },
                { name: 'height', label: 'Height', type: 'number', required: true, step: '0.1', min: '0' },
                { name: 'unit', label: 'Unit System', type: 'select', options: [
                    { value: 'metric', label: 'Metric (kg/cm)' },
                    { value: 'imperial', label: 'Imperial (lbs/in)' }
                ], required: true }
            ]
        }),
        
        // Text processing form
        textProcessor: () => ({
            fields: [
                { name: 'text', label: 'Text', type: 'textarea', required: true, placeholder: 'Enter your text here...' }
            ]
        }),
        
        // Password generator form
        passwordGenerator: () => ({
            fields: [
                { name: 'length', label: 'Password Length', type: 'number', value: '12', min: '4', max: '128', required: true },
                { name: 'uppercase', label: 'Include Uppercase Letters', type: 'checkbox', value: true },
                { name: 'lowercase', label: 'Include Lowercase Letters', type: 'checkbox', value: true },
                { name: 'numbers', label: 'Include Numbers', type: 'checkbox', value: true },
                { name: 'symbols', label: 'Include Symbols', type: 'checkbox', value: false }
            ]
        })
    }
};