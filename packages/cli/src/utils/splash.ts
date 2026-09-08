import fs from 'fs';
import path from 'path';
import figlet from 'figlet';
import { colorize } from '@abimongo/core';

const SPLASH_PATH = path.resolve(__dirname, '..', '..', '..', '..', 'abimongo-brand', 'extras', 'cli_splash.txt');
const LOGO_DARK_PATH = path.resolve(__dirname, '..', '..', '..', '..', 'abimongo-brand', 'logo_dark.png');

function tryShowInlineImage(imgPath: string): boolean {
  // iTerm2 inline image escape sequence. Only do this when explicitly enabled via env.
  try {
    const enabled = String(process.env.ABIMONGO_CLI_INLINE_IMAGE || '').toLowerCase();
    if (!['1', 'true', 'yes'].includes(enabled)) return false;
    if (!fs.existsSync(imgPath)) return false;
    // Read and base64-encode the image
    const buf = fs.readFileSync(imgPath);
    const b64 = buf.toString('base64');
    // Write iTerm2 inline image escape; many terminals will ignore unknown sequences.
    const esc = `\u001b]1337;File=inline=1;width=auto;height=12;preserveAspectRatio=1:${b64}\u0007`;
    process.stdout.write(esc + '\n');
    return true;
  } catch {
    return false;
  }
}

export function showSplash() {
  try {
    // If user specifically asked for inline logo and the terminal supports it,
    // attempt to display logo_dark.png first (gives a nicer visual on supported terminals).
    if (tryShowInlineImage(LOGO_DARK_PATH)) return;

    // Prefer a curated ASCII splash file if present in the repo
    if (fs.existsSync(SPLASH_PATH)) {
      const txt = fs.readFileSync(SPLASH_PATH, 'utf8');
      console.log(colorize(txt, 'cyan'));
      return;
    }

    // Fallback to figlet-rendered banner
    const banner = figlet.textSync('Abimongo', { font: 'Standard' });
    console.log(colorize(banner, 'cyan'));
  } catch {
    // Best-effort: fallback plain text
    console.log(colorize('=== Abimongo CLI ===', 'cyan'));
  }
}

export default showSplash;
