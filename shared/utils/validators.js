// Input validation utilities
const Validators = {
    // Basic validation functions
    isRequired: (value) => {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    isNumber: (value) => {
        return !isNaN(parseFloat(value)) && isFinite(parseFloat(value));
    },

    isPositiveNumber: (value) => {
        return Validators.isNumber(value) && parseFloat(value) > 0;
    },

    isNonNegativeNumber: (value) => {
        return Validators.isNumber(value) && parseFloat(value) >= 0;
    },

    isInteger: (value) => {
        return Validators.isNumber(value) && Number.isInteger(parseFloat(value));
    },

    isPositiveInteger: (value) => {
        return Validators.isInteger(value) && parseFloat(value) > 0;
    },

    // Range validation
    isInRange: (value, min, max) => {
        const num = parseFloat(value);
        return Validators.isNumber(value) && num >= min && num <= max;
    },

    // String validation
    hasMinLength: (value, minLength) => {
        return typeof value === 'string' && value.length >= minLength;
    },

    hasMaxLength: (value, maxLength) => {
        return typeof value === 'string' && value.length <= maxLength;
    },

    // Email validation
    isEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // URL validation
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Date validation
    isValidDate: (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    },

    // Color validation
    isHexColor: (color) => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        return hexRegex.test(color);
    },

    isRGBColor: (color) => {
        const rgbRegex = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;
        const match = color.match(rgbRegex);
        if (!match) return false;
        
        return match.slice(1, 4).every(val => {
            const num = parseInt(val);
            return num >= 0 && num <= 255;
        });
    },

    // Password strength
    isStrongPassword: (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
    },

    // File validation
    isValidFileType: (fileName, allowedTypes) => {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        return allowedTypes.includes(fileExtension);
    },

    isValidFileSize: (fileSize, maxSizeInMB) => {
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        return fileSize <= maxSizeInBytes;
    },

    // Credit card validation (basic Luhn algorithm)
    isValidCreditCard: (cardNumber) => {
        const num = cardNumber.replace(/\D/g, '');
        if (num.length < 13 || num.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = num.length - 1; i >= 0; i--) {
            let digit = parseInt(num[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    },

    // Phone number validation (basic)
    isValidPhoneNumber: (phone) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleanPhone);
    },

    // Postal code validation
    isValidPostalCode: (postalCode, country = 'US') => {
        const patterns = {
            US: /^\d{5}(-\d{4})?$/,
            CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
            UK: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
            DE: /^\d{5}$/,
            FR: /^\d{5}$/,
            AU: /^\d{4}$/
        };
        
        return patterns[country] ? patterns[country].test(postalCode) : true;
    },

    // JSON validation
    isValidJSON: (jsonString) => {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Regular expression validation
    isValidRegex: (pattern) => {
        try {
            new RegExp(pattern);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Form validation helper
    validateForm: (formData, rules) => {
        const errors = {};
        
        Object.keys(rules).forEach(field => {
            const value = formData[field];
            const fieldRules = rules[field];
            
            fieldRules.forEach(rule => {
                const { validator, message, ...params } = rule;
                
                if (typeof validator === 'string' && Validators[validator]) {
                    if (!Validators[validator](value, ...Object.values(params))) {
                        if (!errors[field]) errors[field] = [];
                        errors[field].push(message || `${field} is invalid`);
                    }
                } else if (typeof validator === 'function') {
                    if (!validator(value, ...Object.values(params))) {
                        if (!errors[field]) errors[field] = [];
                        errors[field].push(message || `${field} is invalid`);
                    }
                }
            });
        });
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    },

    // Sanitization helpers
    sanitize: {
        string: (str) => {
            return typeof str === 'string' ? str.trim() : '';
        },
        
        number: (value) => {
            const num = parseFloat(value);
            return isNaN(num) ? 0 : num;
        },
        
        html: (str) => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },
        
        filename: (filename) => {
            return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        }
    }
};