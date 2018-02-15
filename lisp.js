const lisp = require('./lispInterpreter')

let toParse = `${process.argv[2]}`
console.log(lisp.lisp(toParse))
