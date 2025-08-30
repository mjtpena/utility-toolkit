// Additional Design Tools
(function() {
    'use strict';

    // 6. CSS Box Shadow Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'css-box-shadow-generator',
        name: 'CSS Box Shadow Generator',
        description: 'Create custom CSS box shadows with live preview',
        category: 'color',
        icon: '📦',
        fields: [
            {
                name: 'horizontalOffset',
                label: 'Horizontal Offset (px)',
                type: 'number',
                value: '0',
                min: '-100',
                max: '100'
            },
            {
                name: 'verticalOffset',
                label: 'Vertical Offset (px)',
                type: 'number',
                value: '4',
                min: '-100',
                max: '100'
            },
            {
                name: 'blurRadius',
                label: 'Blur Radius (px)',
                type: 'number',
                value: '8',
                min: '0',
                max: '100'
            },
            {
                name: 'spreadRadius',
                label: 'Spread Radius (px)',
                type: 'number',
                value: '0',
                min: '-50',
                max: '50'
            },
            {
                name: 'shadowColor',
                label: 'Shadow Color',
                type: 'color',
                value: '#000000'
            },
            {
                name: 'shadowOpacity',
                label: 'Shadow Opacity (%)',
                type: 'number',
                value: '20',
                min: '0',
                max: '100'
            },
            {
                name: 'inset',
                label: 'Inset Shadow',
                type: 'checkbox',
                value: false
            },
            {
                name: 'multiShadow',
                label: 'Add Second Shadow',
                type: 'checkbox',
                value: false
            }
        ],
        generate: (data) => {
            const h1 = parseInt(data.horizontalOffset);
            const v1 = parseInt(data.verticalOffset);
            const blur1 = parseInt(data.blurRadius);
            const spread1 = parseInt(data.spreadRadius);
            const color1 = data.shadowColor;
            const opacity1 = parseInt(data.shadowOpacity) / 100;
            const inset1 = data.inset;
            const multiShadow = data.multiShadow;

            // Convert hex to rgba
            const hexToRgba = (hex, alpha) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${alpha})`;
            };

            const shadow1 = `${inset1 ? 'inset ' : ''}${h1}px ${v1}px ${blur1}px ${spread1}px ${hexToRgba(color1, opacity1)}`;
            
            let finalShadow = shadow1;
            
            if (multiShadow) {
                // Create a complementary second shadow
                const h2 = h1 === 0 ? 0 : -Math.floor(h1 / 2);
                const v2 = v1 === 0 ? 0 : Math.floor(v1 / 2);
                const blur2 = Math.floor(blur1 / 2);
                const spread2 = 0;
                const opacity2 = opacity1 * 0.5;
                const shadow2 = `${inset1 ? 'inset ' : ''}${h2}px ${v2}px ${blur2}px ${spread2}px ${hexToRgba(color1, opacity2)}`;
                finalShadow = `${shadow1}, ${shadow2}`;
            }

            const previewBox = `<div style="
                width: 200px;
                height: 120px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 20px auto;
                border-radius: 12px;
                box-shadow: ${finalShadow};
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-family: Arial, sans-serif;
            ">Shadow Preview</div>`;

            // Generate preset variations
            const presets = [
                { name: 'Subtle', shadow: '0 2px 4px rgba(0,0,0,0.1)' },
                { name: 'Medium', shadow: '0 4px 8px rgba(0,0,0,0.15)' },
                { name: 'Strong', shadow: '0 8px 16px rgba(0,0,0,0.2)' },
                { name: 'Floating', shadow: '0 12px 24px rgba(0,0,0,0.15)' },
                { name: 'Pressed', shadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' },
                { name: 'Neon', shadow: '0 0 20px rgba(0, 255, 255, 0.5)' }
            ];

            const presetsHTML = presets.map(preset => 
                `<div style="margin: 10px 0;">
                    <strong>${preset.name}:</strong><br>
                    <code style="background: #f5f5f5; padding: 5px; border-radius: 3px; font-size: 12px;">${preset.shadow}</code>
                    <div style="width: 100px; height: 60px; background: #4a90e2; margin: 5px 0; border-radius: 8px; box-shadow: ${preset.shadow}; display: inline-block; margin-left: 10px;"></div>
                </div>`
            ).join('');

            return `BOX SHADOW GENERATED

Configuration:
• Horizontal: ${h1}px
• Vertical: ${v1}px  
• Blur: ${blur1}px
• Spread: ${spread1}px
• Color: ${color1.toUpperCase()}
• Opacity: ${Math.round(opacity1 * 100)}%
• Type: ${inset1 ? 'Inset' : 'Drop'} Shadow
• Multiple: ${multiShadow ? 'Yes' : 'No'}

LIVE PREVIEW:
${previewBox}

CSS CODE:
box-shadow: ${finalShadow};

COMPLETE CSS CLASS:
.shadow-element {
    box-shadow: ${finalShadow};
    /* Optional: Add transition for hover effects */
    transition: box-shadow 0.3s ease;
}

.shadow-element:hover {
    box-shadow: ${finalShadow.replace(/rgba\((\d+,\s*\d+,\s*\d+),\s*[\d.]+\)/g, (match, rgb) => `rgba(${rgb}, ${opacity1 * 1.5 > 1 ? 1 : opacity1 * 1.5})`)};
}

TAILWIND CSS:
/* Custom shadow in tailwind.config.js */
boxShadow: {
    'custom': '${finalShadow}'
}
/* Usage: shadow-custom */

PRESET EXAMPLES:
${presetsHTML}

USAGE TIPS:
• Subtle shadows work best for cards and containers
• Inset shadows create pressed/recessed effects
• Multiple shadows add depth and realism
• Consider the light source direction for consistency`;
        }
    }));

    // 7. Typography Scale Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'typography-scale-generator',
        name: 'Typography Scale Generator',
        description: 'Generate harmonious typography scales for web design',
        category: 'color',
        icon: '📝',
        fields: [
            {
                name: 'baseSize',
                label: 'Base Font Size (px)',
                type: 'number',
                value: '16',
                min: '12',
                max: '24'
            },
            {
                name: 'scaleRatio',
                label: 'Scale Ratio',
                type: 'select',
                required: true,
                options: [
                    { value: '1.125', label: 'Major Second (1.125)' },
                    { value: '1.200', label: 'Minor Third (1.200)' },
                    { value: '1.250', label: 'Major Third (1.250)' },
                    { value: '1.333', label: 'Perfect Fourth (1.333)' },
                    { value: '1.414', label: 'Augmented Fourth (1.414)' },
                    { value: '1.500', label: 'Perfect Fifth (1.500)' },
                    { value: '1.618', label: 'Golden Ratio (1.618)' }
                ]
            },
            {
                name: 'steps',
                label: 'Number of Steps',
                type: 'number',
                value: '6',
                min: '4',
                max: '10'
            },
            {
                name: 'generateCSS',
                label: 'Generate CSS Classes',
                type: 'checkbox',
                value: true
            }
        ],
        generate: (data) => {
            const baseSize = parseFloat(data.baseSize);
            const ratio = parseFloat(data.scaleRatio);
            const steps = parseInt(data.steps);
            const generateCSS = data.generateCSS;

            const scale = [];
            const labels = ['xs', 'sm', 'base', 'lg', 'xl', 'xxl', 'xxxl', 'xxxxl', 'xxxxxl', 'xxxxxxl'];
            
            // Generate scale starting from base size
            for (let i = 0; i < steps; i++) {
                const size = baseSize * Math.pow(ratio, i - Math.floor(steps / 2));
                scale.push({
                    label: labels[i] || `step-${i}`,
                    size: Math.round(size * 100) / 100,
                    rem: Math.round((size / 16) * 1000) / 1000
                });
            }

            // Calculate line heights (usually 1.2-1.6x font size)
            const calculateLineHeight = (fontSize) => {
                if (fontSize <= 14) return 1.6;
                if (fontSize <= 18) return 1.5;
                if (fontSize <= 24) return 1.4;
                if (fontSize <= 32) return 1.3;
                return 1.2;
            };

            const previewHTML = scale.map((step, index) => {
                const lineHeight = calculateLineHeight(step.size);
                return `<div style="
                    font-size: ${step.size}px; 
                    line-height: ${lineHeight}; 
                    margin: 10px 0; 
                    padding: 5px;
                    border-left: 3px solid #3498db;
                    background: #f8f9fa;
                ">
                    <strong>${step.label.toUpperCase()}</strong> - ${step.size}px / ${step.rem}rem - The quick brown fox jumps
                </div>`;
            }).join('');

            let cssOutput = '';
            if (generateCSS) {
                const cssClasses = scale.map(step => {
                    const lineHeight = calculateLineHeight(step.size);
                    return `.text-${step.label} {
    font-size: ${step.rem}rem;
    line-height: ${lineHeight};
}`;
                }).join('\n\n');

                const scssVariables = scale.map(step => 
                    `$font-size-${step.label}: ${step.rem}rem;`
                ).join('\n');

                const tailwindConfig = scale.map(step =>
                    `'${step.label}': '${step.rem}rem'`
                ).join(',\n        ');

                cssOutput = `
CSS CLASSES:
${cssClasses}

SCSS VARIABLES:
${scssVariables}

TAILWIND CONFIG:
fontSize: {
    ${tailwindConfig}
}`;
            }

            // Generate responsive suggestions
            const responsiveBreakpoints = [
                { name: 'Mobile', multiplier: 0.9 },
                { name: 'Tablet', multiplier: 1.0 },
                { name: 'Desktop', multiplier: 1.1 }
            ];

            const responsiveHTML = responsiveBreakpoints.map(bp => {
                const adjustedScale = scale.map(step => ({
                    ...step,
                    size: Math.round(step.size * bp.multiplier * 100) / 100
                }));
                return `<strong>${bp.name} (${bp.multiplier}x):</strong><br>
${adjustedScale.map(step => `${step.label}: ${step.size}px`).join(' • ')}`;
            }).join('<br><br>');

            return `TYPOGRAPHY SCALE GENERATED

Base Size: ${baseSize}px
Scale Ratio: ${ratio} (${data.scaleRatio === '1.618' ? 'Golden Ratio' : 'Musical Interval'})
Steps: ${steps}

SCALE PREVIEW:
${previewHTML}

SCALE BREAKDOWN:
${scale.map((step, i) => 
    `${step.label.toUpperCase()}: ${step.size}px (${step.rem}rem) - Line Height: ${calculateLineHeight(step.size)}`
).join('\n')}

RECOMMENDED USAGE:
• ${scale[0]?.label || 'xs'}: Small text, captions, footnotes
• ${scale[1]?.label || 'sm'}: Small body text, labels
• ${scale[2]?.label || 'base'}: Body text, paragraphs
• ${scale[3]?.label || 'lg'}: Large body text, subheadings
• ${scale[4]?.label || 'xl'}: Section headings (H3)
• ${scale[5]?.label || 'xxl'}: Page headings (H2, H1)

${generateCSS ? cssOutput : ''}

RESPONSIVE SCALING:
${responsiveHTML}

ACCESSIBILITY NOTES:
• Minimum font size: 16px for body text on mobile
• Line height should be at least 1.4 for readability
• Ensure sufficient contrast ratios
• Test with zoom levels up to 200%`;
        }
    }));

    // 8. Layout Grid Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'layout-grid-generator',
        name: 'CSS Grid Layout Generator',
        description: 'Generate CSS Grid layouts with visual preview',
        category: 'color',
        icon: '📐',
        fields: [
            {
                name: 'columns',
                label: 'Number of Columns',
                type: 'number',
                value: '12',
                min: '1',
                max: '24'
            },
            {
                name: 'columnUnit',
                label: 'Column Unit',
                type: 'select',
                options: [
                    { value: 'fr', label: 'Fractional (fr)' },
                    { value: 'px', label: 'Pixels (px)' },
                    { value: 'rem', label: 'REM units' },
                    { value: 'auto', label: 'Auto' },
                    { value: 'minmax', label: 'Minmax(200px, 1fr)' }
                ],
                value: 'fr'
            },
            {
                name: 'gapSize',
                label: 'Gap Size',
                type: 'number',
                value: '20',
                min: '0',
                max: '100'
            },
            {
                name: 'gapUnit',
                label: 'Gap Unit',
                type: 'select',
                options: [
                    { value: 'px', label: 'Pixels (px)' },
                    { value: 'rem', label: 'REM units' },
                    { value: 'em', label: 'EM units' },
                    { value: '%', label: 'Percentage (%)' }
                ],
                value: 'px'
            },
            {
                name: 'autoRows',
                label: 'Auto Row Height',
                type: 'text',
                value: 'minmax(100px, auto)',
                placeholder: 'e.g., 200px, auto, minmax(100px, auto)'
            }
        ],
        generate: (data) => {
            const columns = parseInt(data.columns);
            const columnUnit = data.columnUnit;
            const gapSize = data.gapSize;
            const gapUnit = data.gapUnit;
            const autoRows = data.autoRows;

            // Generate grid-template-columns value
            let gridColumns;
            switch (columnUnit) {
                case 'fr':
                    gridColumns = `repeat(${columns}, 1fr)`;
                    break;
                case 'px':
                    gridColumns = `repeat(${columns}, 200px)`;
                    break;
                case 'rem':
                    gridColumns = `repeat(${columns}, 15rem)`;
                    break;
                case 'auto':
                    gridColumns = `repeat(${columns}, auto)`;
                    break;
                case 'minmax':
                    gridColumns = `repeat(${columns}, minmax(200px, 1fr))`;
                    break;
                default:
                    gridColumns = `repeat(${columns}, 1fr)`;
            }

            const gap = `${gapSize}${gapUnit}`;

            // Create visual preview
            const gridItems = Array.from({length: Math.min(columns * 2, 24)}, (_, i) => 
                `<div style="
                    background: linear-gradient(135deg, #667eea, #764ba2); 
                    padding: 15px; 
                    border-radius: 8px; 
                    color: white; 
                    text-align: center; 
                    font-weight: bold;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 60px;
                ">${i + 1}</div>`
            ).join('');

            const previewGrid = `<div style="
                display: grid;
                grid-template-columns: ${gridColumns};
                grid-auto-rows: ${autoRows};
                gap: ${gap};
                padding: 20px;
                border: 2px dashed #ccc;
                border-radius: 8px;
                margin: 20px 0;
                background: #f8f9fa;
            ">
                ${gridItems}
            </div>`;

            // Generate responsive variations
            const responsiveVariations = [
                {
                    breakpoint: 'mobile',
                    maxWidth: '768px',
                    columns: Math.max(1, Math.floor(columns / 4))
                },
                {
                    breakpoint: 'tablet', 
                    maxWidth: '1024px',
                    columns: Math.max(2, Math.floor(columns / 2))
                },
                {
                    breakpoint: 'desktop',
                    maxWidth: 'none',
                    columns: columns
                }
            ];

            const responsiveCSS = responsiveVariations.map(variant => {
                const responsiveColumns = variant.breakpoint === 'desktop' ? 
                    gridColumns : 
                    `repeat(${variant.columns}, 1fr)`;
                
                return variant.breakpoint === 'desktop' ? '' : `
@media (max-width: ${variant.maxWidth}) {
    .grid-container {
        grid-template-columns: ${responsiveColumns};
    }
}`;
            }).filter(Boolean).join('\n');

            // Common grid patterns
            const patterns = [
                {
                    name: 'Holy Grail Layout',
                    areas: `"header header header"
                "sidebar main aside"  
                "footer footer footer"`,
                    template: '200px 1fr 200px / auto 1fr auto'
                },
                {
                    name: 'Card Layout',
                    areas: '',
                    template: 'repeat(auto-fit, minmax(300px, 1fr))'
                },
                {
                    name: 'Dashboard Layout',
                    areas: `"nav nav nav nav"
                "sidebar content content widget"`,
                    template: '200px 1fr 1fr 200px / auto 1fr'
                }
            ];

            const patternsHTML = patterns.map(pattern => `
<div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
    <strong>${pattern.name}:</strong><br>
    <code style="font-size: 12px;">grid-template: ${pattern.template}</code>
    ${pattern.areas ? `<br><code style="font-size: 12px;">grid-template-areas: ${pattern.areas}</code>` : ''}
</div>`).join('');

            return `CSS GRID LAYOUT GENERATED

Configuration:
• Columns: ${columns}
• Column sizing: ${columnUnit}
• Gap: ${gap}
• Row height: ${autoRows}

VISUAL PREVIEW:
${previewGrid}

CSS CODE:
.grid-container {
    display: grid;
    grid-template-columns: ${gridColumns};
    grid-auto-rows: ${autoRows};
    gap: ${gap};
}

COMPLETE RESPONSIVE CSS:
.grid-container {
    display: grid;
    grid-template-columns: ${gridColumns};
    grid-auto-rows: ${autoRows};
    gap: ${gap};
}
${responsiveCSS}

HTML STRUCTURE:
<div class="grid-container">
    <div class="grid-item">Item 1</div>
    <div class="grid-item">Item 2</div>
    <!-- Add more items as needed -->
</div>

GRID UTILITIES:
/* Span multiple columns */
.span-2 { grid-column: span 2; }
.span-3 { grid-column: span 3; }
.span-full { grid-column: 1 / -1; }

/* Row spanning */
.row-span-2 { grid-row: span 2; }

/* Positioning */
.start-1 { grid-column-start: 1; }
.start-2 { grid-column-start: 2; }

COMMON PATTERNS:
${patternsHTML}

BROWSER SUPPORT:
✅ Modern browsers (95%+ support)
❌ IE11 (partial support, use with autoprefixer)

ACCESSIBILITY TIPS:
• Use logical source order in HTML
• Consider focus management for keyboard users
• Test with screen readers
• Ensure grid items have proper semantic markup`;
        }
    }));

    // 9. CSS Animation Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'css-animation-generator',
        name: 'CSS Animation Generator',
        description: 'Create custom CSS animations and transitions',
        category: 'color',
        icon: '🎬',
        fields: [
            {
                name: 'animationType',
                label: 'Animation Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'fade', label: 'Fade In/Out' },
                    { value: 'slide', label: 'Slide' },
                    { value: 'scale', label: 'Scale' },
                    { value: 'rotate', label: 'Rotate' },
                    { value: 'bounce', label: 'Bounce' },
                    { value: 'pulse', label: 'Pulse' },
                    { value: 'shake', label: 'Shake' },
                    { value: 'custom', label: 'Custom Keyframes' }
                ]
            },
            {
                name: 'duration',
                label: 'Duration (seconds)',
                type: 'number',
                value: '1',
                min: '0.1',
                max: '10',
                step: '0.1'
            },
            {
                name: 'timing',
                label: 'Timing Function',
                type: 'select',
                options: [
                    { value: 'ease', label: 'Ease' },
                    { value: 'ease-in', label: 'Ease In' },
                    { value: 'ease-out', label: 'Ease Out' },
                    { value: 'ease-in-out', label: 'Ease In Out' },
                    { value: 'linear', label: 'Linear' },
                    { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' }
                ],
                value: 'ease-in-out'
            },
            {
                name: 'delay',
                label: 'Delay (seconds)',
                type: 'number',
                value: '0',
                min: '0',
                max: '5',
                step: '0.1'
            },
            {
                name: 'iterations',
                label: 'Iterations',
                type: 'select',
                options: [
                    { value: '1', label: 'Once' },
                    { value: '2', label: 'Twice' },
                    { value: '3', label: 'Three times' },
                    { value: 'infinite', label: 'Infinite' }
                ],
                value: '1'
            },
            {
                name: 'direction',
                label: 'Direction',
                type: 'select',
                options: [
                    { value: 'normal', label: 'Normal' },
                    { value: 'reverse', label: 'Reverse' },
                    { value: 'alternate', label: 'Alternate' },
                    { value: 'alternate-reverse', label: 'Alternate Reverse' }
                ],
                value: 'normal'
            }
        ],
        generate: (data) => {
            const animationType = data.animationType;
            const duration = data.duration;
            const timing = data.timing;
            const delay = data.delay;
            const iterations = data.iterations;
            const direction = data.direction;

            // Generate keyframes based on animation type
            let keyframes = '';
            let transformOrigin = 'center center';

            switch (animationType) {
                case 'fade':
                    keyframes = `@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}`;
                    break;
                case 'slide':
                    keyframes = `@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}`;
                    break;
                case 'scale':
                    keyframes = `@keyframes scaleIn {
    from { transform: scale(0); }
    to { transform: scale(1); }
}`;
                    break;
                case 'rotate':
                    keyframes = `@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;
                    break;
                case 'bounce':
                    keyframes = `@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translate3d(0,0,0);
    }
    40%, 43% {
        transform: translate3d(0,-30px,0);
    }
    70% {
        transform: translate3d(0,-15px,0);
    }
    90% {
        transform: translate3d(0,-4px,0);
    }
}`;
                    break;
                case 'pulse':
                    keyframes = `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}`;
                    break;
                case 'shake':
                    keyframes = `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
}`;
                    break;
                case 'custom':
                    keyframes = `@keyframes customAnimation {
    0% { 
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
    50% { 
        transform: scale(1.2) rotate(180deg);
        opacity: 0.7;
    }
    100% { 
        transform: scale(1) rotate(360deg);
        opacity: 1;
    }
}`;
                    break;
            }

            const animationName = animationType === 'custom' ? 'customAnimation' : 
                                  animationType === 'fade' ? 'fadeIn' :
                                  animationType === 'slide' ? 'slideIn' :
                                  animationType === 'scale' ? 'scaleIn' :
                                  animationType;

            const animationProperty = `animation: ${animationName} ${duration}s ${timing} ${delay}s ${iterations} ${direction} both;`;

            // Create preview
            const previewBox = `<div style="
                width: 100px;
                height: 100px;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                margin: 30px auto;
                border-radius: 12px;
                ${animationProperty}
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            ">DEMO</div>`;

            // Generate utility classes
            const utilityClasses = `
/* Animation utilities */
.animate-${animationType} {
    ${animationProperty}
}

.animate-${animationType}:hover {
    animation-play-state: paused;
}

/* Animation controls */
.animation-paused { animation-play-state: paused; }
.animation-running { animation-play-state: running; }

/* Timing variations */
.animation-fast { animation-duration: 0.5s; }
.animation-slow { animation-duration: 2s; }

/* Delay variations */
.animation-delay-sm { animation-delay: 0.2s; }
.animation-delay-md { animation-delay: 0.5s; }
.animation-delay-lg { animation-delay: 1s; }`;

            // JavaScript controls
            const jsControls = `
// JavaScript animation controls
const element = document.querySelector('.animate-${animationType}');

// Play animation
function playAnimation() {
    element.style.animationPlayState = 'running';
}

// Pause animation
function pauseAnimation() {
    element.style.animationPlayState = 'paused';
}

// Reset animation
function resetAnimation() {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = '${animationName} ${duration}s ${timing} ${delay}s ${iterations} ${direction} both';
}

// Animation event listeners
element.addEventListener('animationstart', () => {
    console.log('Animation started');
});

element.addEventListener('animationend', () => {
    console.log('Animation ended');
});

element.addEventListener('animationiteration', () => {
    console.log('Animation iteration completed');
});`;

            return `CSS ANIMATION GENERATED

Type: ${animationType}
Duration: ${duration}s
Timing: ${timing}
Delay: ${delay}s  
Iterations: ${iterations}
Direction: ${direction}

LIVE PREVIEW:
${previewBox}

KEYFRAMES:
${keyframes}

ANIMATION PROPERTY:
${animationProperty}

COMPLETE CSS:
${keyframes}

.animated-element {
    ${animationProperty}
    transform-origin: ${transformOrigin};
}

${utilityClasses}

HTML USAGE:
<div class="animate-${animationType}">
    Content to animate
</div>

JAVASCRIPT CONTROLS:
${jsControls}

PERFORMANCE TIPS:
• Use transform and opacity for best performance
• Prefer transforms over changing layout properties
• Use will-change: transform for complex animations
• Consider prefers-reduced-motion for accessibility

ACCESSIBILITY:
@media (prefers-reduced-motion: reduce) {
    .animate-${animationType} {
        animation: none;
    }
}

BROWSER SUPPORT:
✅ All modern browsers
✅ IE10+ (with vendor prefixes)`;
        }
    }));

    // 10. Icon Placeholder Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'icon-placeholder-generator',
        name: 'Icon Placeholder Generator',
        description: 'Generate SVG icon placeholders and mockups',
        category: 'color',
        icon: '🔳',
        fields: [
            {
                name: 'iconSize',
                label: 'Icon Size (px)',
                type: 'number',
                value: '64',
                min: '16',
                max: '512'
            },
            {
                name: 'iconColor',
                label: 'Icon Color',
                type: 'color',
                value: '#3498db'
            },
            {
                name: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                value: '#ecf0f1'
            },
            {
                name: 'iconStyle',
                label: 'Icon Style',
                type: 'select',
                options: [
                    { value: 'outline', label: 'Outline' },
                    { value: 'filled', label: 'Filled' },
                    { value: 'rounded', label: 'Rounded' },
                    { value: 'square', label: 'Square' }
                ],
                value: 'outline'
            },
            {
                name: 'iconType',
                label: 'Icon Type',
                type: 'select',
                options: [
                    { value: 'generic', label: 'Generic Icon' },
                    { value: 'user', label: 'User/Person' },
                    { value: 'document', label: 'Document' },
                    { value: 'image', label: 'Image' },
                    { value: 'folder', label: 'Folder' },
                    { value: 'settings', label: 'Settings' },
                    { value: 'chart', label: 'Chart' },
                    { value: 'star', label: 'Star' }
                ],
                value: 'generic'
            },
            {
                name: 'addText',
                label: 'Add Text Label',
                type: 'checkbox',
                value: false
            },
            {
                name: 'textLabel',
                label: 'Text Label',
                type: 'text',
                placeholder: 'Icon label'
            }
        ],
        generate: (data) => {
            const size = parseInt(data.iconSize);
            const iconColor = data.iconColor;
            const bgColor = data.backgroundColor;
            const iconStyle = data.iconStyle;
            const iconType = data.iconType;
            const addText = data.addText;
            const textLabel = data.textLabel || 'Icon';

            // Generate SVG paths for different icon types
            const getIconPath = (type, style) => {
                const isOutline = style === 'outline';
                const strokeWidth = isOutline ? '2' : '0';
                const fill = isOutline ? 'none' : iconColor;
                const stroke = isOutline ? iconColor : 'none';

                const paths = {
                    generic: `<circle cx="32" cy="32" r="20" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                             <circle cx="32" cy="28" r="4" fill="${iconColor}"/>
                             <path d="M32 36 L32 44" stroke="${iconColor}" stroke-width="2" stroke-linecap="round"/>`,
                    
                    user: `<circle cx="32" cy="20" r="8" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                           <path d="M16 48 C16 36 22 32 32 32 C42 32 48 36 48 48" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round"/>`,
                    
                    document: `<rect x="16" y="8" width="24" height="32" rx="${style === 'rounded' ? '4' : '0'}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                              <path d="M20 16 L36 16 M20 20 L36 20 M20 24 L32 24" stroke="${iconColor}" stroke-width="1.5" stroke-linecap="round"/>`,
                    
                    image: `<rect x="12" y="12" width="40" height="32" rx="${style === 'rounded' ? '4' : '0'}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                           <circle cx="22" cy="22" r="3" fill="${iconColor}"/>
                           <path d="M12 36 L20 28 L28 36 L40 24 L52 36 L52 44 L12 44 Z" fill="${iconColor}" opacity="0.7"/>`,
                    
                    folder: `<path d="M12 16 L28 16 L32 20 L52 20 L52 44 L12 44 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>
                            <path d="M12 12 L24 12 L28 16 L12 16 Z" fill="${iconColor}" opacity="0.8"/>`,
                    
                    settings: `<circle cx="32" cy="32" r="12" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
                              <circle cx="32" cy="32" r="4" fill="${iconColor}"/>
                              ${Array.from({length: 8}, (_, i) => {
                                  const angle = (i * 45) * Math.PI / 180;
                                  const x1 = 32 + Math.cos(angle) * 16;
                                  const y1 = 32 + Math.sin(angle) * 16;
                                  const x2 = 32 + Math.cos(angle) * 22;
                                  const y2 = 32 + Math.sin(angle) * 22;
                                  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${iconColor}" stroke-width="2" stroke-linecap="round"/>`;
                              }).join('')}`,
                    
                    chart: `<rect x="16" y="32" width="4" height="16" fill="${iconColor}"/>
                           <rect x="24" y="24" width="4" height="24" fill="${iconColor}"/>
                           <rect x="32" y="16" width="4" height="32" fill="${iconColor}"/>
                           <rect x="40" y="28" width="4" height="20" fill="${iconColor}"/>`,
                    
                    star: `<path d="M32 8 L36 20 L48 20 L39 28 L43 40 L32 34 L21 40 L25 28 L16 20 L28 20 Z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round"/>`
                };

                return paths[type] || paths.generic;
            };

            const iconPath = getIconPath(iconType, iconStyle);
            
            const totalHeight = addText ? size + 30 : size;
            
            const svg = `<svg width="${size}" height="${totalHeight}" viewBox="0 0 64 ${addText ? 84 : 64}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background -->
    <rect width="64" height="${addText ? 84 : 64}" fill="${bgColor}" rx="${iconStyle === 'rounded' ? '8' : '0'}"/>
    
    <!-- Icon -->
    <g transform="translate(0, 0)">
        ${iconPath}
    </g>
    
    ${addText ? `
    <!-- Text label -->
    <text x="32" y="76" text-anchor="middle" fill="${iconColor}" font-family="Arial, sans-serif" font-size="10" font-weight="500">
        ${textLabel}
    </text>` : ''}
