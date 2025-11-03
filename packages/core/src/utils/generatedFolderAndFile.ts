import fs from 'fs-extra';
import path from 'path';
import { colorize } from './color-palatte';


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
  console.log(colorize('\n[Generated Files]:', 'blue'));
  
  allFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      const colorConsole = colorize(`- ${file.name}`, 'blue');
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
  console.log(colorize('\n[Generated Folders]:', 'blue'));
  allFolders.forEach(folder => {
    if (fs.existsSync(folder.path)) {
      console.log(colorize(`- ${folder.name}`, 'blue'));
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