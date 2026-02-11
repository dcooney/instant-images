import { API } from '../constants/API';

/**
 * Get the default provider on page load.
 * Uses the first active provider from the configured provider order.
 *
 * @return {string} The default service provider.
 */
export default function getProvider() {
	const providerOrder = instant_img_localize?.provider_order || [];
	return providerOrder.length ? providerOrder[0] : API.defaults.provider;
}
