Function.prototype.bind = Function.prototype.bind || require('function-bind');

var bespoke = require('bespoke');
var hash = require('../../lib-instrumented/bespoke-hash.js');

describe("bespoke-hash", function() {

  var PARENT_TAG = 'article',
    SLIDE_TAG = 'section',
    NO_OF_SLIDES = 10,
    FIRST_NAMED_SLIDE_NAME = 'first-named-slide',
    FIRST_NAMED_SLIDE_INDEX = 6,
    SECOND_NAMED_SLIDE_NAME = 'second-named-slide',
    SECOND_NAMED_SLIDE_INDEX = 8,
    article,
    slides,
    deck;

  var createDeck = function(opts) {
      slides = [];

      article = document.createElement(PARENT_TAG);
      for (var i = 0; i < NO_OF_SLIDES; i++) {
        slides.push(document.createElement(SLIDE_TAG));
        if (i === FIRST_NAMED_SLIDE_INDEX) {
          slides[i].setAttribute('data-bespoke-hash', FIRST_NAMED_SLIDE_NAME);
        }
        if (i === SECOND_NAMED_SLIDE_INDEX) {
          slides[i].setAttribute('data-bespoke-hash', SECOND_NAMED_SLIDE_NAME);
        }
        article.appendChild(slides[i]);
      }

      document.body.appendChild(article);

      deck = bespoke.from(PARENT_TAG, [
        hash(opts)
      ]);

      // Wait for next tick
      waits(0);
    },
    destroyDeck = function() {
      document.body.removeChild(article);
    };

  describe("given valid number hash is present on page load", function() {

    beforeEach(function() {
      this.activeSlideN = 2;
      window.location.hash = this.activeSlideN;
    });

    describe("when the deck is created", function() {

      beforeEach(createDeck);
      afterEach(destroyDeck);

      it("should activate the slide referenced in the hash", function() {
        expect(deck.slide()).toBe(this.activeSlideN - 1);
      });

    });

  });

  describe("given an invalid number hash is present on page load", function() {

    beforeEach(function() {
      window.location.hash = '100';
    });

    describe("when the deck is created", function() {

      beforeEach(createDeck);
      afterEach(destroyDeck);

      it("should ignore the hash and activate the first slide", function() {
        expect(deck.slide()).toBe(0);
      });

      it("should not break the presentation", function() {
        deck.next();
        expect(deck.slide()).toBe(1);
      });

    });

  });

  describe("given valid name hash is present on page load", function() {

    beforeEach(function() {
      window.location.hash = FIRST_NAMED_SLIDE_NAME;
    });

    describe("when the deck is created", function() {

      beforeEach(createDeck);
      afterEach(destroyDeck);

      it("should activate the slide referenced in the hash", function() {
        expect(deck.slide()).toBe(FIRST_NAMED_SLIDE_INDEX);
      });

    });

  });

  describe("given an invalid name hash is present on page load", function() {

    beforeEach(function() {
      window.location.hash = 'invalid-hash';
    });

    describe("when the deck is created", function() {

      beforeEach(createDeck);
      afterEach(destroyDeck);

      it("should ignore the hash and activate the first slide", function() {
        expect(deck.slide()).toBe(0);
      });

      it("should not break the presentation", function() {
        deck.next();
        expect(deck.slide()).toBe(1);
      });

    });

  });

  describe("given a blank hash is present on page load", function() {

    beforeEach(function() {
      window.location.hash = '';
    });

    describe("when the deck is created", function() {

      beforeEach(createDeck);
      afterEach(destroyDeck);

      it("should ignore the hash and activate the first slide", function() {
        expect(deck.slide()).toBe(0);
      });

      it("should not break the presentation", function() {
        deck.next();
        expect(deck.slide()).toBe(1);
      });

    });

  });

  describe("given a deck has been created", function() {

    beforeEach(createDeck);
    afterEach(destroyDeck);

    describe("when an unnamed slide is activated", function() {

      beforeEach(function() {
        this.activeSlideIndex = 3;
        deck.slide(this.activeSlideIndex);
      });

      it("should set the hash to match the nth active slide", function() {
        expect(window.location.hash).toBe('#' + (this.activeSlideIndex + 1));
      });

    });

    describe("when a named slide is activated", function() {

      beforeEach(function() {
        deck.slide(FIRST_NAMED_SLIDE_INDEX);
      });

      it("should set the hash to match the slide name", function() {
        expect(window.location.hash).toBe('#' + FIRST_NAMED_SLIDE_NAME);
      });

    });

    describe("when the hash changes to a slide number", function() {

      var activeSlideN;

      beforeEach(function() {
        runs(function() {
          activeSlideN = 5;
          window.location.hash = activeSlideN;
        });

        // Wait for next tick
        waits(0);
      });

      it("should activate the slide referenced in the hash", function() {
        expect(deck.slide()).toBe(activeSlideN - 1);
      });

    });

    describe("when the hash changes to a slide name", function() {

      beforeEach(function() {
        runs(function() {
          window.location.hash = FIRST_NAMED_SLIDE_NAME;
        });

        // Wait for next tick
        waits(0);
      });

      it("should activate the slide referenced in the hash", function() {
        expect(deck.slide()).toBe(FIRST_NAMED_SLIDE_INDEX);
      });

    });

  });

  describe("given update mode is deactivated", function() {
    beforeEach(function() {
      window.location.hash = 2;
    });

    [true, false].forEach(function(historyOpt) {
      describe("when the deck is created with history " + (historyOpt ? 'enabled' : 'disabled'), function() {
        beforeEach(function() {
          createDeck({ update: false, history: historyOpt });
        });
        afterEach(destroyDeck);

        it("should activate the slide referenced in the hash", function() {
          expect(deck.slide()).toBe(1);
          expect(window.location.hash).toBe(historyOpt ? '#2' : '');
        });

        it("should not update the hash when the slide changes", function() {
          deck.next();
          expect(deck.slide()).toBe(2);
          expect(window.location.hash).toBe(historyOpt ? '#2' : '');
        });
      });
    });
  });

  describe("given history mode is deactivated", function() {
    beforeEach(function() {
      window.location.hash = 2;
    });

    describe("when the deck is created", function() {
      beforeEach(function() {
        createDeck({ history: false });
      });
      afterEach(destroyDeck);

      it("should activate the slide referenced in the hash", function() {
        expect(deck.slide()).toBe(1);
        expect(window.location.hash).toBe('#2');
      });

      it("should not add entry to history when the slide changes", function() {
        var beforeHistoryLength = window.history.length;
        deck.next();
        expect(deck.slide()).toBe(2);
        expect(window.location.hash).toBe('#3');
        expect(window.history.length).toBe(beforeHistoryLength);
      });
    });
  });

});
