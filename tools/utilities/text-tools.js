// Text Utility Tools
(function() {
    'use strict';

    // 1. Word/Character Counter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'word-character-counter',
        name: 'Word & Character Counter',
        description: 'Count words, characters, paragraphs, and reading time',
        category: 'text',
        icon: '📊',
        process: (data) => {
            const text = data.text;
            
            // Basic counts
            const characters = text.length;
            const charactersNoSpaces = text.replace(/\s/g, '').length;
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
            const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
            const lines = text.split('\n').length;
            
            // Reading time (average 200 words per minute)
            const readingTimeMinutes = Math.ceil(words / 200);
            
            // Most common words
            const wordList = text.toLowerCase().replace(/[^\w\s]/g, ' ').trim().split(/\s+/).filter(w => w.length > 2);
            const wordFreq = {};
            wordList.forEach(word => wordFreq[word] = (wordFreq[word] || 0) + 1);
            const topWords = Object.entries(wordFreq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([word, count]) => `${word} (${count})`)
                .join(', ');
            
            return `📊 TEXT STATISTICS

Characters: ${characters.toLocaleString()}
Characters (no spaces): ${charactersNoSpaces.toLocaleString()}
Words: ${words.toLocaleString()}
Sentences: ${sentences.toLocaleString()}
Paragraphs: ${paragraphs.toLocaleString()}
Lines: ${lines.toLocaleString()}

⏱️ READING TIME
Estimated reading time: ${readingTimeMinutes} minute${readingTimeMinutes !== 1 ? 's' : ''}

🔤 TOP WORDS
${topWords || 'No common words found'}

📏 AVERAGES
Average words per sentence: ${sentences > 0 ? (words / sentences).toFixed(1) : 0}
Average characters per word: ${words > 0 ? (charactersNoSpaces / words).toFixed(1) : 0}`;
        }
    }));

    // 2. Text Case Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-case-converter',
        name: 'Text Case Converter',
        description: 'Convert text to different cases: UPPER, lower, Title, camelCase, snake_case, kebab-case',
        category: 'text',
        icon: '🔄',
        extraFields: [
            {
                name: 'caseType',
                label: 'Case Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'upper', label: 'UPPERCASE' },
                    { value: 'lower', label: 'lowercase' },
                    { value: 'title', label: 'Title Case' },
                    { value: 'sentence', label: 'Sentence case' },
                    { value: 'camel', label: 'camelCase' },
                    { value: 'pascal', label: 'PascalCase' },
                    { value: 'snake', label: 'snake_case' },
                    { value: 'kebab', label: 'kebab-case' },
                    { value: 'constant', label: 'CONSTANT_CASE' }
                ]
            }
        ],
        process: (data) => {
            const text = data.text;
            const caseType = data.caseType;
            
            switch (caseType) {
                case 'upper':
                    return text.toUpperCase();
                case 'lower':
                    return text.toLowerCase();
                case 'title':
                    return Formatters.string.titleCase(text);
                case 'sentence':
                    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                case 'camel':
                    return Formatters.string.camelCase(text);
                case 'pascal':
                    const camel = Formatters.string.camelCase(text);
                    return camel.charAt(0).toUpperCase() + camel.slice(1);
                case 'snake':
                    return Formatters.string.snakeCase(text);
                case 'kebab':
                    return Formatters.string.kebabCase(text);
                case 'constant':
                    return Formatters.string.snakeCase(text).toUpperCase();
                default:
                    return text;
            }
        }
    }));

    // 3. Text Diff Checker
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-diff-checker',
        name: 'Text Diff Checker',
        description: 'Compare two texts and highlight differences',
        category: 'text',
        icon: '🔍',
        extraFields: [
            {
                name: 'text2',
                label: 'Second Text',
                type: 'textarea',
                required: true,
                placeholder: 'Enter the second text to compare...'
            }
        ],
        process: (data) => {
            const text1 = data.text;
            const text2 = data.text2;
            
            const lines1 = text1.split('\n');
            const lines2 = text2.split('\n');
            const maxLines = Math.max(lines1.length, lines2.length);
            
            let differences = [];
            let identical = 0;
            let added = 0;
            let removed = 0;
            let modified = 0;
            
            for (let i = 0; i < maxLines; i++) {
                const line1 = lines1[i] || '';
                const line2 = lines2[i] || '';
                
                if (line1 === line2) {
                    identical++;
                    differences.push(`  ${i + 1}: ${line1}`);
                } else if (line1 === undefined) {
                    added++;
                    differences.push(`+ ${i + 1}: ${line2}`);
                } else if (line2 === undefined) {
                    removed++;
                    differences.push(`- ${i + 1}: ${line1}`);
                } else {
                    modified++;
                    differences.push(`- ${i + 1}: ${line1}`);
                    differences.push(`+ ${i + 1}: ${line2}`);
                }
            }
            
            const result = `📊 COMPARISON SUMMARY
Identical lines: ${identical}
Modified lines: ${modified}
Added lines: ${added}
Removed lines: ${removed}
Total changes: ${added + removed + modified}

🔍 DETAILED DIFFERENCES
Legend: "  " = identical, "- " = removed, "+ " = added

${differences.slice(0, 50).join('\n')}${differences.length > 50 ? '\n... (showing first 50 differences)' : ''}`;
            
            return result;
        }
    }));

    // 4. Lorem Ipsum Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'lorem-ipsum-generator',
        name: 'Lorem Ipsum Generator',
        description: 'Generate Lorem Ipsum placeholder text',
        category: 'text',
        icon: '📝',
        fields: [
            {
                name: 'count',
                label: 'Count',
                type: 'number',
                required: true,
                value: '3',
                min: '1',
                max: '50'
            },
            {
                name: 'type',
                label: 'Generate',
                type: 'select',
                required: true,
                options: [
                    { value: 'paragraphs', label: 'Paragraphs' },
                    { value: 'sentences', label: 'Sentences' },
                    { value: 'words', label: 'Words' }
                ]
            },
            {
                name: 'startWithLorem',
                label: 'Start with "Lorem ipsum"',
                type: 'checkbox',
                value: true
            }
        ],
        generate: (data) => {
            const count = parseInt(data.count);
            const type = data.type;
            const startWithLorem = data.startWithLorem;
            
            const loremWords = [
                'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
                'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
                'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
                'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
                'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
                'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
                'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
                'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
            ];
            
            const getRandomWords = (num) => {
                const words = [];
                for (let i = 0; i < num; i++) {
                    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                }
                return words;
            };
            
            const generateSentence = () => {
                const length = Math.floor(Math.random() * 15) + 8; // 8-22 words
                const words = getRandomWords(length);
                return words[0].charAt(0).toUpperCase() + words[0].slice(1) + ' ' + words.slice(1).join(' ') + '.';
            };
            
            const generateParagraph = () => {
                const sentences = Math.floor(Math.random() * 5) + 3; // 3-7 sentences
                const paragraph = [];
                for (let i = 0; i < sentences; i++) {
                    paragraph.push(generateSentence());
                }
                return paragraph.join(' ');
            };
            
            let result = [];
            
            if (type === 'words') {
                const words = getRandomWords(count);
                if (startWithLorem && count >= 2) {
                    words[0] = 'Lorem';
                    words[1] = 'ipsum';
                }
                result = [words.join(' ')];
            } else if (type === 'sentences') {
                for (let i = 0; i < count; i++) {
                    result.push(generateSentence());
                }
                if (startWithLorem && count > 0) {
                    result[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
                }
            } else { // paragraphs
                for (let i = 0; i < count; i++) {
                    result.push(generateParagraph());
                }
                if (startWithLorem && count > 0) {
                    result[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + result[0].substring(result[0].indexOf('.') + 2);
                }
            }
            
            return result.join('\n\n');
        }
    }));

    // 5. Random Text Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'random-text-generator',
        name: 'Random Text Generator',
        description: 'Generate random text with custom parameters',
        category: 'text',
        icon: '🎲',
        fields: [
            {
                name: 'length',
                label: 'Text Length',
                type: 'number',
                required: true,
                value: '100',
                min: '10',
                max: '10000'
            },
            {
                name: 'type',
                label: 'Text Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'letters', label: 'Letters only (a-z)' },
                    { value: 'alphanumeric', label: 'Letters & Numbers' },
                    { value: 'readable', label: 'Readable Words' },
                    { value: 'hex', label: 'Hexadecimal (0-9, A-F)' },
                    { value: 'binary', label: 'Binary (0, 1)' }
                ]
            },
            {
                name: 'includeSpaces',
                label: 'Include spaces',
                type: 'checkbox',
                value: false
            }
        ],
        generate: (data) => {
            const length = parseInt(data.length);
            const type = data.type;
            const includeSpaces = data.includeSpaces;
            
            let characters = '';
            let result = '';
            
            switch (type) {
                case 'letters':
                    characters = 'abcdefghijklmnopqrstuvwxyz';
                    break;
                case 'alphanumeric':
                    characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
                    break;
                case 'hex':
                    characters = '0123456789ABCDEF';
                    break;
                case 'binary':
                    characters = '01';
                    break;
                case 'readable':
                    const syllables = ['ba', 'ca', 'da', 'fa', 'ga', 'ha', 'ja', 'ka', 'la', 'ma', 'na', 'pa', 'ra', 'sa', 'ta', 'va', 'wa', 'ya', 'za'];
                    const words = [];
                    let currentLength = 0;
                    
                    while (currentLength < length) {
                        const wordLength = Math.floor(Math.random() * 4) + 2; // 2-5 syllables
                        let word = '';
                        for (let i = 0; i < wordLength; i++) {
                            word += syllables[Math.floor(Math.random() * syllables.length)];
                        }
                        words.push(word);
                        currentLength += word.length + 1; // +1 for space
                    }
                    
                    return words.join(' ').substring(0, length);
            }
            
            if (includeSpaces && type !== 'readable') {
                characters += ' ';
            }
            
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            return result;
        }
    }));

    // 6. Text Reverse Tool
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-reverse-tool',
        name: 'Text Reverse Tool',
        description: 'Reverse text by characters, words, or lines',
        category: 'text',
        icon: '🔄',
        extraFields: [
            {
                name: 'reverseType',
                label: 'Reverse Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'characters', label: 'Reverse Characters' },
                    { value: 'words', label: 'Reverse Word Order' },
                    { value: 'lines', label: 'Reverse Line Order' }
                ]
            }
        ],
        process: (data) => {
            const text = data.text;
            const reverseType = data.reverseType;
            
            switch (reverseType) {
                case 'characters':
                    return text.split('').reverse().join('');
                case 'words':
                    return text.split(/\s+/).reverse().join(' ');
                case 'lines':
                    return text.split('\n').reverse().join('\n');
                default:
                    return text;
            }
        }
    }));

    // 7. Text Sorting Tool
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-sorting-tool',
        name: 'Text Sorting Tool',
        description: 'Sort text lines alphabetically or numerically',
        category: 'text',
        icon: '📋',
        extraFields: [
            {
                name: 'sortType',
                label: 'Sort Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'alphabetical', label: 'Alphabetical (A-Z)' },
                    { value: 'alphabetical_reverse', label: 'Alphabetical (Z-A)' },
                    { value: 'numerical', label: 'Numerical (Ascending)' },
                    { value: 'numerical_reverse', label: 'Numerical (Descending)' },
                    { value: 'length', label: 'By Length (Shortest First)' },
                    { value: 'length_reverse', label: 'By Length (Longest First)' }
                ]
            },
            {
                name: 'caseSensitive',
                label: 'Case sensitive',
                type: 'checkbox',
                value: false
            }
        ],
        process: (data) => {
            const text = data.text;
            const sortType = data.sortType;
            const caseSensitive = data.caseSensitive;
            
            const lines = text.split('\n');
            
            let sortedLines = [...lines];
            
            switch (sortType) {
                case 'alphabetical':
                    sortedLines.sort((a, b) => {
                        const aText = caseSensitive ? a : a.toLowerCase();
                        const bText = caseSensitive ? b : b.toLowerCase();
                        return aText.localeCompare(bText);
                    });
                    break;
                case 'alphabetical_reverse':
                    sortedLines.sort((a, b) => {
                        const aText = caseSensitive ? a : a.toLowerCase();
                        const bText = caseSensitive ? b : b.toLowerCase();
                        return bText.localeCompare(aText);
                    });
                    break;
                case 'numerical':
                    sortedLines.sort((a, b) => parseFloat(a) - parseFloat(b));
                    break;
                case 'numerical_reverse':
                    sortedLines.sort((a, b) => parseFloat(b) - parseFloat(a));
                    break;
                case 'length':
                    sortedLines.sort((a, b) => a.length - b.length);
                    break;
                case 'length_reverse':
                    sortedLines.sort((a, b) => b.length - a.length);
                    break;
            }
            
            return sortedLines.join('\n');
        }
    }));

    // 8. Duplicate Line Remover
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'duplicate-line-remover',
        name: 'Duplicate Line Remover',
        description: 'Remove duplicate lines from text',
        category: 'text',
        icon: '🗑️',
        extraFields: [
            {
                name: 'caseSensitive',
                label: 'Case sensitive',
                type: 'checkbox',
                value: false
            },
            {
                name: 'keepFirst',
                label: 'Keep first occurrence (vs last)',
                type: 'checkbox',
                value: true
            },
            {
                name: 'ignoreEmpty',
                label: 'Ignore empty lines',
                type: 'checkbox',
                value: false
            }
        ],
        process: (data) => {
            const text = data.text;
            const caseSensitive = data.caseSensitive;
            const keepFirst = data.keepFirst;
            const ignoreEmpty = data.ignoreEmpty;
            
            const lines = text.split('\n');
            const seen = new Set();
            const result = [];
            const duplicates = [];
            
            const processLine = (line) => {
                if (ignoreEmpty && line.trim() === '') {
                    return line;
                }
                return caseSensitive ? line : line.toLowerCase();
            };
            
            if (keepFirst) {
                lines.forEach(line => {
                    const processedLine = processLine(line);
                    if (!seen.has(processedLine)) {
                        seen.add(processedLine);
                        result.push(line);
                    } else {
                        duplicates.push(line);
                    }
                });
            } else {
                // Keep last occurrence
                const lineMap = new Map();
                lines.forEach((line, index) => {
                    const processedLine = processLine(line);
                    lineMap.set(processedLine, { line, index });
                });
                
                lines.forEach((line, index) => {
                    const processedLine = processLine(line);
                    const stored = lineMap.get(processedLine);
                    if (stored.index === index) {
                        result.push(line);
                    } else {
                        duplicates.push(line);
                    }
                });
            }
            
            const stats = `DUPLICATE REMOVAL RESULTS:
Original lines: ${lines.length}
Unique lines: ${result.length}
Duplicates removed: ${duplicates.length}

${result.join('\n')}`;
            
            return stats;
        }
    }));

})();