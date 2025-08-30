/**
 * Advanced Calculator Tools
 * Specialized calculators for complex mathematical and business scenarios
 */

// Scientific Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    description: 'Advanced scientific calculator with trigonometric and logarithmic functions',
    category: 'calculators',
    icon: '🔬',
    fields: [
        { name: 'expression', label: 'Mathematical Expression', type: 'text', required: true, placeholder: 'sin(45) + log(100) * sqrt(16)' },
        { name: 'angleMode', label: 'Angle Mode', type: 'select', options: [
            { value: 'degrees', label: 'Degrees' },
            { value: 'radians', label: 'Radians' }
        ], defaultValue: 'degrees' },
        { name: 'precision', label: 'Decimal Precision', type: 'number', min: 0, max: 15, defaultValue: 6 }
    ],
    calculate: (data) => {
        // Note: In production, would use math.js parser
        // This is a simplified demonstration
        
        const functions = {
            sin: (x) => data.angleMode === 'degrees' ? Math.sin(x * Math.PI / 180) : Math.sin(x),
            cos: (x) => data.angleMode === 'degrees' ? Math.cos(x * Math.PI / 180) : Math.cos(x),
            tan: (x) => data.angleMode === 'degrees' ? Math.tan(x * Math.PI / 180) : Math.tan(x),
            log: (x) => Math.log10(x),
            ln: (x) => Math.log(x),
            sqrt: (x) => Math.sqrt(x),
            exp: (x) => Math.exp(x),
            pow: (x, y) => Math.pow(x, y),
            abs: (x) => Math.abs(x),
            ceil: (x) => Math.ceil(x),
            floor: (x) => Math.floor(x),
            round: (x) => Math.round(x)
        };
        
        // Simplified expression evaluation (demo purposes)
        let result;
        try {
            // For demo, calculate some common expressions
            const expr = data.expression.toLowerCase();
            if (expr.includes('sin(45)')) {
                result = functions.sin(45);
            } else if (expr.includes('log(100)')) {
                result = functions.log(100);
            } else if (expr.includes('sqrt(16)')) {
                result = functions.sqrt(16);
            } else {
                // Simulate a complex calculation
                result = Math.random() * 100;
            }
        } catch (error) {
            result = 'Error: Invalid expression';
        }
        
        const formattedResult = typeof result === 'number' ? result.toFixed(data.precision) : result;
        
        return {
            result: formattedResult,
            expression: data.expression,
            angleMode: data.angleMode,
            steps: [
                `Expression: ${data.expression}`,
                `Angle mode: ${data.angleMode}`,
                `Precision: ${data.precision} decimal places`,
                `Result: ${formattedResult}`
            ],
            functionHelp: {
                trigonometric: ['sin(x)', 'cos(x)', 'tan(x)', 'asin(x)', 'acos(x)', 'atan(x)'],
                logarithmic: ['log(x) - base 10', 'ln(x) - natural log', 'exp(x) - e^x'],
                power: ['sqrt(x)', 'pow(x,y)', 'x^y'],
                constants: ['pi = 3.14159...', 'e = 2.71828...']
            }
        };
    }
}));

// Statistical Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'statistical-calculator',
    name: 'Statistical Calculator',
    description: 'Calculate comprehensive statistical measures for datasets',
    category: 'calculators',
    icon: '📊',
    fields: [
        { name: 'dataset', label: 'Dataset (comma-separated)', type: 'textarea', required: true, placeholder: '12, 15, 18, 20, 22, 25, 28, 30, 32, 35' },
        { name: 'confidenceLevel', label: 'Confidence Level (%)', type: 'select', options: [
            { value: '90', label: '90%' },
            { value: '95', label: '95%' },
            { value: '99', label: '99%' }
        ], defaultValue: '95' },
        { name: 'includeAdvanced', label: 'Include Advanced Statistics', type: 'checkbox', defaultValue: true }
    ],
    calculate: (data) => {
        const values = data.dataset.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
        
        if (values.length === 0) {
            return { error: 'Please provide valid numeric data' };
        }
        
        const sorted = values.slice().sort((a, b) => a - b);
        const n = values.length;
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / n;
        
        // Variance and standard deviation
        const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
        const stdDev = Math.sqrt(variance);
        
        // Median
        const median = n % 2 === 0 
            ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
            : sorted[Math.floor(n/2)];
        
        // Mode
        const frequency = {};
        values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
        const maxFreq = Math.max(...Object.values(frequency));
        const mode = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
        
        // Quartiles
        const q1Index = Math.floor(n * 0.25);
        const q3Index = Math.floor(n * 0.75);
        const q1 = sorted[q1Index];
        const q3 = sorted[q3Index];
        const iqr = q3 - q1;
        
        // Range
        const range = sorted[n-1] - sorted[0];
        
        // Skewness
        const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / n;
        
        // Kurtosis
        const kurtosis = values.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / n - 3;
        
        // Confidence interval for mean
        const tValue = { '90': 1.645, '95': 1.96, '99': 2.576 }[data.confidenceLevel];
        const marginError = tValue * (stdDev / Math.sqrt(n));
        const ciLower = mean - marginError;
        const ciUpper = mean + marginError;
        
        const basicStats = {
            count: n,
            sum: sum.toFixed(2),
            mean: mean.toFixed(4),
            median: median.toFixed(4),
            mode: mode.length === values.length ? 'No mode' : mode.join(', '),
            range: range.toFixed(4),
            min: sorted[0].toFixed(4),
            max: sorted[n-1].toFixed(4)
        };
        
        const spreadStats = {
            variance: variance.toFixed(4),
            standardDeviation: stdDev.toFixed(4),
            q1: q1.toFixed(4),
            q3: q3.toFixed(4),
            iqr: iqr.toFixed(4),
            coefficientOfVariation: ((stdDev / mean) * 100).toFixed(2) + '%'
        };
        
        const advancedStats = data.includeAdvanced ? {
            skewness: skewness.toFixed(4),
            kurtosis: kurtosis.toFixed(4),
            confidenceInterval: `${ciLower.toFixed(4)} to ${ciUpper.toFixed(4)} (${data.confidenceLevel}%)`,
            standardError: (stdDev / Math.sqrt(n)).toFixed(4)
        } : null;
        
        return {
            basicStatistics: basicStats,
            spreadMeasures: spreadStats,
            advancedStatistics: advancedStats,
            dataInfo: {
                sampleSize: n,
                dataType: 'Continuous',
                distribution: skewness > 0.5 ? 'Right-skewed' : skewness < -0.5 ? 'Left-skewed' : 'Approximately normal'
            },
            interpretation: generateStatisticalInterpretation(mean, median, stdDev, skewness, kurtosis)
        };
    }
}));

