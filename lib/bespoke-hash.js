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
