let toParse = '(begin (define r 10) (* pi (* r r)))'

function parse(toParse) {
    return toParse.replace(/\(/g, ' ( ')
                    .replace(/\)/g, ' ) ')
                    .split(' ')
                    .filter(x => x!=='')
}

console.log(parse(toParse))
