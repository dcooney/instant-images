/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/editor/block/Insert.js":
/*!***************************************!*\
  !*** ./src/js/editor/block/Insert.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);


var Insert = function Insert(CurrentMenuItems, props) {
  // eslint-disable-next-line
  var attributes = props.attributes,
    setAttributes = props.setAttributes,
    clientId = props.clientId;
  var showMenu = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(function (select) {
    var currentBlock = select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).getBlock(clientId);
    return currentBlock.name === "core/image";
  }, [clientId]);
  if (!showMenu) {
    return /*#__PURE__*/React.createElement(CurrentMenuItems, props);
  }
  return /*#__PURE__*/React.createElement("div", null, "MEOWWWW");
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Insert);

/***/ }),

/***/ "./src/js/editor/block/ReplaceBlock.js":
/*!*********************************************!*\
  !*** ./src/js/editor/block/ReplaceBlock.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);





/**
 * Replace the Instant Images block with an Image block.
 *
 * @param {object} props Block props.
 * @returns
 */
var ReplaceBlock = function ReplaceBlock(_ref) {
  var clientId = _ref.clientId,
    imageFilters = _ref.attributes;
  var block = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useSelect)(function (select) {
    return select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store).getBlock(clientId !== null && clientId !== void 0 ? clientId : "");
  }, [clientId]);
  var _useDispatch = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.store),
    replaceBlock = _useDispatch.replaceBlock;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.useEffect)(function () {
    if (!(block !== null && block !== void 0 && block.name) || !replaceBlock || !clientId) return;
    if (block.innerBlocks[0]) {
      var attributes = Object.assign({}, block.innerBlocks[0].attributes, {
        // There's a chancge our attributes were filtered by another plugin
        // so better to be explicit here
        imageFilters: {
          sourceImageId: imageFilters === null || imageFilters === void 0 ? void 0 : imageFilters.sourceImageId,
          filteredFromImageId: imageFilters === null || imageFilters === void 0 ? void 0 : imageFilters.filteredFromImageId,
          currentImageId: imageFilters === null || imageFilters === void 0 ? void 0 : imageFilters.currentImageId,
          currentFilterSlug: imageFilters === null || imageFilters === void 0 ? void 0 : imageFilters.currentFilterSlug
        }
      });
      replaceBlock(clientId, [(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.createBlock)("core/image", attributes)]);
      return;
    }
    var blockData = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.createBlock)("core/image");
    replaceBlock(clientId, [blockData]).then(function () {
      var clientId = blockData.clientId;
      // Open the Instant Images when user inserts the block.
      window.dispatchEvent(new CustomEvent("kevinbatdorf/open-image-filters", {
        bubbles: true,
        detail: {
          clientId: clientId
        }
      }));
    });
  }, [block, replaceBlock, clientId, imageFilters]);
  return null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReplaceBlock);

/***/ }),

/***/ "./src/js/editor/components/Icon.js":
/*!******************************************!*\
  !*** ./src/js/editor/components/Icon.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IconSVG": () => (/* binding */ IconSVG),
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);


/**
 * The Icon component.
 *
 * @param {Object} props       The component props.
 * @param {string} props.color Color of the icon.
 * @return {JSX.Element} 	    The Icon component.
 */
function Icon(_ref) {
  var _ref$color = _ref.color,
    color = _ref$color === void 0 ? "unsplash" : _ref$color;
  return /*#__PURE__*/React.createElement("span", {
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()("instant-images-sidebar-icon", "color-" + color)
  }, /*#__PURE__*/React.createElement(IconSVG, null));
}

/**
 * The IconSVG component.
 *
 * @return {JSX.Element} The IconSVG component.
 */
function IconSVG() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 31 58",
    width: "13px",
    height: "24px"
  }, /*#__PURE__*/React.createElement("title", null, "Instant Images Logo"), /*#__PURE__*/React.createElement("polygon", {
    points: "20 0 20 23 31 23 11 58 11 34 0 34 20 0",
    fill: "#4a7bc5"
  }));
}

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block/block.json":
/*!******************************!*\
  !*** ./src/block/block.json ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":2,"name":"instant-images/images","version":"1.0.0","title":"Instant Images","category":"media","description":"One click photo uploads from Unsplash, Openverse, Pixabay and Pexels.","attributes":{"sourceImageId":{"type":"number"},"currentImageId":{"type":"number"},"currentFilterSlug":{"type":"string"},"filteredFromImageId":{"type":"number"}},"supports":{"html":false},"textdomain":"instant-images-pro","editorScript":"file:./index.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************!*\
  !*** ./src/block/index.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _js_editor_block_Insert__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../js/editor/block/Insert */ "./src/js/editor/block/Insert.js");
/* harmony import */ var _js_editor_block_ReplaceBlock__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../js/editor/block/ReplaceBlock */ "./src/js/editor/block/ReplaceBlock.js");
/* harmony import */ var _js_editor_components_Icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../js/editor/components/Icon */ "./src/js/editor/components/Icon.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./block.json */ "./src/block/block.json");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }









/**
 * Register the block.
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_1__.registerBlockType)("instant-images/images", _objectSpread(_objectSpread({}, _block_json__WEBPACK_IMPORTED_MODULE_7__), {}, {
  title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)("Instant Images", "instant-images"),
  icon: _js_editor_components_Icon__WEBPACK_IMPORTED_MODULE_6__.IconSVG,
  edit: function edit(_ref) {
    var clientId = _ref.clientId,
      attributes = _ref.attributes;
    return /*#__PURE__*/React.createElement(_js_editor_block_ReplaceBlock__WEBPACK_IMPORTED_MODULE_5__["default"], {
      clientId: clientId,
      attributes: attributes
    });
  },
  save: function save() {
    return /*#__PURE__*/React.createElement(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_0__.InnerBlocks.Content, null);
  }
}));

/**
 * Add to the core image block
 */
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)("editor.BlockEdit", _block_json__WEBPACK_IMPORTED_MODULE_7__.name, function (CurrentMenuItems) {
  return (
    // Not sure how to type these incoming props
    // eslint-disable-next-line
    function (props) {
      return (
        // It seems like Gutenberg wants a top level component here
        (0,_js_editor_block_Insert__WEBPACK_IMPORTED_MODULE_4__["default"])(CurrentMenuItems, props)
      );
    }
  );
});

// Add our attributes
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_2__.addFilter)("blocks.registerBlockType", _block_json__WEBPACK_IMPORTED_MODULE_7__.name, function (settings) {
  if (settings.name !== "core/image") return settings;
  return _objectSpread(_objectSpread({}, settings), {}, {
    attributes: _objectSpread(_objectSpread({}, settings.attributes), {}, {
      imageFilters: {
        sourceImageId: {
          type: "number"
        },
        currentImageId: {
          type: "number"
        },
        currentFilterSlug: {
          type: "string"
        },
        filteredFromImageId: {
          type: "number"
        }
      }
    })
  });
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map