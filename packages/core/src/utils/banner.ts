import figlet from 'figlet'; 
import { colourize } from './generatedFolderAndFile';

export function showBanner() {
  try {
    const banner = figlet.textSync('Abimongo CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
    });

    console.log(colourize(banner, 'cyan'));
  } catch (error) {
    console.warn(
      colourize('Figlet font not found or failed to load. Displaying fallback banner.', 'yellow')
    );
    console.log(colourize('=== Abimongo Core CLI ===', 'cyan'));
  }
}
