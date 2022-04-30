const fs = require('fs');

module.exports = async (req, res) => {

    if (req.params.id == undefined) return res.status(400).json({ error: "Not All Parameters Provided" });

    try {

        let bookData = await Book.findOne({
            where: {
                id: req.params.id
            }
        });

        if (bookData == null || bookData == undefined) return res.status(404).json({ error: "Not Found." });
        
        if (!verifyContentFormat(bookData.content)) return res.status(409).json({ error: "Badly formatted content." });

        let sections = [];

        for (const section in bookData.content.sections) {
            
            const curSection = bookData.content.sections[section];

            let content = [];

            for (const articleI in curSection.content) {
                
                const articleIndex = curSection.content[articleI];

                // Query the Article DB
                let articleData = await Article.findOne({
                    where: {
                        id: articleIndex
                    }
                });

                content.push(articleData);

            }

            sections.push({
                title: curSection.title,
                content
            });

        }

        console.log(sections);

        let bookTemplateData = fs.readFileSync(process.cwd() + '/res/content/book.html', 'utf-8');

        bookTemplateData = bookTemplateData.replace(/\%BOOK_NAME\%/g, bookData.title);
        bookTemplateData = bookTemplateData.replace(/\%BOOK_EDITION\%/g, bookData.content.edition);
        bookTemplateData = bookTemplateData.replace(/\%BOOK_DESCRIPTION\%/g, bookData.content.description);

        return res.send(bookTemplateData);

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            error: "Internal Server Error."
        });

    }

}

function verifyContentFormat(content) {

    if (content == undefined) return false;

    if (content.sections == undefined) return false;
    if (!Array.isArray(content.sections)) return false;

    if (content.edition == undefined) return false;

    if (content.description == undefined) return false;

    return true;

}