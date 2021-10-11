module.exports = {
	unsplash: {
		app_id: "?client_id=" + instant_img_localize.unsplash_app_id,
		photo_api: "https://api.unsplash.com/photos/",
		collections_api: "https://api.unsplash.com/collections",
		search_api: "https://api.unsplash.com/search/photos",
		search_query_var: "query",
		arr_key: "results",
		order_key: "order_by",
		orientation: ["landscape", "portrait", "squarish"],
	},
	pixabay: {
		app_id: "/?key=23559219-67621b8a8bd93df7b6aef72a7",
		photo_api: "https://pixabay.com/api/",
		search_api: "https://pixabay.com/api",
		search_query_var: "q",
		arr_key: "hits",
		order_key: "order",
		orientation: ["horizontal", "vertical"],
	},
	photo_api: "https://api.unsplash.com/photos",
	posts_per_page: "&per_page=20",
};
