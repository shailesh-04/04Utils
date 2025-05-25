# 04Utils ![npm](https://img.shields.io/npm/v/04-utils)

A collection of essential utility functions by [shailesh-04](https://github.com/shailesh-04)

## Installation

```bash
npm install 04-utils
```

## Usage

---

### color

```js
import {color} from '../dist/color.js';

console.log('\nTesting color function:');
color(
  ['Regular text'],
  ['Red text', 'red'],
  ['Blue bold', 'blue', 'bold'],
  ['Green underline', 'green', ['underline']],
  ['Multi-style', 'yellow', ['bold', 'underline', 'inverse']]
);
```
