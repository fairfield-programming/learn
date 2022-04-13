module.exports = (req, res) => {

    if (req.body.user == undefined) return res.status(400).json({ error: "Not All Body Items Provided." });
    if (req.body.title == undefined) return res.status(400).json({ error: "Not All Body Items Provided." });
    if (req.body.body == undefined) return res.status(400).json({ error: "Not All Body Items Provided." });

    Question.create({
        user: req.body.user,
        title: req.body.title,
        body: req.body.body
    }).then(function (answerData) {

        return res.status(200).json(answerData);

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });
    
};