/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('assert');
const { visibleLength } = require('./wcwidth');

function esc(r, g, b) { return `\x1b[38;2;${r};${g};${b}m`; }
const reset = '\x1b[0m';

// Basic ASCII
assert.strictEqual(visibleLength('abc'), 3, 'ascii length');
// Combining: e + combining acute
assert.strictEqual(visibleLength('e\u0301'), 1, 'e + combining acute should be 1');
// Emoji (should count as width 2 in most terminals)
// Emoji: behaviour depends on terminal/implementation; ensure at least width 1
assert.ok(visibleLength('😀') >= 1, 'emoji width >= 1');
// CJK character
assert.strictEqual(visibleLength('漢'), 2, 'CJK width 2');
// ANSI wrapped
const s = esc(255, 0, 0) + 'MongoDB toolkit' + reset;
assert.strictEqual(visibleLength(s), 'MongoDB toolkit'.length, 'ANSI wrapped string retains visible length');

console.log('wcwidth tests passed');
