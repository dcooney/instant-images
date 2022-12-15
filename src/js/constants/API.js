module.exports = {
	defaults: {
		provider: "unsplash",
		order: "latest",
		per_page: "20",
		arr_key: "results"
	},
	providers: ["Unsplash", "Pixabay", "Pexels"],
	unsplash: {
		name: "Unsplash",
		requires_key: true,
		auth_headers: false,
		new: false,
		api_var: "client_id",
		collections_api: "https://api.unsplash.com/collections/",
		photo_api: "https://api.unsplash.com/photos/",
		search_api: "https://api.unsplash.com/search/photos/",
		search_var: "query"
	},
	pixabay: {
		name: "Pixabay",
		requires_key: true,
		auth_headers: false,
		new: false,
		api_var: "key",
		photo_api: "https://pixabay.com/api/",
		search_api: "https://pixabay.com/api/",
		search_var: "q"
	},
	pexels: {
		name: "Pexels",
		requires_key: true,
		auth_headers: true,
		new: false,
		api_var: "key",
		photo_api: "https://api.pexels.com/v1/curated/",
		search_api: "https://api.pexels.com/v1/search/",
		search_var: "query"
	}
};
