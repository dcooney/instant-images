import axios from "axios";
import React from "react";
import API from "../constants/API.js";
import generateAttribution from "../functions/generateAttribution.js";
import getProp from "../functions/getProp";

class Photo extends React.Component {
	constructor(props) {
		super(props);

		this.provider = this.props.provider;
		this.api_provider = API[this.provider];
		this.api_key = instant_img_localize[`${this.provider}_app_id`];

		const result = this.props.result;
		this.id = result.id;
		this.thumb = getProp(this.provider, result, "thumb");
		this.img = getProp(this.provider, result, "img");
		this.full_size = getProp(this.provider, result, "full_size");
		this.author = getProp(this.provider, result, "author");
		this.img_title = `${instant_img_localize.photo_by} ${this.author}`;
		this.filename = result.id;
		this.title = this.img_title;
		this.alt = result.alt_description ? result.alt_description : null;
		this.alt = this.alt === null ? "" : this.alt;
		this.caption = "";

		this.user = getProp(this.provider, result, "user");
		this.name = getProp(this.provider, result, "name");
		this.user_photo = getProp(this.provider, result, "user_photo");
		this.user_url = getProp(this.provider, result, "user_url");
		this.link = getProp(this.provider, result, "link");
		this.likes = getProp(this.provider, result, "likes");
		this.attribution = generateAttribution(
			this.provider,
			this.user_url,
			this.name
		);

		this.view_all = instant_img_localize.view_all;
		this.inProgress = false;
		this.container = document.querySelector(".instant-img-container");
		this.showTooltip = this.props.showTooltip.bind(this);
		this.hideTooltip = this.props.hideTooltip.bind(this);

		// Gutenberg Sidebar
		this.setAsFeaturedImage = false;
		this.insertIntoPost = false;
		this.is_media_router = this.props.mediaRouter;
		this.is_block_editor = this.props.blockEditor;
		this.SetFeaturedImage = this.props.SetFeaturedImage;
		this.InsertImage = this.props.InsertImage;

		// Display controls in Gutenberg Sidebar Only
		this.displayGutenbergControl = this.is_block_editor ? true : false;

		// Photo state
		this.state = {
			filename: this.filename,
			title: this.title,
			alt: this.alt,
			caption: this.caption,
		};

		this.captionRef = React.createRef();
	}

	/**
	 * Function to trigger the image download.
	 *
	 * @param {Element} e The current download item.
	 * @since 4.3
	 */
	download(e) {
		e.preventDefault();
		const self = this;

		let target = e.currentTarget; // get current <a/>
		const photo = target.parentElement.parentElement.parentElement; // Get parent .photo el
		const notice = photo.querySelector(".notice-msg"); // Locate .notice-msg div

		if (!target.classList.contains("upload")) {
			// If target is .download-photo, switch target definition
			target = photo.querySelector("a.upload");
		}

		if (target.classList.contains("success") || this.inProgress) {
			return false; // Exit if already uploaded or in progress.
		}
		this.inProgress = true;

		target.classList.add("uploading");
		photo.classList.add("in-progress");

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
			id: target.getAttribute("data-id"),
			image_url: target.getAttribute("data-url"),
			filename: target.getAttribute("data-id") + ".jpg",
			custom_filename: target.getAttribute("data-filename"),
			title: target.getAttribute("data-title"),
			alt: target.getAttribute("data-alt"),
			caption: target.getAttribute("data-caption"),
			parent_id: instant_img_localize.parent_id,
		};

		// Config Params
		const config = {
			headers: {
				"X-WP-Nonce": instant_img_localize.nonce,
				"Content-Type": "application/json",
			},
		};

