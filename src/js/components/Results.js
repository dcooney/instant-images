import { Fragment, forwardRef } from "@wordpress/element";
import Photo from "./Photo";
import Sponsor from "./Sponsor";
import NoResults from "./NoResults";

/**
 * Render the Results component.
 *
 * @return {JSX.Element} The Results component.
 */
const Results = forwardRef((props, ref) => {
	const { data, search } = props;

	return (
		<Fragment>
			<div id="photos" ref={ref}>
				{!!data?.length &&
					data.map((result, index) => (
						<Fragment key={`${result.id}-${index}`}>
							{result?.type === "instant-images-ad" ? (
								<Sponsor result={result} />
							) : (
								<Photo result={result} />
							)}
						</Fragment>
					))}
			</div>
			<NoResults total={search?.results} is_search={search?.active} />
		</Fragment>
	);
});
export default Results;
