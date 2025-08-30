// Color & Design Tools
(function() {
    'use strict';

    // 1. Color Palette Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'color-palette-generator',
        name: 'Color Palette Generator',
        description: 'Generate harmonious color palettes from base colors',
        category: 'color',
        icon: '🎨',
        fields: [
            {
                name: 'baseColor',
                label: 'Base Color',
                type: 'color',
                value: '#3498db'
            },
            {
                name: 'paletteType',
                label: 'Palette Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'monochromatic', label: 'Monochromatic' },
                    { value: 'analogous', label: 'Analogous' },
                    { value: 'complementary', label: 'Complementary' },
                    { value: 'triadic', label: 'Triadic' },
                    { value: 'tetradic', label: 'Tetradic' },
                    { value: 'split_complementary', label: 'Split Complementary' }
                ]
            },
            {
                name: 'colorCount',
                label: 'Number of Colors',
                type: 'number',
                value: '5',
                min: '3',
                max: '10'
            }
        ],
        generate: (data) => {
            const baseColor = data.baseColor;
            const paletteType = data.paletteType;
            const colorCount = parseInt(data.colorCount);

            // Convert hex to HSL
            const hexToHsl = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16) / 255;
                const g = parseInt(hex.slice(3, 5), 16) / 255;
                const b = parseInt(hex.slice(5, 7), 16) / 255;

                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                let h, s, l;

                l = (max + min) / 2;

                if (max === min) {
                    h = s = 0;
                } else {
                    const d = max - min;
                    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                    switch (max) {
                        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                        case g: h = (b - r) / d + 2; break;
                        case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                }

                return [h * 360, s * 100, l * 100];
            };

            // Convert HSL to hex
            const hslToHex = (h, s, l) => {
                h = ((h % 360) + 360) % 360;
                s = Math.max(0, Math.min(100, s)) / 100;
                l = Math.max(0, Math.min(100, l)) / 100;

                const c = (1 - Math.abs(2 * l - 1)) * s;
                const x = c * (1 - Math.abs((h / 60) % 2 - 1));
                const m = l - c / 2;
                let r, g, b;

                if (0 <= h && h < 60) { r = c; g = x; b = 0; }
                else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
                else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
                else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
                else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
                else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

                r = Math.round((r + m) * 255);
                g = Math.round((g + m) * 255);
                b = Math.round((b + m) * 255);

                return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            };

            const [baseH, baseS, baseL] = hexToHsl(baseColor);
            const colors = [];

            switch (paletteType) {
                case 'monochromatic':
                    for (let i = 0; i < colorCount; i++) {
                        const lightness = Math.max(10, Math.min(90, baseL + (i - Math.floor(colorCount / 2)) * 20));
                        colors.push(hslToHex(baseH, baseS, lightness));
                    }
                    break;

                case 'analogous':
                    for (let i = 0; i < colorCount; i++) {
                        const hue = baseH + (i - Math.floor(colorCount / 2)) * 30;
                        colors.push(hslToHex(hue, baseS, baseL));
                    }
                    break;

                case 'complementary':
                    colors.push(baseColor);
                    colors.push(hslToHex(baseH + 180, baseS, baseL));
                    for (let i = 2; i < colorCount; i++) {
                        const variation = i % 2 === 0 ? baseH : baseH + 180;
                        const lightness = baseL + (Math.floor(i / 2) * 20 - 20);
                        colors.push(hslToHex(variation, baseS, Math.max(10, Math.min(90, lightness))));
                    }
                    break;

                case 'triadic':
                    colors.push(baseColor);
                    colors.push(hslToHex(baseH + 120, baseS, baseL));
                    colors.push(hslToHex(baseH + 240, baseS, baseL));
                    for (let i = 3; i < colorCount; i++) {
                        const hueOffset = (i - 3) % 3;
                        const baseHueForVariation = baseH + hueOffset * 120;
                        const lightness = baseL + (Math.floor((i - 3) / 3) * 15 - 15);
                        colors.push(hslToHex(baseHueForVariation, baseS, Math.max(10, Math.min(90, lightness))));
                    }
                    break;

                case 'tetradic':
                    colors.push(baseColor);
                    colors.push(hslToHex(baseH + 90, baseS, baseL));
                    colors.push(hslToHex(baseH + 180, baseS, baseL));
                    colors.push(hslToHex(baseH + 270, baseS, baseL));
                    for (let i = 4; i < colorCount; i++) {
                        const hueOffset = (i - 4) % 4;
                        const baseHueForVariation = baseH + hueOffset * 90;
                        const lightness = baseL + (Math.floor((i - 4) / 4) * 15 - 15);
                        colors.push(hslToHex(baseHueForVariation, baseS, Math.max(10, Math.min(90, lightness))));
                    }
                    break;

                case 'split_complementary':
                    colors.push(baseColor);
                    colors.push(hslToHex(baseH + 150, baseS, baseL));
                    colors.push(hslToHex(baseH + 210, baseS, baseL));
                    for (let i = 3; i < colorCount; i++) {
                        const hues = [baseH, baseH + 150, baseH + 210];
                        const hueOffset = (i - 3) % 3;
                        const baseHueForVariation = hues[hueOffset];
                        const lightness = baseL + (Math.floor((i - 3) / 3) * 15 - 15);
                        colors.push(hslToHex(baseHueForVariation, baseS, Math.max(10, Math.min(90, lightness))));
                    }
                    break;
            }

            // Create color swatches HTML
            const swatchesHTML = colors.map((color, index) => {
                const [h, s, l] = hexToHsl(color);
                const rgb = `rgb(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)})`;
                const textColor = l > 50 ? '#000000' : '#ffffff';
                
                return `<div style="background: ${color}; color: ${textColor}; padding: 20px; text-align: center; font-weight: bold; border-radius: 8px; margin: 5px;">
                    Color ${index + 1}<br>
                    ${color.toUpperCase()}<br>
                    ${rgb}<br>
                    HSL(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)
                </div>`;
            }).join('');

            const cssVariables = colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n');
            const tailwindColors = colors.map((color, index) => `'color-${index + 1}': '${color}'`).join(',\n    ');

            return `COLOR PALETTE GENERATED

Base Color: ${baseColor.toUpperCase()}
Palette Type: ${paletteType.replace('_', ' ')}
Colors Generated: ${colors.length}

PALETTE PREVIEW:
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0;">
${swatchesHTML}
</div>

HEX VALUES:
${colors.map((color, i) => `${i + 1}. ${color.toUpperCase()}`).join('\n')}

CSS VARIABLES:
:root {
${cssVariables}
}

TAILWIND CONFIG:
colors: {
  theme: {
    ${tailwindColors}
  }
}

SCSS VARIABLES:
${colors.map((color, i) => `$color-${i + 1}: ${color};`).join('\n')}`;
        }
    }));

    // 2. Color Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'color-converter',
        name: 'Color Format Converter',
        description: 'Convert between different color formats (HEX, RGB, HSL, HSV)',
        category: 'color',
        icon: '🔄',
        fields: [
            {
                name: 'inputColor',
                label: 'Input Color',
                type: 'text',
                placeholder: '#3498db or rgb(52, 152, 219) or hsl(204, 70%, 53%)',
                required: true
            },
            {
                name: 'outputFormats',
                label: 'Output Formats',
                type: 'checkboxGroup',
                options: [
                    { value: 'hex', label: 'HEX', checked: true },
                    { value: 'rgb', label: 'RGB', checked: true },
                    { value: 'hsl', label: 'HSL', checked: true },
                    { value: 'hsv', label: 'HSV', checked: false },
                    { value: 'cmyk', label: 'CMYK', checked: false }
                ]
            }
        ],
        convert: (data) => {
            const inputColor = data.inputColor.trim();
            const outputFormats = data.outputFormats || ['hex', 'rgb', 'hsl'];

            // Parse different color formats
            const parseColor = (colorStr) => {
                colorStr = colorStr.toLowerCase().trim();
                
                // HEX
                if (colorStr.startsWith('#')) {
                    const hex = colorStr.slice(1);
                    if (hex.length === 3) {
                        const expandedHex = hex.split('').map(c => c + c).join('');
                        return {
                            r: parseInt(expandedHex.slice(0, 2), 16),
                            g: parseInt(expandedHex.slice(2, 4), 16),
                            b: parseInt(expandedHex.slice(4, 6), 16)
                        };
                    } else if (hex.length === 6) {
                        return {
                            r: parseInt(hex.slice(0, 2), 16),
                            g: parseInt(hex.slice(2, 4), 16),
                            b: parseInt(hex.slice(4, 6), 16)
                        };
                    }
                }
                
                // RGB
                const rgbMatch = colorStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                if (rgbMatch) {
                    return {
                        r: parseInt(rgbMatch[1]),
                        g: parseInt(rgbMatch[2]),
                        b: parseInt(rgbMatch[3])
                    };
                }
                
                // HSL
                const hslMatch = colorStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
                if (hslMatch) {
                    const h = parseInt(hslMatch[1]);
                    const s = parseInt(hslMatch[2]) / 100;
                    const l = parseInt(hslMatch[3]) / 100;
                    
                    // Convert HSL to RGB
                    const c = (1 - Math.abs(2 * l - 1)) * s;
                    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
                    const m = l - c / 2;
                    let r, g, b;

                    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
                    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
                    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
                    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
                    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
                    else { r = c; g = 0; b = x; }

                    return {
                        r: Math.round((r + m) * 255),
                        g: Math.round((g + m) * 255),
                        b: Math.round((b + m) * 255)
                    };
                }
                
                throw new Error('Invalid color format');
            };

            try {
                const rgb = parseColor(inputColor);
                const results = {};

                // Validate RGB values
                if (rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255) {
                    throw new Error('RGB values must be between 0 and 255');
                }

                // Convert to different formats
                if (outputFormats.includes('hex')) {
                    const toHex = (c) => c.toString(16).padStart(2, '0');
                    results.hex = `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
                }

                if (outputFormats.includes('rgb')) {
                    results.rgb = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                }

                if (outputFormats.includes('hsl')) {
                    const r = rgb.r / 255;
                    const g = rgb.g / 255;
                    const b = rgb.b / 255;

                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    let h, s, l;

                    l = (max + min) / 2;

                    if (max === min) {
                        h = s = 0;
                    } else {
                        const d = max - min;
                        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                        switch (max) {
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                    }

                    results.hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
                }

                if (outputFormats.includes('hsv')) {
                    const r = rgb.r / 255;
                    const g = rgb.g / 255;
                    const b = rgb.b / 255;

                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const delta = max - min;

                    let h = 0;
                    if (delta !== 0) {
                        if (max === r) h = ((g - b) / delta) % 6;
                        else if (max === g) h = (b - r) / delta + 2;
                        else h = (r - g) / delta + 4;
                        h *= 60;
                        if (h < 0) h += 360;
                    }

                    const s = max === 0 ? 0 : delta / max;
                    const v = max;

                    results.hsv = `hsv(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
                }

                if (outputFormats.includes('cmyk')) {
                    const r = rgb.r / 255;
                    const g = rgb.g / 255;
                    const b = rgb.b / 255;

                    const k = 1 - Math.max(r, g, b);
                    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
                    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
                    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

                    results.cmyk = `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
                }

                const colorSwatch = `<div style="background: ${results.hex || results.rgb}; width: 100px; height: 50px; border: 2px solid #ccc; border-radius: 8px; margin: 10px 0; display: inline-block;"></div>`;

                return `COLOR CONVERSION COMPLETE

Input: ${inputColor}

COLOR PREVIEW:
${colorSwatch}

CONVERTED FORMATS:
${Object.entries(results).map(([format, value]) => `${format.toUpperCase()}: ${value}`).join('\n')}

DECIMAL RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}

CSS USAGE EXAMPLES:
background-color: ${results.hex || results.rgb};
color: ${results.hex || results.rgb};
border: 1px solid ${results.hex || results.rgb};`;

            } catch (error) {
                throw new Error(`Color parsing error: ${error.message}`);
            }
        }
    }));

    // 3. Gradient Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'gradient-generator',
        name: 'CSS Gradient Generator',
        description: 'Create beautiful CSS gradients with live preview',
        category: 'color',
        icon: '🌈',
        fields: [
            {
                name: 'gradientType',
                label: 'Gradient Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'linear', label: 'Linear' },
                    { value: 'radial', label: 'Radial' },
                    { value: 'conic', label: 'Conic' }
                ]
            },
            {
                name: 'color1',
                label: 'First Color',
                type: 'color',
                value: '#ff6b6b'
            },
            {
                name: 'color2',
                label: 'Second Color',
                type: 'color',
                value: '#4ecdc4'
            },
            {
                name: 'color3',
                label: 'Third Color (Optional)',
                type: 'color',
                value: '#45b7d1'
            },
            {
                name: 'useThirdColor',
                label: 'Use third color',
                type: 'checkbox',
                value: false
            },
            {
                name: 'angle',
                label: 'Angle (degrees, for linear)',
                type: 'number',
                value: '45',
                min: '0',
                max: '360'
            },
            {
                name: 'radialShape',
                label: 'Radial Shape',
                type: 'select',
                options: [
                    { value: 'circle', label: 'Circle' },
                    { value: 'ellipse', label: 'Ellipse' }
                ],
                value: 'circle'
            },
            {
                name: 'radialPosition',
                label: 'Radial Position',
                type: 'select',
                options: [
                    { value: 'center', label: 'Center' },
                    { value: 'top', label: 'Top' },
                    { value: 'bottom', label: 'Bottom' },
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                    { value: 'top left', label: 'Top Left' },
                    { value: 'top right', label: 'Top Right' },
                    { value: 'bottom left', label: 'Bottom Left' },
                    { value: 'bottom right', label: 'Bottom Right' }
                ],
                value: 'center'
            }
        ],
        generate: (data) => {
            const gradientType = data.gradientType;
            const color1 = data.color1;
            const color2 = data.color2;
            const color3 = data.color3;
            const useThirdColor = data.useThirdColor;
            const angle = data.angle;
            const radialShape = data.radialShape;
            const radialPosition = data.radialPosition;

            let gradient;
            let colors = useThirdColor ? [color1, color2, color3] : [color1, color2];

            switch (gradientType) {
                case 'linear':
                    gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
                    break;
                case 'radial':
                    gradient = `radial-gradient(${radialShape} at ${radialPosition}, ${colors.join(', ')})`;
                    break;
                case 'conic':
                    gradient = `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
                    break;
            }

            const previewBox = `<div style="
                width: 300px; 
                height: 200px; 
                background: ${gradient}; 
                border: 2px solid #ccc; 
                border-radius: 12px; 
                margin: 20px 0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            "></div>`;

            // Generate variations
            const variations = [];
            if (gradientType === 'linear') {
                for (let i = 0; i < 4; i++) {
                    const varAngle = (parseInt(angle) + i * 90) % 360;
                    variations.push({
                        name: `${varAngle}° variation`,
                        css: `linear-gradient(${varAngle}deg, ${colors.join(', ')})`
                    });
                }
            } else if (gradientType === 'radial') {
                const positions = ['center', 'top left', 'top right', 'bottom center'];
                positions.forEach((pos, i) => {
                    variations.push({
                        name: `${pos} position`,
                        css: `radial-gradient(${radialShape} at ${pos}, ${colors.join(', ')})`
                    });
                });
            }

            const variationsHTML = variations.map(v => 
                `<div style="margin: 10px 0;">
                    <strong>${v.name}:</strong><br>
                    <code style="background: #f5f5f5; padding: 5px; border-radius: 3px; font-size: 12px;">${v.css}</code>
                    <div style="width: 150px; height: 50px; background: ${v.css}; border: 1px solid #ccc; border-radius: 6px; margin: 5px 0; display: inline-block;"></div>
                </div>`
            ).join('');

            return `GRADIENT GENERATED

Type: ${gradientType} gradient
Colors: ${colors.join(', ')}
${gradientType === 'linear' ? `Angle: ${angle}°` : ''}
${gradientType === 'radial' ? `Shape: ${radialShape}, Position: ${radialPosition}` : ''}

LIVE PREVIEW:
${previewBox}

CSS CODE:
background: ${gradient};

FULL CSS PROPERTY:
.gradient-element {
  background: ${gradient};
  /* Fallback for older browsers */
  background: ${color1};
}

SCSS/SASS:
$gradient: ${gradient};
.element {
  background: $gradient;
}

VARIATIONS:
${variationsHTML}

USAGE EXAMPLES:
• Hero sections: Apply to full-width containers
• Buttons: Create engaging call-to-action elements  
• Cards: Add depth with subtle gradients
• Text overlays: Use as background for better readability`;
        }
    }));

    // 4. Color Contrast Checker
    ToolRegistry.register(ToolTemplates.createCalculator({
        id: 'color-contrast-checker',
        name: 'Color Contrast Checker',
        description: 'Check color contrast ratio for accessibility (WCAG compliance)',
        category: 'color',
        icon: '🔍',
        fields: [
            {
                name: 'foregroundColor',
                label: 'Foreground Color (Text)',
                type: 'color',
                value: '#333333',
                required: true
            },
            {
                name: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                value: '#ffffff',
                required: true
            }
        ],
        calculate: (data) => {
            const foregroundColor = data.foregroundColor;
            const backgroundColor = data.backgroundColor;

            // Convert hex to RGB
            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return [r, g, b];
            };

            // Calculate relative luminance
            const getLuminance = (r, g, b) => {
                const [rs, gs, bs] = [r, g, b].map(c => {
                    c = c / 255;
                    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                });
                return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
            };

            // Calculate contrast ratio
            const getContrastRatio = (color1, color2) => {
                const [r1, g1, b1] = hexToRgb(color1);
                const [r2, g2, b2] = hexToRgb(color2);
                
                const lum1 = getLuminance(r1, g1, b1);
                const lum2 = getLuminance(r2, g2, b2);
                
                const brightest = Math.max(lum1, lum2);
                const darkest = Math.min(lum1, lum2);
                
                return (brightest + 0.05) / (darkest + 0.05);
            };

            const contrastRatio = getContrastRatio(foregroundColor, backgroundColor);

            // WCAG compliance levels
            const normalTextAA = contrastRatio >= 4.5;
            const normalTextAAA = contrastRatio >= 7;
            const largeTextAA = contrastRatio >= 3;
            const largeTextAAA = contrastRatio >= 4.5;

            const getGrade = () => {
                if (normalTextAAA) return 'AAA';
                if (normalTextAA) return 'AA';
                if (largeTextAA) return 'AA Large';
                return 'Fail';
            };

            // Create visual preview
            const previewBox = `<div style="
                background-color: ${backgroundColor}; 
                color: ${foregroundColor}; 
                padding: 20px; 
                border: 2px solid #ccc; 
                border-radius: 8px; 
                margin: 15px 0;
                font-family: Arial, sans-serif;
            ">
                <h3 style="margin: 0 0 10px 0;">Sample Text Preview</h3>
                <p style="margin: 0; font-size: 16px;">This is how normal text (16px) would look with these colors.</p>
                <p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">This is large text (18px bold) sample.</p>
            </div>`;

            return `COLOR CONTRAST ANALYSIS

Foreground: ${foregroundColor.toUpperCase()}
Background: ${backgroundColor.toUpperCase()}

CONTRAST RATIO: ${contrastRatio.toFixed(2)}:1

WCAG COMPLIANCE:
Overall Grade: ${getGrade()}

Normal Text (< 18px):
• AA Level (4.5:1): ${normalTextAA ? '✅ Pass' : '❌ Fail'}
• AAA Level (7:1): ${normalTextAAA ? '✅ Pass' : '❌ Fail'}

Large Text (≥ 18px or 14px bold):
• AA Level (3:1): ${largeTextAA ? '✅ Pass' : '❌ Fail'}
• AAA Level (4.5:1): ${largeTextAAA ? '✅ Pass' : '❌ Fail'}

VISUAL PREVIEW:
${previewBox}

RECOMMENDATIONS:
${contrastRatio < 3 ? '⚠️ This combination has very poor contrast and should not be used.' : ''}
${contrastRatio >= 3 && contrastRatio < 4.5 ? '⚠️ Only suitable for large text (18px+ or 14px+ bold).' : ''}
${contrastRatio >= 4.5 && contrastRatio < 7 ? '✅ Good for normal text, meets AA standards.' : ''}
${contrastRatio >= 7 ? '🌟 Excellent contrast, meets AAA standards for all text sizes.' : ''}

ACCESSIBILITY GUIDELINES:
• AA: Minimum standard for most content
• AAA: Enhanced standard for critical content
• Large text: 18px+ regular or 14px+ bold`;
        }
    }));

    // 5. Color Blindness Simulator
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'color-blindness-simulator',
        name: 'Color Blindness Simulator',
        description: 'Simulate how colors appear to people with color vision deficiencies',
        category: 'color',
        icon: '👁️',
        fields: [
            {
                name: 'inputColor',
                label: 'Input Color',
                type: 'color',
                value: '#3498db',
                required: true
            },
            {
                name: 'simulationTypes',
                label: 'Color Vision Deficiency Types',
                type: 'checkboxGroup',
                options: [
                    { value: 'protanopia', label: 'Protanopia (Red-blind)', checked: true },
                    { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)', checked: true },
                    { value: 'tritanopia', label: 'Tritanopia (Blue-blind)', checked: true },
                    { value: 'protanomaly', label: 'Protanomaly (Red-weak)', checked: false },
                    { value: 'deuteranomaly', label: 'Deuteranomaly (Green-weak)', checked: false },
                    { value: 'tritanomaly', label: 'Tritanomaly (Blue-weak)', checked: false },
                    { value: 'achromatopsia', label: 'Achromatopsia (No color)', checked: false },
                    { value: 'achromatomaly', label: 'Achromatomaly (Blue cone monochromacy)', checked: false }
                ]
            }
        ],
        convert: (data) => {
            const inputColor = data.inputColor;
            const simulationTypes = data.simulationTypes || ['protanopia', 'deuteranopia', 'tritanopia'];

            // Convert hex to RGB
            const hexToRgb = (hex) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(4, 7), 16);
                return [r, g, b];
            };

            // Convert RGB to hex
            const rgbToHex = (r, g, b) => {
                const toHex = (c) => {
                    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                };
                return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            };

            const [r, g, b] = hexToRgb(inputColor);

            // Color blindness simulation matrices
            const simulate = (type, r, g, b) => {
                let newR, newG, newB;

                switch (type) {
                    case 'protanopia': // No red cones
                        newR = 0.567 * r + 0.433 * g;
                        newG = 0.558 * r + 0.442 * g;
                        newB = 0.242 * g + 0.758 * b;
                        break;
                    case 'protanomaly': // Red-weak
                        newR = 0.817 * r + 0.183 * g;
                        newG = 0.333 * r + 0.667 * g;
                        newB = 0.125 * g + 0.875 * b;
                        break;
                    case 'deuteranopia': // No green cones  
                        newR = 0.625 * r + 0.375 * g;
                        newG = 0.7 * r + 0.3 * g;
                        newB = 0.3 * g + 0.7 * b;
                        break;
                    case 'deuteranomaly': // Green-weak
                        newR = 0.8 * r + 0.2 * g;
                        newG = 0.258 * r + 0.742 * g;
                        newB = 0.142 * g + 0.858 * b;
                        break;
                    case 'tritanopia': // No blue cones
                        newR = 0.95 * r + 0.05 * g;
                        newG = 0.433 * g + 0.567 * b;
                        newB = 0.475 * g + 0.525 * b;
                        break;
                    case 'tritanomaly': // Blue-weak
                        newR = 0.967 * r + 0.033 * g;
                        newG = 0.733 * g + 0.267 * b;
                        newB = 0.183 * g + 0.817 * b;
                        break;
                    case 'achromatopsia': // Complete color blindness
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        newR = newG = newB = gray;
                        break;
                    case 'achromatomaly': // Blue cone monochromacy
                        const blueGray = 0.618 * r + 0.320 * g + 0.062 * b;
                        newR = newG = newB = blueGray;
                        break;
                    default:
                        newR = r; newG = g; newB = b;
                }

                return rgbToHex(newR, newG, newB);
            };

            const results = {};
            const descriptions = {
                'protanopia': 'Red-blind (1% of males)',
                'deuteranopia': 'Green-blind (1% of males)', 
                'tritanopia': 'Blue-blind (very rare)',
                'protanomaly': 'Red-weak (1% of males)',
                'deuteranomaly': 'Green-weak (5% of males)',
                'tritanomaly': 'Blue-weak (very rare)',
                'achromatopsia': 'Complete color blindness (very rare)',
                'achromatomaly': 'Blue cone monochromacy (very rare)'
            };

            simulationTypes.forEach(type => {
                results[type] = simulate(type, r, g, b);
            });

            const originalSwatch = `<div style="background: ${inputColor}; width: 80px; height: 60px; border: 2px solid #ccc; border-radius: 8px; display: inline-block; margin: 5px; text-align: center; line-height: 60px; color: white; font-weight: bold; font-size: 12px;">Original</div>`;

            const simulationSwatches = Object.entries(results).map(([type, color]) => 
                `<div style="background: ${color}; width: 80px; height: 60px; border: 2px solid #ccc; border-radius: 8px; display: inline-block; margin: 5px; text-align: center; line-height: 60px; color: white; font-weight: bold; font-size: 10px; text-shadow: 1px 1px 1px rgba(0,0,0,0.8);">${type}</div>`
            ).join('');

            return `COLOR BLINDNESS SIMULATION

Original Color: ${inputColor.toUpperCase()}
RGB: rgb(${r}, ${g}, ${b})

VISUAL COMPARISON:
<div style="margin: 20px 0;">
${originalSwatch}
${simulationSwatches}
</div>

SIMULATION RESULTS:
${Object.entries(results).map(([type, color]) => 
    `${descriptions[type]}:
  • Hex: ${color.toUpperCase()}
  • How it appears: ${color === inputColor ? 'No change' : 'Different from original'}
`).join('\n')}

ACCESSIBILITY INSIGHTS:
• ~8% of men and ~0.5% of women have some form of color vision deficiency
• Deuteranomaly (green-weak) is the most common type
• Never rely solely on color to convey important information
• Use patterns, textures, or labels alongside color coding

DESIGN RECOMMENDATIONS:
${results.protanopia === results.deuteranopia ? '⚠️ This color may be confusing for red-green color blind users' : ''}
• Test your color palette with these simulations
• Ensure sufficient contrast ratios
• Use multiple visual cues (icons, patterns, text)
• Consider colorblind-friendly palettes`;
        }
    }));

})();