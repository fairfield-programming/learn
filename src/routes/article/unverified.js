module.exports = (req, res) => {

    Article.findAll({
        where: {
            verified: false
        }
    }).then((data) => {

        return res.json(data);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}