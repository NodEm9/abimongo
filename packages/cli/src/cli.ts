import { Command } from 'commander';
import { spawn } from 'child_process';
import path from 'path';

// Instead of requiring the create package (which may execute its CLI
// on import), spawn the create CLI as a child process when delegating
// to the scaffolder. This avoids side-effects from the bundled entry.
// The create package currently produces a bundled entry at dist/index.js.
// Spawn that bundle with the desired subcommand (e.g. 'init').
const createBinRelative = path.join(__dirname, '..', '..', '..', 'create', 'dist', 'index.js');
const createBin = path.resolve(createBinRelative);

export default function runCLI() {
  // lightweight banner; defer to create CLI for full UX
  try {
    // Attempt to show a simple banner
    console.log('=== Abimongo CLI ===');
  }
  catch (e) { }
  const program = new Command();
  program.name('abimongo-cli').description('Abimongo CLI (shim)').version('1.0.0');

  program
    .command('scaffold')
    .description('Scaffold a new Abimongo project')
    .action(() => {
      // Delegate to the create package CLI (interactive). Use the
      // Node executable to run the bundled create CLI script.
      const child = spawn(process.execPath, [createBin, 'init'], { stdio: 'inherit' });
      child.on('exit', (code) => {
        // mirror exit code
        process.exit(code ?? 0);
      });
    });

  program.parse(process.argv);
}
