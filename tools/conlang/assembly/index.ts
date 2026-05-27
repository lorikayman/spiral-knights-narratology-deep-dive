// Braille-Grade-1 - v1 gremlin conlang
//
// @see ./../spec/conlang.braille_grade_1.v1.md

// character library
// -----------------------------------------------------------

// a-j base glyphs reflect letter order.
const BASE: string = "▘▗▀▜▚▛█▙▞▟";

// MOD glyph unicode codepoints == charcodes
// ▌  prefix: k-t
const MOD_KT: i32 = 0x258c
// ▖  prefix: u-z  (doubled -> punctuation bank 2)
const MOD_UZ: i32 = 0x2596
// ▄  capital sign (doubled -> word caps)
const MOD_CAP: i32 = 0x2584
// ▝  starts ▝▝ (punctuation 1) and ▝▄ (number sign)
const MOD_COMPLEX_READMODE: i32 = 0x259d
// ▐  doubled -> decimal point
const MOD_DECIMAL_NUM: i32 = 0x2590

const SPACE: i32 = 0x20

// Punctuation parts 1 + 2
// ▝▝
const PUNCT_GROUP_1: string = ",;:.!()\"?*"
// ▖▖
const PUNCT_GROUP_2: string = "'-—/[]"

// -----------------------------------------------------------

// unit of work on a string
class Step {
  text: string
  // value 0 - end of sequence
  len: i32
  constructor(text: string, len: i32) {
    this.text = text
    this.len = len
  }
}

// decoded letter token
class Letter {
  // ascii code
  // -1 when the glyph is not a letter
  code: i32
  // length of glyphs for the letter:
  // 1: a-j - no MOD keys
  // 2: k-z - through MOD keys (2 variants)
  len: i32
  constructor(code: i32, len: i32) {
    this.code = code
    this.len = len
  }
}

/**
 * check whether char code `c` is ascii digit 0-9
 *
 * @param {i32} c
 *  character code to test
 *
 * @returns {bool}
 *  true when `c` is in 0..9
*/
function isAsciiDigit(c: i32): bool {
  return c >= 0x30 && c <= 0x39
}

/**
 * ceck uppercasing
 *
 * @param {i32} c
 *  character code to test
 *
 * @returns {bool}
 *  true when uppercase
*/
function isAsciiUpper(c: i32): bool {
  // uppercase codes
  return c >= 0x41 && c <= 0x5a
}

/**
 * cech lowercasing
 *
 * @param {i32} c
 *  character code to test
 *
 * @returns {bool}
 *  true when lowercase
*/
function isAsciiLower(c: i32): bool {
  return c >= 0x61 && c <= 0x7a
}

/**
 * build a one-character string from a char code
 *
 * @param {i32} c
 *  character code to wrap
 *
 * @returns {string}
 *  single-character string holding `c`
*/
function charCodeToString(c: i32): string {
  return String.fromCharCode(c)
}

/**
 * lookup sting's code at position
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {i32}
 *  character code for `input[i]`
 *
 * peek as in js state managers
*/
function charCodeAtPosition(input: string, i: i32): i32 {
  if (i >= input.length) return -1
  return input.charCodeAt(i)
}

/**
 * find the position of a glyph code inside the BASE table
 *
 * @param {i32} code
 *  glyph character code to locate
 *
 * @returns {i32}
 *  index 0..9 within `BASE`, or -1 when `code` is not a base glyph
*/
function findBaseGlyphIndex(code: i32): i32 {
  for (let k = 0; k < 10; k++) {
    if (BASE.charCodeAt(k) == code) return k
  }
  return -1
}

/**
 * bounds-safe BASE lookup at a string position
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {i32}
 *  BASE index 0..9 of `input[i]`, or -1 when out of range or not a base glyph
*/
function findBaseGlyphIndexAtPosition(input: string, i: i32): i32 {
  if (i >= input.length) return -1
  return findBaseGlyphIndex(input.charCodeAt(i))
}

/**
 * Repeatedly applies `step`, appending its text and advancing,
 * until the step reports len 0 or input is exhausted
 *
 * @param {string} input
 *  source string to process
 * @param {i32} start
 *  position in `input` to begin prcoessing at
 * @param {(input: string, i: i32) => Step} stepCall
 *  Step-generating func at pos `i`
 *
 * @returns {Step}
 *  joined text + its count of chars
*/
function takewhileStep(
  input: string,
  start: i32,
  stepCall: (
    input: string,
    i: i32
  ) => Step
): Step {
  let startPos = start
  let text = ""

  while (startPos < input.length) {
    const s = stepCall(input, startPos)
    if (s.len == 0) break

    text += s.text
    // step output can be varying
    startPos += s.len
  }

  return new Step(text, startPos - start)
}

