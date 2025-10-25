const hljs = require('highlight.js/lib/core');
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github-dark.css';
import React from 'react';
import styles from './styles.module.css';



hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('javascript', javascript);

const Snippet = () => {
	const highlightCode = (code: string, language: string) => {
		const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
		return hljs.highlight(code, { language: validLanguage }).value;
	};


	const content =
		[
			{
				"type": "code",
				"lang": "tsx",
				"meta": "",
				"children": [
					`const userSchema = new AbimongoSchema<T>(Record<string, any>)`,
					`const UserModel = AbimongoModel<T>('User', userSchema);`,
					`const user = await UserModel.create({ name: 'Alice', age: 30 });`,
					`await user.save();`,
					`const foundUser = await UserModel.findOne({ name: 'Alice' });`,

				],
				
			}
		];

	const styledCode = content.map((block) => {
		if (block.type === 'code') {
			const highlighted = highlightCode(block.children.join('\n'), block.lang);
			const lines = highlighted.split('\n').map((line: string, index: number) => (
				<span key={index} dangerouslySetInnerHTML={{ __html: line }}></span>
			));
			return { ...block, children: lines };
		}
		return block;
	});


	return (
		<div className={styles.codeSnippet}>
			{styledCode.map((block, index) => (
				<pre
					key={index}
					className={styles.hljs}
					>
					<code>
						{block.children.map((line, i) => (
							<div key={i} > {line}</div>
						))}
					</code>
				</pre>
			))}
		</div>
	)
}
export default Snippet;


