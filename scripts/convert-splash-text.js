// #!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* Lightweight text-to-banner converter */
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const { visibleLength } = require('./wcwidth');

const input = argv._[0] || path.join('abimongo-brand', 'extras', 'cli_splash.txt');
const out = argv.o || path.join('abimongo-brand', 'extras', 'cli_splash.txt');
const preview = !!(argv.preview || argv.p || argv.stdout || argv.s);
const noHeader = !!(argv.noheader || argv.n);

function esc(r, g, b) { return `\x1b[38;2;${r};${g};${b}m`; }
function reset() { return '\x1b[0m'; }

// visibleLength has been extracted to ./wcwidth.js and accounts for ANSI escapes

function padPrintable(s, width) {
	const printable = visibleLength(s);
	const left = Math.floor((width - printable) / 2);
	const right = width - printable - left;
	return ' '.repeat(left) + s + ' '.repeat(right);
}

function makePlainBox(lines, hpad = 2, vpad = 1) {
	const contentMax = lines.reduce((m, l) => Math.max(m, visibleLength(l)), 0);
	const inner = contentMax + hpad * 2;
	// rounded corners for a softer border
	const tl = '╭', tr = '╮', bl = '╰', br = '╯', hor = '─', ver = '│';
	const top = tl + hor.repeat(inner) + tr;
	const bottom = bl + hor.repeat(inner) + br;
	const empty = ver + ' '.repeat(inner) + ver;
	const outLines = [top];
	for (let i = 0; i < vpad; i++) outLines.push(empty);
	for (const l of lines) {
		const body = padPrintable(l, contentMax);
		outLines.push(ver + ' '.repeat(hpad) + body + ' '.repeat(hpad) + ver);
	}
	for (let i = 0; i < vpad; i++) outLines.push(empty);
	outLines.push(bottom);
	return outLines.join('\n') + '\n';
}

function makeAnsiBox(lines, hpad = 2, vpad = 1, preImage = '') {
	// use visibleLength to account for ANSI escapes and wide glyphs
	const contentMax = lines.reduce((m, l) => Math.max(m, visibleLength(l)), 0);
	const inner = contentMax + hpad * 2;
	// Abimongo brand teal: #00C4B4 -> rgb(0,196,180)
	const border = esc(0, 196, 180);
	const text = esc(255, 255, 255);
	// rounded corners
	const tl = '╭', tr = '╮', bl = '╰', br = '╯', hor = '─', ver = '│';
	const top = border + tl + hor.repeat(inner) + tr + reset();
	const bottom = border + bl + hor.repeat(inner) + br + reset();
	const empty = border + ver + reset() + ' '.repeat(inner) + border + ver + reset();
	const outLines = [];
	outLines.push(top);
	// if we have an inline image payload, render it as a centered inner line
	if (preImage) {
		// preImage is an escape sequence; center it visually by padding
		const leftPad = Math.floor((inner - 0) / 2); // image has no printable width
		const rightPad = inner - leftPad;
		const imgLine = border + ver + reset() + ' '.repeat(leftPad) + preImage + ' '.repeat(rightPad) + border + ver + reset();
		outLines.push(imgLine);
	}
	for (let i = 0; i < vpad; i++) outLines.push(empty);
	for (const l of lines) {
		// color the subtitle (user request): "MongoDB toolkit" in Abimongo teal
		let colored;
		if (/MongoDB toolkit/i.test(l)) {
			colored = esc(0, 196, 180) + l + reset();
		} else {
			colored = text + l + reset();
		}
		const body = padPrintable(colored, contentMax);
		outLines.push(border + ver + reset() + ' '.repeat(hpad) + body + ' '.repeat(hpad) + border + ver + reset());
	}
	for (let i = 0; i < vpad; i++) outLines.push(empty);
	outLines.push(bottom);
	return outLines.join('\n') + '\n';
}

// attempt to discover a brand logo file
function findLogo() {
	const candidates = [
		'abimongo-brand/logo_horizontal.png',
		'abimongo-brand/logo_light.png',
		'abimongo-brand/logo_dark.png',
		'abimongo-brand/logo_monochrome_white.png',
		'abimongo-brand/logo_monochrome_black.png',
		'abimongo-brand/icon_gradient.png',
		'abimongo-brand/standalone_A.png',
	];
	for (const c of candidates) if (fs.existsSync(c)) return c;
	return null;
}

// embed image for iTerm2 or Kitty if available (simple iTerm and Kitty support)
function embedImageIfSupported(imgPath) {
	if (!imgPath) return '';
	try {
		const data = fs.readFileSync(imgPath);
		const b64 = data.toString('base64');
		// iTerm2 inline image
		if (process.env.TERM_PROGRAM === 'iTerm.app') {
			// name is optional; inline=1 to show
			return `\x1b]1337;File=inline=1;width=auto;height=auto;preserveAspectRatio=1:${b64}\x07`;
		}
		// Kitty graphics protocol
		if (process.env.KITTY_WINDOW_ID) {
			// send as a single chunk
			return `\x1b_Gf=100;t=d;${b64}\x1b\\`;
		}
	} catch (e) {
		// ignore
	}
	return '';
}

