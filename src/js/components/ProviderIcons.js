import { API } from '../constants/API';

/**
 * Return the provider icon.
 *
 * @param {string} provider The provider.
 * @return {JSX.Element} The provider icon.
 */
export function getProviderIcon(provider) {
	if (!provider) {
		return null;
	}
	return API[provider.toLowerCase()].icon ? API[provider.toLowerCase()].icon() : null;
}

/**
 * Giphy Icon.
 */
export function GiphyIcon() {
	return (
		<svg height="35" width="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 35">
			<g fill="none" fillRule="evenodd">
				<path d="M4 4h20v27H4z" fill="#000" />
				<g>
					<path d="M0 3h4v29H0z" fill="#04ff8e" />
					<path d="M24 11h4v21h-4z" fill="#8e2eff" />
					<path d="M0 31h28v4H0z" fill="#00c5ff" />
					<path d="M0 0h16v4H0z" fill="#fff152" />
					<path d="M24 8V4h-4V0h-4v12h12V8" fill="#ff5b5b" />
					<path d="M24 16v-4h4" fill="#551c99" />
				</g>
				<path d="M16 0v4h-4" fill="#999131" />
			</g>
		</svg>
	);
}

/**
 * Unsplash Icon.
 */
export function UnsplashIcon() {
	return (
		<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<path d="M10 9V0H22V9H10ZM22 14H32V32H0V14H10V23H22V14Z" fill="black" />
		</svg>
	);
}

/**
 * Pixabay Icon.
 */
export function PixabayIcon() {
	return (
		<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<g clipPath="url(#clip0_307_143)">
				<path d="M0 0V32H32V0H0Z" fill="#48A947" />
				<path
					d="M6.83734 22.3147V28C5.93067 28.0427 5.02401 28.032 4.11734 27.9787C4.09601 27.7014 4.06401 27.4667 4.06401 27.2427C4.06401 23.2427 4.05334 19.2534 4.06401 15.2534C4.07467 12.032 5.97334 9.32269 8.85334 8.37335C13.1307 6.95469 17.4507 10.048 17.8453 14.3894C18.144 17.6534 16.4267 20.5547 13.568 21.7814C12.6507 22.176 11.6907 22.304 10.7093 22.304C9.45067 22.3147 8.21334 22.3147 6.83734 22.3147ZM6.84801 19.4454C8.24534 19.4454 9.54667 19.424 10.848 19.4454C13.1627 19.488 14.816 17.76 15.104 15.712C15.424 13.3654 13.7813 11.2107 11.4453 10.88H11.4347C9.25867 10.592 7.06134 12.2774 6.88001 14.528C6.74134 16.128 6.84801 17.728 6.84801 19.4454Z"
					fill="#F9FBF9"
				/>
				<path
					d="M25.4827 14.9334L30.656 22.2081H27.3067L23.4667 16.9494C22.0694 18.6881 20.9067 20.4907 19.584 22.2081H16.2454L21.408 14.9334L16.8107 8.04272H20.16L23.4454 12.9494L26.7307 8.04272H30.0694L25.4827 14.9334Z"
					fill="#FAFCFA"
				/>
				<path
					d="M6.848 19.4453C6.848 17.7279 6.74134 16.1173 6.86934 14.5386C7.05067 12.2879 9.248 10.6026 11.424 10.8906C13.7707 11.2106 15.4133 13.3653 15.0933 15.7119C14.816 17.7599 13.152 19.4879 10.8373 19.4453C9.54667 19.4239 8.24534 19.4453 6.848 19.4453Z"
					fill="#4AA949"
				/>
			</g>
			<defs>
				<clipPath id="clip0_307_143">
					<rect width="32" height="32" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}

/**
 * Openverse Icon.
 */
export function OpenverseIcon() {
	return (
		<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M25.8578 14.32C29.6708 14.32 32.7618 11.1144 32.7618 7.16C32.7618 3.20564 29.6708 0 25.8578 0C22.0448 0 18.9539 3.20564 18.9539 7.16C18.9539 11.1144 22.0448 14.32 25.8578 14.32Z"
				fill="#000000"
			/>
			<path d="M0.761841 7.16C0.761841 11.1 3.84742 14.32 7.66584 14.32V0C3.84742 0 0.761841 3.2 0.761841 7.16Z" fill="#000000" />
			<path d="M9.85791 7.16C9.85791 11.1 12.9435 14.32 16.7619 14.32V0C12.9628 0 9.85791 3.2 9.85791 7.16Z" fill="#000000" />
			<path
				d="M25.8578 31.9399C29.6708 31.9399 32.7618 28.7343 32.7618 24.78C32.7618 20.8256 29.6708 17.62 25.8578 17.62C22.0448 17.62 18.9539 20.8256 18.9539 24.78C18.9539 28.7343 22.0448 31.9399 25.8578 31.9399Z"
				fill="#000000"
			/>
			<path d="M9.85791 24.7801C9.85791 28.72 12.9435 31.9401 16.7619 31.9401V17.64C12.9628 17.64 9.85791 20.84 9.85791 24.7801Z" fill="#000000" />
			<path d="M0.761841 24.84C0.761841 28.8 3.84742 32 7.66584 32V17.7C3.84742 17.7 0.761841 20.9 0.761841 24.84Z" fill="#000000" />
		</svg>
	);
}

/**
 * Pexels Icon.
 */
export function PexelsIcon() {
	return (
		<svg width="32px" height="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
			<path d="M2 0h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#05A081"></path>
			<path d="M13 21h3.863v-3.752h1.167a3.124 3.124 0 1 0 0-6.248H13v10zm5.863 2H11V9h7.03a5.124 5.124 0 0 1 .833 10.18V23z" fill="#fff"></path>
		</svg>
	);
}
