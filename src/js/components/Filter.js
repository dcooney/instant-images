import { useRef, useEffect, useState } from '@wordpress/element';
import * as a11yarrows from 'a11yarrows';
import cn from 'classnames';

/**
 * Render the Filter component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Filter component.
 */
export default function Filter(props) {
	const { data, filterKey, function: handler, provider } = props;
	const defaultValue = data?.default;
	const [expanded, setExpanded] = useState(false);
	const [selected, setSelected] = useState(defaultValue);

	const dropdown = useRef();
	const button = useRef();
	const menu = useRef();
	const id = `${provider}-${filterKey}`;
	const isColor = filterKey === 'colors' || filterKey === 'color';

	/**
	 * Toggle menu open/closed.
	 *
	 * @param {Event} event The click event.
	 */
	function toggleMenu(event) {
		event.preventDefault();

		// If disabled, don't open menu.
		const target = event.currentTarget;
		if (target.disabled) {
			return false;
		}

		if (expanded) {
			setExpanded(false);
			document.removeEventListener('click', closeMenuOutside);
		} else {
			setExpanded(true);
			document.addEventListener('click', closeMenuOutside);
		}
	}

	/**
	 * Close menu when clicking outside.
	 *
	 * @param {Event} event The click event.
	 */
	function closeMenuOutside(event) {
		if (!menu?.current?.contains(event.target) && !button?.current?.contains(event.target)) {
			setExpanded(false);
			document.removeEventListener('click', closeMenuOutside);
		}
	}

	/**
	 * Checks for focus outside of component.
	 *
	 * @param {Event} event The click event.
	 */
	function focusOutside(event) {
		if (!dropdown?.current.contains(event.target)) {
			closeMenuOutside(event);
		}
	}

	/**
	 * Detect esc key press.
	 *
	 * @param {Event} event The click event.
	 */
	function escClick(event) {
		if (event.key === 'Escape') {
			setExpanded(false);
		}
	}

	/**
	 * Click handler for the filter buttons.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	function click(filter, value) {
		const newValue = selected !== value ? value : defaultValue;
		setSelected(newValue);
		handler(filter, newValue);

		setTimeout(() => {
			button?.current?.click();
		}, 100);
	}

	/**
	 * Convert a color to a CSS value.
	 * @see https://www.w3schools.com/colors/colors_names.asp
	 *
	 * @param  {string} color The current color.
	 * @return {string}       The color.
	 */
	function convertColor(color) {
		if (color === 'lilac') {
			color = 'DarkViolet';
		}
		if (color === 'grayscale' || color === 'black_and_white') {
			color = 'LightGray';
		}
		return color;
	}

	useEffect(() => {
		// Initiate arrow menus.
		a11yarrows.init(dropdown?.current, {
			selector: 'button',
		});

		// Check for focus outside.
		document.addEventListener('keyup', focusOutside);
		document.addEventListener('keydown', escClick);
		return () => {
			document.removeEventListener('keyup', focusOutside);
			document.removeEventListener('keydown', escClick);
		};
	}, []);

	return (
		<div className="filter-dropdown" id={id} ref={dropdown}>
			<button onClick={toggleMenu} className="filter-dropdown--button" aria-expanded={expanded ? 'true' : 'false'} ref={button}>
				<span className="filter-dropdown--button-label">{instant_img_localize.filters[data?.label]}</span>
				<span className="filter-dropdown--button-selected">
					{selected.replace(/_/g, ' ')}
					<i className="fa fa-caret-down" aria-hidden="true"></i>
				</span>
			</button>
			<div className={cn('filter-dropdown--menu', expanded ? 'expanded' : null)} data-key={filterKey} aria-hidden={expanded ? 'false' : 'true'} ref={menu}>
				{data?.filters?.length &&
					data.filters.map((value, key) => (
						<button key={key} className={cn('filter-dropdown--item', selected === value ? 'selected' : null)} onClick={() => click(filterKey, value)}>
							{value.replace(/_/g, ' ')}
							{value !== 'all' && value !== 'transparent' && isColor ? <span className="_color" style={{ color: convertColor(value) }}></span> : null}
						</button>
					))}
			</div>
		</div>
	);
}
