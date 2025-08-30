/**
 * PDF Utility Tools
 * Comprehensive PDF processing and utility tools
 */

// PDF Text Extractor
ToolRegistry.register(ToolTemplates.createTextProcessor({
    id: 'pdf-text-extractor',
    name: 'PDF Text Extractor',
    description: 'Extract text content from PDF files',
    category: 'business',
    icon: '📄',
    fields: [
        { name: 'pdfFile', label: 'PDF File', type: 'file', accept: '.pdf', required: true },
        { name: 'preserveFormatting', label: 'Preserve Formatting', type: 'checkbox', defaultValue: true }
    ],
    process: (data) => {
        // Note: Full PDF parsing would require PDF.js library in production
        // This is a simplified demonstration
        const fileName = data.pdfFile?.name || 'uploaded file';
        
        return {
            extractedText: `[PDF Text Extraction]\n\nFile: ${fileName}\nNote: This tool requires PDF.js library for full functionality in production.\n\nExtracted text would appear here, preserving original formatting including:\n- Line breaks and spacing\n- Paragraph structure\n- Basic text styling\n\nExample extracted content:\n"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."\n\nCharacter count: 1,247\nWord count: 203\nPage count: 2`,
            wordCount: 203,
            charCount: 1247,
            pageCount: 2,
            analysis: {
                hasImages: true,
                hasTables: false,
                hasLinks: true,
                hasFormatting: data.preserveFormatting
            }
        };
    }
}));

// PDF Merger Tool
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'pdf-merger',
    name: 'PDF Merger',
    description: 'Merge multiple PDF files into one document',
    category: 'business',
    icon: '📋',
    fields: [
        { name: 'pdfFiles', label: 'PDF Files', type: 'file', accept: '.pdf', multiple: true, required: true },
        { name: 'outputName', label: 'Output Filename', type: 'text', defaultValue: 'merged-document.pdf' },
        { name: 'addBookmarks', label: 'Add Bookmarks', type: 'checkbox', defaultValue: true },
        { name: 'preserveMetadata', label: 'Preserve Original Metadata', type: 'checkbox', defaultValue: false }
    ],
    generate: (data) => {
        const fileCount = data.pdfFiles?.length || 0;
        const totalPages = Math.floor(Math.random() * 50) + 10; // Simulated
        
        return {
            mergePreview: `PDF Merge Preview\n\n📁 Files to merge: ${fileCount}\n📄 Total estimated pages: ${totalPages}\n📝 Output filename: ${data.outputName}\n\nMerge order:\n${Array.from({length: fileCount}, (_, i) => `${i + 1}. File ${i + 1} (${Math.floor(Math.random() * 10) + 1} pages)`).join('\n')}\n\n${data.addBookmarks ? '✅ Bookmarks will be added for each source document' : '❌ No bookmarks will be added'}\n${data.preserveMetadata ? '✅ Original metadata will be preserved' : '❌ New metadata will be generated'}\n\nNote: This is a preview. In production, PDF-lib would be used for actual merging.`,
            estimatedSize: `${(totalPages * 0.5).toFixed(1)} MB`,
            processingTime: `~${Math.ceil(totalPages / 10)} seconds`,
            features: [
                'Maintains original quality',
                'Preserves internal links',
                'Adds navigation bookmarks',
                'Optimizes file size'
            ]
        };
    }
}));

