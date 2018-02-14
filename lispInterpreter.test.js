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
  expect(lisp.lisp(`(begin(10)(20)(30))`))
  .toEqual(30)
})

test('Evaluate max', () => {
  expect(lisp.lisp(`(max 2 4 9 2 1)`))
  .toEqual(9)
})

test('Evaluate conditional', () => {
  expect(lisp.lisp(`(if (1>2) 1 2)`))
  .toEqual(2)
})

test('Evaluate constant(num)', () => {
  expect(lisp.lisp(`(99)`))
  .toEqual(99)
})

test('Evaluate invalid input', () => {
  expect(() => lisp.lisp(`(begin (+ 1 2)(* 1 2)`))
  .toThrow()
})

test('Evaluate define expression', () => {
  expect(() => lisp.lisp(`(begin (define r 10) (define sqr (* r r))(sqr))`))
  .toEqual(100)
})

test('Evaluate invalid expression', () => {
  expect(() => lisp.lisp(`(+ 1 2 * 1 2)`))
  .toThrow()
})
