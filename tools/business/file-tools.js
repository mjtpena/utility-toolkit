/**
 * File Utility Tools
 * Comprehensive file processing and manipulation utilities
 */

// File Hash Calculator
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'file-hash-calculator',
    name: 'File Hash Calculator',
    description: 'Calculate various hash values (MD5, SHA-1, SHA-256) for files',
    category: 'business',
    icon: '🔐',
    fields: [
        { name: 'file', label: 'Select File', type: 'file', required: true },
        { name: 'hashTypes', label: 'Hash Types', type: 'select', multiple: true, options: [
            { value: 'md5', label: 'MD5' },
            { value: 'sha1', label: 'SHA-1' },
            { value: 'sha256', label: 'SHA-256' },
            { value: 'sha512', label: 'SHA-512' }
        ], defaultValue: ['md5', 'sha256'] },
        { name: 'compareHash', label: 'Compare with known hash (optional)', type: 'text', placeholder: 'Enter hash to verify' },
        { name: 'outputFormat', label: 'Output Format', type: 'select', options: [
            { value: 'hex', label: 'Hexadecimal' },
            { value: 'base64', label: 'Base64' }
        ], defaultValue: 'hex' }
    ],
    generate: (data) => {
        const fileName = data.file?.name || 'selected-file';
        const fileSize = data.file?.size || Math.floor(Math.random() * 10000000);
        
        // Generate mock hashes (in production, would calculate actual hashes)
        const mockHashes = {
            md5: '5d41402abc4b2a76b9719d911017c592',
            sha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
            sha256: '2cf24dba4f21d4288094c31e5d8c3e9b5f7a9c1b2e3d4f5g6h7i8j9k0l1m2n3o4p',
            sha512: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043'
        };
        
        const selectedHashes = data.hashTypes || ['md5', 'sha256'];
        const calculatedHashes = {};
        
        selectedHashes.forEach(type => {
            if (mockHashes[type]) {
                calculatedHashes[type] = data.outputFormat === 'base64' 
                    ? btoa(mockHashes[type]).slice(0, 32)
                    : mockHashes[type];
            }
        });
        
        // Compare with provided hash if given
        let comparison = null;
        if (data.compareHash) {
            const match = Object.values(calculatedHashes).some(hash => 
                hash.toLowerCase() === data.compareHash.toLowerCase()
            );
            comparison = {
                provided: data.compareHash,
                matches: match,
                matchedType: match ? Object.keys(calculatedHashes)[0] : null
            };
        }
        
        return {
            fileInfo: `File Hash Analysis\n\n📁 File: ${fileName}\n💾 Size: ${formatBytes(fileSize)}\n🔐 Format: ${data.outputFormat.toUpperCase()}\n\n📊 Calculated Hashes:\n${Object.entries(calculatedHashes).map(([type, hash]) => `${type.toUpperCase()}: ${hash}`).join('\n')}\n\n${comparison ? `🔍 Hash Verification:\nProvided: ${comparison.provided}\nMatch: ${comparison.matches ? '✅ VERIFIED' : '❌ NO MATCH'}${comparison.matchedType ? ` (${comparison.matchedType.toUpperCase()})` : ''}\n\n` : ''}`,
            hashes: calculatedHashes,
            verification: comparison,
            integrity: {
                canVerify: !!data.compareHash,
                recommended: 'SHA-256 for security-critical applications',
                fileIntegrity: comparison ? comparison.matches : 'No reference hash provided',
                useCases: [
                    'Verify file downloads',
                    'Detect file corruption',
                    'Digital forensics',
                    'Data integrity checks'
                ]
            }
        };
    }
}));