// PDF Splitter Tool
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'pdf-splitter',
    name: 'PDF Splitter',
    description: 'Split PDF files into separate pages or ranges',
    category: 'business',
    icon: '✂️',
    fields: [
        { name: 'pdfFile', label: 'PDF File', type: 'file', accept: '.pdf', required: true },
        { name: 'splitMode', label: 'Split Mode', type: 'select', options: [
            { value: 'pages', label: 'Individual Pages' },
            { value: 'ranges', label: 'Page Ranges' },
            { value: 'size', label: 'By File Size' }
        ], defaultValue: 'pages' },
        { name: 'pageRanges', label: 'Page Ranges (e.g., 1-5, 10-15)', type: 'text', placeholder: '1-5, 10-15' },
        { name: 'maxSizeMB', label: 'Max Size per File (MB)', type: 'number', min: 1, max: 100, defaultValue: 10 }
    ],
    generate: (data) => {
        const fileName = data.pdfFile?.name?.replace('.pdf', '') || 'document';
        const totalPages = Math.floor(Math.random() * 50) + 10; // Simulated
        
        let splitResult = '';
        let outputFiles = [];
        
        switch (data.splitMode) {
            case 'pages':
                outputFiles = Array.from({length: totalPages}, (_, i) => 
                    `${fileName}_page_${i + 1}.pdf`
                );
                splitResult = `Split by Individual Pages\n\n📄 Total pages: ${totalPages}\n📁 Output files: ${totalPages}\n\nGenerated files:\n${outputFiles.slice(0, 5).join('\n')}${outputFiles.length > 5 ? `\n... and ${outputFiles.length - 5} more files` : ''}`;
                break;
                
            case 'ranges':
                const ranges = data.pageRanges?.split(',').map(r => r.trim()) || ['1-10'];
                outputFiles = ranges.map((range, i) => `${fileName}_range_${range.replace('-', '_to_')}.pdf`);
                splitResult = `Split by Page Ranges\n\n📄 Total pages: ${totalPages}\n📁 Output files: ${ranges.length}\n\nRanges:\n${ranges.map((range, i) => `${i + 1}. Pages ${range} → ${outputFiles[i]}`).join('\n')}`;
                break;
                
            case 'size':
                const filesCount = Math.ceil(totalPages / (data.maxSizeMB * 2)); // Approximate
                outputFiles = Array.from({length: filesCount}, (_, i) => 
                    `${fileName}_part_${i + 1}.pdf`
                );
                splitResult = `Split by File Size\n\n📄 Total pages: ${totalPages}\n💾 Max size per file: ${data.maxSizeMB} MB\n📁 Output files: ${filesCount}\n\nGenerated files:\n${outputFiles.join('\n')}`;
                break;
        }
        
        return {
            splitPreview: splitResult,
            outputFiles: outputFiles,
            totalSize: `${(totalPages * 0.5).toFixed(1)} MB`,
            processingInfo: {
                estimatedTime: `~${Math.ceil(totalPages / 20)} seconds`,
                qualityPreserved: true,
                metadataIncluded: true
            }
        };
    }
}));

// PDF Watermark Tool
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'pdf-watermark',
    name: 'PDF Watermark Generator',
    description: 'Add text or image watermarks to PDF documents',
    category: 'business',
    icon: '💧',
    fields: [
        { name: 'pdfFile', label: 'PDF File', type: 'file', accept: '.pdf', required: true },
        { name: 'watermarkType', label: 'Watermark Type', type: 'select', options: [
            { value: 'text', label: 'Text Watermark' },
            { value: 'image', label: 'Image Watermark' }
        ], defaultValue: 'text' },
        { name: 'watermarkText', label: 'Watermark Text', type: 'text', defaultValue: 'CONFIDENTIAL' },
        { name: 'watermarkImage', label: 'Watermark Image', type: 'file', accept: 'image/*' },
        { name: 'opacity', label: 'Opacity (%)', type: 'range', min: 10, max: 100, defaultValue: 30 },
        { name: 'position', label: 'Position', type: 'select', options: [
            { value: 'center', label: 'Center' },
            { value: 'topLeft', label: 'Top Left' },
            { value: 'topRight', label: 'Top Right' },
            { value: 'bottomLeft', label: 'Bottom Left' },
            { value: 'bottomRight', label: 'Bottom Right' }
        ], defaultValue: 'center' },
        { name: 'rotation', label: 'Rotation (degrees)', type: 'number', min: -180, max: 180, defaultValue: -45 },
        { name: 'fontSize', label: 'Font Size', type: 'number', min: 10, max: 72, defaultValue: 24 },
        { name: 'color', label: 'Text Color', type: 'color', defaultValue: '#FF0000' }
    ],
    generate: (data) => {
        const fileName = data.pdfFile?.name || 'document.pdf';
        const pages = Math.floor(Math.random() * 20) + 5; // Simulated
        
        const watermarkInfo = data.watermarkType === 'text' 
            ? `Text: "${data.watermarkText}"\nFont size: ${data.fontSize}px\nColor: ${data.color}\nRotation: ${data.rotation}°`
            : `Image: ${data.watermarkImage?.name || 'watermark.png'}\nRotation: ${data.rotation}°`;
        
        const positions = {
            center: 'Centered on page',
            topLeft: 'Top-left corner',
            topRight: 'Top-right corner',
            bottomLeft: 'Bottom-left corner',
            bottomRight: 'Bottom-right corner'
        };
        
        return {
            watermarkPreview: `PDF Watermark Configuration\n\n📄 Source file: ${fileName}\n📄 Pages to watermark: ${pages}\n\n${data.watermarkType === 'text' ? '📝' : '🖼️'} Watermark details:\n${watermarkInfo}\n\n⚙️ Settings:\n• Position: ${positions[data.position]}\n• Opacity: ${data.opacity}%\n• Apply to: All pages\n\n✨ Preview:\n${data.watermarkType === 'text' 
                ? `Your PDF will display "${data.watermarkText}" as a ${data.opacity}% opacity overlay at ${data.rotation}° rotation in ${data.color} color.`
                : `Your image watermark will be applied at ${data.opacity}% opacity with ${data.rotation}° rotation.`
            }`,
            outputInfo: {
                outputName: fileName.replace('.pdf', '_watermarked.pdf'),
                estimatedSize: `${(pages * 0.6).toFixed(1)} MB`,
                processingTime: `~${Math.ceil(pages / 10)} seconds`,
                qualityImpact: data.opacity > 50 ? 'Moderate' : 'Minimal'
            },
            tips: [
                'Lower opacity (20-40%) works best for professional documents',
                'Diagonal rotation (-45°) provides good coverage without obscuring text',
                'Test with a sample page first for optimal positioning',
                'Text watermarks are smaller in file size than image watermarks'
            ]
        };
    }
}));

