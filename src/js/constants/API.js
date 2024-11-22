import { UnsplashIcon, PexelsIcon, PixabayIcon, OpenverseIcon, GiphyIcon } from '../components/ProviderIcons';

export const API = {
	proxy: PROXY_URL || 'https://proxy.getinstantimages.com/api/', // eslint-disable-line
	testmode: false,
	defaults: {
		provider: 'unsplash',
		order: 'latest',
		arr_key: 'results',
	},
	providers: ['Unsplash', 'Openverse', 'Pixabay', 'Pexels', 'Giphy'],
	unsplash: {
		name: 'Unsplash',
		requires_key: true,
		new: false,
		api_var: 'client_id',
		collections_api: 'https://api.unsplash.com/collections/',
		icon: UnsplashIcon,
	},
	pixabay: {
		name: 'Pixabay',
		requires_key: true,
		new: false,
		api_var: 'key',
		icon: PixabayIcon,
	},
	pexels: {
		name: 'Pexels',
		requires_key: true,
		new: false,
		api_var: 'key',
		icon: PexelsIcon,
	},
	openverse: {
		name: 'Openverse',
		requires_key: false,
		new: false,
		api_var: 'key',
		key: '',
		icon: OpenverseIcon,
	},
	giphy: {
		name: 'Giphy',
		requires_key: true,
		new: true,
		api_var: 'key',
		icon: GiphyIcon,
	},
};
