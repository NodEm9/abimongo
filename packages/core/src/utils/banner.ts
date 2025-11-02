import figlet from 'figlet'; 
import { colorByLevel } from '@abimongo/logger';

export function showBanner() {
  try {
    const banner = figlet.textSync('Abimongo CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    console.log(colorByLevel('info', banner));
  } catch (error) {
    console.warn(
      colorByLevel('warn', 'Figlet font not found or failed to load. Displaying fallback banner.'),
      error
    );
    console.log(colorByLevel('info', '=== Abimongo Core CLI ==='));
  }
}
