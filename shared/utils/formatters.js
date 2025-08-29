// Data formatting utilities
const Formatters = {
    // Number formatting
    number: {
        // Format number with thousands separators
        thousands: (num, locale = 'en-US') => {
            return new Intl.NumberFormat(locale).format(parseFloat(num));
        },

        // Format to specific decimal places
        decimal: (num, places = 2) => {
            return parseFloat(num).toFixed(places);
        },

        // Format as percentage
        percentage: (num, places = 2) => {
            return `${(parseFloat(num)).toFixed(places)}%`;
        },

        // Format as currency
        currency: (amount, currency = 'USD', locale = 'en-US') => {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency
            }).format(parseFloat(amount));
        },

        // Format file size
        fileSize: (bytes) => {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // Format scientific notation
        scientific: (num, places = 2) => {
            return parseFloat(num).toExponential(places);
        },

        // Format ordinal numbers (1st, 2nd, 3rd, etc.)
        ordinal: (num) => {
            const n = parseInt(num);
            const s = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        }
    },

    // Date and time formatting
    date: {
        // Format date to various formats
        format: (date, format = 'YYYY-MM-DD') => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');

            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },

        // Relative time (time ago)
        relative: (date) => {
            const now = new Date();
            const then = new Date(date);
            const diffMs = now - then;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return 'just now';
            if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
            if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
            if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
            
            return Formatters.date.format(then, 'MM/DD/YYYY');
        },

        // Duration formatting
        duration: (milliseconds) => {
            const seconds = Math.floor(milliseconds / 1000) % 60;
            const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
            const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
            const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

            if (days > 0) return `${days}d ${hours}h ${minutes}m`;
            if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
            if (minutes > 0) return `${minutes}m ${seconds}s`;
            return `${seconds}s`;
        }
    },

    // String formatting
    string: {
        // Capitalize first letter
        capitalize: (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // Title case
        titleCase: (str) => {
            return str.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
        },

        // camelCase
        camelCase: (str) => {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        },

        // snake_case
        snakeCase: (str) => {
            return str.replace(/\W+/g, ' ')
                     .split(/ |\B(?=[A-Z])/)
                     .map(word => word.toLowerCase())
                     .join('_');
        },

        // kebab-case
        kebabCase: (str) => {
            return str.replace(/\W+/g, ' ')
                     .split(/ |\B(?=[A-Z])/)
                     .map(word => word.toLowerCase())
                     .join('-');
        },

        // Truncate with ellipsis
        truncate: (str, length, suffix = '...') => {
            if (str.length <= length) return str;
            return str.substring(0, length) + suffix;
        },

        // Slug generation
        slug: (str) => {
            return str.toLowerCase()
                     .replace(/[^\w\s-]/g, '')
                     .replace(/[\s_-]+/g, '-')
                     .replace(/^-+|-+$/g, '');
        },

        // Remove extra whitespace
        cleanWhitespace: (str) => {
            return str.replace(/\s+/g, ' ').trim();
        }
    },

    // Color formatting
    color: {
        // Convert hex to RGB
        hexToRgb: (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // Convert RGB to hex
        rgbToHex: (r, g, b) => {
            const toHex = (n) => {
                const hex = parseInt(n).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        },

        // Convert HSL to RGB
        hslToRgb: (h, s, l) => {
            h /= 360;
            s /= 100;
            l /= 100;

            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            if (s === 0) {
                const gray = Math.round(l * 255);
                return { r: gray, g: gray, b: gray };
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            return {
                r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
                g: Math.round(hue2rgb(p, q, h) * 255),
                b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
            };
        }
    },

    // Array and data formatting
    array: {
        // Join with proper grammar
        oxfordComma: (arr, conjunction = 'and') => {
            if (arr.length === 0) return '';
            if (arr.length === 1) return arr[0];
            if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
            return `${arr.slice(0, -1).join(', ')}, ${conjunction} ${arr[arr.length - 1]}`;
        },

        // Format as table
        table: (data, headers = null) => {
            if (!Array.isArray(data) || data.length === 0) return '';
            
            const keys = headers || Object.keys(data[0]);
            let result = keys.join('\t') + '\n';
            
            data.forEach(row => {
                result += keys.map(key => row[key] || '').join('\t') + '\n';
            });
            
            return result;
        }
    },

    // URL and query string formatting
    url: {
        // Build query string
        buildQuery: (params) => {
            const query = Object.keys(params)
                .filter(key => params[key] !== null && params[key] !== undefined)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
            return query ? '?' + query : '';
        },

        // Parse query string
        parseQuery: (queryString) => {
            const params = {};
            const query = queryString.replace(/^\?/, '');
            
            if (!query) return params;
            
            query.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
                }
            });
            
            return params;
        }
    },

    // JSON formatting
    json: {
        // Pretty print JSON
        pretty: (obj, indent = 2) => {
            return JSON.stringify(obj, null, indent);
        },

        // Minify JSON
        minify: (obj) => {
            return JSON.stringify(obj);
        }
    }
};