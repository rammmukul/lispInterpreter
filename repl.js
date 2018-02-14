const lisp = require('./lispInterpreter')

process.openStdin().addListener('data', function (input) {
  let toParse = input.toString().trim()
  console.log(lisp.lisp(toParse))
})
