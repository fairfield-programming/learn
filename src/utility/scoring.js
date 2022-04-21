function generateGeneralData(scope) {

    
    let grammar = generateGrammarScore(scope);
    let universalDesign = generateUniversalDesignScore(scope);

    let output = {
        grammar,
        universalDesign
    };

    return {
        total: generateTotalScore(output),
        ...output
    };

}

function generateTotalScore({ grammar, universalDesign }) {

    return grammar * 0.5 + universalDesign * 0.5;

}

function generateGrammarScore(scope) {

    let score = 100;

    scope.forEach(element => {
        
        if (element.name == "NEITHER NOR") score -= 1;
        if (element.name == "CAPITALIZE SENTENCE START") score -= 5;

    });

    return score;

}

function generateUniversalDesignScore(scope) {

    return 100;

}

module.exports = {
    generateGeneralData,
    generateTotalScore,
    generateGrammarScore,
    generateUniversalDesignScore
};