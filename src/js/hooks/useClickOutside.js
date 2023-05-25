import { useEffect } from "@wordpress/element";

/**
 * Detect clicks outside of ref.
 *
 * @param {Object}   ref            React ref.
 * @param {Function} onClickOutside Function to invoke when clicked outside.
 */
export function useClickOutside(ref, onClickOutside) {
	/**
	 * Escape handler.
	 *
	 * @param {Event} e The key press event.
	 */
	function escapeClick(e) {
		const { key } = e;
		if (key === "Escape") {
			onClickOutside();
		}
	}

	useEffect(() => {
		/**
		 * Invoke Function onClick outside of element
		 *
		 * @param {Event} event The event object.
		 */
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside();
			}
		}

		// Bind events.
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keyup", handleClickOutside);
		document.addEventListener("keydown", escapeClick, false);
		return () => {
			// Dispose of events.
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keyup", handleClickOutside);
			document.removeEventListener("keydown", escapeClick, false);
		};
	}, [ref, onClickOutside]); //eslint-disable-line react-hooks/exhaustive-deps
}
