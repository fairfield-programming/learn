const advancedMeta = require('../../utility/advancedMeta');

module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });
    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    const metadata = advancedMeta(req.body.text);

    Article.findOne({
        where: {
            id: req.params.id
        }
    }).then((data) => {

        if (data == null || data == undefined) return res.status(404).json({ error: "Not Found." });
        if (data.status > 1) return res.status(409).json({ error: "Can't Update Live Article." });
        
        data.update({
            title: metadata.likelyTitle,
            status: data.status,
            body: metadata.text,
            user: data.user
        }).then((newData) => {

            return res.json(newData);

        }).catch((error) => {

            console.log(error);
            return res.status(500).json({
                error: "Internal Server Error."
            });

        })

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}