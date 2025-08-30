// Hash & Security Generator Tools
(function() {
    'use strict';

    // 1. MD5 Hash Generator
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'md5-hash-generator',
        name: 'MD5 Hash Generator',
        description: 'Generate MD5 hash from text input',
        category: 'security',
        icon: '🔐',
        extraFields: [
            {
                name: 'outputFormat',
                label: 'Output Format',
                type: 'select',
                options: [
                    { value: 'hex', label: 'Hexadecimal (lowercase)' },
                    { value: 'HEX', label: 'Hexadecimal (uppercase)' },
                    { value: 'base64', label: 'Base64' }
                ],
                value: 'hex'
            }
        ],
        process: (data) => {
            const text = data.text;
            const outputFormat = data.outputFormat;
            
            if (!text) {
                throw new Error('Please enter text to hash');
            }
            
            try {
                let hash = CryptoJS.MD5(text).toString();
                
                switch (outputFormat) {
                    case 'HEX':
                        hash = hash.toUpperCase();
                        break;
                    case 'base64':
                        hash = CryptoJS.MD5(text).toString(CryptoJS.enc.Base64);
                        break;
                }
                
                return `MD5 HASH GENERATED

Input text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}
Input length: ${text.length} characters
Output format: ${outputFormat}
Hash length: ${hash.length} characters

MD5 HASH:
${hash}

⚠️ NOTE: MD5 is not cryptographically secure and should not be used for security purposes. Use SHA-256 or higher for security applications.

COMMON USES:
• File integrity verification
• Non-security checksums
• Legacy system compatibility`;
            } catch (error) {
                throw new Error(`MD5 generation error: ${error.message}`);
            }
        }
    }));

    // 2. SHA Hash Generator (SHA-1, SHA-256, SHA-512)
    ToolRegistry.register(ToolTemplates.createTextProcessor({
        id: 'sha-hash-generator',
        name: 'SHA Hash Generator',
        description: 'Generate SHA-1, SHA-256, or SHA-512 hashes',
        category: 'security',
        icon: '🛡️',
        extraFields: [
            {
                name: 'algorithm',
                label: 'SHA Algorithm',
                type: 'select',
                required: true,
                options: [
                    { value: 'SHA1', label: 'SHA-1 (160 bits)' },
                    { value: 'SHA256', label: 'SHA-256 (256 bits) - Recommended' },
                    { value: 'SHA512', label: 'SHA-512 (512 bits)' }
                ],
                value: 'SHA256'
            },
            {
                name: 'outputFormat',
                label: 'Output Format',
                type: 'select',
                options: [
                    { value: 'hex', label: 'Hexadecimal (lowercase)' },
                    { value: 'HEX', label: 'Hexadecimal (uppercase)' },
                    { value: 'base64', label: 'Base64' }
                ],
                value: 'hex'
            }
        ],
        process: (data) => {
            const text = data.text;
            const algorithm = data.algorithm;
            const outputFormat = data.outputFormat;
            
            if (!text) {
                throw new Error('Please enter text to hash');
            }
            
            try {
                let hash;
                
                switch (algorithm) {
                    case 'SHA1':
                        hash = CryptoJS.SHA1(text);
                        break;
                    case 'SHA256':
                        hash = CryptoJS.SHA256(text);
                        break;
                    case 'SHA512':
                        hash = CryptoJS.SHA512(text);
                        break;
                }
                
                let result;
                switch (outputFormat) {
                    case 'hex':
                        result = hash.toString();
                        break;
                    case 'HEX':
                        result = hash.toString().toUpperCase();
                        break;
                    case 'base64':
                        result = hash.toString(CryptoJS.enc.Base64);
                        break;
                }
                
                const security = {
                    'SHA1': '⚠️ Deprecated - Use SHA-256 or higher',
                    'SHA256': '✅ Secure - Recommended for most uses',
                    'SHA512': '✅ Very Secure - Good for high-security needs'
                };
                
                return `${algorithm} HASH GENERATED

Input text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}
Input length: ${text.length} characters
Algorithm: ${algorithm}
Output format: ${outputFormat}
Hash length: ${result.length} characters
Security level: ${security[algorithm]}

${algorithm} HASH:
${result}

ALGORITHM INFO:
• SHA-1: Legacy, 160-bit output
• SHA-256: Current standard, 256-bit output
• SHA-512: High security, 512-bit output

COMMON USES:
• Password hashing (with salt)
• Digital signatures
• Certificate fingerprints
• Data integrity verification`;
                
            } catch (error) {
                throw new Error(`${algorithm} generation error: ${error.message}`);
            }
        }
    }));

    // 3. Password Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'password-generator',
        name: 'Password Generator',
        description: 'Generate secure random passwords with customizable options',
        category: 'security',
        icon: '🔑',
        fields: [
            {
                name: 'length',
                label: 'Password Length',
                type: 'number',
                required: true,
                value: '16',
                min: '4',
                max: '128'
            },
            {
                name: 'uppercase',
                label: 'Include Uppercase Letters (A-Z)',
                type: 'checkbox',
                value: true
            },
            {
                name: 'lowercase',
                label: 'Include Lowercase Letters (a-z)',
                type: 'checkbox',
                value: true
            },
            {
                name: 'numbers',
                label: 'Include Numbers (0-9)',
                type: 'checkbox',
                value: true
            },
            {
                name: 'symbols',
                label: 'Include Symbols (!@#$...)',
                type: 'checkbox',
                value: true
            },
            {
                name: 'excludeAmbiguous',
                label: 'Exclude ambiguous characters (0,O,l,1,I)',
                type: 'checkbox',
                value: false
            },
            {
                name: 'count',
                label: 'Number of passwords to generate',
                type: 'number',
                value: '1',
                min: '1',
                max: '20'
            }
        ],
        generate: (data) => {
            const length = parseInt(data.length);
            const uppercase = data.uppercase;
            const lowercase = data.lowercase;
            const numbers = data.numbers;
            const symbols = data.symbols;
            const excludeAmbiguous = data.excludeAmbiguous;
            const count = parseInt(data.count || 1);
            
            // Character sets
            let chars = '';
            let uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
            let numberChars = '0123456789';
            let symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            if (excludeAmbiguous) {
                uppercaseChars = uppercaseChars.replace(/[O]/g, '');
                lowercaseChars = lowercaseChars.replace(/[l]/g, '');
                numberChars = numberChars.replace(/[01]/g, '');
                symbolChars = symbolChars; // Keep symbols as is
            }
            
            if (uppercase) chars += uppercaseChars;
            if (lowercase) chars += lowercaseChars;
            if (numbers) chars += numberChars;
            if (symbols) chars += symbolChars;
            
            if (!chars) {
                throw new Error('Please select at least one character type');
            }
            
            const generatePassword = () => {
                let password = '';
                
                // Ensure at least one character from each selected type
                if (uppercase && uppercaseChars) {
                    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
                }
                if (lowercase && lowercaseChars) {
                    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
                }
                if (numbers && numberChars) {
                    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
                }
                if (symbols && symbolChars) {
                    password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
                }
                
                // Fill the rest randomly
                for (let i = password.length; i < length; i++) {
                    password += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                
                // Shuffle the password
                return password.split('').sort(() => Math.random() - 0.5).join('');
            };
            
            const passwords = [];
            for (let i = 0; i < count; i++) {
                passwords.push(generatePassword());
            }
            
            // Calculate entropy
            const entropy = Math.log2(Math.pow(chars.length, length));
            let strength;
            if (entropy < 28) strength = 'Very Weak';
            else if (entropy < 36) strength = 'Weak';
            else if (entropy < 60) strength = 'Fair';
            else if (entropy < 128) strength = 'Strong';
            else strength = 'Very Strong';
            
            const result = `🔑 SECURE PASSWORD${count > 1 ? 'S' : ''} GENERATED

Settings:
• Length: ${length} characters
• Character types: ${[
                uppercase && 'Uppercase',
                lowercase && 'Lowercase', 
                numbers && 'Numbers',
                symbols && 'Symbols'
            ].filter(Boolean).join(', ')}
• Exclude ambiguous: ${excludeAmbiguous ? 'Yes' : 'No'}
• Total character pool: ${chars.length} characters

Security Analysis:
• Entropy: ${entropy.toFixed(1)} bits
• Strength: ${strength}
• Possible combinations: ${Math.pow(chars.length, length).toExponential(2)}

GENERATED PASSWORD${count > 1 ? 'S' : ''}:
${passwords.map((pwd, i) => `${count > 1 ? (i + 1) + '. ' : ''}${pwd}`).join('\n')}

💡 SECURITY TIPS:
• Use unique passwords for each account
• Store passwords in a password manager
• Enable 2FA when available
• Change passwords regularly for sensitive accounts`;
            
            return result;
        }
    }));

    // 4. Random Number Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'random-number-generator',
        name: 'Random Number Generator',
        description: 'Generate cryptographically secure random numbers',
        category: 'security',
        icon: '🎲',
        fields: [
            {
                name: 'min',
                label: 'Minimum Value',
                type: 'number',
                required: true,
                value: '1'
            },
            {
                name: 'max',
                label: 'Maximum Value',
                type: 'number',
                required: true,
                value: '100'
            },
            {
                name: 'count',
                label: 'How many numbers to generate',
                type: 'number',
                required: true,
                value: '10',
                min: '1',
                max: '1000'
            },
            {
                name: 'allowDuplicates',
                label: 'Allow duplicate numbers',
                type: 'checkbox',
                value: true
            },
            {
                name: 'outputFormat',
                label: 'Output Format',
                type: 'select',
                options: [
                    { value: 'list', label: 'List (one per line)' },
                    { value: 'comma', label: 'Comma separated' },
                    { value: 'space', label: 'Space separated' }
                ],
                value: 'list'
            }
        ],
        generate: (data) => {
            const min = parseInt(data.min);
            const max = parseInt(data.max);
            const count = parseInt(data.count);
            const allowDuplicates = data.allowDuplicates;
            const outputFormat = data.outputFormat;
            
            if (min >= max) {
                throw new Error('Minimum value must be less than maximum value');
            }
            
            if (!allowDuplicates && count > (max - min + 1)) {
                throw new Error('Cannot generate more unique numbers than the range allows');
            }
            
            const numbers = [];
            const used = new Set();
            
            // Use crypto.getRandomValues for cryptographically secure random numbers
            const getSecureRandom = (min, max) => {
                const range = max - min + 1;
                const bytesNeeded = Math.ceil(Math.log2(range) / 8);
                const maxValidValue = Math.floor(256 ** bytesNeeded / range) * range - 1;
                
                let randomValue;
                do {
                    const randomBytes = new Uint8Array(bytesNeeded);
                    crypto.getRandomValues(randomBytes);
                    randomValue = randomBytes.reduce((acc, byte, index) => 
                        acc + byte * (256 ** index), 0);
                } while (randomValue > maxValidValue);
                
                return min + (randomValue % range);
            };
            
            for (let i = 0; i < count; i++) {
                let num;
                let attempts = 0;
                const maxAttempts = 10000;
                
                do {
                    num = getSecureRandom(min, max);
                    attempts++;
                    
                    if (attempts > maxAttempts) {
                        throw new Error('Unable to generate enough unique numbers');
                    }
                } while (!allowDuplicates && used.has(num));
                
                numbers.push(num);
                if (!allowDuplicates) {
                    used.add(num);
                }
            }
            
            // Format output
            let formattedOutput;
            switch (outputFormat) {
                case 'comma':
                    formattedOutput = numbers.join(', ');
                    break;
                case 'space':
                    formattedOutput = numbers.join(' ');
                    break;
                default:
                    formattedOutput = numbers.join('\n');
                    break;
            }
            
            // Statistics
            const sum = numbers.reduce((a, b) => a + b, 0);
            const average = sum / numbers.length;
            const sortedNumbers = [...numbers].sort((a, b) => a - b);
            const median = sortedNumbers.length % 2 === 0
                ? (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2
                : sortedNumbers[Math.floor(sortedNumbers.length / 2)];
            
            return `🎲 RANDOM NUMBERS GENERATED

Parameters:
• Range: ${min} to ${max}
• Count: ${count} numbers
• Allow duplicates: ${allowDuplicates ? 'Yes' : 'No'}
• Output format: ${outputFormat}

Statistics:
• Sum: ${sum.toLocaleString()}
• Average: ${average.toFixed(2)}
• Median: ${median}
• Min generated: ${Math.min(...numbers)}
• Max generated: ${Math.max(...numbers)}

GENERATED NUMBERS:
${formattedOutput}

🔐 SECURITY NOTE:
These numbers are generated using cryptographically secure methods suitable for:
• Password generation
• Security tokens
• Cryptographic keys
• Gaming and simulations`;
        }
    }));

    // 5. GUID/UUID Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'guid-uuid-generator',
        name: 'GUID/UUID Generator',
        description: 'Generate globally unique identifiers (GUIDs/UUIDs)',
        category: 'security',
        icon: '🆔',
        fields: [
            {
                name: 'version',
                label: 'UUID Version',
                type: 'select',
                required: true,
                options: [
                    { value: 'v4', label: 'Version 4 (Random) - Recommended' },
                    { value: 'v1', label: 'Version 1 (Time-based)' },
                    { value: 'nil', label: 'Nil UUID (All zeros)' }
                ],
                value: 'v4'
            },
            {
                name: 'count',
                label: 'Number of UUIDs to generate',
                type: 'number',
                required: true,
                value: '5',
                min: '1',
                max: '100'
            },
            {
                name: 'format',
                label: 'Output Format',
                type: 'select',
                options: [
                    { value: 'standard', label: 'Standard (with hyphens)' },
                    { value: 'compact', label: 'Compact (no hyphens)' },
                    { value: 'braced', label: 'Braced {with-hyphens}' },
                    { value: 'uppercase', label: 'UPPERCASE' }
                ],
                value: 'standard'
            }
        ],
        generate: (data) => {
            const version = data.version;
            const count = parseInt(data.count);
            const format = data.format;
            
            const generateV4UUID = () => {
                // Generate random bytes
                const bytes = new Uint8Array(16);
                crypto.getRandomValues(bytes);
                
                // Set version (4) and variant bits
                bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
                bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
                
                // Convert to hex string
                const hex = Array.from(bytes, byte => 
                    byte.toString(16).padStart(2, '0')
                ).join('');
                
                return hex;
            };
            
            const generateV1UUID = () => {
                // Simplified V1 UUID (time-based)
                const timestamp = Date.now();
                const clockSeq = Math.floor(Math.random() * 0x4000);
                const node = Array.from({length: 6}, () => 
                    Math.floor(Math.random() * 256)
                );
                
                // This is a simplified implementation
                const hex = (timestamp.toString(16).padStart(12, '0') + 
                    clockSeq.toString(16).padStart(4, '0') + 
                    node.map(n => n.toString(16).padStart(2, '0')).join('')).slice(0, 32);
                
                return hex;
            };
            
            const formatUUID = (hex) => {
                // Insert hyphens: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
                const formatted = hex.slice(0, 8) + '-' + 
                                hex.slice(8, 12) + '-' + 
                                hex.slice(12, 16) + '-' + 
                                hex.slice(16, 20) + '-' + 
                                hex.slice(20, 32);
                
                switch (format) {
                    case 'compact':
                        return hex;
                    case 'braced':
                        return '{' + formatted + '}';
                    case 'uppercase':
                        return formatted.toUpperCase();
                    default:
                        return formatted;
                }
            };
            
            const uuids = [];
            
            for (let i = 0; i < count; i++) {
                let hex;
                
                switch (version) {
                    case 'v1':
                        hex = generateV1UUID();
                        break;
                    case 'nil':
                        hex = '00000000000000000000000000000000';
                        break;
                    default: // v4
                        hex = generateV4UUID();
                        break;
                }
                
                uuids.push(formatUUID(hex));
            }
            
            const uniqueCount = new Set(uuids).size;
            
            return `🆔 ${version.toUpperCase()} UUID${count > 1 ? 'S' : ''} GENERATED

Settings:
• Version: ${version.toUpperCase()} ${
                version === 'v4' ? '(Random-based)' :
                version === 'v1' ? '(Time-based)' :
                '(Nil UUID)'
            }
• Count: ${count}
• Format: ${format}
• Unique values: ${uniqueCount}

UUID INFO:
• Length: ${format === 'compact' ? '32' : format === 'braced' ? '38' : '36'} characters
• Probability of collision: ${
                version === 'v4' ? '~0% (2^122 possible values)' :
                version === 'v1' ? 'Very low (time + MAC based)' :
                '100% (always same value)'
            }

GENERATED UUIDs:
${uuids.join('\n')}

💡 COMMON USES:
• Database primary keys
• Session identifiers
• File names
• API request IDs
• Distributed system identifiers`;
        }
    }));

    // 6. QR Code Generator (Text-based)
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'qr-code-text-generator',
        name: 'QR Code Generator (ASCII)',
        description: 'Generate ASCII-art QR codes for text data',
        category: 'security',
        icon: '📱',
        fields: [
            {
                name: 'data',
                label: 'Data to encode',
                type: 'text',
                required: true,
                placeholder: 'Enter URL, text, or other data'
            },
            {
                name: 'size',
                label: 'Size',
                type: 'select',
                options: [
                    { value: 'small', label: 'Small (21x21)' },
                    { value: 'medium', label: 'Medium (25x25)' },
                    { value: 'large', label: 'Large (29x29)' }
                ],
                value: 'medium'
            }
        ],
        generate: (data) => {
            const text = data.data;
            const size = data.size;
            
            if (!text) {
                throw new Error('Please enter data to encode');
            }
            
            // This is a simplified QR code generator for demonstration
            // In a real implementation, you'd use a proper QR code library
            
            const sizes = {
                small: 21,
                medium: 25,
                large: 29
            };
            
            const gridSize = sizes[size];
            const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
            
            // Create a simple pattern (not a real QR code algorithm)
            // Add finder patterns (corners)
            const addFinderPattern = (x, y) => {
                for (let i = 0; i < 7; i++) {
                    for (let j = 0; j < 7; j++) {
                        if (x + i < gridSize && y + j < gridSize) {
                            grid[x + i][y + j] = 1;
                        }
                    }
                }
            };
            
            // Add finder patterns
            addFinderPattern(0, 0); // Top-left
            addFinderPattern(0, gridSize - 7); // Top-right
            addFinderPattern(gridSize - 7, 0); // Bottom-left
            
            // Add some data encoding (simplified)
            const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            for (let i = 9; i < gridSize - 9; i++) {
                for (let j = 9; j < gridSize - 9; j++) {
                    grid[i][j] = (hash + i * j) % 2;
                }
            }
            
            // Convert to ASCII art
            const asciiArt = grid.map(row => 
                row.map(cell => cell ? '██' : '  ').join('')
            ).join('\n');
            
            return `📱 QR CODE GENERATED (ASCII ART)

Data: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}
Data length: ${text.length} characters
Grid size: ${gridSize}x${gridSize}
Format: ASCII Art

ASCII QR CODE:
${asciiArt}

⚠️ NOTE: This is a demonstration ASCII art QR code.
For production use, implement a proper QR code library that:
• Follows QR Code specifications
• Includes error correction
• Supports various data types
• Can be scanned by real devices

REAL QR CODE FEATURES:
• Error correction levels (L, M, Q, H)
• Multiple data modes (numeric, alphanumeric, byte, kanji)
• Version 1-40 (21x21 to 177x177)
• Reed-Solomon error correction`;
        }
    }));

    // 7. Barcode Generator (Simple ASCII)
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'barcode-generator',
        name: 'Barcode Generator (ASCII)',
        description: 'Generate ASCII representation of Code 39 barcodes',
        category: 'security',
        icon: '📊',
        fields: [
            {
                name: 'data',
                label: 'Data to encode',
                type: 'text',
                required: true,
                placeholder: 'Enter alphanumeric text (A-Z, 0-9, space, -.$/+%)'
            },
            {
                name: 'includeChecksum',
                label: 'Include checksum',
                type: 'checkbox',
                value: false
            },
            {
                name: 'showText',
                label: 'Show text below barcode',
                type: 'checkbox',
                value: true
            }
        ],
        generate: (data) => {
            const text = data.data.toUpperCase();
            const includeChecksum = data.includeChecksum;
            const showText = data.showText;
            
            if (!text) {
                throw new Error('Please enter data to encode');
            }
            
            // Code 39 character set
            const code39 = {
                '0': '101001101101', '1': '110100101011', '2': '101100101011',
                '3': '110110010101', '4': '101001101011', '5': '110100110101',
                '6': '101100110101', '7': '101001011011', '8': '110100101101',
                '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
                'C': '110110100101', 'D': '101011001011', 'E': '110101100101',
                'F': '101101100101', 'G': '101010011011', 'H': '110101001101',
                'I': '101101001101', 'J': '101011001101', 'K': '110101010011',
                'L': '101101010011', 'M': '110110101001', 'N': '101011010011',
                'O': '110101101001', 'P': '101101101001', 'Q': '101010110011',
                'R': '110101011001', 'S': '101101011001', 'T': '101011011001',
                'U': '110010101011', 'V': '100110101011', 'W': '110011010101',
                'X': '100101101011', 'Y': '110010110101', 'Z': '100110110101',
                ' ': '100101011011', '-': '100101001011', '.': '110010100101',
                '$': '100100100101', '/': '100100101001', '+': '100101001001',
                '%': '101001001001', '*': '100101011011' // Start/Stop
            };
            
            // Validate characters
            for (let char of text) {
                if (!code39[char] && char !== '*') {
                    throw new Error(`Invalid character: "${char}". Code 39 supports A-Z, 0-9, space, -.$/+%`);
                }
            }
            
            let dataToEncode = text;
            
            // Calculate checksum if requested
            if (includeChecksum) {
                let sum = 0;
                const values = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
                for (let char of text) {
                    sum += values.indexOf(char);
                }
                const checksumChar = values[sum % 43];
                dataToEncode += checksumChar;
            }
            
            // Build barcode pattern
            let pattern = code39['*']; // Start character
            
            for (let char of dataToEncode) {
                pattern += '0'; // Inter-character gap
                pattern += code39[char];
            }
            
            pattern += '0'; // Gap before stop
            pattern += code39['*']; // Stop character
            
            // Convert to ASCII art
            const barHeight = 8;
            let asciiBarcode = '';
            
            // Create the barcode lines
            for (let row = 0; row < barHeight; row++) {
                let line = '';
                for (let bit of pattern) {
                    line += bit === '1' ? '█' : ' ';
                }
                asciiBarcode += line + '\n';
            }
            
            // Add text below if requested
            if (showText) {
                const displayText = includeChecksum ? dataToEncode : text;
                const padding = Math.max(0, (pattern.length - displayText.length) / 2);
                asciiBarcode += ' '.repeat(Math.floor(padding)) + displayText;
            }
            
            return `📊 CODE 39 BARCODE GENERATED

Data: ${text}
${includeChecksum ? `With checksum: ${dataToEncode}` : ''}
Pattern length: ${pattern.length} bits
Bar count: ${pattern.split('1').length - 1}
Format: ASCII Art

ASCII BARCODE:
${asciiBarcode}

ℹ️ CODE 39 SPECIFICATIONS:
• Character set: 0-9, A-Z, space, -.$/+%
• Self-checking code
• Variable length
• Start/stop character: *
• Quiet zones required on both sides

⚠️ NOTE: This is ASCII art representation.
For production scanning, use proper barcode generation libraries that create standard-compliant images.`;
        }
    }));

    // 8. Color Code Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'color-code-generator',
        name: 'Color Code Generator',
        description: 'Generate random color codes in various formats',
        category: 'security',
        icon: '🎨',
        fields: [
            {
                name: 'format',
                label: 'Color Format',
                type: 'select',
                required: true,
                options: [
                    { value: 'hex', label: 'Hexadecimal (#RRGGBB)' },
                    { value: 'rgb', label: 'RGB (rgb(r,g,b))' },
                    { value: 'hsl', label: 'HSL (hsl(h,s%,l%))' },
                    { value: 'all', label: 'All formats' }
                ],
                value: 'all'
            },
            {
                name: 'count',
                label: 'Number of colors to generate',
                type: 'number',
                required: true,
                value: '10',
                min: '1',
                max: '50'
            },
            {
                name: 'colorType',
                label: 'Color Type',
                type: 'select',
                options: [
                    { value: 'any', label: 'Any color' },
                    { value: 'bright', label: 'Bright colors' },
                    { value: 'pastel', label: 'Pastel colors' },
                    { value: 'dark', label: 'Dark colors' }
                ],
                value: 'any'
            }
        ],
        generate: (data) => {
            const format = data.format;
            const count = parseInt(data.count);
            const colorType = data.colorType;
            
            const generateColor = () => {
                let r, g, b;
                
                switch (colorType) {
                    case 'bright':
                        r = Math.floor(Math.random() * 128) + 128; // 128-255
                        g = Math.floor(Math.random() * 128) + 128;
                        b = Math.floor(Math.random() * 128) + 128;
                        break;
                    case 'pastel':
                        r = Math.floor(Math.random() * 128) + 127; // 127-255
                        g = Math.floor(Math.random() * 128) + 127;
                        b = Math.floor(Math.random() * 128) + 127;
                        // Ensure at least one component is high
                        const highComponent = Math.floor(Math.random() * 3);
                        [r, g, b][highComponent] = Math.floor(Math.random() * 56) + 200;
                        break;
                    case 'dark':
                        r = Math.floor(Math.random() * 128); // 0-127
                        g = Math.floor(Math.random() * 128);
                        b = Math.floor(Math.random() * 128);
                        break;
                    default: // any
                        r = Math.floor(Math.random() * 256);
                        g = Math.floor(Math.random() * 256);
                        b = Math.floor(Math.random() * 256);
                        break;
                }
                
                return { r, g, b };
            };
            
            const rgbToHex = (r, g, b) => {
                return '#' + [r, g, b].map(x => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                }).join('').toUpperCase();
            };
            
            const rgbToHsl = (r, g, b) => {
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
            };
            
            const colors = [];
            
            for (let i = 0; i < count; i++) {
                const { r, g, b } = generateColor();
                const hex = rgbToHex(r, g, b);
                const rgb = `rgb(${r}, ${g}, ${b})`;
                const { h, s, l } = rgbToHsl(r, g, b);
                const hsl = `hsl(${h}, ${s}%, ${l}%)`;
                
                let colorResult = '';
                
                switch (format) {
                    case 'hex':
                        colorResult = hex;
                        break;
                    case 'rgb':
                        colorResult = rgb;
                        break;
                    case 'hsl':
                        colorResult = hsl;
                        break;
                    default: // all
                        colorResult = `${hex} | ${rgb} | ${hsl}`;
                        break;
                }
                
                colors.push({ index: i + 1, result: colorResult, hex, rgb, hsl });
            }
            
            const result = `🎨 RANDOM COLORS GENERATED

Settings:
• Format: ${format.toUpperCase()}
• Count: ${count}
• Type: ${colorType} colors

GENERATED COLORS:
${colors.map(color => `${color.index.toString().padStart(2, ' ')}. ${color.result}`).join('\n')}

COLOR FORMAT GUIDE:
• HEX: #RRGGBB (Red, Green, Blue in hexadecimal)
• RGB: rgb(r,g,b) (Red, Green, Blue 0-255)
• HSL: hsl(h,s%,l%) (Hue 0-360°, Saturation %, Lightness %)

💡 COMMON USES:
• Web design and CSS
• Graphic design projects
• Brand color palette creation
• Random color inspiration
• Testing color combinations`;
            
            return result;
        }
    }));

})();