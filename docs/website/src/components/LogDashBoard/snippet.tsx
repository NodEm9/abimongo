import SnippetAnimated from './snippetAnimated';

import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';


const PER_WORD_MS = 80; // per-word reveal delay (ms)
const BETWEEN_LINES_MS = 220; // pause between lines
const REPLAY_DELAY_MS = 45000; // pause after full run (45s)

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const Snippet: React.FC = () => {
	const [displayed, setDisplayed] = useState<string[]>(() => LINES.map(() => ''));
	const [activeLine, setActiveLine] = useState<number | null>(null);
	

	// Character-by-character typing animation that only runs when the snippet is at least
	// half-visible in the viewport. After completing all lines it stays visible and will
	// replay again after REPLAY_DELAY_MS (only if the user remains in viewport).

	const LINES: string[] = [
		"const userSchema = new AbimongoSchema<T>(Record<string, any>)",
		"const UserModel = AbimongoModel<T>('User', userSchema);",
		"const user = await UserModel.create({ name: 'Alice', age: 30 });",
		"await user.save();",
		"const foundUser = await UserModel.findOne({ name: 'Alice' });",
	];

}

	export default SnippetAnimated;