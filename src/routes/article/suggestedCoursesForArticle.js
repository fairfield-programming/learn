const metadata = require('../../utility/advancedMeta');

module.exports = (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided" });

    Article.findOne({
        where: { 
            id: req.params.id
        }
    }).then((data) => {

        if (data == null || data == undefined) return res.status(404).json({ error: "Not Found." });
        
        const text = data.body;
        const meta = metadata(text);
        let course = [];

        meta.languages.forEach(language => {

            if (language.length == 0) return;

            course.push(
                `${language[0].toUpperCase()}${language.slice(1).toLowerCase()} for Beginners`
            );
            
        });

        return res.json(course);

    }).catch((error) => {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    });

}