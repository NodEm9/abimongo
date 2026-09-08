/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
const { execFileSync } = require("child_process");
const path = require('path');
const fs = require("fs");



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




// const ROOT = path.resolve(__dirname, "..");
// const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

// function run(cmd, args) {
//   console.log(`Running: ${cmd} ${args.join(" ")}`);
//   execFileSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
// }

// function runBuildOrder() {
//   run(PNPM, ["--filter", "@abimongo/logger", "run", "build"]);
//   run(PNPM, ["--filter", "@abimongo/adapter-types", "run", "build"]);
//   run(PNPM, ["--filter", "@abimongo/core", "run", "build"]);

//   // adapters wildcard
//   run(PNPM, ["--filter", "@abimongo/adapter-*", "--filter", "!@abimongo/adapter-types", "run", "build"]);

//   run(PNPM, ["--filter", "@abimongo/cli", "run", "build"]);
//   run(PNPM, ["--filter", "@abimongo/create", "run", "build"]);

//   console.log("\n✅ All builds completed successfully!");
// }

// const args = process.argv.slice(2);
// if (args.includes("--build")) runBuildOrder();
// else console.log("No --build flag provided. Skipping build order execution.");


const ROOT = path.resolve(__dirname, "..");
const PNPM = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const IS_CI = String(process.env.CI || "").toLowerCase() === "true";

const DEFAULT_CONCURRENCY = IS_CI ? 4 : 1;
const CONCURRENCY = Number(process.env.PNPM_WORKSPACE_CONCURRENCY || DEFAULT_CONCURRENCY);

function runPnpm(args, { capture = false } = {}) {
  console.log(`\n▶ ${PNPM} ${args.join(" ")}`);
  const t0 = Date.now();
  const out = execFileSync(PNPM, args, {
    cwd: ROOT,
    stdio: capture ? "pipe" : "inherit",
    encoding: capture ? "utf8" : undefined,
  });
  return { out, ms: Date.now() - t0 };
}

// function toFilterArgs(filters) {
//   const args = [];
//   // for (const f of filters) args.push("--filter", f);
//   for (const f of filters) {
//     if (f.startsWith("--filter=") || f.startsWith("-F=")) args.push(f);
//     else args.push("--filter", f);
//   }
//   return args;
// }


function toFilterArgs(filters) {
  const out = [];
  for (const f of filters) out.push("--filter", f);
  return out;
}

function listMatchedPackages(filters, label) {
  const { out } = runPnpm(
    [...toFilterArgs(filters), "list", "--depth", "-1", "--json"],
    { capture: true }
  );

  let parsed;
  try {
    parsed = JSON.parse(out);
  } catch (e) {
    throw new Error(
      `Failed to parse pnpm list --json output for ${label}.\nRaw:\n${String(out).slice(0, 500)}`
    );
  }

  const items = Array.isArray(parsed) ? parsed : [];
  const pkgs = items
    .map((p) => ({
      name: p?.name,
      // pnpm uses "path" in many versions; some use "dir"
      dir: p?.path || p?.dir || p?.location,
    }))
    .filter((p) => p.name && p.dir);

  if (!pkgs.length) {
    throw new Error(`Filter matched 0 packages: ${label}\nFilters: ${filters.join(", ")}`);
  }

  console.log(
    `✅ Matched (${pkgs.length}) for ${label}: ${pkgs.map((p) => p.name).join(", ")}`
  );

  // sanity: ensure dirs exist
  const missingDirs = pkgs.filter((p) => !fs.existsSync(p.dir));
  if (missingDirs.length) {
    throw new Error(
      `pnpm returned non-existing dirs for: ${missingDirs
        .map((p) => `${p.name} -> ${p.dir}`)
        .join(", ")}`
    );
  }

  return pkgs;
}


function rimraf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

function ensureDist(pkgName, pkgDir) {
  const dist = path.join(pkgDir, "dist");
  if (!fs.existsSync(dist)) {
    throw new Error(`${pkgName}: dist/ missing (${path.relative(ROOT, dist)})`);
  }
  const entries = fs.readdirSync(dist);
  if (!entries.length) {
    throw new Error(`${pkgName}: dist/ empty (${path.relative(ROOT, dist)})`);
  }
}

