#!/usr/bin/env bun
import { parseArgs } from "node:util"

const { values, _ } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    input: {
      type: "string",
    },
    "reference-json": {
      type: "string",
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  allowPositionals: false,
})

if (values.help) {
  console.log(
    "Usage: bun scripts/check_links.js --reference-json <file.jsonc> [markdown_file]\n" +
      "\n" +
      "Checks hash links in markdown content against a reference JSONC file\n"
  )
  process.exit(0)
}

const markdownPath = values.input //Bun.argv.slice(2).find((arg) => !arg.startsWith("--")) || './src/lib/burning_stars.md'
const linksPath = values["reference-json"]

if (!linksPath) {
  console.error("Error: --reference-json is required")
  process.exit(1)
}

const markdownContent = await Bun.file(markdownPath).text()
const jsoncContent = await Bun.file(linksPath).text()

const hashLinks = [...markdownContent.matchAll(/\[([^\]]+)\]\((#[a-zA-Z0-9\-]+)\)/g)]
const validHashes = new Set(
  Object.entries(JSON.parse(jsoncContent.replace(/\/\/.*$/gm, '')))
    .filter(([_, val]) => typeof val === 'string' && val.startsWith('#'))
    .map(([_, val]) => val.slice(1))
)

const missingLinks = hashLinks
  .filter((match) => !validHashes.has(match[2].slice(1)))
  .map((match) => ({
    text: match[1],
    link: match[2]
  }))

if (missingLinks.length > 0) {
  console.log('Missing hash links:')
  missingLinks.forEach(link => {
    console.log(`- [${link.text}](${link.link})`)
  })
} else {
  console.log('All hash links are present in the reference file')
}
