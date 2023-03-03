module.exports = {
	...require( '@wordpress/prettier-config' ),
	overrides: [
		{
			files: [ '*.json', '*.yml' ],
			options: {
				singleQuote: false,
				tabWidth: 2,
				useTabs: false,
				endOfLine: 'auto',
			},
		},
	],
};
