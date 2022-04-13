module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    if (req.body.user == undefined) return res.status(400).json({ error: "Not All Body Items Provided." });
    if (req.body.text == undefined) return res.status(400).json({ error: "Not All Body Items Provided." });

    Question.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {

        if (data == null) return res.status(404).json({ error: "Question Not Found." });

        data.createAnswer({
            user: req.body.user,
            body: req.body.text
        }).then(function (answerData) {

            return res.status(200).json(answerData);

        }).catch(function (error) {

            console.log(error);
            return res.status(500).json({ error: "Internal Server Error." });

        });

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });

};