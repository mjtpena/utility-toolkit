// Mathematical and statistical calculation utilities
const Calculations = {
    // Basic math operations with validation
    add: (a, b) => parseFloat(a) + parseFloat(b),
    subtract: (a, b) => parseFloat(a) - parseFloat(b),
    multiply: (a, b) => parseFloat(a) * parseFloat(b),
    divide: (a, b) => {
        const divisor = parseFloat(b);
        if (divisor === 0) throw new Error('Division by zero');
        return parseFloat(a) / divisor;
    },
    
    // Percentage calculations
    percentage: (value, total) => (parseFloat(value) / parseFloat(total)) * 100,
    percentageOf: (percentage, total) => (parseFloat(percentage) / 100) * parseFloat(total),
    percentageChange: (oldVal, newVal) => ((parseFloat(newVal) - parseFloat(oldVal)) / parseFloat(oldVal)) * 100,
    
    // Financial calculations
    compound: (principal, rate, compounds, time) => {
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const n = parseFloat(compounds);
        const t = parseFloat(time);
        return p * Math.pow((1 + r/n), (n*t));
    },
    
    monthlyPayment: (principal, annualRate, years) => {
        const p = parseFloat(principal);
        const r = parseFloat(annualRate) / 100 / 12;
        const n = parseFloat(years) * 12;
        if (r === 0) return p / n;
        return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    },
    
    // Statistical functions
    mean: (numbers) => {
        const nums = numbers.map(n => parseFloat(n));
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    },
    
    median: (numbers) => {
        const nums = numbers.map(n => parseFloat(n)).sort((a, b) => a - b);
        const mid = Math.floor(nums.length / 2);
        return nums.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    },
    
    mode: (numbers) => {
        const nums = numbers.map(n => parseFloat(n));
        const frequency = {};
        nums.forEach(num => frequency[num] = (frequency[num] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        return Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(n => parseFloat(n));
    },
    
    standardDeviation: (numbers) => {
        const nums = numbers.map(n => parseFloat(n));
        const avg = Calculations.mean(nums);
        const squareDiffs = nums.map(num => Math.pow(num - avg, 2));
        const avgSquareDiff = Calculations.mean(squareDiffs);
        return Math.sqrt(avgSquareDiff);
    },
    
    // Unit conversions
    conversions: {
        // Length
        length: {
            meter: 1,
            kilometer: 0.001,
            centimeter: 100,
            millimeter: 1000,
            inch: 39.3701,
            foot: 3.28084,
            yard: 1.09361,
            mile: 0.000621371
        },
        
        // Weight
        weight: {
            kilogram: 1,
            gram: 1000,
            pound: 2.20462,
            ounce: 35.274,
            stone: 0.157473,
            ton: 0.001
        },
        
        // Temperature
        temperature: {
            celsiusToFahrenheit: (c) => (parseFloat(c) * 9/5) + 32,
            fahrenheitToCelsius: (f) => (parseFloat(f) - 32) * 5/9,
            celsiusToKelvin: (c) => parseFloat(c) + 273.15,
            kelvinToCelsius: (k) => parseFloat(k) - 273.15
        },
        
        // Volume
        volume: {
            liter: 1,
            milliliter: 1000,
            gallon: 0.264172,
            quart: 1.05669,
            pint: 2.11338,
            cup: 4.22675,
            fluid_ounce: 33.814
        },
        
        // Data storage
        data: {
            byte: 1,
            kilobyte: 1/1024,
            megabyte: 1/(1024*1024),
            gigabyte: 1/(1024*1024*1024),
            terabyte: 1/(1024*1024*1024*1024)
        }
    },
    
    // Health calculations
    bmi: (weight, height, unit = 'metric') => {
        if (unit === 'imperial') {
            return (parseFloat(weight) * 703) / Math.pow(parseFloat(height), 2);
        }
        return parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
    },
    
    bmr: (weight, height, age, gender, unit = 'metric') => {
        let w = parseFloat(weight);
        let h = parseFloat(height);
        const a = parseFloat(age);
        
        if (unit === 'imperial') {
            w = w * 0.453592; // lbs to kg
            h = h * 2.54; // inches to cm
        }
        
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
        } else {
            return 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
        }
    },
    
    // Geometry calculations
    geometry: {
        circle: {
            area: (radius) => Math.PI * Math.pow(parseFloat(radius), 2),
            circumference: (radius) => 2 * Math.PI * parseFloat(radius),
            diameter: (radius) => 2 * parseFloat(radius)
        },
        
        rectangle: {
            area: (width, height) => parseFloat(width) * parseFloat(height),
            perimeter: (width, height) => 2 * (parseFloat(width) + parseFloat(height))
        },
        
        triangle: {
            area: (base, height) => 0.5 * parseFloat(base) * parseFloat(height),
            hypotenuse: (a, b) => Math.sqrt(Math.pow(parseFloat(a), 2) + Math.pow(parseFloat(b), 2))
        }
    },
    
    // Number system conversions
    numberSystems: {
        decimalToBinary: (decimal) => parseInt(decimal).toString(2),
        decimalToHex: (decimal) => parseInt(decimal).toString(16).toUpperCase(),
        decimalToOctal: (decimal) => parseInt(decimal).toString(8),
        binaryToDecimal: (binary) => parseInt(binary, 2),
        hexToDecimal: (hex) => parseInt(hex, 16)
    },
    
    // Utility functions
    roundTo: (number, decimals) => Math.round(parseFloat(number) * Math.pow(10, decimals)) / Math.pow(10, decimals),
    
    isValidNumber: (value) => !isNaN(parseFloat(value)) && isFinite(parseFloat(value)),
    
    formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(parseFloat(amount));
    }
};