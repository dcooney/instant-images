=== Instant Images - One Click Unsplash Uploads ===
Contributors: dcooney, connekthq
Donate link: https://connekthq.com/donate/
Tags: stock photo, unsplash, prototyping, photos, upload, media library, image upload, free photos
Requires at least: 4.0
Tested up to: 5.1.1
Stable tag: 4.0.1
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

One click uploads of Unsplash photos directly to your WordPress media library.

== Description ==

Instantly upload photos from Unsplash to your website without leaving WordPress!

**Instant Images** is the fastest and easiest way to upload high quality FREE photos from [unsplash.com](http://unsplash.com) directly to your media library.

[youtube https://www.youtube.com/watch?v=s6Q7Kfi2f1c]

The perfect tool for users who want to save time and frustration by uploading images directly inside their WordPress installation and for developers who want to prototype and develop using real world imagery.

**[Visit Plugin Website](https://connekthq.com/plugins/instant-images/)**

= Features =

* **Image Search** - The Instant Images search let’s you quickly find and upload images for any subject in a matter of seconds!
* **Time Saver** - Quickly upload amazing stock photos without leaving the comfort of your WordPress admin.
* **Theme/Plugin Developers** - A great tool for developers who want to prototype and develop using real world imagery.
* **Gutenberg** - Instant Images directly integrates with Gutenberg as a plugin sidebar.
* **Edit Image Metadata** - Easily edit image filename, alt text and caption prior to uploading to your media library.
* **Easy to Use** - It couldn't get much more simple, just click an image and it's automatically uploaded to your media library for use on your site.



***

= Tested Browsers =

* Firefox (Mac + PC)
* Chrome (Mac + PC)
* Safari (Mac)
* IE 11 >

***

= How Can You Contribute? =
Pull requests can be submitted via [GitHub](https://github.com/dcooney/instant-images).

***


= Website =
[https://connekthq.com/plugins/instant-images/](https://connekthq.com/plugins/instant-images/)

***


== Frequently Asked Questions ==

= Can I legally use these photos on my website? =
All photos published on Unsplash are licensed under Creative Commons Zero which means you can copy, modify, distribute and use the photos for free, including commercial purposes, without asking permission from or providing attribution to the photographer or Unsplash.
[Learn More](http://creativecommons.org/publicdomain/zero/1.0/)


= Can I search for individual photos by ID? =
Yes! You can enter `id:{photo_id}` into the search box to return a single result.
e.g. `id:YiUi00uqKk8`


= I'm unable to download images, what is the cause of this? =
Unfortunately, there are a number of reasons why Instant Images may not work in your current hosting/server environment. Please read through the [FAQ on our website](https://connekthq.com/plugins/instant-images/#faqs) to view some potential causes.


= Are the images upload to the Media Library? =
Yes, once clicked, the images are processed on the server then uploaded to the Media Library into the various sizes set in your theme.


= Are raw uploads stored on the server? =
No, once an image has be uploaded and resized the raw download will be removed from your server.


= Are there server requirements? =
Yes, this plugin is required to write temporary images into an `/instant-images` directory within your WordPress `uploads` directory for image processing prior to being uploaded to the media library.

Some hosts lock down their servers and you may be required to update your php.ini or .htaccess in order to use this plugin.


== Installation ==

How to install Instant Images.

= Using The WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Search for 'Instant Images'
3. Click 'Install Now'
4. Activate the plugin on the Plugin dashboard

= Uploading in WordPress Dashboard =

1. Navigate to the 'Add New' in the plugins dashboard
2. Navigate to the 'Upload' area
3. Select `instant-images.zip` from your computer
4. Click 'Install Now'
5. Activate the plugin in the Plugin dashboard

= Using FTP =

1. Download `instant-images.zip`
2. Extract the `instant-images` directory to your computer
3. Upload the `instant-images` directory to the `/wp-content/plugins/` directory
4. Activate the plugin in the Plugin dashboard


== Screenshots ==

1. Dashboard - Browse, search and upload images to your WordPress media library
2. Search - Find and upload images for any subject in a matter of seconds!
3. Image Metadata - Easily edit image filename, alt text and caption prior to uploading to your media library.
4. Post/Page Edit - Unsplash images in a lightbox on your post edit/new/post pages.
5. Gutenberg post edit screens. Add as featured image, insert into post or just upload photo.


== Changelog ==

= 4.0.1 - April 18, 2019 =
* FIX - Fixed issue where Instant Images sidebar plugin would not appear in Gutenberg if removed as a pinned item.


= 4.0.0 - February 12, 2019 =

* 4.0 adds Gutenberg support. You can now access instant images directly from inside the block editor.
* NEW - Added Instant Images to Gutenberg as a Plugin Sidebar.
* NEW - Added Gutenberg featured image support.
* NEW - Added Gutenberg Create Image Block support.

* UPDATE - Improved a11y (accessibility) of photo listing items.
* UPDATE - Updated REST API methods to prefix function names.
* UPDATE - Various other UI/UX enhancements.


= 3.3.0 - January 10, 2019 =
* UPDATE - Removed cURL usage for downloading images in place of core `copy()` PHP function.
* NEW - Adding Axios for HTTP requests
* NEW - Removing `/instant-images` folder in uploads directory on plugin de-activation.
* FIX - Added fix for directory permission issue when creating `uploads/instant-images`.

= 3.2.1 - September 25, 2018 =
* NEW - Added Instant Images to media upload tabs. You can now upload a photo and insert it into a page or page immediately. Please note, this is currently not working with the Gutenberg editor.
* UPDATE - Better cURL error handling (hopefully).


= 3.2 - July 31, 2018
** NEW - Added functionality to edit image details (filename, alt text and caption) prior to uploading - edit image detail by clicking the options icon in the top right corner of each image 👍.
** UPDATE - Improved error handling and messaging for common REST API and cURL issues.


= 3.1.1 - June 15, 2018 =
** NEW - More stable image uploading 🎉.
** NEW - Added `instant_images_user_role` filter to allow for control over user capability.
** FIX - Fixing permission issues with uploads when using basic HTTP authentication on domain.
** UPDATE - Better error handling
** UPDATE - Added permission 755 to the uploads/instant-images directory created on activation.


= 3.1 - January 2, 2018 =
** NEW - Adding support for searching individual photos by ID. Prefix a search term with `id:` to search by Unsplash ID. e.g. `id:ixddk_CepZY`.
** UPDATED - Updated to meet revised Unsplash API guidelines.
** UPDATED - Better Error messaging for upload/resize errors.
** NEW - Added `clear search` button to remove search results.
** FIX - Fixed JS error that occured when `SCRIPT_DEBUG` was set to `true`.


= 3.0 - September 21, 2017 =
** NEW - Instant Images has been completely re-built using React and the WordPress REST API.


= 2.1.1 - June 6, 2017 =
** NEW - Added infinite scroll while viewing Instant Images on large screens.
** FIX - Fixed missing js file error in browser console.
** UPDATE - Updated Masonry/Imagesloaded image load functionality.


= 2.1 - May 12, 2017 =
** UPDATE - Remove App ID setting - Unsplash API is now open for everyone without API limit restrictions.
** UPDATE - Updating default image upload from 'Full' to 'Raw'. Raw files are significantly smaller size and should make uploads quicker on slower connections and help to reduce upload errors.
** UPDATE - UI/UX tweaks and updates.
** FIX - Updating media_buttons hook. Was causing issues with other plugins.


= 2.0.1 - January 12, 2017 =
* FIX - Update to instant_img_resize_image function to remove unnecessary function arguments. These args were causing issues on some servers.
* NEW - Refresh Media Library content when uploading images through the Instant Images uploader on edit screen for posts and pages.
* UI Enhancements


= 2.0 =
* Initial Commit
* Updating plugin from UnsplashWP to Instant Images


== Upgrade Notice ==

* This is an upgrade from UnsplashWP


