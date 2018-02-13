exports.lisp = interpret

function interpret (lispString) {
  return evaluation(parse(lispString), env)
}

let env = {
  '+': (x, y) => x + y,
  '-': (x, y) => x - y,
  '*': (x, y) => x * y,
  '/': (x, y) => x / y,
  '=': (x, y) => x === y,
  'equal?': (x, y) => x === y,
  '<': (x, y) => x < y,
  '>': (x, y) => x > y,
  '<=': (x, y) => x <= y,
  '>=': (x, y) => x >= y,
  'not': (x) => !x,
  'begin': function () {
    let expr = arguments[arguments.length - 1]
    return expr[expr.length - 1]
  },
  'max': (x, y) => x > y ? x : y,
  'min': (x, y) => x < y ? x : y,
  'length': x => x.length,
  'null?': x => x === null,
  'number?': x => Number.isFinite(x)
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
