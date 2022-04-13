module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    Answer.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {

        if (data == null) return res.status(404).json({ error: "Answer Not Found." });

        return res.status(200).json(data);

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });

};