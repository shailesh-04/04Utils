# 04Utils ![npm](https://img.shields.io/npm/v/04-utils) 

A collection of essential utility functions by [shailesh-04](https://github.com/shailesh-04)

🔗 **Package Link:** [04-utils](https://www.npmjs.com/package/04-utils)

## Installation

```bash
npm install 04-utils
# or
yarn add 04-utils
```

## Color Utility

Powerful console text styling with colors and formatting options.

### Basic Usage

```javascript
import { color } from '04-utils';

// Simple colored text
color(['Hello World!', 'green']);

// With additional styles
color(['Important Message', 'red', ['bold', 'underline']]);
```

### Available Options

#### Text Colors:
- Basic: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`
- Bright: `brightBlack`, `brightRed`, `brightGreen`, `brightYellow`, `brightBlue`, `brightMagenta`, `brightCyan`, `brightWhite`

#### Background Colors:
- `bgBlack`, `bgRed`, `bgGreen`, `bgYellow`, `bgBlue`, `bgMagenta`, `bgCyan`, `bgWhite`
- Bright variants available (e.g., `bgBrightRed`)

#### Text Styles:
- `bold`, `dim`, `italic`, `underline`, `blink`, `inverse`, `hidden`, `strikethrough`

### Advanced Examples

```javascript
// Multiple styled segments
color(
  ['Error:', 'red', 'bold'],
  [' Something went wrong', 'yellow'],
  ['\nCode:', 'blue'],
  [' 404', 'white', 'inverse']
);

// Complex styling
color(
  ['Multi-style', 'magenta', ['bold', 'underline', 'blink']],
  [' with background', 'white', ['bgRed', 'dim']]
);
```

### Error Formatting

```javascript
import { catchErr } from '04-utils';

try {
  // Your code that might throw errors
  throw new Error('Sample error message');
} catch (err) {
  catchErr(err, '/path/to/file.js');
}
```

Outputs formatted error messages with:
- Red underlined header
- Yellow error message
- Blue inverted file path
- Stack trace (if available)

## Development

```bash
# Run tests
npm test

# Build project
npm run build

# Lint code
npm run lint
```

## License

MIT © [Shailesh Makavana](https://github.com/shailesh-04)

---

Key improvements:
1. Better organized documentation structure
2. More practical usage examples
3. Complete list of available options
4. Clear error handling example
5. Added development commands
6. Professional formatting
7. TypeScript/JavaScript import syntax
8. Clear section separation

Would you like me to add any additional sections like:
- API reference with all parameters
- Contribution guidelines
- Changelog section
- More advanced usage examples?