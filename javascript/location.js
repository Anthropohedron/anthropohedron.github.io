// CardLocation class
// ------------------
// This represents a stack of cards at an absolute location on the page.
// Most of the methods of the Stack class are exposed, directly or
// indirectly. Also, the topmost card can be highlighted.

function CardLocation(x, y, dx, dy) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.cardStack = new Stack();
  this.placeholder = new Card('location', -1, null, false);
  this.placeholder.makePlaceholder();
  this.placeholder.moveTo(x,y,0);
  this.placeholder.location = this;
  this.placeholder.show(false);
}

CardLocation.prototype = {

setHasCards : function(hasSome) {
                if (hasSome) {
                  this.placeholder.makeCardback();
                } else {
                  this.placeholder.makePlaceholder();
                }
              },

moveTo : function(x, y) {
           this.x = x;
           this.y = y;
           this.placeholder.moveTo(x, y);
           if (this.cardStack.size()>0)
             this.cardStack.list[0].moveTo(this.x, this.y, 1);
         },

setOffset : function(dx, dy) {
              this.dx = dx;
              this.dy = dy;
              if (this.cardStack.size()>1)
                this.cardStack.list[0].reattach(dx, dy);
            },

show : function(visible) {
         var list = this.cardStack.list;
         this.placeholder.show(visible);
         for (var i = 0; i<list.length; ++i) {
           list[i].show(visible);
         }
       },

top : function() {
        return this.cardStack.top();
      },

pop : function() {
        var card = this.cardStack.pop();
        card.location = null;
        card.detach();
        return card;
      },

push : function(card) {
         if (card instanceof Card) {
           if (this.cardStack.size()==0) {
             card.moveTo(this.x, this.y, 1);
           } else {
             this.top().attachCard(card, this.dx, this.dy);
           }
           this.cardStack.push(card);
           card.location = this;
         }
       },

reposition : function() {
               if (this.cardStack.size()>0) {
                 this.top().reposition(this.x, this.y);
               }
             },

highlight : function(lit) {
              var card = this.cardStack.top();
              if (card==null) {
                card = this.placeholder;
              }
              card.highlight(lit);
            },

clear : function() {
          while (this.cardStack.size()>0) {
            this.cardStack.pop().setFaceUp(false);
          }
        }

};

