const name = "recent-searches";

/**
 * Save search value to localstorage.
 *
 * @param {string} term The search term.
 */
export function saveSearchHistory(term) {
	const recent = getSearchHistory();
	if (!recent) {
		localStorage.setItem(name, JSON.stringify([term]));
		return;
	}

	// Find duplicates.
	const duplicate = recent.indexOf(term);
	if (duplicate > -1) {
		recent.splice(duplicate, 1);
	}

	// Limit to 6 items.
	if (recent.length >= 5) {
		recent.length = 5;
	}

	// Add new term to the beginning of the array.
	recent.unshift(term);
	localStorage.setItem(name, JSON.stringify(recent));
}

/**
 * Get the search history from localstorage.
 *
 * @return {Array} The search history.
 */
export function getSearchHistory() {
	const history = localStorage.getItem(name);
	if (!history) {
		return [];
	}

	return JSON.parse(localStorage.getItem(name));
}

/**
 * Clear search history.
 */
export function clearSearchHistory() {
	localStorage.removeItem("recent-searches");
}