function expectedOutputsFromPkgJson(pkgDir) {
  const pkgJsonPath = path.join(pkgDir, "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));

  const outs = new Set();

  // main/module are common
  if (pkg.main) outs.add(pkg.main);
  if (pkg.module) outs.add(pkg.module);
  if (pkg.types) outs.add(pkg.types);

  // exports can be string or object
  const exp = pkg.exports;
  if (typeof exp === "string") outs.add(exp);
  else if (exp && typeof exp === "object") {
    const walk = (v) => {
      if (!v) return;
      if (typeof v === "string") outs.add(v);
      else if (typeof v === "object") for (const x of Object.values(v)) walk(x);
    };
    walk(exp);
  }

  // Normalize to paths (drop leading ./)
  return [...outs].map((p) => String(p).replace(/^\.\//, ""));
}

function ensureBuildOutput(pkgName, pkgDir) {
  const outs = expectedOutputsFromPkgJson(pkgDir);

  // If package.json doesn't declare outputs, fall back to dist/
  const candidates = outs.length ? outs : ["dist"];

  const ok = candidates.some((rel) => fs.existsSync(path.join(pkgDir, rel)));
  if (!ok) {
    throw new Error(
      `${pkgName}: build output missing. Expected one of: ${candidates.join(
        ", "
      )} (in ${pkgDir})`
    );
  }
}

function assertValidFilters(filters) {
  const bad = filters.filter((f) => {
    const s = String(f).trim();
    return (
      s === "" ||
      s.startsWith("--exclude") ||
      s.startsWith("--excluding") ||
      s === "run" ||
      s.startsWith("run ") ||
      s.includes(" run ") ||
      s.includes(" build") ||   // catches "run build"
      s === "build"
    );
  });

  if (bad.length) {
    throw new Error(
      `Invalid entries in filters array (filters must contain only pnpm selectors): ${bad.join(
        ", "
      )}`
    );
  }
};

function listPackageNames(filters, label) {
  const { out } = runPnpm([...toFilterArgs(filters), "list", "--depth", "-1", "--json"], { capture: true });
  const parsed = JSON.parse(out);
  const names = (Array.isArray(parsed) ? parsed : [])
    .map((p) => p?.name)
    .filter(Boolean);

  if (!names.length) {
    throw new Error(`Filter matched 0 packages: ${label}`);
  }
  return names;
}

// function runPnpmInDir(pkgDir, args, { capture = false } = {}) {
//   console.log(`\n▶ ${PNPM} ${args.join(" ")} (cwd=${pkgDir})`);
//   const t0 = Date.now();
//   const out = execFileSync(PNPM, args, {
//     cwd: pkgDir,
//     stdio: capture ? "pipe" : "inherit",
//     encoding: capture ? "utf8" : undefined,
//   });
//   return { out, ms: Date.now() - t0 };
// }

function runPnpmInDir(pkgDir, args, { capture = false } = {}) {
  console.log(`\n▶ ${PNPM} ${args.join(" ")} (cwd=${pkgDir})`);
  const t0 = Date.now();

  try {
    const out = execFileSync(PNPM, args, {
      cwd: pkgDir,
      stdio: capture ? "pipe" : "inherit",
      encoding: "utf8",
    });

    return { out: capture ? out : "", ms: Date.now() - t0 };
  } catch (err) {
    // Show the real pnpm output (this is what you’re missing)
    const stdout = err?.stdout ? err.stdout.toString("utf8") : "";
    const stderr = err?.stderr ? err.stderr.toString("utf8") : "";

    if (stdout.trim()) console.error(`\n--- ${PNPM} STDOUT ---\n${stdout}`);
    if (stderr.trim()) console.error(`\n--- ${PNPM} STDERR ---\n${stderr}`);

    // Re-throw with context
    const code = err?.status ?? err?.code;
    throw new Error(
      `Command failed (code=${code}) in ${pkgDir}: ${PNPM} ${args.join(" ")}`
    );
  }
}

function buildGroup(filters, label, { clean, verify, concurrency }) {
  assertValidFilters(filters);
  const pkgs = listMatchedPackages(filters, label); // must return [{name, dir}]

  console.log(`✅ Matched (${pkgs.length}) for ${label}: ${pkgs.map(p => p.name).join(", ") || "(none)"}`);
  if (!pkgs.length) return { ms: 0, count: 0 };

  const t0 = Date.now();

  // Optional clean
  if (clean) {
    console.log(`🧹 Cleaning dist/ for ${pkgs.length} package(s)...`);
    for (const p of pkgs) {
      if (!p?.dir) throw new Error(`${label}: missing dir for ${p?.name}`);
      rimraf(path.join(p.dir, "dist"));
    }
  }

  // Build sequentially (or with a simple concurrency pool if you want)
  // Keep it deterministic: CI-friendly
  for (const p of pkgs) {
    // This guarantees we run the package's own script in the right cwd
    const { out } = runPnpmInDir(p.dir, ["run", "build"], { capture: true });

    const text = String(out ?? "");
    if (/Missing script: build/i.test(text) || /Command "build" not found/i.test(text)) {
      throw new Error(`${p.name}: has no "build" script in package.json`);
    }
  }

  const ms = Date.now() - t0;

  // Verify
  if (verify) {
    console.log("🔎 Verifying dist/ ...");
    for (const p of pkgs) ensureDist(p.name, p.dir); // or your ensureBuildOutput
    console.log("✅ dist/ verification passed.");
  }

  return { ms, count: pkgs.length };
}

function formatMs(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

// function buildExplicitPackages(pkgs, label, { clean, verify }) {
//   if (!pkgs.length) throw new Error(`${label}: no packages to build`);

//   // Build args: pnpm -r --filter <pkg1> --filter <pkg2> ... build
//   const filters = pkgs.map((p) => `--filter=${p}`);

//   if (clean || verify) {
//     // resolve dirs from pnpm list by name one by one is heavy;
//     // since you only verify dist, you can verify via pnpm list --json for each package,
//     // or keep your existing list-with-dirs approach. For now, keep build-only deterministic.
//   }

//   return runPnpm(["-r", ...filters, "--sort", "--workspace-concurrency", String(CONCURRENCY), "build"]);
// }
function buildExplicitPackages(pkgs, label, { clean, verify, concurrency }) {
  if (!pkgs.length) return { ms: 0, count: 0 };

  // Convert ["@a/x","@a/y"] -> ["--filter","@a/x","--filter","@a/y"]
  const filters = [];
  for (const p of pkgs) {
    filters.push("--filter", p);
  }

  // (optional) clean/verify: you can resolve dirs via list --json if needed later

  const { ms } = runPnpm([
    "-r",
    ...filters,
    "--sort",
    "--workspace-concurrency",
    String(concurrency ?? CONCURRENCY),
    "run",
    "build",
  ]);

  return { ms, count: pkgs.length };
}


function parseArgs(argv) {
  const flags = new Set(argv);
  const get = (k) => {
    const i = argv.indexOf(k);
    return i === -1 ? null : argv[i + 1] || null;
  };
  return {
    build: flags.has("--build"),
    clean: flags.has("--clean"),
    verify: flags.has("--verify"),
    concurrency: Number(get("--concurrency") || CONCURRENCY),
  };
}

// function main() {
//   const opts = parseArgs(process.argv.slice(2));
//   if (!opts.build) {
//     console.log("Usage: node scripts/build-all.js --build --clean --verify");
//     process.exit(0);
//   }

//   console.log(`\n🔧 Mode: ${IS_CI ? "CI" : "Local"} | Concurrency: ${CONCURRENCY}`);
//   console.log(`Flags: clean=${opts.clean} verify=${opts.verify}`);


//   // 1) Build adapter-types explicitly (once)
//   runPnpm(["-r", "--filter=@abimongo/adapter-types", "--sort", String(CONCURRENCY), "build"]);

//   // 2) Compute adapters list, then remove adapter-types, then build only remaining
//   const adapterPkgs = listPackageNames(["@abimongo/adapter-*"], "all adapters");
//   const adapterPkgsWithoutTypes = adapterPkgs.filter((n) => n !== "@abimongo/adapter-types");

//   console.log(`✅ Adapters excluding adapter-types: ${adapterPkgsWithoutTypes.join(", ")}`);



//   const summary = [];

//   const steps = [
//     { label: "@abimongo/logger", filters: ["@abimongo/logger"] },
//     { label: "@abimongo/adapter-types", filters: ["@abimongo/adapter-types"] },
//     { label: "@abimongo/core", filters: ["@abimongo/core"] },
//     {
//       label: "adapters (@abimongo/adapter-* excluding adapter-types)",
//       filters: ["@abimongo/adapter-*", "-filter=@abimongo/adapter-types"],
//     },
//     { label: "@abimongo/cli", filters: ["@abimongo/cli"] },
//     { label: "@abimongo/create", filters: ["@abimongo/create"] },
//   ];

//   for (const s of steps) {
//     const r =   buildExplicitPackages(adapterPkgsWithoutTypes, "adapters (excluding adapter-types)", { clean: opts.clean, verify: opts.verify });
//       // buildGroup(s.filters, s.label, { clean: opts.clean, verify: opts.verify });
//     summary.push({ label: s.label, ...r });
//   }

//   console.log("\n================ Build Summary ================");
//   for (const s of summary) console.log(`✓ ${s.label}  (${s.count} pkg)  ${formatMs(s.ms)}`);
//   console.log("==============================================\n");
//   console.log("✅ All builds completed successfully!");
// }

function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.build) {
    console.log("Usage: node scripts/build-all.js --build --clean --verify");
    process.exit(0);
  }

  console.log(`\n🔧 Mode: ${IS_CI ? "CI" : "Local"} | Concurrency: ${opts.concurrency}`);
  console.log(`Flags: clean=${opts.clean} verify=${opts.verify}`);

  const summary = [];

  // logger
  summary.push({
    label: "@abimongo/logger",
    ...buildGroup(["@abimongo/logger"], "@abimongo/logger", opts),
  });

  // adapter-types (once)
  summary.push({
    label: "@abimongo/adapter-types",
    ...buildGroup(["@abimongo/adapter-types"], "@abimongo/adapter-types", "adapters", opts),
  });

  // core
  summary.push({
    label: "@abimongo/core",
    ...buildGroup(["@abimongo/core"], "@abimongo/core", opts),
  });

  // adapters excluding adapter-types (once)
  const adapterPkgs = listPackageNames(["@abimongo/adapter-*", "!@abimongo/adapter-types"], "all adapters");
  const adapterPkgsWithoutTypes = adapterPkgs.filter((n) => n !== "@abimongo/adapter-types");

  console.log(`✅ Adapters excluding adapter-types: ${adapterPkgsWithoutTypes.join(", ") || "(none)"}`);

  summary.push({
    label: "adapters (@abimongo/adapter-* excluding adapter-types)",
    ...buildExplicitPackages(adapterPkgsWithoutTypes, "adapters (excluding adapter-types)", opts),
  });

  // cli
  summary.push({
    label: "@abimongo/cli",
    ...buildGroup(["@abimongo/cli"], "@abimongo/cli", opts),
  });

  // create
  summary.push({
    label: "@abimongo/create",
    ...buildGroup(["@abimongo/create"], "@abimongo/create", opts),
  });

  console.log("\n================ Build Summary ================");
  for (const s of summary) console.log(`✓ ${s.label}  (${s.count} pkg)  ${formatMs(s.ms)}`);
  console.log("==============================================\n");
  console.log("✅ All builds completed successfully!");
}

try {
  main();
} catch (e) {
  console.error("\n❌ Build failed:");
  console.error(e?.stack || e);
  process.exit(1);
}

