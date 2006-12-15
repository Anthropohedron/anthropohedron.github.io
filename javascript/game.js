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

constructMe : function(element) {
                this.element = $(element);
                this.dragger = new CardDragger(this);
                var handlers = [
                  [ this.dragger.mouseDown, 'mousedown' ],
                  [ this.dragger.mouseMove, 'mousemove' ],
                  [ this.dragger.mouseUp, 'mouseup' ],
                  [ this.dragger.click, 'click' ],
                  [ this.dragger.dblClick, 'dblclick' ]
                ];
                handlers.each(function(h) {
                    Event.observe(element, h[1],
                      h[0].bindAsEventListener(this.dragger));
                    }.bind(this));
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

movedCard : function(evt, card, dragger) { },

dropCard : function(evt, card, dragger) { },

clickCard : function(card, dragger) { },

dblclickCard : function(card, dragger) { },

shuffle : function() { this.deck.shuffle(); },

deal : function() { }

};

