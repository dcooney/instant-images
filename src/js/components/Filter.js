import * as a11yarrows from "a11yarrows";
import cn from "classnames";
import React from "react";

class Filter extends React.Component {
	constructor(props) {
		super(props);
		this.data = this.props.data;
		this.default = this.data.default;
		this.filterKey = this.props.filterKey;
		this.provider = this.props.provider;
		this.id = `${this.provider}-${this.filterKey}`;
		this.clickHandler = this.props.function.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.closeMenuOutside = this.closeMenuOutside.bind(this);
		this.focusOutside = this.focusOutside.bind(this);
		this.escClick = this.escClick.bind(this);
		this.reset = this.reset.bind(this);
		this.isColor = this.filterKey === "colors" || this.filterKey === "color";
		this.state = {
			expanded: false,
			selected: this.data.default
		};
	}

	/**
	 * Toggle menu open/closed.
	 *
	 * @param {Event} event The click event.
	 */
	toggleMenu(event) {
		event.preventDefault();

		// If disabled, don't open menu.
		const target = event.currentTarget;
		if (target.disabled) {
			return false;
		}

		if (this.state.expanded) {
			this.setState({ expanded: false }, () => {
				document.removeEventListener("click", this.closeMenuOutside);
			});
		} else {
			this.setState({ expanded: true }, () => {
				document.addEventListener("click", this.closeMenuOutside);
			});
		}
	}

	/**
	 * Close menu when clicking outside.
	 *
	 * @param {Event} event The click event.
	 */
	closeMenuOutside(event) {
		if (
			!this.menu.contains(event.target) &&
			!this.trigger.contains(event.target)
		) {
			this.setState({ expanded: false }, () => {
				document.removeEventListener("click", this.closeMenuOutside);
			});
		}
	}

	/**
	 * Checks for focus outside of component.
	 *
	 * @param {Event} event The click event.
	 */
	focusOutside(event) {
		if (!this.dropdown.contains(event.target)) {
			this.closeMenuOutside(event);
		}
	}

	/**
	 * Detect esc key press.
	 *
	 * @param {Event} event The click event.
	 */
	escClick(event) {
		if (event.key === "Escape") {
			this.setState({ expanded: false });
		}
	}

	/**
	 * Click handler for the filter buttons.
	 *
	 * @param {string} filter The current filter key.
	 * @param {string} value  The value to filter.
	 */
	click(filter, value) {
		const self = this;
		const newValue = this.state.selected !== value ? value : this.default;

		this.setState({
			selected: newValue
		});
		this.clickHandler(filter, newValue);

		// Delay for effect.
		setTimeout(function() {
			self.trigger.click();
		}, 100);
	}

	reset() {
		this.setState({
			selected: this.default
		});
	}

	/**
	 * Convert a color to a CSS value.
	 * @see https://www.w3schools.com/colors/colors_names.asp
	 *
	 * @param  {string} color The current color.
	 * @return {string}       The color.
	 */
	convertColor(color) {
		if (color === "lilac") {
			color = "DarkViolet";
		}
		if (color === "grayscale" || color === "black_and_white") {
			color = "LightGray";
		}
		return color;
	}

	// Initiate functions on mount.
	componentDidMount() {
		// Initiate arrow menus.
		a11yarrows.init(this.dropdown, {
			selector: "button"
		});

		// Check for focus outside.
		document.addEventListener("keyup", this.focusOutside);
		document.addEventListener("keydown", this.escClick);
	}

	// Functions to run on unmount.
	componentWillUnmount() {
		document.removeEventListener("keyup", this.focusOutside);
		document.removeEventListener("keydown", this.escClick);
	}

	render() {
		return (
			<div
				className="filter-dropdown"
				id={this.id}
				ref={element => {
					this.dropdown = element;
				}}
			>
				<button
					onClick={this.toggleMenu}
					className="filter-dropdown--button"
					aria-expanded={this.state.expanded ? "true" : "false"}
					ref={element => {
						this.trigger = element;
					}}
				>
					<span className="filter-dropdown--button-label">
						{instant_img_localize.filters[this.data.label]}
					</span>
					<span className="filter-dropdown--button-selected">
						{this.state.selected.replace(/_/g, " ")}
						<i className="fa fa-caret-down" aria-hidden="true"></i>
					</span>
				</button>
				<div
					className={cn(
						"filter-dropdown--menu",
						this.state.expanded ? "expanded" : null
					)}
					data-key={this.filterKey}
					aria-hidden={this.state.expanded ? "false" : "true"}
					ref={element => {
						this.menu = element;
					}}
				>
					{this.data.filters &&
						this.data.filters.map((value, key) => (
							<button
								key={key}
								className={cn(
									"filter-dropdown--item",
									this.state.selected === value ? "selected" : null
								)}
								onClick={() => this.click(this.filterKey, value)}
							>
								{value.replace(/_/g, " ")}
								{value !== "all" &&
								value !== "transparent" &&
								this.isColor ? (
									<span
										className="_color"
										style={{ color: this.convertColor(value) }}
									></span>
								) : null}
							</button>
						))}
				</div>
			</div>
		);
	}
}

export default Filter;