// File Size Analyzer
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'file-size-analyzer',
    name: 'File Size Analyzer',
    description: 'Analyze file sizes and get detailed breakdown with optimization suggestions',
    category: 'business',
    icon: '📏',
    fields: [
        { name: 'files', label: 'Select Files', type: 'file', multiple: true, required: true },
        { name: 'analysisType', label: 'Analysis Type', type: 'select', options: [
            { value: 'individual', label: 'Individual Files' },
            { value: 'summary', label: 'Summary Statistics' },
            { value: 'comparison', label: 'Size Comparison' }
        ], defaultValue: 'individual' },
        { name: 'sortBy', label: 'Sort By', type: 'select', options: [
            { value: 'size', label: 'File Size' },
            { value: 'name', label: 'File Name' },
            { value: 'type', label: 'File Type' }
        ], defaultValue: 'size' }
    ],
    generate: (data) => {
        const files = data.files || [];
        const fileCount = files.length || Math.floor(Math.random() * 10) + 1;
        
        // Generate mock file data
        const mockFiles = Array.from({length: fileCount}, (_, i) => ({
            name: files[i]?.name || `file${i + 1}.${['txt', 'jpg', 'pdf', 'mp4', 'zip'][i % 5]}`,
            size: files[i]?.size || Math.floor(Math.random() * 50000000),
            type: files[i]?.type || ['text/plain', 'image/jpeg', 'application/pdf', 'video/mp4', 'application/zip'][i % 5]
        }));
        
        // Sort files
        switch (data.sortBy) {
            case 'size':
                mockFiles.sort((a, b) => b.size - a.size);
                break;
            case 'name':
                mockFiles.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'type':
                mockFiles.sort((a, b) => a.type.localeCompare(b.type));
                break;
        }
        
        const totalSize = mockFiles.reduce((sum, file) => sum + file.size, 0);
        const averageSize = totalSize / mockFiles.length;
        const largestFile = mockFiles.reduce((max, file) => file.size > max.size ? file : max, mockFiles[0]);
        const smallestFile = mockFiles.reduce((min, file) => file.size < min.size ? file : min, mockFiles[0]);
        
        // File type distribution
        const typeStats = {};
        mockFiles.forEach(file => {
            const category = getFileCategory(file.type);
            typeStats[category] = (typeStats[category] || 0) + file.size;
        });
        
        let analysis = '';
        switch (data.analysisType) {
            case 'individual':
                analysis = `Individual File Analysis\n\n📁 Files analyzed: ${fileCount}\n📊 Total size: ${formatBytes(totalSize)}\n\n📋 File Details:\n${mockFiles.map((file, i) => `${i + 1}. ${file.name}\n   Size: ${formatBytes(file.size)}\n   Type: ${file.type}\n   ${getSizeCategory(file.size)}`).join('\n\n')}`;
                break;
                
            case 'summary':
                analysis = `Summary Statistics\n\n📁 Total files: ${fileCount}\n💾 Total size: ${formatBytes(totalSize)}\n📈 Average size: ${formatBytes(averageSize)}\n\n🔝 Largest: ${largestFile.name} (${formatBytes(largestFile.size)})\n🔻 Smallest: ${smallestFile.name} (${formatBytes(smallestFile.size)})\n\n📊 Size Distribution:\n${Object.entries(typeStats).map(([type, size]) => `${type}: ${formatBytes(size)} (${((size/totalSize)*100).toFixed(1)}%)`).join('\n')}`;
                break;
                
            case 'comparison':
                analysis = `Size Comparison Analysis\n\n${mockFiles.map((file, i) => {
                    const percentage = ((file.size / totalSize) * 100).toFixed(1);
                    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
                    return `${file.name}\n${bar} ${percentage}% (${formatBytes(file.size)})`;
                }).join('\n\n')}`;
                break;
        }
        
        return {
            sizeAnalysis: analysis,
            statistics: {
                totalFiles: fileCount,
                totalSize: formatBytes(totalSize),
                averageSize: formatBytes(averageSize),
                largestFile: `${largestFile.name} - ${formatBytes(largestFile.size)}`,
                smallestFile: `${smallestFile.name} - ${formatBytes(smallestFile.size)}`
            },
            typeBreakdown: Object.entries(typeStats).map(([type, size]) => ({
                type: type,
                size: formatBytes(size),
                percentage: ((size/totalSize)*100).toFixed(1) + '%'
            })),
            optimization: generateOptimizationSuggestions(mockFiles, totalSize)
        };
    }
}));

