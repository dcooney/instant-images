import classnames from "classnames";
import Icon from "../icon";

const { Component } = wp.element;
const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;

const UnsplashMenu = () => (
	<PluginSidebarMoreMenuItem 
     	icon = {<Icon color="unsplash" />}
      target ="instant-images-sidebar"
   >
      Instant Images
   </PluginSidebarMoreMenuItem> 
);
export default UnsplashMenu;