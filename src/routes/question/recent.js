module.exports = (req, res) => {

    Question.findAll({

        attributes: { 
            include: [[Sequelize.fn("COUNT", Sequelize.col("Answers.id")), "answers"], [Sequelize.fn("COUNT", Sequelize.col("Comments.id")), "comments"]] 
        },
        include: [{
            model: Answer, attributes: [],
        }, {
            model: Comment, attributes: [],
        }],
        group: ['Question.id'],

    }).then(function (data) {

        // SUPER INNEFFICIENT BUT BEST FOR NOW
        data.sort(function(a, b){return a.id - b.id});

        return res.status(200).json(data.slice(data.length - 10, data.length));

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });

};