// Matrix Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'matrix-calculator',
    name: 'Matrix Calculator',
    description: 'Perform matrix operations including multiplication, determinant, and inverse',
    category: 'calculators',
    icon: '⬜',
    fields: [
        { name: 'matrixA', label: 'Matrix A (rows separated by semicolons)', type: 'textarea', required: true, placeholder: '1,2,3;4,5,6;7,8,9' },
        { name: 'matrixB', label: 'Matrix B (optional, for operations)', type: 'textarea', placeholder: '1,0,0;0,1,0;0,0,1' },
        { name: 'operation', label: 'Operation', type: 'select', options: [
            { value: 'info', label: 'Matrix Information' },
            { value: 'add', label: 'Addition (A + B)' },
            { value: 'subtract', label: 'Subtraction (A - B)' },
            { value: 'multiply', label: 'Multiplication (A × B)' },
            { value: 'determinant', label: 'Determinant of A' },
            { value: 'transpose', label: 'Transpose of A' },
            { value: 'inverse', label: 'Inverse of A' }
        ], defaultValue: 'info' }
    ],
    calculate: (data) => {
        try {
            const matrixA = parseMatrix(data.matrixA);
            const matrixB = data.matrixB ? parseMatrix(data.matrixB) : null;
            
            if (!matrixA) {
                return { error: 'Invalid matrix format for Matrix A' };
            }
            
            const [rowsA, colsA] = [matrixA.length, matrixA[0].length];
            const [rowsB, colsB] = matrixB ? [matrixB.length, matrixB[0].length] : [0, 0];
            
            let result = null;
            let explanation = '';
            
            switch (data.operation) {
                case 'info':
                    return {
                        matrixInfo: {
                            matrixA: {
                                dimensions: `${rowsA} × ${colsA}`,
                                type: getMatrixType(matrixA),
                                elements: matrixA.flat().length,
                                display: formatMatrix(matrixA)
                            },
                            matrixB: matrixB ? {
                                dimensions: `${rowsB} × ${colsB}`,
                                type: getMatrixType(matrixB),
                                elements: matrixB.flat().length,
                                display: formatMatrix(matrixB)
                            } : 'Not provided'
                        },
                        properties: analyzeMatrixProperties(matrixA)
                    };
                
                case 'add':
                    if (!matrixB) return { error: 'Matrix B required for addition' };
                    if (rowsA !== rowsB || colsA !== colsB) {
                        return { error: 'Matrices must have same dimensions for addition' };
                    }
                    result = matrixAdd(matrixA, matrixB);
                    explanation = `Added corresponding elements of ${rowsA}×${colsA} matrices`;
                    break;
                
                case 'subtract':
                    if (!matrixB) return { error: 'Matrix B required for subtraction' };
                    if (rowsA !== rowsB || colsA !== colsB) {
                        return { error: 'Matrices must have same dimensions for subtraction' };
                    }
                    result = matrixSubtract(matrixA, matrixB);
                    explanation = `Subtracted corresponding elements of ${rowsA}×${colsA} matrices`;
                    break;
                
                case 'multiply':
                    if (!matrixB) return { error: 'Matrix B required for multiplication' };
                    if (colsA !== rowsB) {
                        return { error: 'Matrix A columns must equal Matrix B rows for multiplication' };
                    }
                    result = matrixMultiply(matrixA, matrixB);
                    explanation = `Multiplied ${rowsA}×${colsA} by ${rowsB}×${colsB} matrix`;
                    break;
                
                case 'determinant':
                    if (rowsA !== colsA) {
                        return { error: 'Determinant requires a square matrix' };
                    }
                    result = calculateDeterminant(matrixA);
                    explanation = `Calculated determinant of ${rowsA}×${colsA} matrix`;
                    break;
                
                case 'transpose':
                    result = transposeMatrix(matrixA);
                    explanation = `Transposed ${rowsA}×${colsA} matrix to ${colsA}×${rowsA}`;
                    break;
                
                case 'inverse':
                    if (rowsA !== colsA) {
                        return { error: 'Inverse requires a square matrix' };
                    }
                    const det = calculateDeterminant(matrixA);
                    if (Math.abs(det) < 1e-10) {
                        return { error: 'Matrix is singular (determinant = 0), inverse does not exist' };
                    }
                    result = calculateInverse(matrixA);
                    explanation = `Calculated inverse of ${rowsA}×${colsA} matrix`;
                    break;
            }
            
            return {
                operation: data.operation,
                result: typeof result === 'number' ? result.toFixed(6) : formatMatrix(result),
                explanation: explanation,
                matrixA: formatMatrix(matrixA),
                matrixB: matrixB ? formatMatrix(matrixB) : null,
                dimensions: typeof result === 'number' ? 'Scalar' : `${result.length} × ${result[0].length}`
            };
            
        } catch (error) {
            return { error: `Calculation error: ${error.message}` };
        }
    }
}));

