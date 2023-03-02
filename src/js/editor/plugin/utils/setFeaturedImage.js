const { dispatch } = wp.data;

const SetFeaturedImage = (imageId) => {
   if(imageId === null){
      return false;
   }
   dispatch("core/editor").editPost({ featured_media: imageId });
}
export default SetFeaturedImage;