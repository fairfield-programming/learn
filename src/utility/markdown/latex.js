module.exports = (ast, options) => {

    options |= {
        
    };

    return ast.map(element => {
       
        switch (element.type) {

            case "h1":
                return `\\section{${element.data}}`;
            case "h2":
                return `\\subsection{${element.data}}`;
            case "h3":
                return `\\subsubsection{${element.data}}`;
            case "h4":
                return `\\paragraph{${element.data}}`;
            case "h5":
                return `\\subparagraph{${element.data}}`;
            case "h6":
                return `\\subparagraph{\\emph{${element.data}}}`;
            case "p":
                return `${element.data}`;
            case "block-code":
                return `\\begin{minted}[]{${element.language}}\n${element.data}\n\\end{minted}`;

        }

    }).join('\n\n');

}