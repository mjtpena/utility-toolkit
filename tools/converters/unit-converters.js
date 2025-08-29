// Unit Converter Tools
(function() {
    'use strict';

    // Helper function to create conversion tools
    const createUnitConverter = (config) => {
        return ToolTemplates.createConverter({
            id: config.id,
            name: config.name,
            description: config.description,
            category: 'converters',
            icon: config.icon,
            fromOptions: config.units,
            convert: (value, from, to) => {
                const val = parseFloat(value);
                if (from === to) return val;
                
                // Convert to base unit first, then to target unit
                const baseValue = val / config.conversions[from];
                const result = baseValue * config.conversions[to];
                
                return result;
            }
        });
    };

    // 1. Length Converter
    ToolRegistry.register(createUnitConverter({
        id: 'length-converter',
        name: 'Length Converter',
        description: 'Convert between different length units',
        icon: '📏',
        units: [
            { value: 'meter', label: 'Meters (m)' },
            { value: 'kilometer', label: 'Kilometers (km)' },
            { value: 'centimeter', label: 'Centimeters (cm)' },
            { value: 'millimeter', label: 'Millimeters (mm)' },
            { value: 'inch', label: 'Inches (in)' },
            { value: 'foot', label: 'Feet (ft)' },
            { value: 'yard', label: 'Yards (yd)' },
            { value: 'mile', label: 'Miles (mi)' }
        ],
        conversions: Calculations.conversions.length
    }));

    // 2. Weight Converter
    ToolRegistry.register(createUnitConverter({
        id: 'weight-converter',
        name: 'Weight Converter',
        description: 'Convert between different weight units',
        icon: '⚖️',
        units: [
            { value: 'kilogram', label: 'Kilograms (kg)' },
            { value: 'gram', label: 'Grams (g)' },
            { value: 'pound', label: 'Pounds (lbs)' },
            { value: 'ounce', label: 'Ounces (oz)' },
            { value: 'stone', label: 'Stone (st)' },
            { value: 'ton', label: 'Tonnes (t)' }
        ],
        conversions: Calculations.conversions.weight
    }));

    // 3. Temperature Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'temperature-converter',
        name: 'Temperature Converter',
        description: 'Convert between Celsius, Fahrenheit, and Kelvin',
        category: 'converters',
        icon: '🌡️',
        fromOptions: [
            { value: 'celsius', label: 'Celsius (°C)' },
            { value: 'fahrenheit', label: 'Fahrenheit (°F)' },
            { value: 'kelvin', label: 'Kelvin (K)' }
        ],
        convert: (value, from, to) => {
            const val = parseFloat(value);
            if (from === to) return val;
            
            // Convert to Celsius first
            let celsius;
            switch(from) {
                case 'celsius':
                    celsius = val;
                    break;
                case 'fahrenheit':
                    celsius = Calculations.conversions.temperature.fahrenheitToCelsius(val);
                    break;
                case 'kelvin':
                    celsius = Calculations.conversions.temperature.kelvinToCelsius(val);
                    break;
            }
            
            // Convert from Celsius to target
            switch(to) {
                case 'celsius':
                    return celsius;
                case 'fahrenheit':
                    return Calculations.conversions.temperature.celsiusToFahrenheit(celsius);
                case 'kelvin':
                    return Calculations.conversions.temperature.celsiusToKelvin(celsius);
            }
        }
    }));

    // 4. Area Converter
    ToolRegistry.register(createUnitConverter({
        id: 'area-converter',
        name: 'Area Converter',
        description: 'Convert between different area units',
        icon: '🔲',
        units: [
            { value: 'square_meter', label: 'Square Meters (m²)' },
            { value: 'square_kilometer', label: 'Square Kilometers (km²)' },
            { value: 'square_centimeter', label: 'Square Centimeters (cm²)' },
            { value: 'square_foot', label: 'Square Feet (ft²)' },
            { value: 'square_inch', label: 'Square Inches (in²)' },
            { value: 'square_yard', label: 'Square Yards (yd²)' },
            { value: 'acre', label: 'Acres' },
            { value: 'hectare', label: 'Hectares' }
        ],
        conversions: {
            square_meter: 1,
            square_kilometer: 0.000001,
            square_centimeter: 10000,
            square_foot: 10.7639,
            square_inch: 1550.0031,
            square_yard: 1.19599,
            acre: 0.000247105,
            hectare: 0.0001
        }
    }));

    // 5. Volume Converter
    ToolRegistry.register(createUnitConverter({
        id: 'volume-converter',
        name: 'Volume Converter',
        description: 'Convert between different volume units',
        icon: '🥤',
        units: [
            { value: 'liter', label: 'Liters (L)' },
            { value: 'milliliter', label: 'Milliliters (mL)' },
            { value: 'gallon', label: 'Gallons (US)' },
            { value: 'quart', label: 'Quarts (US)' },
            { value: 'pint', label: 'Pints (US)' },
            { value: 'cup', label: 'Cups (US)' },
            { value: 'fluid_ounce', label: 'Fluid Ounces (US)' },
            { value: 'cubic_meter', label: 'Cubic Meters (m³)' }
        ],
        conversions: {
            ...Calculations.conversions.volume,
            cubic_meter: 0.001
        }
    }));

    // 6. Speed Converter
    ToolRegistry.register(createUnitConverter({
        id: 'speed-converter',
        name: 'Speed Converter',
        description: 'Convert between different speed units',
        icon: '🚀',
        units: [
            { value: 'meter_per_second', label: 'Meters/second (m/s)' },
            { value: 'kilometer_per_hour', label: 'Kilometers/hour (km/h)' },
            { value: 'mile_per_hour', label: 'Miles/hour (mph)' },
            { value: 'foot_per_second', label: 'Feet/second (ft/s)' },
            { value: 'knot', label: 'Knots' }
        ],
        conversions: {
            meter_per_second: 1,
            kilometer_per_hour: 3.6,
            mile_per_hour: 2.23694,
            foot_per_second: 3.28084,
            knot: 1.94384
        }
    }));

    // 7. Pressure Converter
    ToolRegistry.register(createUnitConverter({
        id: 'pressure-converter',
        name: 'Pressure Converter',
        description: 'Convert between different pressure units',
        icon: '🔧',
        units: [
            { value: 'pascal', label: 'Pascal (Pa)' },
            { value: 'kilopascal', label: 'Kilopascal (kPa)' },
            { value: 'bar', label: 'Bar' },
            { value: 'atmosphere', label: 'Atmosphere (atm)' },
            { value: 'psi', label: 'Pounds/inch² (PSI)' },
            { value: 'mmhg', label: 'Millimeters Mercury (mmHg)' },
            { value: 'torr', label: 'Torr' }
        ],
        conversions: {
            pascal: 1,
            kilopascal: 0.001,
            bar: 0.00001,
            atmosphere: 0.00000986923,
            psi: 0.000145038,
            mmhg: 0.00750062,
            torr: 0.00750062
        }
    }));

    // 8. Energy Converter
    ToolRegistry.register(createUnitConverter({
        id: 'energy-converter',
        name: 'Energy Converter',
        description: 'Convert between different energy units',
        icon: '⚡',
        units: [
            { value: 'joule', label: 'Joules (J)' },
            { value: 'kilojoule', label: 'Kilojoules (kJ)' },
            { value: 'calorie', label: 'Calories (cal)' },
            { value: 'kilocalorie', label: 'Kilocalories (kcal)' },
            { value: 'watt_hour', label: 'Watt Hours (Wh)' },
            { value: 'kilowatt_hour', label: 'Kilowatt Hours (kWh)' },
            { value: 'btu', label: 'BTU' }
        ],
        conversions: {
            joule: 1,
            kilojoule: 0.001,
            calorie: 0.239006,
            kilocalorie: 0.000239006,
            watt_hour: 0.000277778,
            kilowatt_hour: 0.000000277778,
            btu: 0.00094782
        }
    }));

    // 9. Power Converter
    ToolRegistry.register(createUnitConverter({
        id: 'power-converter',
        name: 'Power Converter',
        description: 'Convert between different power units',
        icon: '💡',
        units: [
            { value: 'watt', label: 'Watts (W)' },
            { value: 'kilowatt', label: 'Kilowatts (kW)' },
            { value: 'horsepower', label: 'Horsepower (HP)' },
            { value: 'metric_horsepower', label: 'Metric Horsepower (PS)' },
            { value: 'btu_per_hour', label: 'BTU/hour' }
        ],
        conversions: {
            watt: 1,
            kilowatt: 0.001,
            horsepower: 0.00134102,
            metric_horsepower: 0.00135962,
            btu_per_hour: 3.41214
        }
    }));

    // 10. Data Storage Converter
    ToolRegistry.register(createUnitConverter({
        id: 'data-converter',
        name: 'Data Storage Converter',
        description: 'Convert between different data storage units',
        icon: '💾',
        units: [
            { value: 'byte', label: 'Bytes (B)' },
            { value: 'kilobyte', label: 'Kilobytes (KB)' },
            { value: 'megabyte', label: 'Megabytes (MB)' },
            { value: 'gigabyte', label: 'Gigabytes (GB)' },
            { value: 'terabyte', label: 'Terabytes (TB)' },
            { value: 'petabyte', label: 'Petabytes (PB)' },
            { value: 'bit', label: 'Bits' }
        ],
        conversions: {
            ...Calculations.conversions.data,
            petabyte: 1/(1024*1024*1024*1024*1024),
            bit: 8
        }
    }));

    // 11. Angle Converter
    ToolRegistry.register(createUnitConverter({
        id: 'angle-converter',
        name: 'Angle Converter',
        description: 'Convert between different angle units',
        icon: '📐',
        units: [
            { value: 'degree', label: 'Degrees (°)' },
            { value: 'radian', label: 'Radians (rad)' },
            { value: 'gradian', label: 'Gradians (gon)' },
            { value: 'turn', label: 'Turns' },
            { value: 'arcminute', label: 'Arcminutes (\')' },
            { value: 'arcsecond', label: 'Arcseconds (\")' }
        ],
        conversions: {
            degree: 1,
            radian: 0.0174533,
            gradian: 1.11111,
            turn: 0.00277778,
            arcminute: 60,
            arcsecond: 3600
        }
    }));

    // 12. Time Converter
    ToolRegistry.register(createUnitConverter({
        id: 'time-converter',
        name: 'Time Converter',
        description: 'Convert between different time units',
        icon: '⏰',
        units: [
            { value: 'second', label: 'Seconds' },
            { value: 'minute', label: 'Minutes' },
            { value: 'hour', label: 'Hours' },
            { value: 'day', label: 'Days' },
            { value: 'week', label: 'Weeks' },
            { value: 'month', label: 'Months (30 days)' },
            { value: 'year', label: 'Years (365 days)' }
        ],
        conversions: {
            second: 1,
            minute: 1/60,
            hour: 1/3600,
            day: 1/86400,
            week: 1/604800,
            month: 1/2592000, // 30 days
            year: 1/31536000 // 365 days
        }
    }));

    // 13. Fuel Economy Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'fuel-economy-converter',
        name: 'Fuel Economy Converter',
        description: 'Convert between MPG, L/100km, and other fuel economy units',
        category: 'converters',
        icon: '⛽',
        fromOptions: [
            { value: 'mpg_us', label: 'Miles/Gallon (US)' },
            { value: 'mpg_imperial', label: 'Miles/Gallon (Imperial)' },
            { value: 'l_per_100km', label: 'Liters/100km' },
            { value: 'km_per_liter', label: 'Kilometers/Liter' }
        ],
        convert: (value, from, to) => {
            const val = parseFloat(value);
            if (from === to) return val;
            
            // Convert everything to L/100km as base
            let baseValue;
            
            switch(from) {
                case 'mpg_us':
                    baseValue = 235.214583 / val;
                    break;
                case 'mpg_imperial':
                    baseValue = 282.481 / val;
                    break;
                case 'l_per_100km':
                    baseValue = val;
                    break;
                case 'km_per_liter':
                    baseValue = 100 / val;
                    break;
            }
            
            // Convert from base to target
            switch(to) {
                case 'mpg_us':
                    return 235.214583 / baseValue;
                case 'mpg_imperial':
                    return 282.481 / baseValue;
                case 'l_per_100km':
                    return baseValue;
                case 'km_per_liter':
                    return 100 / baseValue;
            }
        }
    }));

    // 14. Cooking Measurements Converter
    ToolRegistry.register(createUnitConverter({
        id: 'cooking-converter',
        name: 'Cooking Measurements Converter',
        description: 'Convert between cooking and baking measurements',
        icon: '🥄',
        units: [
            { value: 'cup', label: 'Cups' },
            { value: 'tablespoon', label: 'Tablespoons (tbsp)' },
            { value: 'teaspoon', label: 'Teaspoons (tsp)' },
            { value: 'fluid_ounce', label: 'Fluid Ounces (fl oz)' },
            { value: 'pint', label: 'Pints' },
            { value: 'quart', label: 'Quarts' },
            { value: 'gallon', label: 'Gallons' },
            { value: 'milliliter', label: 'Milliliters (mL)' },
            { value: 'liter', label: 'Liters (L)' }
        ],
        conversions: {
            cup: 1,
            tablespoon: 16,
            teaspoon: 48,
            fluid_ounce: 8,
            pint: 0.5,
            quart: 0.25,
            gallon: 0.0625,
            milliliter: 236.588,
            liter: 0.236588
        }
    }));

    // 15. Shoe Size Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'shoe-size-converter',
        name: 'Shoe Size Converter',
        description: 'Convert between US, UK, and EU shoe sizes',
        category: 'converters',
        icon: '👟',
        fromOptions: [
            { value: 'us_men', label: 'US Men\'s' },
            { value: 'us_women', label: 'US Women\'s' },
            { value: 'uk', label: 'UK' },
            { value: 'eu', label: 'EU' },
            { value: 'cm', label: 'Centimeters' }
        ],
        convert: (value, from, to) => {
            const val = parseFloat(value);
            if (from === to) return val;
            
            // Convert to centimeters first (base unit)
            let cm;
            
            switch(from) {
                case 'us_men':
                    cm = (val * 0.8467) + 22.947;
                    break;
                case 'us_women':
                    cm = (val * 0.8467) + 21.267;
                    break;
                case 'uk':
                    cm = (val * 0.8467) + 23.787;
                    break;
                case 'eu':
                    cm = (val * 0.667) + 12;
                    break;
                case 'cm':
                    cm = val;
                    break;
            }
            
            // Convert from cm to target
            switch(to) {
                case 'us_men':
                    return (cm - 22.947) / 0.8467;
                case 'us_women':
                    return (cm - 21.267) / 0.8467;
                case 'uk':
                    return (cm - 23.787) / 0.8467;
                case 'eu':
                    return (cm - 12) / 0.667;
                case 'cm':
                    return cm;
            }
        }
    }));

})();