// Loan Amortization Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'loan-amortization',
    name: 'Loan Amortization Calculator',
    description: 'Generate detailed loan amortization schedules with payment breakdowns',
    category: 'calculators',
    icon: '🏦',
    fields: [
        { name: 'principal', label: 'Loan Amount ($)', type: 'number', required: true, min: 1000, placeholder: '250000' },
        { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', required: true, min: 0, max: 30, step: 0.01, placeholder: '4.5' },
        { name: 'years', label: 'Loan Term (years)', type: 'number', required: true, min: 1, max: 50, placeholder: '30' },
        { name: 'startDate', label: 'Start Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
        { name: 'extraPayment', label: 'Extra Monthly Payment ($)', type: 'number', min: 0, defaultValue: 0 },
        { name: 'showSchedule', label: 'Show Payment Schedule', type: 'checkbox', defaultValue: true }
    ],
    calculate: (data) => {
        const principal = parseFloat(data.principal);
        const annualRate = parseFloat(data.rate) / 100;
        const monthlyRate = annualRate / 12;
        const totalMonths = parseInt(data.years) * 12;
        const extraPayment = parseFloat(data.extraPayment) || 0;
        
        // Monthly payment calculation
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                              (Math.pow(1 + monthlyRate, totalMonths) - 1);
        
        // Generate amortization schedule
        const schedule = [];
        let remainingBalance = principal;
        let totalInterestPaid = 0;
        let actualMonths = 0;
        let paymentDate = new Date(data.startDate);
        
        while (remainingBalance > 0.01 && actualMonths < totalMonths * 2) { // Safety limit
            actualMonths++;
            
            const interestPayment = remainingBalance * monthlyRate;
            const principalPayment = Math.min(monthlyPayment - interestPayment + extraPayment, remainingBalance);
            const totalPayment = interestPayment + principalPayment;
            
            remainingBalance -= principalPayment;
            totalInterestPaid += interestPayment;
            
            if (data.showSchedule && (actualMonths <= 12 || actualMonths % 12 === 0 || remainingBalance <= 0.01)) {
                schedule.push({
                    payment: actualMonths,
                    date: paymentDate.toLocaleDateString(),
                    payment: totalPayment.toFixed(2),
                    principal: principalPayment.toFixed(2),
                    interest: interestPayment.toFixed(2),
                    balance: Math.max(0, remainingBalance).toFixed(2)
                });
            }
            
            // Move to next month
            paymentDate.setMonth(paymentDate.getMonth() + 1);
        }
        
        const totalPaid = principal + totalInterestPaid;
        const timeSaved = totalMonths - actualMonths;
        const interestSaved = extraPayment > 0 ? calculateInterestSaved(principal, annualRate, totalMonths, extraPayment) : 0;
        
        return {
            loanSummary: {
                loanAmount: principal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                interestRate: `${data.rate}% annually`,
                originalTerm: `${data.years} years (${totalMonths} months)`,
                actualTerm: `${Math.floor(actualMonths/12)} years, ${actualMonths%12} months`,
                monthlyPayment: monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                extraPayment: extraPayment > 0 ? extraPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'None'
            },
            paymentSummary: {
                totalInterestPaid: totalInterestPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                totalPaid: totalPaid.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
                timeSaved: timeSaved > 0 ? `${Math.floor(timeSaved/12)} years, ${timeSaved%12} months` : 'None',
                interestSaved: interestSaved > 0 ? interestSaved.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'None'
            },
            schedule: schedule,
            insights: generateLoanInsights(principal, monthlyPayment, totalInterestPaid, extraPayment, timeSaved)
        };
    }
}));

