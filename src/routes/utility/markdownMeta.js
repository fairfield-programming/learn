const meta = require('../../utility/astMeta');
const markdown = require('../../utility/markdown');

const scoring = require('../../utility/scoring');

const universal = require('../../utility/universalDesign');
const grammar = require('../../utility/grammar');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    // NEED TO CONVERT THE MARKDOWN INTO PARAGRAPHS AND CHECK THOSE INDIVIDUALLY 

    let scope = [];
    const mdText = markdown(
        req.body.text
    )

    mdText.ast.forEach(element => {

        if (element.type == 'block-code') return;

        scope.push(...universal.generalUniversalDesignCheck(element.data));
        scope.push(...grammar.generalGrammarCheck(element.data));

    })

    let scores = scoring.generateGeneralData(scope);

    return res.status(200).json({
        text: req.body.text,
        ...meta.getGeneralMetadata(
            mdText
        ),
        score: scores,
        scope
    });

}
