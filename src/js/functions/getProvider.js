import { API } from '../constants/API';

/**
 * Get the default provider on page load.
 *
 * @return {string} The default service provider.
 */
export default function getProvider() {
	return instant_img_localize && instant_img_localize.default_provider ? instant_img_localize.default_provider : API.defaults.provider;
}
