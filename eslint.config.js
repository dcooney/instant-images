const wpPlugin = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [
			'**/*.min.js',
			'**/build/**',
			'**/node_modules/**',
			'**/vendor/**',
			'**/dist/**',
			'**/lang/**',
		],
	},

	...wpPlugin.configs.recommended,

	{
		languageOptions: {
			globals: {
				browser: true,
				es6: true,
				jQuery: true,
				$: true,
			},
			parserOptions: {
				ecmaVersion: 2021,
				requireConfigFile: false,
				babelOptions: {
					presets: [
						require.resolve( '@wordpress/babel-preset-default' ),
					],
				},
			},
		},
		rules: {
			'@wordpress/no-global-event-listener': 0,
			'space-before-function-paren': 0,
			camelcase: 0,
			'jsx-a11y/label-has-associated-control': 0,
			'no-undef': 0,
			'no-unused-vars': [ 'error', { caughtErrors: 'none' } ],
			'no-console': [ 'error', { allow: [ 'warn', 'error', 'table' ] } ],
			'jsdoc/no-undefined-types': 0,
			'import/no-extraneous-dependencies': 0,
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
		},
	},
];
