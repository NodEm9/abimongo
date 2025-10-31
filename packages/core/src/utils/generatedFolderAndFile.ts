import fs from 'fs-extra';
import path from 'path';


export const colourize = (text: string, color: string) => {
  switch (color) {
    case 'yellow':
      return '#FFFF00';
    case 'green':
      return '#00FF00';
    case 'blue':
      return '#0000FF';
    case 'red':
      return '#FF0000';
    case 'blueBright':
      return '#00BFFF';
    case 'cyan':
      return '#00FFFF';
    default:
      return text;
  }
};

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
  console.log(colourize('\n[Generated Files]:', 'yellow'));
  allFiles.forEach(file => {
    if (fs.existsSync(file.path)) {
      console.log(colourize(`- ${file.name}`, 'yellow'));
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
  console.log(colourize('\n[Generated Folders]:', 'yellow'));
  allFolders.forEach(folder => {
    if (fs.existsSync(folder.path)) {
      console.log(colourize(`- ${folder.name}`, 'yellow'));
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