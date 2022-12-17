/**
 * Check if an object is empty.
 *
 * @param {object}   obj The object to test against.
 * @return {Boolean}     Is this an object.
 */
export default function isObjectEmpty(obj) {
	if (obj === null || obj === undefined) {
		return true;
	}
	return Object.keys(obj).length === 0;
}
