module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided." });

    Question.findAll({

        attributes: { 
            include: [[Sequelize.fn("COUNT", Sequelize.col("Answers.id")), "answers"], [Sequelize.fn("COUNT", Sequelize.col("Comments.id")), "comments"]] 
        },
        include: [{
            model: Answer, attributes: []
        }, {
            model: Comment, attributes: []
        }],
        group: ['Question.id'],

    }).then(function (data) {

        return res.status(200).json(data);

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });

};