// File Extension Converter
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'file-extension-converter',
    name: 'File Extension Info & Converter',
    description: 'Get detailed information about file extensions and conversion options',
    category: 'business',
    icon: '🔄',
    fields: [
        { name: 'fileName', label: 'File Name or Extension', type: 'text', required: true, placeholder: 'document.pdf or .pdf' },
        { name: 'targetFormat', label: 'Target Format (optional)', type: 'text', placeholder: '.docx' },
        { name: 'showTechnical', label: 'Show Technical Details', type: 'checkbox', defaultValue: true },
        { name: 'includeConverters', label: 'Include Conversion Tools', type: 'checkbox', defaultValue: true }
    ],
    generate: (data) => {
        const fileName = data.fileName.trim();
        const extension = fileName.startsWith('.') ? fileName : fileName.split('.').pop().toLowerCase();
        const cleanExt = extension.startsWith('.') ? extension : '.' + extension;
        
        const extensionInfo = getExtensionInfo(cleanExt);
        const conversionOptions = data.includeConverters ? getConversionOptions(cleanExt) : [];
        
        let targetInfo = null;
        if (data.targetFormat) {
            const targetExt = data.targetFormat.startsWith('.') ? data.targetFormat : '.' + data.targetFormat;
            targetInfo = getExtensionInfo(targetExt);
        }
        
        return {
            extensionAnalysis: `File Extension Analysis\n\n📁 Extension: ${cleanExt.toUpperCase()}\n📝 Type: ${extensionInfo.type}\n📋 Description: ${extensionInfo.description}\n\n${data.showTechnical ? `🔧 Technical Details:\n• MIME Type: ${extensionInfo.mimeType}\n• Category: ${extensionInfo.category}\n• Compression: ${extensionInfo.compressed ? 'Yes' : 'No'}\n• Binary Format: ${extensionInfo.binary ? 'Yes' : 'No'}\n\n` : ''}📱 Common Applications:\n${extensionInfo.applications.map(app => `• ${app}`).join('\n')}\n\n${targetInfo ? `🎯 Target Format: ${data.targetFormat.toUpperCase()}\n📝 Target Type: ${targetInfo.type}\n📋 Target Description: ${targetInfo.description}\n\n` : ''}`,
            compatibilityInfo: {
                webSupport: extensionInfo.webSupport,
                mobileSupport: extensionInfo.mobileSupport,
                crossPlatform: extensionInfo.crossPlatform,
                openSource: extensionInfo.openSource
            },
            conversionOptions: conversionOptions.length > 0 ? conversionOptions : ['No common conversion tools found'],
            securityNotes: extensionInfo.securityNotes || ['Standard file type - follow general security practices'],
            recommendations: generateFileRecommendations(extensionInfo, targetInfo)
        };
    }
}));

