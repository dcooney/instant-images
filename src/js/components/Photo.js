import axios from "axios";
import API from "../constants/API.js";
import capitalizeFirstLetter from "../functions/capitalizeFirstLetter";
import unsplashDownload from "../functions/unsplashDownload";

class Photo extends React.Component {
	constructor(props) {
		super(props);

		this.provider = this.props.provider;
		this.api_provider = API[this.provider];

		const result = this.props.result;
		this.id = result.id;
		this.filename = this.id;
		this.permalink = result && result.permalink;
		this.extension = result && result.extension ? result.extension : "jpg";
		this.likes = result && result.likes;
		this.attribution = result && result.attribution ? result.attribution : "";
		this.auto_attribution =
			instant_img_localize.auto_attribution === "1" ? true : false;
		this.dimensions = result?.dimensions ? result.dimensions : "";

		this.thumb = result && result.urls && result.urls.thumb;
		this.full = result && result.urls && result.urls.full;
		this.download_url = result && result.urls && result.urls.download_url;

		this.user_id = result && result.user && result.user.id;
		this.user_name = result && result.user && result.user.name;
		this.user_photo = result && result.user && result.user.photo;
		this.user_url = result && result.user && result.user.url;

		this.title = result && result.title ? result.title : "";
		this.alt = result && result.alt ? result.alt : "";
		this.caption = result?.caption ? result.caption : "";
		this.caption = this.auto_attribution ? this.attribution : this.caption; // Set auto attributions.

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

		// Refs.
		this.photo = React.createRef();
		this.photoUpload = React.createRef();
		this.editScreen = React.createRef();
		this.captionRef = React.createRef();
		this.noticeMsg = React.createRef();
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

		let target = e.currentTarget;
		const photo = self.photo.current;
		const notice = self.noticeMsg.current;

		if (!target.classList.contains("upload")) {
			// If target is .download-photo, switch target definition
			target = self.photoUpload.current; // a.upload.
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
			provider: this.provider,
			id: target.getAttribute("data-id"),
			image_url: target.getAttribute("data-url"),
			filename: target.getAttribute("data-id"),
			extension: this.extension,
			custom_filename: target.getAttribute("data-filename"),
			title: target.getAttribute("data-title"),
			alt: target.getAttribute("data-alt"),
			caption: target.getAttribute("data-caption"),
			parent_id: instant_img_localize.parent_id,
			lang: instant_img_localize.lang,
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
				const response = res.data;

				if (response) {
					// Successful response from server
					const success = response.success;
					const attachment = response.attachment;
					const admin_url = response.admin_url;
					const msg = response.msg;

					if (success) {
						// Edit URL
						let edit_url = `${admin_url}post.php?post=${attachment.id}&action=edit`;

						// Success/Upload Complete
						self.uploadComplete(target, photo, msg, edit_url, attachment.id);

						// Trigger a download at Unsplash.
						if (self.provider === "unsplash" && self.download_url) {
							unsplashDownload(self.download_url);
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
						self.uploadError(target, notice, msg);
					}
				} else {
					// Error
					self.uploadError(target, notice, instant_img_localize.error_upload);
				}
			})
			.catch(function (error) {
				console.warn(error);
			});
	}

