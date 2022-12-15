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
		new: false,
		api_var: "client_id",
		collections_api: "https://api.unsplash.com/collections/"
	},
	pixabay: {
		name: "Pixabay",
		requires_key: true,
		new: false,
		api_var: "key"
	},
	pexels: {
		name: "Pexels",
		requires_key: true,
		new: false,
		api_var: "key"
	}
};
