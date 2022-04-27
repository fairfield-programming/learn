const markdown = require('../../utility/markdown');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    return res.status(200).json(
        markdown(
            req.body.text
        )
    )

}
