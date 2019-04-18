import Icon from "./components/icon";
import Unsplash from './components/unsplash/index'; 
import UnsplashMenu from './components/unsplash/menu';   

const { Fragment } = wp.element;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
const { registerPlugin } = wp.plugins;

const InstantImages = () => (    
    <Fragment>        
        <UnsplashMenu />        
        <Unsplash />        
    </Fragment>    
);

// Register the sidebar plugin
registerPlugin( 'instant-images', {
      render: InstantImages
   } 
);
