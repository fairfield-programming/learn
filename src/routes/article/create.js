const advancedMeta = require('../../utility/advancedMeta');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    const metadata = advancedMeta(req.body.text);

    Article.create({
        title: metadata.likelyTitle,
        body: metadata.text,
        user: req.user.id,
        status: 0,
    }).then((data) => {

        return res.json(data);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}