// Duplicate File Finder
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'duplicate-file-finder',
    name: 'Duplicate File Finder',
    description: 'Find and analyze potential duplicate files based on name, size, or content',
    category: 'business',
    icon: '🔍',
    fields: [
        { name: 'files', label: 'Select Files to Analyze', type: 'file', multiple: true, required: true },
        { name: 'matchingCriteria', label: 'Matching Criteria', type: 'select', options: [
            { value: 'name', label: 'File Name' },
            { value: 'size', label: 'File Size' },
            { value: 'nameAndSize', label: 'Name + Size' },
            { value: 'content', label: 'Content Hash (simulated)' }
        ], defaultValue: 'nameAndSize' },
        { name: 'ignoreExtensions', label: 'Ignore Extensions in Name Matching', type: 'checkbox', defaultValue: false },
        { name: 'sizeTolerance', label: 'Size Tolerance (bytes)', type: 'number', min: 0, defaultValue: 0 }
    ],
    generate: (data) => {
        const files = data.files || [];
        const fileCount = files.length || Math.floor(Math.random() * 15) + 5;
        
        // Generate mock files with some intentional duplicates
        const mockFiles = Array.from({length: fileCount}, (_, i) => ({
            name: files[i]?.name || (i < 3 ? 'document.pdf' : i < 6 ? 'image.jpg' : `file${i}.txt`),
            size: files[i]?.size || (i < 3 ? 1024000 : i < 6 ? 2048000 : Math.floor(Math.random() * 1000000)),
            type: files[i]?.type || 'application/octet-stream',
            hash: `hash${Math.floor(i/2)}` // Create some duplicate hashes
        }));
        
        // Find duplicates based on criteria
        const duplicateGroups = findDuplicates(mockFiles, data.matchingCriteria, data.ignoreExtensions, data.sizeTolerance);
        
        const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + (group.files.length - 1), 0);
        const potentialSavings = duplicateGroups.reduce((sum, group) => {
            return sum + (group.files.length - 1) * group.files[0].size;
        }, 0);
        
        const duplicatesList = duplicateGroups.map((group, i) => 
            `Group ${i + 1} (${group.criteria}):\n${group.files.map((file, j) => `  ${j + 1}. ${file.name} (${formatBytes(file.size)})`).join('\n')}\n  💾 Space waste: ${formatBytes((group.files.length - 1) * group.files[0].size)}`
        ).join('\n\n');
        
        return {
            duplicateAnalysis: `Duplicate File Analysis\n\n📁 Files analyzed: ${fileCount}\n🔍 Matching criteria: ${data.matchingCriteria}\n📊 Duplicate groups found: ${duplicateGroups.length}\n🗂️ Total duplicate files: ${totalDuplicates}\n💾 Potential space savings: ${formatBytes(potentialSavings)}\n\n${duplicateGroups.length > 0 ? '🔄 Duplicate Groups:\n' + duplicatesList : '✅ No duplicates found!'}`,
            statistics: {
                totalFiles: fileCount,
                duplicateGroups: duplicateGroups.length,
                duplicateFiles: totalDuplicates,
                potentialSavings: formatBytes(potentialSavings),
                uniqueFiles: fileCount - totalDuplicates
            },
            recommendations: generateDuplicateRecommendations(duplicateGroups, potentialSavings),
            actionPlan: duplicateGroups.length > 0 ? [
                'Review each duplicate group carefully',
                'Keep the version with the most recent modification date',
                'Backup files before deletion',
                'Consider using file synchronization tools to prevent future duplicates'
            ] : ['No action needed - no duplicates found']
        };
    }
}));

