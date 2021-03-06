const lisp = require('./lispInterpreter')

test('Evaluate add', () => {
  expect(lisp.lisp(`(+ 1 2 3)`))
  .toEqual(6)
})

test('Evaluate nested', () => {
  expect(lisp.lisp(`(* (+ 1 2) (+ 2 2))`))
  .toEqual(12)
})

test('Evaluate define & refrence', () => {
  expect(lisp.lisp(`(begin (define r 10) (* r r))`))
  .toEqual(100)
})

test('Evaluate begin', () => {
  expect(lisp.lisp(`(begin 10  20 30)`))
  .toEqual(30)
})

test('Evaluate max', () => {
  expect(lisp.lisp(`(max 2 4 9 2 1)`))
  .toEqual(9)
})

test('Evaluate multiple args', () => {
  expect(lisp.lisp(`(< 2 1 2)`))
  .toEqual('#f')
})

test('Evaluate comparision with multiple args', () => {
  expect(lisp.lisp(`(> 2 1 2)`))
  .toEqual('#f')
})

test('Evaluate conditional', () => {
  expect(lisp.lisp(`(if (> 1 2) 1 2)`))
  .toEqual(2)
  expect(lisp.lisp(`(if (> 2 1) 1 2)`))
  .toEqual(1)
})

test('Evaluate not', () => {
  expect(lisp.lisp(`(not #f)`))
  .toEqual('#t')
  expect(lisp.lisp(`(not #t)`))
  .toEqual('#f')
})

test('Evaluate constant(num)', () => {
  expect(lisp.lisp(`(+ 99 )`))
  .toEqual(99)
})

test('Evaluate invalid input', () => {
  expect(() => lisp.lisp(`(begin (+ 1 2)(* 1 2)`))
  .toThrow()
})

test('Evaluate define expression', () => {
  expect(lisp.lisp(`(begin (define r 10) (define sqr (* r r)) sqr)`))
  .toEqual(100)
})

test('Evaluate factorial', () => {
  expect(lisp.lisp(`(begin (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))(fact 10))`))
  .toEqual(3628800)
})

test('Evaluate fib', () => {
  expect(lisp.lisp(`(begin (define fib (lambda (n) (if (< n 2) 1 (+ (fib (- n 1)) (fib (- n 2))))))(fib 10))`))
  .toEqual(89)
})

test('Evaluate invalid expression', () => {
  expect(() => lisp.lisp(`(+ 1 2 * 1 2)`))
  .toThrow()
})
