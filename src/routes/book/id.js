module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided" });

    Book.findOne({
        where: {
            id: req.params.id
        }
    }).then((data) => {

        if (data == null || data == undefined) return res.status(404).json({ error: "Not Found." });
        
        return res.json(data);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}