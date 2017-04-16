/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	jQuery.fn.startVideoInModal = function (modalSelector, videoSelector) {
		var URL_BASE = 'https://www.youtube.com/embed/';

		$(modalSelector).on('hide.bs.modal', function () {
			$(videoSelector).attr('src', '');
			return true;
		});

		return this.click(function (e) {
			e.preventDefault();

			var src = URL_BASE + $(this).data('video-id') + '?rel=0&autoplay=1';
			$(modalSelector).modal('show').on('shown.bs.modal', function () {
				$(videoSelector).attr('src', src);
			});
		});
	};

	jQuery(document).ready(function ($) {
		$('.talk__videoLink').startVideoInModal('#video-modal', '#video-iframe');
	});

/***/ }
/******/ ]);