</svg>`;

            const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

            // Generate multiple sizes
            const sizes = [16, 24, 32, 48, 64, 128, 256];
            const sizeVariations = sizes.map(s => {
                const scaledSvg = svg.replace(/width="\d+"/, `width="${s}"`).replace(/height="\d+"/, `height="${s}"`);
                const scaledDataUrl = `data:image/svg+xml;base64,${btoa(scaledSvg)}`;
                return {
                    size: s,
                    dataUrl: scaledDataUrl
                };
            });

            const sizePreview = sizeVariations.map(v => 
                `<img src="${v.dataUrl}" width="${v.size}" height="${v.size}" style="margin: 5px; border: 1px solid #ddd;" title="${v.size}x${v.size}px"/>`
            ).join('');

            return `ICON PLACEHOLDER GENERATED

Configuration:
• Size: ${size}x${size}px
• Type: ${iconType}
• Style: ${iconStyle}
• Colors: ${iconColor} on ${bgColor}
• Text: ${addText ? textLabel : 'None'}

PREVIEW:
<img src="${dataUrl}" width="${size}" height="${totalHeight}" style="margin: 20px; border: 2px solid #ddd; border-radius: 8px;"/>

SIZE VARIATIONS:
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 10px 0;">
${sizePreview}
</div>

