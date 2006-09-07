// CEvent class
// --------------------
// This makes the x and y values of an event convenient to get at. It may
// deal with other such issues at another time.

function CEvent(evt) {
  if (evt.pageX) {
    this.x = evt.pageX;
    this.y = evt.pageY;
  } else if (evt.clientX) {
    this.x = evt.clientX;
    this.y = evt.clientY;
  } else if (evt.x) {
    this.x = evt.x;
    this.y = evt.y;
  } else {
    this.x = 0;
    this.y = 0;
  }
  this.objectID = (evt.target) ? evt.target.id : ((evt.srcElement) ? evt.srcElement.id : null);
}

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

mouseDown : function(event) {
              var evt = new CEvent((event) ? event : window.event);
              if (evt.objectID!=null) {
                this.dragCard = this.game.pickCard(Card.findParentCardByID(evt.objectID), this);
                if (this.dragCard!=null) {
                  this.dragCard.highlight(false);
                  this.cX = evt.x - this.dragCard.rect.left;
                  this.cY = evt.y - this.dragCard.rect.top;
                  this.oldZ = this.dragCard.getZ();
                  this.dragCard.setZ(this.oldZ + 150);
                  //return true;
                } else {
                  this.dragCard = null;
                  //return false;
                }
              }
              return false;
            },

mouseMove : function(evt) {
              evt = new CEvent((evt) ? evt : ((window.event) ? window.event : null));
              if (this.dragCard!=null) {
                this.dragCard.moveTo(evt.x - this.cX, evt.y - this.cY);
                this.game.movedCard(evt, this.dragCard, this);
                //return true;
              }
              return false;
            },

mouseUp : function(evt) {
            if (this.dragCard!=null) {
              evt = new CEvent((evt) ? evt : ((window.event) ? window.event : null));
              var card = this.dragCard;

              this.dragCard = null;
              card.setZ(this.oldZ);
              this.game.dropCard(evt, card, this);
              //return true;
            }
            return false;
          },

click : function(event) {
          var evt = new CEvent((event) ? event : window.event);
          if (evt.objectID!=null) {
            var card = Card.findParentCardByID(evt.objectID);
            if (card!=null) {
              this.game.clickCard(card, this);
            }
          }
          return false;
        },

dblClick : function(event) {
             var evt = new CEvent((event) ? event : window.event);
             if (evt.objectID!=null) {
               var card = Card.findParentCardByID(evt.objectID);
               if (card!=null) {
                 this.game.dblclickCard(card, this);
               }
             }
             return false;
           }

};

