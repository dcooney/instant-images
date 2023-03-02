class ResultsToolTip extends React.Component {
	constructor(props) {
		super(props);
		this.getPhotos = this.props.getPhotos.bind(this);
	}

	render() {
		return (
			<div
				className={this.props.isSearch ? "searchResults" : "searchResults hide"}
			>
				<span title={this.props.title}>{this.props.total}</span>
				<button
					type="button"
					title={instant_img_localize.clear_search}
					onClick={() => this.getPhotos("latest")}
				>
					x
					<span className="offscreen">{instant_img_localize.clear_search}</span>
				</button>
			</div>
		);
	}
}
export default ResultsToolTip;
