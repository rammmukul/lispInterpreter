let toParse = '(+ 4 3 2 1 (* 5 2 5))'

let env = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y
}

function tokenise (toParse) {
  return toParse.replace(/\(/g, ' ( ')
                    .replace(/\)/g, ' ) ')
                    .split(' ')
                    .filter(x => x !== '')
}

function astFromTokens (tokensArrray) {
  if (tokensArrray.length === 0) {
    throw Error('Unexpected EOF')
  }
  let token = tokensArrray.shift()
  if (token === '(') {
    let nest = []
    while (tokensArrray[0] !== ')') {
      nest.push(astFromTokens(tokensArrray))
    }
    tokensArrray.shift()
    return nest
  } else if (token === ')') {
    throw Error('Unexpected )')
  } else {
    return atom(token)
  }
}

function atom (token) {
  return isNaN(Number(token)) ? token : Number(token)
}

function parse (toParse) {
  return astFromTokens(tokenise(toParse))
}

function evaluation (exp, env) {
  if (!env.hasOwnProperty(exp[0])) {
    return Number(exp)
  } else {
    let proc = env[exp[0]]
    let args = exp.slice(1).map(x => evaluation(x, env))
    return args.reduce(proc)
  }
}

console.log(evaluation(parse(toParse), env))