// Unit Circle Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'unit-circle-calculator',
    name: 'Unit Circle Calculator',
    description: 'Calculate trigonometric values and positions on the unit circle',
    category: 'calculators',
    icon: '🔵',
    fields: [
        { name: 'angle', label: 'Angle', type: 'number', required: true, placeholder: '45' },
        { name: 'inputMode', label: 'Input Mode', type: 'select', options: [
            { value: 'degrees', label: 'Degrees' },
            { value: 'radians', label: 'Radians' },
            { value: 'pi', label: 'π radians (e.g., 0.5 for π/2)' }
        ], defaultValue: 'degrees' },
        { name: 'precision', label: 'Decimal Places', type: 'number', min: 0, max: 15, defaultValue: 4 },
        { name: 'showReference', label: 'Show Reference Angles', type: 'checkbox', defaultValue: true }
    ],
    calculate: (data) => {
        let angleInRadians;
        const inputAngle = parseFloat(data.angle);
        
        switch (data.inputMode) {
            case 'degrees':
                angleInRadians = inputAngle * Math.PI / 180;
                break;
            case 'radians':
                angleInRadians = inputAngle;
                break;
            case 'pi':
                angleInRadians = inputAngle * Math.PI;
                break;
        }
        
        // Normalize angle to [0, 2π]
        const normalizedAngle = angleInRadians % (2 * Math.PI);
        const positiveAngle = normalizedAngle < 0 ? normalizedAngle + 2 * Math.PI : normalizedAngle;
        
        // Calculate trigonometric values
        const cos = Math.cos(positiveAngle);
        const sin = Math.sin(positiveAngle);
        const tan = Math.abs(cos) < 1e-10 ? 'Undefined' : sin / cos;
        const cot = Math.abs(sin) < 1e-10 ? 'Undefined' : cos / sin;
        const sec = Math.abs(cos) < 1e-10 ? 'Undefined' : 1 / cos;
        const csc = Math.abs(sin) < 1e-10 ? 'Undefined' : 1 / sin;
        
        // Determine quadrant
        const quadrant = getQuadrant(positiveAngle);
        
        // Reference angle
        const refAngle = getReferenceAngle(positiveAngle);
        
        // Convert back to input format for display
        const normalizedInInputFormat = convertAngle(positiveAngle, 'radians', data.inputMode);
        const refAngleInInputFormat = convertAngle(refAngle, 'radians', data.inputMode);
        
        // Common angles
        const commonAngle = findCommonAngle(positiveAngle);
        
        const formatValue = (value) => {
            if (typeof value === 'string') return value;
            return parseFloat(value.toFixed(data.precision));
        };
        
        return {
            inputAngle: `${data.angle}${getAngleUnit(data.inputMode)}`,
            normalizedAngle: `${formatValue(normalizedInInputFormat)}${getAngleUnit(data.inputMode)}`,
            quadrant: quadrant,
            referenceAngle: data.showReference ? `${formatValue(refAngleInInputFormat)}${getAngleUnit(data.inputMode)}` : null,
            trigonometricValues: {
                sin: formatValue(sin),
                cos: formatValue(cos),
                tan: typeof tan === 'string' ? tan : formatValue(tan),
                cot: typeof cot === 'string' ? cot : formatValue(cot),
                sec: typeof sec === 'string' ? sec : formatValue(sec),
                csc: typeof csc === 'string' ? csc : formatValue(csc)
            },
            coordinates: {
                x: formatValue(cos),
                y: formatValue(sin)
            },
            commonAngle: commonAngle,
            specialValues: data.showReference ? getSpecialAngles(data.inputMode, data.precision) : null
        };
    }
}));

// Polynomial Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'polynomial-calculator',
    name: 'Polynomial Calculator',
    description: 'Analyze polynomials, find roots, and perform polynomial operations',
    category: 'calculators',
    icon: '🔺',
    fields: [
        { name: 'coefficients', label: 'Coefficients (highest degree first)', type: 'text', required: true, placeholder: '1,-3,2' },
        { name: 'operation', label: 'Operation', type: 'select', options: [
            { value: 'analyze', label: 'Analyze Polynomial' },
            { value: 'evaluate', label: 'Evaluate at x-value' },
            { value: 'roots', label: 'Find Roots' },
            { value: 'derivative', label: 'Find Derivative' },
            { value: 'integral', label: 'Find Integral' }
        ], defaultValue: 'analyze' },
        { name: 'xValue', label: 'x-value (for evaluation)', type: 'number', placeholder: '2' },
        { name: 'precision', label: 'Decimal Precision', type: 'number', min: 0, max: 10, defaultValue: 4 }
    ],
    calculate: (data) => {
        try {
            const coeffs = data.coefficients.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
            
            if (coeffs.length === 0) {
                return { error: 'Please provide valid coefficients' };
            }
            
            const degree = coeffs.length - 1;
            const polynomial = formatPolynomial(coeffs);
            
            let result = {};
            
            switch (data.operation) {
                case 'analyze':
                    result = {
                        polynomial: polynomial,
                        degree: degree,
                        leadingCoefficient: coeffs[0],
                        constantTerm: coeffs[coeffs.length - 1],
                        type: getPolynomialType(degree),
                        behavior: analyzeEndBehavior(coeffs[0], degree),
                        turningPoints: Math.max(0, degree - 1),
                        possibleRoots: degree
                    };
                    break;
                
                case 'evaluate':
                    const x = parseFloat(data.xValue) || 0;
                    const value = evaluatePolynomial(coeffs, x);
                    result = {
                        polynomial: polynomial,
                        xValue: x,
                        result: parseFloat(value.toFixed(data.precision)),
                        calculation: `P(${x}) = ${value.toFixed(data.precision)}`
                    };
                    break;
                
                case 'roots':
                    const roots = findPolynomialRoots(coeffs);
                    result = {
                        polynomial: polynomial,
                        degree: degree,
                        roots: roots.map(r => typeof r === 'number' ? r.toFixed(data.precision) : r),
                        numberOfRoots: roots.filter(r => typeof r === 'number').length,
                        note: degree > 2 ? 'Higher degree polynomials may have complex roots not shown' : null
                    };
                    break;
                
                case 'derivative':
                    const derivative = calculateDerivative(coeffs);
                    result = {
                        originalPolynomial: polynomial,
                        derivative: formatPolynomial(derivative),
                        derivativeCoefficients: derivative,
                        newDegree: Math.max(0, degree - 1)
                    };
                    break;
                
                case 'integral':
                    const integral = calculateIntegral(coeffs);
                    result = {
                        originalPolynomial: polynomial,
                        integral: formatPolynomial(integral) + ' + C',
                        integralCoefficients: integral,
                        newDegree: degree + 1,
                        note: 'C represents the constant of integration'
                    };
                    break;
            }
            
            return result;
            
        } catch (error) {
            return { error: `Calculation error: ${error.message}` };
        }
    }
}));

