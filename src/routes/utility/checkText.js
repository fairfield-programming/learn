const scoring = require('../../utility/scoring');

const universal = require('../../utility/universalDesign');
const grammar = require('../../utility/grammar');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    const scope = [ 
        ...universal.generalUniversalDesignCheck(req.body.text), 
        ...grammar.generalGrammarCheck(req.body.text) 
    ];

    let scores = scoring.generateGeneralData(scope);

    return res.status(200).json({
        text: req.body.text,
        score: scores,
        scope
    });

}
