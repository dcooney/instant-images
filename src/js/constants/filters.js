module.exports = {
	pexels: {
		filters: {
			order_by: {
				label: "orderby",
				default: "curated",
				filters: ["curated"]
			}
		},
		search: {
			orientation: {
				label: "orientation",
				default: "all",
				filters: ["all", "landscape", "portrait", "square"]
			},
			color: {
				label: "colors",
				default: "all",
				filters: [
					"all",
					"red",
					"orange",
					"yellow",
					"green",
					"turquoise",
					"blue",
					"violet",
					"pink",
					"brown",
					"black",
					"gray",
					"white"
				]
			},
			size: {
				label: "size",
				default: "all",
				filters: ["all", "large", "medium", "small"]
			}
		}
	},
	unsplash: {
		filters: {
			order_by: {
				label: "orderby",
				default: "latest",
				filters: ["latest", "popular", "oldest"]
			}
		},
		search: {
			order_by: {
				label: "orderby",
				default: "relevance",
				filters: ["relevance", "latest"]
			},
			orientation: {
				label: "orientation",
				default: "all",
				filters: ["all", "landscape", "portrait", "squarish"]
			},
			color: {
				label: "colors",
				default: "all",
				filters: [
					"all",
					"black_and_white",
					"black",
					"white",
					"yellow",
					"orange",
					"red",
					"purple",
					"magenta",
					"green",
					"teal",
					"blue"
				]
			}
		}
	},
	pixabay: {
		filters: {
			order: {
				label: "orderby",
				default: "popular",
				filters: ["popular", "latest"]
			},
			image_type: {
				label: "type",
				default: "all",
				filters: ["all", "photo", "illustration", "vector"]
			},
			category: {
				label: "category",
				default: "all",
				filters: [
					"all",
					"backgrounds",
					"fashion",
					"nature",
					"science",
					"education",
					"feelings",
					"health",
					"people",
					"religion",
					"places",
					"animals",
					"industry",
					"computer",
					"food",
					"sports",
					"transportation",
					"travel",
					"buildings",
					"business",
					"music"
				]
			},
			colors: {
				label: "colors",
				default: "all",
				filters: [
					"all",
					"grayscale",
					"red",
					"orange",
					"yellow",
					"green",
					"turquoise",
					"blue",
					"lilac",
					"pink",
					"white",
					"gray",
					"black",
					"brown",
					"transparent"
				]
			},
			orientation: {
				label: "orientation",
				default: "all",
				filters: ["all", "horizontal", "vertical"]
			}
		},
		search: {
			colors: {
				label: "colors",
				default: "all",
				filters: [
					"all",
					"grayscale",
					"red",
					"orange",
					"yellow",
					"green",
					"turquoise",
					"blue",
					"lilac",
					"pink",
					"white",
					"gray",
					"black",
					"brown",
					"transparent"
				]
			},
			orientation: {
				label: "orientation",
				default: "all",
				filters: ["all", "horizontal", "vertical"]
			}
		}
	}
};