		axios
			.post(api, JSON.stringify(data), config)
			.then(function (res) {
				let response = res.data;

				if (response) {
					// Successful response from server
					let success = response.success;
					let id = response.id;
					let attachment = response.attachment;
					let admin_url = response.admin_url;
					let msg = response.msg;

					if (success) {
						// Edit URL
						let edit_url = `${admin_url}post.php?post=${attachment.id}&action=edit`;

						// Success/Upload Complete
						self.uploadComplete(
							target,
							photo,
							msg,
							edit_url,
							attachment.id
						);

						// Trigger Download Counter at Unsplash.
						if (self.provider === "unsplash") {
							self.triggerUnsplashDownload(id);
						}

						// Set Featured Image [Gutenberg Sidebar]
						if (self.displayGutenbergControl && self.setAsFeaturedImage) {
							self.SetFeaturedImage(attachment.id);
							self.setAsFeaturedImage = false;
							self.closeMediaModal();
						}

						// Insert Image [Gutenberg Sidebar]
						if (self.displayGutenbergControl && self.insertIntoPost) {
							if (attachment.url) {
								self.InsertImage(
									attachment.url,
									attachment.caption,
									attachment.alt
								);
								self.closeMediaModal();
							}
							self.insertIntoPost = false;
						}

						// If is media popup, redirect user to media-upload settings
						if (
							self.container.dataset.mediaPopup === "true" &&
							!self.is_block_editor
						) {
							window.location =
								"media-upload.php?type=image&tab=library&attachment_id=" +
								attachment.id;
						}
					} else {
						// Error
						self.uploadError(target, photo, notice, msg);
					}
				} else {
					// Error
					self.uploadError(
						target,
						photo,
						notice,
						instant_img_localize.error_upload
					);
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	/**
	 * Function to trigger download action at unsplash.com
	 * This is used to give authors download credits and nothing more
	 *
	 * @param {string} id The ID of the image
	 * @since 3.1
	 */
	triggerUnsplashDownload(id) {
		const url = `${this.api_provider.photo_api}/${id}/download/${this.api_provider.api_query_var}${this.api_key}`;
		fetch(url)
			.then((data) => data.json())
			.then(function (data) {
				// Success, nothing else happens here
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	/**
	 * Function used to trigger a download and then set as featured image
	 *
	 * @param {Element} e The clicked element.
	 * @since 4.0
	 */
	setFeaturedImageClick(e) {
		const target = e.currentTarget;
		if (!target) {
			return false;
		}

		this.hideTooltip(e);
		const parent = target.parentNode.parentNode.parentNode;
		const photo = parent.querySelector("a.upload");
		if (photo) {
			this.setAsFeaturedImage = true;
			photo.click();
		}
	}

	/**
	 * Function used to insert an image directly into the block (Gutenberg) editor.
	 *
	 * @param {Element} e The clicked element.
	 * @since 4.0
	 */
	insertImageIntoPost(e) {
		let target = e.currentTarget;
		if (!target) {
			return false;
		}

		this.hideTooltip(e);
		let parent = target.parentNode.parentNode.parentNode;
		let photo = parent.querySelector("a.upload");
		if (photo) {
			this.insertIntoPost = true;
			photo.click();
		}
	}

	/**
	 * Function runs when upload has completed.
	 *
	 * @param {Element} target The clicked item.
	 * @param {Element} photo  The `.photo` element.
	 * @param {string}  msg    The Success Msg.
	 * @param {string}  url    The attachment edit link.
	 * @param {string}  id     The attachment id.
	 * @since 3.0
	 */
	uploadComplete(target, photo, msg, url, id) {
		this.setImageTitle(target, msg);

		photo.classList.remove("in-progress");
		photo.classList.add("uploaded");

		photo.querySelector(".edit-photo").style.display = "none"; // Hide edit-photo button
		photo.querySelector(".edit-photo-admin").style.display = "inline-block"; // Show edit-photo-admin button
		photo.querySelector(".edit-photo-admin").href = url; // Add admin edit link
		photo.querySelector(".edit-photo-admin").target = "_balnk"; // Add new window

		target.classList.remove("uploading");
		target.classList.remove("resizing");
		target.classList.add("success");
		this.inProgress = false;

		// Remove uploaded and success states after 7.5 seconds.
		setTimeout(function () {
			photo.classList.remove("uploaded");
			target.classList.remove("success");
		}, 7500);

		// Gutenberg Sidebar
		if (this.is_block_editor) {
			photo.querySelector(".insert").style.display = "none"; // Hide insert button
			photo.querySelector(".set-featured").style.display = "none"; // Hide set-featured button
		}

		// Media Router
		this.mediaRouter(id);

		// Deprecated in 4.3
		// Was previously used in the Media Popup Context.
		// Refresh Media Library contents on edit pages
		if (this.container.classList.contains("editor")) {
			if (typeof wp.media != "undefined") {
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
	 * Refresh Media Modal and select item after it's been uploaded
	 *
	 * @param {string} id The media modal ID.
	 * @since 4.3
	 */
	mediaRouter(id) {
		if (
			this.is_media_router &&
			wp.media &&
			wp.media.frame &&
			wp.media.frame.el
		) {
			let mediaModal = wp.media.frame.el;
			let mediaTab = mediaModal.querySelector("#menu-item-browse");
			if (mediaTab) {
				// Open the 'Media Library' tab
				mediaTab.click();
			}

			// Delay to allow for tab switching
			setTimeout(function () {
				if (wp.media.frame.content.get() !== null) {
					//this forces a refresh of the content
					wp.media.frame.content.get().collection._requery(true);

					//optional: reset selection
					//wp.media.frame.content.get().options.selection.reset();
				}

				// Select the attached that was just uploaded.
				var selection = wp.media.frame.state().get("selection");
				var selected = parseInt(id);
				selection.reset(selected ? [wp.media.attachment(selected)] : []);
			}, 150);
		}
	}

	/**
	 * Function runs when error occurs on upload or resize.
	 *
	 * @param {Element} target Current clicked item/
	 * @param {Element} photo  The `.photo` element.
	 * @param {Element} notice The notice element.
	 * @param {string}  msg    Error Msg.
	 * @since 3.0
	 */
	uploadError(target, photo, notice, msg) {
		target.classList.remove("uploading");
		target.classList.remove("resizing");
		target.classList.add("errors");
		this.setImageTitle(target, msg);
		this.inProgress = false;
		notice.classList.add("has-error");
		console.warn(msg);
	}

	/**
	 * Set the title attribute of target.
	 *
	 * @param {Element} e   The current clicked element.
	 * @param {string}  msg The title Msg from JSON.
	 * @since 3.0
	 */
	setImageTitle(target, msg) {
		target.setAttribute("title", msg); // Remove 'Click to upload...', set new value
	}

	/**
	 * Displays the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	showEditScreen(e) {
		e.preventDefault();
		const el = e.currentTarget;
		this.hideTooltip(e);
		const photo = el.closest(".photo");
		const editScreen = photo.querySelector(".edit-screen");

		editScreen.classList.add("editing"); // Show edit screen

		// Set focus on edit screen
		setTimeout(function () {
			editScreen.focus();
		}, 150);
	}

	/**
	 * Handles the change event for the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	handleEditChange(e) {
		const target = e.target.name;

		if (target === "filename") {
			this.setState({
				filename: e.target.value,
			});
		}
		if (target === "title") {
			this.setState({
				title: e.target.value,
			});
		}
		if (target === "alt") {
			this.setState({
				alt: e.target.value,
			});
		}
		if (target === "caption") {
			this.setState({
				caption: e.target.value,
			});
		}
	}

	/**
	 * Handles the save event for the edit screen
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	saveEditChange(e) {
		let el = e.currentTarget;
		let photo = el.closest(".photo");

		// Filename
		let filename = photo.querySelector('input[name="filename"]');
		this.filename = filename.value;

		// Title
		let title = photo.querySelector('input[name="title"]');
		this.title = title.value;

		// Alt
		let alt = photo.querySelector('input[name="alt"]');
		this.alt = alt.value;

		// Caption
		let caption = photo.querySelector('textarea[name="caption"]');
		this.caption = caption.value;

		photo.querySelector(".edit-screen").classList.remove("editing"); // Hide edit screen
		photo.querySelector("a.upload").click();
	}

	/**
	 * Handles the cancel event for the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	cancelEditChange(e) {
		let el = e.currentTarget;
		let photo = el.closest(".photo");
		if (photo) {
			let target = photo.querySelector("a.upload");

			// Filename
			let filename = photo.querySelector('input[name="filename"]');
			filename.value = filename.dataset.original;
			this.setState({
				filename: filename.value,
			});

			// Title
			let title = photo.querySelector('input[name="title"]');
			title.value = title.dataset.original;
			this.setState({
				title: title.value,
			});

			// Alt
			let alt = photo.querySelector('input[name="alt"]');
			alt.value = alt.dataset.original;
			this.setState({
				alt: alt.value,
			});

			// Caption
			let caption = photo.querySelector('textarea[name="caption"]');
			caption.value = caption.dataset.original;
			this.setState({
				caption: caption.value,
			});

			photo.querySelector(".edit-screen").classList.remove("editing"); // Hide edit screen
			target.focus();
		}
	}

	/**
	 * Close the media modal after an action.
	 *
	 * @since 4.3
	 */
	closeMediaModal() {
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
	addAttribution(e) {
		e.preventDefault();
		const self = this;
		this.captionRef.current.value = this.attribution;
		this.setState({
			caption: self.attribution,
		});
	}

	render() {
		const likeTxt =
			parseInt(this.likes) === 1
				? instant_img_localize.likes
				: instant_img_localize.likes_plural;

		return (
			<article className="photo">
				<div className="photo--wrap">
					<div className="img-wrap">
						<a
							className="upload loaded"
							href={this.full_size}
							data-id={this.id}
							data-url={this.full_size}
							data-filename={this.state.filename}
							data-title={this.state.title}
							data-alt={this.state.alt}
							data-caption={this.state.caption}
							title={instant_img_localize.upload}
							onClick={(e) => this.download(e)}
						>
							<img src={this.img} alt="" />
							<div className="status" />
						</a>

						<div className="notice-msg" />

						<div className="user-controls">
							<a
								className="user fade"
								href={this.user_url}
								target="_blank"
								title={
									this.provider === "unsplash"
										? `${this.view_all} @ ${this.user}`
										: `${this.view_all} ${this.name}`
								}
							>
								<div className="user-wrap">
									{this.user_photo && this.user_photo.length > 0 && (
										<img src={this.user_photo} />
									)}
									{this.provider === "unsplash"
										? this.user
										: this.name}
								</div>
							</a>
							<div className="photo-options">
								{this.displayGutenbergControl && (
									<button
										type="button"
										className="set-featured fade"
										data-title={instant_img_localize.set_as_featured}
										onMouseEnter={(e) => this.showTooltip(e)}
										onMouseLeave={(e) => this.hideTooltip(e)}
										onClick={(e) => this.setFeaturedImageClick(e)}
									>
										<i
											className="fa fa-picture-o"
											aria-hidden="true"
										></i>
										<span className="offscreen">
											{instant_img_localize.set_as_featured}
										</span>
									</button>
								)}
								{this.displayGutenbergControl && (
									<button
										type="button"
										className="insert fade"
										data-title={instant_img_localize.insert_into_post}
										onMouseEnter={(e) => this.showTooltip(e)}
										onMouseLeave={(e) => this.hideTooltip(e)}
										onClick={(e) => this.insertImageIntoPost(e)}
									>
										<i className="fa fa-plus" aria-hidden="true"></i>
										<span className="offscreen">
											{instant_img_localize.insert_into_post}
										</span>
									</button>
								)}

								<a
									href="#"
									className="edit-photo-admin fade"
									data-title={instant_img_localize.edit_upload}
									onMouseEnter={(e) => this.showTooltip(e)}
									onMouseLeave={(e) => this.hideTooltip(e)}
								>
									<i className="fa fa-pencil" aria-hidden="true"></i>
									<span className="offscreen">
										{instant_img_localize.edit_upload}
									</span>
								</a>

								<button
									type="button"
									className="edit-photo fade"
									data-title={instant_img_localize.edit_details}
									onMouseEnter={(e) => this.showTooltip(e)}
									onMouseLeave={(e) => this.hideTooltip(e)}
									onClick={(e) => this.showEditScreen(e)}
								>
									<i className="fa fa-cog" aria-hidden="true"></i>
									<span className="offscreen">
										{instant_img_localize.edit_details}
									</span>
								</button>
							</div>
						</div>

						<div className="options">
							<span
								className="likes tooltip--above"
								data-title={this.likes + " " + likeTxt}
								onMouseEnter={(e) => this.showTooltip(e)}
								onMouseLeave={(e) => this.hideTooltip(e)}
							>
								<i
									className="fa fa-heart heart-like"
									aria-hidden="true"
								></i>{" "}
								{this.likes}
							</span>
							<a
								className="tooltip--above"
								href={this.link}
								data-title={
									this.provider === "unsplash"
										? instant_img_localize.view_on_unsplash
										: instant_img_localize.view_on_pixabay
								}
								onMouseEnter={(e) => this.showTooltip(e)}
								onMouseLeave={(e) => this.hideTooltip(e)}
								target="_blank"
							>
								<i
									className="fa fa-external-link"
									aria-hidden="true"
								></i>
								<span className="offscreen">
									{this.provider === "unsplash"
										? instant_img_localize.view_on_unsplash
										: instant_img_localize.view_on_pixabay}
								</span>
							</a>
						</div>
					</div>

					<div className="edit-screen" tabIndex="0">
						<div className="edit-screen--title">
							<div>
								<p className="heading">
									{instant_img_localize.edit_details}
								</p>
								<p>{instant_img_localize.edit_details_intro}</p>
							</div>
							<div
								className="preview"
								style={{ backgroundImage: `url(${this.thumb})` }}
							></div>
						</div>
						<label>
							<span>{instant_img_localize.edit_filename}:</span>
							<input
								type="text"
								name="filename"
								data-original={this.filename}
								placeholder={this.filename}
								value={this.state.filename}
								onChange={(e) => this.handleEditChange(e)}
							/>
							<em>.jpg</em>
						</label>
						<label>
							<span>{instant_img_localize.edit_title}:</span>
							<input
								type="text"
								name="title"
								data-original={this.title}
								placeholder={this.title}
								value={this.state.title || ""}
								onChange={(e) => this.handleEditChange(e)}
							/>
						</label>
						<label>
							<span>{instant_img_localize.edit_alt}:</span>
							<input
								type="text"
								name="alt"
								data-original={this.alt}
								value={this.state.alt || ""}
								onChange={(e) => this.handleEditChange(e)}
							/>
						</label>
						<label>
							<span>{instant_img_localize.edit_caption}:</span>
							<textarea
								rows="4"
								name="caption"
								data-original=""
								onChange={(e) => this.handleEditChange(e)}
								value={this.state.caption || ""}
								ref={this.captionRef}
							></textarea>
						</label>
						<div className="add-attribution-row">
							<button
								onClick={(e) => this.addAttribution(e)}
								type="button"
							>
								{instant_img_localize.attribution}
							</button>
						</div>
						<div className="edit-screen--controls">
							<button
								type="button"
								className="button"
								onClick={(e) => this.cancelEditChange(e)}
							>
								{instant_img_localize.cancel}
							</button>{" "}
							&nbsp;
							<button
								type="button"
								className="button button-primary"
								onClick={(e) => this.saveEditChange(e)}
							>
								{instant_img_localize.upload_now}
							</button>
						</div>
					</div>
				</div>
			</article>
		);
	}
}

export default Photo;
