const meta = require('../../utility/astMeta');
const markdown = require('../../utility/markdown');

const scoring = require('../../utility/scoring');

const universal = require('../../utility/universalDesign');
const grammar = require('../../utility/grammar');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    // NEED TO CONVERT THE MARKDOWN INTO PARAGRAPHS AND CHECK THOSE INDIVIDUALLY 

    const scope = [ 
        ...universal.generalUniversalDesignCheck(req.body.text), 
        ...grammar.generalGrammarCheck(req.body.text) 
    ];

    let scores = scoring.generateGeneralData(scope);

    return res.status(200).json({
        text: req.body.text,
        ...meta.getGeneralMetadata(
            markdown(
                req.body.text
            )
        ),
        score: scores,
        scope
    });

}
