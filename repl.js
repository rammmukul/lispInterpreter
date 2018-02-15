const lisp = require('./lispInterpreter')
let toParse

process.stdout.write('lp> ')
process.openStdin().addListener('data', function (input) {
  toParse = toParse ? toParse + input.toString().trim() : input.toString().trim()
  let stack = 0
  for (let i of toParse) { checkCompletion(i) }
  if (toParse && stack === 0) {
    console.log(lisp.lisp(toParse))
    process.stdout.write('lp> ')
    toParse = ''
  } else if (stack > 0) {
    process.stdout.write('... ')
  } else {
    console.log('Error: Too many )')
    process.stdout.write('lp> ')
    toParse = ''
  }

  function checkCompletion (char) {
    if (char === '(') { stack++ }
    if (char === ')') { stack-- }
  }
})
