import hljs from 'highlight.js/lib/common';
import typescript from 'highlight.js/lib/languages/typescript';
hljs.registerLanguage('typescript', typescript);
import 'highlight.js/styles/github-dark.css';
import React from 'react';

const Snippet = () => {
	const content = [
		{
			"type": "code",
			"lang": "tsx",
			"meta": "",
			"children": [
				`const userSchema = new AbimongoSchema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
})`,
				`const UserModel = Abimongo.model('User', userSchema);`
			]
		}
	];

	const tsx = hljs.highlight(content[0].children.join('\n'), { language: 'tsx' }).value;

	// content[0].children = tsx.split('\n');
	

	return (
		<div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', margin: '40px 0' }}>
			{content.map((block, index) => (
				<pre key={index} style={{ textAlign: 'left', background: '#272822', color: '#f8f8f2', padding: '15px', borderRadius: '5px', overflowX: 'auto' }}>
					<code>
						{block.children.map((line, i) => (
							<div key={i} style={{ marginBottom: '5px' }}>{line}</div>
						))}
					</code>
				</pre>
			))}
		</div>
	)
}
export default Snippet;