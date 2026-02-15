/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { execSync } = require('child_process');
/* eslint-disable @typescript-eslint/no-require-imports */
const { execFileSync } = require("child_process");
const path = require('path');

// function runBuildOrder() {
// 	const buildOrder = [
// 		'pnpm --filter @abimongo/logger build',
// 		'pnpm --filter @abimongo/adapter-types build',
// 		'pnpm --filter @abimongo/core build',
// 		'pnpm --filter "@abimongo/adapter-*" --exclude "@abimongo/adapter-types" run build',
// 		'pnpm --filter @abimongo/cli build',
// 		'pnpm --filter @abimongo/create build'
// 	];

// 	buildOrder.forEach((command) => {
// 		console.log(`Running: ${command}`);
// 		try {
// 			execSync(command,
// 				{
// 					cwd: path.resolve(__dirname, '..'),
// 					stdio: 'inherit',
// 					shell: true
// 				},
// 			);
// 		} catch (err) {
// 			console.error(`Failed to execute ${command}:`, err);
// 			process.exit(1);
// 		}
// 	});
// 	console.log('\n✅ All builds completed successfully!');
// };

// const args = process.argv.slice(2);
// if (args.includes('--build')) {
// 	runBuildOrder();
// } else {
// 	console.log('No --build flag provided. Skipping build order execution.');
// }




const ROOT = path.resolve(__dirname, "..");
const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(cmd, args) {
  console.log(`Running: ${cmd} ${args.join(" ")}`);
  execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
}

function runBuildOrder() {
  run(PNPM, ["--filter", "@abimongo/logger", "run", "build"]);
  run(PNPM, ["--filter", "@abimongo/adapter-types", "run", "build"]);
  run(PNPM, ["--filter", "@abimongo/core", "run", "build"]);

  // adapters wildcard
  run(PNPM, ["--filter", "@abimongo/adapter-*", "--filter", "!@abimongo/adapter-types", "run", "build"]);

  run(PNPM, ["--filter", "@abimongo/cli", "run", "build"]);
  run(PNPM, ["--filter", "@abimongo/create", "run", "build"]);

  console.log("\n✅ All builds completed successfully!");
}

const args = process.argv.slice(2);
if (args.includes("--build")) runBuildOrder();
else console.log("No --build flag provided. Skipping build order execution.");
