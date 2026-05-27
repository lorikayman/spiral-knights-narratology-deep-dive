import { test, expect } from 'bun:test'

import { encode, decode } from '../src/conlang.js'

// reference phrase, all alphabet
const T_PHRASE = 'The quick brown fox jumps over the lazy dog'
const T_NUMBERS = '0123456789'
const T_MIXED = '67 sixseven'

test('Encode: non-empty A-Z string', () => {
  const encoded = encode(T_PHRASE)
  expect(encoded.length).toBeGreaterThan(0)
  expect(encoded).not.toBe(T_PHRASE)
})

test('Full: A => encode -> decode => A', () => {
  expect(decode(encode(T_PHRASE))).toBe(T_PHRASE)
})

// T -> ▄ (capital) + t (▌▟)
test('Full: Capital T encodes as capital sign + t', () => {
  expect(encode('T')).toBe('▄▌▟')
  expect(decode('▄▌▟')).toBe('T')
})

test('Encode: non-empty numbers string', () => {
  const encoded = encode(T_NUMBERS)
  expect(encoded.length).toBeGreaterThan(0)
  expect(encoded).not.toBe(T_PHRASE)
})

test('Full: 0..9 => encode -> decode => 0..9', () => {
  expect(decode(encode(T_NUMBERS))).toBe(T_NUMBERS)
})

test('Encode: non-empty numbers string', () => {
  const encoded = encode(T_NUMBERS)
  expect(encoded.length).toBeGreaterThan(0)
  expect(encoded).not.toBe(T_PHRASE)
})

test('Full: mixed => encode -> decode => mixed', () => {
  expect(decode(encode(T_MIXED))).toBe(T_MIXED)
})