// File Organizer
ToolRegistry.register(ToolTemplates.createGenerator({
    id: 'file-organizer',
    name: 'File Organization Planner',
    description: 'Generate file organization strategies and folder structures',
    category: 'business',
    icon: '📂',
    fields: [
        { name: 'files', label: 'Select Files to Organize', type: 'file', multiple: true, required: true },
        { name: 'organizationMethod', label: 'Organization Method', type: 'select', options: [
            { value: 'type', label: 'By File Type' },
            { value: 'date', label: 'By Date Created' },
            { value: 'size', label: 'By File Size' },
            { value: 'alphabetical', label: 'Alphabetical' },
            { value: 'project', label: 'By Project/Topic (AI-suggested)' }
        ], defaultValue: 'type' },
        { name: 'createSubfolders', label: 'Create Subfolders', type: 'checkbox', defaultValue: true },
        { name: 'includeMetadata', label: 'Include File Metadata in Plan', type: 'checkbox', defaultValue: false }
    ],
    generate: (data) => {
        const files = data.files || [];
        const fileCount = files.length || Math.floor(Math.random() * 20) + 5;
        
        // Generate mock files
        const mockFiles = Array.from({length: fileCount}, (_, i) => ({
            name: files[i]?.name || `${['document', 'image', 'video', 'audio', 'data'][i % 5]}${i}.${['pdf', 'jpg', 'mp4', 'mp3', 'csv'][i % 5]}`,
            size: files[i]?.size || Math.floor(Math.random() * 10000000),
            type: files[i]?.type || ['application/pdf', 'image/jpeg', 'video/mp4', 'audio/mpeg', 'text/csv'][i % 5],
            lastModified: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
        }));
        
        const organizationPlan = generateOrganizationPlan(mockFiles, data.organizationMethod, data.createSubfolders);
        const folderStructure = generateFolderStructure(organizationPlan);
        
        return {
            organizationPlan: `File Organization Plan\n\n📁 Files to organize: ${fileCount}\n📋 Method: ${data.organizationMethod}\n🗂️ Subfolders: ${data.createSubfolders ? 'Enabled' : 'Disabled'}\n\n📂 Proposed Structure:\n${folderStructure}\n\n📊 Organization Summary:\n${Object.entries(organizationPlan).map(([folder, files]) => `${folder}: ${files.length} files (${formatBytes(files.reduce((sum, f) => sum + f.size, 0))})`).join('\n')}`,
            folderStructure: organizationPlan,
            statistics: {
                totalFiles: fileCount,
                foldersCreated: Object.keys(organizationPlan).length,
                largestFolder: Object.entries(organizationPlan).reduce((max, [folder, files]) => files.length > max.count ? {name: folder, count: files.length} : max, {name: '', count: 0}),
                totalSize: formatBytes(mockFiles.reduce((sum, file) => sum + file.size, 0))
            },
            benefits: [
                'Improved file accessibility and searchability',
                'Reduced time spent looking for files',
                'Better backup and synchronization organization',
                'Easier maintenance and cleanup',
                'Professional file management practices'
            ],
            nextSteps: [
                'Review the proposed folder structure',
                'Create the main folders first',
                'Move files in small batches to avoid errors',
                'Update any shortcuts or bookmarks',
                'Consider implementing a naming convention'
            ]
        };
    }
}));

// File Name Sanitizer
ToolRegistry.register(ToolTemplates.createTextProcessor({
    id: 'file-name-sanitizer',
    name: 'File Name Sanitizer',
    description: 'Clean and sanitize file names for cross-platform compatibility',
    category: 'business',
    icon: '🧹',
    fields: [
        { name: 'fileNames', label: 'File Names (one per line)', type: 'textarea', required: true, placeholder: 'My File (1).pdf\nDocument - Final Version!.docx' },
        { name: 'sanitizationLevel', label: 'Sanitization Level', type: 'select', options: [
            { value: 'basic', label: 'Basic (remove dangerous characters)' },
            { value: 'strict', label: 'Strict (alphanumeric + basic punctuation)' },
            { value: 'web', label: 'Web-safe (URL compatible)' },
            { value: 'windows', label: 'Windows compatible' }
        ], defaultValue: 'basic' },
        { name: 'replacementChar', label: 'Replacement Character', type: 'select', options: [
            { value: '_', label: 'Underscore (_)' },
            { value: '-', label: 'Hyphen (-)' },
            { value: '.', label: 'Period (.)' },
            { value: '', label: 'Remove (no replacement)' }
        ], defaultValue: '_' },
        { name: 'preserveCase', label: 'Preserve Case', type: 'checkbox', defaultValue: true },
        { name: 'maxLength', label: 'Maximum Length', type: 'number', min: 10, max: 255, defaultValue: 100 }
    ],
    process: (data) => {
        const fileNames = data.fileNames.split('\n').filter(name => name.trim());
        const results = fileNames.map(originalName => {
            const sanitized = sanitizeFileName(originalName.trim(), data.sanitizationLevel, data.replacementChar, data.preserveCase, data.maxLength);
            return {
                original: originalName.trim(),
                sanitized: sanitized,
                changed: originalName.trim() !== sanitized,
                issues: findFileNameIssues(originalName.trim())
            };
        });
        
        const changedCount = results.filter(r => r.changed).length;
        const issueTypes = [...new Set(results.flatMap(r => r.issues))];
        
        return {
            sanitizationResults: `File Name Sanitization Results\n\n📁 Files processed: ${fileNames.length}\n🔧 Changed: ${changedCount}\n⚠️ Issues found: ${issueTypes.length > 0 ? issueTypes.join(', ') : 'None'}\n\n📋 Results:\n${results.map((result, i) => `${i + 1}. ${result.original}\n   ${result.changed ? '→ ' + result.sanitized : '✅ No changes needed'}\n   ${result.issues.length > 0 ? '⚠️ Issues: ' + result.issues.join(', ') : ''}`).join('\n\n')}`,
            processedFiles: results,
            summary: {
                totalFiles: fileNames.length,
                changedFiles: changedCount,
                commonIssues: issueTypes,
                averageLength: Math.round(results.reduce((sum, r) => sum + r.sanitized.length, 0) / results.length)
            },
            recommendations: [
                'Always backup original files before renaming',
                'Test sanitized names with your target system',
                'Consider implementing a consistent naming convention',
                'Avoid using reserved system names (CON, PRN, AUX, etc.)'
            ]
        };
    }
}));

