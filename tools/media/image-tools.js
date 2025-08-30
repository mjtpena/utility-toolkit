// Image Processing Tools
(function() {
    'use strict';

    // 1. Image Resizer & Format Converter
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'image-resizer-converter',
        name: 'Image Resizer & Format Converter',
        description: 'Resize images and convert between formats (client-side)',
        category: 'image',
        icon: '🖼️',
        fields: [
            {
                name: 'imageFile',
                label: 'Select Image File',
                type: 'file',
                accept: 'image/*',
                required: true
            },
            {
                name: 'resizeMode',
                label: 'Resize Mode',
                type: 'select',
                options: [
                    { value: 'exact', label: 'Exact Dimensions' },
                    { value: 'aspectRatio', label: 'Maintain Aspect Ratio' },
                    { value: 'crop', label: 'Crop to Fit' },
                    { value: 'percentage', label: 'Percentage Scale' }
                ],
                value: 'aspectRatio'
            },
            {
                name: 'targetWidth',
                label: 'Target Width (px)',
                type: 'number',
                value: '800',
                min: '1',
                max: '4000'
            },
            {
                name: 'targetHeight',
                label: 'Target Height (px)',
                type: 'number',
                value: '600',
                min: '1',
                max: '4000'
            },
            {
                name: 'scalePercentage',
                label: 'Scale Percentage (%)',
                type: 'number',
                value: '50',
                min: '1',
                max: '200'
            },
            {
                name: 'outputFormat',
                label: 'Output Format',
                type: 'select',
                options: [
                    { value: 'jpeg', label: 'JPEG' },
                    { value: 'png', label: 'PNG' },
                    { value: 'webp', label: 'WebP' }
                ],
                value: 'jpeg'
            },
            {
                name: 'quality',
                label: 'Quality (for JPEG/WebP)',
                type: 'number',
                value: '85',
                min: '1',
                max: '100'
            }
        ],
        convert: (data) => {
            return new Promise((resolve, reject) => {
                const file = data.imageFile;
                if (!file || !file.type.startsWith('image/')) {
                    reject(new Error('Please select a valid image file'));
                    return;
                }

                const resizeMode = data.resizeMode;
                const targetWidth = parseInt(data.targetWidth);
                const targetHeight = parseInt(data.targetHeight);
                const scalePercentage = parseInt(data.scalePercentage);
                const outputFormat = data.outputFormat;
                const quality = parseInt(data.quality) / 100;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        const originalWidth = img.width;
                        const originalHeight = img.height;
                        let newWidth, newHeight;

                        // Calculate new dimensions based on resize mode
                        switch (resizeMode) {
                            case 'exact':
                                newWidth = targetWidth;
                                newHeight = targetHeight;
                                break;
                            case 'aspectRatio':
                                const aspectRatio = originalWidth / originalHeight;
                                if (targetWidth / targetHeight > aspectRatio) {
                                    newWidth = targetHeight * aspectRatio;
                                    newHeight = targetHeight;
                                } else {
                                    newWidth = targetWidth;
                                    newHeight = targetWidth / aspectRatio;
                                }
                                break;
                            case 'crop':
                                newWidth = targetWidth;
                                newHeight = targetHeight;
                                break;
                            case 'percentage':
                                newWidth = originalWidth * (scalePercentage / 100);
                                newHeight = originalHeight * (scalePercentage / 100);
                                break;
                        }

                        canvas.width = newWidth;
                        canvas.height = newHeight;

                        // Apply high-quality scaling
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';

                        if (resizeMode === 'crop') {
                            // Center crop
                            const scale = Math.max(newWidth / originalWidth, newHeight / originalHeight);
                            const scaledWidth = originalWidth * scale;
                            const scaledHeight = originalHeight * scale;
                            const offsetX = (scaledWidth - newWidth) / 2;
                            const offsetY = (scaledHeight - newHeight) / 2;
                            
                            ctx.drawImage(img, -offsetX, -offsetY, scaledWidth, scaledHeight);
                        } else {
                            ctx.drawImage(img, 0, 0, newWidth, newHeight);
                        }

                        // Convert to desired format
                        const mimeType = `image/${outputFormat}`;
                        const dataUrl = canvas.toDataURL(mimeType, quality);
                        
                        // Calculate file sizes
                        const originalSize = file.size;
                        const newSize = Math.round((dataUrl.length - 22) * 3 / 4); // Approximate size from base64
                        const compression = originalSize > 0 ? ((originalSize - newSize) / originalSize * 100) : 0;

                        // Create download link
                        const link = document.createElement('a');
                        link.download = `resized-${file.name.replace(/\.[^/.]+$/, '')}.${outputFormat}`;
                        link.href = dataUrl;

                        resolve(`IMAGE PROCESSING COMPLETE

Original Dimensions: ${originalWidth} × ${originalHeight}px
New Dimensions: ${Math.round(newWidth)} × ${Math.round(newHeight)}px
Original Size: ${(originalSize / 1024).toFixed(1)} KB
New Size: ${(newSize / 1024).toFixed(1)} KB
Compression: ${compression.toFixed(1)}%
Format: ${file.type} → ${mimeType}
Resize Mode: ${resizeMode}

PROCESSED IMAGE:
<div style="text-align: center; margin: 20px 0;">
    <img src="${dataUrl}" style="max-width: 100%; max-height: 400px; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

<div style="text-align: center; margin: 20px 0;">
    <button onclick="downloadImage('${dataUrl}', '${link.download}')" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download Processed Image</button>
</div>

<script>
function downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

PROCESSING DETAILS:
• Original format: ${file.type}
• Output format: ${mimeType}
• Quality setting: ${Math.round(quality * 100)}%
• Resize algorithm: ${resizeMode}
• Aspect ratio: ${(originalWidth / originalHeight).toFixed(2)}:1

OPTIMIZATION TIPS:
• Use WebP for best compression (smaller files)
• JPEG for photos, PNG for graphics with transparency
• Quality 80-85% offers good balance of size vs quality
• Consider progressive JPEG for web use
• WebP can be 25-35% smaller than equivalent JPEG

WEB USAGE:
<img src="processed-image.${outputFormat}" 
     alt="Processed image" 
     width="${Math.round(newWidth)}" 
     height="${Math.round(newHeight)}"
     loading="lazy"/>

CSS RESPONSIVE:
.responsive-image {
    width: 100%;
    height: auto;
    max-width: ${Math.round(newWidth)}px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}`);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }));

    // 2. Image Metadata Extractor
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'image-metadata-extractor',
        name: 'Image Metadata Extractor',
        description: 'Extract EXIF data and metadata from images',
        category: 'image',
        icon: '📊',
        fields: [
            {
                name: 'imageFile',
                label: 'Select Image File',
                type: 'file',
                accept: 'image/*',
                required: true
            }
        ],
        convert: (data) => {
            return new Promise((resolve, reject) => {
                const file = data.imageFile;
                if (!file || !file.type.startsWith('image/')) {
                    reject(new Error('Please select a valid image file'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        // Basic image information
                        const basicInfo = {
                            filename: file.name,
                            fileSize: file.size,
                            mimeType: file.type,
                            lastModified: new Date(file.lastModified),
                            dimensions: `${img.width} × ${img.height}`,
                            aspectRatio: (img.width / img.height).toFixed(2),
                            megapixels: ((img.width * img.height) / 1000000).toFixed(1),
                            colorDepth: '24-bit (estimated)',
                            compression: file.type === 'image/jpeg' ? 'JPEG' : file.type === 'image/png' ? 'PNG' : 'Unknown'
                        };

                        // Calculate additional metrics
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);

                        let dominantColors = [];
                        let brightness = 0;
                        
                        try {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imageData.data;
                            
                            // Sample pixels for analysis (every 10th pixel to avoid performance issues)
                            const sampleSize = Math.min(10000, data.length / 4);
                            const colorCounts = {};
                            let totalBrightness = 0;
                            
                            for (let i = 0; i < sampleSize * 4; i += 40) { // Every 10th pixel
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                
                                // Calculate brightness
                                const pixelBrightness = (r * 0.299 + g * 0.587 + b * 0.114);
                                totalBrightness += pixelBrightness;
                                
                                // Group similar colors
                                const colorKey = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
                                colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
                            }
                            
                            brightness = Math.round(totalBrightness / sampleSize);
                            
                            // Get top 5 dominant colors
                            dominantColors = Object.entries(colorCounts)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 5)
                                .map(([color, count]) => {
                                    const [r, g, b] = color.split(',').map(Number);
                                    return {
                                        rgb: `rgb(${r}, ${g}, ${b})`,
                                        hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`,
                                        percentage: ((count / sampleSize) * 100).toFixed(1)
                                    };
                                });
                        } catch (error) {
                            console.warn('Could not analyze image colors:', error);
                        }

                        // Create color palette display
                        const colorPalette = dominantColors.length > 0 ? `
                        <div style="margin: 20px 0;">
                            <strong>Dominant Colors:</strong>
                            <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                                ${dominantColors.map(color => `
                                    <div style="text-align: center;">
                                        <div style="
                                            width: 60px;
                                            height: 60px;
                                            background: ${color.rgb};
                                            border: 2px solid #ddd;
                                            border-radius: 8px;
                                            margin-bottom: 5px;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                                        "></div>
                                        <div style="font-size: 11px; color: #666;">
                                            ${color.hex}<br>
                                            ${color.percentage}%
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>` : '';

                        // Image classification
                        const classification = classifyImage(basicInfo, brightness);
                        
                        // Calculate compression ratio
                        const uncompressedSize = img.width * img.height * 3; // 3 bytes per pixel (RGB)
                        const compressionRatio = (uncompressedSize / file.size).toFixed(1);

                        resolve(`IMAGE METADATA ANALYSIS

File Information:
• Filename: ${basicInfo.filename}
• File Size: ${(basicInfo.fileSize / 1024).toFixed(1)} KB (${basicInfo.fileSize.toLocaleString()} bytes)
• Format: ${basicInfo.mimeType}
• Last Modified: ${basicInfo.lastModified.toLocaleString()}

Image Properties:
• Dimensions: ${basicInfo.dimensions} pixels
• Aspect Ratio: ${basicInfo.aspectRatio}:1
• Megapixels: ${basicInfo.megapixels} MP
• Color Depth: ${basicInfo.colorDepth}
• Compression: ${basicInfo.compression}
• Compression Ratio: ${compressionRatio}:1

Visual Analysis:
• Average Brightness: ${brightness}/255 (${((brightness/255)*100).toFixed(0)}%)
• Classification: ${classification.type}
• Recommended Use: ${classification.usage}

IMAGE PREVIEW:
<div style="text-align: center; margin: 20px 0;">
    <img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

${colorPalette}

TECHNICAL DETAILS:
• Estimated uncompressed size: ${(uncompressedSize / 1024 / 1024).toFixed(1)} MB
• Compression efficiency: ${(((uncompressedSize - file.size) / uncompressedSize) * 100).toFixed(1)}%
• Pixels per KB: ${Math.round((img.width * img.height) / (file.size / 1024))}
• DPI estimate: 72 (standard web resolution)

WEB OPTIMIZATION:
• Current format: ${file.type}
• Recommended formats: ${getRecommendedFormats(basicInfo, brightness)}
• Loading recommendation: ${img.width * img.height > 1000000 ? 'Use lazy loading' : 'Standard loading'}
• Responsive images: Consider multiple sizes for different devices

SEO ATTRIBUTES:
<img src="${basicInfo.filename}" 
     alt="Image description here"
     width="${img.width}" 
     height="${img.height}"
     loading="${img.width * img.height > 500000 ? 'lazy' : 'eager'}"
     decoding="async"/>

ACCESSIBILITY:
• Add descriptive alt text
• Consider image contrast for overlaid text
• Provide text alternatives for informational images
• Use appropriate heading structure if image contains text

PERFORMANCE TIPS:
${generatePerformanceTips(basicInfo, file.size, img.width * img.height)}`);

                        function classifyImage(info, brightness) {
                            const aspectRatio = parseFloat(info.aspectRatio);
                            const megapixels = parseFloat(info.megapixels);
                            
                            if (aspectRatio > 2.5 || aspectRatio < 0.4) {
                                return {
                                    type: 'Banner/Header Image',
                                    usage: 'Website headers, banners, or panoramic displays'
                                };
                            } else if (Math.abs(aspectRatio - 1) < 0.1) {
                                return {
                                    type: 'Square Image',
                                    usage: 'Social media posts, profile pictures, or thumbnails'
                                };
                            } else if (megapixels > 10) {
                                return {
                                    type: 'High-Resolution Photo',
                                    usage: 'Print media, detailed photography, or large displays'
                                };
                            } else if (brightness < 100) {
                                return {
                                    type: 'Dark Image',
                                    usage: 'Backgrounds, moody photography, or night scenes'
                                };
                            } else if (brightness > 180) {
                                return {
                                    type: 'Bright Image',
                                    usage: 'Product photography, clean designs, or daylight scenes'
                                };
                            } else {
                                return {
                                    type: 'Standard Photo',
                                    usage: 'General web use, content images, or documentation'
                                };
                            }
                        }

                        function getRecommendedFormats(info, brightness) {
                            const formats = [];
                            
                            if (info.mimeType === 'image/png' && brightness < 200) {
                                formats.push('JPEG for smaller file size');
                            }
                            if (info.mimeType === 'image/jpeg') {
                                formats.push('WebP for 25-35% smaller files');
                            }
                            formats.push('AVIF for next-gen browsers (50% smaller)');
                            
                            return formats.join(', ');
                        }

                        function generatePerformanceTips(info, fileSize, pixelCount) {
                            const tips = [];
                            
                            if (fileSize > 500000) {
                                tips.push('• File is large (>500KB) - consider compression or resizing');
                            }
                            if (pixelCount > 2000000) {
                                tips.push('• High resolution detected - provide multiple sizes for responsive design');
                            }
                            if (info.mimeType === 'image/png' && fileSize > 200000) {
                                tips.push('• PNG is large - consider JPEG for photos, PNG for graphics only');
                            }
                            tips.push('• Use modern formats (WebP, AVIF) with fallbacks');
                            tips.push('• Implement lazy loading for images below the fold');
                            tips.push('• Consider using a CDN for faster delivery');
                            
                            return tips.join('\n');
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }));

    // 3. Image Filter Effects
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'image-filter-effects',
        name: 'Image Filter Effects',
        description: 'Apply filters and effects to images (grayscale, blur, etc.)',
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
                name: 'filterType',
                label: 'Filter Effect',
                type: 'select',
                options: [
                    { value: 'grayscale', label: 'Grayscale' },
                    { value: 'sepia', label: 'Sepia' },
                    { value: 'blur', label: 'Blur' },
                    { value: 'brightness', label: 'Brightness Adjust' },
                    { value: 'contrast', label: 'Contrast Adjust' },
                    { value: 'vintage', label: 'Vintage' },
                    { value: 'invert', label: 'Invert Colors' },
                    { value: 'polaroid', label: 'Polaroid' }
                ],
                value: 'grayscale'
            },
            {
                name: 'intensity',
                label: 'Effect Intensity (%)',
                type: 'number',
                value: '100',
                min: '0',
                max: '200'
            }
        ],
        convert: (data) => {
            return new Promise((resolve, reject) => {
                const file = data.imageFile;
                if (!file || !file.type.startsWith('image/')) {
                    reject(new Error('Please select a valid image file'));
                    return;
                }

                const filterType = data.filterType;
                const intensity = parseInt(data.intensity);

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        ctx.drawImage(img, 0, 0);

                        // Apply filter effects
                        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const data = imageData.data;

                        switch (filterType) {
                            case 'grayscale':
                                applyGrayscale(data, intensity);
                                break;
                            case 'sepia':
                                applySepia(data, intensity);
                                break;
                            case 'brightness':
                                applyBrightness(data, intensity);
                                break;
                            case 'contrast':
                                applyContrast(data, intensity);
                                break;
                            case 'invert':
                                applyInvert(data, intensity);
                                break;
                            case 'vintage':
                                applyVintage(data, intensity);
                                break;
                            case 'polaroid':
                                applyPolaroid(data, intensity);
                                break;
                        }

                        ctx.putImageData(imageData, 0, 0);

                        // Apply canvas filters for effects that benefit from them
                        if (filterType === 'blur') {
                            ctx.filter = `blur(${Math.round(intensity / 10)}px)`;
                            ctx.drawImage(canvas, 0, 0);
                            ctx.filter = 'none';
                        }

                        const filteredDataUrl = canvas.toDataURL('image/png');

                        resolve(`IMAGE FILTER APPLIED

Filter: ${filterType}
Intensity: ${intensity}%
Original Dimensions: ${img.width} × ${img.height}px

ORIGINAL IMAGE:
<div style="text-align: center; margin: 20px 0;">
    <div style="display: inline-block; margin: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">Before</div>
        <img src="${e.target.result}" style="max-width: 300px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
    </div>
    <div style="display: inline-block; margin: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">After (${filterType})</div>
        <img src="${filteredDataUrl}" style="max-width: 300px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
    </div>
</div>

<div style="text-align: center; margin: 20px 0;">
    <button onclick="downloadFilteredImage('${filteredDataUrl}', '${filterType}-${file.name}')" style="
        background: #3498db;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">Download Filtered Image</button>
</div>

<script>
function downloadFilteredImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

CSS FILTER EQUIVALENT:
.${filterType}-filter {
    ${getCSSFilter(filterType, intensity)}
}

HTML USAGE:
<img src="your-image.jpg" class="${filterType}-filter" alt="Filtered image"/>

FILTER COMBINATIONS:
• ${filterType} + brightness: Adjust overall exposure
• ${filterType} + contrast: Enhance definition
• Multiple filters: Chain CSS filters for complex effects

PERFORMANCE NOTES:
• CSS filters are GPU-accelerated and performant
• Canvas filters provide more control but use more CPU
• Consider using CSS filters for hover effects
• Pre-processed images load faster than runtime filters`);

                        function applyGrayscale(data, intensity) {
                            const factor = intensity / 100;
                            for (let i = 0; i < data.length; i += 4) {
                                const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                                data[i] = data[i] * (1 - factor) + gray * factor;     // Red
                                data[i + 1] = data[i + 1] * (1 - factor) + gray * factor; // Green
                                data[i + 2] = data[i + 2] * (1 - factor) + gray * factor; // Blue
                            }
                        }

                        function applySepia(data, intensity) {
                            const factor = intensity / 100;
                            for (let i = 0; i < data.length; i += 4) {
                                const r = data[i];
                                const g = data[i + 1];
                                const b = data[i + 2];
                                
                                const newR = Math.min(255, (r * 0.393 + g * 0.769 + b * 0.189));
                                const newG = Math.min(255, (r * 0.349 + g * 0.686 + b * 0.168));
                                const newB = Math.min(255, (r * 0.272 + g * 0.534 + b * 0.131));
                                
                                data[i] = r * (1 - factor) + newR * factor;
                                data[i + 1] = g * (1 - factor) + newG * factor;
                                data[i + 2] = b * (1 - factor) + newB * factor;
                            }
                        }

                        function applyBrightness(data, intensity) {
                            const adjustment = (intensity - 100) * 2.55; // Convert percentage to 0-255 range
                            for (let i = 0; i < data.length; i += 4) {
                                data[i] = Math.max(0, Math.min(255, data[i] + adjustment));
                                data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + adjustment));
                                data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + adjustment));
                            }
                        }

                        function applyContrast(data, intensity) {
                            const contrast = intensity / 100;
                            const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
                            for (let i = 0; i < data.length; i += 4) {
                                data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
                                data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
                                data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
                            }
                        }

                        function applyInvert(data, intensity) {
                            const factor = intensity / 100;
                            for (let i = 0; i < data.length; i += 4) {
                                data[i] = data[i] * (1 - factor) + (255 - data[i]) * factor;
                                data[i + 1] = data[i + 1] * (1 - factor) + (255 - data[i + 1]) * factor;
                                data[i + 2] = data[i + 2] * (1 - factor) + (255 - data[i + 2]) * factor;
                            }
                        }

                        function applyVintage(data, intensity) {
                            const factor = intensity / 100;
                            for (let i = 0; i < data.length; i += 4) {
                                // Desaturate
                                const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                                data[i] = data[i] * (1 - factor * 0.3) + gray * factor * 0.3;
                                data[i + 1] = data[i + 1] * (1 - factor * 0.3) + gray * factor * 0.3;
                                data[i + 2] = data[i + 2] * (1 - factor * 0.3) + gray * factor * 0.3;
                                
                                // Add warm tone
                                data[i] = Math.min(255, data[i] + factor * 10); // Add red
                                data[i + 1] = Math.min(255, data[i + 1] + factor * 5); // Add slight green
                                data[i + 2] = Math.max(0, data[i + 2] - factor * 15); // Reduce blue
                            }
                        }

                        function applyPolaroid(data, intensity) {
                            const factor = intensity / 100;
                            for (let i = 0; i < data.length; i += 4) {
                                // Increase contrast slightly
                                data[i] = Math.max(0, Math.min(255, (data[i] - 128) * 1.1 + 128));
                                data[i + 1] = Math.max(0, Math.min(255, (data[i + 1] - 128) * 1.1 + 128));
                                data[i + 2] = Math.max(0, Math.min(255, (data[i + 2] - 128) * 1.1 + 128));
                                
                                // Add slight yellow tint
                                data[i] = Math.min(255, data[i] + factor * 8);
                                data[i + 1] = Math.min(255, data[i + 1] + factor * 5);
                                data[i + 2] = Math.max(0, data[i + 2] - factor * 3);
                            }
                        }

                        function getCSSFilter(type, intensity) {
                            switch (type) {
                                case 'grayscale':
                                    return `filter: grayscale(${intensity}%);`;
                                case 'sepia':
                                    return `filter: sepia(${intensity}%);`;
                                case 'blur':
                                    return `filter: blur(${Math.round(intensity / 10)}px);`;
                                case 'brightness':
                                    return `filter: brightness(${intensity}%);`;
                                case 'contrast':
                                    return `filter: contrast(${intensity}%);`;
                                case 'invert':
                                    return `filter: invert(${intensity}%);`;
                                case 'vintage':
                                    return `filter: sepia(${intensity * 0.6}%) saturate(${100 - intensity * 0.2}%) brightness(${100 + intensity * 0.1}%);`;
                                case 'polaroid':
                                    return `filter: contrast(${100 + intensity * 0.1}%) brightness(${100 + intensity * 0.05}%) sepia(${intensity * 0.2}%);`;
                                default:
                                    return `filter: none;`;
                            }
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }));

    // 4. Image Compressor
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'image-compressor',
        name: 'Image Compressor',
        description: 'Compress images for web optimization',
        category: 'image',
        icon: '📦',
        fields: [
            {
                name: 'imageFile',
                label: 'Select Image File',
                type: 'file',
                accept: 'image/*',
                required: true
            },
            {
                name: 'compressionLevel',
                label: 'Compression Level',
                type: 'select',
                options: [
                    { value: 'light', label: 'Light (High Quality - 85%)' },
                    { value: 'medium', label: 'Medium (Balanced - 70%)' },
                    { value: 'heavy', label: 'Heavy (Small Size - 50%)' },
                    { value: 'custom', label: 'Custom Quality' }
                ],
                value: 'medium'
            },
            {
                name: 'customQuality',
                label: 'Custom Quality (%)',
                type: 'number',
                value: '70',
                min: '1',
                max: '100'
            },
            {
                name: 'maxWidth',
                label: 'Max Width (px, 0 = no limit)',
                type: 'number',
                value: '1920',
                min: '0',
                max: '4000'
            },
            {
                name: 'maxHeight',
                label: 'Max Height (px, 0 = no limit)',
                type: 'number',
                value: '1080',
                min: '0',
                max: '4000'
            }
        ],
        convert: (data) => {
            return new Promise((resolve, reject) => {
                const file = data.imageFile;
                if (!file || !file.type.startsWith('image/')) {
                    reject(new Error('Please select a valid image file'));
                    return;
                }

                const compressionLevel = data.compressionLevel;
                const customQuality = parseInt(data.customQuality);
                const maxWidth = parseInt(data.maxWidth) || 0;
                const maxHeight = parseInt(data.maxHeight) || 0;

                // Get quality based on compression level
                const qualityMap = {
                    light: 85,
                    medium: 70,
                    heavy: 50,
                    custom: customQuality
                };
                const quality = qualityMap[compressionLevel] / 100;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        // Calculate new dimensions
                        let newWidth = img.width;
                        let newHeight = img.height;

                        if (maxWidth > 0 && newWidth > maxWidth) {
                            const ratio = maxWidth / newWidth;
                            newWidth = maxWidth;
                            newHeight = newHeight * ratio;
                        }

                        if (maxHeight > 0 && newHeight > maxHeight) {
                            const ratio = maxHeight / newHeight;
                            newHeight = maxHeight;
                            newWidth = newWidth * ratio;
                        }

                        canvas.width = newWidth;
                        canvas.height = newHeight;

                        // High-quality scaling
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        // Compress to JPEG
                        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                        
                        // Also create WebP version if supported
                        let webpDataUrl = '';
                        try {
                            webpDataUrl = canvas.toDataURL('image/webp', quality);
                        } catch (e) {
                            console.log('WebP not supported');
                        }

                        // Calculate compression statistics
                        const originalSize = file.size;
                        const jpegSize = Math.round((compressedDataUrl.length - 23) * 3 / 4);
                        const webpSize = webpDataUrl ? Math.round((webpDataUrl.length - 23) * 3 / 4) : 0;
                        
                        const jpegCompression = ((originalSize - jpegSize) / originalSize * 100);
                        const webpCompression = webpSize > 0 ? ((originalSize - webpSize) / originalSize * 100) : 0;

                        resolve(`IMAGE COMPRESSION COMPLETE

Original Image:
• Size: ${(originalSize / 1024).toFixed(1)} KB
• Dimensions: ${img.width} × ${img.height}px
• Format: ${file.type}

Compression Settings:
• Quality: ${Math.round(quality * 100)}% (${compressionLevel})
• Max Dimensions: ${maxWidth || 'unlimited'} × ${maxHeight || 'unlimited'}px
• Final Dimensions: ${Math.round(newWidth)} × ${Math.round(newHeight)}px

JPEG COMPRESSION:
• New Size: ${(jpegSize / 1024).toFixed(1)} KB
• Reduction: ${jpegCompression.toFixed(1)}%
• Quality: ${Math.round(quality * 100)}%

${webpSize > 0 ? `WEBP COMPRESSION:
• New Size: ${(webpSize / 1024).toFixed(1)} KB
• Reduction: ${webpCompression.toFixed(1)}%
• Additional savings vs JPEG: ${(((jpegSize - webpSize) / jpegSize) * 100).toFixed(1)}%` : ''}

COMPRESSED IMAGES:
<div style="text-align: center; margin: 20px 0;">
    <div style="display: inline-block; margin: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">Original (${(originalSize / 1024).toFixed(1)} KB)</div>
        <img src="${e.target.result}" style="max-width: 250px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
    </div>
    <div style="display: inline-block; margin: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">JPEG (${(jpegSize / 1024).toFixed(1)} KB)</div>
        <img src="${compressedDataUrl}" style="max-width: 250px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
        <div style="margin-top: 10px;">
            <button onclick="downloadCompressedImage('${compressedDataUrl}', 'compressed-${file.name.replace(/\.[^/.]+$/, '')}.jpg')" style="
                background: #27ae60;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Download JPEG</button>
        </div>
    </div>
    ${webpSize > 0 ? `
    <div style="display: inline-block; margin: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 10px;">WebP (${(webpSize / 1024).toFixed(1)} KB)</div>
        <img src="${webpDataUrl}" style="max-width: 250px; max-height: 200px; border: 2px solid #ddd; border-radius: 8px;"/>
        <div style="margin-top: 10px;">
            <button onclick="downloadCompressedImage('${webpDataUrl}', 'compressed-${file.name.replace(/\.[^/.]+$/, '')}.webp')" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            ">Download WebP</button>
        </div>
    </div>` : ''}
</div>

<script>
function downloadCompressedImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

COMPRESSION ANALYSIS:
• Pixel reduction: ${newWidth !== img.width || newHeight !== img.height ? 'Yes' : 'No'}
• Quality reduction: ${quality < 1 ? 'Yes' : 'No'}
• Format optimization: ${file.type !== 'image/jpeg' ? 'Converted to JPEG' : 'Optimized JPEG'}

WEB PERFORMANCE IMPACT:
• Load time improvement: ~${jpegCompression.toFixed(0)}% faster
• Bandwidth savings: ${((originalSize - jpegSize) / 1024).toFixed(1)} KB per image
• SEO benefit: Faster page load times improve rankings
• User experience: Reduced waiting time

RESPONSIVE IMAGE HTML:
<picture>
    ${webpSize > 0 ? `<source srcset="compressed-image.webp" type="image/webp">` : ''}
    <img src="compressed-image.jpg" alt="Compressed image" width="${Math.round(newWidth)}" height="${Math.round(newHeight)}" loading="lazy">
</picture>

COMPRESSION RECOMMENDATIONS:
${generateCompressionTips(originalSize, jpegSize, quality, newWidth * newHeight)}`);

                        function generateCompressionTips(originalSize, compressedSize, quality, pixels) {
                            const tips = [];
                            
                            if (compressedSize / originalSize > 0.7) {
                                tips.push('• Consider lower quality (50-60%) for web use');
                            }
                            if (pixels > 2000000) {
                                tips.push('• High resolution detected - consider multiple sizes for responsive design');
                            }
                            if (quality > 0.8) {
                                tips.push('• Quality above 80% may not provide visible benefits for web');
                            }
                            tips.push('• Always keep original files as masters');
                            tips.push('• Use WebP format for modern browsers (25-35% smaller)');
                            tips.push('• Consider progressive JPEG for large images');
                            
                            return tips.join('\n');
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }));

    // Continue with more image tools...

})();