module.exports = (ast, options) => {

    options |= {
        
    };

    return ast.map(element => {
       
        switch (element.type) {

            case "h1":
                return `# ${element.data}`;
            case "h2":
                return `## ${element.data}`;
            case "h3":
                return `### ${element.data}`;
            case "h4":
                return `#### ${element.data}`;
            case "h5":
                return `##### ${element.data}`;
            case "h6":
                return `###### ${element.data}`;
            case "p":
                return `${element.data}`;
            case "block-code":
                return "```" + `${(element.meta) ? (JSON.stringify(element.meta)) : (element.language)}\n${element.data}</code>`;

        }

    }).join('\n\n');

}