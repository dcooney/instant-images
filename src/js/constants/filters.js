import { __ } from '@wordpress/i18n';
import { OPENVERSE_EXTENSIONS, OPENVERSE_LICENSES, OPENVERSE_ORIENTATIONS, OPENVERSE_SOURCES } from './filters/openverse';
import { PEXELS_COLORS, PEXELS_ORIENTATIONS } from './filters/pexels';
import { PIXABAY_CATS, PIXABAY_COLORS, PIXABAY_IMAGE_TYPE, PIXABAY_ORIENTATIONS } from './filters/pixabay';
import { UNSPLASH_COLORS, UNSPLASH_ORIENTATIONS } from './filters/unsplash';

const ALL = { label: __('All', 'instant-images'), value: 'all' };

export const FILTERS = {
	giphy: {
		filters: {
			order: {
				label: __('Order', 'instant-images'),
				default: 'trending',
				filters: [{ label: __('Trending', 'instant-images'), value: 'trending' }],
			},
		},
		search: {},
	},
	openverse: {
		filters: {
			source: {
				label: __('Source', 'instant-images'),
				default: 'wordpress',
				filters: [...OPENVERSE_SOURCES],
			},
			aspect_ratio: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...OPENVERSE_ORIENTATIONS],
			},
		},
		search: {
			category: {
				label: __('Type', 'instant-images'),
				default: 'all',
				filters: [
					ALL,
					{
						label: __('Illustration', 'instant-images'),
						value: 'illustration',
					},
					{ label: __('Photograph', 'instant-images'), value: 'photograph' },
				],
			},
			extension: {
				label: __('Extension', 'instant-images'),
				default: 'all',
				filters: [ALL, ...OPENVERSE_EXTENSIONS],
			},
			aspect_ratio: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...OPENVERSE_ORIENTATIONS],
			},
			size: {
				label: __('Size', 'instant-images'),
				default: 'all',
				filters: [
					ALL,
					{ label: __('Large', 'instant-images'), value: 'large' },
					{ label: __('Medium', 'instant-images'), value: 'medium' },
					{ label: __('Small', 'instant-images'), value: 'small' },
				],
			},
			license: {
				label: __('License', 'instant-images'),
				default: 'all',
				filters: [ALL, ...OPENVERSE_LICENSES],
			},
			license_type: {
				label: 'license_type',
				default: 'all',
				filters: [
					ALL,
					{ label: __('Commercial', 'instant-images'), value: 'commercial' },
					{
						label: __('Modification', 'instant-images'),
						value: 'modification',
					},
				],
			},
		},
	},
	pexels: {
		filters: {
			order_by: {
				label: __('Order', 'instant-images'),
				default: 'curated',
				filters: [{ label: __('Curated', 'instant-images'), value: 'curated' }],
			},
		},
		search: {
			orientation: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PEXELS_ORIENTATIONS],
			},
			color: {
				label: __('Colors', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PEXELS_COLORS],
			},
			size: {
				label: __('Size', 'instant-images'),
				default: 'all',
				filters: [
					ALL,
					{ label: __('Large', 'instant-images'), value: 'large' },
					{ label: __('Medium', 'instant-images'), value: 'medium' },
					{ label: __('Small', 'instant-images'), value: 'small' },
				],
			},
		},
	},
	unsplash: {
		filters: {
			order_by: {
				label: __('Order', 'instant-images'),
				default: 'latest',
				filters: [{ label: __('Latest', 'instant-images'), value: 'latest' }],
			},
		},
		search: {
			order_by: {
				label: __('Order', 'instant-images'),
				default: 'relevant',
				filters: [
					{ label: __('Relevance', 'instant-images'), value: 'relevant' },
					{ label: __('Latest', 'instant-images'), value: 'latest' },
				],
			},
			orientation: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...UNSPLASH_ORIENTATIONS],
			},
			color: {
				label: __('Colors', 'instant-images'),
				default: 'all',
				filters: [ALL, ...UNSPLASH_COLORS],
			},
		},
	},
	pixabay: {
		filters: {
			order: {
				label: __('Order', 'instant-images'),
				default: 'popular',
				filters: [
					{ label: __('Popular', 'instant-images'), value: 'popular' },
					{ label: __('Latest', 'instant-images'), value: 'latest' },
				],
			},
			image_type: {
				label: __('Type', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_IMAGE_TYPE],
			},
			category: {
				label: __('Category', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_CATS],
			},
			colors: {
				label: __('Colors', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_COLORS],
			},
			orientation: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_ORIENTATIONS],
			},
		},
		search: {
			image_type: {
				label: __('Type', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_IMAGE_TYPE],
			},
			colors: {
				label: __('Colors', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_COLORS],
			},
			orientation: {
				label: __('Orientation', 'instant-images'),
				default: 'all',
				filters: [ALL, ...PIXABAY_ORIENTATIONS],
			},
		},
	},
};