SVG CODE:
${svg}

DATA URL:
${dataUrl}

HTML USAGE:
<!-- As image source -->
<img src="${dataUrl}" alt="${textLabel}" width="${size}" height="${totalHeight}"/>

<!-- Inline SVG -->
${svg}

<!-- As CSS background -->
.icon-${iconType} {
    background-image: url('${dataUrl}');
    background-size: contain;
    background-repeat: no-repeat;
    width: ${size}px;
    height: ${totalHeight}px;
}

REACT COMPONENT:
const ${iconType.charAt(0).toUpperCase() + iconType.slice(1)}Icon = ({ size = ${size}, color = '${iconColor}' }) => (
    <svg width={size} height={size} viewBox="0 0 64 64">
        ${iconPath.replace(new RegExp(iconColor, 'g'), '{color}')}
    </svg>
);

FAVICON SIZES:
• 16x16: Browser tabs
• 32x32: Taskbar/bookmarks  
• 48x48: Desktop shortcuts
• 64x64: High-DPI displays
• 128x128: Mac dock icons
• 256x256: High-resolution displays

OPTIMIZATION:
• Use SVGO to minimize SVG file size
• Consider PNG fallbacks for older browsers
• Test contrast ratios for accessibility
• Ensure visibility at smallest sizes`;
        }
    }));

    // 11. Responsive Breakpoint Generator  
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'responsive-breakpoint-generator',
        name: 'Responsive Breakpoint Generator',
        description: 'Generate CSS media queries for responsive design',
        category: 'color',
        icon: '📱',
        fields: [
            {
                name: 'framework',
                label: 'Framework',
                type: 'select',
                options: [
                    { value: 'custom', label: 'Custom Breakpoints' },
                    { value: 'bootstrap', label: 'Bootstrap 5' },
                    { value: 'tailwind', label: 'Tailwind CSS' },
                    { value: 'material', label: 'Material Design' },
                    { value: 'foundation', label: 'Foundation' }
                ],
                value: 'custom'
            },
            {
                name: 'mobile',
                label: 'Mobile (px)',
                type: 'number',
                value: '480',
                min: '320',
                max: '640'
            },
            {
                name: 'tablet',
                label: 'Tablet (px)',
                type: 'number', 
                value: '768',
                min: '640',
                max: '1024'
            },
            {
                name: 'desktop',
                label: 'Desktop (px)',
                type: 'number',
                value: '1024',
                min: '768',
                max: '1440'
            },
            {
                name: 'largeDesktop',
                label: 'Large Desktop (px)',
                type: 'number',
                value: '1200',
                min: '1024',
                max: '1920'
            },
            {
                name: 'generateMixins',
                label: 'Generate SCSS Mixins',
                type: 'checkbox',
                value: true
            }
        ],
        generate: (data) => {
            const framework = data.framework;
            const mobile = parseInt(data.mobile);
            const tablet = parseInt(data.tablet);
            const desktop = parseInt(data.desktop);
            const largeDesktop = parseInt(data.largeDesktop);
            const generateMixins = data.generateMixins;

            let breakpoints = {};

            // Framework-specific breakpoints
            switch (framework) {
                case 'bootstrap':
                    breakpoints = {
                        xs: 0,
                        sm: 576,
                        md: 768,
                        lg: 992,
                        xl: 1200,
                        xxl: 1400
                    };
                    break;
                case 'tailwind':
                    breakpoints = {
                        sm: 640,
                        md: 768,
                        lg: 1024,
                        xl: 1280,
                        '2xl': 1536
                    };
                    break;
                case 'material':
                    breakpoints = {
                        xs: 0,
                        sm: 600,
                        md: 960,
                        lg: 1280,
                        xl: 1920
                    };
                    break;
                case 'foundation':
                    breakpoints = {
                        small: 0,
                        medium: 640,
                        large: 1024,
                        xlarge: 1200,
                        xxlarge: 1440
                    };
                    break;
                default: // custom
                    breakpoints = {
                        mobile: mobile,
                        tablet: tablet,
                        desktop: desktop,
                        'large-desktop': largeDesktop
                    };
            }

            // Generate CSS media queries
            const mediaQueries = Object.entries(breakpoints).map(([name, value]) => {
                if (value === 0) return '';
                return `/* ${name.charAt(0).toUpperCase() + name.slice(1)} devices (${value}px and up) */
