import { Command } from 'commander';
import { spawn, spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { AbimongoBootstrap } from '@abimongo/core';
import { colorByLevel } from '@abimongo/logger';

// Instead of requiring the create package (which may execute its CLI
// on import), spawn the create CLI as a child process when delegating
// to the scaffolder. This avoids side-effects from the bundled entry.
// The create package currently produces a bundled entry at dist/index.js.
// Spawn that bundle with the desired subcommand (e.g. 'init').
const createBinRelative = path.join(__dirname, '..', '..', '..', 'create', 'dist', 'index.js');
const createBin = path.resolve(createBinRelative);



/**
 * Run the Abimongo CLI
 * This function is responsible for executing the Abimongo command-line interface.
 */
export default function runCLI() {
  // lightweight banner; defer to create CLI for full UX
  try {
    // Keep the bootstrap/install console banner plain so logs are easy to capture.
    console.log('=== Abimongo CLI ===');
  } catch (e) { }
  // small helper to print green success messages (logger's colorByLevel has no 'success' level)
  const success = (text: string) => {
    const green = '\u001b[32m';
    const reset = '\u001b[0m';
    return `${green}${text}${reset}`;
  };
  const program = new Command();
  program.name('abimongo-cli').description('Abimongo CLI (shim)').version('1.0.0');

  program
    .command('scaffold')
    .description('Scaffold a new Abimongo project')
    .action(() => {
      // Detect package manager and forward via env to the create CLI
      const pkg = detectPackageManager(process.cwd());
      const env = { ...process.env, ABIMONGO_PKG_MGR: pkg };

      // Delegate to the create package CLI (interactive). Use the
      // Node executable to run the bundled create CLI script.
      const child = spawn(process.execPath, [createBin, 'init'], { stdio: 'inherit', env });
      child.on('exit', (code) => {
        // mirror exit code
        process.exit(code ?? 0);
      });
    });

  program
    .command('init [projectName]')
    .description('Initialize a new Abimongo project with Abimongo Core opinionated defaults')
    .option('--with-redis', 'Enable Redis caching', false)
    .option('--with-graphql', 'Enable GraphQL support', false)
    .option('--multi-tenant', 'Enable multi-tenancy', false)
    .option('--enable-logger', 'Enable Abimongo Logger', true)
    .option('--enable-gc', 'Enable garbage collector', false)
    .option('--install', 'Run package manager to install dependencies after init', false)
    .option('--bootstrap', 'Attempt programmatic bootstrap/validation after init (opt-in)', false)
    .option('--mongo-uri <uri>', 'MongoDB connection URI', 'mongodb://localhost:27017')
    .option('--gc-cron <expr>', 'Garbage collector cron expression', '0 0 * * *')
    .action(async (projectName: string | undefined, opts: any) => {
      const name = projectName || opts.projectName || 'abimongo-app';
      const target = path.resolve(process.cwd(), name);
      if (await fs.pathExists(target)) {
        console.error(`Target directory already exists: ${target}`);
        process.exit(1);
      }
      await fs.mkdirp(target);

      // Build a minimal Abimongo config file
      // Normalize option names (commander converts dashed names to camelCase,
      // but some environments or callers might provide different shapes).
      const withRedis = !!(opts.withRedis || opts.withRedis === true);
      const withGraphql = !!(opts.withGraphql || opts.withGraphQL || opts.withGraphql === true);
      const multiTenantFlag = !!(opts.multiTenant || opts.multiTenant === true);
      const enableLoggerFlag = typeof opts.enableLogger === 'boolean' ? opts.enableLogger : !!opts.enable_logger;
      const enableGcFlag = !!(opts.enableGc || opts.enableGC || opts.enable_gc);

      const config = {
        projectName: name,
        mongoUri: opts.mongoUri || 'mongodb://localhost:27017',
        logger: { enabled: !!enableLoggerFlag },
        graphql: { enabled: !!withGraphql },
        features: { useRedisCache: !!withRedis, redisUri: withRedis ? 'redis://localhost:6379' : undefined },
        multiTenant: multiTenantFlag ? { enabled: true, headerKey: 'x-tenant-id', tenants: {} } : undefined,
        advanced: { garbageCollector: { enabled: !!enableGcFlag, logResults: true }, gcCron: opts.gcCron || '0 0 * * *' }
      };

      const configPath = path.join(target, 'abimongo.config.json');
      await fs.writeJson(configPath, config, { spaces: 2 });

      // Minimal package.json that encourages using Abimongo Core and Logger
      const pkg = {
        name: name.toLowerCase().replace(/[^a-z0-9-_]/gi, '-'),
        version: '1.0.0',
        private: false,
        scripts: {
          dev: "node index.js"
        },
        dependencies: {
          '@abimongo/core': 'workspace:*',
          '@abimongo/logger': 'workspace:*'
        }
      };
      await fs.writeJson(path.join(target, 'package.json'), pkg, { spaces: 2 });

      // README
      const readmeLines = [
        `# ${name}`,
        '',
        'This project was initialized with Abimongo CLI.',
        '',
        'This starter uses the Abimongo bootstrap helper exported as `initAbimongo` from `@abimongo/core`.',
        '',
        'Example (src/main.ts):',
        '',
        "import { initAbimongo } from '@abimongo/core';",
        '',
        'async function start() {',
        '  const app = await initAbimongo.create(); // reads ./abimongo.config.json by default',
        '  const db = app.getMongoClient();',
        '  await db?.connect();',
        "  console.log('✅ MongoDB connected');",
        '  // Start optional features based on config (gc, graphql, etc.)',
        '}',
        '',
        'start().catch(console.error);',
        '',
        'Next steps:',
        '',
        `1. cd ${name}`,
        '2. Install dependencies (pnpm install or npm install)',
        '3. Start your app: `node ./dist/src/main.js` (or compile your TypeScript)',
        '',
        'The abimongo config file is at ./abimongo.config.json',
      ];
      const readme = readmeLines.join('\n');
      await fs.writeFile(path.join(target, 'README.md'), readme, 'utf8');

      console.log(`✅ Abimongo project initialized at: ${target}`);
      console.log(`- Configuration written to ${configPath}`);
      console.log(`- package.json created (contains @abimongo/core and @abimongo/logger as dependencies)`);

      // Generate a minimal src/main.ts starter that uses the initAbimongo factory
      try {
        const srcDir = path.join(target, 'src');
        await fs.mkdirp(srcDir);
        const mainLines: string[] = [];
        mainLines.push("import { initAbimongo } from '@abimongo/core';");
        mainLines.push('');
        // minimal color helper used in starter
        mainLines.push('function colorByLevel(level: string, text: string) {');
        mainLines.push("  const codes: Record<string,string> = { info: '\\u001b[32m', warn: '\\u001b[33m', error: '\\u001b[31m' }; ");
        mainLines.push("  const reset = '\\u001b[0m';");
        mainLines.push('  return (codes[level] || "") + text + reset;');
        mainLines.push('}');
        mainLines.push('');
        mainLines.push('async function start() {');
        mainLines.push('  const app = await initAbimongo.create();');
        mainLines.push('  const db = app.getMongoClient();');
        mainLines.push('  await db?.connect();');
        mainLines.push("  console.log(colorByLevel('info', '✅ MongoDB connected'));");
        mainLines.push('');
        mainLines.push('  // Optional: start GC runner if available');
        mainLines.push('  try {');
        mainLines.push('    const gc = app.getGCRunner?.();');
        mainLines.push('    if (gc && typeof gc.start === "function") await gc.start();');
        mainLines.push("    console.log(colorByLevel('info', '♻️  Garbage Collector started.')); ");
        mainLines.push('  } catch (e) { /* ignore optional feature failures */ }');
        mainLines.push('');
        mainLines.push('  // Optional: initialize GraphQL if configured');
        mainLines.push('  try {');
        mainLines.push('    const graphql = await app.getGraphQL?.();');
        mainLines.push('    if (graphql && graphql.generateSchema) console.log(colorByLevel("info", "GraphQL ready (schema generation available)."));');
        mainLines.push('  } catch (e) { /* noop */ }');
        mainLines.push('}');
        mainLines.push('');
        mainLines.push('start().catch(err => {');
        mainLines.push('  console.error(colorByLevel("error", String(err)));');
        mainLines.push('  process.exit(1);');
        mainLines.push('});');

        await fs.writeFile(path.join(srcDir, 'main.ts'), mainLines.join('\n'), 'utf8');
      } catch (e) {
        // Non-fatal if we can't write starter main
        console.warn(`Could not write src/main.ts starter: ${String(e)}`);
      }

      // If user requested auto-install, detect package manager and run it
      if (opts.install) {
        const pkgManager = detectPackageManager(target);
        console.log(`Detected package manager: ${pkgManager}. Running install...`);
        try {
          const installCmd = pkgManager === 'yarn' ? 'yarn' : pkgManager === 'npm' ? 'npm' : 'pnpm';
          const cmd = installCmd === 'yarn' ? 'yarn' : `${installCmd} install`;

          // First attempt: capture output (pipe) to inspect shim behaviour.
          let installer = spawnSync(cmd, { stdio: 'pipe', cwd: target, env: process.env, shell: true });

          // If spawnSync returned an object but status is null (spawn failed to execute),
          // retry using inherited stdio so the shell can surface errors and the exit code.
          if (installer && installer.status === null) {
            console.warn('Installer returned null status on first attempt; retrying with live stdio...');
            installer = spawnSync(cmd, { stdio: 'inherit', cwd: target, env: process.env, shell: true });
          }

          if (!installer) {
            console.error('Installer did not return a result object.');
            process.exit(1);
          }

          // If we captured stdout/stderr, print them
          try {
            if (installer.stdout && installer.stdout.length) process.stdout.write(installer.stdout);
            if (installer.stderr && installer.stderr.length) process.stderr.write(installer.stderr);
          } catch (e) { /* ignore stream write errors */ }

          if (installer.error) {
            console.error(`Package install process spawn failed: ${installer.error}`);
            process.exit(1);
          }

          if (installer.status === null || installer.status !== 0) {
            console.error(`Installer result indicates failure: ${installer.status}`);
            console.error(`Package install failed (exit ${installer.status}). Please run the install manually in ${target}.`);
            process.exit(installer.status ?? 1);
          }

          console.log('Dependencies installed.');
        } catch (err) {
          console.error(`Failed to run package manager install: ${err}`);
          console.log(`Please cd ${name} and run pnpm install (or npm install).`);
          process.exit(1);
        }
      } else {
        console.log('\nTo finish:');
        console.log(`  cd ${name}`);
        console.log('  pnpm install    # or npm install');
        console.log('  # Customize abimongo.config.json as needed then start your app');
      }

      // Programmatic bootstrap is opt-in: only run if user explicitly requests it.
      if (opts.bootstrap) {
        try {
          console.log('\nBootstrapping Abimongo programmatically to validate configuration...');
          // Normalize the written config to ensure expected shapes (avoid boolean vs object field mismatches)
          try {
            const raw = await fs.readJson(configPath);
            const normalized = normalizeConfig(raw);
            await fs.writeJson(configPath, normalized, { spaces: 2 });
          } catch (e) {
            console.warn(colorByLevel('warn', `Failed to normalize config prior to bootstrap: ${String(e)}`));
          }

          // Use AbimongoBootstrap directly and point it at the generated config file
          const abimongo = new AbimongoBootstrap();
          const cfgPathResolved = path.resolve(configPath);
          await abimongo.initialize(cfgPathResolved);
          console.log(success('✅ Abimongo initialized successfully (connections established where possible).'));
          try {
            const client = abimongo.getMongoClient();
            if (client && typeof client.disconnect === 'function') {
              await client.disconnect();
            }
          } catch (e) {
            // ignore cleanup errors
          }
        } catch (err) {
          console.warn(colorByLevel('warn', '⚠️  Abimongo programmatic initialization failed (this is non-fatal).'));
          console.warn(colorByLevel('error', String(err)));
          console.log(colorByLevel('info', `If you want to run it manually, cd ${name} and run node your-start-script after installing dependencies.`));
        }
      } else {
        console.log('\nProgrammatic bootstrap skipped by default. To validate the generated project now, re-run with --bootstrap');
      }

      process.exit(0);
    });

  program.parse(process.argv);
}

/**
 * Detect a reasonable package manager to use in the given directory.
 * Strategy:
 *  - prefer lockfile if present (pnpm-lock.yaml, yarn.lock, package-lock.json)
 *  - fall back to checking availability of commands on PATH (pnpm, yarn, npm)
 */
function detectPackageManager(cwd: string): 'pnpm' | 'npm' | 'yarn' {
  try {
    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(cwd, 'package-lock.json'))) return 'npm';
  } catch (e) {
    // ignore
  }

  // fallback: prefer pnpm if available, then yarn, then npm
  try {
    const r = spawnSync('pnpm', ['--version'], { stdio: 'ignore' });
    if (r.status === 0) return 'pnpm';
  } catch (e) { }
  try {
    const r = spawnSync('yarn', ['--version'], { stdio: 'ignore' });
    if (r.status === 0) return 'yarn';
  } catch (e) { }
  return 'npm';
}

/**
 * Ensure some config fields are objects (not booleans) and provide defaults
 * to avoid runtime initialization errors in AbimongoBootstrap.
 */
function normalizeConfig(cfg: any) {
  const out = { ...(cfg || {}) } as any;
  if (typeof out.logger === 'boolean') out.logger = { enabled: out.logger };
  if (!out.logger) out.logger = { enabled: false };
  if (typeof out.graphql === 'boolean') out.graphql = { enabled: out.graphql };
  if (!out.graphql) out.graphql = { enabled: false };
  if (!out.features) out.features = { useRedisCache: false };
  if (typeof out.features.useRedisCache === 'undefined') out.features.useRedisCache = false;
  if (!out.advanced) out.advanced = { garbageCollector: { enabled: false, logResults: true }, gcCron: '0 0 * * *' };
  if (!out.advanced.garbageCollector) out.advanced.garbageCollector = { enabled: false, logResults: true };
  return out;
}
