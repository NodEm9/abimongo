import fs from 'fs';
import path from 'path';
import figlet from 'figlet';
import { colorize } from '../../core/src/utils/color-palatte';

const SPLASH_PATH = path.resolve(__dirname, '..', '..', '..', '..', 'abimongo-brand', 'extras', 'cli_splash.txt');

export function showSplash() {
  try {
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
