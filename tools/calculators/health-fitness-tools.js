// Health & Fitness Calculator Tools
(function() {
    'use strict';

    // 1. BMI Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'bmi-calculator',
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index and health status',
        category: 'health',
        icon: '⚖️',
        fields: [
            { name: 'weight', label: 'Weight', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'height', label: 'Height', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'unit', label: 'Unit System', type: 'select', required: true, options: [
                { value: 'metric', label: 'Metric (kg, cm)' },
                { value: 'imperial', label: 'Imperial (lbs, inches)' }
            ]}
        ],
        calculate: (data) => {
            const weight = parseFloat(data.weight);
            const height = parseFloat(data.height);
            const unit = data.unit;
            
            let bmi;
            if (unit === 'imperial') {
                bmi = (weight * 703) / Math.pow(height, 2);
            } else {
                bmi = weight / Math.pow(height / 100, 2);
            }
            
            let category, healthStatus;
            if (bmi < 18.5) {
                category = 'Underweight';
                healthStatus = 'Below normal weight';
            } else if (bmi < 25) {
                category = 'Normal';
                healthStatus = 'Healthy weight';
            } else if (bmi < 30) {
                category = 'Overweight';
                healthStatus = 'Above normal weight';
            } else {
                category = 'Obese';
                healthStatus = 'Well above normal weight';
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'BMI', value: Formatters.number.decimal(bmi, 1) },
                    { label: 'Category', value: category },
                    { label: 'Health Status', value: healthStatus },
                    { label: 'Weight', value: `${weight} ${unit === 'metric' ? 'kg' : 'lbs'}` },
                    { label: 'Height', value: `${height} ${unit === 'metric' ? 'cm' : 'inches'}` }
                ]
            };
        }
    }));

    // 2. BMR Calculator (Basal Metabolic Rate)
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'bmr-calculator',
        name: 'BMR Calculator',
        description: 'Calculate Basal Metabolic Rate - calories burned at rest',
        category: 'health',
        icon: '🔥',
        fields: [
            { name: 'weight', label: 'Weight', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'height', label: 'Height', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'age', label: 'Age (years)', type: 'number', required: true, step: '1', min: '0', max: '150' },
            { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]},
            { name: 'unit', label: 'Unit System', type: 'select', required: true, options: [
                { value: 'metric', label: 'Metric (kg, cm)' },
                { value: 'imperial', label: 'Imperial (lbs, inches)' }
            ]}
        ],
        calculate: (data) => {
            let weight = parseFloat(data.weight);
            let height = parseFloat(data.height);
            const age = parseFloat(data.age);
            const gender = data.gender;
            const unit = data.unit;
            
            // Convert to metric if needed
            if (unit === 'imperial') {
                weight = weight * 0.453592; // lbs to kg
                height = height * 2.54; // inches to cm
            }
            
            // Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            
            // Activity level multipliers for TDEE
            const activityLevels = {
                sedentary: { multiplier: 1.2, label: 'Sedentary (little/no exercise)' },
                light: { multiplier: 1.375, label: 'Light activity (light exercise 1-3 days/week)' },
                moderate: { multiplier: 1.55, label: 'Moderate activity (moderate exercise 3-5 days/week)' },
                active: { multiplier: 1.725, label: 'Very active (hard exercise 6-7 days/week)' },
                extra: { multiplier: 1.9, label: 'Extra active (very hard exercise, physical job)' }
            };
            
            return {
                multiple: true,
                values: [
                    { label: 'BMR', value: `${Math.round(bmr)} calories/day` },
                    { label: 'Sedentary TDEE', value: `${Math.round(bmr * activityLevels.sedentary.multiplier)} calories/day` },
                    { label: 'Light Activity TDEE', value: `${Math.round(bmr * activityLevels.light.multiplier)} calories/day` },
                    { label: 'Moderate Activity TDEE', value: `${Math.round(bmr * activityLevels.moderate.multiplier)} calories/day` },
                    { label: 'Very Active TDEE', value: `${Math.round(bmr * activityLevels.active.multiplier)} calories/day` }
                ]
            };
        }
    }));

    // 3. Calorie Burn Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'calorie-burn-calculator',
        name: 'Calorie Burn Calculator',
        description: 'Calculate calories burned during various activities',
        category: 'health',
        icon: '🏃',
        fields: [
            { name: 'weight', label: 'Weight (lbs)', type: 'number', required: true, step: '1', min: '0' },
            { name: 'activity', label: 'Activity', type: 'select', required: true, options: [
                { value: '3.5', label: 'Walking (3 mph)' },
                { value: '4.3', label: 'Walking (4 mph)' },
                { value: '6', label: 'Jogging (5 mph)' },
                { value: '8', label: 'Running (6 mph)' },
                { value: '10', label: 'Running (7.5 mph)' },
                { value: '7', label: 'Cycling (12-14 mph)' },
                { value: '8.5', label: 'Cycling (14-16 mph)' },
                { value: '6', label: 'Swimming (moderate)' },
                { value: '8', label: 'Swimming (vigorous)' },
                { value: '5', label: 'Yoga' },
                { value: '6', label: 'Weight training' },
                { value: '7', label: 'Basketball' },
                { value: '8', label: 'Soccer' },
                { value: '5.5', label: 'Dancing' },
                { value: '4', label: 'Golf' }
            ]},
            { name: 'duration', label: 'Duration (minutes)', type: 'number', required: true, step: '1', min: '1' }
        ],
        calculate: (data) => {
            const weight = parseFloat(data.weight);
            const met = parseFloat(data.activity); // METs value
            const duration = parseFloat(data.duration);
            
            // Calories burned = METs × weight in kg × time in hours
            const weightKg = weight * 0.453592;
            const hours = duration / 60;
            const caloriesBurned = met * weightKg * hours;
            
            const activityMap = {
                '3.5': 'Walking (3 mph)',
                '4.3': 'Walking (4 mph)', 
                '6': 'Jogging (5 mph)',
                '8': 'Running (6 mph)',
                '10': 'Running (7.5 mph)',
                '7': 'Cycling (12-14 mph)',
                '8.5': 'Cycling (14-16 mph)',
                '5': 'Yoga',
                '5.5': 'Dancing',
                '4': 'Golf'
            };
            
            const activityName = activityMap[met.toString()] || 'Selected Activity';
            const caloriesPerHour = caloriesBurned / hours;
            
            return {
                multiple: true,
                values: [
                    { label: 'Calories Burned', value: `${Math.round(caloriesBurned)} calories` },
                    { label: 'Activity', value: activityName },
                    { label: 'Duration', value: `${duration} minutes` },
                    { label: 'Calories per Hour', value: `${Math.round(caloriesPerHour)} calories/hour` },
                    { label: 'METs Value', value: met.toString() }
                ]
            };
        }
    }));

    // 4. Body Fat Percentage Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'body-fat-calculator',
        name: 'Body Fat Percentage Calculator',
        description: 'Calculate body fat percentage using US Navy method',
        category: 'health',
        icon: '📏',
        fields: [
            { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]},
            { name: 'height', label: 'Height (inches)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'waist', label: 'Waist (inches)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'neck', label: 'Neck (inches)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'hip', label: 'Hip (inches) - Female only', type: 'number', step: '0.1', min: '0' }
        ],
        calculate: (data) => {
            const gender = data.gender;
            const height = parseFloat(data.height);
            const waist = parseFloat(data.waist);
            const neck = parseFloat(data.neck);
            const hip = parseFloat(data.hip || 0);
            
            let bodyFat;
            
            if (gender === 'male') {
                // Male formula: 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
                bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
            } else {
                // Female formula: 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
                if (!hip || hip === 0) {
                    throw new Error('Hip measurement is required for females');
                }
                bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
            }
            
            let category;
            if (gender === 'male') {
                if (bodyFat < 6) category = 'Essential Fat';
                else if (bodyFat < 14) category = 'Athletic';
                else if (bodyFat < 18) category = 'Fitness';
                else if (bodyFat < 25) category = 'Average';
                else category = 'Obese';
            } else {
                if (bodyFat < 16) category = 'Essential Fat';
                else if (bodyFat < 21) category = 'Athletic';
                else if (bodyFat < 25) category = 'Fitness';
                else if (bodyFat < 32) category = 'Average';
                else category = 'Obese';
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'Body Fat Percentage', value: `${Formatters.number.decimal(bodyFat, 1)}%` },
                    { label: 'Category', value: category },
                    { label: 'Method', value: 'US Navy Formula' },
                    { label: 'Gender', value: Formatters.string.capitalize(gender) }
                ]
            };
        }
    }));

    // 5. Ideal Weight Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'ideal-weight-calculator',
        name: 'Ideal Weight Calculator',
        description: 'Calculate ideal body weight using multiple formulas',
        category: 'health',
        icon: '🎯',
        fields: [
            { name: 'height', label: 'Height (inches)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]}
        ],
        calculate: (data) => {
            const height = parseFloat(data.height);
            const gender = data.gender;
            
            if (height < 60) {
                throw new Error('Height must be at least 60 inches (5 feet)');
            }
            
            // Robinson Formula (1983)
            let robinson;
            if (gender === 'male') {
                robinson = 52 + 1.9 * (height - 60);
            } else {
                robinson = 49 + 1.7 * (height - 60);
            }
            
            // Miller Formula (1983)
            let miller;
            if (gender === 'male') {
                miller = 56.2 + 1.41 * (height - 60);
            } else {
                miller = 53.1 + 1.36 * (height - 60);
            }
            
            // Devine Formula (1974)
            let devine;
            if (gender === 'male') {
                devine = 50 + 2.3 * (height - 60);
            } else {
                devine = 45.5 + 2.3 * (height - 60);
            }
            
            // Hamwi Formula (1964)
            let hamwi;
            if (gender === 'male') {
                hamwi = 48 + 2.7 * (height - 60);
            } else {
                hamwi = 45.5 + 2.2 * (height - 60);
            }
            
            // Convert kg to lbs and calculate average
            const robinsonLbs = robinson * 2.20462;
            const millerLbs = miller * 2.20462;
            const devineLbs = devine * 2.20462;
            const hamwiLbs = hamwi * 2.20462;
            const average = (robinsonLbs + millerLbs + devineLbs + hamwiLbs) / 4;
            
            return {
                multiple: true,
                values: [
                    { label: 'Average Ideal Weight', value: `${Math.round(average)} lbs (${Formatters.number.decimal(average / 2.20462, 1)} kg)` },
                    { label: 'Robinson Formula', value: `${Math.round(robinsonLbs)} lbs` },
                    { label: 'Miller Formula', value: `${Math.round(millerLbs)} lbs` },
                    { label: 'Devine Formula', value: `${Math.round(devineLbs)} lbs` },
                    { label: 'Hamwi Formula', value: `${Math.round(hamwiLbs)} lbs` }
                ]
            };
        }
    }));

    // 6. Water Intake Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'water-intake-calculator',
        name: 'Water Intake Calculator',
        description: 'Calculate daily water intake recommendations',
        category: 'health',
        icon: '💧',
        fields: [
            { name: 'weight', label: 'Weight (lbs)', type: 'number', required: true, step: '1', min: '0' },
            { name: 'activityLevel', label: 'Activity Level', type: 'select', required: true, options: [
                { value: 'low', label: 'Low (little to no exercise)' },
                { value: 'moderate', label: 'Moderate (exercise 3-4 times/week)' },
                { value: 'high', label: 'High (daily exercise or intense activity)' }
            ]},
            { name: 'climate', label: 'Climate', type: 'select', required: true, options: [
                { value: 'normal', label: 'Normal/Temperate' },
                { value: 'hot', label: 'Hot/Humid' },
                { value: 'cold', label: 'Cold/Dry' }
            ]}
        ],
        calculate: (data) => {
            const weight = parseFloat(data.weight);
            const activityLevel = data.activityLevel;
            const climate = data.climate;
            
            // Base calculation: 2/3 of body weight in ounces
            let baseWater = weight * (2/3);
            
            // Activity level adjustments
            const activityMultipliers = {
                'low': 1.0,
                'moderate': 1.2,
                'high': 1.4
            };
            
            baseWater *= activityMultipliers[activityLevel];
            
            // Climate adjustments
            const climateAdjustments = {
                'normal': 0,
                'hot': baseWater * 0.15, // Add 15% for hot climate
                'cold': baseWater * 0.05   // Add 5% for cold climate (dry air)
            };
            
            const totalWater = baseWater + climateAdjustments[climate];
            const cupsPerDay = totalWater / 8;
            const litersPerDay = totalWater * 0.0295735;
            const bottlesPerDay = totalWater / 16.9; // Standard water bottle size
            
            return {
                multiple: true,
                values: [
                    { label: 'Daily Water Intake', value: `${Math.round(totalWater)} fl oz` },
                    { label: 'Cups per Day', value: `${Formatters.number.decimal(cupsPerDay, 1)} cups` },
                    { label: 'Liters per Day', value: `${Formatters.number.decimal(litersPerDay, 1)} liters` },
                    { label: 'Water Bottles per Day', value: `${Formatters.number.decimal(bottlesPerDay, 1)} bottles` },
                    { label: 'Activity Level', value: activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1) }
                ]
            };
        }
    }));

    // 7. Macro Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'macro-calculator',
        name: 'Macro Calculator',
        description: 'Calculate macronutrient breakdown for your goals',
        category: 'health',
        icon: '🍎',
        fields: [
            { name: 'weight', label: 'Weight (lbs)', type: 'number', required: true, step: '1', min: '0' },
            { name: 'height', label: 'Height (inches)', type: 'number', required: true, step: '0.1', min: '0' },
            { name: 'age', label: 'Age (years)', type: 'number', required: true, step: '1', min: '0', max: '150' },
            { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' }
            ]},
            { name: 'activityLevel', label: 'Activity Level', type: 'select', required: true, options: [
                { value: '1.2', label: 'Sedentary (desk job)' },
                { value: '1.375', label: 'Light activity (1-3 days/week)' },
                { value: '1.55', label: 'Moderate activity (3-5 days/week)' },
                { value: '1.725', label: 'Very active (6-7 days/week)' },
                { value: '1.9', label: 'Extra active (2x/day, intense)' }
            ]},
            { name: 'goal', label: 'Goal', type: 'select', required: true, options: [
                { value: 'lose', label: 'Lose Weight (-500 cal/day)' },
                { value: 'maintain', label: 'Maintain Weight' },
                { value: 'gain', label: 'Gain Weight (+500 cal/day)' }
            ]}
        ],
        calculate: (data) => {
            let weight = parseFloat(data.weight);
            let height = parseFloat(data.height);
            const age = parseFloat(data.age);
            const gender = data.gender;
            const activityLevel = parseFloat(data.activityLevel);
            const goal = data.goal;
            
            // Convert to metric
            weight = weight * 0.453592; // lbs to kg
            height = height * 2.54; // inches to cm
            
            // Calculate BMR using Mifflin-St Jeor
            let bmr;
            if (gender === 'male') {
                bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
            } else {
                bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
            }
            
            // Calculate TDEE
            let tdee = bmr * activityLevel;
            
            // Adjust for goal
            if (goal === 'lose') {
                tdee -= 500;
            } else if (goal === 'gain') {
                tdee += 500;
            }
            
            // Macro ratios (moderate approach)
            const proteinPercent = 0.25; // 25%
            const fatPercent = 0.30; // 30%
            const carbPercent = 0.45; // 45%
            
            // Calculate grams (4 cal/g protein, 4 cal/g carbs, 9 cal/g fat)
            const proteinGrams = Math.round((tdee * proteinPercent) / 4);
            const fatGrams = Math.round((tdee * fatPercent) / 9);
            const carbGrams = Math.round((tdee * carbPercent) / 4);
            
            // Calculate calories from each macro
            const proteinCals = proteinGrams * 4;
            const fatCals = fatGrams * 9;
            const carbCals = carbGrams * 4;
            
            return {
                multiple: true,
                values: [
                    { label: 'Daily Calories', value: `${Math.round(tdee)} calories` },
                    { label: 'Protein', value: `${proteinGrams}g (${proteinCals} calories)` },
                    { label: 'Carbohydrates', value: `${carbGrams}g (${carbCals} calories)` },
                    { label: 'Fat', value: `${fatGrams}g (${fatCals} calories)` },
                    { label: 'Goal', value: goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : 'Maintenance' }
                ]
            };
        }
    }));

    // 8. Heart Rate Zone Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'heart-rate-calculator',
        name: 'Heart Rate Zone Calculator', 
        description: 'Calculate target heart rate zones for training',
        category: 'health',
        icon: '❤️',
        fields: [
            { name: 'age', label: 'Age (years)', type: 'number', required: true, step: '1', min: '0', max: '150' },
            { name: 'restingHR', label: 'Resting Heart Rate (bpm)', type: 'number', step: '1', min: '30', max: '100', value: '70' }
        ],
        calculate: (data) => {
            const age = parseFloat(data.age);
            const restingHR = parseFloat(data.restingHR || 70);
            
            // Calculate Maximum Heart Rate
            const maxHR = 220 - age;
            
            // Heart Rate Reserve (Karvonen method)
            const hrReserve = maxHR - restingHR;
            
            // Training zones based on % of Heart Rate Reserve
            const zones = [
                { name: 'Recovery Zone', min: 50, max: 60, purpose: 'Active recovery, warm-up' },
                { name: 'Aerobic Base Zone', min: 60, max: 70, purpose: 'Base building, fat burning' },
                { name: 'Aerobic Zone', min: 70, max: 80, purpose: 'Aerobic fitness, endurance' },
                { name: 'Lactate Threshold', min: 80, max: 90, purpose: 'Performance, lactate threshold' },
                { name: 'VO2 Max Zone', min: 90, max: 100, purpose: 'Maximum oxygen uptake' }
            ];
            
            const results = [
                { label: 'Maximum Heart Rate', value: `${maxHR} bpm` },
                { label: 'Resting Heart Rate', value: `${restingHR} bpm` },
                { label: 'Heart Rate Reserve', value: `${hrReserve} bpm` }
            ];
            
            zones.forEach(zone => {
                const minBPM = Math.round((hrReserve * zone.min / 100) + restingHR);
                const maxBPM = Math.round((hrReserve * zone.max / 100) + restingHR);
                results.push({
                    label: zone.name,
                    value: `${minBPM} - ${maxBPM} bpm`,
                    description: zone.purpose
                });
            });
            
            return { multiple: true, values: results };
        }
    }));

    // 9. Pregnancy Due Date Calculator
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'pregnancy-calculator',
        name: 'Pregnancy Due Date Calculator',
        description: 'Calculate pregnancy due date and milestones',
        category: 'health',
        icon: '🤱',
        fields: [
            { name: 'lastPeriod', label: 'Last Menstrual Period', type: 'date', required: true }
        ],
        calculate: (data) => {
            const lmpDate = new Date(data.lastPeriod);
            const today = new Date();
            
            // Add 280 days (40 weeks) to LMP
            const dueDate = new Date(lmpDate);
            dueDate.setDate(lmpDate.getDate() + 280);
            
            // Calculate weeks pregnant
            const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
            const weeksPregnant = Math.floor(daysSinceLMP / 7);
            const daysPregnant = daysSinceLMP % 7;
            
            // Calculate days until due date
            const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
            
            // Trimesters
            let trimester;
            if (weeksPregnant < 13) {
                trimester = 'First Trimester';
            } else if (weeksPregnant < 27) {
                trimester = 'Second Trimester';
            } else {
                trimester = 'Third Trimester';
            }
            
            return {
                multiple: true,
                values: [
                    { label: 'Due Date', value: Formatters.date.format(dueDate, 'MM/DD/YYYY') },
                    { label: 'Weeks Pregnant', value: `${weeksPregnant} weeks, ${daysPregnant} days` },
                    { label: 'Current Trimester', value: trimester },
                    { label: 'Days Until Due Date', value: daysUntilDue > 0 ? `${daysUntilDue} days` : 'Past due date' },
                    { label: 'Last Menstrual Period', value: Formatters.date.format(lmpDate, 'MM/DD/YYYY') }
                ]
            };
        }
    }));

    // 10. Age Calculator  
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'age-calculator',
        name: 'Age Calculator',
        description: 'Calculate exact age and life statistics',
        category: 'health',
        icon: '🎂',
        fields: [
            { name: 'birthDate', label: 'Birth Date', type: 'date', required: true },
            { name: 'targetDate', label: 'Calculate age on (optional)', type: 'date' }
        ],
        calculate: (data) => {
            const birthDate = new Date(data.birthDate);
            const targetDate = data.targetDate ? new Date(data.targetDate) : new Date();
            
            if (birthDate > targetDate) {
                throw new Error('Birth date cannot be in the future');
            }
            
            // Calculate exact age
            let years = targetDate.getFullYear() - birthDate.getFullYear();
            let months = targetDate.getMonth() - birthDate.getMonth();
            let days = targetDate.getDate() - birthDate.getDate();
            
            if (days < 0) {
                months--;
                const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
                days += lastMonth.getDate();
            }
            
            if (months < 0) {
                years--;
                months += 12;
            }
            
            // Calculate total days, hours, minutes
            const totalDays = Math.floor((targetDate - birthDate) / (1000 * 60 * 60 * 24));
            const totalHours = totalDays * 24;
            const totalMinutes = totalHours * 60;
            
            // Next birthday
            const nextBirthday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (nextBirthday < targetDate) {
                nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
            }
            const daysUntilBirthday = Math.ceil((nextBirthday - targetDate) / (1000 * 60 * 60 * 24));
            
            return {
                multiple: true,
                values: [
                    { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
                    { label: 'Total Days Lived', value: Formatters.number.thousands(totalDays) },
                    { label: 'Total Hours Lived', value: Formatters.number.thousands(totalHours) },
                    { label: 'Total Minutes Lived', value: Formatters.number.thousands(totalMinutes) },
                    { label: 'Days Until Next Birthday', value: `${daysUntilBirthday} days` }
                ]
            };
        }
    }));

})();