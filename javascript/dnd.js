// CardDragger class
// -----------------
// This manages a card being dragged around the playing field. It mostly
// manages mouse events.

function CardDragger(game) {
  this.game = game;
}

CardDragger.prototype = {

dragCard : null,
cX : 0,
cY : 0,
oldZ : 0,

mouseDown : function(evt) {
              var element = Event.element(evt);
              if (element) {
                var dragCard =
                  this.game.pickCard(Card.findParentCard(element), this);
                this.dragCard = dragCard;
                if (dragCard!=null) {
                  dragCard.highlight(false);
                  this.cX = Event.pointerX(evt) - dragCard.rect.left;
                  this.cY = Event.pointerY(evt) - dragCard.rect.top;
                  this.oldZ = dragCard.getZ();
                  dragCard.setZ(this.oldZ + 150);
                  //return true;
                } else {
                  this.dragCard = null;
                  //return false;
                }
              }
              return false;
            },

mouseMove : function(evt) {
              if (this.dragCard!=null) {
                this.dragCard.moveTo(Event.pointerX(evt) - this.cX, Event.pointerY(evt) - this.cY);
                this.game.movedCard(evt, this.dragCard, this);
                //return true;
              }
              return false;
            },

mouseUp : function(evt) {
            if (this.dragCard!=null) {
              var card = this.dragCard;

              this.dragCard = null;
              card.setZ(this.oldZ);
              this.game.dropCard(evt, card, this);
              //return true;
            }
            return false;
          },

click : function(evt) {
          var card = Card.findParentCard(Event.element(evt));
          if (card!=null) {
            this.game.clickCard(card, this);
          }
          return false;
        },

dblClick : function(evt) {
             var card = Card.findParentCard(Event.element(evt));
             if (card!=null) {
               this.game.dblclickCard(card, this);
             }
             return false;
           }

};

