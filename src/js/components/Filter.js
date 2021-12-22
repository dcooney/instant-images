import React from "react";

class Filter extends React.Component {
	constructor(props) {
		super(props);
		this.data = this.props.data;
		this.filterKey = this.props.filterKey;
		this.function = this.props.function.bind(this);
	}
	render() {
		return (
			<label>
				<span>{instant_img_localize.filters[this.data.label]}</span>
				<select
					onChange={(e) => this.function(e)}
					data-filter={this.filterKey}
				>
					{this.data.option && (
						<option value="#">
							{this.data.option && this.data.option === "select"
								? instant_img_localize.filters.select
								: this.data.option}
						</option>
					)}
					{this.data.filters &&
						this.data.filters.map((item, key) => (
							<option key={key} value={item}>
								{item}
							</option>
						))}
				</select>
			</label>
		);
	}
}

export default Filter;