/**
 * map a letter index 0..25 to its glyph sequence
 *
 * ▌ prefixes a-j to make k-t
 * ▖ prefixes a-f to make u-z
 *
 * @param {i32} l
 *  letter index where a=0 .. z=25
 *
 * @returns {string}
 *  one or two glyphs encoding the letter
*/
function encodeLetterIndexToGlyphs(l: i32): string {
  if (l < 10) return BASE.charAt(l)
  if (l < 20) return "▌" + BASE.charAt(l - 10)
  return "▖" + BASE.charAt(l - 20)
}

/**
 * map digit charcode to BASE idx
 *
 * @param {i32} c
 *  charcode of 0..9
 *
 * @returns {i32}
 *  BASE index
*/
function charCodeToDigitBase(c: i32): i32 {
  return c == 0x30 ? 9 : c - 0x31
}

/**
 * search for `.` at a position as a decimal point
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {bool}
 *  true when `input[j]` is '.' and the next char is a digit
*/
function isDotBetweenDigits(input: string, i: i32): bool {
  // != `.`
  if (input.charCodeAt(i) != 0x2e) return false
  // check if digit ahead - 0-9.0-9
  return isAsciiDigit(charCodeAtPosition(input, i + 1))
}

/**
 * encode a possible decimal point inside a number run
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the ▐▐ glyph (len 1) for a decimal point, else a len-0 stop
*/
function encodeDecimalPointStep(input: string, i: i32): Step {
  if (isDotBetweenDigits(input, i)) return new Step("▐▐", 1)
  return new Step("", 0)
}

/**
 * encode one element of a number run (digit or decimal point)
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the digit's base glyph, or a decimal point, or a len-0 stop
*/
function encodeDigitOrDecimalStep(input: string, i: i32): Step {
  const d = input.charCodeAt(i)
  if (isAsciiDigit(d)) {
    const dch = BASE.charAt(charCodeToDigitBase(d))
    const s = new Step(dch, 1)
    return s
  }
  return encodeDecimalPointStep(input, i)
}

/**
 * encode a whole run of digits as a number
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  ▝▄ number sign followed by the digit glyphs, plus chars consumed
*/
function encodeDigitRunWithNumberSign(input: string, i: i32): Step {
  const body = takewhileStep(input, i, encodeDigitOrDecimalStep)
  return new Step("▝▄" + body.text, body.len)
}

/**
 * encode an uppercase letter
 *
 * @param {i32} c
 *  uppercase character code in 'A'..'Z'
 *
 * @returns {Step}
 *  ▄ capital sign followed by the letter glyphs (len 1)
*/
function encodeUppercaseLetter(c: i32): Step {
  // ▄ + letter
  return new Step("▄" + encodeLetterIndexToGlyphs(c - 0x41), 1)
}

/**
 * encode a punctuation-bank-2 mark, else passthrough
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  ▖▖ + base for a bank-2 mark, otherwise the raw char (len 1)
*/
function tryEncodePunctGroup2(input: string, i: i32): Step {
  const c = input.charCodeAt(i)

  const p2 = PUNCT_GROUP_2.indexOf(charCodeToString(c))
  // ▖▖ + base
  if (p2 >= 0) return new Step("▖▖" + BASE.charAt(p2), 1)

  // none found
  return new Step(charCodeToString(c), 1)
}

/**
 * encode a punctuation bank 1 or bank 2
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  ▝▝ + base for a bank-1 mark, otherwise the bank-2/passthrough result
*/
function tryEncodePunctGroup1(input: string, i: i32): Step {
  const c = input.charCodeAt(i)

  const p1 = PUNCT_GROUP_1.indexOf(charCodeToString(c))
  if (p1 >= 0) return new Step("▝▝" + BASE.charAt(p1), 1)

  return tryEncodePunctGroup2(input, i)
}

/**
 * encode a space, else do punctuation handling
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  a space (len 1), otherwise the punctuation/passthrough result
*/
function tryEncodeSpaceOrPunctuation(input: string, i: i32): Step {
  if (input.charCodeAt(i) == SPACE) return new Step(" ", 1)
  return tryEncodePunctGroup1(input, i)
}

/**
 * encode a lowercase letter, else assume space/punctuation
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the letter glyphs (len 1), otherwise the downstream result
*/
function tryEncodeLowercase(input: string, i: i32): Step {
  const c = input.charCodeAt(i)
  if (isAsciiLower(c)) return new Step(encodeLetterIndexToGlyphs(c - 0x61), 1)
  return tryEncodeSpaceOrPunctuation(input, i)
}

