const fs = require('fs');

function getGeneralMetadata(markdownData) {

    const sentenceCount = getSentenceCount(markdownData);
    const wordCount = getWordCount(markdownData);
    const charCount = getCharCount(markdownData);
    const words = getAllWords(markdownData);
    const syllableCount = getSyllableCount(words.join(' '));
    const complexWordCount = countComplexWords(words.join(' '));

    let readability = {
        ...getDaleChall(markdownData, { sentenceCount, wordCount, words }),
        ...getOtherReadability(markdownData, { sentenceCount, wordCount, words, charCount, syllableCount, complexWordCount })
    };

    return {
        likelyTitle: getTitle(markdownData),
        languages: getLanguages(markdownData),
        typeCounts: getTypeCounts(markdownData),
        charCount,
        readability,
        wordCount,
        sentenceCount,
        syllableCount,
    };

}

function getAllWords(markdownData) {

    let output = [];

    markdownData.ast.forEach(element => {

        if (element.type == 'h1' || element.type == "h2"|| element.type == "h3" || element.type == "h4" || element.type == "h5" || element.type == "h6" || element.type == "p") {

            output.push(...element.data.replace(/[^a-zA-Z0-9 ]/g, '').split(" "));

        }

    });

    return output;

}

function getOtherReadability(markdownData, { sentenceCount, wordCount, charCount, syllableCount, words, complexWordCount }) {
    
    if (words.length == 0) return {};
    if (sentenceCount == 0) return {};

    return {
        automatedReadabilityIndex: (4.71 * (charCount / words.length)) + (0.5 * (words.length / sentenceCount)) - 21.43,
        colemanLiauIndex: 0.0588 * (charCount / words.length) * 100 - 0.296 * (sentenceCount / words.length) * 100 - 15.8,
        fleschReadingEase: 206.835 - (1.015 * (words.length / sentenceCount)) - (84.6 * (syllableCount / words.length)),
        fleschKincaidIndex: 0.39 * (words.length / sentenceCount) + 11.8 * (syllableCount / words.length) - 15.59,
        gunningFog: 0.4 * (words.length / sentenceCount) + 100 * (complexWordCount / words.length)
    };

}

function getDaleChall(markdownData, { sentenceCount, words }) {
        
    let difficultWordCount = 0;
    let easyWordsList = fs.readFileSync(process.cwd() + '/res/daleChallWords.txt', 'ascii').split("\n");

    words.forEach(element => {

        if (!easyWordsList.includes(element.toLowerCase())) difficultWordCount++;

    });

    let daleChallIndex = 0.0496 * (words.length / sentenceCount) + 0.1569 * (difficultWordCount / words.length) * 100;
    let daleChallLevel = "<4";

    if (daleChallIndex >= 5.0) daleChallLevel = "5-6";
    if (daleChallIndex >= 6.0) daleChallLevel = "7-8";
    if (daleChallIndex >= 7.0) daleChallLevel = "9-10";
    if (daleChallIndex >= 8.0) daleChallLevel = "11-12";
    if (daleChallIndex >= 9.0) daleChallLevel = "13-15";
    if (daleChallIndex >= 10.0) daleChallLevel = ">16";
    
    return { 
        daleChallIndex,
        daleChallLevel
    };

}

function getTitle(markdownData) {

    // thank god these run one after the other
    if (markdownData.ast.length > 0 && markdownData.ast[0].type == 'h1') return markdownData.ast[0].data;

}

function getSyllableCount(sentence) {

    let total = 0;

    sentence.split(' ').forEach(word => {

        total += syllablesFromWord(word);

    })

    return total;

}

function countComplexWords(sentence) {

    let total = 0;

    sentence.split(' ').forEach(word => {

        if (syllablesFromWord(word) >= 3) total++;

    })

    return total;

}

function syllablesFromWord(word) {

    let count = 0;
    vowels = [ 'a', 'e', 'i', 'o', 'u', 'y' ];

    if (vowels.includes(word[0]))
        count++;

    for (let i = 0; i < word.length; i++)
        if (vowels.includes(word[i]) && !vowels.includes(word[i - 1]))
            count++;

    if (word.endsWith('e'))
        count--;

    if (word.endsWith('le') && word.length > 2 && !vowels.includes(word[word.length - 3]))
        count++;

    if (count == 0)
        count += 1;

    return count;

}

function getLanguages(markdownData) {

    let output = [];

    markdownData.ast.forEach(element => {
        
        if (element.type == 'block-code') {

            if (element.language != undefined && element.language != "") output.push(element.language);

        }

    });

    return output;

}

function getTypeCounts(markdownData) {

    let typeCounts = {};

    markdownData.ast.forEach(element => {
        
        if (typeCounts[element.type] == undefined) typeCounts[element.type] = 0;
        typeCounts[element.type] += 1;

    });

    return typeCounts;

}

function getWordCount(markdownData) {

    let wordCount = 0;

    markdownData.ast.forEach(element => {

        if (element.type == 'h1' || element.type == "h2"|| element.type == "h3" || element.type == "h4" || element.type == "h5" || element.type == "h6" || element.type == "p") {

            wordCount += element.data.split(" ").length;

        }

    });

    return wordCount;

}

function getSentenceCount(markdownData) {

    let sentenceCount = 0;

    markdownData.ast.forEach(element => {
        
        if (element.type == 'h1' || element.type == "h2"|| element.type == "h3" || element.type == "h4" || element.type == "h5" || element.type == "h6" || element.type == "p") {

            sentenceCount += element.data.split(".").length;

        }

    });

    return sentenceCount;

}

function getCharCount(markdownData) {

    let charCount = 0;

    markdownData.ast.forEach(element => {
        
        if (element.type == 'h1' || element.type == "h2"|| element.type == "h3" || element.type == "h4" || element.type == "h5" || element.type == "h6" || element.type == "p") {

            charCount += element.data.length;

        }

    });

    return charCount;

}

module.exports = {
    getGeneralMetadata
};
