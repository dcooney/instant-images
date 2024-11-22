import { useRef, Fragment } from '@wordpress/element';

/**
 * Render the Sponsor component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Sponsor component.
 */
export default function Sponsor(props) {
	const { result } = props;
	const { data = null } = result;
	const url = data?.url || '';
	const title = data?.title || '';
	const desc = data?.description || '';
	const avatar = data?.avatar || '';

	const { image = null } = data;
	const { src = null, alt = null } = image;

	const photo = useRef();
	const link = useRef();

	return (
		<Fragment>
			{image && url ? (
				// eslint-disable-next-line
				<article className="photo feature" title={desc} ref={photo} onClick={() => link.current.click()}>
					<div className="photo--wrap">
						<span className="flag" title={instant_img_localize.advertisement}>
							{instant_img_localize.ad}
						</span>
						<div className="img-wrap">
							<a className="loaded" href={url} target="_blank" ref={link} rel="noreferrer">
								<img src={src} alt={alt} />
							</a>
						</div>
						<div className="feature-title">
							{avatar && <img src={avatar} alt={title} />}
							<span>{title}</span>
						</div>
					</div>
				</article>
			) : null}
		</Fragment>
	);
}
