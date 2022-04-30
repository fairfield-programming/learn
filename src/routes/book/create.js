const advancedMeta = require('../../utility/advancedMeta');

module.exports = (req, res) => {

    if (req.body.title == undefined || req.body.content == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    Book.create({
        title: req.body.title,
        state: 0,
        content: req.body.content
    }).then((data) => {

        return res.json(data);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}