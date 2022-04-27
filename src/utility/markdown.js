// OBJECT TYPES
    // PARAGRAPH
    // TEXT
    // HEADING
    // LINK
    // QUOTE
    // CODE

function parseMarkdownToAST(text) {

    let scope = {
        state: 0,
        buffer: '',
        errors: [],
        ast: [],
        text,
        globalVars: {
            isFileStart: true,
            spaceAfterHeaderCount: 0
        },
        i: 0
    };

    for (var i = 0; i < text.length; i++) {

        scope.i = i;

        if (scope.state == 0) {

            if (scope.globalVars.isFileStart && text[i] != "#") {

                scope.errors.push({
                    index: i,
                    title: "ERR004",
                    description: `The file should begin with an H1 heading.`
                });

            }

            scope.globalVars.isFileStart = false;

            if (text[i] == "#") { scope.state = 1; scope.ast.push({ type: 'p', data: scope.buffer }); scope.buffer = ""; continue; }
            if (text[i] == "`") { scope.state = 14; scope.ast.push({ type: 'p', data: scope.buffer }); scope.buffer = ""; continue; }
            if (text[i] == "\n") { scope.state = 0; scope.ast.push({ type: 'p', data: scope.buffer }); scope.buffer = ""; continue; }
            if (text[i] == "!" && scope.buffer == "") { scope.state = 18; continue; }

            scope.buffer += text[i];

            continue;

        }

        // Headings
        if (scope.state > 0 && scope.state < 13) {

            if (scope.state % 2 == 1) { scope = startHeaderState(scope); continue; }
            if (scope.state % 2 == 0) { scope = middleHeaderState(scope); continue; }

        }

        if (scope.state == 14) { scope = startCodeState(scope); continue; }
        if (scope.state == 15) { scope = codeHeaderState(scope); continue; }
        if (scope.state == 16) { scope = codeMiddleState(scope); continue; }
        if (scope.state == 17) { scope = codeEndState(scope); continue; }
        if (scope.state == 18) { scope = imageAltState(scope); continue; }
        if (scope.state == 19) { scope = imageSrcState(scope); continue; }

    }

    if (scope.state == 0) {

        scope.ast.push({ type: 'p', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 2) {

        scope.ast.push({ type: 'h1', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 4) {

        scope.ast.push({ type: 'h2', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 6) {

        scope.ast.push({ type: 'h3', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 8) {

        scope.ast.push({ type: 'h4', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 10) {

        scope.ast.push({ type: 'h5', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 12) {

        scope.ast.push({ type: 'h6', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 17 || scope.state == 16) {

        scope.ast.push({ type: 'code-block', data: scope.buffer }); 
        scope.buffer = "";

    }

    if (scope.state == 18) {
        
        scope.buffer = "";

    }

    if (scope.state == 19) {

        scope.ast.push({ type: 'img', src: scope.buffer, alt: scope.globalVars.alt })
        scope.buffer = "";

    }

    return {
        errors: scope.errors,
        ast: cleanAST(scope.ast),
        text
    };

}

function cleanAST(ast) {

    return ast.filter((element) => {

        if (element.data.trim() == "") return false;

        return true;

    })

}

function middleHeaderState(thruData) {

    let { i, state, text, buffer, ast } = thruData;

    if (text[i] == "\n") {
                    
        ast.push({
            type: "h" + (state / 2),
            data: buffer
        });
        thruData.buffer = "";
        thruData.state = 0; 
        return thruData;
    
    }

    thruData.buffer += text[i];

    return thruData;

}

function startHeaderState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == "#") {

        if (thruData.state == 11) {

            errors.push({
                index: i,
                title: "ERR003",
                description: `Heading is too low-level. I.E, headings only go from H1 to H6.`
            });
            return thruData;

        } else {

            thruData.state += 2;
            return thruData;

        }

    }

    if (text[i] == " ") { thruData.globalVars.spaceAfterHeaderCount++; return thruData; }

    thruData.state = thruData.state + 1;
    thruData.buffer += text[i];

    thruData.globalVars = handleIncrementErrors(thruData);

    return thruData;

}

function handleIncrementErrors({ errors, i, globalVars }) {

    let { spaceAfterHeaderCount } = globalVars;

    if (spaceAfterHeaderCount == 0) {

        errors.push({
            index: i,
            title: "ERR001",
            description: `Heading indicators should be followed by a single space.`
        });

    }

    if (spaceAfterHeaderCount > 1) {

        errors.push({
            index: i,
            title: "ERR002",
            description: `Heading indicators should have no more than one space following them.`
        });

    }

    globalVars.spaceAfterHeaderCount = 0;

    return globalVars;

}

function startCodeState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == '`') { thruData.state = 14; thruData.globalVars.codeAsterisk += 1; return thruData; }
    if (text[i] == '\n') { thruData.state = 16; thruData.globalVars.codeAsterisk = 0; return thruData; }

    thruData.state = 15;
    thruData.buffer += text[i];

    return thruData;

}

// State 15
function codeHeaderState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == '\n') { 
        
        if (isJsonString(buffer)) {

            thruData.globalVars.codeMetaData = JSON.parse(buffer);

        } else {

            thruData.globalVars.codeLanguage = buffer;

        }

        thruData.buffer = "";
        thruData.state = 16;
        return thruData; 

    }

    thruData.buffer += text[i];

    return thruData;

}

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// State 16
function codeMiddleState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == '`') { 
        
        thruData.state = 17; 
        thruData.ast.push({
            type: 'block-code',
            meta: globalVars.codeMetaData,
            language: globalVars.codeLanguage || (globalVars.codeMetaData || { language: undefined }).language,
            data: buffer
        });
        thruData.buffer = "";
        thruData.globalVars.codeLanguage = "";
        thruData.globalVars.codeMetaData = "";
        return thruData; 
    
    }

    thruData.buffer += text[i];

    return thruData;

}

// State 17
function codeEndState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == '`') { thruData.state = 17; return thruData; }

    thruData.state = 0;

    return thruData;

}

// State 18
function imageAltState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == '(') { 
        
        thruData.globalVars.alt = buffer.slice(1, buffer.length - 1);
        thruData.buffer = "";
        thruData.state = 19; 
        return thruData; 

    }

    thruData.buffer += text[i];

    return thruData;

}

// State 19
function imageSrcState(thruData) {

    let { i, state, text, buffer, globalVars, errors } = thruData;

    if (text[i] == ')') { 
        
        thruData.ast.push({
            type: 'img',
            src: buffer,
            alt: globalVars.alt,
            data: buffer,
        })
        thruData.buffer = "";
        thruData.state = 0; 
        return thruData; 

    }

    thruData.buffer += text[i];

    return thruData;

}

module.exports = parseMarkdownToAST;