import { createContext, useContext } from "@wordpress/element";

// Create Context object.
const PluginContext = createContext();

// Export Provider.
export function PluginProvider(props) {
	const { value, children } = props;

	return (
		<PluginContext.Provider value={value}>{children}</PluginContext.Provider>
	);
}

// Export useContext Hook.
export function usePluginContext() {
	return useContext(PluginContext);
}