/**
 * encode an uppercase letter, else defer to lowercase/space/punctuation
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the capitalised letter
 *  otherwise the downstream result
*/
function tryEncodeUppercase(input: string, i: i32): Step {
  const c = input.charCodeAt(i)
  if (isAsciiUpper(c)) return encodeUppercaseLetter(c)
  return tryEncodeLowercase(input, i)
}

/**
 * encode one token at a position `i`
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  a number run for a digit, otherwise the non-digit result
*/
function encodeOneToken(input: string, i: i32): Step {
  const isDigit = isAsciiDigit(input.charCodeAt(i))
  if (isDigit) {
    return encodeDigitRunWithNumberSign(input, i)
  }
  // if not number check letters
  return tryEncodeUppercase(input, i)
}

/**
 * encode plain text into the conlang glyph stream
 *
 * @param {string} input
 *  plain ASCII text to encode
 *
 * @returns {string}
 *  the encoded glyph stream
*/
export function encode(input: string): string {
  return takewhileStep(input, 0, encodeOneToken).text
}

/**
 * uppercase an ASCII letter code
 * non-letters unchanged
 *
 * @param {i32} c
 *
 * @returns {i32}
 *  the uppercase code for a-z, otherwise `c` unchanged
*/
function toAsciiUpper(c: i32): i32 {
  if (
    // a..
    c >= 0x61 &&
    // ..z
    c <= 0x7a
  ) {
    // upper counterpart
    return c - 0x20
  }
  return c
}

/**
 * map a BASE index back to its digit char
 *
 * @param {i32} bi
 *  BASE index 0..9
 *
 * @returns {i32}
 *  digit code: 0..8 -> '1'..'9', 9 -> '0'
*/
function digitBaseToCharCode(bi: i32): i32 {
  return bi == 9 ? 0x30 : 0x31 + bi
}

/**
 * map prefix glyph to the first letter of its subsequence
 *
 * @param {i32} c
 *  prefix glyph character code
 *
 * @returns {i32}
 *  k 0x6b for ▌
 *  u 0x75 for ▖
 *  otherwise -1
*/
function prefixGlyphToDecadeFirstLetter(c: i32): i32 {
  if (c == MOD_KT) return 0x6b
  if (c == MOD_UZ) return 0x75
  return -1
}

/**
 * decode a prefixed letter given its decade's first letter
 *
 * @param {string} input
 * @param {i32} i
 * @param {i32} first
 *  ASCII code of the decade's first letter ('k' or 'u')
 *
 * @returns {Letter}
 *  the decoded letter (len 2), or a non-letter token when the base is invalid
*/
function decodePrefixedLetterWithDecade(input: string, i: i32, first: i32): Letter {
  const idx = findBaseGlyphIndexAtPosition(input, i + 1)
  if (idx < 0) return new Letter(-1, 1)
  return new Letter(first + idx, 2)
}

/**
 * decode a letter introduced by a ▌ or ▖ prefix
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Letter}
 *  the k-t or u-z letter, or a non-letter token when not prefixed
*/
function decodePrefixedLetterAt(input: string, i: i32): Letter {
  const first = prefixGlyphToDecadeFirstLetter(input.charCodeAt(i))
  if (first < 0) return new Letter(-1, 1)
  return decodePrefixedLetterWithDecade(input, i, first)
}

/**
 * decode a letter token at a position
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Letter}
 *  an a-j letter (len 1), a k-z letter (len 2), or a non-letter token
*/
function decodeLetterGlyphsAt(input: string, i: i32): Letter {
  if (i >= input.length) return new Letter(-1, 1)
  const bi = findBaseGlyphIndex(input.charCodeAt(i))
  // a-j
  if (bi >= 0) return new Letter(0x61 + bi, 1)
  // ▌+base or ▖+base
  return decodePrefixedLetterAt(input, i)
}

/**
 * emit the raw glyph at a position (unrecognised input)
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the single glyph passed through (len 1)
*/
function emitRawGlyphAsStep(input: string, i: i32): Step {
  return new Step(charCodeToString(input.charCodeAt(i)), 1)
}

/**
 * decode a letter token into a Step or pass through
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the decoded letter, otherwise the raw glyph (len 1)
*/
function decodeLetterToStep(input: string, i: i32): Step {
  const l = decodeLetterGlyphsAt(input, i)
  if (l.code >= 0) return new Step(charCodeToString(l.code), l.len)
  return emitRawGlyphAsStep(input, i)
}

