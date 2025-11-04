import type { Metric } from './types';

function safeEncode(pkg: string) {
	// npm API expects encoded package names for scoped packages
	return encodeURIComponent(pkg);
}

async function fetchPoint(pkg: string, range: 'last-week' | 'last-month' | 'last-year') {
	const url = `https://api.npmjs.org/downloads/point/${range}/${safeEncode(pkg)}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`npm API ${res.status} ${res.statusText}`);
	const j = await res.json();
	// expected shape: { downloads: number, start: string, end: string, package: string }
	return (j && typeof j.downloads === 'number') ? j.downloads : 0;
}

// Return metrics for packages: weekly, monthly, yearly totals
export async function fetchNpmDownloads(pkgs: string[]): Promise<Metric[]> {
	const out: Metric[] = [];
	await Promise.all(pkgs.map(async (pkg) => {
		try {
			const [week, month, year] = await Promise.all([
				fetchPoint(pkg, 'last-week'),
				fetchPoint(pkg, 'last-month'),
				fetchPoint(pkg, 'last-year'),
			]);
			out.push({ id: `npm:${pkg}:week`, label: `${pkg} — last week`, value: week, unit: 'downloads', description: `Weekly downloads for ${pkg}` });
			out.push({ id: `npm:${pkg}:month`, label: `${pkg} — last month`, value: month, unit: 'downloads', description: `Monthly downloads for ${pkg}` });
			out.push({ id: `npm:${pkg}:year`, label: `${pkg} — last year`, value: year, unit: 'downloads', description: `Yearly downloads for ${pkg}` });
		} catch (e) {
			out.push({ id: `npm:${pkg}:error`, label: `${pkg} — npm stats`, value: (e as any)?.message ?? 'error', unit: '', description: `Failed to fetch npm stats for ${pkg}` });
		}
	}));
	return out;
}
