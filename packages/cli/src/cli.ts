import { Command } from 'commander';
import { promptProjectOptions } from '../../create/src/prompts/projectPrompts';
import { generateProject } from '../../create/src/generators/projectGenerator';
import { showBanner } from '../../create/src/utils/banner';

export default function runCLI() {
  showBanner();
  const program = new Command();
  program.name('abimongo-cli').description('Abimongo CLI (shim)').version('1.0.0');

  program
    .command('scaffold')
    .description('Scaffold a new Abimongo project')
    .action(async () => {
      const options = await promptProjectOptions();
      await generateProject(options);
    });

  program.parse(process.argv);
}
