/*!
 * bespoke-hash v1.0.2
 *
 * Copyright 2015, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.hash=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = function(opts) {
  opts = opts || {};
  return function(deck) {
    var loc = window.location;
    var parseHash = function() {
      var hash = loc.hash.slice(1),
        slideNumberOrName = parseInt(hash, 10);

      if (hash) {
        if (slideNumberOrName) {
          activateSlide(slideNumberOrName - 1);
        } else {
          deck.slides.forEach(function(slide, i) {
            if (slide.getAttribute('data-bespoke-hash') === hash) {
              activateSlide(i);
            }
          });
        }
      }
    };

    var activateSlide = function(index) {
      var indexToActivate = -1 < index && index < deck.slides.length ? index : 0;
      if (indexToActivate !== deck.slide()) {
        deck.slide(indexToActivate);
      }
    };

    setTimeout(function() {
      parseHash();

      if (opts.update === false) {
        if (opts.history === false) {
          window.history.replaceState(null, null, loc.pathname + loc.search);
        }
      }
      else {
        deck.on('activate', function(e) {
          var slideName = e.slide.getAttribute('data-bespoke-hash');
          if (opts.history === false) {
            window.history.replaceState(null, null, loc.pathname + loc.search + '#' + (slideName || e.index + 1));
          }
          else {
            loc.hash = slideName || e.index + 1;
          }
        });
      }

      window.addEventListener('hashchange', parseHash);
    }, 0);
  };
};

},{}]},{},[1])
(1)
});