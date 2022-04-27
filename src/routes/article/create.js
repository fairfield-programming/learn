const advancedMeta = require('../../utility/advancedMeta');

module.exports = (req, res) => {

    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    const metadata = advancedMeta(req.body.text);

    Article.create({
        title: metadata.likelyTitle,
        body: metadata.text,
        userId: req.user.id,
        username: req.user.username,
        status: 0,
        thumbnail: metadata.thumbnail || "https://source.unsplash.com/random"
    }).then((data) => {

        return res.json(data);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}