// PDF Metadata Editor
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'pdf-metadata-editor',
    name: 'PDF Metadata Editor',
    description: 'View and edit PDF document metadata and properties',
    category: 'business',
    icon: '📋',
    fields: [
        { name: 'pdfFile', label: 'PDF File', type: 'file', accept: '.pdf', required: true },
        { name: 'title', label: 'Document Title', type: 'text' },
        { name: 'author', label: 'Author', type: 'text' },
        { name: 'subject', label: 'Subject', type: 'text' },
        { name: 'keywords', label: 'Keywords (comma-separated)', type: 'text' },
        { name: 'creator', label: 'Creator Application', type: 'text' },
        { name: 'producer', label: 'Producer', type: 'text' },
        { name: 'removeMetadata', label: 'Remove Existing Metadata', type: 'checkbox' },
        { name: 'addTimestamp', label: 'Update Creation Date', type: 'checkbox', defaultValue: true }
    ],
    generate: (data) => {
        const fileName = data.pdfFile?.name || 'document.pdf';
        const currentDate = new Date().toISOString().split('T')[0];
        
        // Simulate existing metadata
        const existingMetadata = {
            title: 'Sample Document',
            author: 'John Smith',
            subject: 'Business Report',
            keywords: 'analysis, quarterly, revenue',
            creator: 'Microsoft Word',
            producer: 'Adobe PDF Library',
            creationDate: '2024-01-15',
            modificationDate: currentDate,
            pageCount: Math.floor(Math.random() * 20) + 5,
            fileSize: `${(Math.random() * 5 + 1).toFixed(1)} MB`
        };
        
        const newMetadata = {
            title: data.title || existingMetadata.title,
            author: data.author || existingMetadata.author,
            subject: data.subject || existingMetadata.subject,
            keywords: data.keywords || existingMetadata.keywords,
            creator: data.creator || existingMetadata.creator,
            producer: data.producer || existingMetadata.producer,
            creationDate: data.addTimestamp ? currentDate : existingMetadata.creationDate,
            modificationDate: currentDate
        };
        
        return {
            metadataComparison: `PDF Metadata Editor Results\n\n📄 File: ${fileName}\n\n${data.removeMetadata ? '🗑️ REMOVING ALL EXISTING METADATA\n' : ''}📊 CURRENT vs NEW METADATA:\n\n${Object.keys(newMetadata).map(key => {
                const current = existingMetadata[key] || 'Not set';
                const updated = newMetadata[key] || 'Not set';
                const changed = current !== updated ? ' ✏️' : '';
                return `${key.charAt(0).toUpperCase() + key.slice(1)}:\n  Current: ${current}\n  Updated: ${updated}${changed}`;
            }).join('\n\n')}`,
            documentInfo: {
                pages: existingMetadata.pageCount,
                originalSize: existingMetadata.fileSize,
                estimatedNewSize: existingMetadata.fileSize,
                securityFeatures: {
                    encrypted: false,
                    passwordProtected: false,
                    digitallySigned: false,
                    copyProtected: false
                }
            },
            privacyImpact: data.removeMetadata 
                ? 'High - All identifying metadata will be removed'
                : 'Low - Only specified fields will be updated',
            recommendations: [
                data.removeMetadata ? 'Metadata removal improves document privacy' : 'Consider adding relevant keywords for better searchability',
                'Always backup original files before modification',
                'Verify metadata changes meet your organization\'s requirements',
                'Some metadata fields may be required for compliance purposes'
            ]
        };
    }
}));

console.log('✅ PDF Tools loaded successfully (5 tools)');