	/**
	 * Function used to trigger a download and then set as featured image
	 *
	 * @param {Element} e The clicked element.
	 * @since 4.0
	 */
	setFeaturedImageClick(e) {
		this.hideTooltip(e);
		const photo = this.photoUpload.current;
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
		this.hideTooltip(e);
		const photo = this.photoUpload.current;
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

		// Remove uploaded and success states after 5 seconds.
		setTimeout(function () {
			photo.classList.remove("uploaded");
			target.classList.remove("success");
		}, 5000);

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
	 * @param {Element} target Current clicked item.
	 * @param {Element} notice The notice element.
	 * @param {string}  msg    Error Msg.
	 * @since 3.0
	 */
	uploadError(target, notice, msg) {
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
		const self = this;
		this.hideTooltip(e);

		// Get all open edit screens.
		const openEdits = document.querySelectorAll(".edit-screen.editing");
		if (openEdits) {
			// Close open edit screens.
			openEdits.forEach((edit) => {
				edit.classList.remove("editing");
			});
		}

		// Show edit screen
		self.editScreen.current.classList.add("editing");

		// Set focus on edit screen
		setTimeout(function () {
			self.editScreen.current.focus({ preventScroll: true });
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
	 * @since 3.2
	 */
	saveEditChange() {
		// Filename
		let filename = this.photo.current.querySelector('input[name="filename"]');
		this.filename = filename.value;

		// Title
		let title = this.photo.current.querySelector('input[name="title"]');
		this.title = title.value;

		// Alt
		let alt = this.photo.current.querySelector('input[name="alt"]');
		this.alt = alt.value;

		// Caption
		let caption = this.photo.current.querySelector('textarea[name="caption"]');
		this.caption = caption.value;

		// Hide edit screen.
		this.editScreen.current.classList.remove("editing");

		// Trigger photo click.
		this.photoUpload.current.click();
	}

	/**
	 * Handles the cancel event for the edit screen.
	 *
	 * @param {Element} e The target element.
	 * @since 3.2
	 */
	cancelEditChange(e) {
		// Filename
		const filename = this.photo.current.querySelector('input[name="filename"]');
		filename.value = filename.dataset.original;
		this.setState({
			filename: filename.value,
		});

		// Title
		const title = this.photo.current.querySelector('input[name="title"]');
		title.value = title.dataset.original;
		this.setState({
			title: title.value,
		});

		// Alt
		const alt = this.photo.current.querySelector('input[name="alt"]');
		alt.value = alt.dataset.original;
		this.setState({
			alt: alt.value,
		});

		// Caption
		const caption = this.photo.current.querySelector(
			'textarea[name="caption"]'
		);
		caption.value = caption.dataset.original;
		this.setState({
			caption: caption.value,
		});

		// Hide edit screen
		this.editScreen.current.classList.remove("editing");

		// Set focus back on photo.
		this.photoUpload.current.focus({ preventScrol: true });
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

		const attribution = this.attribution;

		// Set form value.
		this.captionRef.current.value = attribution;

		// Set the state.
		this.setState({
			caption: attribution,
		});
	}

	render() {
		const likeTxt =
			parseInt(this.likes) === 1
				? instant_img_localize.likes
				: instant_img_localize.likes_plural;

		return (
			<article className="photo" ref={this.photo}>
				<div className="photo--wrap">
					<div className="img-wrap">
						<a
							className="upload loaded"
							href={this.full}
							ref={this.photoUpload}
							data-id={this.id}
							data-url={this.full}
							data-filename={this.state.filename}
							data-title={this.state.title}
							data-alt={this.state.alt}
							data-caption={this.state.caption}
							title={instant_img_localize.upload}
							onClick={(e) => this.download(e)}
						>
							<img src={this.thumb} alt={this.alt} />
							<div className="status" />
						</a>

						<div className="notice-msg" ref={this.noticeMsg} />

						<div className="user-controls">
							<a
								className="user fade"
								href={this.user_url}
								rel="noopener noreferrer"
								target="_blank"
								title={`${instant_img_localize.view_all} @ ${this.user_name}`}
							>
								<div className="user-wrap">
									{this.user_photo && this.user_photo.length > 0 && (
										<img className="user-wrap--photo" src={this.user_photo} />
									)}
									{this.user_name}
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
										<i className="fa fa-picture-o" aria-hidden="true"></i>
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
							{this.likes ? (
								<span
									className="likes tooltip--above"
									data-title={this.likes + " " + likeTxt}
									onMouseEnter={(e) => this.showTooltip(e)}
									onMouseLeave={(e) => this.hideTooltip(e)}
								>
									<i className="fa fa-heart heart-like" aria-hidden="true"></i>{" "}
									{this.likes}
								</span>
							) : null}
							<a
								className="tooltip--above"
								href={this.permalink}
								data-title={`${
									instant_img_localize.open_external
								} ${capitalizeFirstLetter(this.provider)}`}
								onMouseEnter={(e) => this.showTooltip(e)}
								onMouseLeave={(e) => this.hideTooltip(e)}
								rel="noopener noreferrer"
								target="_blank"
							>
								<i className="fa fa-external-link" aria-hidden="true"></i>
								<span className="offscreen">
									{`${
										instant_img_localize.open_external
									} ${capitalizeFirstLetter(this.provider)}`}
								</span>
							</a>
						</div>
					</div>

					<div className="edit-screen" tabIndex="0" ref={this.editScreen}>
						<div className="edit-screen--title">
							<div>
								<p className="heading">{instant_img_localize.edit_details}</p>
								{this.dimensions && this.dimensions.length > 0 && (
									<p className="dimensions">{this.dimensions}</p>
								)}
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
							<em>.{this.extension}</em>
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
								data-original={this.caption}
								onChange={(e) => this.handleEditChange(e)}
								value={this.state.caption || ""}
								ref={this.captionRef}
							></textarea>
						</label>
						{this.attribution ? (
							<div className="add-attribution-row">
								<button onClick={(e) => this.addAttribution(e)} type="button">
									{instant_img_localize.attribution}
								</button>
							</div>
						) : null}
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
								onClick={() => this.saveEditChange()}
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
