import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';


const sidebars: SidebarsConfig = {
	tutorials: [
		'intro',
		{
			type: 'category',
			label: 'Tutorials',
			items: [
				'core_tutotrials/core-tutorials',
				'core_tutotrials/abimongo-express', 
				'core_tutotrials/abimongo-graphql',
			],
		}
	]
};

export default sidebars;