import { Fragment } from "@wordpress/element";
import Photo from "./Photo";
import Sponsor from "./Sponsor";

/**
 * Render the Results component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Results component.
 */
export default function Results(props) {
	const { results } = props;

	return (
		<Fragment>
			{!!results?.length &&
				results.map((result, index) => (
					<Fragment key={`${result.id}-${index}`}>
						{result?.type === "instant-images-ad" ? (
							<Sponsor result={result} />
						) : (
							<Photo result={result} />
						)}
					</Fragment>
				))}
		</Fragment>
	);
}
