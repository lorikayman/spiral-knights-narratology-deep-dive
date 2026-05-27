// js bindings glue

import { instantiate } from '@assemblyscript/loader'
import { readFileSync } from 'node:fs'

const wasmUrl = new URL('../build/conlang.wasm', import.meta.url)
const { exports } = await instantiate(readFileSync(wasmUrl), {})

export function encode (text) {
  return exports.__getString(exports.encode(exports.__newString(text)))
}

export function decode (text) {
  return exports.__getString(exports.decode(exports.__newString(text)))
}
