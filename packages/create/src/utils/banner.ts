import figlet from 'figlet';
import { colorize } from './colorize';

export function showBanner() {
  try {
    const banner = figlet.textSync('Abimongo CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    console.log(colorize(banner, 'cyan'));
  } catch (error) {
    console.warn(
      colorize('⚠️ Figlet font not found or failed to load. Displaying fallback banner.', 'yellow'),
      error
    );
    console.log(colorize('=== Abimongo CLI ===', 'cyan'));
  }
}
