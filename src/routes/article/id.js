const markdown = require('../../utility/markdown');

module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided" });

    Article.findOne({
        where: {
            id: req.params.id
        }
    }).then((data) => {

        if (data == null || data == undefined) return res.status(404).json({ error: "Not Found." });
        if (data.status == 0) return res.status(404).json({ error: "Not Verified Yet." });

        const markdownData = markdown(data.body);

        return res.json({
            ...data.dataValues,
            markdown: markdownData.ast
        });

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}