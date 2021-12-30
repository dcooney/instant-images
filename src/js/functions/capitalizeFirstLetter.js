/**
 * Capitalize the first letter of a string.
 *
 * @param  {string} str The string to format.
 * @return {string}     The formatted string.
 */
export default function capitalizeFirstLetter(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