/**
 * test whether ▐▐ (decimal point) begins at a position
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {bool}
 *  true when `input[i]` and the next glyph are both ▐
*/
function isDoubledDecimalGlyph(input: string, i: i32): bool {
  if (input.charCodeAt(i) != MOD_DECIMAL_NUM) return false
  return charCodeAtPosition(input, i + 1) == MOD_DECIMAL_NUM
}

/**
 * decode a decimal point inside a number run, or stop the run
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  '.' (len 2) for ▐▐, otherwise a len-0 stop
*/
function decodeNumberDecimalOrStop(input: string, i: i32): Step {
  if (isDoubledDecimalGlyph(input, i)) return new Step(".", 2)
  // space or any other MOD ends the run
  return new Step("", 0)
}

/**
 * decode one element of a number run (digit or decimal point)
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the digit char for a base glyph, otherwise the decimal/stop result
*/
function decodeDigitOrDecimalStep(input: string, i: i32): Step {
  const bi = findBaseGlyphIndex(input.charCodeAt(i))
  if (bi >= 0) return new Step(charCodeToString(digitBaseToCharCode(bi)), 1)
  return decodeNumberDecimalOrStop(input, i)
}

/**
 * decode a number run introduced by ▝▄
 *
 * @param {string} input
 * @param {i32} i
 *  index of the ▝ glyph in `input`
 *
 * @returns {Step}
 *  the decoded digits/decimal
 *  + total glyphs consumed including ▝▄ itself
*/
function decodeNumberMode(input: string, i: i32): Step {
  // skip ▝▄
  const body = takewhileStep(input, i + 2, decodeDigitOrDecimalStep)
  return new Step(body.text, 2 + body.len)
}

/**
 * decode one uppercased letter inside a word-caps run
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the uppercased letter, or a len-0 stop at a non-letter
*/
function decodeCapsLetterStep(input: string, i: i32): Step {
  const l = decodeLetterGlyphsAt(input, i)
  if (l.code < 0) return new Step("", 0)
  return new Step(charCodeToString(toAsciiUpper(l.code)), l.len)
}

/**
 * decode one element of a word-caps run (stop at a space)
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the uppercased letter, or a len-0 stop at a space or non-letter
*/
function decodeWordCapsStep(input: string, i: i32): Step {
  if (input.charCodeAt(i) == SPACE) return new Step("", 0)
  return decodeCapsLetterStep(input, i)
}

/**
 * decode a word-caps run introduced by ▄▄
 *
 * @param {string} input
 * @param {i32} i
 *
 * @returns {Step}
 *  the uppercased word and the total glyphs consumed (incl. ▄▄)
*/
function decodeWordCaps(input: string, i: i32): Step {
  // skip ▄▄
  const body = takewhileStep(input, i + 2, decodeWordCapsStep)
  return new Step(body.text, 2 + body.len)
}

/**
 * decode a single ▄ capital sign applied to the next letter
 *
 * @param {string} input
 * @param {i32} i
 *  index of the ▄ glyph in `input`
 *
 * @returns {Step}
 *  the capitalised letter, or a stray ▄ when no letter follows
*/
function decodeSingleCapital(input: string, i: i32): Step {
  const L = decodeLetterGlyphsAt(input, i + 1)
  // stray ▄
  if (L.code < 0) return emitRawGlyphAsStep(input, i)
  return new Step(charCodeToString(toAsciiUpper(L.code)), 1 + L.len)
}

/**
 * decode a capital sign, choosing word-caps (▄▄) or single (▄)
 *
 * @param {string} input
 * @param {i32} i
 *  index of the ▄ glyph in `input`
 *
 * @returns {Step}
 *  the word-caps result for ▄▄, otherwise the single-capital result
*/
function decodeCapital(input: string, i: i32): Step {
  // ▄▄
  if (charCodeAtPosition(input, i + 1) == MOD_CAP) return decodeWordCaps(input, i)
  // ▄
  return decodeSingleCapital(input, i)
}

/**
 * decode a punctuation-bank-1 mark introduced by ▝▝
 *
 * @param {string} input
 * @param {i32} i
 *  index of the first ▝ glyph in `input`
 *
 * @returns {Step}
 *  the bank-1 mark (len 3), or a stray ▝ when the base is invalid
*/
function decodePunct1(input: string, i: i32): Step {
  const bi = findBaseGlyphIndexAtPosition(input, i + 2)
  // ▝▝ + base
  if (bi >= 0) return new Step(PUNCT_GROUP_1.charAt(bi), 3)
  return emitRawGlyphAsStep(input, i)
}

