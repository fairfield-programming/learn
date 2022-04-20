module.exports = (ast, options) => {

    options |= {
        
    };

    return ast.map(element => {
       
        switch (element.type) {

            case "h1":
                return `<h1>${element.data}</h1>`;
            case "h2":
                return `<h2>${element.data}</h2>`;
            case "h3":
                return `<h3>${element.data}</h3>`;
            case "h4":
                return `<h4>${element.data}</h4>`;
            case "h5":
                return `<h5>${element.data}</h5>`;
            case "h6":
                return `<h6>${element.data}</h6>`;
            case "p":
                return `<p>${element.data}</p>`;
            case "block-code":
                return `<code>${element.data}</code>`;

        }

    }).join('\n');

}