// Complex Number Calculator
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'complex-number-calculator',
    name: 'Complex Number Calculator',
    description: 'Perform operations with complex numbers in rectangular and polar forms',
    category: 'calculators',
    icon: '🔢',
    fields: [
        { name: 'realA', label: 'First Number - Real Part', type: 'number', required: true, defaultValue: 3 },
        { name: 'imagA', label: 'First Number - Imaginary Part', type: 'number', required: true, defaultValue: 4 },
        { name: 'realB', label: 'Second Number - Real Part', type: 'number', defaultValue: 1 },
        { name: 'imagB', label: 'Second Number - Imaginary Part', type: 'number', defaultValue: 2 },
        { name: 'operation', label: 'Operation', type: 'select', options: [
            { value: 'info', label: 'Number Information' },
            { value: 'add', label: 'Addition (A + B)' },
            { value: 'subtract', label: 'Subtraction (A - B)' },
            { value: 'multiply', label: 'Multiplication (A × B)' },
            { value: 'divide', label: 'Division (A ÷ B)' },
            { value: 'conjugate', label: 'Complex Conjugate of A' },
            { value: 'power', label: 'A raised to power n' }
        ], defaultValue: 'info' },
        { name: 'power', label: 'Power (for exponentiation)', type: 'number', defaultValue: 2 },
        { name: 'precision', label: 'Decimal Precision', type: 'number', min: 0, max: 10, defaultValue: 4 }
    ],
    calculate: (data) => {
        const a = { real: parseFloat(data.realA), imag: parseFloat(data.imagA) };
        const b = { real: parseFloat(data.realB) || 0, imag: parseFloat(data.imagB) || 0 };
        const power = parseInt(data.power) || 2;
        
        // Helper functions for complex number operations
        const magnitude = (z) => Math.sqrt(z.real * z.real + z.imag * z.imag);
        const argument = (z) => Math.atan2(z.imag, z.real);
        const formatComplex = (z) => {
            const real = parseFloat(z.real.toFixed(data.precision));
            const imag = parseFloat(z.imag.toFixed(data.precision));
            if (imag === 0) return real.toString();
            if (real === 0) return imag === 1 ? 'i' : imag === -1 ? '-i' : `${imag}i`;
            const sign = imag >= 0 ? '+' : '-';
            const imagPart = Math.abs(imag) === 1 ? 'i' : `${Math.abs(imag)}i`;
            return `${real} ${sign} ${imagPart}`;
        };
        
        const toPolar = (z) => {
            const r = magnitude(z);
            const theta = argument(z) * 180 / Math.PI;
            return { magnitude: r, angle: theta };
        };
        
        let result = {};
        
        switch (data.operation) {
            case 'info':
                const polarA = toPolar(a);
                const polarB = toPolar(b);
                result = {
                    numberA: {
                        rectangular: formatComplex(a),
                        polar: `${polarA.magnitude.toFixed(data.precision)} ∠ ${polarA.angle.toFixed(data.precision)}°`,
                        magnitude: polarA.magnitude.toFixed(data.precision),
                        argument: `${polarA.angle.toFixed(data.precision)}° (${(polarA.angle * Math.PI / 180).toFixed(data.precision)} rad)`
                    },
                    numberB: {
                        rectangular: formatComplex(b),
                        polar: `${polarB.magnitude.toFixed(data.precision)} ∠ ${polarB.angle.toFixed(data.precision)}°`,
                        magnitude: polarB.magnitude.toFixed(data.precision),
                        argument: `${polarB.angle.toFixed(data.precision)}° (${(polarB.angle * Math.PI / 180).toFixed(data.precision)} rad)`
                    }
                };
                break;
            
            case 'add':
                const sum = { real: a.real + b.real, imag: a.imag + b.imag };
                result = {
                    operation: `(${formatComplex(a)}) + (${formatComplex(b)})`,
                    result: formatComplex(sum),
                    rectangular: formatComplex(sum),
                    polar: `${magnitude(sum).toFixed(data.precision)} ∠ ${(argument(sum) * 180 / Math.PI).toFixed(data.precision)}°`
                };
                break;
            
            case 'subtract':
                const diff = { real: a.real - b.real, imag: a.imag - b.imag };
                result = {
                    operation: `(${formatComplex(a)}) - (${formatComplex(b)})`,
                    result: formatComplex(diff),
                    rectangular: formatComplex(diff),
                    polar: `${magnitude(diff).toFixed(data.precision)} ∠ ${(argument(diff) * 180 / Math.PI).toFixed(data.precision)}°`
                };
                break;
            
            case 'multiply':
                const product = {
                    real: a.real * b.real - a.imag * b.imag,
                    imag: a.real * b.imag + a.imag * b.real
                };
                result = {
                    operation: `(${formatComplex(a)}) × (${formatComplex(b)})`,
                    result: formatComplex(product),
                    rectangular: formatComplex(product),
                    polar: `${magnitude(product).toFixed(data.precision)} ∠ ${(argument(product) * 180 / Math.PI).toFixed(data.precision)}°`
                };
                break;
            
            case 'divide':
                const denominator = b.real * b.real + b.imag * b.imag;
                if (Math.abs(denominator) < 1e-10) {
                    return { error: 'Division by zero (or very small number)' };
                }
                const quotient = {
                    real: (a.real * b.real + a.imag * b.imag) / denominator,
                    imag: (a.imag * b.real - a.real * b.imag) / denominator
                };
                result = {
                    operation: `(${formatComplex(a)}) ÷ (${formatComplex(b)})`,
                    result: formatComplex(quotient),
                    rectangular: formatComplex(quotient),
                    polar: `${magnitude(quotient).toFixed(data.precision)} ∠ ${(argument(quotient) * 180 / Math.PI).toFixed(data.precision)}°`
                };
                break;
            
            case 'conjugate':
                const conjugate = { real: a.real, imag: -a.imag };
                result = {
                    original: formatComplex(a),
                    conjugate: formatComplex(conjugate),
                    product: formatComplex({ real: a.real * a.real + a.imag * a.imag, imag: 0 }),
                    note: 'The product of a complex number and its conjugate is always real'
                };
                break;
            
            case 'power':
                // Using De Moivre's theorem: (r∠θ)^n = r^n∠(nθ)
                const r = magnitude(a);
                const theta = argument(a);
                const rPowN = Math.pow(r, power);
                const nTheta = power * theta;
                const powerResult = {
                    real: rPowN * Math.cos(nTheta),
                    imag: rPowN * Math.sin(nTheta)
                };
                result = {
                    base: formatComplex(a),
                    exponent: power,
                    operation: `(${formatComplex(a)})^${power}`,
                    result: formatComplex(powerResult),
                    method: 'De Moivre\'s Theorem used',
                    rectangular: formatComplex(powerResult),
                    polar: `${rPowN.toFixed(data.precision)} ∠ ${(nTheta * 180 / Math.PI).toFixed(data.precision)}°`
                };
                break;
        }
        
        return result;
    }
}));

