import { writeFileSync } from 'node:fs'

// see gremlin conlang sequences
const CONLANG_CHARS_UNSORTED = '▀▄▐▚▘▗▞▖▝▙▟▌▜▛█ '

// sort through hex
// note: code unit == codepoint
const charsSorted = [...CONLANG_CHARS_UNSORTED].sort((a, b) => a.codePointAt(0) - b.codePointAt(0))

const charsMap = charsSorted.map((ch, pos) => {
  const currPoint = ch.codePointAt(0)
  const prev = pos !== 0
    ? charsSorted[pos - 1].codePointAt(0)
    // relative to NULL compare `space` char `0x0020`
    : 0x0000
  return {
    char: ch,
    codepoint: `U+${currPoint.toString(16).toUpperCase().padStart(4, '0')}`,
    delta: `0x${(currPoint - prev).toString(16).toUpperCase()}`
  }
})

const out = new URL('./codepoints.jsonc', import.meta.url)
const body = JSON.stringify(charsMap)
writeFileSync(out, body)
console.log('output written to:\n', out.pathname)
