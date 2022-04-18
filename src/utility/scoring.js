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

    return 100;

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