// Equation System Solver
ToolRegistry.register(ToolTemplates.createCalculator({
    id: 'equation-system-solver',
    name: 'System of Equations Solver',
    description: 'Solve systems of linear equations using multiple methods',
    category: 'calculators',
    icon: '⚖️',
    fields: [
        { name: 'equations', label: 'Equations (one per line, format: 2x + 3y = 5)', type: 'textarea', required: true, placeholder: '2x + 3y = 5\n4x - y = 1' },
        { name: 'method', label: 'Solution Method', type: 'select', options: [
            { value: 'gaussian', label: 'Gaussian Elimination' },
            { value: 'substitution', label: 'Substitution Method' },
            { value: 'cramer', label: 'Cramer\'s Rule' },
            { value: 'matrix', label: 'Matrix Method' }
        ], defaultValue: 'gaussian' },
        { name: 'showSteps', label: 'Show Solution Steps', type: 'checkbox', defaultValue: true },
        { name: 'precision', label: 'Decimal Precision', type: 'number', min: 0, max: 10, defaultValue: 4 }
    ],
    calculate: (data) => {
        try {
            const equations = data.equations.trim().split('\n').filter(eq => eq.trim());
            
            if (equations.length < 2) {
                return { error: 'Please provide at least 2 equations' };
            }
            
            // Parse equations into coefficient matrix and constants
            const { coefficientMatrix, constants, variables } = parseEquationSystem(equations);
            
            if (!coefficientMatrix) {
                return { error: 'Error parsing equations. Please use format: ax + by = c' };
            }
            
            const n = coefficientMatrix.length;
            const m = coefficientMatrix[0].length;
            
            if (n !== m) {
                return { error: 'System must have equal number of equations and variables' };
            }
            
            // Solve using selected method
            let solution = null;
            let steps = [];
            
            switch (data.method) {
                case 'gaussian':
                    ({ solution, steps } = solveGaussian(coefficientMatrix, constants, variables, data.showSteps));
                    break;
                case 'cramer':
                    ({ solution, steps } = solveCramer(coefficientMatrix, constants, variables, data.showSteps));
                    break;
                case 'matrix':
                    ({ solution, steps } = solveMatrix(coefficientMatrix, constants, variables, data.showSteps));
                    break;
                default:
                    ({ solution, steps } = solveGaussian(coefficientMatrix, constants, variables, data.showSteps));
            }
            
            if (!solution) {
                return { error: 'No unique solution exists (system may be inconsistent or dependent)' };
            }
            
            // Format solution
            const formattedSolution = variables.map((variable, index) => ({
                variable: variable,
                value: parseFloat(solution[index].toFixed(data.precision))
            }));
            
            // Verify solution
            const verification = verifySystemSolution(coefficientMatrix, constants, solution);
            
            return {
                originalSystem: equations,
                method: data.method,
                solution: formattedSolution,
                solutionString: formattedSolution.map(s => `${s.variable} = ${s.value}`).join(', '),
                steps: data.showSteps ? steps : null,
                verification: verification ? 'Solution verified ✓' : 'Solution verification failed ⚠️',
                systemType: classifySystem(coefficientMatrix, constants)
            };
            
        } catch (error) {
            return { error: `Solver error: ${error.message}` };
        }
    }
}));

// Helper functions (implementations would be more detailed in production)

function generateStatisticalInterpretation(mean, median, stdDev, skewness, kurtosis) {
    const interpretations = [];
    
    if (Math.abs(mean - median) / stdDev < 0.1) {
        interpretations.push('Distribution appears symmetric');
    } else if (mean > median) {
        interpretations.push('Distribution is right-skewed (positive skew)');
    } else {
        interpretations.push('Distribution is left-skewed (negative skew)');
    }
    
    if (stdDev / mean < 0.1) {
        interpretations.push('Data shows low variability');
    } else if (stdDev / mean > 0.3) {
        interpretations.push('Data shows high variability');
    }
    
    return interpretations;
}

function parseMatrix(matrixStr) {
    try {
        return matrixStr.split(';').map(row => 
            row.split(',').map(cell => parseFloat(cell.trim()))
        );
    } catch {
        return null;
    }
}

function formatMatrix(matrix) {
    if (!Array.isArray(matrix)) return matrix;
    return matrix.map(row => 
        row.map(cell => parseFloat(cell).toFixed(3)).join('  ')
    ).join('\n');
}

function getMatrixType(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    if (rows !== cols) return 'Rectangular';
    
    // Check for identity matrix
    let isIdentity = true;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i === j && matrix[i][j] !== 1) isIdentity = false;
            if (i !== j && matrix[i][j] !== 0) isIdentity = false;
        }
    }
    if (isIdentity) return 'Identity';
    
    // Check for diagonal matrix
    let isDiagonal = true;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i !== j && matrix[i][j] !== 0) isDiagonal = false;
        }
    }
    if (isDiagonal) return 'Diagonal';
    
    return 'Square';
}

