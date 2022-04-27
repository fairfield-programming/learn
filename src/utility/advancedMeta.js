const meta = require('./astMeta');
const markdown = require('./markdown');

const scoring = require('./scoring');

const universal = require('./universalDesign');
const grammar = require('./grammar');

const thumbnails = require('./thumbnails');

module.exports = (text) => {

    let scope = [];
    const mdText = markdown(
        text
    )

    mdText.ast.forEach(element => {

        if (element.type == 'block-code') return;

        scope.push(...universal.generalUniversalDesignCheck(element.data));
        scope.push(...grammar.generalGrammarCheck(element.data));

    })

    let scores = scoring.generateGeneralData(scope);

    return {
        text,
        ...meta.getGeneralMetadata(
            mdText
        ),
        score: scores,
        scope,
        thumbnail: thumbnails.getThumbnailUrlFromMarkdown(mdText.ast)
    };

}
