// SEO & Marketing Tools
(function() {
    'use strict';

    // 1. SEO Meta Tag Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'seo-meta-generator',
        name: 'SEO Meta Tag Generator',
        description: 'Generate complete SEO meta tags for websites',
        category: 'seo',
        icon: '🔍',
        fields: [
            {
                name: 'pageTitle',
                label: 'Page Title',
                type: 'text',
                placeholder: 'Your Amazing Website Title',
                required: true,
                maxlength: '60'
            },
            {
                name: 'pageDescription',
                label: 'Meta Description',
                type: 'textarea',
                placeholder: 'A compelling description of your page content...',
                required: true,
                rows: 3,
                maxlength: '160'
            },
            {
                name: 'keywords',
                label: 'Keywords (comma-separated)',
                type: 'textarea',
                placeholder: 'seo, marketing, tools, website',
                rows: 2
            },
            {
                name: 'canonicalUrl',
                label: 'Canonical URL',
                type: 'url',
                placeholder: 'https://example.com/page'
            },
            {
                name: 'ogTitle',
                label: 'Open Graph Title (optional)',
                type: 'text',
                placeholder: 'Leave blank to use Page Title'
            },
            {
                name: 'ogDescription',
                label: 'Open Graph Description (optional)',
                type: 'textarea',
                placeholder: 'Leave blank to use Meta Description',
                rows: 2
            },
            {
                name: 'ogImage',
                label: 'Open Graph Image URL',
                type: 'url',
                placeholder: 'https://example.com/image.jpg'
            },
            {
                name: 'twitterHandle',
                label: 'Twitter Handle (without @)',
                type: 'text',
                placeholder: 'yourusername'
            },
            {
                name: 'author',
                label: 'Author Name',
                type: 'text',
                placeholder: 'John Doe'
            },
            {
                name: 'siteName',
                label: 'Site Name',
                type: 'text',
                placeholder: 'Your Website'
            }
        ],
        generate: (data) => {
            const title = data.pageTitle;
            const description = data.pageDescription;
            const keywords = data.keywords;
            const canonical = data.canonicalUrl;
            const ogTitle = data.ogTitle || title;
            const ogDescription = data.ogDescription || description;
            const ogImage = data.ogImage;
            const twitterHandle = data.twitterHandle;
            const author = data.author;
            const siteName = data.siteName;

            if (!title || !description) {
                throw new Error('Page title and description are required');
            }

            // Basic SEO validation
            const titleLength = title.length;
            const descLength = description.length;
            const titleWarning = titleLength > 60 ? '⚠️ Title too long (>60 chars)' : titleLength < 30 ? '⚠️ Title too short (<30 chars)' : '✅ Good title length';
            const descWarning = descLength > 160 ? '⚠️ Description too long (>160 chars)' : descLength < 120 ? '⚠️ Description too short (<120 chars)' : '✅ Good description length';

            let metaTags = `<!-- Essential META Tags -->\n`;
            metaTags += `<meta charset="utf-8">\n`;
            metaTags += `<meta name="viewport" content="width=device-width, initial-scale=1">\n`;
            metaTags += `<title>${title}</title>\n`;
            metaTags += `<meta name="description" content="${description}">\n`;
            
            if (keywords) {
                metaTags += `<meta name="keywords" content="${keywords}">\n`;
            }
            
            if (author) {
                metaTags += `<meta name="author" content="${author}">\n`;
            }

            if (canonical) {
                metaTags += `<link rel="canonical" href="${canonical}">\n`;
            }

            metaTags += `\n<!-- Open Graph META Tags -->\n`;
            metaTags += `<meta property="og:title" content="${ogTitle}">\n`;
            metaTags += `<meta property="og:description" content="${ogDescription}">\n`;
            metaTags += `<meta property="og:type" content="website">\n`;
            
            if (canonical) {
                metaTags += `<meta property="og:url" content="${canonical}">\n`;
            }
            
            if (ogImage) {
                metaTags += `<meta property="og:image" content="${ogImage}">\n`;
                metaTags += `<meta property="og:image:width" content="1200">\n`;
                metaTags += `<meta property="og:image:height" content="630">\n`;
            }
            
            if (siteName) {
                metaTags += `<meta property="og:site_name" content="${siteName}">\n`;
            }

            metaTags += `\n<!-- Twitter META Tags -->\n`;
            metaTags += `<meta name="twitter:card" content="summary_large_image">\n`;
            metaTags += `<meta name="twitter:title" content="${ogTitle}">\n`;
            metaTags += `<meta name="twitter:description" content="${ogDescription}">\n`;
            
            if (twitterHandle) {
                metaTags += `<meta name="twitter:site" content="@${twitterHandle}">\n`;
                metaTags += `<meta name="twitter:creator" content="@${twitterHandle}">\n`;
            }
            
            if (ogImage) {
                metaTags += `<meta name="twitter:image" content="${ogImage}">\n`;
            }

            metaTags += `\n<!-- Additional SEO META Tags -->\n`;
            metaTags += `<meta name="robots" content="index, follow">\n`;
            metaTags += `<meta name="googlebot" content="index, follow">\n`;
            metaTags += `<meta name="bingbot" content="index, follow">\n`;
            metaTags += `<meta name="revisit-after" content="7 days">\n`;
            metaTags += `<meta name="rating" content="General">\n`;
            metaTags += `<meta name="distribution" content="web">\n`;

            // Generate structured data
            const structuredData = {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": title,
                "description": description,
                "url": canonical || ""
            };

            if (author) {
                structuredData.author = {
                    "@type": "Person",
                    "name": author
                };
            }

            const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;

            return `SEO META TAGS GENERATED

Page Title: "${title}" (${titleLength} chars) ${titleWarning}
Description: "${description}" (${descLength} chars) ${descWarning}

COMPLETE HTML META TAGS:
\`\`\`html
${metaTags}

${jsonLd}
\`\`\`

GOOGLE SEARCH PREVIEW:
<div style="max-width: 600px; margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
    <div style="color: #1a0dab; font-size: 18px; margin-bottom: 5px; text-decoration: underline; cursor: pointer;">
        ${title}
    </div>
    <div style="color: #006621; font-size: 14px; margin-bottom: 5px;">
        ${canonical || 'https://example.com'}
    </div>
    <div style="color: #545454; font-size: 14px; line-height: 1.4;">
        ${description}
    </div>
</div>

SOCIAL MEDIA PREVIEW:
<div style="max-width: 500px; margin: 20px 0; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; background: white;">
    ${ogImage ? `<div style="height: 200px; background: url('${ogImage}') center/cover; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; color: #666;">🖼️ Image Preview</div>` : ''}
    <div style="padding: 15px;">
        <div style="font-weight: bold; color: #14171a; margin-bottom: 5px; font-size: 16px;">
            ${ogTitle}
        </div>
        <div style="color: #657786; font-size: 14px; line-height: 1.3;">
            ${ogDescription.substring(0, 100)}${ogDescription.length > 100 ? '...' : ''}
        </div>
        <div style="color: #657786; font-size: 13px; margin-top: 8px;">
            ${canonical ? new URL(canonical).hostname : 'example.com'}
        </div>
    </div>
</div>

SEO CHECKLIST:
${generateSEOChecklist(data)}

OPTIMIZATION RECOMMENDATIONS:
${generateOptimizationTips(data, titleLength, descLength)}

TESTING TOOLS:
• Google Search Console: Check indexing status
• Facebook Debugger: Test Open Graph tags
• Twitter Card Validator: Test Twitter cards
• Google Rich Results Test: Test structured data
• PageSpeed Insights: Check page performance`;

            function generateSEOChecklist(data) {
                const checks = [];
                checks.push(data.pageTitle ? '✅ Page title present' : '❌ Missing page title');
                checks.push(data.pageDescription ? '✅ Meta description present' : '❌ Missing meta description');
                checks.push(data.canonicalUrl ? '✅ Canonical URL set' : '⚠️ Consider adding canonical URL');
                checks.push(data.ogImage ? '✅ Open Graph image set' : '⚠️ Consider adding OG image (1200x630px)');
                checks.push(data.keywords ? '✅ Keywords specified' : '⚠️ Consider adding relevant keywords');
                checks.push(data.author ? '✅ Author specified' : '⚠️ Consider adding author');
                checks.push('✅ Robots meta tag set to index, follow');
                checks.push('✅ Viewport meta tag included');
                checks.push('✅ UTF-8 charset specified');
                checks.push('✅ Structured data (JSON-LD) included');
                return checks.join('\n');
            }

            function generateOptimizationTips(data, titleLen, descLen) {
                const tips = [];
                
                if (titleLen > 60) tips.push('• Shorten title to under 60 characters');
                if (titleLen < 30) tips.push('• Expand title to 30-60 characters');
                if (descLen > 160) tips.push('• Shorten description to under 160 characters');
                if (descLen < 120) tips.push('• Expand description to 120-160 characters');
                if (!data.ogImage) tips.push('• Add Open Graph image (1200x630px recommended)');
                if (!data.keywords) tips.push('• Research and add relevant keywords');
                if (!data.twitterHandle) tips.push('• Add Twitter handle for better social sharing');
                if (!data.canonicalUrl) tips.push('• Set canonical URL to avoid duplicate content');
                
                tips.push('• Use target keywords naturally in title and description');
                tips.push('• Make title and description compelling for click-through');
                tips.push('• Ensure page loads quickly (<3 seconds)');
                tips.push('• Make content mobile-friendly and responsive');
                tips.push('• Add internal and external links where relevant');
                
                return tips.join('\n');
            }
        }
    }));

    // 2. Keyword Density Analyzer
    ToolRegistry.register(ToolTemplates.createConverter({
        id: 'keyword-density-analyzer',
        name: 'Keyword Density Analyzer',
        description: 'Analyze keyword density and SEO metrics in text content',
        category: 'seo',
        icon: '📊',
        fields: [
            {
                name: 'content',
                label: 'Content to Analyze',
                type: 'textarea',
                placeholder: 'Paste your article, blog post, or web page content here...',
                required: true,
                rows: 10
            },
            {
                name: 'targetKeyword',
                label: 'Target Keyword (optional)',
                type: 'text',
                placeholder: 'e.g., SEO optimization'
            },
            {
                name: 'minWordLength',
                label: 'Minimum Word Length',
                type: 'number',
                value: '3',
                min: '1',
                max: '10'
            }
        ],
        convert: (data) => {
            const content = data.content.trim();
            const targetKeyword = data.targetKeyword?.toLowerCase().trim();
            const minLength = parseInt(data.minWordLength) || 3;

            if (!content) {
                throw new Error('Please enter content to analyze');
            }

            // Clean and analyze text
            const words = content.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter(word => word.length >= minLength);

            const totalWords = words.length;
            const wordCount = {};
            
            // Count word frequencies
            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });

            // Calculate densities and sort by frequency
            const wordDensities = Object.entries(wordCount)
                .map(([word, count]) => ({
                    word,
                    count,
                    density: ((count / totalWords) * 100).toFixed(2)
                }))
                .sort((a, b) => b.count - a.count);

            // Get top keywords
            const topKeywords = wordDensities.slice(0, 20);

            // Analyze target keyword if provided
            let targetAnalysis = '';
            if (targetKeyword) {
                const targetWords = targetKeyword.split(/\s+/);
                let targetCount = 0;
                
                if (targetWords.length === 1) {
                    targetCount = wordCount[targetKeyword] || 0;
                } else {
                    // Count phrase occurrences
                    const contentLower = content.toLowerCase();
                    const regex = new RegExp(targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                    const matches = contentLower.match(regex);
                    targetCount = matches ? matches.length : 0;
                }

                const targetDensity = ((targetCount / totalWords) * 100).toFixed(2);
                
                targetAnalysis = `
TARGET KEYWORD ANALYSIS:
Keyword: "${targetKeyword}"
Occurrences: ${targetCount}
Density: ${targetDensity}%
Recommendation: ${getKeywordRecommendation(parseFloat(targetDensity))}`;
            }

            // Text statistics
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
            const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
            const characters = content.length;
            const charactersNoSpaces = content.replace(/\s/g, '').length;
            const avgWordsPerSentence = sentences > 0 ? (totalWords / sentences).toFixed(1) : 0;
            const readingTime = Math.ceil(totalWords / 200); // Average reading speed

            // SEO analysis
            const seoScore = calculateSEOScore(content, targetKeyword, wordDensities);

            return `KEYWORD DENSITY ANALYSIS COMPLETE

CONTENT STATISTICS:
• Total Words: ${totalWords.toLocaleString()}
• Total Characters: ${characters.toLocaleString()} (${charactersNoSpaces.toLocaleString()} without spaces)
• Sentences: ${sentences}
• Paragraphs: ${paragraphs}
• Average Words per Sentence: ${avgWordsPerSentence}
• Estimated Reading Time: ${readingTime} minute${readingTime !== 1 ? 's' : ''}

${targetAnalysis}

TOP 20 KEYWORDS:
<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #e9ecef;">
                <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Rank</th>
                <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Keyword</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #dee2e6;">Count</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #dee2e6;">Density</th>
            </tr>
        </thead>
        <tbody>
            ${topKeywords.map((item, index) => {
                const isTarget = targetKeyword && item.word === targetKeyword;
                const bgColor = isTarget ? '#d4edda' : index % 2 === 0 ? '#ffffff' : '#f8f9fa';
                return `<tr style="background: ${bgColor};">
                    <td style="padding: 6px 8px; border: 1px solid #dee2e6;">${index + 1}</td>
                    <td style="padding: 6px 8px; border: 1px solid #dee2e6; font-weight: ${isTarget ? 'bold' : 'normal'};">${item.word}${isTarget ? ' 🎯' : ''}</td>
                    <td style="padding: 6px 8px; border: 1px solid #dee2e6; text-align: right;">${item.count}</td>
                    <td style="padding: 6px 8px; border: 1px solid #dee2e6; text-align: right;">${item.density}%</td>
                </tr>`;
            }).join('')}
        </tbody>
    </table>
</div>

KEYWORD DENSITY RANGES:
• 0-0.5%: Very Low (may need more focus)
• 0.5-1%: Low (acceptable for natural content)
• 1-2%: Good (optimal for most content)
• 2-3%: High (may appear over-optimized)
• 3%+: Very High (risk of keyword stuffing)

SEO CONTENT SCORE: ${seoScore.total}/100
${seoScore.breakdown}

READABILITY ANALYSIS:
• Average sentence length: ${avgWordsPerSentence} words ${getReadabilityNote(parseFloat(avgWordsPerSentence))}
• Content length: ${totalWords} words ${getLengthNote(totalWords)}
• Paragraph structure: ${paragraphs} paragraphs ${getParagraphNote(paragraphs, totalWords)}

OPTIMIZATION RECOMMENDATIONS:
${generateOptimizationRecommendations(wordDensities, totalWords, sentences, targetKeyword)}

CONTENT QUALITY CHECKLIST:
□ Target keyword appears in title
□ Target keyword appears in first paragraph
□ Target keyword appears in headings (H1, H2, H3)
□ Content is 300+ words for basic SEO
□ Content is 1000+ words for competitive keywords
□ Sentences are varied in length
□ Paragraphs are 2-4 sentences each
□ Content includes related keywords and synonyms
□ Content provides value to readers
□ Content is original and not duplicated`;

            function getKeywordRecommendation(density) {
                if (density === 0) return '❌ Keyword not found - add target keyword naturally';
                if (density < 0.5) return '⚠️ Very low density - consider adding keyword naturally';
                if (density >= 0.5 && density <= 2) return '✅ Good density - well optimized';
                if (density > 2 && density <= 3) return '⚠️ High density - may appear over-optimized';
                return '❌ Very high density - risk of keyword stuffing penalty';
            }

            function calculateSEOScore(content, targetKeyword, densities) {
                let score = 0;
                const breakdown = [];

                // Word count (0-25 points)
                const wordCount = content.split(/\s+/).length;
                if (wordCount >= 300) {
                    const wordPoints = Math.min(25, Math.floor(wordCount / 40));
                    score += wordPoints;
                    breakdown.push(`✅ Word count (${wordCount}): +${wordPoints} points`);
                } else {
                    breakdown.push(`❌ Word count too low (${wordCount} < 300): +0 points`);
                }

                // Keyword optimization (0-30 points)
                if (targetKeyword) {
                    const targetDensity = parseFloat(densities.find(d => d.word === targetKeyword)?.density || 0);
                    if (targetDensity >= 0.5 && targetDensity <= 2) {
                        score += 30;
                        breakdown.push(`✅ Target keyword density (${targetDensity}%): +30 points`);
                    } else if (targetDensity > 0) {
                        score += 15;
                        breakdown.push(`⚠️ Target keyword density (${targetDensity}%): +15 points`);
                    } else {
                        breakdown.push(`❌ Target keyword not found: +0 points`);
                    }
                } else {
                    breakdown.push(`⚠️ No target keyword specified: +0 points`);
                }

                // Content structure (0-20 points)
                const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
                const avgSentenceLength = wordCount / sentences;
                if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
                    score += 20;
                    breakdown.push(`✅ Good sentence structure: +20 points`);
                } else {
                    score += 10;
                    breakdown.push(`⚠️ Sentence structure could improve: +10 points`);
                }

                // Keyword diversity (0-25 points)
                const uniqueWords = Object.keys(densities).length;
                const diversity = uniqueWords / wordCount;
                if (diversity >= 0.4) {
                    score += 25;
                    breakdown.push(`✅ Good keyword diversity: +25 points`);
                } else if (diversity >= 0.3) {
                    score += 15;
                    breakdown.push(`⚠️ Moderate keyword diversity: +15 points`);
                } else {
                    score += 5;
                    breakdown.push(`❌ Low keyword diversity: +5 points`);
                }

                return { total: score, breakdown: breakdown.join('\n') };
            }

            function getReadabilityNote(avgLength) {
                if (avgLength < 10) return '(very easy to read)';
                if (avgLength < 15) return '(easy to read)';
                if (avgLength < 20) return '(moderately easy to read)';
                if (avgLength < 25) return '(somewhat difficult to read)';
                return '(difficult to read - consider shorter sentences)';
            }

            function getLengthNote(wordCount) {
                if (wordCount < 300) return '(too short for SEO)';
                if (wordCount < 600) return '(good for basic SEO)';
                if (wordCount < 1200) return '(good for competitive keywords)';
                if (wordCount < 2000) return '(excellent for SEO)';
                return '(very comprehensive)';
            }

            function getParagraphNote(paragraphs, words) {
                const avgWordsPerParagraph = words / paragraphs;
                if (avgWordsPerParagraph < 50) return '(good paragraph length)';
                if (avgWordsPerParagraph < 100) return '(acceptable paragraph length)';
                return '(consider breaking into shorter paragraphs)';
            }

            function generateOptimizationRecommendations(densities, wordCount, sentences, targetKeyword) {
                const recommendations = [];

                if (wordCount < 300) {
                    recommendations.push('• Expand content to at least 300 words for basic SEO');
                }

                if (wordCount < 1000 && targetKeyword) {
                    recommendations.push('• Consider expanding to 1000+ words for competitive keywords');
                }

                const avgSentenceLength = wordCount / sentences;
                if (avgSentenceLength > 25) {
                    recommendations.push('• Break down long sentences for better readability');
                }

                if (targetKeyword) {
                    const targetDensity = parseFloat(densities.find(d => d.word === targetKeyword)?.density || 0);
                    if (targetDensity === 0) {
                        recommendations.push('• Add target keyword naturally throughout content');
                    } else if (targetDensity > 3) {
                        recommendations.push('• Reduce keyword density to avoid over-optimization');
                    }
                }

                const topDensity = parseFloat(densities[0]?.density || 0);
                if (topDensity > 4) {
                    recommendations.push(`• "${densities[0].word}" appears too frequently (${topDensity}%)`);
                }

                recommendations.push('• Use related keywords and synonyms naturally');
                recommendations.push('• Ensure content provides genuine value to readers');
                recommendations.push('• Include target keyword in headings and subheadings');
                recommendations.push('• Add internal and external links where relevant');

                return recommendations.join('\n');
            }
        }
    }));

    // 3. Social Media Hashtag Generator
    ToolRegistry.register(ToolTemplates.createGenerator({
        id: 'hashtag-generator',
        name: 'Social Media Hashtag Generator',
        description: 'Generate relevant hashtags for social media posts',
        category: 'seo',
        icon: '#️⃣',
        fields: [
            {
                name: 'topic',
                label: 'Topic/Content Theme',
                type: 'text',
                placeholder: 'e.g., fitness, cooking, travel, photography',
                required: true
            },
            {
                name: 'platform',
                label: 'Social Media Platform',
                type: 'select',
                options: [
                    { value: 'instagram', label: 'Instagram' },
                    { value: 'twitter', label: 'Twitter/X' },
                    { value: 'linkedin', label: 'LinkedIn' },
                    { value: 'tiktok', label: 'TikTok' },
                    { value: 'facebook', label: 'Facebook' },
                    { value: 'general', label: 'General Purpose' }
                ],
                value: 'instagram'
            },
            {
                name: 'niche',
                label: 'Specific Niche (optional)',
                type: 'text',
                placeholder: 'e.g., vegan recipes, street photography'
            },
            {
                name: 'location',
                label: 'Location (optional)',
                type: 'text',
                placeholder: 'e.g., NYC, London, California'
            },
            {
                name: 'hashtagCount',
                label: 'Number of Hashtags',
                type: 'number',
                value: '20',
                min: '5',
                max: '50'
            }
        ],
        generate: (data) => {
            const topic = data.topic.toLowerCase().trim();
            const platform = data.platform;
            const niche = data.niche?.toLowerCase().trim();
            const location = data.location?.trim();
            const count = parseInt(data.hashtagCount);

            if (!topic) {
                throw new Error('Please enter a topic or content theme');
            }

            // Hashtag databases by category
            const hashtagDatabase = {
                fitness: {
                    popular: ['#fitness', '#workout', '#gym', '#health', '#motivation', '#fitfam', '#strong', '#training'],
                    medium: ['#fitnessmotivation', '#gymlife', '#healthylifestyle', '#bodybuilding', '#cardio', '#strength', '#fitgirl', '#fitboy'],
                    niche: ['#homeworkout', '#crossfit', '#yoga', '#running', '#weightlifting', '#pilates', '#hiit', '#calisthenics']
                },
                food: {
                    popular: ['#food', '#foodie', '#yummy', '#delicious', '#cooking', '#recipe', '#foodstagram', '#instafood'],
                    medium: ['#foodporn', '#homemade', '#foodblogger', '#tasty', '#dinner', '#lunch', '#breakfast', '#foodphotography'],
                    niche: ['#vegan', '#vegetarian', '#keto', '#paleo', '#glutenfree', '#healthy', '#organic', '#plantbased']
                },
                travel: {
                    popular: ['#travel', '#wanderlust', '#adventure', '#explore', '#vacation', '#trip', '#travelblogger', '#instatravel'],
                    medium: ['#traveling', '#travelgram', '#backpacking', '#holiday', '#tourism', '#beautiful', '#nature', '#photography'],
                    niche: ['#solotravel', '#roadtrip', '#camping', '#hiking', '#beach', '#mountains', '#citybreak', '#culture']
                },
                photography: {
                    popular: ['#photography', '#photo', '#photographer', '#art', '#beautiful', '#nature', '#portrait', '#landscape'],
                    medium: ['#photooftheday', '#instaphoto', '#picoftheday', '#canon', '#nikon', '#sony', '#lightroom', '#photoshoot'],
                    niche: ['#streetphotography', '#wildlifephotography', '#macro', '#blackandwhite', '#sunset', '#golden hour', '#minimalism', '#abstract']
                },
                business: {
                    popular: ['#business', '#entrepreneur', '#success', '#motivation', '#marketing', '#startup', '#leadership', '#money'],
                    medium: ['#businessowner', '#entrepreneurship', '#mindset', '#productivity', '#sales', '#branding', '#networking', '#growth'],
                    niche: ['#smallbusiness', '#onlinebusiness', '#digitalmarketing', '#socialmedia', '#ecommerce', '#freelance', '#consulting', '#innovation']
                },
                technology: {
                    popular: ['#technology', '#tech', '#innovation', '#digital', '#programming', '#coding', '#software', '#developer'],
                    medium: ['#artificialintelligence', '#ai', '#machinelearning', '#blockchain', '#cybersecurity', '#startups', '#gadgets', '#mobile'],
                    niche: ['#webdevelopment', '#javascript', '#python', '#react', '#nodejs', '#cloudcomputing', '#iot', '#bigdata']
                }
            };

            // Generate hashtags based on topic
            const baseHashtags = generateBaseHashtags(topic, niche);
            const categoryHashtags = getCategoryHashtags(topic, hashtagDatabase);
            const locationHashtags = generateLocationHashtags(location);
            const trendingHashtags = generateTrendingHashtags(platform);

            // Combine and deduplicate
            const allHashtags = [...baseHashtags, ...categoryHashtags, ...locationHashtags, ...trendingHashtags];
            const uniqueHashtags = [...new Set(allHashtags)];
            
            // Sort by estimated popularity and select top count
            const selectedHashtags = uniqueHashtags
                .sort((a, b) => getHashtagPopularity(a) - getHashtagPopularity(b))
                .slice(0, count);

            // Platform-specific recommendations
            const platformTips = getPlatformTips(platform);
            
            // Generate hashtag groups
            const hashtagGroups = groupHashtagsByPopularity(selectedHashtags);

            return `HASHTAG STRATEGY GENERATED

Topic: ${topic}
Platform: ${platform}
${niche ? `Niche: ${niche}` : ''}
${location ? `Location: ${location}` : ''}

GENERATED HASHTAGS (${selectedHashtags.length}):
${selectedHashtags.join(' ')}

COPY-PASTE READY:
<div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; word-break: break-all;">
    <textarea style="width: 100%; height: 80px; border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-family: monospace;" readonly onclick="this.select()">${selectedHashtags.join(' ')}</textarea>
</div>

HASHTAG GROUPS BY POPULARITY:

HIGH COMPETITION (Popular):
${hashtagGroups.popular.join(' ')}

MEDIUM COMPETITION (Balanced):
${hashtagGroups.medium.join(' ')}

LOW COMPETITION (Niche):
${hashtagGroups.niche.join(' ')}

PLATFORM-SPECIFIC TIPS:
${platformTips}

HASHTAG STRATEGY RECOMMENDATIONS:
• Mix of popular, medium, and niche hashtags (30-30-40 rule)
• Use 3-5 popular hashtags to reach wide audience
• Use 6-8 medium hashtags for better engagement
• Use 9-12 niche hashtags to target specific communities
• Rotate hashtags regularly to avoid shadowbanning
• Research trending hashtags in your industry weekly
• Create branded hashtags for your business/personal brand
• Monitor hashtag performance and adjust strategy

BEST PRACTICES:
• Don't use banned or flagged hashtags
• Keep hashtags relevant to your content
• Use a mix of broad and specific tags
• Research your competitors' hashtag strategies
• Engage with posts using your target hashtags
• Create content that matches hashtag expectations
• Use hashtag analytics tools to track performance

CONTENT PLANNING:
• Save hashtag sets for different content types
• Create seasonal/holiday hashtag variations
• Prepare hashtags before posting for consistency
• Test different hashtag combinations
• Track which hashtags drive the most engagement

HASHTAG RESEARCH TOOLS:
• Platform built-in search and suggestions
• Hashtagify.me for hashtag analytics
• RiteTag for real-time hashtag suggestions  
• All Hashtag for hashtag generation
• Keyhole for hashtag tracking and analytics`;

            function generateBaseHashtags(topic, niche) {
                const hashtags = [`#${topic.replace(/\s+/g, '')}`];
                
                // Add variations of the main topic
                const words = topic.split(' ');
                words.forEach(word => {
                    if (word.length > 3) {
                        hashtags.push(`#${word}`);
                    }
                });

                // Add niche hashtags
                if (niche) {
                    hashtags.push(`#${niche.replace(/\s+/g, '')}`);
                    const nicheWords = niche.split(' ');
                    nicheWords.forEach(word => {
                        if (word.length > 3) {
                            hashtags.push(`#${word}`);
                        }
                    });
                }

                return hashtags;
            }

            function getCategoryHashtags(topic, database) {
                // Find best matching category
                let bestMatch = '';
                let maxMatches = 0;

                Object.keys(database).forEach(category => {
                    const matches = topic.split(' ').filter(word => 
                        category.includes(word) || word.includes(category)
                    ).length;
                    
                    if (matches > maxMatches) {
                        maxMatches = matches;
                        bestMatch = category;
                    }
                });

                // If no direct match, try partial matches
                if (!bestMatch) {
                    Object.keys(database).forEach(category => {
                        if (topic.includes(category) || category.includes(topic)) {
                            bestMatch = category;
                        }
                    });
                }

                // Return hashtags from best matching category or general ones
                if (bestMatch && database[bestMatch]) {
                    const cat = database[bestMatch];
                    return [...cat.popular, ...cat.medium, ...cat.niche];
                }

                // Fallback general hashtags
                return ['#life', '#lifestyle', '#daily', '#inspiration', '#creative', '#content', '#community', '#love'];
            }

            function generateLocationHashtags(location) {
                if (!location) return [];
                
                const hashtags = [`#${location.replace(/\s+/g, '')}`];
                
                // Add common location variations
                hashtags.push(`#${location.replace(/\s+/g, '')}life`);
                hashtags.push(`#visit${location.replace(/\s+/g, '')}`);
                hashtags.push(`#explore${location.replace(/\s+/g, '')}`);
                
                return hashtags;
            }

            function generateTrendingHashtags(platform) {
                const trending = {
                    instagram: ['#reels', '#instagood', '#photooftheday', '#love', '#beautiful', '#happy', '#style', '#life'],
                    twitter: ['#trending', '#viral', '#news', '#breaking', '#opinion', '#thread', '#facts', '#update'],
                    linkedin: ['#professional', '#networking', '#career', '#industry', '#insights', '#leadership', '#growth', '#tips'],
                    tiktok: ['#fyp', '#viral', '#trending', '#foryou', '#challenge', '#dance', '#funny', '#creative'],
                    facebook: ['#community', '#friends', '#family', '#memories', '#local', '#events', '#news', '#updates']
                };

                return trending[platform] || trending.general || [];
            }

            function getHashtagPopularity(hashtag) {
                // Simple popularity scoring (lower = more popular)
                const popularTags = ['#love', '#instagood', '#photooftheday', '#beautiful', '#happy', '#fashion', '#fitness', '#food'];
                const mediumTags = ['#motivation', '#inspiration', '#lifestyle', '#travel', '#nature', '#art', '#business', '#health'];
                
                if (popularTags.includes(hashtag)) return 1;
                if (mediumTags.includes(hashtag)) return 2;
                return 3; // niche
            }

            function groupHashtagsByPopularity(hashtags) {
                return {
                    popular: hashtags.filter(tag => getHashtagPopularity(tag) === 1),
                    medium: hashtags.filter(tag => getHashtagPopularity(tag) === 2),
                    niche: hashtags.filter(tag => getHashtagPopularity(tag) === 3)
                };
            }

            function getPlatformTips(platform) {
                const tips = {
                    instagram: `• Use all 30 hashtags for maximum reach
• Mix story hashtags with post hashtags
• Use hashtags in comments for cleaner captions
• Research hashtag volume using Instagram search
• Avoid banned hashtags that can shadowban your content`,

                    twitter: `• Use 1-2 hashtags maximum for optimal engagement
• Focus on trending and conversation hashtags
• Keep hashtags relevant to current events
• Use hashtags to join conversations
• Monitor trending topics for opportunities`,

                    linkedin: `• Use 3-5 professional hashtags maximum
• Focus on industry-specific hashtags
• Include skill and expertise hashtags
• Use hashtags that professionals follow
• Mix broad and niche professional tags`,

                    tiktok: `• Use 3-5 hashtags including #fyp
• Mix trending and niche hashtags
• Jump on trending challenges and sounds
• Use hashtags that match your content exactly
• Research hashtags used by similar creators`,

                    facebook: `• Use 1-2 hashtags for better engagement
• Focus on community and local hashtags
• Use hashtags in Facebook groups
• Research group-specific popular hashtags
• Avoid overusing hashtags on Facebook`
                };

                return tips[platform] || tips.general || 'Use hashtags strategically based on platform best practices';
            }
        }
    }));

})();