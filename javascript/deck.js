// CardDeck class
// --------------
// This represents a deck of cards, which can be shuffled and dealt.

function CardDeck(deckname, element) {
  this.cardstack = new Array(52);
  this.cards = [];
  this.shownCards = [];
  this.name = ''+deckname;
  for (var i=0;i<52;++i) {
    var card = new Card(this.name+i, i, element, false);
    card.show(false);
    card.setZ(1);
    this.cards[this.name+i] = card;
    this.cardstack[i] = card;
  }
}

CardDeck.prototype = {

next : 0,

shuffle : function() {
            var i;
            this.next = 0;
            this.shownCards.splice(0, this.shownCards.length);
            for (i=0;i<52;++i) {
              this.cardstack[i].show(false);
              this.cardstack[i].detach();
            }
            for (i=0;i<52;++i) {
              var j = Math.floor(Math.random() * 52);
              var temp = this.cardstack[i];
              this.cardstack[i] = this.cardstack[j];
              this.cardstack[j] = temp;
            }
          },

deal : function(x, y, faceup) {
         var card = this.cardstack[this.next++];
         if (this.next>52) {
           alert('No more cards!');
         } else {
           this.shownCards[card.name] = card;
           card.setFaceUp(false);
           card.show(true);
           card.moveTo(x, y);
           card.setFaceUp(faceup);
         }
       },

dealTo : function(loc, faceup) {
           var card = this.cardstack[this.next++];
           if (this.next>52) {
             alert('No more cards!');
           } else {
             this.shownCards[card.name] = card;
             card.setFaceUp(false);
             card.show(true);
             loc.push(card);
             card.setFaceUp(faceup);
           }
         },

getCardByNum : function(number) {
                 return this.cards[this.name+number];
               }

};

