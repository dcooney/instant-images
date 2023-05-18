import { Fragment, forwardRef, useState } from "@wordpress/element";
import { usePluginContext } from "../common/pluginProvider";
import NoResults from "./NoResults";
import Photo from "./Photo";
import Sponsor from "./Sponsor";
import BlockInstructions from "./block/Instructions";

/**
 * Render the Results component.
 *
 * @return {JSX.Element} The Results component.
 */
const Results = forwardRef((props, ref) => {
	const { data, search } = props;
	const [inactive, setInactive] = useState(false);
	const { wpBlock = false } = usePluginContext();

	return (
		<Fragment>
			<div id="photos" className={inactive ? "inactive" : null} ref={ref}>
				{!!data?.length &&
					data.map((result, index) => (
						<Fragment key={`${result.id}-${index}`}>
							{result?.type === "instant-images-ad" ? (
								<Sponsor result={result} />
							) : (
								<Photo result={result} setInactive={setInactive} />
							)}
						</Fragment>
					))}
			</div>
			{!!wpBlock && data?.length ? <BlockInstructions /> : null}
			<NoResults total={search?.results} is_search={search?.active} />
		</Fragment>
	);
});
export default Results;
