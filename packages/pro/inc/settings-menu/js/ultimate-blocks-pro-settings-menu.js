/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/base/ManagerBase.js":
/*!*********************************!*\
  !*** ./src/base/ManagerBase.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Manager base abstract class.
 *
 * Implement `initLogic` function to comply.
 */
class ManagerBase {
  /**
   * Initialization status of manager.
   *
   * @private
   * @type {boolean}
   */
  #initialized = false;

  /**
   * Get initialization status of manager.
   *
   * @return {boolean} initialization status
   */
  isInitialized() {
    return this.#initialized;
  }

  /**
   * Initialization logic.
   *
   * @abstract
   */
  _initLogic() {
    throw new Error('_initLogic function is not implemented at extended class');
  }

  /**
   * Initialize manager instance.
   */
  init() {
    if (!this.isInitialized()) {
      this._initLogic.call(this, ...arguments);
      this.#initialized = true;
    }
  }
}

/**
 * @module ManagerBase
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ManagerBase);

/***/ }),

/***/ "./src/components/SettingsMenu/ProMenuContent.js":
/*!*******************************************************!*\
  !*** ./src/components/SettingsMenu/ProMenuContent.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);



/**
 * Menu content for pro settings.
 */
function ProMenuContent() {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: 'ub-pro-menu-container'
  });
}

/**
 * @module ProMenuContent
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProMenuContent);

/***/ }),

/***/ "./src/managers/FrontendDataManager.js":
/*!*********************************************!*\
  !*** ./src/managers/FrontendDataManager.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Base_ManagerBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @Base/ManagerBase */ "./src/base/ManagerBase.js");


/**
 * Frontend data manager.
 */
class FrontendDataManager extends _Base_ManagerBase__WEBPACK_IMPORTED_MODULE_0__["default"] {
  /**
   * Server sent data for frontend operations.
   *
   * @private
   * @type {null}
   */
  #frontendData = null;

  /**
   * Initialization logic for manager
   *
   * @param {string} globalObjectKey name of the key where server sent data is stored at global context
   */
  _initLogic(globalObjectKey) {
    const context = self || __webpack_require__.g;
    this.#frontendData = context[globalObjectKey] || {};
    context[globalObjectKey] = undefined;
  }

  /**
   * Get data value of high level key.
   *
   * @param {string} key        key
   * @param {any}    defaultVal default value
   * @return {any} value
   */
  getDataProperty(key, defaultVal = null) {
    return this.#frontendData[key] || defaultVal;
  }
}

/**
 * @module FrontendDataManager
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new FrontendDataManager());

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/*!****************************************!*\
  !*** ./src/containers/SettingsMenu.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Managers_FrontendDataManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @Managers/FrontendDataManager */ "./src/managers/FrontendDataManager.js");
/* harmony import */ var _Components_SettingsMenu_ProMenuContent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @Components/SettingsMenu/ProMenuContent */ "./src/components/SettingsMenu/ProMenuContent.js");





// use global hooks to intercept base version events
const {
  addFilter
} = wp.hooks;

// initialize and fetch menu data
_Managers_FrontendDataManager__WEBPACK_IMPORTED_MODULE_2__["default"].init('ubProSettingsMenuData');
const {
  settingsMenuPageParam
} = _Managers_FrontendDataManager__WEBPACK_IMPORTED_MODULE_2__["default"].getDataProperty('data');

// listen to settings menu route change event
addFilter('ubSettingsMenuRouteMatched', 'ubProSettingsMenuProIntercept', (routeContent, pageParam) => {
  if (pageParam === settingsMenuPageParam) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Components_SettingsMenu_ProMenuContent__WEBPACK_IMPORTED_MODULE_3__["default"], null);
  }
  return routeContent;
});
/******/ })()
;
//# sourceMappingURL=ultimate-blocks-pro-settings-menu.js.map