/**
 * decode a ▝-led construct: ▝▝ punctuation or ▝▄ number sign
 *
 * @param {string} input
 * @param {i32} i
 *  index of the ▝ glyph in `input`
 *
 * @returns {Step}
 *  punctuation for ▝▝, a number run for ▝▄, otherwise a stray ▝
*/
function decodeComplexReadmode(input: string, i: i32): Step {
  const next = charCodeAtPosition(input, i + 1)
  // ▝▝
  if (next == MOD_COMPLEX_READMODE) return decodePunct1(input, i)
  // ▝▄
  if (next == MOD_CAP) return decodeNumberMode(input, i)
  return emitRawGlyphAsStep(input, i)
}

/**
 * decode a ▐▐ decimal point seen outside a number run
 *
 * @param {string} input
 * @param {i32} i
 *  index of the first ▐ glyph in `input`
 *
 * @returns {Step}
 *  '.' (len 2) for ▐▐, otherwise a stray ▐
*/
function decodeDecimalOutside(input: string, i: i32): Step {
  // ▐▐
  if (charCodeAtPosition(input, i + 1) == MOD_DECIMAL_NUM) return new Step(".", 2)
  return emitRawGlyphAsStep(input, i)
}

/**
 * decode a punctuation-bank-2 mark introduced by ▖▖
 *
 * @param {string} input
 * @param {i32} i
 *  index of the first ▖ glyph in `input`
 *
 * @returns {Step}
 *  the bank-2 mark (len 3), or the letter/passthrough result if base is invalid
*/
function decodePunct2(input: string, i: i32): Step {
  const bi = findBaseGlyphIndexAtPosition(input, i + 2)
  // ▖▖ + base
  if (bi >= 0) return new Step(PUNCT_GROUP_2.charAt(bi), 3)
  return decodeLetterToStep(input, i)
}

/**
 * test whether ▖▖ (punctuation bank 2) begins at a position
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {bool}
 *  true when `input[i]` and the next glyph are both ▖
*/
function isDoubledUzGlyph(input: string, i: i32): bool {
  if (input.charCodeAt(i) != MOD_UZ) return false
  return charCodeAtPosition(input, i + 1) == MOD_UZ
}

/**
 * decode ▖▖ punctuation, else treat the glyph as a letter
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {Step}
 *  bank-2 punctuation for ▖▖, otherwise the letter/passthrough result
*/
function decodePunct2OrLetter(input: string, i: i32): Step {
  // ▖▖
  if (isDoubledUzGlyph(input, i)) return decodePunct2(input, i)
  return decodeLetterToStep(input, i)
}

/**
 * dispatch a ▐ decimal point, else defer to ▖▖/letter handling
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {Step}
 *  the decimal-point result for ▐, otherwise the downstream result
*/
function decodeAfterComplexReadmode(input: string, i: i32): Step {
  if (input.charCodeAt(i) == MOD_DECIMAL_NUM) return decodeDecimalOutside(input, i)
  return decodePunct2OrLetter(input, i)
}

/**
 * dispatch a ▝-led construct, else defer to ▐/▖▖/letter handling
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {Step}
 *  the ▝ result, otherwise the downstream result
*/
function decodeAfterCapital(input: string, i: i32): Step {
  if (input.charCodeAt(i) == MOD_COMPLEX_READMODE) return decodeComplexReadmode(input, i)
  return decodeAfterComplexReadmode(input, i)
}

/**
 * apply ▄ capital glyph, otherwise prioritize ▝/▐/▖▖/letter handling
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {Step}
 *  the capital-sign result, otherwise the downstream result
*/
function decodeNonSpace(input: string, i: i32): Step {
  if (input.charCodeAt(i) == MOD_CAP) return decodeCapital(input, i)
  return decodeAfterCapital(input, i)
}

/**
 * decode one token at a position (the decode dispatcher)
 *
 * @param {string} input
 * @param {i32} i
 *  index in `input` string
 *
 * @returns {Step}
 *  a space (len 1), otherwise the non-space result
*/
function decodeOneToken(input: string, i: i32): Step {
  // filter out
  if (input.charCodeAt(i) == SPACE) return new Step(" ", 1)
  return decodeNonSpace(input, i)
}

/**
 * decode a conlang glyph stream back into plain text
 *
 * @param {string} input
 *  glyph stream to decode
 *
 * @returns {string}
 *  the decoded plain text
*/
export function decode(input: string): string {
  return takewhileStep(input, 0, decodeOneToken).text
}
