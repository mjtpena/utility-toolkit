// Additional Financial Calculator Tools (9-12)
(function() {
    'use strict';

    // 9. Retirement Savings Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'retirement-calculator',
        name: 'Retirement Savings Calculator',
        description: 'Calculate how much you need to save for retirement',
        category: 'calculators',
        icon: '🏖️',
        fields: [
            { name: 'currentAge', label: 'Current Age', type: 'number', required: true, step: '1', min: '18', max: '100' },
            { name: 'retirementAge', label: 'Retirement Age', type: 'number', required: true, step: '1', min: '50', max: '100', value: '65' },
            { name: 'currentSavings', label: 'Current Savings ($)', type: 'number', step: '1000', min: '0', value: '0' },
            { name: 'monthlyContribution', label: 'Monthly Contribution ($)', type: 'number', step: '50', min: '0', value: '500' },
            { name: 'returnRate', label: 'Expected Annual Return (%)', type: 'number', step: '0.1', min: '0', value: '7' },
            { name: 'retirementGoal', label: 'Retirement Goal ($)', type: 'number', step: '10000', min: '0', value: '1000000' }
        ],
        calculate: (data) => {
            const currentAge = parseInt(data.currentAge);
            const retirementAge = parseInt(data.retirementAge);
            const currentSavings = parseFloat(data.currentSavings || 0);
            const monthlyContribution = parseFloat(data.monthlyContribution || 0);
            const annualReturn = parseFloat(data.returnRate || 7) / 100;
            const retirementGoal = parseFloat(data.retirementGoal || 1000000);
            
            if (retirementAge <= currentAge) {
                throw new Error('Retirement age must be greater than current age');
            }
            
            const yearsToRetirement = retirementAge - currentAge;
            const monthlyReturn = annualReturn / 12;
            const totalMonths = yearsToRetirement * 12;
            
            // Future value of current savings
            const futureCurrentSavings = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
            
            // Future value of monthly contributions
            let futureContributions = 0;
            if (monthlyContribution > 0 && monthlyReturn > 0) {
                futureContributions = monthlyContribution * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
            } else if (monthlyContribution > 0) {
                futureContributions = monthlyContribution * totalMonths;
            }
            
            const totalAtRetirement = futureCurrentSavings + futureContributions;
            const shortfall = Math.max(0, retirementGoal - totalAtRetirement);
            const surplus = Math.max(0, totalAtRetirement - retirementGoal);
            
            // Calculate required monthly contribution to reach goal
            const requiredFuture = Math.max(0, retirementGoal - futureCurrentSavings);
            let requiredMonthly = 0;
            if (requiredFuture > 0 && totalMonths > 0) {
                if (monthlyReturn > 0) {
                    requiredMonthly = requiredFuture * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
                } else {
                    requiredMonthly = requiredFuture / totalMonths;
                }
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'Total at Retirement', value: Formatters.number.currency(totalAtRetirement) },
                    { label: 'Years to Retirement', value: yearsToRetirement.toString() },
                    { label: 'Retirement Goal', value: Formatters.number.currency(retirementGoal) },
                    { label: shortfall > 0 ? 'Shortfall' : 'Surplus', value: Formatters.number.currency(shortfall > 0 ? shortfall : surplus) },
                    { label: 'Required Monthly Savings', value: Formatters.number.currency(requiredMonthly) }
                ]
            };
        }
    }));

    // 10. Investment Return Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'investment-return-calculator',
        name: 'Investment Return Calculator',
        description: 'Calculate investment returns with various scenarios',
        category: 'calculators',
        icon: '💎',
        fields: [
            { name: 'initialInvestment', label: 'Initial Investment ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'regularContribution', label: 'Regular Contribution ($)', type: 'number', step: '50', min: '0', value: '0' },
            { name: 'contributionFrequency', label: 'Contribution Frequency', type: 'select', options: [
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Yearly' }
            ], value: 'monthly'},
            { name: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'timeHorizon', label: 'Investment Period (years)', type: 'number', required: true, step: '0.5', min: '0.5' },
            { name: 'inflationRate', label: 'Expected Inflation Rate (%)', type: 'number', step: '0.1', min: '0', value: '2.5' }
        ],
        calculate: (data) => {
            const initial = parseFloat(data.initialInvestment);
            const regularContrib = parseFloat(data.regularContribution || 0);
            const frequency = data.contributionFrequency || 'monthly';
            const annualReturn = parseFloat(data.expectedReturn) / 100;
            const years = parseFloat(data.timeHorizon);
            const inflation = parseFloat(data.inflationRate || 2.5) / 100;
            
            // Convert contribution frequency to annual contributions
            let annualContribution = 0;
            if (regularContrib > 0) {
                switch(frequency) {
                    case 'monthly': annualContribution = regularContrib * 12; break;
                    case 'quarterly': annualContribution = regularContrib * 4; break;
                    case 'yearly': annualContribution = regularContrib; break;
                }
            }
            
            // Future value of initial investment
            const futureInitial = initial * Math.pow(1 + annualReturn, years);
            
            // Future value of regular contributions
            let futureContributions = 0;
            if (annualContribution > 0 && annualReturn > 0) {
                futureContributions = annualContribution * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
            } else if (annualContribution > 0) {
                futureContributions = annualContribution * years;
            }
            
            const totalFutureValue = futureInitial + futureContributions;
            const totalContributed = initial + (annualContribution * years);
            const totalGain = totalFutureValue - totalContributed;
            
            // Real return (adjusted for inflation)
            const realReturn = ((1 + annualReturn) / (1 + inflation)) - 1;
            const realFutureValue = initial * Math.pow(1 + realReturn, years);
            
            return {
                multiple: true,
                values: [
                    { label: 'Future Value', value: Formatters.number.currency(totalFutureValue) },
                    { label: 'Total Contributed', value: Formatters.number.currency(totalContributed) },
                    { label: 'Total Gain', value: Formatters.number.currency(totalGain) },
                    { label: 'Real Value (Inflation Adj.)', value: Formatters.number.currency(realFutureValue) },
                    { label: 'Average Annual Gain', value: Formatters.number.currency(totalGain / years) }
                ]
            };
        }
    }));

    // 11. Debt Payoff Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'debt-payoff-calculator',
        name: 'Debt Payoff Calculator',
        description: 'Calculate debt payoff time and interest savings',
        category: 'calculators',
        icon: '💳',
        fields: [
            { name: 'balance', label: 'Current Balance ($)', type: 'number', required: true, step: '100', min: '0' },
            { name: 'apr', label: 'Annual Percentage Rate (%)', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'minPayment', label: 'Minimum Payment ($)', type: 'number', required: true, step: '10', min: '0' },
            { name: 'extraPayment', label: 'Extra Payment ($)', type: 'number', step: '10', min: '0', value: '0' }
        ],
        calculate: (data) => {
            const balance = parseFloat(data.balance);
            const apr = parseFloat(data.apr) / 100;
            const minPayment = parseFloat(data.minPayment);
            const extraPayment = parseFloat(data.extraPayment || 0);
            
            const monthlyRate = apr / 12;
            const totalPayment = minPayment + extraPayment;
            
            if (totalPayment <= balance * monthlyRate) {
                throw new Error('Payment amount is too low to pay off debt. Increase payment amount.');
            }
            
            // Calculate payoff with minimum payment only
            let minBalance = balance;
            let minMonths = 0;
            let minTotalPaid = 0;
            
            while (minBalance > 0 && minMonths < 600) { // 50 year max
                const interestPayment = minBalance * monthlyRate;
                const principalPayment = Math.min(minPayment - interestPayment, minBalance);
                minBalance -= principalPayment;
                minTotalPaid += minPayment;
                minMonths++;
                
                if (minBalance < 0.01) break;
            }
            
            // Calculate payoff with extra payment
            let extraBalance = balance;
            let extraMonths = 0;
            let extraTotalPaid = 0;
            
            while (extraBalance > 0 && extraMonths < 600) {
                const interestPayment = extraBalance * monthlyRate;
                const principalPayment = Math.min(totalPayment - interestPayment, extraBalance);
                extraBalance -= principalPayment;
                extraTotalPaid += totalPayment;
                extraMonths++;
                
                if (extraBalance < 0.01) break;
            }
            
            const timeSaved = minMonths - extraMonths;
            const interestSaved = minTotalPaid - extraTotalPaid;
            
            return {
                multiple: true,
                values: [
                    { label: 'Payoff Time (Extra Payment)', value: `${Math.floor(extraMonths / 12)} years, ${extraMonths % 12} months` },
                    { label: 'Total Interest Paid', value: Formatters.number.currency(extraTotalPaid - balance) },
                    { label: 'Time Saved', value: `${Math.floor(timeSaved / 12)} years, ${timeSaved % 12} months` },
                    { label: 'Interest Saved', value: Formatters.number.currency(interestSaved) },
                    { label: 'Total Amount Paid', value: Formatters.number.currency(extraTotalPaid) }
                ]
            };
        }
    }));

    // 12. Currency Converter (with manual rate input)
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'currency-converter',
        name: 'Currency Converter',
        description: 'Convert between currencies with manual exchange rates',
        category: 'calculators',
        icon: '💱',
        fields: [
            { name: 'amount', label: 'Amount', type: 'number', required: true, step: '0.01', min: '0' },
            { name: 'fromCurrency', label: 'From Currency', type: 'select', required: true, options: [
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'GBP', label: 'British Pound (GBP)' },
                { value: 'JPY', label: 'Japanese Yen (JPY)' },
                { value: 'CHF', label: 'Swiss Franc (CHF)' },
                { value: 'CAD', label: 'Canadian Dollar (CAD)' },
                { value: 'AUD', label: 'Australian Dollar (AUD)' },
                { value: 'CNY', label: 'Chinese Yuan (CNY)' },
                { value: 'INR', label: 'Indian Rupee (INR)' }
            ]},
            { name: 'toCurrency', label: 'To Currency', type: 'select', required: true, options: [
                { value: 'USD', label: 'US Dollar (USD)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'GBP', label: 'British Pound (GBP)' },
                { value: 'JPY', label: 'Japanese Yen (JPY)' },
                { value: 'CHF', label: 'Swiss Franc (CHF)' },
                { value: 'CAD', label: 'Canadian Dollar (CAD)' },
                { value: 'AUD', label: 'Australian Dollar (AUD)' },
                { value: 'CNY', label: 'Chinese Yuan (CNY)' },
                { value: 'INR', label: 'Indian Rupee (INR)' }
            ]},
            { name: 'exchangeRate', label: 'Exchange Rate (1 FROM = ? TO)', type: 'number', required: true, step: '0.000001', min: '0' }
        ],
        calculate: (data) => {
            const amount = parseFloat(data.amount);
            const rate = parseFloat(data.exchangeRate);
            const fromCurrency = data.fromCurrency;
            const toCurrency = data.toCurrency;
            
            if (fromCurrency === toCurrency) {
                return {
                    multiple: true,
                    values: [
                        { label: 'Converted Amount', value: `${Formatters.number.decimal(amount, 2)} ${toCurrency}` },
                        { label: 'Exchange Rate', value: `1 ${fromCurrency} = 1 ${toCurrency}` },
                        { label: 'Note', value: 'Same currency - no conversion needed' }
                    ]
                };
            }
            
            const convertedAmount = amount * rate;
            const reverseRate = 1 / rate;
            
            return {
                multiple: true,
                values: [
                    { label: 'Converted Amount', value: `${Formatters.number.decimal(convertedAmount, 2)} ${toCurrency}` },
                    { label: 'Exchange Rate Used', value: `1 ${fromCurrency} = ${Formatters.number.decimal(rate, 6)} ${toCurrency}` },
                    { label: 'Reverse Rate', value: `1 ${toCurrency} = ${Formatters.number.decimal(reverseRate, 6)} ${fromCurrency}` },
                    { label: 'Original Amount', value: `${Formatters.number.decimal(amount, 2)} ${fromCurrency}` }
                ]
            };
        }
    }));

})();