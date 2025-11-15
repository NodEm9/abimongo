 
/* eslint-env node */
/* eslint-disable no-control-regex, no-undef */
// Simple visible-length (wcwidth-like) helper that strips ANSI SGR escapes
// and computes printable width accounting for combining chars and East-Asian wide
// ranges. Exported so other scripts can import it for consistent centering.

function bisearch(ucs, table) {
	let lo = 0;
	let hi = table.length - 1;
	if (ucs < table[0][0] || ucs > table[hi][1]) return false;
	while (hi >= lo) {
		const mid = Math.floor((lo + hi) / 2);
		if (ucs > table[mid][1]) lo = mid + 1;
		else if (ucs < table[mid][0]) hi = mid - 1;
		else return true;
	}
	return false;
}

const COMBINING = [
	[0x0300, 0x036F], [0x1AB0, 0x1AFF], [0x1DC0, 0x1DFF], [0x20D0, 0x20FF], [0xFE20, 0xFE2F]
];

const WIDE = [
	[0x1100, 0x115F], [0x2329, 0x232A], [0x2E80, 0xA4CF], [0xAC00, 0xD7A3],
	[0xF900, 0xFAFF], [0xFE10, 0xFE19], [0xFE30, 0xFE6F], [0xFF00, 0xFF60], [0xFFE0, 0xFFE6],
	[0x20000, 0x2FFFD], [0x30000, 0x3FFFD]
];

function stripAnsi(s) {
	if (!s) return '';
	// Remove CSI SGR sequences like ESC[[...m and other OSC/CSI sequences conservatively
	const sgr = new RegExp('\\x1b\\[[0-9;]*m', 'g');
	const osc = new RegExp('\\x1b\\][^\\x07]*\\x07', 'g');
	return s.replace(sgr, '').replace(osc, '');
}

function visibleLength(s) {
	if (!s) return 0;
	const stripped = stripAnsi(s);
	let w = 0;
	for (let i = 0; i < stripped.length;) {
		const cp = stripped.codePointAt(i);
		if (cp === 0) {
			// ignore
		} else if (cp < 32 || (cp >= 0x7f && cp < 0xa0)) {
			// control
		} else if (bisearch(cp, COMBINING)) {
			// zero width
		} else if (bisearch(cp, WIDE)) {
			w += 2;
		} else {
			w += 1;
		}
		i += cp > 0xffff ? 2 : 1;
	}
	return w;
}

module.exports = { visibleLength };
