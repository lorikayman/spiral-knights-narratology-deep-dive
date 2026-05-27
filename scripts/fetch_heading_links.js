#!/usr/bin/env bun
import { parseArgs } from "node:util"

const l = console.log
const le = console.error

const { values, _ } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    input: {
      type: "string",
      short: "i",
    },
    output: {
      type: "string",
      short: "o",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  allowPositionals: false,
})

// detect help arg and exit regardless of other args
if (values.help) {
  console.log(
    "Usage: bun scripts/heading_links.js <input.md> --output <out.jsonc>\n" +
      "\n" +
      "Parses MD headings (# .. ######) from a markdown file and writes a\n" +
      "flat JSONC object mapping each heading text to its URL hash anchor\n"
  )
  process.exit(values.help ? 0 : 1)
}

const inputPath = values.input
const outputPath = values.output

const source = await Bun.file(inputPath).text()

// md heading regex
const HEADING_RE = new RegExp(
  '^' +
  '(#{1,6})' +        // hash count h1-h6
  '[ \\t]+' +         // 1+ spaces/tabs, not common
  '(.+?)' +           // any text
  '(?:[ \\t]+#+)?' +  // trailing hashes
  '[ \\t]*' +         // trailing whitespace
  '$'
);

function cleanInlineMarkup(text) {
  const res = text
    // remove code
    .replace(/`([^`]+)`/g, "$1")
    // remove bold double asterisc + underline
    // order matters
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    // remove italic asterisc + underline
    .replace(/(\*|_)(.+?)\1/g, "$2")
    // remove crossout
    .replace(/~~(.+?)~~/g, "$1")
    // remove html tag wrap
    .replace(/<\/?[a-zA-Z][^>]*>/g, "")
  // l(`cleanup: ${text} -> ${res}`)
  return res
}

// create a url slug which may be found
// during link referencing with links to headings
function createUrlSlugFromPlainHeading(text) {
  // proprocess - remove inline md
  const res = cleanInlineMarkup(text)
    .toLowerCase()
    // cleanup
    //
    // remove abnormal chars in unicode mode
    // leaves letter + numbers of unicode
    .replace(/[^\p{L}\p{N}\s-]+/gu, "")
    .trim()
    // replace any spaces with -
    .replace(/\s+/g, "-")
  // l(`processed: "${text}" ->\n"${res}"\n`)
  return res
}

const lines = source.split(/\r?\n/)
// map of unique headings to their url slugs @see createUrlSlugFromPlainHeading
const mappings = {}
const seenHeadings = new Set()

let inExclusion = false
let exChar = ""
let exLen = 0

// lines iterator
let i = 0

for (; i < lines.length; i++) {
  const line = lines[i]

  // match code notation and crossout styles in .md
  const exclusions = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/)
  if (exclusions) {
    const marker = exclusions[1]
    if (!inExclusion) {
      inExclusion = true
      exChar = exclusions[0]
      exLen = exclusions.length
    } else if (exclusions[0] === exChar && marker.length >= exLen) {
      inExclusion = false
    }
    continue
  }
  if (inExclusion) continue

  const mHeading = line.match(HEADING_RE)
  if (!mHeading) continue

  const headingText = mHeading[2].trim()
  const baseUrlSlug = createUrlSlugFromPlainHeading(headingText)
  // filter invalid urls
  if (!baseUrlSlug) continue

  // create unique and final set of headings
  if (seenHeadings.has(headingText)) continue
  seenHeadings.add(headingText)
  mappings[headingText] = `#${baseUrlSlug}`
}

const body = JSON.stringify(mappings, null, 2)
// json commented
const header = `// Source: ${inputPath}\n`
await Bun.write(outputPath, header + body + "\n")

l(
  `Wrote ${Object.keys(mappings).length} heading mappings to ${outputPath}`,
)
