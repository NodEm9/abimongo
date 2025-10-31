import { Command } from 'commander';
import { spawn, spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { AbimongoBootstrap } from '@abimongo/core';

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
          '@abimongo/core': 'workspace:^1.0.0',
          '@abimongo/logger': 'workspace:^1.0.0'
        }
      };
      await fs.writeJson(path.join(target, 'package.json'), pkg, { spaces: 2 });

      // README
      const readme = `# ${name}\n\nThis project was initialized with Abimongo CLI.\n\nNext steps:\n\n1. cd ${name}\n2. Install dependencies (pnpm install or npm install)\n3. Start your app (see README.md)\n\nThe abimongo config file is at ./abimongo.config.json`;
      await fs.writeFile(path.join(target, 'README.md'), readme, 'utf8');

      console.log(`✅ Abimongo project initialized at: ${target}`);
      console.log(`- Configuration written to ${configPath}`);
      console.log(`- package.json created (contains @abimongo/core and @abimongo/logger as dependencies)`);

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
            console.error('Package install process spawn failed:', installer.error);
            process.exit(1);
          }

          if (installer.status === null || installer.status !== 0) {
            console.error('Installer result indicates failure:', installer.status);
            console.error(`Package install failed (exit ${installer.status}). Please run the install manually in ${target}.`);
            process.exit(installer.status ?? 1);
          }

          console.log('Dependencies installed.');
        } catch (err) {
          console.error('Failed to run package manager install:', err);
          console.log(`Please cd ${name} and run pnpm install (or npm install).`);
          process.exit(1);
        }
      } else {
        console.log('\nTo finish:');
        console.log(`  cd ${name}`);
        console.log('  pnpm install    # or npm install');
        console.log('  # Customize abimongo.config.json as needed then start your app');
      }

      // Primary path: try to programmatically initialize Abimongo using core API.
      try {
        console.log('\nBootstrapping Abimongo programmatically to validate configuration...');
        // Normalize the written config to ensure expected shapes (avoid boolean vs object field mismatches)
        try {
          const raw = await fs.readJson(configPath);
          const normalized = normalizeConfig(raw);
          await fs.writeJson(configPath, normalized, { spaces: 2 });
        } catch (e) {
          console.warn('Failed to normalize config prior to bootstrap:', String(e));
        }

        // Use AbimongoBootstrap directly and point it at the generated config file
        const abimongo = new AbimongoBootstrap();
        const cfgPathResolved = path.resolve(configPath);
        await abimongo.initialize(cfgPathResolved);
        // If initialization succeeded, print helpful status and then close any connections.
        console.log('✅ Abimongo initialized successfully (connections established where possible).');
        // Try to gracefully close mongo connection if exposed
        try {
          const client = abimongo.getMongoClient();
          if (client && typeof client.disconnect === 'function') {
            await client.disconnect();
          }
        } catch (e) {
          // ignore cleanup errors
        }
      } catch (err) {
        console.warn('⚠️  Abimongo programmatic initialization failed (this is non-fatal).');
        console.warn(String(err));
        console.log(`If you want to run it manually, cd ${name} and run node your-start-script after installing dependencies.`);
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
