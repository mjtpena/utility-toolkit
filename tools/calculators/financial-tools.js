// Financial Calculator Tools
(function() {
    'use strict';

    // 1. Tip Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'tip-calculator',
        name: 'Tip Calculator',
        description: 'Calculate tips and split bills among multiple people',
        category: 'calculators',
        icon: '💰',
        fields: [
            { name: 'bill', label: 'Bill Amount ($)', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'tipPercent', label: 'Tip Percentage (%)', type: 'number', required: true, value: '18', step: '0.1', min: '0' },
            { name: 'people', label: 'Number of People', type: 'number', required: true, value: '1', step: '1', min: '1' }
        ],
        calculate: (data) => {
            const bill = parseFloat(data.bill);
            const tipPercent = parseFloat(data.tipPercent);
            const people = parseInt(data.people);
            
            const tipAmount = bill * (tipPercent / 100);
            const total = bill + tipAmount;
            const perPerson = total / people;
            const tipPerPerson = tipAmount / people;
            
            return {
                multiple: true,
                values: [
                    { label: 'Tip Amount', value: Formatters.number.currency(tipAmount) },
                    { label: 'Total Amount', value: Formatters.number.currency(total) },
                    { label: 'Per Person Total', value: Formatters.number.currency(perPerson) },
                    { label: 'Tip Per Person', value: Formatters.number.currency(tipPerPerson) }
                ]
            };
        }
    }));

    // 2. Mortgage Payment Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'mortgage-calculator',
        name: 'Mortgage Calculator',
        description: 'Calculate monthly mortgage payments and total interest',
        category: 'calculators', 
        icon: '🏠',
        fields: [
            { name: 'principal', label: 'Loan Amount ($)', type: 'number', required: true, step: '1000', min: '0' },
            { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'years', label: 'Loan Term (years)', type: 'number', required: true, step: '1', min: '1' },
            { name: 'downPayment', label: 'Down Payment ($)', type: 'number', step: '1000', min: '0', value: '0' }
        ],
        calculate: (data) => {
            const loanAmount = parseFloat(data.principal) - parseFloat(data.downPayment || 0);
            const monthlyRate = parseFloat(data.rate) / 100 / 12;
            const numPayments = parseFloat(data.years) * 12;
            
            if (monthlyRate === 0) {
                const monthlyPayment = loanAmount / numPayments;
                return {
                    multiple: true,
                    values: [
                        { label: 'Monthly Payment', value: Formatters.number.currency(monthlyPayment) },
                        { label: 'Total Paid', value: Formatters.number.currency(monthlyPayment * numPayments) },
                        { label: 'Total Interest', value: Formatters.number.currency(0) }
                    ]
                };
            }
            
            const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                 (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalPaid = monthlyPayment * numPayments;
            const totalInterest = totalPaid - loanAmount;
            
            return {
                multiple: true,
                values: [
                    { label: 'Monthly Payment', value: Formatters.number.currency(monthlyPayment) },
                    { label: 'Total Paid', value: Formatters.number.currency(totalPaid) },
                    { label: 'Total Interest', value: Formatters.number.currency(totalInterest) },
                    { label: 'Loan Amount', value: Formatters.number.currency(loanAmount) }
                ]
            };
        }
    }));

    // 3. Compound Interest Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'compound-interest-calculator',
        name: 'Compound Interest Calculator',
        description: 'Calculate compound interest and investment growth over time',
        category: 'calculators',
        icon: '📈',
        fields: [
            { name: 'principal', label: 'Initial Amount ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'time', label: 'Time Period (years)', type: 'number', required: true, step: '0.5', min: '0' },
            { name: 'frequency', label: 'Compounding Frequency', type: 'select', required: true, options: [
                { value: '1', label: 'Annually' },
                { value: '2', label: 'Semi-Annually' },
                { value: '4', label: 'Quarterly' },
                { value: '12', label: 'Monthly' },
                { value: '365', label: 'Daily' }
            ]},
            { name: 'contribution', label: 'Monthly Contribution ($)', type: 'number', step: '10', min: '0', value: '0' }
        ],
        calculate: (data) => {
            const principal = parseFloat(data.principal);
            const rate = parseFloat(data.rate) / 100;
            const time = parseFloat(data.time);
            const frequency = parseFloat(data.frequency);
            const monthlyContribution = parseFloat(data.contribution || 0);
            
            // Compound interest formula: A = P(1 + r/n)^(nt)
            const compoundAmount = principal * Math.pow(1 + rate/frequency, frequency * time);
            
            // Future value of annuity (monthly contributions)
            let contributionAmount = 0;
            if (monthlyContribution > 0) {
                const monthlyRate = rate / 12;
                const months = time * 12;
                if (monthlyRate === 0) {
                    contributionAmount = monthlyContribution * months;
                } else {
                    contributionAmount = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
                }
            }
            
            const totalAmount = compoundAmount + contributionAmount;
            const totalContributions = principal + (monthlyContribution * time * 12);
            const totalInterest = totalAmount - totalContributions;
            
            return {
                multiple: true,
                values: [
                    { label: 'Final Amount', value: Formatters.number.currency(totalAmount) },
                    { label: 'Total Interest Earned', value: Formatters.number.currency(totalInterest) },
                    { label: 'Total Contributions', value: Formatters.number.currency(totalContributions) },
                    { label: 'Interest Rate Return', value: Formatters.number.percentage((totalInterest / totalContributions) * 100, 2) }
                ]
            };
        }
    }));

    // 4. Loan Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'loan-calculator', 
        name: 'Loan Payment Calculator',
        description: 'Calculate loan payments and create amortization schedule',
        category: 'calculators',
        icon: '💳',
        fields: [
            { name: 'principal', label: 'Loan Amount ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'rate', label: 'Annual Interest Rate (%)', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'term', label: 'Loan Term (years)', type: 'number', required: true, step: '0.5', min: '0.5' }
        ],
        calculate: (data) => {
            const principal = parseFloat(data.principal);
            const annualRate = parseFloat(data.rate) / 100;
            const years = parseFloat(data.term);
            const monthlyRate = annualRate / 12;
            const numPayments = years * 12;
            
            if (monthlyRate === 0) {
                const monthlyPayment = principal / numPayments;
                return {
                    multiple: true,
                    values: [
                        { label: 'Monthly Payment', value: Formatters.number.currency(monthlyPayment) },
                        { label: 'Total Paid', value: Formatters.number.currency(monthlyPayment * numPayments) },
                        { label: 'Total Interest', value: Formatters.number.currency(0) }
                    ]
                };
            }
            
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                 (Math.pow(1 + monthlyRate, numPayments) - 1);
            const totalPaid = monthlyPayment * numPayments;
            const totalInterest = totalPaid - principal;
            
            return {
                multiple: true,
                values: [
                    { label: 'Monthly Payment', value: Formatters.number.currency(monthlyPayment) },
                    { label: 'Total Amount Paid', value: Formatters.number.currency(totalPaid) },
                    { label: 'Total Interest Paid', value: Formatters.number.currency(totalInterest) },
                    { label: 'Interest as % of Loan', value: Formatters.number.percentage((totalInterest / principal) * 100, 1) }
                ]
            };
        }
    }));

    // 5. ROI Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'roi-calculator',
        name: 'ROI Calculator',
        description: 'Calculate return on investment and annualized returns',
        category: 'calculators',
        icon: '📊',
        fields: [
            { name: 'initialValue', label: 'Initial Investment ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'finalValue', label: 'Final Value ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'years', label: 'Investment Period (years)', type: 'number', step: '0.1', min: '0.1', value: '1' }
        ],
        calculate: (data) => {
            const initial = parseFloat(data.initialValue);
            const final = parseFloat(data.finalValue);
            const years = parseFloat(data.years || 1);
            
            const totalReturn = final - initial;
            const totalROI = (totalReturn / initial) * 100;
            const annualizedROI = years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : totalROI;
            
            return {
                multiple: true,
                values: [
                    { label: 'Total Return', value: Formatters.number.currency(totalReturn) },
                    { label: 'Total ROI', value: Formatters.number.percentage(totalROI, 2) },
                    { label: 'Annualized ROI', value: Formatters.number.percentage(annualizedROI, 2) },
                    { label: 'Investment Gain/Loss', value: totalReturn >= 0 ? 'Gain' : 'Loss' }
                ]
            };
        }
    }));

    // 6. Tax Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'tax-calculator',
        name: 'Income Tax Calculator',
        description: 'Calculate income tax with different tax brackets',
        category: 'calculators',
        icon: '🧾',
        fields: [
            { name: 'income', label: 'Annual Income ($)', type: 'number', required: true, step: '1000', min: '0' },
            { name: 'filingStatus', label: 'Filing Status', type: 'select', required: true, options: [
                { value: 'single', label: 'Single' },
                { value: 'marriedJoint', label: 'Married Filing Jointly' },
                { value: 'marriedSeparate', label: 'Married Filing Separately' },
                { value: 'headOfHousehold', label: 'Head of Household' }
            ]},
            { name: 'deductions', label: 'Total Deductions ($)', type: 'number', step: '100', min: '0', value: '13850' }
        ],
        calculate: (data) => {
            const income = parseFloat(data.income);
            const deductions = parseFloat(data.deductions || 0);
            const taxableIncome = Math.max(0, income - deductions);
            
            // Simplified 2023 tax brackets for single filers
            const brackets = [
                { min: 0, max: 11000, rate: 0.10 },
                { min: 11000, max: 44725, rate: 0.12 },
                { min: 44725, max: 95375, rate: 0.22 },
                { min: 95375, max: 182050, rate: 0.24 },
                { min: 182050, max: 231250, rate: 0.32 },
                { min: 231250, max: 578125, rate: 0.35 },
                { min: 578125, max: Infinity, rate: 0.37 }
            ];
            
            let tax = 0;
            let remainingIncome = taxableIncome;
            
            for (const bracket of brackets) {
                if (remainingIncome <= 0) break;
                
                const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
                tax += taxableInBracket * bracket.rate;
                remainingIncome -= taxableInBracket;
            }
            
            const afterTaxIncome = income - tax;
            const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
            const marginalRate = brackets.find(b => taxableIncome > b.min && taxableIncome <= b.max)?.rate * 100 || 0;
            
            return {
                multiple: true,
                values: [
                    { label: 'Taxable Income', value: Formatters.number.currency(taxableIncome) },
                    { label: 'Federal Tax Owed', value: Formatters.number.currency(tax) },
                    { label: 'After-Tax Income', value: Formatters.number.currency(afterTaxIncome) },
                    { label: 'Effective Tax Rate', value: Formatters.number.percentage(effectiveRate, 2) },
                    { label: 'Marginal Tax Rate', value: Formatters.number.percentage(marginalRate, 1) }
                ]
            };
        }
    }));

    // 7. Break-even Point Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'breakeven-calculator',
        name: 'Break-Even Calculator',
        description: 'Calculate break-even point for business planning',
        category: 'calculators',
        icon: '⚖️',
        fields: [
            { name: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'variableCost', label: 'Variable Cost per Unit ($)', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'sellingPrice', label: 'Selling Price per Unit ($)', type: 'number', required: true, step: '0.01', min: '0' }
        ],
        calculate: (data) => {
            const fixedCosts = parseFloat(data.fixedCosts);
            const variableCost = parseFloat(data.variableCost);
            const sellingPrice = parseFloat(data.sellingPrice);
            
            if (sellingPrice <= variableCost) {
                throw new Error('Selling price must be greater than variable cost per unit');
            }
            
            const contributionMargin = sellingPrice - variableCost;
            const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
            const breakEvenRevenue = breakEvenUnits * sellingPrice;
            const contributionMarginRatio = (contributionMargin / sellingPrice) * 100;
            
            return {
                multiple: true,
                values: [
                    { label: 'Break-Even Units', value: Formatters.number.thousands(breakEvenUnits) },
                    { label: 'Break-Even Revenue', value: Formatters.number.currency(breakEvenRevenue) },
                    { label: 'Contribution Margin', value: Formatters.number.currency(contributionMargin) },
                    { label: 'Contribution Margin %', value: Formatters.number.percentage(contributionMarginRatio, 2) }
                ]
            };
        }
    }));

    // 8. Profit Margin Calculator  
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'profit-margin-calculator',
        name: 'Profit Margin Calculator', 
        description: 'Calculate gross, operating, and net profit margins',
        category: 'calculators',
        icon: '💹',
        fields: [
            { name: 'revenue', label: 'Total Revenue ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'cogs', label: 'Cost of Goods Sold ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'operatingExpenses', label: 'Operating Expenses ($)', type: 'number', step: '100', min: '0', value: '0' },
            { name: 'taxes', label: 'Taxes & Interest ($)', type: 'number', step: '100', min: '0', value: '0' }
        ],
        calculate: (data) => {
            const revenue = parseFloat(data.revenue);
            const cogs = parseFloat(data.cogs);
            const opex = parseFloat(data.operatingExpenses || 0);
            const taxes = parseFloat(data.taxes || 0);
            
            const grossProfit = revenue - cogs;
            const operatingProfit = grossProfit - opex;
            const netProfit = operatingProfit - taxes;
            
            const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
            const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
            const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
            
            return {
                multiple: true,
                values: [
                    { label: 'Gross Profit', value: Formatters.number.currency(grossProfit) },
                    { label: 'Operating Profit', value: Formatters.number.currency(operatingProfit) },
                    { label: 'Net Profit', value: Formatters.number.currency(netProfit) },
                    { label: 'Gross Margin', value: Formatters.number.percentage(grossMargin, 2) },
                    { label: 'Operating Margin', value: Formatters.number.percentage(operatingMargin, 2) },
                    { label: 'Net Margin', value: Formatters.number.percentage(netMargin, 2) }
                ]
            };
        }
    }));

})();