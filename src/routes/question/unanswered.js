module.exports = (req, res) => {

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
        
        where: sequelize.literal('"Answers"."QuestionId" IS NULL')
        
    }).then(function (data) {

        return res.status(200).json(data);

    }).catch(function (error) {

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error." });

    });

};