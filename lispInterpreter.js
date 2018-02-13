let toParse = '(begin (define r 10) (* r 2)(+ r 20))'

let env = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
  '=': (x, y) => x === y,
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '<=': (x, y) => x <= y,
  '>=': (x, y) => x >= y,
  'not': (x) => !x,
  'begin': function () { return arguments[arguments.length - 1] }
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
  if (exp[0] === 'define') {                 // Definition
    let symbol = exp[1]
    let expr = exp.slice(2)
    env[symbol] = evaluation(expr, env)
  } else if (exp[0] === 'if') {              // Condition
    let test = exp[1]
    let ifTrue = exp[2]
    let ifFalse = exp[3]
    let expr = evaluation(test, env) ? ifTrue : ifFalse
    return evaluation(expr, env)
  } else if (env.hasOwnProperty(exp)) {      // Vriable refrance
    return env[exp[0]]
  } else if (!env.hasOwnProperty(exp[0])) {  // Constant number
    return Number(exp)
  } else {                                   // Procedure call
    let proc = env[exp[0]]
    let args = exp.slice(1).map(x => evaluation(x, env))
    return args.reduce(proc)
  }
}

console.log(evaluation(parse(toParse), env))
