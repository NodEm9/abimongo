import fs from 'fs-extra';
import path from 'path';
import { colorize } from './color-palatte';

type GeneratedFile = {
  name: string;
}


const generatedFiles = () => {
  const allFiles: GeneratedFile[] = [
    { name: './abimongo.config.json' },
    { name: 'src/main.ts' },
    { name: 'src/gc/gcManager.ts' },
    { name: 'scripts/runGC.ts' },
  ];

  allFiles.forEach(file =>  file.name = path.normalize(file.name));
  
  return allFiles;
}

const foldersAndFiles = () => {
  const fileName = generatedFiles();
  const projectDir = [...fileName.map(f => `+ ${colorize(f.name, 'green')}`)]
    .join('\n');
  console.log(colorize(`[Generated Files]:\n`, 'cyan') + projectDir);
  return { projectDir };
}

export { foldersAndFiles };