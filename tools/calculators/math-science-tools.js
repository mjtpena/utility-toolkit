// Math & Science Calculator Tools  
(function() {
    'use strict';

    // 1. Percentage Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'percentage-calculator',
        name: 'Percentage Calculator',
        description: 'Calculate percentages, percentage change, and percentage of amounts',
        category: 'math',
        icon: '📊',
        fields: [
            { name: 'calculationType', label: 'Calculation Type', type: 'select', required: true, options: [
                { value: 'percent_of', label: 'What is X% of Y?' },
                { value: 'is_what_percent', label: 'X is what percent of Y?' },
                { value: 'percent_change', label: 'Percentage change from X to Y' },
                { value: 'percentage_increase', label: 'Increase X by Y%' },
                { value: 'percentage_decrease', label: 'Decrease X by Y%' }
            ]},
            { name: 'value1', label: 'First Value', type: 'number', required: true, step: 'any' },
            { name: 'value2', label: 'Second Value', type: 'number', required: true, step: 'any' }
        ],
        calculate: (data) => {
            const type = data.calculationType;
            const val1 = parseFloat(data.value1);
            const val2 = parseFloat(data.value2);
            
            let result, explanation;
            
            switch(type) {
                case 'percent_of':
                    result = (val1 / 100) * val2;
                    explanation = `${val1}% of ${val2} = ${Formatters.number.decimal(result, 2)}`;
                    break;
                    
                case 'is_what_percent':
                    if (val2 === 0) throw new Error('Cannot divide by zero');
                    result = (val1 / val2) * 100;
                    explanation = `${val1} is ${Formatters.number.decimal(result, 2)}% of ${val2}`;
                    break;
                    
                case 'percent_change':
                    if (val1 === 0) throw new Error('Initial value cannot be zero');
                    result = ((val2 - val1) / val1) * 100;
                    explanation = `Change from ${val1} to ${val2} is ${Formatters.number.decimal(result, 2)}%`;
                    break;
                    
                case 'percentage_increase':
                    result = val1 * (1 + val2/100);
                    explanation = `${val1} increased by ${val2}% = ${Formatters.number.decimal(result, 2)}`;
                    break;
                    
                case 'percentage_decrease':
                    result = val1 * (1 - val2/100);
                    explanation = `${val1} decreased by ${val2}% = ${Formatters.number.decimal(result, 2)}`;
                    break;
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'Result', value: Formatters.number.decimal(result, 2) },
                    { label: 'Calculation', value: explanation }
                ]
            };
        }
    }));

    // 2. Ratio Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'ratio-calculator',
        name: 'Ratio Calculator',
        description: 'Calculate and simplify ratios, find missing values in proportions',
        category: 'math',
        icon: '⚖️',
        fields: [
            { name: 'a', label: 'First Value (A)', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'b', label: 'Second Value (B)', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'c', label: 'Third Value (C) - Optional', type: 'number', step: 'any', min: '0' },
            { name: 'findD', label: 'Find missing fourth value (D)?', type: 'checkbox' }
        ],
        calculate: (data) => {
            const a = parseFloat(data.a);
            const b = parseFloat(data.b);
            const c = parseFloat(data.c || 0);
            const findD = data.findD;
            
            // Find GCD for ratio simplification
            const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
            
            const commonDivisor = gcd(a, b);
            const simplifiedA = a / commonDivisor;
            const simplifiedB = b / commonDivisor;
            
            const results = [
                { label: 'Original Ratio', value: `${a} : ${b}` },
                { label: 'Simplified Ratio', value: `${simplifiedA} : ${simplifiedB}` },
                { label: 'As Fraction', value: `${simplifiedA}/${simplifiedB}` },
                { label: 'As Decimal', value: Formatters.number.decimal(a / b, 6) }
            ];
            
            // If third value provided and finding fourth
            if (c > 0 && findD) {
                const d = (b * c) / a;
                results.push(
                    { label: 'Proportion', value: `${a} : ${b} = ${c} : ${Formatters.number.decimal(d, 6)}` },
                    { label: 'Missing Value (D)', value: Formatters.number.decimal(d, 6) }
                );
            }
            
            return { multiple: true, values: results };
        }
    }));

    // 3. Average Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'average-calculator',
        name: 'Average Calculator',
        description: 'Calculate mean, median, mode, and range of numbers',
        category: 'math',
        icon: '📈',
        fields: [
            { name: 'numbers', label: 'Numbers (comma separated)', type: 'text', required: true, placeholder: '1, 2, 3, 4, 5' }
        ],
        calculate: (data) => {
            const numbersText = data.numbers.replace(/\s+/g, '');
            const numbers = numbersText.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            
            if (numbers.length === 0) {
                throw new Error('Please enter valid numbers separated by commas');
            }
            
            const mean = Calculations.mean(numbers);
            const median = Calculations.median(numbers);
            const mode = Calculations.mode(numbers);
            const range = Math.max(...numbers) - Math.min(...numbers);
            const sum = numbers.reduce((a, b) => a + b, 0);
            
            return {
                multiple: true,
                values: [
                    { label: 'Count', value: numbers.length.toString() },
                    { label: 'Sum', value: Formatters.number.decimal(sum, 2) },
                    { label: 'Mean (Average)', value: Formatters.number.decimal(mean, 2) },
                    { label: 'Median', value: Formatters.number.decimal(median, 2) },
                    { label: 'Mode', value: mode.length === 1 ? Formatters.number.decimal(mode[0], 2) : mode.map(m => Formatters.number.decimal(m, 2)).join(', ') },
                    { label: 'Range', value: Formatters.number.decimal(range, 2) },
                    { label: 'Min', value: Formatters.number.decimal(Math.min(...numbers), 2) },
                    { label: 'Max', value: Formatters.number.decimal(Math.max(...numbers), 2) }
                ]
            };
        }
    }));

    // 4. Standard Deviation Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'standard-deviation-calculator',
        name: 'Standard Deviation Calculator',
        description: 'Calculate standard deviation, variance, and statistical measures',
        category: 'math',
        icon: '📊',
        fields: [
            { name: 'numbers', label: 'Numbers (comma separated)', type: 'text', required: true, placeholder: '1, 2, 3, 4, 5' },
            { name: 'population', label: 'Population (not sample)', type: 'checkbox' }
        ],
        calculate: (data) => {
            const numbersText = data.numbers.replace(/\s+/g, '');
            const numbers = numbersText.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            const isPopulation = data.population;
            
            if (numbers.length === 0) {
                throw new Error('Please enter valid numbers separated by commas');
            }
            
            if (numbers.length === 1 && !isPopulation) {
                throw new Error('Sample standard deviation requires at least 2 values');
            }
            
            const mean = Calculations.mean(numbers);
            const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
            const variance = isPopulation 
                ? squaredDiffs.reduce((a, b) => a + b, 0) / numbers.length
                : squaredDiffs.reduce((a, b) => a + b, 0) / (numbers.length - 1);
            const stdDev = Math.sqrt(variance);
            
            return {
                multiple: true,
                values: [
                    { label: 'Count', value: numbers.length.toString() },
                    { label: 'Mean', value: Formatters.number.decimal(mean, 4) },
                    { label: 'Standard Deviation', value: Formatters.number.decimal(stdDev, 4) },
                    { label: 'Variance', value: Formatters.number.decimal(variance, 4) },
                    { label: 'Type', value: isPopulation ? 'Population' : 'Sample' }
                ]
            };
        }
    }));

    // 5. Quadratic Equation Solver
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'quadratic-solver',
        name: 'Quadratic Equation Solver',
        description: 'Solve quadratic equations of the form ax² + bx + c = 0',
        category: 'math',
        icon: '🔢',
        fields: [
            { name: 'a', label: 'Coefficient a (x² term)', type: 'number', required: true, step: 'any' },
            { name: 'b', label: 'Coefficient b (x term)', type: 'number', required: true, step: 'any', value: '0' },
            { name: 'c', label: 'Coefficient c (constant)', type: 'number', required: true, step: 'any', value: '0' }
        ],
        calculate: (data) => {
            const a = parseFloat(data.a);
            const b = parseFloat(data.b || 0);
            const c = parseFloat(data.c || 0);
            
            if (a === 0) {
                throw new Error('Coefficient "a" cannot be zero in a quadratic equation');
            }
            
            const discriminant = b * b - 4 * a * c;
            
            let results = [
                { label: 'Equation', value: `${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0` },
                { label: 'Discriminant', value: Formatters.number.decimal(discriminant, 4) }
            ];
            
            if (discriminant > 0) {
                const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                results.push(
                    { label: 'Solution Type', value: 'Two real solutions' },
                    { label: 'x₁', value: Formatters.number.decimal(x1, 6) },
                    { label: 'x₂', value: Formatters.number.decimal(x2, 6) }
                );
            } else if (discriminant === 0) {
                const x = -b / (2 * a);
                results.push(
                    { label: 'Solution Type', value: 'One real solution (repeated root)' },
                    { label: 'x', value: Formatters.number.decimal(x, 6) }
                );
            } else {
                const realPart = -b / (2 * a);
                const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
                results.push(
                    { label: 'Solution Type', value: 'Two complex solutions' },
                    { label: 'x₁', value: `${Formatters.number.decimal(realPart, 6)} + ${Formatters.number.decimal(imaginaryPart, 6)}i` },
                    { label: 'x₂', value: `${Formatters.number.decimal(realPart, 6)} - ${Formatters.number.decimal(imaginaryPart, 6)}i` }
                );
            }
            
            return { multiple: true, values: results };
        }
    }));

    // 6. Triangle Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'triangle-calculator',
        name: 'Triangle Calculator',
        description: 'Calculate triangle area, perimeter, and properties',
        category: 'math',
        icon: '📐',
        fields: [
            { name: 'calculationType', label: 'Calculation Type', type: 'select', required: true, options: [
                { value: 'area_base_height', label: 'Area (Base & Height)' },
                { value: 'area_three_sides', label: 'Area (Three Sides - Heron\'s Formula)' },
                { value: 'right_triangle', label: 'Right Triangle (Two Sides)' }
            ]},
            { name: 'side1', label: 'Side 1 / Base', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'side2', label: 'Side 2 / Height', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'side3', label: 'Side 3 (if applicable)', type: 'number', step: 'any', min: '0' }
        ],
        calculate: (data) => {
            const type = data.calculationType;
            const s1 = parseFloat(data.side1);
            const s2 = parseFloat(data.side2);
            const s3 = parseFloat(data.side3 || 0);
            
            let area, perimeter, results = [];
            
            switch(type) {
                case 'area_base_height':
                    area = 0.5 * s1 * s2;
                    results = [
                        { label: 'Area', value: `${Formatters.number.decimal(area, 2)} square units` },
                        { label: 'Base', value: `${s1} units` },
                        { label: 'Height', value: `${s2} units` }
                    ];
                    break;
                    
                case 'area_three_sides':
                    if (s3 <= 0) throw new Error('Third side is required for this calculation');
                    
                    // Check triangle inequality
                    if (s1 + s2 <= s3 || s1 + s3 <= s2 || s2 + s3 <= s1) {
                        throw new Error('These sides cannot form a triangle');
                    }
                    
                    // Heron's formula
                    const s = (s1 + s2 + s3) / 2;
                    area = Math.sqrt(s * (s - s1) * (s - s2) * (s - s3));
                    perimeter = s1 + s2 + s3;
                    
                    results = [
                        { label: 'Area', value: `${Formatters.number.decimal(area, 2)} square units` },
                        { label: 'Perimeter', value: `${Formatters.number.decimal(perimeter, 2)} units` },
                        { label: 'Semi-perimeter', value: `${Formatters.number.decimal(s, 2)} units` },
                        { label: 'Side A', value: `${s1} units` },
                        { label: 'Side B', value: `${s2} units` },
                        { label: 'Side C', value: `${s3} units` }
                    ];
                    break;
                    
                case 'right_triangle':
                    const hypotenuse = Math.sqrt(s1 * s1 + s2 * s2);
                    area = 0.5 * s1 * s2;
                    perimeter = s1 + s2 + hypotenuse;
                    
                    results = [
                        { label: 'Hypotenuse', value: `${Formatters.number.decimal(hypotenuse, 2)} units` },
                        { label: 'Area', value: `${Formatters.number.decimal(area, 2)} square units` },
                        { label: 'Perimeter', value: `${Formatters.number.decimal(perimeter, 2)} units` },
                        { label: 'Side A', value: `${s1} units` },
                        { label: 'Side B', value: `${s2} units` }
                    ];
                    break;
            }
            
            return { multiple: true, values: results };
        }
    }));

    // 7. Circle Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'circle-calculator',
        name: 'Circle Calculator',
        description: 'Calculate circle area, circumference, diameter, and radius',
        category: 'math',
        icon: '⭕',
        fields: [
            { name: 'inputType', label: 'Given', type: 'select', required: true, options: [
                { value: 'radius', label: 'Radius' },
                { value: 'diameter', label: 'Diameter' },
                { value: 'circumference', label: 'Circumference' },
                { value: 'area', label: 'Area' }
            ]},
            { name: 'value', label: 'Value', type: 'number', required: true, step: 'any', min: '0' }
        ],
        calculate: (data) => {
            const inputType = data.inputType;
            const value = parseFloat(data.value);
            
            let radius, diameter, circumference, area;
            
            switch(inputType) {
                case 'radius':
                    radius = value;
                    break;
                case 'diameter':
                    radius = value / 2;
                    break;
                case 'circumference':
                    radius = value / (2 * Math.PI);
                    break;
                case 'area':
                    radius = Math.sqrt(value / Math.PI);
                    break;
            }
            
            diameter = radius * 2;
            circumference = 2 * Math.PI * radius;
            area = Math.PI * radius * radius;
            
            return {
                multiple: true,
                values: [
                    { label: 'Radius', value: `${Formatters.number.decimal(radius, 4)} units` },
                    { label: 'Diameter', value: `${Formatters.number.decimal(diameter, 4)} units` },
                    { label: 'Circumference', value: `${Formatters.number.decimal(circumference, 4)} units` },
                    { label: 'Area', value: `${Formatters.number.decimal(area, 4)} square units` }
                ]
            };
        }
    }));

    // 8. Rectangle Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'rectangle-calculator',
        name: 'Rectangle Calculator',
        description: 'Calculate rectangle area, perimeter, and diagonal',
        category: 'math',
        icon: '🔲',
        fields: [
            { name: 'length', label: 'Length', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'width', label: 'Width', type: 'number', required: true, step: 'any', min: '0' }
        ],
        calculate: (data) => {
            const length = parseFloat(data.length);
            const width = parseFloat(data.width);
            
            const area = length * width;
            const perimeter = 2 * (length + width);
            const diagonal = Math.sqrt(length * length + width * width);
            const isSquare = length === width;
            
            return {
                multiple: true,
                values: [
                    { label: 'Area', value: `${Formatters.number.decimal(area, 2)} square units` },
                    { label: 'Perimeter', value: `${Formatters.number.decimal(perimeter, 2)} units` },
                    { label: 'Diagonal', value: `${Formatters.number.decimal(diagonal, 2)} units` },
                    { label: 'Shape Type', value: isSquare ? 'Square' : 'Rectangle' },
                    { label: 'Length', value: `${length} units` },
                    { label: 'Width', value: `${width} units` }
                ]
            };
        }
    }));

    // 9. Pythagorean Theorem Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'pythagorean-calculator',
        name: 'Pythagorean Theorem Calculator',
        description: 'Find the missing side of a right triangle',
        category: 'math',
        icon: '📏',
        fields: [
            { name: 'findSide', label: 'Find', type: 'select', required: true, options: [
                { value: 'hypotenuse', label: 'Hypotenuse (c)' },
                { value: 'sideA', label: 'Side A (a)' },
                { value: 'sideB', label: 'Side B (b)' }
            ]},
            { name: 'side1', label: 'Known Side 1', type: 'number', required: true, step: 'any', min: '0' },
            { name: 'side2', label: 'Known Side 2', type: 'number', required: true, step: 'any', min: '0' }
        ],
        calculate: (data) => {
            const findSide = data.findSide;
            const side1 = parseFloat(data.side1);
            const side2 = parseFloat(data.side2);
            
            let result, sideA, sideB, hypotenuse;
            
            switch(findSide) {
                case 'hypotenuse':
                    result = Math.sqrt(side1 * side1 + side2 * side2);
                    sideA = side1;
                    sideB = side2;
                    hypotenuse = result;
                    break;
                    
                case 'sideA':
                    if (side1 <= side2) throw new Error('Hypotenuse must be longer than the known side');
                    result = Math.sqrt(side1 * side1 - side2 * side2);
                    sideA = result;
                    sideB = side2;
                    hypotenuse = side1;
                    break;
                    
                case 'sideB':
                    if (side1 <= side2) throw new Error('Hypotenuse must be longer than the known side');
                    result = Math.sqrt(side1 * side1 - side2 * side2);
                    sideA = side2;
                    sideB = result;
                    hypotenuse = side1;
                    break;
            }
            
            const area = 0.5 * sideA * sideB;
            const perimeter = sideA + sideB + hypotenuse;
            
            return {
                multiple: true,
                values: [
                    { label: 'Missing Side', value: `${Formatters.number.decimal(result, 4)} units` },
                    { label: 'Side A', value: `${Formatters.number.decimal(sideA, 4)} units` },
                    { label: 'Side B', value: `${Formatters.number.decimal(sideB, 4)} units` },
                    { label: 'Hypotenuse', value: `${Formatters.number.decimal(hypotenuse, 4)} units` },
                    { label: 'Triangle Area', value: `${Formatters.number.decimal(area, 4)} square units` },
                    { label: 'Triangle Perimeter', value: `${Formatters.number.decimal(perimeter, 4)} units` }
                ]
            };
        }
    }));

    // 10. Prime Number Checker
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'prime-checker',
        name: 'Prime Number Checker',
        description: 'Check if a number is prime and find its factors',
        category: 'math',
        icon: '🔢',
        fields: [
            { name: 'number', label: 'Number to Check', type: 'number', required: true, step: '1', min: '1' }
        ],
        calculate: (data) => {
            const num = parseInt(data.number);
            
            if (num < 1) throw new Error('Number must be positive');
            if (num !== parseFloat(data.number)) throw new Error('Number must be an integer');
            
            const isPrime = (n) => {
                if (n <= 1) return false;
                if (n <= 3) return true;
                if (n % 2 === 0 || n % 3 === 0) return false;
                for (let i = 5; i * i <= n; i += 6) {
                    if (n % i === 0 || n % (i + 2) === 0) return false;
                }
                return true;
            };
            
            const findFactors = (n) => {
                const factors = [];
                for (let i = 1; i <= Math.sqrt(n); i++) {
                    if (n % i === 0) {
                        factors.push(i);
                        if (i !== n / i) factors.push(n / i);
                    }
                }
                return factors.sort((a, b) => a - b);
            };
            
            const prime = isPrime(num);
            const factors = findFactors(num);
            
            let results = [
                { label: 'Number', value: num.toString() },
                { label: 'Is Prime?', value: prime ? 'Yes' : 'No' },
                { label: 'Factor Count', value: factors.length.toString() }
            ];
            
            if (!prime && factors.length <= 20) {
                results.push({ label: 'Factors', value: factors.join(', ') });
            } else if (!prime && factors.length > 20) {
                results.push({ label: 'First 10 Factors', value: factors.slice(0, 10).join(', ') + '...' });
            }
            
            // Special cases
            if (num === 1) {
                results.push({ label: 'Note', value: '1 is neither prime nor composite' });
            } else if (num === 2) {
                results.push({ label: 'Note', value: '2 is the only even prime number' });
            }
            
            return { multiple: true, values: results };
        }
    }));

    // 11. GCD/LCM Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'gcd-lcm-calculator',
        name: 'GCD/LCM Calculator',
        description: 'Calculate Greatest Common Divisor and Least Common Multiple',
        category: 'math',
        icon: '🔄',
        fields: [
            { name: 'numbers', label: 'Numbers (comma separated)', type: 'text', required: true, placeholder: '12, 18, 24' }
        ],
        calculate: (data) => {
            const numbersText = data.numbers.replace(/\s+/g, '');
            const numbers = numbersText.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n) && n > 0);
            
            if (numbers.length < 2) {
                throw new Error('Please enter at least two positive integers');
            }
            
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const lcm = (a, b) => (a * b) / gcd(a, b);
            
            let resultGCD = numbers[0];
            let resultLCM = numbers[0];
            
            for (let i = 1; i < numbers.length; i++) {
                resultGCD = gcd(resultGCD, numbers[i]);
                resultLCM = lcm(resultLCM, numbers[i]);
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'Numbers', value: numbers.join(', ') },
                    { label: 'GCD (Greatest Common Divisor)', value: resultGCD.toString() },
                    { label: 'LCM (Least Common Multiple)', value: resultLCM.toString() },
                    { label: 'Count', value: numbers.length.toString() }
                ]
            };
        }
    }));

    // 12. Number System Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'number-system-converter',
        name: 'Number System Converter',
        description: 'Convert between decimal, binary, octal, and hexadecimal',
        category: 'math',
        icon: '🔢',
        fromOptions: [
            { value: 'decimal', label: 'Decimal (Base 10)' },
            { value: 'binary', label: 'Binary (Base 2)' },
            { value: 'octal', label: 'Octal (Base 8)' },
            { value: 'hexadecimal', label: 'Hexadecimal (Base 16)' }
        ],
        convert: (value, from, to) => {
            if (from === to) return value;
            
            // Convert to decimal first
            let decimal;
            switch(from) {
                case 'decimal':
                    decimal = parseInt(value);
                    if (isNaN(decimal)) throw new Error('Invalid decimal number');
                    break;
                case 'binary':
                    decimal = parseInt(value, 2);
                    if (isNaN(decimal)) throw new Error('Invalid binary number');
                    break;
                case 'octal':
                    decimal = parseInt(value, 8);
                    if (isNaN(decimal)) throw new Error('Invalid octal number');
                    break;
                case 'hexadecimal':
                    decimal = parseInt(value, 16);
                    if (isNaN(decimal)) throw new Error('Invalid hexadecimal number');
                    break;
            }
            
            // Convert from decimal to target
            switch(to) {
                case 'decimal':
                    return decimal.toString();
                case 'binary':
                    return decimal.toString(2);
                case 'octal':
                    return decimal.toString(8);
                case 'hexadecimal':
                    return decimal.toString(16).toUpperCase();
            }
        }
    }));

    // 13. Scientific Notation Converter
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'scientific-notation-converter',
        name: 'Scientific Notation Converter',
        description: 'Convert between standard and scientific notation',
        category: 'math',
        icon: '🧪',
        fields: [
            { name: 'inputType', label: 'Input Type', type: 'select', required: true, options: [
                { value: 'standard', label: 'Standard Number' },
                { value: 'scientific', label: 'Scientific Notation (e.g., 1.5e6)' }
            ]},
            { name: 'number', label: 'Number', type: 'text', required: true, placeholder: '1500000 or 1.5e6' },
            { name: 'decimalPlaces', label: 'Decimal Places', type: 'number', step: '1', min: '1', max: '15', value: '2' }
        ],
        calculate: (data) => {
            const inputType = data.inputType;
            const numberStr = data.number.trim();
            const decimalPlaces = parseInt(data.decimalPlaces || 2);
            
            let number;
            if (inputType === 'standard') {
                number = parseFloat(numberStr);
                if (isNaN(number)) throw new Error('Invalid standard number');
            } else {
                // Scientific notation input
                number = parseFloat(numberStr);
                if (isNaN(number)) throw new Error('Invalid scientific notation (use format like 1.5e6)');
            }
            
            const scientificStr = number.toExponential(decimalPlaces);
            const standardStr = number.toString();
            
            // Parse scientific notation components
            const scientificMatch = scientificStr.match(/^(-?\d+\.?\d*)e([+-]?\d+)$/);
            const mantissa = scientificMatch ? scientificMatch[1] : '0';
            const exponent = scientificMatch ? scientificMatch[2] : '0';
            
            return {
                multiple: true,
                values: [
                    { label: 'Standard Notation', value: standardStr },
                    { label: 'Scientific Notation', value: scientificStr },
                    { label: 'Mantissa', value: mantissa },
                    { label: 'Exponent', value: exponent },
                    { label: 'Order of Magnitude', value: Math.floor(Math.log10(Math.abs(number))).toString() }
                ]
            };
        }
    }));

})();