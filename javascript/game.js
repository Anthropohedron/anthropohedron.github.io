// CardGame class
// --------------
// This is the superclass for all card games. The various empty functions
// should be implemented in any subclass to make an actual game happen.

function CardGame() {
  this.actions = new CardActionList();
  this.locations = [];
  this.hitcards = [];
  //call constructMe() from the subclass constructor
}

CardGame.prototype = {

subclass : function(json) {
             for (property in json) {
               this[property] = json[property];
             }
             return this;
           },

deck : null,
oldLoc : null,
newLoc : null,
oldParent : null,
dragStackSize : 0,
dragger : null,

newLocation : function(x, y, dx,dy) {
                var loc = new CardLocation(x, y, dx, dy);
                this.locations[this.locations.length] = loc;
                return loc;
              },

activate : function() {
             for (var i = 0; i<this.locations.length; ++i) {
               this.locations[i].clear();
               this.locations[i].show(true);
             }
             this.shuffle();
             document.dragger = this.dragger;
             if (this.reposition) this.reposition();
           },

deactivate : function() {
               for (var i = 0; i<this.locations.length; ++i) {
                 this.locations[i].clear();
                 this.locations[i].show(false);
               }
               this.shuffle();
             },

constructMe : function() {
                this.dragger = new CardDragger(this);
                document.dragger = this.dragger;
                var handlers = [
                  function(event) { return document.dragger.mouseDown(event); },
                  function(event) { return document.dragger.mouseMove(event); },
                  function(event) { return document.dragger.mouseUp(event); },
                  function(event) { return document.dragger.mouseUp(event); },
                  function(event) { return document.dragger.click(event); },
                  function(event) { return document.dragger.dblClick(event); }
                ];
                if (document.attachEvent) {
                  document.attachEvent('onmousedown', handlers[0]);
                  document.attachEvent('onmousemove', handlers[1]);
                  document.attachEvent('onmouseup',   handlers[2]);
                  document.attachEvent('onmouseup',   handlers[3]);
                  document.attachEvent('onclick',     handlers[4]);
                  document.attachEvent('ondblclick',  handlers[5]);
                } else {
                  document.onmousedown = handlers[0];
                  document.onmousemove = handlers[1];
                  document.onmouseup   = handlers[2];
                  document.onmouseup   = handlers[3];
                  document.onclick     = handlers[4];
                  document.ondblclick  = handlers[5];
                }
              },

redo : function() { this.actions.redo(); },

undo : function() { this.actions.undo(); },

startCardMove : function(card, depth) {
                  this.dragStackSize = ((depth==null)||(depth<1)) ? 1 : depth;
                  this.oldLoc = card.location;
                },

                // adds the action to the actions list and returns it
allowCardMove : function(card) {
                  var action = null;
                  if (this.newLoc!=null) {
                    this.newLoc.highlight(false);
                    if (this.oldLoc!=null) {
                      action = new CardAction(this.oldLoc, this.newLoc, this.dragStackSize);
                      this.actions.pushAction(action);
                    }
                  }
                  return action;
                },

rejectCardMove : function(card) {
                   if (this.oldLoc!=null) {
                     this.oldLoc.reposition();
                     this.oldLoc = null;
                   }
                 },

pickCard : function(card, dragger) { return true; },

movedCard : function(card, dragger) { },

dropCard : function(card, dragger) { },

clickCard : function(card, dragger) { },

dblclickCard : function(card, dragger) { },

shuffle : function() { this.deck.shuffle(); },

deal : function() { }

};