// Helper functions
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getSizeCategory(size) {
    if (size < 1024) return '📄 Very Small';
    if (size < 1024 * 1024) return '📄 Small';
    if (size < 10 * 1024 * 1024) return '📊 Medium';
    if (size < 100 * 1024 * 1024) return '📈 Large';
    return '🗂️ Very Large';
}

function getFileCategory(mimeType) {
    if (mimeType.startsWith('image/')) return 'Images';
    if (mimeType.startsWith('video/')) return 'Videos';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.startsWith('text/') || mimeType.includes('document')) return 'Documents';
    return 'Other';
}

function generateOptimizationSuggestions(files, totalSize) {
    const suggestions = [];
    
    const largeFiles = files.filter(f => f.size > 10 * 1024 * 1024);
    if (largeFiles.length > 0) {
        suggestions.push(`Consider compressing ${largeFiles.length} large files (>10MB)`);
    }
    
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 5) {
        suggestions.push('Batch optimize images to reduce total size');
    }
    
    if (totalSize > 100 * 1024 * 1024) {
        suggestions.push('Consider cloud storage for large file collections');
    }
    
    return suggestions.length > 0 ? suggestions : ['File sizes appear optimal'];
}

function getExtensionInfo(extension) {
    const extensions = {
        '.pdf': {
            type: 'Portable Document Format',
            description: 'Universal document format for sharing formatted documents',
            mimeType: 'application/pdf',
            category: 'Document',
            compressed: true,
            binary: true,
            webSupport: 'Excellent',
            mobileSupport: 'Excellent',
            crossPlatform: true,
            openSource: false,
            applications: ['Adobe Acrobat', 'Web browsers', 'Most document viewers'],
            securityNotes: ['Can contain executable content', 'Verify source before opening']
        },
        '.docx': {
            type: 'Microsoft Word Document',
            description: 'Modern Word document format with XML structure',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            category: 'Document',
            compressed: true,
            binary: true,
            webSupport: 'Good',
            mobileSupport: 'Good',
            crossPlatform: true,
            openSource: false,
            applications: ['Microsoft Word', 'LibreOffice', 'Google Docs']
        },
        '.jpg': {
            type: 'JPEG Image',
            description: 'Compressed image format ideal for photographs',
            mimeType: 'image/jpeg',
            category: 'Image',
            compressed: true,
            binary: true,
            webSupport: 'Excellent',
            mobileSupport: 'Excellent',
            crossPlatform: true,
            openSource: true,
            applications: ['All image viewers', 'Web browsers', 'Photo editors']
        }
    };
    
    return extensions[extension.toLowerCase()] || {
        type: 'Unknown Format',
        description: 'File format not recognized',
        mimeType: 'application/octet-stream',
        category: 'Unknown',
        compressed: false,
        binary: true,
        webSupport: 'Unknown',
        mobileSupport: 'Unknown',
        crossPlatform: false,
        openSource: false,
        applications: ['System default application']
    };
}

