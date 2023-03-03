module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	parserOptions: {
		ecmaVersion: 2021,
		requireConfigFile: false,
		babelOptions: {
			presets: [ require.resolve( '@wordpress/babel-preset-default' ) ],
		},
	},
	root: true,
	env: {
		browser: true,
		es6: true,
		jquery: true,
	},
	rules: {
		'@wordpress/no-global-event-listener': 0, // Disable. We don't use React-based components.
		'no-unused-vars': 0, // Disable. We use this to disable unused variables in the code.
		camelcase: 0,
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto',
			},
		],
	},
};
