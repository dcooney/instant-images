const { createBlock } = wp.blocks;

const InsertImage = (url = '', caption = '', alt = '') => {
   if(url === ''){
      return false;
   }
   const block = createBlock("core/image", {
      url: url,
      caption: caption,
      alt: alt
    });
    wp.data.dispatch('core/editor').insertBlocks(block)
}
export default InsertImage;