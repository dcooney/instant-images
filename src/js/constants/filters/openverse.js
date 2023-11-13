import { __ } from "@wordpress/i18n";

export const OPENVERSE_SOURCES = [
	{ label: __("WordPress", "instant-images"), value: "wordpress" },
	{ label: __("Flickr", "instant-images"), value: "flickr" },
	{ label: __("Nasa", "instant-images"), value: "nasa" },
	{ label: __("SpaceX", "instant-images"), value: "spacex" },
	{ label: __("Wikimedia", "instant-images"), value: "wikimedia" },
];

export const OPENVERSE_ORIENTATIONS = [
	{ label: __("Square", "instant-images"), value: "square" },
	{ label: __("Tall", "instant-images"), value: "tall" },
	{ label: __("Wide", "instant-images"), value: "wide" },
];

export const OPENVERSE_EXTENSIONS = [
	{
		label: "JPG",
		value: "JPG",
	},
	{
		label: "GIF",
		value: "GIF",
	},
	{
		label: "PNG",
		value: "PNG",
	},
	{
		label: "SVG",
		value: "SVG",
	},
];

export const OPENVERSE_LICENSES = [
	{
		label: "BY",
		value: "BY",
	},
	{
		label: "BY-NC",
		value: "BY-NC",
	},
	{
		label: "BY-NC-ND",
		value: "BY-NC-ND",
	},
	{
		label: "BY-NC-SA",
		value: "BY-NC-SA",
	},
	{
		label: "BY-ND",
		value: "BY-ND",
	},
	{
		label: "BY-SA",
		value: "BY-SA",
	},
	{
		label: "CC0",
		value: "CC0",
	},
];
