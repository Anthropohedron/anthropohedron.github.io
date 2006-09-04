// DummyGame class
// ---------------
// This is mostly for testing.

function DummyGame() {
  this.deck = new CardDeck('dummy');
}

DummyGame.prototype = new CardGame().subclass({

pickCard : function(card, dragger) {
             card.detach();
             return true;
           },

movedCard : function(evt, card, dragger) {
              var hitcards = this.deck.shownCards;

              for (i in hitcards) {
                hitcards[i].highlight(false);
              }
              for (i in hitcards) {
                var hitCard = hitcards[i];
                if ((i!=card.name) &&
                    (hitCard.contains(evt.clientX, evt.clientY))) {
                  if (hitCard.location!=null) {
                    hitCard.location.highlight(true);
                  } else {
                    hitCard.highlight(true);
                  }
                }
              }
            },

dropCard : function(evt, card, dragger) {
             var hitcards = this.deck.shownCards;
             var bestCard = null;

             for (i in hitcards) {
               var hitCard = hitcards[i];
               if ((i!=card.name) && (hitCard.contains(evt.clientX, evt.clientY))) {
                 bestCard = hitCard;
               }
             }
             if (bestCard!=null) {
               bestCard.attachCard(card);
             }
           },

clickCard : function(card, dragger) {
            },

dblclickCard : function(card, dragger) {
               },

deal : function() {
         this.deck.deal(40, 110, true);
       }

});