function getConversionOptions(extension) {
    const conversions = {
        '.pdf': ['PDF to Word', 'PDF to Excel', 'PDF to PowerPoint', 'PDF to Images'],
        '.docx': ['Word to PDF', 'Word to HTML', 'Word to TXT'],
        '.jpg': ['JPG to PNG', 'JPG to WebP', 'JPG to PDF', 'Resize/Compress'],
        '.png': ['PNG to JPG', 'PNG to WebP', 'PNG Optimization'],
        '.mp4': ['MP4 to AVI', 'MP4 to MOV', 'MP4 Compression', 'Extract Audio']
    };
    
    return conversions[extension.toLowerCase()] || [];
}

function generateFileRecommendations(sourceInfo, targetInfo) {
    const recommendations = [];
    
    if (!sourceInfo.webSupport || sourceInfo.webSupport === 'Poor') {
        recommendations.push('Consider converting to web-compatible format');
    }
    
    if (!sourceInfo.crossPlatform) {
        recommendations.push('Format may have compatibility issues across different systems');
    }
    
    if (targetInfo && targetInfo.compressed && !sourceInfo.compressed) {
        recommendations.push('Target format offers better compression');
    }
    
    return recommendations.length > 0 ? recommendations : ['File format appears suitable for intended use'];
}

function findDuplicates(files, criteria, ignoreExtensions, sizeTolerance) {
    const groups = [];
    const processed = new Set();
    
    files.forEach((file, index) => {
        if (processed.has(index)) return;
        
        const matches = [file];
        processed.add(index);
        
        files.forEach((otherFile, otherIndex) => {
            if (otherIndex === index || processed.has(otherIndex)) return;
            
            let isMatch = false;
            
            switch (criteria) {
                case 'name':
                    const name1 = ignoreExtensions ? file.name.split('.')[0] : file.name;
                    const name2 = ignoreExtensions ? otherFile.name.split('.')[0] : otherFile.name;
                    isMatch = name1.toLowerCase() === name2.toLowerCase();
                    break;
                case 'size':
                    isMatch = Math.abs(file.size - otherFile.size) <= sizeTolerance;
                    break;
                case 'nameAndSize':
                    const nameMatch = file.name.toLowerCase() === otherFile.name.toLowerCase();
                    const sizeMatch = Math.abs(file.size - otherFile.size) <= sizeTolerance;
                    isMatch = nameMatch && sizeMatch;
                    break;
                case 'content':
                    isMatch = file.hash === otherFile.hash;
                    break;
            }
            
            if (isMatch) {
                matches.push(otherFile);
                processed.add(otherIndex);
            }
        });
        
        if (matches.length > 1) {
            groups.push({ files: matches, criteria: criteria });
        }
    });
    
    return groups;
}

function generateDuplicateRecommendations(groups, savings) {
    const recommendations = [];
    
    if (groups.length === 0) {
        recommendations.push('Great! No duplicates found - your files are well organized');
    } else {
        recommendations.push(`Found ${groups.length} groups of duplicates`);
        if (savings > 1024 * 1024) {
            recommendations.push(`Removing duplicates could save ${formatBytes(savings)}`);
        }
        recommendations.push('Carefully review each group before deleting files');
    }
    
    return recommendations;
}

