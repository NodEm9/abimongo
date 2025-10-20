/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs-extra'
import path from 'path';
import chalk from 'chalk';
import {
  DEFAULT_CONFIG_CONTENT,
  generateMainTS,
  generateGCManager,
  generateGCRunner,
  generateAppStructure,
} from '../templates';
import { foldersAndFiles } from '../utils';
import { AbimongoConfig, ProjectOptions } from '../types';


export async function generateProject(options: AbimongoConfig) {
  const projectRoot = path.resolve(process.cwd(), options.projectName || 'abimongo-app');
  // const allFoldersAndFiles = foldersAndFiles();
  const { generatedFolders, generatedFiles } = foldersAndFiles();

  setInterval(() => {
    // Keep the process alive
    console.log(chalk.blue(`[Preparing Process]: \nGenerating project at - ${projectRoot}`));
  }, 1000);
  console.log(chalk.blue.bold('[Process Started]: This may take a few moments...'));

  await generateAppStructure(projectRoot, options);

  const configPath = path.join(projectRoot, 'abimongo.config.json');
  const configContent = DEFAULT_CONFIG_CONTENT(options);
  await fs.writeFile(configPath, configContent, 'utf8');
  console.log(chalk.green(`✓ [Config file]: Config generated - abimongo.config.json`));


  // Create src directory if it doesn't exist
  setupGarbageCollector(options, projectRoot);

  // console.log(chalk.green(`✓ [Garbage Collector]: GC Manager and Runner scripts created.`));

  const mainTSPath = path.join(projectRoot, 'src', 'main.ts');
  const mainTSContent = generateMainTS(options);
  await fs.outputFile(mainTSPath, mainTSContent);
  console.log(chalk.green(`✓ [Entry point]: Entry point created - src/main.ts`));

  const completedFilePath = path.join(projectRoot, 'PROJECT_GENERATION_COMPLETED.txt');
  await fs.writeFile(completedFilePath, 'Project generation completed successfully.', 'utf8');

  // Log generated folders and files
  generatedFolders();
  generatedFiles();

  // allFoldersAndFiles.generatedFolders();
  // allFoldersAndFiles.generatedFiles();

  console.log(chalk.green.bold('[Completed]: \nProject generation completed successfully!'));
}

export async function generateProjectWithConfig(config: AbimongoConfig) {
  const options: ProjectOptions = {
    projectName: config.projectName || 'abimongo-app',
    mongoUri: config.mongoUri,
    graphql: config.graphql,
    features: config.features,
    multiTenant: config.multiTenant,
    logger: config.logger?.enabled ? config.logger : undefined,
    // advanced: config.advanced,
  };

  await generateProject(options);
}

function setupGarbageCollector(config: AbimongoConfig, projectRoot: string) {
  if (!config.advanced?.garbageCollector) return;

  const gcDir = path.join(projectRoot, 'src', 'gc');
  const scriptsDir = path.join(projectRoot, 'scripts');

  fs.mkdirSync(gcDir, { recursive: true });
  fs.mkdirSync(scriptsDir, { recursive: true });

  fs.writeFileSync(
    path.join(gcDir, 'gcManager.ts'),
    generateGCManager()
  );

  fs.writeFileSync(
    path.join(scriptsDir, 'runGC.ts'),
    generateGCRunner()
  );
  console.log(chalk.green(`✓ [Garbage Collector]: 🧹 GC Manager and Runner scripts created.`));
  if (config.advanced?.garbageCollector.enabled) {
    console.log(chalk.green(`✓ [Garbage Collector]: 🧹 GC is enabled.`));
  }
}

