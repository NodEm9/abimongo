#!/usr/bin/env node
import { Command } from 'commander';
import { promptProjectOptions } from '../src/prompts/projectPrompts';
import { generateProject } from '../src/generators/projectGenerator';
import { showBanner } from '../src/utils/banner';
// import { runGCCommand } from '../src/templates';

showBanner();

const program = new Command();

function initProject() {
  program
    .name('abimongo-scaffold')
    .description('CLI to scaffold fullstack projects using Abimongo_Core')
    .version('1.0.0');

  program
  .command('gc:run')
  .description('Run Abimongo Garbage Collector')
  // .action(runGCCommand);

  program
    .command('init')
    .description('Initialize a new project')
    .action(async () => {
      const options = await promptProjectOptions();
      await generateProject(options);
    });

  program.parse(process.argv);
}

export default initProject;