@media (min-width: ${value}px) {
    .container {
        max-width: ${value < 768 ? '100%' : value - 40 + 'px'};
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .grid {
        grid-template-columns: repeat(${value < 768 ? 1 : value < 1024 ? 2 : value < 1200 ? 3 : 4}, 1fr);
    }
    
    .text-size {
        font-size: ${value < 768 ? '14px' : value < 1024 ? '16px' : '18px'};
    }
}`;
            }).filter(Boolean).join('\n\n');

            // Generate range queries (mobile-only, tablet-only, etc.)
            const sortedBreakpoints = Object.entries(breakpoints)
                .filter(([_, value]) => value > 0)
                .sort((a, b) => a[1] - b[1]);

            const rangeQueries = sortedBreakpoints.map(([name, minValue], index) => {
                const nextBreakpoint = sortedBreakpoints[index + 1];
                const maxValue = nextBreakpoint ? nextBreakpoint[1] - 1 : null;
                
                if (maxValue) {
                    return `/* ${name} only (${minValue}px to ${maxValue}px) */
@media (min-width: ${minValue}px) and (max-width: ${maxValue}px) {
    /* ${name}-specific styles */
}`;
                } else {
                    return `/* ${name} and up (${minValue}px+) */
@media (min-width: ${minValue}px) {
    /* ${name}-and-up styles */
}`;
                }
            }).join('\n\n');

            // Generate SCSS mixins if requested
            let scssMixins = '';
            if (generateMixins) {
                scssMixins = `
// SCSS Mixins
${Object.entries(breakpoints).filter(([_, value]) => value > 0).map(([name, value]) => `
@mixin ${name}-up {
    @media (min-width: ${value}px) {
        @content;
    }
}

@mixin ${name}-down {
    @media (max-width: ${value - 1}px) {
        @content;
    }
}`).join('')}

// Usage examples:
.header {
    font-size: 18px;
    
    @include tablet-up {
        font-size: 24px;
    }
    
    @include desktop-up {
        font-size: 32px;
    }
}`;
            }

            // Generate JavaScript helpers
            const jsHelpers = `
// JavaScript breakpoint helpers
const breakpoints = ${JSON.stringify(breakpoints, null, 2)};

// Check if screen matches breakpoint
function isBreakpoint(bp) {
    return window.innerWidth >= breakpoints[bp];
}

// Get current breakpoint
function getCurrentBreakpoint() {
    const width = window.innerWidth;
    const sorted = Object.entries(breakpoints)
        .filter(([_, value]) => value <= width)
        .sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : 'mobile';
}

// Responsive event listener
let currentBreakpoint = getCurrentBreakpoint();
window.addEventListener('resize', () => {
    const newBreakpoint = getCurrentBreakpoint();
    if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint;
        document.dispatchEvent(new CustomEvent('breakpointchange', {
            detail: { breakpoint: currentBreakpoint }
        }));
    }
});

