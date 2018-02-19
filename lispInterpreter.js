const interpret = lispString => evaluation(ast(lispString), env)

let env = {
  '+': args => args.reduce((x, y) => x + y),
  '-': args => args.reduce((x, y) => x - y),
  '*': args => args.reduce((x, y) => x * y),
  '/': args => args.reduce((x, y) => x / y),
  '#t': '#t',
  '#f': '#f',
  '=': args => args.reduce((x, y) => x === y ? '#t' : '#f'),
  'equal?': args => args.reduce((x, y) => x === y ? '#t' : '#f'),
  '<': args => {
    let result = true
    let prev = args[0]
    for (let i = 1; i < args.length; i++) {
      if (result) { return '#f' }
      result = prev < args[i]
      prev = args[i]
    }
    return result ? '#t' : '#f'
  },
  '>': args => {
    let result = true
    let prev = args[0]
    for (let i = 1; i < args.length; i++) {
      if (result) { return '#f' }
      result = prev > args[i]
      prev = args[i]
    }
    return result ? '#t' : '#f'
  },
  '<=': args => {
    let result = true
    let prev = args[0]
    for (let i = 1; i < args.length; i++) {
      if (result) { return '#f' }
      result = prev <= args[i]
      prev = args[i]
    }
    return result ? '#t' : '#f'
  },
  '>=': args => {
    let result = true
    let prev = args[0]
    for (let i = 1; i < args.length; i++) {
      if (result) { return '#f' }
      result = prev >= args[i]
      prev = args[i]
    }
    return result ? '#t' : '#f'
  },
  'not': x => x[0] === '#t' || x[0] !== '#f' ? '#f' : '#t',
  'begin': function () {
    let exprs = arguments[arguments.length - 1]
    return exprs[exprs.length - 1]
  },
  'max': args => args.reduce((x, y) => x > y ? x : y),
  'min': args => args.reduce((x, y) => x < y ? x : y),
  'length': x => x.length, //
  'null?': x => x === null ? '#t' : '#f',
  'number?': x => Number.isFinite(x) ? '#t' : '#f'
}

const parse = toParse => {
  if (toParse[0] !== '(') {
    return null
  }
  let tokens = []
  let openPrans = 1
  tokens.push('(')
  toParse = toParse.slice(1)
  let match
  while (openPrans !== 0) {
    if (match = toParse.match(/^\)\s*/)) {
      toParse = toParse.replace(match[0], '')
      tokens.push(')')
      openPrans--
    } else if (match = toParse.match(/^\(\s*/)) {
      toParse = toParse.replace(match[0], '')
      tokens.push('(')
      openPrans++
    } else {
      tokens.push((toParse.match(/[^\s()]*/)[0]))
      toParse = toParse.replace(/[^\s()]*\s*/, '')
    }
    if (toParse === '' && openPrans !== 0) {
      throw Error('Unexpected end of input')
    }
  }
  return [tokens, toParse]
}

const astFromTokens = tokensArrray => {
  if (tokensArrray.length === 0) {
    throw Error('Unexpected EOF')
  }
  let token = tokensArrray.shift()
  if (token === '(') {
    let expression = []
    while (tokensArrray[0] !== ')') {
      expression.push(astFromTokens(tokensArrray))
    }
    tokensArrray.shift()
    return expression
  } else if (token === ')') {
    throw Error('Unexpected )')
  } else {
    return atom(token)
  }
}

const atom = token => isNaN(Number(token)) ? token : Number(token)

const ast = toParse => astFromTokens(parse(toParse)[0])

function evaluation (exp, env) {
  if (exp[0] === 'define') {          // Definition
    let symbol = exp[1]
    let expr = exp.slice(2)
    env[symbol] = evaluation(expr[0], env)
  }
  if (exp[0] === 'if') {              // Condition
    let [test, ifTrue, ifFalse] = exp.slice(1)
    let expr = evaluation(test, env) === '#t' ? ifTrue : ifFalse
    return evaluation(expr, env)
  }
  if (env.hasOwnProperty(exp)) {      // Variable Reference
    return env[exp]
  }
  if (!env.hasOwnProperty(exp[0])) {  // Constant number
    return Number(exp)
  }
  let proc = env[exp[0]]
  let args = exp.slice(1).map(x => evaluation(x, env))
  if (args.filter(x => typeof x !== 'number' && !(x === '#t' || x === '#f')).length) {
    throw Error('Unexpected token')
  }
  return proc(args)
}

exports.lisp = interpret
