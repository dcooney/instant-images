import { Fragment } from '@wordpress/element';
import { usePluginContext } from '../common/pluginProvider';
import { API } from '../constants/API';
import { getProviderIcon } from './ProviderIcons';
import giphyPowered from '../../img/logos/giphy-powered.png';
const providers = API.providers;

/**
 * Render the ProviderNav component.
 *
 * @param {Object} props                The component props.
 * @param {Object} props.switchProvider The function to switch the provider.
 * @return {JSX.Element}                The ProviderNav component.
 */
export default function ProviderNav({ switchProvider }) {
	const { provider } = usePluginContext();

	return (
		<Fragment>
			{!!providers?.length && (
				<nav className="provider-nav">
					{providers.map((item, index) => (
						<div key={`provider-${index}`}>
							<button
								onClick={() => switchProvider(item.toLowerCase())}
								className={provider === item.toLowerCase() ? 'provider-nav--btn active' : 'provider-nav--btn'}
							>
								{getProviderIcon(item)}
								<span>{item}</span>
								{API[item.toLowerCase()].new && <span className="provider-nav--new">{instant_img_localize.new}</span>}
							</button>
						</div>
					))}
					{provider === 'giphy' ? (
						<div className="giphy-powered">
							<a href="https://giphy.com" target="_blank" rel="noreferrer">
								<img src={giphyPowered} alt="Powered by Giphy" />
							</a>
						</div>
					) : null}
				</nav>
			)}
		</Fragment>
	);
}
