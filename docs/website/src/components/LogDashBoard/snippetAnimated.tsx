import React, { useEffect, useRef, useState } from 'react';
import styles from './dashboard.module.css';


const LINES: string[] = [
	"const userSchema = new AbimongoSchema<T>(Record<string, any>)",
	"const UserModel = AbimongoModel<T>('User', userSchema);",
	"const user = await UserModel.create({ name: 'Alice', age: 30 });",
	"await user.save();",
	"const foundUser = await UserModel.findOne({ name: 'Alice' });",
];

// timings (adjustable)
const PER_CHAR_MS = 80; // per-character typing delay (ms) - slightly slower
const BETWEEN_LINES_MS = 350; // small pause after each line
const REPLAY_DELAY_MS = 40000; // replay every 40s

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SnippetAnimated: React.FC = () => {
	const [displayed, setDisplayed] = useState<string[]>(() => LINES.map(() => ''));
	const [activeLine, setActiveLine] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const visibleRef = useRef(false);
	const runningRef = useRef(false);
	const replayTimerRef = useRef<number | null>(null);

	const startRun = async () => {
		if (runningRef.current) return;
		runningRef.current = true;
		// clear previous text but keep space reserved
		setDisplayed(LINES.map(() => ''));
		setActiveLine(null);

		for (let li = 0; li < LINES.length; li++) {
			if (!runningRef.current) break;
			setActiveLine(li);
			const chars = Array.from(LINES[li]);
			let built = '';
			for (let ci = 0; ci < chars.length; ci++) {
				if (!runningRef.current) break;
				built += chars[ci];
				setDisplayed((prev) => {
					const copy = prev.slice();
					copy[li] = built;
					return copy;
				});
				await sleep(PER_CHAR_MS);
			}
			// short pause after completing a line
			await sleep(BETWEEN_LINES_MS);
		}

		setActiveLine(null);
		runningRef.current = false;

		// schedule replay only if still visible
		if (visibleRef.current) {
			replayTimerRef.current = window.setTimeout(() => {
				replayTimerRef.current = null;
				startRun();
			}, REPLAY_DELAY_MS) as unknown as number;
		}
	};

	// IntersectionObserver: start typing when at least half visible
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				visibleRef.current = entry.isIntersecting;
				if (entry.isIntersecting && !runningRef.current) {
					// kick off a run when visible
					startRun();
				}
				// if invisible, cancel scheduled replay so it doesn't start offscreen
				if (!entry.isIntersecting && replayTimerRef.current) {
					clearTimeout(replayTimerRef.current);
					replayTimerRef.current = null;
				}
			},
			{ threshold: 0.5 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);

	useEffect(() => {
		return () => {
			runningRef.current = false;
			if (replayTimerRef.current) {
				clearTimeout(replayTimerRef.current);
				replayTimerRef.current = null;
			}
		};
	}, []);

	// Reserve vertical space to avoid layout shift: approximate 1.6em line height
	const minHeight = `${LINES.length * 1.6}em`;

	return (
		<div ref={containerRef} className={styles.codeSnippet} style={{ minHeight }}>
			<pre className={styles.hljs} style={{ minHeight }}>
				<code>
					{displayed.map((line, i) => (
						<div key={i} className={`${styles.typedLine} ${activeLine === i ? styles.enter : ''}`}>
							<span className={styles.typedText}>{line}</span>
							{activeLine === i ? <span className={styles.caret} /> : null}
						</div>
					))}
				</code>
			</pre>
		</div>
	);
};

export default SnippetAnimated;