// removed unused icon-generation helpers (kept file focused on text banners)

function ensureDirFor(filePath) {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function run() {
	if (!fs.existsSync(input)) {
		console.error(`Input not found: ${input}`);
		process.exit(2);
	}

	const txt = fs.readFileSync(input, 'utf8');
	// If the input already contains ANSI/banner chars (we previously overwrote
	// the file with a generated banner), try to extract the visible text by
	// stripping ANSI escapes and box characters so we can rebuild a fresh box.
	let rawLines;
	const ESC = String.fromCharCode(27);
	if (txt.includes(ESC) || /[┌┐└┘│─╭╮╰╯]/.test(txt)) {
		// remove ANSI SGR sequences then strip any box-drawing characters anywhere in the line
		const stripped = txt.replace(new RegExp(ESC + '\\[[0-9;]*m', 'g'), '');
		rawLines = stripped.split(/\r?\n/).map(l => l.replace(/[╭╮╰╯┌┐└┘─│]/g, '').replace(/^\s+|\s+$/g, ''));
	} else {
		rawLines = txt.split(/\r?\n/).map(l => l.replace(/\s+$/u, ''));
	}
	// Remove any auto-generated header lines that came from previous script runs
	// (e.g. "# Generated by scripts/convert-splash.js - ...")
	const filtered = rawLines.filter(l => !/^#\s*Generated by scripts\/convert-splash/.test(l));
	// Clamp lines to a reasonable maximum width to keep the box compact
	const maxWidth = parseInt(argv.maxWidth || argv.w || '60', 10) || 60;
	const contentLines = filtered.map(l => (l.length > maxWidth ? l.slice(0, maxWidth) : l)).filter(l => l.trim().length > 0);

	// try to auto-find a brand logo to embed (iTerm/Kitty only)
	const logo = findLogo();
	const preImage = embedImageIfSupported(logo);

	// normalize wide glyphs (circled A / emoji) to plain 'A' for consistent width
	const normalizeWide = s => s.replace(/🅰|Ⓐ/g, 'A');
	const plainLines = contentLines.map(normalizeWide);
	// remove any leading standalone icon/token (emoji/circled A or ASCII 'A') that prefixes 'Abimongo'
	for (let i = 0; i < plainLines.length; i++) {
		plainLines[i] = plainLines[i].replace(/^\s*(?:🅰|Ⓐ|A)\s+(?=Abimongo\b)/i, '');
	}
	// ANSI lines mirror plain lines (no icon);
	const ansiLines = plainLines.slice();

	// width measurement is handled by visibleLength (wcwidth) so ad-hoc fixes removed
	// reduce vertical padding to keep the box compact (user requested)
	const plainBox = makePlainBox(plainLines, 2, 0);
	const ansiBox = makeAnsiBox(ansiLines, 2, 1, preImage);

	// ASCII wordmark to appear before the boxed banner (plain + ANSI)
	// simpler ASCII wordmark (avoid problematic backslashes in string literals)
	const wordmarkLines = [
		'==============================================',
		'  ABIMONGO — A compact MongoDB toolkit        ',
		'==============================================',
		''
	];

	// Compose final outputs with wordmark on top
	const plain = wordmarkLines.join('\n') + '\n' + plainBox;
	// color the wordmark for ANSI output using the brand teal
	const teal = esc(0, 196, 180);
	const resetSeq = reset();
	const ansiWordmark = wordmarkLines.map(l => teal + l + resetSeq).join('\n') + '\n';
	const ansi = ansiWordmark + ansiBox;

	const origOut = out.replace(/(\.txt)$/i, '.orig$1');
	const plainOut = out.replace(/(\.txt)$/i, '.plain$1');

	ensureDirFor(out);
	ensureDirFor(origOut);
	ensureDirFor(plainOut);

	// Write a sanitized original: strip ANSI and box characters so the .orig.txt
	// contains only the visible, clean text lines. This prevents overwriting
	// the source with banner escape sequences in future runs.
	try {
		const sanitized = contentLines.join('\n') + '\n';
		fs.writeFileSync(origOut, sanitized, 'utf8');
	} catch (e) { /* ignore */ }
	try { fs.writeFileSync(plainOut, plain, 'utf8'); } catch (e) { /* ignore */ }

	// By user request, do not include a generated header line; output contains only the boxed banner
	const final = ansi;

	if (preview) {
		process.stdout.write(final);
		console.error(`(preview) Generated boxed splash (ANSI) from ${input}`);
		return;
	}

	try { fs.writeFileSync(out, final, 'utf8'); } catch (e) { console.error('Failed to write output:', e); process.exit(1); }
	console.log(`Wrote boxed ANSI splash to ${out}`);
}

run().catch(err => { console.error('Error:', err); process.exit(1); });
