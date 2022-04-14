// https://www.edutopia.org/article/using-universal-design-create-better-assessments

const fs = require('fs');

function generalUniversalDesignCheck(words) {

    // scope will work by acting as a list of problems
    // think like grammarly, but the way i'm going to implement it
    // is as a list of 'word markers' that say info about a word or phrase
    // and the problem that there is. It could also suggest the solution to
    // said problem.
    
    let scope = [];

    scope = languageSkills(words, scope);
    scope = idiomaticLanguage(words, scope);
    scope = socioeconomic(words, scope);
    scope = falseCognate(words, scope);
    scope = properNames(words, scope);

    return scope;

}

function languageSkills(words, scope) {



    return scope;

}

function idiomaticLanguage(words, scope) {



    return scope;

}

function socioeconomic(words, scope) {

    // pretty much check if certain things are bad because of class/ economic 
    // status differences. many of our users will be less financially inclined,
    // but we need to design our content to those users. If we can reduce
    // the amount of class talk, we can open the learning barrier a bit.

    return scope;

}

function falseCognate(words, scope) {

    const cognates = {
        "DECEPTION": [ "decepción", "disappointment", "Spanish" ]
    };

    let tokens = tokenizeWords(words);

    tokens.forEach((word) => {

        let cognate = cognates[word.text];
            
        if (cognate != undefined) {
            
            scope.push({
                ...word,
                reason: 'COGNATE',
                description: `The word "${word.text.toLowerCase()}", sounds a lot like "${cognate[0]}"; a ${cognate[2]} word that means ${cognate[1]}.`
            });

        }

    });

    return scope;

}

function properNames(words, scope) {

    // score the names from 0-10, if they rank above a 4, they should be 
    // added to the scope

    const namesText = fs.readFileSync(process.cwd() + "/res/nameValues.txt", 'utf8');
    let names = {};

    namesText.split("\n").forEach((area) => {

        let segments = area.split(",");
        names[segments[0].trim().toUpperCase()] = parseInt(segments[1].trim());

    });
    
    let tokens = tokenizeWords(words);

    tokens.forEach((word) => {

        let name = names[word.text];
        let suggested = Object.keys(names)[Math.floor(Object.keys(names).length * Math.random())];

        if (name !== undefined) {

            if (name < 8) {

                scope.push({
                    ...word,
                    reason: "PROPER NAME",
                    description: `The name "${word.text.toLowerCase()}" is not very common and may be confusing to some readers.`,
                    fix: suggested
                });

            }

        } 

    })

    return scope;

}

function tokenizeWords(words) {

    let tokens = [];
    let currentWord = "";
    let currentStart = 0;

    words = words.toUpperCase();

    for (var i = 0; i < words.length; i++) {

        if (words[i] == " " || words[i] == "," || words[i] == ":" || words[i] == ".") {

            tokens.push({
                text: currentWord.replace(/\'/g, ""),
                start: currentStart,
                end: i
            });

            currentWord = "";
            currentStart = i + 1;

        } else {

            currentWord += words[i];
        
        }

    }

    return tokens;

}

module.exports = {
    generalUniversalDesignCheck,
    languageSkills,
    properNames
};