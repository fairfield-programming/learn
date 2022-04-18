const fs = require('fs');

function generalGrammarCheck(words) {

    let scope = [];

    sentenceCapitalization(words, scope);

    return scope;

}

function sentenceCapitalization(words, scope) {

    let sentences = words.split('.');
    let i = 0;

    sentences.forEach(sentence => {
        
        let [ _i, _sentence ] = smartTrimStart(sentence);
        i += _i;

        if (_sentence.length == 0) return;

        if (_sentence[0] != _sentence[0].toUpperCase()) {

            scope.push({
                reason: "CAPITALIZE SENTENCE START",
                description: `For each sentence, you should capitalize the first word.`,
                fix: _sentence[0].toUpperCase(),
                text: _sentence[0],
                start: i,
                end: i + 1,
            })
            
        }

        // need +1 for the periods
        i += _sentence.length + 1;

    });

    return scope;

}

function smartTrimStart(text) {

    let i = 0;

    while (text.startsWith(' ')) {

        text = text.slice(1);
        i++;

    }

    return [ i, text ];

}

module.exports = {
    generalGrammarCheck,
};
