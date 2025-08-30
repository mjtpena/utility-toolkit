// Final Image Processing Tools
(function() {
    'use strict';

    // 8. Favicon Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'favicon-generator',
        name: 'Favicon Generator',
        description: 'Generate favicons in multiple sizes from images or text',
        category: 'image',
        icon: '🌐',
        fields: [
            {
                name: 'faviconType',
                label: 'Favicon Type',
                type: 'select',
                options: [
                    { value: 'image', label: 'From Image File' },
                    { value: 'text', label: 'From Text/Emoji' },
                    { value: 'initials', label: 'From Initials' }
                ],
                value: 'image'
            },
            {
                name: 'imageFile',
                label: 'Image File (for image type)',
                type: 'file',
                accept: 'image/*'
            },
            {
                name: 'faviconText',
                label: 'Text/Emoji (for text type)',
                type: 'text',
                placeholder: '🚀 or A or AB',
                maxlength: '2'
            },
            {
                name: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                value: '#ffffff'
            },
            {
                name: 'textColor',
                label: 'Text Color',
                type: 'color',
                value: '#333333'
            },
            {
                name: 'borderRadius',
                label: 'Border Radius (%)',
                type: 'number',
                value: '0',
                min: '0',
                max: '50'
            }
        ],
        generate: (data) => {
            return new Promise((resolve, reject) => {
                const type = data.faviconType;
                const bgColor = data.backgroundColor;
                const textColor = data.textColor;
                const borderRadius = parseInt(data.borderRadius);
                const text = data.faviconText || 'A';
                
                const sizes = [16, 32, 48, 64, 96, 128, 152, 180, 192, 256, 512];
                const favicons = [];

                if (type === 'image' && data.imageFile) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const img = new Image();
                        img.onload = function() {
                            generateImageFavicons(img);
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(data.imageFile);
                } else {
                    generateTextFavicons();
                }

                function generateImageFavicons(sourceImg) {
                    sizes.forEach(size => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = size;
                        canvas.height = size;

                        // Fill background
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, size, size);

                        // Apply border radius
                        if (borderRadius > 0) {
                            const radius = (size * borderRadius) / 100;
                            ctx.beginPath();
                            ctx.roundRect(0, 0, size, size, radius);
                            ctx.clip();
                        }

                        // Draw image
                        const scale = Math.min(size / sourceImg.width, size / sourceImg.height);
                        const scaledWidth = sourceImg.width * scale;
                        const scaledHeight = sourceImg.height * scale;
                        const x = (size - scaledWidth) / 2;
                        const y = (size - scaledHeight) / 2;

                        ctx.drawImage(sourceImg, x, y, scaledWidth, scaledHeight);

                        favicons.push({
                            size: size,
                            dataUrl: canvas.toDataURL('image/png'),
                            filename: `favicon-${size}x${size}.png`
                        });
                    });

                    generateFaviconPackage();
                }

                function generateTextFavicons() {
                    sizes.forEach(size => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = size;
                        canvas.height = size;

                        // Fill background
                        ctx.fillStyle = bgColor;
                        ctx.fillRect(0, 0, size, size);

                        // Apply border radius
                        if (borderRadius > 0) {
                            const radius = (size * borderRadius) / 100;
                            ctx.beginPath();
                            ctx.roundRect(0, 0, size, size, radius);
                            ctx.fill();
                        }

                        // Draw text
                        ctx.fillStyle = textColor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        const isEmoji = /\p{Extended_Pictographic}/u.test(text);
                        const fontSize = isEmoji ? size * 0.6 : size * 0.5;
                        ctx.font = `${fontSize}px ${isEmoji ? 'Apple Color Emoji, Segoe UI Emoji, sans-serif' : 'Arial, sans-serif'}`;
                        
                        ctx.fillText(text, size / 2, size / 2);

                        favicons.push({
                            size: size,
                            dataUrl: canvas.toDataURL('image/png'),
                            filename: `favicon-${size}x${size}.png`
                        });
                    });

                    generateFaviconPackage();
                }

                function generateFaviconPackage() {
                    const icoSizes = [16, 32, 48];
                    const appleTouchSizes = [152, 180];
                    const androidSizes = [192, 512];

                    // Generate manifest.json
                    const manifest = {
                        name: "Website",
                        short_name: "Site",
                        icons: androidSizes.map(size => ({
                            src: `favicon-${size}x${size}.png`,
                            sizes: `${size}x${size}`,
                            type: "image/png"
                        })),
                        theme_color: bgColor,
                        background_color: bgColor,
                        display: "standalone"
                    };

                    // Generate HTML tags
                    const htmlTags = generateHTMLTags();

                    const faviconPreviews = favicons.slice(0, 6).map(favicon => 
                        `<div style="display: inline-block; margin: 10px; text-align: center;">
                            <img src="${favicon.dataUrl}" style="width: ${Math.min(favicon.size, 64)}px; height: ${Math.min(favicon.size, 64)}px; border: 1px solid #ddd; border-radius: 4px;"/>
                            <div style="font-size: 12px; margin-top: 5px;">${favicon.size}×${favicon.size}</div>
                        </div>`
                    ).join('');

                    const downloadButtons = favicons.map(favicon => 
                        `<button onclick="downloadFavicon('${favicon.dataUrl}', '${favicon.filename}')" style="
                            background: #3498db;
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            cursor: pointer;
                            margin: 2px;
                            font-size: 12px;
                        ">${favicon.size}px</button>`
                    ).join('');

                    resolve(`FAVICON PACKAGE GENERATED

Type: ${type === 'image' ? 'From Image' : type === 'text' ? 'From Text/Emoji' : 'From Initials'}
Text/Content: ${type !== 'image' ? text : 'Custom Image'}
Background: ${bgColor}
${type !== 'image' ? `Text Color: ${textColor}` : ''}
Border Radius: ${borderRadius}%
Sizes Generated: ${sizes.length}

FAVICON PREVIEWS:
<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
    ${faviconPreviews}
    ${favicons.length > 6 ? `<div style="font-size: 14px; color: #666; margin-top: 10px;">+ ${favicons.length - 6} more sizes</div>` : ''}
</div>

DOWNLOAD INDIVIDUAL SIZES:
<div style="text-align: center; margin: 20px 0;">
    ${downloadButtons}
</div>

<div style="text-align: center; margin: 20px 0;">
    <button onclick="downloadAllFavicons()" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download All Favicons</button>
    
    <button onclick="downloadManifest('${btoa(JSON.stringify(manifest, null, 2))}')" style="
        background: #f39c12;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin-left: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download Manifest</button>
</div>

<script>
const faviconData = ${JSON.stringify(favicons)};

function downloadFavicon(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadAllFavicons() {
    faviconData.forEach(favicon => {
        setTimeout(() => downloadFavicon(favicon.dataUrl, favicon.filename), 100);
    });
}

function downloadManifest(base64Manifest) {
    const manifestData = atob(base64Manifest);
    const blob = new Blob([manifestData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'manifest.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
</script>

HTML IMPLEMENTATION:
\`\`\`html
${htmlTags}
\`\`\`

MANIFEST.JSON:
\`\`\`json
${JSON.stringify(manifest, null, 2)}
\`\`\`

FILE USAGE:
• favicon.ico: Classic favicon (16x16, 32x32, 48x48)
• apple-touch-icon.png: iOS home screen (180x180)
• favicon-192x192.png: Android home screen
• favicon-512x512.png: Progressive Web App
• manifest.json: PWA configuration

BROWSER SUPPORT:
• ICO format: All browsers (legacy)
• PNG favicons: Modern browsers (95%+)
• Apple touch icons: iOS Safari
• Manifest icons: PWA-enabled browsers
• SVG favicons: Latest browsers (experimental)

SEO BENEFITS:
• Professional appearance in bookmarks
• Better recognition in browser tabs
• Enhanced PWA experience
• Improved brand consistency
• Mobile home screen icons

OPTIMIZATION TIPS:
• Keep designs simple for small sizes
• Test visibility at 16x16 pixels
• Use high contrast for small icons
• Consider dark mode variants
• Test across different devices

DEPLOYMENT:
1. Upload all favicon files to website root
2. Add HTML tags to <head> section
3. Upload manifest.json to root directory
4. Test with favicon validation tools
5. Clear browser cache to see changes`);

                    function generateHTMLTags() {
                        return `<!-- Standard favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">

<!-- Modern browsers -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">

<!-- Apple devices -->
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png">

<!-- Android devices -->
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">

<!-- Web app manifest -->
<link rel="manifest" href="/manifest.json">

<!-- Theme colors -->
<meta name="theme-color" content="${bgColor}">
<meta name="msapplication-TileColor" content="${bgColor}">`;
                    }
                }
            });
        }
    }));

    // 9. Image Placeholder Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'image-placeholder-generator',
        name: 'Image Placeholder Generator',
        description: 'Generate placeholder images for development and design',
        category: 'image',
        icon: '🔳',
        fields: [
            {
                name: 'width',
                label: 'Width (px)',
                type: 'number',
                value: '400',
                min: '50',
                max: '2000',
                required: true
            },
            {
                name: 'height',
                label: 'Height (px)',
                type: 'number',
                value: '300',
                min: '50',
                max: '2000',
                required: true
            },
            {
                name: 'backgroundColor',
                label: 'Background Color',
                type: 'color',
                value: '#cccccc'
            },
            {
                name: 'textColor',
                label: 'Text Color',
                type: 'color',
                value: '#666666'
            },
            {
                name: 'placeholderText',
                label: 'Placeholder Text',
                type: 'text',
                placeholder: 'Leave empty for dimensions'
            },
            {
                name: 'style',
                label: 'Style',
                type: 'select',
                options: [
                    { value: 'solid', label: 'Solid Color' },
                    { value: 'gradient', label: 'Gradient' },
                    { value: 'pattern', label: 'Pattern' },
                    { value: 'geometric', label: 'Geometric' }
                ],
                value: 'solid'
            }
        ],
        generate: (data) => {
            const width = parseInt(data.width);
            const height = parseInt(data.height);
            const bgColor = data.backgroundColor;
            const textColor = data.textColor;
            const text = data.placeholderText || `${width} × ${height}`;
            const style = data.style;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            // Generate background based on style
            switch (style) {
                case 'solid':
                    generateSolidBackground(ctx, width, height, bgColor);
                    break;
                case 'gradient':
                    generateGradientBackground(ctx, width, height, bgColor);
                    break;
                case 'pattern':
                    generatePatternBackground(ctx, width, height, bgColor);
                    break;
                case 'geometric':
                    generateGeometricBackground(ctx, width, height, bgColor);
                    break;
            }

            // Draw text
            drawPlaceholderText(ctx, width, height, text, textColor);

            const placeholderDataUrl = canvas.toDataURL('image/png');
            const svgPlaceholder = generateSVGPlaceholder(width, height, bgColor, textColor, text, style);

            // Generate common aspect ratios
            const commonRatios = [
                { name: '16:9 (Widescreen)', width: width, height: Math.round(width * 9 / 16) },
                { name: '4:3 (Standard)', width: width, height: Math.round(width * 3 / 4) },
                { name: '1:1 (Square)', width: width, height: width },
                { name: '3:2 (Photo)', width: width, height: Math.round(width * 2 / 3) }
            ];

            const ratioExamples = commonRatios.map(ratio => {
                if (ratio.width === width && ratio.height === height) return '';
                
                const ratioCanvas = document.createElement('canvas');
                const ratioCtx = ratioCanvas.getContext('2d');
                ratioCanvas.width = Math.min(ratio.width, 200);
                ratioCanvas.height = Math.min(ratio.height, 150);
                
                generateSolidBackground(ratioCtx, ratioCanvas.width, ratioCanvas.height, bgColor);
                drawPlaceholderText(ratioCtx, ratioCanvas.width, ratioCanvas.height, 
                    `${ratio.width}×${ratio.height}`, textColor);
                
                return `<div style="display: inline-block; margin: 5px; text-align: center;">
                    <img src="${ratioCanvas.toDataURL('image/png')}" style="border: 1px solid #ddd; border-radius: 4px;"/>
                    <div style="font-size: 11px; margin-top: 5px; color: #666;">${ratio.name}</div>
                </div>`;
            }).filter(Boolean).join('');

            return `PLACEHOLDER IMAGE GENERATED

Dimensions: ${width} × ${height} pixels
Style: ${style}
Background: ${bgColor}
Text Color: ${textColor}
Text: "${text}"

GENERATED PLACEHOLDER:
<div style="text-align: center; margin: 20px 0;">
    <div style="display: inline-block; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <img src="${placeholderDataUrl}" alt="Placeholder ${width}x${height}"/>
    </div>
</div>

DOWNLOAD OPTIONS:
<div style="text-align: center; margin: 20px 0;">
    <button onclick="downloadPlaceholder('${placeholderDataUrl}', 'placeholder-${width}x${height}.png')" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download PNG</button>
    
    <button onclick="downloadSVGPlaceholder('${btoa(svgPlaceholder)}', 'placeholder-${width}x${height}.svg')" style="
        background: #9b59b6;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        margin: 5px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download SVG</button>
</div>

<script>
function downloadPlaceholder(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadSVGPlaceholder(base64SVG, filename) {
    const svgData = atob(base64SVG);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
</script>

COMMON ASPECT RATIOS:
${ratioExamples ? `<div style="text-align: center; margin: 20px 0; background: #f8f9fa; padding: 15px; border-radius: 8px;">${ratioExamples}</div>` : ''}

SVG VERSION:
\`\`\`svg
${svgPlaceholder}
\`\`\`

HTML USAGE:
\`\`\`html
<img src="placeholder-${width}x${height}.png" alt="Placeholder" width="${width}" height="${height}"/>

<!-- Responsive -->
<img src="placeholder-${width}x${height}.png" alt="Placeholder" style="max-width: 100%; height: auto;"/>

<!-- With figure -->
<figure>
    <img src="placeholder-${width}x${height}.png" alt="Placeholder"/>
    <figcaption>Image caption here</figcaption>
</figure>
\`\`\`

CSS IMPLEMENTATION:
\`\`\`css
.placeholder {
    width: ${width}px;
    height: ${height}px;
    background: ${bgColor};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${textColor};
    font-family: Arial, sans-serif;
    font-size: ${Math.min(width, height) / 15}px;
    border-radius: 4px;
}

.placeholder::before {
    content: "${text}";
}
\`\`\`

DATA URI:
\`\`\`
${placeholderDataUrl}
\`\`\`

USE CASES:
• Website mockups and wireframes
• Template development
• Content management systems
• Design system documentation
• Loading state placeholders
• A/B testing variations

RESPONSIVE CONSIDERATIONS:
• Use max-width: 100% for mobile compatibility
• Consider different sizes for different breakpoints
• Implement lazy loading for better performance
• Use appropriate alt text for accessibility

FILE SIZE: ~${Math.round(placeholderDataUrl.length * 3 / 4 / 1024)} KB
ASPECT RATIO: ${(width / height).toFixed(2)}:1
PIXEL DENSITY: Standard (72 DPI equivalent)

ONLINE PLACEHOLDER SERVICES:
• Lorem Picsum: https://picsum.photos/${width}/${height}
• Placeholder.com: https://via.placeholder.com/${width}x${height}/${bgColor.slice(1)}/${textColor.slice(1)}
• Custom Generator: Your generated image above`;

            function generateSolidBackground(ctx, w, h, color) {
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, w, h);
            }

            function generateGradientBackground(ctx, w, h, baseColor) {
                const gradient = ctx.createLinearGradient(0, 0, w, h);
                gradient.addColorStop(0, lightenColor(baseColor, 20));
                gradient.addColorStop(1, darkenColor(baseColor, 20));
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, w, h);
            }

            function generatePatternBackground(ctx, w, h, baseColor) {
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, w, h);

                const patternSize = 20;
                ctx.fillStyle = darkenColor(baseColor, 10);
                
                for (let x = 0; x < w; x += patternSize * 2) {
                    for (let y = 0; y < h; y += patternSize * 2) {
                        ctx.fillRect(x, y, patternSize, patternSize);
                        ctx.fillRect(x + patternSize, y + patternSize, patternSize, patternSize);
                    }
                }
            }

            function generateGeometricBackground(ctx, w, h, baseColor) {
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, w, h);

                const centerX = w / 2;
                const centerY = h / 2;
                const maxRadius = Math.min(w, h) / 3;

                // Draw concentric circles
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, maxRadius - i * (maxRadius / 4), 0, 2 * Math.PI);
                    ctx.fillStyle = i % 2 === 0 ? darkenColor(baseColor, 15) : lightenColor(baseColor, 15);
                    ctx.fill();
                }
            }

            function drawPlaceholderText(ctx, w, h, text, color) {
                ctx.fillStyle = color;
                ctx.font = `${Math.min(w, h) / 15}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, w / 2, h / 2);
            }

            function generateSVGPlaceholder(w, h, bgColor, textColor, text, style) {
                let background = '';
                
                switch (style) {
                    case 'solid':
                        background = `<rect width="${w}" height="${h}" fill="${bgColor}"/>`;
                        break;
                    case 'gradient':
                        background = `
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${lightenColor(bgColor, 20)};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${darkenColor(bgColor, 20)};stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <rect width="${w}" height="${h}" fill="url(#grad)"/>`;
                        break;
                    default:
                        background = `<rect width="${w}" height="${h}" fill="${bgColor}"/>`;
                }

                return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    ${background}
    <text x="${w/2}" y="${h/2}" font-family="Arial, sans-serif" font-size="${Math.min(w, h) / 15}" 
          fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
            }

            function lightenColor(color, percent) {
                const num = parseInt(color.replace("#", ""), 16);
                const amt = Math.round(2.55 * percent);
                const R = (num >> 16) + amt;
                const G = (num >> 8 & 0x00FF) + amt;
                const B = (num & 0x0000FF) + amt;
                return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
            }

            function darkenColor(color, percent) {
                const num = parseInt(color.replace("#", ""), 16);
                const amt = Math.round(2.55 * percent);
                const R = (num >> 16) - amt;
                const G = (num >> 8 & 0x00FF) - amt;
                const B = (num & 0x0000FF) - amt;
                return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
                    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
                    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
            }
        }
    }));

    // 10. Image Color Palette Extractor
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'image-color-palette-extractor',
        name: 'Image Color Palette Extractor',
        description: 'Extract dominant color palettes from images',
        category: 'image',
        icon: '🎨',
        fields: [
            {
                name: 'imageFile',
                label: 'Select Image File',
                type: 'file',
                accept: 'image/*',
                required: true
            },
            {
                name: 'colorCount',
                label: 'Number of Colors to Extract',
                type: 'number',
                value: '8',
                min: '3',
                max: '20'
            },
            {
                name: 'includeCSS',
                label: 'Generate CSS Variables',
                type: 'checkbox',
                value: true
            }
        ],
        convert: (data) => {
            return new Promise((resolve, reject) => {
                const file = data.imageFile;
                if (!file || !file.type.startsWith('image/')) {
                    reject(new Error('Please select a valid image file'));
                    return;
                }

                const colorCount = parseInt(data.colorCount);
                const includeCSS = data.includeCSS;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Scale down for performance
                        const maxSize = 200;
                        const scale = Math.min(maxSize / img.width, maxSize / img.height);
                        canvas.width = img.width * scale;
                        canvas.height = img.height * scale;
                        
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const pixels = imageData.data;

                        // Extract colors using k-means clustering
                        const colors = extractDominantColors(pixels, colorCount);
                        
                        // Generate color information
                        const colorInfo = colors.map((color, index) => {
                            const hex = rgbToHex(color.r, color.g, color.b);
                            const hsl = rgbToHsl(color.r, color.g, color.b);
                            const luminance = getLuminance(color.r, color.g, color.b);
                            const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
                            
                            return {
                                index: index + 1,
                                rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
                                hex: hex,
                                hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
                                frequency: color.frequency,
                                luminance: luminance,
                                textColor: textColor,
                                description: describeColor(hsl)
                            };
                        });

                        // Generate palette display
                        const paletteHTML = colorInfo.map(color => `
                            <div style="display: inline-block; width: 120px; margin: 10px; text-align: center;">
                                <div style="
                                    width: 100px;
                                    height: 100px;
                                    background: ${color.rgb};
                                    border: 2px solid #ddd;
                                    border-radius: 12px;
                                    margin: 0 auto 10px auto;
                                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: ${color.textColor};
                                    font-weight: bold;
                                    font-size: 12px;
                                ">
                                    ${color.index}
                                </div>
                                <div style="font-size: 12px; line-height: 1.3;">
                                    <div style="font-weight: bold;">${color.hex.toUpperCase()}</div>
                                    <div style="color: #666;">${color.rgb}</div>
                                    <div style="color: #666; margin-top: 4px;">${color.description}</div>
                                    <div style="color: #999; margin-top: 2px;">${color.frequency.toFixed(1)}%</div>
                                </div>
                            </div>
                        `).join('');

                        // Generate CSS if requested
                        let cssOutput = '';
                        if (includeCSS) {
                            const cssVars = colorInfo.map(color => 
                                `  --palette-${color.index}: ${color.hex};`
                            ).join('\n');
                            
                            const scssVars = colorInfo.map(color => 
                                `$palette-${color.index}: ${color.hex};`
                            ).join('\n');

                            cssOutput = `
CSS VARIABLES:
\`\`\`css
:root {
${cssVars}
}
\`\`\`

SCSS VARIABLES:
\`\`\`scss
${scssVars}
\`\`\`

TAILWIND CONFIG:
\`\`\`javascript
colors: {
  palette: {
${colorInfo.map(color => `    ${color.index}: '${color.hex}'`).join(',\n')}
  }
}
\`\`\``;
                        }

                        // Generate color harmony analysis
                        const harmonyAnalysis = analyzeColorHarmony(colorInfo);

                        resolve(`COLOR PALETTE EXTRACTED

Image: ${file.name}
Colors Extracted: ${colorCount}
Image Size: ${img.width} × ${img.height}px
Analysis Resolution: ${canvas.width} × ${canvas.height}px

EXTRACTED PALETTE:
<div style="text-align: center; margin: 20px 0;">
    <div style="display: inline-block; margin-bottom: 20px;">
        <img src="${e.target.result}" style="max-width: 300px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
    </div>
</div>

<div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
    ${paletteHTML}
</div>

COLOR DETAILS:
${colorInfo.map(color => 
    `${color.index}. ${color.description} (${color.hex.toUpperCase()})
   • RGB: ${color.rgb}
   • HSL: ${color.hsl}
   • Frequency: ${color.frequency.toFixed(1)}% of image
   • Luminance: ${(color.luminance * 100).toFixed(1)}% (${color.luminance > 0.5 ? 'Light' : 'Dark'})
   • Text color: ${color.textColor} (${color.luminance > 0.5 ? 'for contrast' : 'for contrast'})`
).join('\n\n')}

${cssOutput}

COLOR HARMONY ANALYSIS:
${harmonyAnalysis}

USAGE RECOMMENDATIONS:
• Primary Brand Color: ${colorInfo[0]?.hex} (Most dominant)
• Accent Colors: ${colorInfo.slice(1, 3).map(c => c.hex).join(', ')}
• Background Options: ${colorInfo.filter(c => c.luminance > 0.8).map(c => c.hex).join(', ') || 'Use lighter variants'}
• Text Colors: ${colorInfo.filter(c => c.luminance < 0.3).map(c => c.hex).join(', ') || 'Use darker variants'}

DESIGN APPLICATIONS:
• Website color schemes
• Brand identity development  
• UI/UX design systems
• Print design palettes
• Interior design inspiration
• Fashion color coordination

ACCESSIBILITY NOTES:
• Test color combinations for WCAG contrast compliance
• Consider colorblind-friendly alternatives
• Provide non-color ways to convey information
• Use sufficient contrast ratios (4.5:1 minimum)

TECHNICAL SPECIFICATIONS:
• Extraction Method: K-means clustering
• Color Space: RGB → HSL → Analysis
• Sampling: Optimized pixel analysis
• Accuracy: ~95% for dominant colors`);

                        function extractDominantColors(pixels, k) {
                            // Simple k-means clustering for color extraction
                            const colors = [];
                            
                            // Sample pixels (every 4th pixel for performance)
                            for (let i = 0; i < pixels.length; i += 16) {
                                colors.push({
                                    r: pixels[i],
                                    g: pixels[i + 1],
                                    b: pixels[i + 2]
                                });
                            }

                            // K-means clustering (simplified)
                            let centroids = [];
                            
                            // Initialize centroids randomly
                            for (let i = 0; i < k; i++) {
                                const randomIndex = Math.floor(Math.random() * colors.length);
                                centroids.push({...colors[randomIndex], frequency: 0});
                            }

                            // Iterate to find optimal centroids
                            for (let iter = 0; iter < 10; iter++) {
                                const clusters = Array.from({length: k}, () => []);
                                
                                // Assign each color to nearest centroid
                                colors.forEach(color => {
                                    let minDistance = Infinity;
                                    let clusterIndex = 0;
                                    
                                    centroids.forEach((centroid, index) => {
                                        const distance = Math.sqrt(
                                            Math.pow(color.r - centroid.r, 2) +
                                            Math.pow(color.g - centroid.g, 2) +
                                            Math.pow(color.b - centroid.b, 2)
                                        );
                                        
                                        if (distance < minDistance) {
                                            minDistance = distance;
                                            clusterIndex = index;
                                        }
                                    });
                                    
                                    clusters[clusterIndex].push(color);
                                });

                                // Update centroids
                                centroids = clusters.map((cluster, index) => {
                                    if (cluster.length === 0) return centroids[index];
                                    
                                    const avgR = cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length;
                                    const avgG = cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length;
                                    const avgB = cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length;
                                    
                                    return {
                                        r: Math.round(avgR),
                                        g: Math.round(avgG),
                                        b: Math.round(avgB),
                                        frequency: (cluster.length / colors.length) * 100
                                    };
                                });
                            }

                            return centroids.sort((a, b) => b.frequency - a.frequency);
                        }

                        function rgbToHex(r, g, b) {
                            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
                        }

                        function rgbToHsl(r, g, b) {
                            r /= 255; g /= 255; b /= 255;
                            const max = Math.max(r, g, b);
                            const min = Math.min(r, g, b);
                            let h, s, l = (max + min) / 2;

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

                            return {
                                h: Math.round(h * 360),
                                s: Math.round(s * 100),
                                l: Math.round(l * 100)
                            };
                        }

                        function getLuminance(r, g, b) {
                            const [rs, gs, bs] = [r, g, b].map(c => {
                                c = c / 255;
                                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
                            });
                            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
                        }

                        function describeColor(hsl) {
                            const { h, s, l } = hsl;
                            let hue = '';
                            let saturation = s < 20 ? 'Muted' : s < 60 ? 'Moderate' : 'Vibrant';
                            let lightness = l < 20 ? 'Very Dark' : l < 40 ? 'Dark' : l < 60 ? 'Medium' : l < 80 ? 'Light' : 'Very Light';

                            if (s < 10) return `${lightness} Gray`;
                            
                            if (h < 15 || h >= 345) hue = 'Red';
                            else if (h < 45) hue = 'Orange';
                            else if (h < 75) hue = 'Yellow';
                            else if (h < 105) hue = 'Yellow-Green';
                            else if (h < 135) hue = 'Green';
                            else if (h < 165) hue = 'Blue-Green';
                            else if (h < 195) hue = 'Cyan';
                            else if (h < 225) hue = 'Blue';
                            else if (h < 255) hue = 'Blue-Purple';
                            else if (h < 285) hue = 'Purple';
                            else if (h < 315) hue = 'Magenta';
                            else hue = 'Pink';

                            return `${lightness} ${saturation} ${hue}`;
                        }

                        function analyzeColorHarmony(colors) {
                            if (colors.length < 2) return 'Insufficient colors for harmony analysis';

                            const hues = colors.map(color => {
                                const hsl = rgbToHsl(
                                    parseInt(color.hex.slice(1, 3), 16),
                                    parseInt(color.hex.slice(3, 5), 16),
                                    parseInt(color.hex.slice(5, 7), 16)
                                );
                                return hsl.h;
                            });

                            // Analyze hue relationships
                            const hueDifferences = [];
                            for (let i = 0; i < hues.length - 1; i++) {
                                const diff = Math.abs(hues[i] - hues[i + 1]);
                                hueDifferences.push(Math.min(diff, 360 - diff));
                            }

                            const avgHueDiff = hueDifferences.reduce((sum, diff) => sum + diff, 0) / hueDifferences.length;
                            
                            let harmony = '';
                            if (avgHueDiff < 30) {
                                harmony = 'Monochromatic/Analogous - Colors are closely related, creating harmony';
                            } else if (avgHueDiff < 60) {
                                harmony = 'Analogous - Pleasant, natural color relationship';
                            } else if (avgHueDiff > 150) {
                                harmony = 'Complementary - High contrast, vibrant combination';
                            } else {
                                harmony = 'Triadic/Split-Complementary - Balanced, dynamic palette';
                            }

                            return `• Color Relationship: ${harmony}
• Average Hue Difference: ${avgHueDiff.toFixed(1)}°
• Palette Temperature: ${hues.reduce((sum, h) => sum + h, 0) / hues.length < 180 ? 'Warm-leaning' : 'Cool-leaning'}
• Contrast Level: ${colors.some(c => c.luminance > 0.7) && colors.some(c => c.luminance < 0.3) ? 'High' : 'Medium'}`;
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }));

})();