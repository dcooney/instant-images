module.exports = {
	defaults: {
		provider: "unsplash",
		order: "latest",
		per_page: "20"
	},
	unsplash: {
		requires_key: true,
		auth_headers: false,
		new: false,
		api_var: "client_id",
		api_query_var: "client_id=",
		collections_api: "https://api.unsplash.com/collections/",
		photo_api: "https://api.unsplash.com/photos/",
		search_api: "https://api.unsplash.com/search/photos/",
		search_var: "query",
		arr_key: "results"
	},
	pixabay: {
		requires_key: true,
		auth_headers: false,
		new: true,
		api_var: "key",
		api_query_var: "key=",
		photo_api: "https://pixabay.com/api/",
		search_api: "https://pixabay.com/api/",
		search_var: "q",
		arr_key: "hits"
	},
	pexels: {
		requires_key: true,
		auth_headers: true,
		new: true,
		api_var: "",
		api_query_var: "",
		photo_api: "https://api.pexels.com/v1/curated/",
		search_api: "https://api.pexels.com/v1/search/",
		search_var: "query",
		arr_key: "photos"
	}
};
