const lisp = require('./lispInterpreter')

process.stdout.write('lp> ')
process.openStdin().addListener('data', function (input) {
  let toParse = input.toString().trim()
  console.log(lisp.lisp(toParse))
  process.stdout.write('lp> ')
})