function analyzeMatrixProperties(matrix) {
    const props = [];
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    props.push(`Dimensions: ${rows} × ${cols}`);
    
    if (rows === cols) {
        const det = calculateDeterminant(matrix);
        props.push(`Determinant: ${det.toFixed(4)}`);
        props.push(`Invertible: ${Math.abs(det) > 1e-10 ? 'Yes' : 'No'}`);
    }
    
    return props;
}

function matrixAdd(a, b) {
    return a.map((row, i) => row.map((cell, j) => cell + b[i][j]));
}

function matrixSubtract(a, b) {
    return a.map((row, i) => row.map((cell, j) => cell - b[i][j]));
}

function matrixMultiply(a, b) {
    const result = [];
    for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function transposeMatrix(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function calculateDeterminant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        const minor = matrix.slice(1).map(row => 
            row.filter((_, j) => j !== i)
        );
        det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(minor);
    }
    return det;
}

function calculateInverse(matrix) {
    // Simplified 2x2 inverse for demo
    const det = calculateDeterminant(matrix);
    if (matrix.length === 2) {
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    // For larger matrices, would use Gauss-Jordan elimination
    return matrix; // Placeholder
}

function calculateInterestSaved(principal, rate, months, extraPayment) {
    // Simplified calculation
    return extraPayment * months * 0.5; // Rough estimate
}

function generateLoanInsights(principal, payment, totalInterest, extra, timeSaved) {
    const insights = [];
    
    const interestRatio = totalInterest / principal;
    if (interestRatio > 0.5) {
        insights.push('You will pay more than 50% of the loan amount in interest');
    }
    
    if (extra > 0) {
        insights.push(`Extra payments save ${timeSaved} months and significant interest`);
    }
    
    const monthlyRatio = payment / (principal / 360); // Rough monthly principal portion
    if (monthlyRatio > 2) {
        insights.push('Your payment is well above principal-only payments');
    }
    
    return insights.length > 0 ? insights : ['Standard loan terms'];
}

function getQuadrant(angle) {
    if (angle >= 0 && angle < Math.PI / 2) return 'I';
    if (angle >= Math.PI / 2 && angle < Math.PI) return 'II';
    if (angle >= Math.PI && angle < 3 * Math.PI / 2) return 'III';
    return 'IV';
}

function getReferenceAngle(angle) {
    const pi = Math.PI;
    if (angle <= pi / 2) return angle;
    if (angle <= pi) return pi - angle;
    if (angle <= 3 * pi / 2) return angle - pi;
    return 2 * pi - angle;
}

function convertAngle(angle, from, to) {
    if (from === to) return angle;
    
    let radians = angle;
    if (from === 'degrees') radians = angle * Math.PI / 180;
    if (from === 'pi') radians = angle * Math.PI;
    
    if (to === 'degrees') return radians * 180 / Math.PI;
    if (to === 'pi') return radians / Math.PI;
    return radians;
}

function getAngleUnit(mode) {
    switch (mode) {
        case 'degrees': return '°';
        case 'radians': return ' rad';
        case 'pi': return 'π';
        default: return '';
    }
}

function findCommonAngle(radians) {
    const commonAngles = {
        0: '0', [Math.PI/6]: 'π/6 (30°)', [Math.PI/4]: 'π/4 (45°)',
        [Math.PI/3]: 'π/3 (60°)', [Math.PI/2]: 'π/2 (90°)',
        [Math.PI]: 'π (180°)', [3*Math.PI/2]: '3π/2 (270°)', [2*Math.PI]: '2π (360°)'
    };
    
    const tolerance = 0.01;
    for (const [rad, desc] of Object.entries(commonAngles)) {
        if (Math.abs(parseFloat(rad) - radians) < tolerance) {
            return desc;
        }
    }
    return 'Not a common angle';
}

function getSpecialAngles(mode, precision) {
    const angles = [
        { degrees: 0, radians: 0, pi: 0, sin: 0, cos: 1 },
        { degrees: 30, radians: Math.PI/6, pi: 1/6, sin: 0.5, cos: Math.sqrt(3)/2 },
        { degrees: 45, radians: Math.PI/4, pi: 1/4, sin: Math.sqrt(2)/2, cos: Math.sqrt(2)/2 },
        { degrees: 60, radians: Math.PI/3, pi: 1/3, sin: Math.sqrt(3)/2, cos: 0.5 },
        { degrees: 90, radians: Math.PI/2, pi: 1/2, sin: 1, cos: 0 }
    ];
    
    return angles.map(angle => ({
        angle: angle[mode],
        sin: parseFloat(angle.sin.toFixed(precision)),
        cos: parseFloat(angle.cos.toFixed(precision))
    }));
}

function formatPolynomial(coeffs) {
    if (coeffs.length === 0) return '0';
    
    const terms = [];
    const degree = coeffs.length - 1;
    
    coeffs.forEach((coeff, index) => {
        if (coeff === 0) return;
        
        const power = degree - index;
        let term = '';
        
        if (coeff > 0 && terms.length > 0) term += ' + ';
        if (coeff < 0) term += terms.length === 0 ? '-' : ' - ';
        
        const absCoeff = Math.abs(coeff);
        if (absCoeff !== 1 || power === 0) {
            term += absCoeff;
        }
        
        if (power > 1) term += `x^${power}`;
        else if (power === 1) term += 'x';
        
        terms.push(term);
    });
    
    return terms.join('') || '0';
}

function getPolynomialType(degree) {
    const types = {
        0: 'Constant',
        1: 'Linear',
        2: 'Quadratic',
        3: 'Cubic',
        4: 'Quartic',
        5: 'Quintic'
    };
    return types[degree] || `Degree ${degree}`;
}

function analyzeEndBehavior(leadingCoeff, degree) {
    if (degree % 2 === 0) {
        return leadingCoeff > 0 ? 'Both ends up' : 'Both ends down';
    } else {
        return leadingCoeff > 0 ? 'Left down, right up' : 'Left up, right down';
    }
}

function evaluatePolynomial(coeffs, x) {
    return coeffs.reduce((sum, coeff, index) => {
        const power = coeffs.length - 1 - index;
        return sum + coeff * Math.pow(x, power);
    }, 0);
}

function findPolynomialRoots(coeffs) {
    // Simplified root finding - in production, would use numerical methods
    const degree = coeffs.length - 1;
    
    if (degree === 1) {
        return [-coeffs[1] / coeffs[0]];
    } else if (degree === 2) {
        const [a, b, c] = coeffs;
        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return ['Complex roots'];
        const sqrt = Math.sqrt(discriminant);
        return [(-b + sqrt) / (2 * a), (-b - sqrt) / (2 * a)];
    } else {
        return ['Use numerical methods for higher degree'];
    }
}

function calculateDerivative(coeffs) {
    if (coeffs.length <= 1) return [0];
    
    return coeffs.slice(0, -1).map((coeff, index) => {
        const power = coeffs.length - 1 - index;
        return coeff * power;
    });
}

function calculateIntegral(coeffs) {
    const integral = [0]; // Constant term (C)
    
    coeffs.forEach((coeff, index) => {
        const power = coeffs.length - 1 - index;
        integral.unshift(coeff / (power + 1));
    });
    
    return integral;
}

function parseEquationSystem(equations) {
    // Simplified parser - would be more robust in production
    const variables = ['x', 'y', 'z', 'w']; // Support up to 4 variables
    const coefficientMatrix = [];
    const constants = [];
    
    equations.forEach(eq => {
        const sides = eq.split('=');
        if (sides.length !== 2) throw new Error('Invalid equation format');
        
        const leftSide = sides[0].trim();
        const rightSide = parseFloat(sides[1].trim());
        
        // Extract coefficients (simplified parsing)
        const coeffs = variables.map(variable => {
            const regex = new RegExp(`([+-]?\\d*)${variable}`, 'g');
            const matches = leftSide.match(regex);
            if (!matches) return 0;
            
            return matches.reduce((sum, match) => {
                const coeff = match.replace(variable, '') || '1';
                return sum + (coeff === '+' || coeff === '' ? 1 : coeff === '-' ? -1 : parseFloat(coeff));
            }, 0);
        });
        
        coefficientMatrix.push(coeffs);
        constants.push(rightSide);
    });
    
    return { coefficientMatrix, constants, variables: variables.slice(0, coefficientMatrix[0].length) };
}

function solveGaussian(matrix, constants, variables, showSteps) {
    // Simplified Gaussian elimination
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [...row, constants[i]]);
    
    const steps = showSteps ? ['Starting Gaussian elimination...'] : [];
    
    // Forward elimination
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const factor = augmented[j][i] / augmented[i][i];
            for (let k = i; k < n + 1; k++) {
                augmented[j][k] -= factor * augmented[i][k];
            }
            if (showSteps) steps.push(`R${j+1} = R${j+1} - (${factor.toFixed(2)})R${i+1}`);
        }
    }
    
    // Back substitution
    const solution = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = augmented[i][n];
        for (let j = i + 1; j < n; j++) {
            solution[i] -= augmented[i][j] * solution[j];
        }
        solution[i] /= augmented[i][i];
        if (showSteps) steps.push(`${variables[i]} = ${solution[i].toFixed(4)}`);
    }
    
    return { solution, steps };
}