// Usage
document.addEventListener('breakpointchange', (e) => {
    console.log('Breakpoint changed to:', e.detail.breakpoint);
});`;

            // CSS Grid responsive example
            const gridExample = `
/* Responsive Grid Example */
.responsive-grid {
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr; /* Mobile: single column */
}

${Object.entries(breakpoints).filter(([_, value]) => value > 0).map(([name, value]) => `
@media (min-width: ${value}px) {
    .responsive-grid {
        grid-template-columns: repeat(${value < 768 ? 1 : value < 1024 ? 2 : value < 1200 ? 3 : 4}, 1fr);
    }
}`).join('')}`;

            return `RESPONSIVE BREAKPOINTS GENERATED

Framework: ${framework}
Breakpoints:
${Object.entries(breakpoints).map(([name, value]) => `• ${name}: ${value === 0 ? '0 (base)' : value + 'px+'}`).join('\n')}

BASIC MEDIA QUERIES:
${mediaQueries}

RANGE-SPECIFIC QUERIES:
${rangeQueries}

${generateMixins ? scssMixins : ''}

CSS GRID RESPONSIVE EXAMPLE:
${gridExample}

JAVASCRIPT HELPERS:
${jsHelpers}

CSS CUSTOM PROPERTIES:
:root {
${Object.entries(breakpoints).filter(([_, value]) => value > 0).map(([name, value]) => `    --bp-${name}: ${value}px;`).join('\n')}
}

