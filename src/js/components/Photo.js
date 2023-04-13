import { Fragment, useRef, useState } from "@wordpress/element";
import axios from "axios";
import insertImage from "../editor/plugin/utils/insertImage";
import setFeaturedImage from "../editor/plugin/utils/setFeaturedImage";
import {
	capitalizeFirstLetter,
	hideTooltip,
	showTooltip,
} from "../functions/helpers";
import unsplashDownload from "../functions/unsplashDownload";

/**
 * Render the Photo component.
 *
 * @param {Object} props The component props.
 * @return {JSX.Element} The Photo component.
 */
export default function Photo(props) {
	const { provider, result, mediaRouter = false, blockEditor = false } = props;

	const {
		id,
		permalink,
		title,
		alt,
		caption,
		extension = "jpg",
		likes,
		attribution,
		dimensions,
		urls,
		user,
	} = result;
	const { thumb, full, download_url } = urls;

	const filename = id;
	const user_name = user?.name;
	const user_photo = user?.photo;
	const user_url = user?.url;

	const container = document.querySelector(".instant-img-container");
	const likeDisplay =
		parseInt(likes) === 1
			? instant_img_localize.likes
			: instant_img_localize.likes_plural;

	const auto_attribution =
		instant_img_localize.auto_attribution === "1" ? true : false;
	const imageCaption = auto_attribution ? attribution : caption; // Set auto attribution.
	let inProgress = false;

	// Photo state.
	const [imageDetails, setImageDetails] = useState({
		filename,
		title,
		alt,
		caption: imageCaption,
	});

	const [editURL, setEditURL] = useState(""); // Edit URL state.

	// Refs.
	const photo = useRef();
	const upload = useRef();
	const editScreen = useRef();
	const captionRef = useRef();
	const noticeMsg = useRef();

	// Gutenberg Sidebar.
	let setAsFeaturedImage = false;
	let insertIntoPost = false;

	/**
	 * Function to trigger the image download.
	 *
	 * @param {Element} e The current download item.
	 * @since 4.3
	 */
	function download(e) {
		e.preventDefault();
		let target = e.currentTarget;
		const notice = noticeMsg.current;

		if (!target.classList.contains("upload")) {
			// If target is .download-photo, switch target definition
			target = upload.current; // a.upload.
		}

		if (target.classList.contains("success") || inProgress) {
			return false; // Exit if already uploaded or in progress.
		}

		inProgress = true;
		target.classList.add("uploading");
		photo.current.classList.add("in-progress");

		// Status messaging
		notice.innerHTML = instant_img_localize.saving;

		setTimeout(function () {
			// Change notice after 3 seconds
			notice.innerHTML = instant_img_localize.resizing;
			setTimeout(function () {
				// Change notice again after 5 seconds (Still resizing...)
				notice.innerHTML = instant_img_localize.resizing_still;
			}, 5000);
		}, 3000);

		// API URL
		const api = instant_img_localize.root + "instant-images/download/";

		// Data Params
		const data = {
			provider,
			id: target.getAttribute("data-id"),
			image_url: target.getAttribute("data-url"),
			filename: target.getAttribute("data-id"),
			extension,
			custom_filename: target.getAttribute("data-filename"),
			title: target.getAttribute("data-title"),
			alt: target.getAttribute("data-alt"),
			caption: target.getAttribute("data-caption"),
			parent_id: instant_img_localize.parent_id,
			lang: instant_img_localize.lang,
		};

		// Config Params
		const config = {
			credentials: "same-origin",
			headers: {
				"X-WP-Nonce": instant_img_localize.nonce,
				"Content-Type": "application/json",
			},
		};

		axios
			.post(api, JSON.stringify(data), config)
			.then(function (res) {
				const response = res.data;

				if (response) {
					// Successful response from server
					const success = response.success;
					const attachment = response.attachment;
					const admin_url = response.admin_url;
					const msg = response.msg;

					if (success) {
						const edit_url = `${admin_url}post.php?post=${attachment.id}&action=edit`; // Edit URL.
						setEditURL(edit_url);
						uploadComplete(target, msg, attachment.id); // Success/Upload Complete

						// Trigger a download at Unsplash.
						if (provider === "unsplash" && download_url) {
							unsplashDownload(download_url);
						}

						// Gutenberg sidebar plugin.
						if (blockEditor) {
							if (setAsFeaturedImage) {
								// Set Featured Image.
								setFeaturedImage(attachment.id);
								setAsFeaturedImage = false;
								closeMediaModal();
							}

							// Insert Image.
							if (insertIntoPost) {
								if (attachment.url) {
									insertImage(
										attachment.url,
										attachment.caption,
										attachment.alt
									);
									closeMediaModal();
								}
								insertIntoPost = false;
							}
						}

						// If is media popup, redirect user to media-upload settings
						if (container.dataset.mediaPopup === "true" && !blockEditor) {
							window.location =
								"media-upload.php?type=image&tab=library&attachment_id=" +
								attachment.id;
						}
					} else {
						// Error
						uploadError(target, notice, msg);
					}
				} else {
					// Error
					uploadError(target, notice, instant_img_localize.error_upload);
				}
			})
			.catch(function (error) {
				console.warn(error);
			});
	}

	/**
	 * Handler to send user to edit photo link after upload.
	 *
	 * @since 5.2.0
	 */
	function editAfterUpload() {
		if (editURL) {
			window.location = editURL;
		}
	}

	/**
	 * Function used to trigger a download and then set as featured image
	 *
	 * @param {Element} e The clicked element.
	 * @since 4.0
	 */
	function setFeaturedImageClick(e) {
		hideTooltip(e);
		if (upload.current) {
			setAsFeaturedImage = true;
			upload.current.click();
		}
	}

	/**
	 * Function used to insert an image directly into the block (Gutenberg) editor.
	 *
	 * @param {Element} e The clicked element.
	 * @since 4.0
	 */
	function insertImageIntoPost(e) {
		hideTooltip(e);
		if (upload.current) {
			insertIntoPost = true;
			upload.current.click();
		}
	}

	/**
	 * Upload complete function.
	 *
	 * @param {Element} target  Clicked item.
	 * @param {string}  msg     Success Msg.
	 * @param {string}  imageID Attachment id.
	 * @since 3.0
	 */
	function uploadComplete(target, msg, imageID) {
		setImageTitle(target, msg);

		photo.current.classList.remove("in-progress");
		photo.current.classList.add("uploaded");

		target.classList.remove("uploading");
		target.classList.remove("resizing");
		target.classList.add("success");
		inProgress = false;

		// Remove uploaded and success states after 3.5 seconds.
		setTimeout(function () {
			photo.current.classList.remove("uploaded");
			target.classList.remove("success");
		}, 3500);

		// Refresh Media Router/Modal.
		refreshMediaRouter(imageID);

		/**
		 * Deprecated in Instant Images 4.3.
		 * Was previously used in the Media Popup Context.
		 * Refresh Media Library contents on edit pages
		 */
		if (container.classList.contains("editor")) {
			if (typeof wp.media !== "undefined") {
				if (wp.media.frame.content.get() !== null) {
					wp.media.frame.content
						.get()
						.collection.props.set({ ignore: +new Date() });
					wp.media.frame.content.get().options.selection.reset();
				} else {
					wp.media.frame.library.props.set({ ignore: +new Date() });
				}
			}
		}
	}

	/**
	 * Refresh Media Modal and select item after it's been uploaded.
	 *
	 * @param {string} modalID The media modal ID.
	 * @since 4.3
	 */
	function refreshMediaRouter(modalID) {
		if (mediaRouter && wp.media && wp.media.frame && wp.media.frame.el) {
			const mediaModal = wp.media.frame.el;
			const mediaTab = mediaModal.querySelector("#menu-item-browse");
			if (mediaTab) {
				// Open the 'Media Library' tab.
				mediaTab.click();
			}

			// Delay to allow for tab switching
			setTimeout(function () {
				if (wp.media.frame.content.get() !== null) {
					// Force a refresh of the mdeia modal content.
					wp.media.frame.content.get().collection._requery(true);
				}

				// Select the attached that was just uploaded.
				const selection = wp.media.frame.state().get("selection");
				const selected = parseInt(modalID);
				selection.reset(selected ? [wp.media.attachment(selected)] : []);
			}, 100);
		}
	}

	/**
	 * Function runs when error occurs on upload or resize.
	 *
	 * @param {Element} target Current clicked item.
	 * @param {Element} notice The notice element.
	 * @param {string}  msg    Error Msg.
	 * @since 3.0
	 */
	function uploadError(target, notice, msg) {
		target.classList.remove("uploading");
		target.classList.remove("resizing");
		target.classList.add("errors");
		setImageTitle(target, msg);
		inProgress = false;
		notice.classList.add("has-error");
		console.warn(msg);
	}

	/**
	 * Set the title attribute of target.
	 *
	 * @param {Element} target Clicked element.
	 * @param {string}  msg    Title message from JSON.
	 * @since 3.0
	 */
	function setImageTitle(target, msg) {
		target.setAttribute("title", msg); // Remove 'Click to upload...', set new value
	}

	/**
	 * Displays the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	function showEditScreen(e) {
		e.preventDefault();
		hideTooltip(e);

		// Get all open edit screens and close them.
		const openEdits = document.querySelectorAll(".edit-screen.editing");
		if (openEdits) {
			openEdits.forEach((edit) => {
				edit.classList.remove("editing");
			});
		}

		// Show edit screen
		editScreen.current.classList.add("editing");

		// Set focus on edit screen
		setTimeout(function () {
			editScreen.current.focus({ preventScroll: true });
		}, 150);
	}

	/**
	 * Handles the change event for the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	function handleEditChange(e) {
		const target = e.target.name;
		switch (target) {
			case "filename":
				setImageDetails({ ...imageDetails, filename: e.target.value });
				break;

			case "title":
				setImageDetails({ ...imageDetails, title: e.target.value });
				break;

			case "alt":
				setImageDetails({ ...imageDetails, alt: e.target.value });
				break;

			case "caption":
				setImageDetails({ ...imageDetails, caption: e.target.value });
				break;
		}
	}

	/**
	 * Handles the Upload event from the edit screen.
	 *
	 * @since 3.2
	 */
	function uploadNow() {
		editScreen.current.classList.remove("editing"); // Hide edit screen.
		upload.current.click(); // Trigger click.
	}

	/**
	 * Cancel event for the edit screen.
	 *
	 * @since 3.2
	 */
	function cancelEdit() {
		// Reset image state.
		setImageDetails({
			filename,
			title,
			alt,
			caption,
		});

		// Hide edit screen
		editScreen.current.classList.remove("editing");

		// Set focus back on photo.
		upload.current.focus({ preventScrol: true });
	}

	/**
	 * Close the media modal after an action.
	 *
	 * @since 4.3
	 */
	function closeMediaModal() {
		const mediaModal = document.querySelector(".media-modal");
		if (mediaModal) {
			const closeBtn = mediaModal.querySelector("button.media-modal-close");
			if (!closeBtn) {
				return false;
			}
			closeBtn.click();
		}
	}

	/**
	 * Handles adding attribution for images.
	 *
	 * @param {Element} e The target element.
	 * @since 4.5
	 */
	function addAttribution(e) {
		e.preventDefault();
		captionRef.current.value = attribution; // Set form value.
		setImageDetails({ ...imageDetails, caption: attribution }); // Set caption state.
	}

	return (
		<article className="photo" ref={photo}>
			<div className="photo--wrap">
				<div className="img-wrap">
					<a
						className="upload loaded"
						href={full}
						ref={upload}
						data-id={id}
						data-url={full}
						data-filename={imageDetails.filename}
						data-title={imageDetails.title}
						data-alt={imageDetails.alt}
						data-caption={imageDetails.caption}
						title={instant_img_localize.upload}
						onClick={(e) => download(e)}
					>
						<img src={thumb} alt={alt} />
						<div className="status" />
					</a>

					<div className="notice-msg" ref={noticeMsg} />

					<div className="user-controls">
						<a
							className="user fade"
							href={user_url}
							rel="noopener noreferrer"
							target="_blank"
							title={`${instant_img_localize.view_all} @ ${user_name}`}
						>
							<div className="user-wrap">
								{user_photo?.length > 0 && (
									<img className="user-wrap--photo" src={user_photo} alt="" />
								)}
								{user_name}
							</div>
						</a>
						<div className="photo-options">
							{blockEditor && !editURL ? (
								<Fragment>
									<button
										type="button"
										className="set-featured fade"
										data-title={instant_img_localize.set_as_featured}
										onMouseEnter={(e) => showTooltip(e)}
										onMouseLeave={(e) => hideTooltip(e)}
										onClick={(e) => setFeaturedImageClick(e)}
									>
										<i className="fa fa-picture-o" aria-hidden="true"></i>
										<span className="offscreen">
											{instant_img_localize.set_as_featured}
										</span>
									</button>
									<button
										type="button"
										className="insert fade"
										data-title={instant_img_localize.insert_into_post}
										onMouseEnter={(e) => showTooltip(e)}
										onMouseLeave={(e) => hideTooltip(e)}
										onClick={(e) => insertImageIntoPost(e)}
									>
										<i className="fa fa-plus" aria-hidden="true"></i>
										<span className="offscreen">
											{instant_img_localize.insert_into_post}
										</span>
									</button>
								</Fragment>
							) : null}

							{editURL ? (
								<button
									onClick={() => editAfterUpload()}
									className="edit-photo-admin fade"
									data-title={instant_img_localize.edit_upload}
									onMouseEnter={(e) => showTooltip(e)}
									onMouseLeave={(e) => hideTooltip(e)}
								>
									<i className="fa fa-pencil" aria-hidden="true"></i>
									<span className="offscreen">
										{instant_img_localize.edit_upload}
									</span>
								</button>
							) : (
								<button
									onClick={(e) => showEditScreen(e)}
									className="edit-photo fade"
									data-title={instant_img_localize.edit_details}
									onMouseEnter={(e) => showTooltip(e)}
									onMouseLeave={(e) => hideTooltip(e)}
								>
									<i className="fa fa-cog" aria-hidden="true"></i>
									<span className="offscreen">
										{instant_img_localize.edit_details}
									</span>
								</button>
							)}
						</div>
					</div>

					<div className="options">
						{likes ? (
							<span
								className="likes tooltip--above"
								data-title={likes + " " + likeDisplay}
								onMouseEnter={(e) => showTooltip(e)}
								onMouseLeave={(e) => hideTooltip(e)}
							>
								<i className="fa fa-heart heart-like" aria-hidden="true"></i>{" "}
								{likes}
							</span>
						) : null}
						<a
							className="tooltip--above"
							href={permalink}
							data-title={`${
								instant_img_localize.open_external
							} ${capitalizeFirstLetter(provider)}`}
							onMouseEnter={(e) => showTooltip(e)}
							onMouseLeave={(e) => hideTooltip(e)}
							rel="noopener noreferrer"
							target="_blank"
						>
							<i className="fa fa-external-link" aria-hidden="true"></i>
							<span className="offscreen">{`${
								instant_img_localize.open_external
							} ${capitalizeFirstLetter(provider)}`}</span>
						</a>
					</div>
				</div>

				<div className="edit-screen" tabIndex="0" ref={editScreen}>
					<div className="edit-screen--title">
						<div>
							<p className="heading">{instant_img_localize.edit_details}</p>
							{dimensions && dimensions.length > 0 && (
								<p className="dimensions">{dimensions}</p>
							)}
						</div>
						<div
							className="preview"
							style={{ backgroundImage: `url(${thumb})` }}
						></div>
					</div>
					<label>
						<span>{instant_img_localize.edit_filename}:</span>
						<input
							type="text"
							name="filename"
							data-original={filename}
							placeholder={imageDetails.filename}
							value={imageDetails.filename}
							onChange={(e) => handleEditChange(e)}
						/>
						<em>.{extension}</em>
					</label>
					<label>
						<span>{instant_img_localize.edit_title}:</span>
						<input
							type="text"
							name="title"
							data-original={title}
							placeholder={title}
							value={imageDetails.title || ""}
							onChange={(e) => handleEditChange(e)}
						/>
					</label>
					<label>
						<span>{instant_img_localize.edit_alt}:</span>
						<input
							type="text"
							name="alt"
							data-original={alt}
							value={imageDetails.alt || ""}
							onChange={(e) => handleEditChange(e)}
						/>
					</label>
					<label>
						<span>{instant_img_localize.edit_caption}:</span>
						<textarea
							rows="4"
							name="caption"
							data-original={imageCaption}
							onChange={(e) => handleEditChange(e)}
							value={imageDetails.caption || ""}
							ref={captionRef}
						></textarea>
					</label>
					{attribution ? (
						<div className="add-attribution-row">
							<button onClick={(e) => addAttribution(e)} type="button">
								{instant_img_localize.attribution}
							</button>
						</div>
					) : null}
					<div className="edit-screen--controls">
						<button
							type="button"
							className="button"
							onClick={(e) => cancelEdit(e)}
						>
							{instant_img_localize.cancel}
						</button>{" "}
						&nbsp;
						<button
							type="button"
							className="button button-primary"
							onClick={() => uploadNow()}
						>
							{instant_img_localize.upload_now}
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
