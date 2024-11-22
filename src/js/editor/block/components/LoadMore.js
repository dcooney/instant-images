import { forwardRef } from '@wordpress/element';
import classNames from 'classnames';

/**
 * Render the BlockLoadMore component.
 *
 * @return {JSX.Element} The BlockLoadMore component.
 */
const BlockLoadMore = forwardRef((props, ref) => {
	const { done } = props;

	return <div className={classNames('instant-images-block--loader', done ? 'done' : null)} ref={ref}></div>;
});
export default BlockLoadMore;
