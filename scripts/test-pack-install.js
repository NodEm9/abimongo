#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function run(cmd, args, opts = {}) {
	console.log('>', cmd, args.join(' '));
	const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
	if (res.error) throw res.error;
	if (res.status !== 0) throw new Error(`${cmd} ${args.join(' ')} exited ${res.status}`);
}

async function main() {
	const repoRoot = path.resolve(__dirname, '..');
	const pkgDir = path.join(repoRoot, 'packages', 'core');

	// 1) pack the package
	run('pnpm', ['pack'], { cwd: pkgDir });

	// find the tarball
	const files = fs.readdirSync(pkgDir);
	const tar = files.find((f) => f.endsWith('.tgz'));
	if (!tar) throw new Error('pack tarball not found');
	const tarPath = path.join(pkgDir, tar);

	// 2) create a temp consumer dir and test `npm install` and `pnpm add`
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'abimongo-test-'));
	console.log('Using temp dir', tmp);
	fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'abimongo-test', version: '0.0.0' }));

	// npm install
	try {
		run('npm', ['install', tarPath], { cwd: tmp });
		console.log('npm install succeeded');
	} catch (e) {
		console.error('npm install failed:', e && e.message);
	}

	// pnpm add
	try {
		run('pnpm', ['add', tarPath], { cwd: tmp });
		console.log('pnpm add succeeded');
	} catch (e) {
		console.error('pnpm add failed:', e && e.message);
	}

	console.log('Test completed. Temp dir:', tmp);
}

main().catch((e) => {
	console.error(e && e.stack ? e.stack : e);
	process.exit(1);
});
