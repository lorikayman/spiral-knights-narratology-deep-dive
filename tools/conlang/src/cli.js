import { parseArgs } from 'node:util'
import { encode as clEncode, decode as clDecode } from './conlang.js'

const { values } = parseArgs({
  options: {
    encode: {
      type: 'boolean',
    },
    decode: {
      type: 'boolean',
    },
    input: {
      type: 'string',
    }
  }
})

if (Boolean(values.encode) === Boolean(values.decode)) {
  process.stderr.write('error: pass exactly one of --encode or --decode\n')
  process.exit(1)
}

if (values.input == null) {
  process.stderr.write('error: --input <string> is required\n')
  process.exit(1)
}

const result = values.encode ?
  clEncode(values.input) :
  clDecode(values.input)
process.stdout.write(result + '\n')
