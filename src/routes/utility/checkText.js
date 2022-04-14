const universal = require('../../utility/universalDesign');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    const scope = universal.generalUniversalDesignCheck(req.body.text);

    return res.status(200).json({
        score: 100 - scope.length,
        scope
    });

}