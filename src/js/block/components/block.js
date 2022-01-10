import React from "react";
import PhotoList from "../../components/PhotoList";
import API from "../../constants/API";
import buildTestURL from "../../functions/buildTestURL";
import checkRateLimit from "../../functions/checkRateLimit";
import consoleStatus from "../../functions/consoleStatus";
import getProvider from "../../functions/getProvider";
import Icon from "./utils/icon";
import InsertImage from "./utils/insertImage";
import SetFeaturedImage from "./utils/setFeaturedImage";
const { PluginSidebar } = wp.editPost;
const { useState, useEffect } = wp.element;

const Block = () => {
	const [pluginProvider, setPluginProvider] = useState();

	// Get provider and options from settings.
	const provider = getProvider();
	const defaultProvider = API.defaults.provider;
	const defaultOrder = API.defaults.order;
	const api_required = API[provider].requires_key;

	useEffect(() => {
		/**
		 * Fetch the initial provider details.
		 * Note: We must wrap our fetch call in an async await wrapper and then pass the provider
		 * as state. Otherwise React throws a 'Objects are not valid as a React child' error.
		 *
		 */
		async function fetchProviderData() {
			if (api_required) {
				const response = await fetch(buildTestURL(provider));

				// Handle response.
				const ok = response.ok;
				const status = response.status;
				checkRateLimit(response.headers);

				if (ok) {
					// Success.
					setPluginProvider(provider);
				} else {
					// Status Error: Fallback to default provider.
					setPluginProvider(defaultProvider);

					// Render console warning.
					consoleStatus(provider, status);
				}
			} else {
				// API Error: Fallback to default provider.
				setPluginProvider(defaultProvider);
			}
		}
		fetchProviderData();
	}, []);

	return (
		<PluginSidebar
			icon={<Icon borderless color="unsplash" />}
			name="instant-images-sidebar"
			title="Instant Images"
		>
			<div className="instant-img-container">
				{pluginProvider && (
					<PhotoList
						editor="gutenberg"
						page={1}
						orderby={defaultOrder}
						provider={pluginProvider}
						SetFeaturedImage={SetFeaturedImage}
						InsertImage={InsertImage}
					/>
				)}
			</div>
		</PluginSidebar>
	);
};
export default Block;