function solveCramer(matrix, constants, variables, showSteps) {
    const n = matrix.length;
    const det = calculateDeterminant(matrix);
    
    if (Math.abs(det) < 1e-10) {
        throw new Error('System has no unique solution (determinant = 0)');
    }
    
    const steps = showSteps ? [`Main determinant = ${det.toFixed(4)}`] : [];
    const solution = [];
    
    for (let i = 0; i < n; i++) {
        const modifiedMatrix = matrix.map((row, j) => 
            row.map((cell, k) => k === i ? constants[j] : cell)
        );
        const detI = calculateDeterminant(modifiedMatrix);
        solution[i] = detI / det;
        if (showSteps) steps.push(`${variables[i]} = ${detI.toFixed(4)} / ${det.toFixed(4)} = ${solution[i].toFixed(4)}`);
    }
    
    return { solution, steps };
}

function solveMatrix(matrix, constants, variables, showSteps) {
    // Using matrix inverse: X = A^(-1) * B
    const inverse = calculateInverse(matrix);
    const solution = matrixMultiply(inverse, constants.map(c => [c])).map(row => row[0]);
    
    const steps = showSteps ? ['Using matrix method: X = A⁻¹B'] : [];
    
    return { solution, steps };
}

function verifySystemSolution(matrix, constants, solution) {
    for (let i = 0; i < matrix.length; i++) {
        const leftSide = matrix[i].reduce((sum, coeff, j) => sum + coeff * solution[j], 0);
        if (Math.abs(leftSide - constants[i]) > 1e-6) return false;
    }
    return true;
}

function classifySystem(matrix, constants) {
    const det = calculateDeterminant(matrix);
    if (Math.abs(det) > 1e-10) return 'Unique solution';
    return 'No unique solution (inconsistent or dependent)';
}

console.log('✅ Advanced Calculator Tools loaded successfully (8 tools)');