/* Usage with container queries (when supported) */
@container (min-width: var(--bp-tablet)) {
    .card { 
        flex-direction: row; 
    }
}

TESTING CHECKLIST:
□ Test on actual devices, not just browser resize
□ Check touch interactions on mobile
□ Verify text readability at all sizes  
□ Test navigation usability on small screens
□ Ensure images scale properly
□ Check form usability on mobile
□ Verify loading performance on mobile connections

COMMON BREAKPOINT RANGES:
• Mobile: 320px - 767px
• Tablet: 768px - 1023px  
• Desktop: 1024px - 1199px
• Large Desktop: 1200px+

ACCESSIBILITY NOTES:
• Ensure minimum touch target size of 44px
• Test with zoom up to 200%
• Consider users with motor impairments
• Provide alternative navigation for small screens`;
        }
    }));

    // 12. Brand Color Extractor
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'brand-color-extractor',
        name: 'Brand Color Palette Extractor',
        description: 'Extract and analyze color palettes from popular brands',
        category: 'color',
        icon: '🎨',
        fields: [
            {
                name: 'brandName',
                label: 'Brand/Company Name',
                type: 'text',
                placeholder: 'e.g., Google, Apple, Facebook',
                required: true
            },
            {
                name: 'includeAnalysis',
                label: 'Include color psychology analysis',
                type: 'checkbox',
                value: true
            }
        ],
        convert: (data) => {
            const brandName = data.brandName.toLowerCase().trim();
            const includeAnalysis = data.includeAnalysis;

            // Popular brand color palettes
            const brandPalettes = {
                'google': {
                    primary: '#4285F4',
                    colors: ['#4285F4', '#EA4335', '#FBBC04', '#34A853'],
                    description: 'Google\'s vibrant and friendly palette',
                    psychology: 'Blue conveys trust and reliability, red adds energy, yellow brings optimism, green suggests growth'
                },
                'apple': {
                    primary: '#007AFF',
                    colors: ['#007AFF', '#000000', '#FFFFFF', '#F2F2F7', '#8E8E93'],
                    description: 'Apple\'s clean and minimal palette',
                    psychology: 'Blue for innovation, black/white for premium minimalism, grays for sophistication'
                },
                'facebook': {
                    primary: '#1877F2', 
                    colors: ['#1877F2', '#42B883', '#E7F3FF', '#F0F2F5'],
                    description: 'Facebook\'s trustworthy blue-centered palette',
                    psychology: 'Blue builds trust and connection, light blues create calm and openness'
                },
                'netflix': {
                    primary: '#E50914',
                    colors: ['#E50914', '#000000', '#FFFFFF', '#831010'],
                    description: 'Netflix\'s bold and dramatic palette',
                    psychology: 'Red creates urgency and excitement, black adds premium feel and drama'
                },
                'spotify': {
                    primary: '#1DB954',
                    colors: ['#1DB954', '#191414', '#FFFFFF', '#1ED760'],
                    description: 'Spotify\'s energetic green palette',
                    psychology: 'Green represents growth and energy, dark backgrounds create focus on content'
                },
                'twitter': {
                    primary: '#1DA1F2',
                    colors: ['#1DA1F2', '#14171A', '#657786', '#AAB8C2', '#E1E8ED'],
                    description: 'Twitter\'s communicative blue palette',
                    psychology: 'Blue encourages communication and trust, grays provide neutral content background'
                },
                'instagram': {
                    primary: '#E4405F',
                    colors: ['#E4405F', '#833AB4', '#F56040', '#FFDC80', '#405DE6'],
                    description: 'Instagram\'s vibrant gradient palette',
                    psychology: 'Warm colors evoke creativity and passion, gradients suggest transformation and energy'
                },
                'youtube': {
                    primary: '#FF0000',
                    colors: ['#FF0000', '#FFFFFF', '#000000', '#282828', '#AAAAAA'],
                    description: 'YouTube\'s attention-grabbing red palette',
                    psychology: 'Red demands attention and creates urgency, black/white for clarity and contrast'
                },
                'amazon': {
                    primary: '#FF9900',
                    colors: ['#FF9900', '#232F3E', '#FFFFFF', '#146EB4', '#FF9900'],
                    description: 'Amazon\'s optimistic orange and blue palette',
                    psychology: 'Orange suggests value and enthusiasm, blue builds trust for transactions'
                },
                'microsoft': {
                    primary: '#00BCF2',
                    colors: ['#00BCF2', '#80BC00', '#FFBA00', '#F25022'],
                    description: 'Microsoft\'s diverse and inclusive palette',
                    psychology: 'Multiple colors represent diversity and different product offerings'
                },
                'slack': {
                    primary: '#4A154B',
                    colors: ['#4A154B', '#36C5F0', '#2EB67D', '#ECB22E', '#E01E5A'],
                    description: 'Slack\'s professional yet playful palette',
                    psychology: 'Purple suggests premium service, bright colors add friendliness to work communication'
                },
                'discord': {
                    primary: '#5865F2',
                    colors: ['#5865F2', '#57F287', '#FEE75C', '#ED4245', '#EB459E'],
                    description: 'Discord\'s gaming-focused vibrant palette',
                    psychology: 'Purple/blue for community, bright colors appeal to gaming demographic'
                }
            };

            // Find brand or suggest similar
            let selectedBrand = brandPalettes[brandName];
            
            if (!selectedBrand) {
                // Find partial matches
                const partialMatch = Object.keys(brandPalettes).find(key => 
                    key.includes(brandName) || brandName.includes(key)
                );
                
                if (partialMatch) {
                    selectedBrand = brandPalettes[partialMatch];
                    selectedBrand.name = partialMatch;
                } else {
                    // Generate a generic palette if brand not found
                    const defaultColors = ['#007AFF', '#FF3B30', '#34C759', '#FFCC00', '#AF52DE'];
                    selectedBrand = {
                        primary: defaultColors[0],
                        colors: defaultColors,
                        description: 'Generic professional color palette',
                        psychology: 'Balanced palette with trust (blue), energy (red), growth (green), optimism (yellow), creativity (purple)'
                    };
                }
            }

            const colors = selectedBrand.colors;
            const primaryColor = selectedBrand.primary;

            // Create color swatches
            const colorSwatches = colors.map((color, index) => {
                // Convert hex to RGB for contrast calculation
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                const textColor = brightness > 128 ? '#000000' : '#ffffff';
                
                return `<div style="
                    background: ${color};
                    color: ${textColor};
                    padding: 20px;
                    text-align: center;
                    font-weight: bold;
                    border-radius: 8px;
                    margin: 5px;
                    min-width: 120px;
                    display: inline-block;
                ">
                    ${color.toUpperCase()}<br>
                    <small>RGB(${r},${g},${b})</small>
                </div>`;
            }).join('');

            // Generate complementary variations
            const generateTints = (hexColor) => {
                const r = parseInt(hexColor.slice(1, 3), 16);
                const g = parseInt(hexColor.slice(3, 5), 16);
                const b = parseInt(hexColor.slice(5, 7), 16);
                
                const tints = [];
                for (let i = 1; i <= 4; i++) {
                    const factor = i * 0.2;
                    const newR = Math.round(r + (255 - r) * factor);
                    const newG = Math.round(g + (255 - g) * factor);
                    const newB = Math.round(b + (255 - b) * factor);
                    
                    tints.push(`#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`);
                }
                return tints;
            };

            const primaryTints = generateTints(primaryColor);
            const tintsDisplay = primaryTints.map((tint, i) => 
                `<div style="background: ${tint}; width: 60px; height: 60px; display: inline-block; margin: 2px; border-radius: 4px;" title="${tint}"></div>`
            ).join('');

            let analysisContent = '';
            if (includeAnalysis) {
                analysisContent = `
COLOR PSYCHOLOGY ANALYSIS:
${selectedBrand.psychology}

USAGE RECOMMENDATIONS:
• Primary: Use for main brand elements, CTAs, links
• Secondary: Use for accents, highlights, secondary actions  
• Neutral: Use for backgrounds, borders, text
• Success/Error: Use for status indicators, notifications

ACCESSIBILITY CONSIDERATIONS:
• Ensure contrast ratios meet WCAG standards
• Test with colorblind simulators
• Provide non-color ways to convey information
• Consider how colors appear in different lighting conditions`;
            }

            return `BRAND COLOR PALETTE EXTRACTED

Brand: ${brandName.charAt(0).toUpperCase() + brandName.slice(1)}
Primary Color: ${primaryColor.toUpperCase()}
Description: ${selectedBrand.description}

BRAND PALETTE:
<div style="margin: 20px 0;">
${colorSwatches}
</div>

PRIMARY COLOR TINTS:
<div style="margin: 15px 0;">
${tintsDisplay}
</div>

HEX VALUES:
${colors.map((color, i) => `${i + 1}. ${color.toUpperCase()}`).join('\n')}

CSS VARIABLES:
:root {
${colors.map((color, i) => `    --brand-${i === 0 ? 'primary' : 'color-' + i}: ${color};`).join('\n')}
}

SCSS VARIABLES:
${colors.map((color, i) => `$brand-${i === 0 ? 'primary' : 'color-' + i}: ${color};`).join('\n')}

TAILWIND CONFIG:
colors: {
  brand: {
    primary: '${primaryColor}',
${colors.slice(1).map((color, i) => `    ${i + 1}: '${color}'`).join(',\n')}
  }
}

USAGE EXAMPLES:
<!-- HTML -->
<button class="bg-brand-primary text-white">Primary Button</button>

/* CSS */
.brand-button {
    background-color: var(--brand-primary);
    border: 1px solid var(--brand-color-2);
}

/* SCSS */
.header {
    background: $brand-primary;
    color: contrast-color($brand-primary);
}

${analysisContent}

ALTERNATIVE BRANDS:
${Object.keys(brandPalettes).filter(brand => brand !== brandName).slice(0, 5).map(brand => 
    `• ${brand.charAt(0).toUpperCase() + brand.slice(1)}: ${brandPalettes[brand].primary}`
).join('\n')}

Note: Colors are approximations based on public brand guidelines. Always refer to official brand guidelines for exact specifications.`;
        }
    }));

})();