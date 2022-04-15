// https://www.edutopia.org/article/using-universal-design-create-better-assessments
// https://www.plainlanguage.gov/guidelines/words/use-simple-words-phrases/

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

    // Lower the level of the language. Make it so that its more basic to understand.

    let tokens = tokenizeWords(words);
    const skillText = fs.readFileSync(process.cwd() + "/res/skillValues.txt", 'utf8');
    let skills = {};

    let targetLevel = 8;
    let maxDifference = 1;

    skillText.split("\n").forEach((area) => {

        let segments = area.split(",");
        let jumpers = [];

        jumpers.push(
            parseInt(
                segments[1].trim()
            )
        );

        for (let i = 2; i < segments.length; i++) {
            const segment = segments[i];

            jumpers.push(
                parseInt(
                    segment.trim()
                ) 
            );
            
        }

        skills[segments[0].trim().toUpperCase()] = jumpers;

        // WORD = [ RANK, ...SUGGESTION INDEXES ]



    });

    tokens.forEach(word => {

        let skill = skills[word.text];

        if (skill == undefined) return;

        let level = skill[0];

        if (level > targetLevel - maxDifference && level < targetLevel + maxDifference) {

            // word is in the correct level, dont add to scope

        } else {

            // new word is needed, find the nearest word
            let closest = null;
            let closestDistance = Math.abs(targetLevel - level);

            let items = skill.slice(1)

            items.forEach((index) => {
                
                let item = skills[Object.keys(skills)[index - 1]]
                let itemName = Object.keys(skills)[index - 1];

                let itemDistance = targetLevel - item[0];

                if (closestDistance > itemDistance) {

                    closest = itemName;
                    closestDistance = itemDistance;

                }

            })

            if (closestDistance >= Math.abs(targetLevel - level)) return;

            scope.push({
                ...word,
                reason: "READING LEVEL",
                description: `The word or phrase, "${word.text.toLowerCase()}", doesn't match the targeted reading level. Try using "${closest.toLowerCase()}", instead.`,
                fix: closest
            });

        }
        
    });

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
                description: `The word "${word.text.toLowerCase()}", sounds a lot like "${cognate[0]}"; a ${cognate[2]} word that means ${cognate[1]}. This may be confusing for those who speak ${cognate[2]}, so consider removing it.`
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