function generateOrganizationPlan(files, method, createSubfolders) {
    const plan = {};
    
    files.forEach(file => {
        let folderName = '';
        
        switch (method) {
            case 'type':
                const category = getFileCategory(file.type);
                folderName = createSubfolders ? `${category}/${file.type.split('/')[1] || 'other'}` : category;
                break;
            case 'date':
                const date = file.lastModified;
                folderName = createSubfolders ? 
                    `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}` :
                    String(date.getFullYear());
                break;
            case 'size':
                if (file.size < 1024 * 1024) folderName = 'Small Files (<1MB)';
                else if (file.size < 10 * 1024 * 1024) folderName = 'Medium Files (1-10MB)';
                else folderName = 'Large Files (>10MB)';
                break;
            case 'alphabetical':
                const firstLetter = file.name.charAt(0).toUpperCase();
                folderName = createSubfolders ? 
                    `${firstLetter}/${file.name.substring(0, 2).toUpperCase()}` :
                    firstLetter;
                break;
            case 'project':
                // AI-suggested project grouping (simplified)
                const keywords = ['document', 'image', 'data', 'media', 'archive'];
                const matchedKeyword = keywords.find(k => file.name.toLowerCase().includes(k));
                folderName = matchedKeyword ? `${matchedKeyword}s` : 'Miscellaneous';
                break;
            default:
                folderName = 'Unsorted';
        }
        
        if (!plan[folderName]) plan[folderName] = [];
        plan[folderName].push(file);
    });
    
    return plan;
}

function generateFolderStructure(plan) {
    return Object.entries(plan)
        .map(([folder, files]) => `📁 ${folder}/\n${files.slice(0, 3).map(f => `   📄 ${f.name}`).join('\n')}${files.length > 3 ? `\n   ... and ${files.length - 3} more files` : ''}`)
        .join('\n\n');
}

function sanitizeFileName(fileName, level, replacement, preserveCase, maxLength) {
    let sanitized = fileName;
    
    // Basic sanitization patterns
    const patterns = {
        basic: /[<>:"/\\|?*\x00-\x1f]/g,
        strict: /[^a-zA-Z0-9._-]/g,
        web: /[^a-zA-Z0-9._-]/g,
        windows: /[<>:"/\\|?*\x00-\x1f]|^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/gi
    };
    
    // Apply sanitization
    sanitized = sanitized.replace(patterns[level] || patterns.basic, replacement);
    
    // Handle case
    if (!preserveCase && level === 'web') {
        sanitized = sanitized.toLowerCase();
    }
    
    // Remove multiple consecutive replacement characters
    if (replacement) {
        const multiplePattern = new RegExp(`\\${replacement}{2,}`, 'g');
        sanitized = sanitized.replace(multiplePattern, replacement);
    }
    
    // Trim replacement characters from start/end
    if (replacement) {
        const trimPattern = new RegExp(`^\\${replacement}+|\\${replacement}+$`, 'g');
        sanitized = sanitized.replace(trimPattern, '');
    }
    
    // Enforce maximum length
    if (sanitized.length > maxLength) {
        const extension = sanitized.includes('.') ? '.' + sanitized.split('.').pop() : '';
        const nameLength = maxLength - extension.length;
        sanitized = sanitized.substring(0, nameLength) + extension;
    }
    
    return sanitized;
}

function findFileNameIssues(fileName) {
    const issues = [];
    
    if (/[<>:"/\\|?*\x00-\x1f]/.test(fileName)) {
        issues.push('Contains invalid characters');
    }
    
    if (fileName.length > 255) {
        issues.push('Too long (>255 characters)');
    }
    
    if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(fileName)) {
        issues.push('Reserved system name');
    }
    
    if (fileName.endsWith(' ') || fileName.endsWith('.')) {
        issues.push('Ends with space or period');
    }
    
    if (fileName.includes('..')) {
        issues.push('Contains consecutive periods');
    }
    
    return issues;
}

console.log('✅ File Tools loaded successfully (6 tools)');