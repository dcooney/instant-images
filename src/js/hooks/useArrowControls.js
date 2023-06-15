import { useEffect, useRef } from "@wordpress/element";

/**
 * Detect up and down arrow presses.
 *
 * @param {boolean} active Is the element currently active.
 * @param {Object}  ref    The container ref to select the focusable elements.
 */
export function useArrowControls(active, ref) {
	const focusedRef = useRef(active);

	/**
	 * Add event listener for arrow keys.
	 *
	 * @param {KeyboardEvent} e The event.
	 */
	function arrowHandler(e) {
		const { key } = e;

		if (focusedRef?.current && ref?.current) {
			const focusable = ref?.current.querySelectorAll(
				"a[href]:not([disabled]), button:not([disabled]), input"
			);

			if (!focusable?.length) {
				// Exit if no focusable elements.
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			const active = document.activeElement; // eslint-disable-line
			const activeIndex = [...focusable].indexOf(active);

			// Up arrow.
			if (key === "ArrowUp") {
				e.preventDefault();
				if (activeIndex === 0) {
					last.focus({
						preventScroll: true,
					});
				} else {
					focusable[activeIndex - 1].focus({
						preventScroll: true,
					});
				}
			}
			// Down Arrow
			if (key === "ArrowDown") {
				e.preventDefault();
				if (activeIndex === focusable.length - 1 || activeIndex === -1) {
					first.focus({
						preventScroll: true,
					});
				} else {
					focusable[activeIndex + 1].focus({
						preventScroll: true,
					});
				}
			}
		}
	}

	useEffect(() => {
		focusedRef.current = active;
	}, [active]);

	useEffect(() => {
		document.addEventListener("keydown", arrowHandler, false);
		return () => {
			// Dispose of events.
			document.removeEventListener("keydown", arrowHandler, false);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
}
