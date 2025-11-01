import fs from 'fs-extra';
import path from 'path';
import { colorByLevel } from '@abimongo/logger';


type GeneratedFolderAndFile = {
  name: string;
  path: string;
}

const configPath = path.join(process.cwd(), 'abimongo.config.json');
const mainTSPath = path.join(process.cwd(), 'src', 'main.ts');
const projectRoot = path.resolve(process.cwd(), 'abimongo-app');

const generatedFiles = () => {
  const allFiles: GeneratedFolderAndFile[] = [
    { name: 'abimongo.config.json', path: configPath },
    { name: 'src/main.ts', path: mainTSPath },
    { name: 'src/gc/gcManager.ts', path: path.join(projectRoot, 'src', 'gc', 'gcManager.ts') },
    { name: 'scripts/runGC.ts', path: path.join(projectRoot, 'scripts', 'runGC.ts') },
  ]
  
  // Log all generated files
  console.log(colorByLevel('info', '\n[Generated Files]:'));
  
  allFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const colorConsole = colorByLevel( 'info', `- ${file.name}`)
      console.log(colorConsole);
    }
  });
}


const generatedFolders = () => {
  const allFolders: GeneratedFolderAndFile[] = [
    { name: 'src/', path: path.join(projectRoot, 'src') },
    { name: 'src/gc/', path: path.join(projectRoot, 'src', 'gc') },
    { name: 'scripts/', path: path.join(projectRoot, 'scripts') },
  ]
  // Log all generated folders
  console.log(colorByLevel( 'info', '\n[Generated Folders]:'));
  allFolders.forEach(folder => {
    if (fs.existsSync(folder.path)) {
      console.log(colorByLevel( 'info', `- ${folder.name}`));
    }
  });
}

const foldersAndFiles = () => {
	return {
		generatedFolders,
		generatedFiles
	};
}

export { foldersAndFiles };