// Additional Text Utility Tools (9-15)
(function() {
    'use strict';

    // 9. Line Break Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'line-break-converter',
        name: 'Line Break Converter',
        description: 'Convert between different line break formats (Windows, Unix, Mac)',
        category: 'text',
        icon: '↩️',
        extraFields: [
            {
                name: 'fromFormat',
                label: 'From Format',
                type: 'select',
                required: true,
                options: [
                    { value: 'auto', label: 'Auto-detect' },
                    { value: 'windows', label: 'Windows (CRLF)' },
                    { value: 'unix', label: 'Unix/Linux (LF)' },
                    { value: 'mac', label: 'Classic Mac (CR)' }
                ]
            },
            {
                name: 'toFormat',
                label: 'To Format',
                type: 'select',
                required: true,
                options: [
                    { value: 'windows', label: 'Windows (CRLF)' },
                    { value: 'unix', label: 'Unix/Linux (LF)' },
                    { value: 'mac', label: 'Classic Mac (CR)' }
                ]
            }
        ],
        process: (data) => {
            let text = data.text;
            const fromFormat = data.fromFormat;
            const toFormat = data.toFormat;
            
            // Detect current format if auto
            let detectedFormat = 'unix';
            if (fromFormat === 'auto') {
                if (text.includes('\r\n')) {
                    detectedFormat = 'windows';
                } else if (text.includes('\r')) {
                    detectedFormat = 'mac';
                } else {
                    detectedFormat = 'unix';
                }
            } else {
                detectedFormat = fromFormat;
            }
            
            // Normalize to LF first
            text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            
            // Convert to target format
            switch (toFormat) {
                case 'windows':
                    text = text.replace(/\n/g, '\r\n');
                    break;
                case 'mac':
                    text = text.replace(/\n/g, '\r');
                    break;
                case 'unix':
                    // Already in LF format
                    break;
            }
            
            const lineCount = (text.match(/\r\n|\r|\n/g) || []).length + 1;
            
            return `LINE BREAK CONVERSION COMPLETE

Detected format: ${detectedFormat.toUpperCase()}
Converted to: ${toFormat.toUpperCase()}
Total lines: ${lineCount}

CONVERTED TEXT:
${text}`;
        }
    }));

    // 10. Text Encryption/Decryption (Caesar Cipher)
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'caesar-cipher',
        name: 'Caesar Cipher',
        description: 'Encrypt/decrypt text using Caesar cipher',
        category: 'text',
        icon: '🔐',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'encrypt', label: 'Encrypt' },
                    { value: 'decrypt', label: 'Decrypt' }
                ]
            },
            {
                name: 'shift',
                label: 'Shift Value',
                type: 'number',
                required: true,
                value: '3',
                min: '1',
                max: '25'
            },
            {
                name: 'preserveCase',
                label: 'Preserve case',
                type: 'checkbox',
                value: true
            }
        ],
        process: (data) => {
            const text = data.text;
            const operation = data.operation;
            let shift = parseInt(data.shift);
            const preserveCase = data.preserveCase;
            
            if (operation === 'decrypt') {
                shift = -shift;
            }
            
            const caesarShift = (char, shiftAmount) => {
                if (char.match(/[a-zA-Z]/)) {
                    const isUpperCase = char === char.toUpperCase();
                    const charCode = char.toLowerCase().charCodeAt(0);
                    const shiftedCode = ((charCode - 97 + shiftAmount + 26) % 26) + 97;
                    const shiftedChar = String.fromCharCode(shiftedCode);
                    return preserveCase && isUpperCase ? shiftedChar.toUpperCase() : shiftedChar;
                }
                return char;
            };
            
            const result = text.split('').map(char => caesarShift(char, shift)).join('');
            
            return `CAESAR CIPHER ${operation.toUpperCase()}

Original text: ${text}
Shift value: ${Math.abs(shift)}
Operation: ${operation}

Result: ${result}

Note: Only alphabetic characters are shifted. Numbers, spaces, and special characters remain unchanged.`;
        }
    }));

    // 11. Text to ASCII Converter
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-ascii-converter',
        name: 'Text to ASCII Converter',
        description: 'Convert text to ASCII codes and vice versa',
        category: 'text',
        icon: '🔢',
        extraFields: [
            {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                required: true,
                options: [
                    { value: 'text_to_ascii', label: 'Text to ASCII' },
                    { value: 'ascii_to_text', label: 'ASCII to Text' }
                ]
            },
            {
                name: 'separator',
                label: 'ASCII Separator',
                type: 'select',
                options: [
                    { value: 'space', label: 'Space' },
                    { value: 'comma', label: 'Comma' },
                    { value: 'newline', label: 'New Line' }
                ],
                value: 'space'
            }
        ],
        process: (data) => {
            const text = data.text;
            const operation = data.operation;
            const separator = data.separator;
            
            const getSeparator = (sep) => {
                switch (sep) {
                    case 'comma': return ',';
                    case 'newline': return '\n';
                    default: return ' ';
                }
            };
            
            if (operation === 'text_to_ascii') {
                const asciiCodes = [];
                for (let i = 0; i < text.length; i++) {
                    asciiCodes.push(text.charCodeAt(i));
                }
                
                const sep = getSeparator(separator);
                const result = asciiCodes.join(sep);
                
                return `TEXT TO ASCII CONVERSION

Original text: ${text}
Character count: ${text.length}

ASCII codes:
${result}

Example: '${text.charAt(0)}' = ${text.charCodeAt(0)}`;
            } else {
                // ASCII to Text
                try {
                    const sep = getSeparator(separator);
                    const asciiCodes = text.split(sep).map(code => parseInt(code.trim())).filter(code => !isNaN(code));
                    const result = String.fromCharCode(...asciiCodes);
                    
                    return `ASCII TO TEXT CONVERSION

ASCII codes: ${asciiCodes.join(', ')}
Code count: ${asciiCodes.length}

Converted text:
${result}

Valid ASCII range: 0-127 (Extended: 0-255)`;
                } catch (error) {
                    throw new Error('Invalid ASCII codes. Please enter valid numbers separated by the chosen separator.');
                }
            }
        }
    }));

    // 12. Remove Extra Spaces Tool
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'remove-extra-spaces',
        name: 'Remove Extra Spaces',
        description: 'Clean up text by removing extra spaces and whitespace',
        category: 'text',
        icon: '🧹',
        extraFields: [
            {
                name: 'spaceType',
                label: 'Cleanup Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'all', label: 'All whitespace cleanup' },
                    { value: 'multiple_spaces', label: 'Multiple spaces only' },
                    { value: 'leading_trailing', label: 'Leading/trailing spaces' },
                    { value: 'empty_lines', label: 'Empty lines' },
                    { value: 'tabs', label: 'Convert tabs to spaces' }
                ]
            },
            {
                name: 'tabSize',
                label: 'Tab Size (for tab conversion)',
                type: 'number',
                value: '4',
                min: '1',
                max: '8'
            }
        ],
        process: (data) => {
            let text = data.text;
            const spaceType = data.spaceType;
            const tabSize = parseInt(data.tabSize || 4);
            
            const originalLength = text.length;
            const originalLines = text.split('\n').length;
            
            switch (spaceType) {
                case 'all':
                    // Remove leading/trailing spaces from each line
                    text = text.split('\n').map(line => line.trim()).join('\n');
                    // Replace multiple spaces with single space
                    text = text.replace(/[ \t]+/g, ' ');
                    // Remove empty lines
                    text = text.replace(/\n\s*\n/g, '\n');
                    // Trim overall
                    text = text.trim();
                    break;
                    
                case 'multiple_spaces':
                    text = text.replace(/[ ]+/g, ' ');
                    break;
                    
                case 'leading_trailing':
                    text = text.split('\n').map(line => line.trim()).join('\n').trim();
                    break;
                    
                case 'empty_lines':
                    text = text.replace(/\n\s*\n+/g, '\n');
                    break;
                    
                case 'tabs':
                    const spaces = ' '.repeat(tabSize);
                    text = text.replace(/\t/g, spaces);
                    break;
            }
            
            const newLength = text.length;
            const newLines = text.split('\n').length;
            const spacesRemoved = originalLength - newLength;
            
            return `WHITESPACE CLEANUP COMPLETE

Cleanup type: ${spaceType.replace('_', ' ')}
Characters removed: ${spacesRemoved}
Original length: ${originalLength}
New length: ${newLength}
Lines: ${originalLines} → ${newLines}

CLEANED TEXT:
${text}`;
        }
    }));

    // 13. Find and Replace Tool
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'find-replace-tool',
        name: 'Find and Replace',
        description: 'Find and replace text with support for regex and case sensitivity',
        category: 'text',
        icon: '🔍',
        extraFields: [
            {
                name: 'findText',
                label: 'Find',
                type: 'text',
                required: true,
                placeholder: 'Text to find'
            },
            {
                name: 'replaceText',
                label: 'Replace with',
                type: 'text',
                placeholder: 'Replacement text (leave empty to remove)'
            },
            {
                name: 'caseSensitive',
                label: 'Case sensitive',
                type: 'checkbox',
                value: false
            },
            {
                name: 'useRegex',
                label: 'Use Regular Expression',
                type: 'checkbox',
                value: false
            },
            {
                name: 'wholeWords',
                label: 'Whole words only',
                type: 'checkbox',
                value: false
            }
        ],
        process: (data) => {
            const text = data.text;
            const findText = data.findText;
            const replaceText = data.replaceText || '';
            const caseSensitive = data.caseSensitive;
            const useRegex = data.useRegex;
            const wholeWords = data.wholeWords;
            
            let searchPattern;
            let flags = 'g'; // global
            
            if (!caseSensitive) {
                flags += 'i'; // case insensitive
            }
            
            try {
                if (useRegex) {
                    searchPattern = new RegExp(findText, flags);
                } else {
                    let escapedFind = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    if (wholeWords) {
                        escapedFind = '\\b' + escapedFind + '\\b';
                    }
                    searchPattern = new RegExp(escapedFind, flags);
                }
                
                const matches = text.match(searchPattern) || [];
                const result = text.replace(searchPattern, replaceText);
                
                return `FIND AND REPLACE COMPLETE

Search pattern: ${findText}
Replacement: ${replaceText || '(removed)'}
Case sensitive: ${caseSensitive}
Regular expression: ${useRegex}
Whole words only: ${wholeWords}

Matches found: ${matches.length}
Replacements made: ${matches.length}

RESULT:
${result}`;
                
            } catch (error) {
                throw new Error('Invalid regular expression pattern: ' + error.message);
            }
        }
    }));

    // 14. Text Statistics Analyzer
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'text-statistics-analyzer',
        name: 'Text Statistics Analyzer',
        description: 'Analyze text for readability, complexity, and detailed statistics',
        category: 'text',
        icon: '📈',
        process: (data) => {
            const text = data.text;
            
            if (!text.trim()) {
                throw new Error('Please enter some text to analyze');
            }
            
            // Basic counts
            const characters = text.length;
            const charactersNoSpaces = text.replace(/\s/g, '').length;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            const wordCount = words.length;
            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const sentenceCount = sentences.length;
            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            const paragraphCount = paragraphs.length;
            
            // Advanced statistics
            const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(2) : 0;
            const avgCharsPerWord = wordCount > 0 ? (charactersNoSpaces / wordCount).toFixed(2) : 0;
            const avgSentencesPerParagraph = paragraphCount > 0 ? (sentenceCount / paragraphCount).toFixed(2) : 0;
            
            // Word length distribution
            const wordLengths = words.map(word => word.replace(/[^\w]/g, '').length);
            const avgWordLength = wordLengths.length > 0 ? (wordLengths.reduce((a, b) => a + b, 0) / wordLengths.length).toFixed(2) : 0;
            const longestWord = Math.max(...wordLengths);
            const shortestWord = Math.min(...wordLengths);
            
            // Readability (simplified Flesch Reading Ease)
            const avgSentenceLength = parseFloat(avgWordsPerSentence);
            const avgSyllablesPerWord = parseFloat(avgWordLength) * 0.5; // Rough approximation
            const readingEase = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
            
            let readingLevel;
            if (readingEase >= 90) readingLevel = 'Very Easy (5th grade)';
            else if (readingEase >= 80) readingLevel = 'Easy (6th grade)';
            else if (readingEase >= 70) readingLevel = 'Fairly Easy (7th grade)';
            else if (readingEase >= 60) readingLevel = 'Standard (8th-9th grade)';
            else if (readingEase >= 50) readingLevel = 'Fairly Difficult (10th-12th grade)';
            else if (readingEase >= 30) readingLevel = 'Difficult (College level)';
            else readingLevel = 'Very Difficult (Graduate level)';
            
            // Character frequency
            const charFreq = {};
            text.toLowerCase().split('').forEach(char => {
                if (char.match(/[a-z]/)) {
                    charFreq[char] = (charFreq[char] || 0) + 1;
                }
            });
            const topChars = Object.entries(charFreq)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([char, count]) => `${char}: ${count}`)
                .join(', ');
            
            // Unique words
            const uniqueWords = new Set(words.map(word => word.toLowerCase().replace(/[^\w]/g, '')));
            const vocabularyRichness = uniqueWords.size / wordCount;
            
            const result = `📊 COMPREHENSIVE TEXT ANALYSIS

BASIC STATISTICS:
• Characters: ${characters.toLocaleString()} (${charactersNoSpaces.toLocaleString()} without spaces)
• Words: ${wordCount.toLocaleString()}
• Sentences: ${sentenceCount.toLocaleString()}
• Paragraphs: ${paragraphCount.toLocaleString()}

AVERAGES:
• Words per sentence: ${avgWordsPerSentence}
• Characters per word: ${avgCharsPerWord}
• Sentences per paragraph: ${avgSentencesPerParagraph}
• Word length: ${avgWordLength} characters

WORD STATISTICS:
• Longest word: ${longestWord} characters
• Shortest word: ${shortestWord} characters
• Unique words: ${uniqueWords.size.toLocaleString()}
• Vocabulary richness: ${(vocabularyRichness * 100).toFixed(1)}%

READABILITY:
• Reading ease score: ${readingEase.toFixed(1)}
• Reading level: ${readingLevel}
• Estimated reading time: ${Math.ceil(wordCount / 200)} minutes

TOP CHARACTERS:
${topChars}

TEXT COMPLEXITY:
${readingEase > 60 ? '✅ Easy to read' : readingEase > 30 ? '⚠️ Moderately complex' : '🔴 Complex/difficult'}`;
            
            return result;
        }
    }));

    // 15. Palindrome Checker
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'palindrome-checker',
        name: 'Palindrome Checker',
        description: 'Check if text is a palindrome and find palindromes within text',
        category: 'text',
        icon: '🔄',
        extraFields: [
            {
                name: 'checkType',
                label: 'Check Type',
                type: 'select',
                required: true,
                options: [
                    { value: 'whole', label: 'Check entire text' },
                    { value: 'words', label: 'Find palindromic words' },
                    { value: 'sentences', label: 'Check each sentence' }
                ]
            },
            {
                name: 'ignoreSpaces',
                label: 'Ignore spaces and punctuation',
                type: 'checkbox',
                value: true
            },
            {
                name: 'ignoreCase',
                label: 'Ignore case',
                type: 'checkbox',
                value: true
            }
        ],
        process: (data) => {
            const text = data.text;
            const checkType = data.checkType;
            const ignoreSpaces = data.ignoreSpaces;
            const ignoreCase = data.ignoreCase;
            
            const cleanText = (str) => {
                let cleaned = str;
                if (ignoreCase) cleaned = cleaned.toLowerCase();
                if (ignoreSpaces) cleaned = cleaned.replace(/[^a-zA-Z0-9]/g, '');
                return cleaned;
            };
            
            const isPalindrome = (str) => {
                const cleaned = cleanText(str);
                return cleaned === cleaned.split('').reverse().join('');
            };
            
            if (checkType === 'whole') {
                const cleaned = cleanText(text);
                const isTextPalindrome = isPalindrome(text);
                
                return `PALINDROME CHECK - ENTIRE TEXT

Original text: ${text}
Cleaned text: ${cleaned}
Length: ${cleaned.length}

Result: ${isTextPalindrome ? '✅ IS a palindrome!' : '❌ NOT a palindrome'}

${isTextPalindrome ? 
'The text reads the same forwards and backwards!' : 
'The text does not read the same forwards and backwards.'}

Reverse: ${cleaned.split('').reverse().join('')}`;
                
            } else if (checkType === 'words') {
                const words = text.split(/\s+/).filter(word => word.length > 0);
                const palindromes = [];
                const nonPalindromes = [];
                
                words.forEach(word => {
                    const cleanWord = cleanText(word);
                    if (cleanWord.length > 1 && isPalindrome(word)) {
                        palindromes.push(word);
                    } else {
                        nonPalindromes.push(word);
                    }
                });
                
                return `PALINDROME CHECK - INDIVIDUAL WORDS

Total words checked: ${words.length}
Palindromes found: ${palindromes.length}
Non-palindromes: ${nonPalindromes.length}

PALINDROMIC WORDS:
${palindromes.length > 0 ? palindromes.join(', ') : 'None found'}

${palindromes.length > 0 ? 
`\nEXAMPLES:
${palindromes.slice(0, 3).map(word => `• ${word} → ${cleanText(word)}`).join('\n')}` : 
'\nTip: Try words like "radar", "level", "noon", "civic"'}`;
                
            } else { // sentences
                const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
                const results = [];
                
                sentences.forEach((sentence, index) => {
                    const trimmed = sentence.trim();
                    const isSetn = isPalindrome(trimmed);
                    results.push({
                        sentence: trimmed,
                        isPalindrome: isSetn,
                        cleaned: cleanText(trimmed)
                    });
                });
                
                const palindromicSentences = results.filter(r => r.isPalindrome);
                
                return `PALINDROME CHECK - SENTENCES

Sentences checked: ${results.length}
Palindromic sentences: ${palindromicSentences.length}

RESULTS:
${results.map((result, index) => 
`${index + 1}. ${result.isPalindrome ? '✅' : '❌'} "${result.sentence}"
   Cleaned: ${result.cleaned}`
).join('\n\n')}

${palindromicSentences.length > 0 ? 
'\n🎉 Found palindromic sentences!' : 
'\nNo palindromic sentences found. Try "A man a plan a canal Panama" or "Was it a rat I saw?"'}`;
            }
        }
    }));

})();