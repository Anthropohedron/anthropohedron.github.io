// seahaven class
// --------------
// An implementation of Seahaven Towers. Subclass of CardGame.

function seahaven(x, y) {
  var i = 0;
  this.x = (x==null) ? 0 : x;
  this.y = (y==null) ? 0 : y;
  this.deck = new CardDeck('seahaven');
  this.aces = new Array();
  this.holes = new Array(4);
  this.stacks = new Array(10);
  this.aces['spades'] = this.newLocation(this.x, this.y, 0, 0);
  this.aces['hearts'] = this.newLocation(this.x, this.y, 0, 0);
  this.aces['diamonds'] = this.newLocation(this.x, this.y, 0, 0);
  this.aces['clubs'] = this.newLocation(this.x, this.y, 0, 0);
  for (i=0;i<4;++i) {
    this.holes[i] = this.newLocation(this.x, this.y, 0, 0);
  }
  for (i=0;i<10;++i) {
    this.stacks[i] = this.newLocation(this.x, this.y, 0, 0);
  }
  this.reposition();
  this.constructMe();
}

seahaven.prototype = new CardGame().subclass({

reposition : function() {
               var card = this.aces['spades'].placeholder;
               card.rect.updateFromNode(card.node);
               var xdist = card.rect.width() + 5;
               var ydist = card.rect.height() + 5;
               var yoffset = Math.floor(ydist / 3);
               this.aces['spades'].moveTo(this.x, this.y);
               this.aces['hearts'].moveTo(xdist+this.x, this.y);
               this.aces['diamonds'].moveTo((xdist*8)+this.x, this.y);
               this.aces['clubs'].moveTo((xdist*9)+this.x, this.y);
               for (i=3;i<7;++i) {
                 this.holes[i-3].moveTo((xdist*i)+this.x, this.y);
               }
               for (i=0;i<10;++i) {
                 this.stacks[i].moveTo((xdist*i)+this.x, ydist+this.y);
                 this.stacks[i].setOffset(0, yoffset);
               }
             },

holeCount : function() {
              var count = 0;
              for (var i=0;i<4;++i) {
                if (this.holes[i].top()==null) ++count;
              }
              return count;
            },

clickCard : function(card, dragger) {
              //This space intentionally left blank
            },

dblclickCard : function(card, dragger) {
                 var picked = this.pickCard(card);
                 if (picked!=null) {
                   var cnum = picked.number;
                   this.newLoc = null;
                   for (var i=0;(this.newLoc==null)&&(i<10);++i) {
                     var curCard = this.stacks[i].top();
                     if ((curCard==null)&&((cnum%13)==12)) {
                       this.newLoc = this.stacks[i];
                     } else if ((curCard!=null)&&(curCard.number==(cnum+1))) {
                       this.newLoc = this.stacks[i];
                     }
                   }
                   if ((this.newLoc==null)&&(this.dragStackSize<=this.holeCount())) {
                     this.newLoc = this.holes[0];
                   }
                   this.dropCard(null, picked);
                 }
               },

pickCard : function(card, dragger) {
             var retCard = null;
             var loc = (card==null) ? null : card.location;
             if ((loc==this.aces['spades']  ) ||
                 (loc==this.aces['hearts']  ) ||
                 (loc==this.aces['diamonds']) ||
                 (loc==this.aces['clubs']   )) {
               card = null;
             }
             if (card!=null) {
               var curCard = card.location.top();
               var empty = this.holeCount();
               var count = 0;
               while ((curCard.parent!=null) &&
                   (curCard.suit==curCard.parent.suit) &&
                   ((curCard.number+1)==curCard.parent.number)) {
                 curCard = curCard.parent;
                 ++count;
               }
               if (count<=empty) {
                 retCard = curCard;
                 this.startCardMove(retCard, count+1);
               } else if (card==card.location.top()) {
                 retcard = card;
                 this.startCardMove(card);
               }
               //log("count = "+count+", card = "+retCard.toString());
             }
             return retCard;
           },

movedCard : function(evt, card, dragger) {
              var highlight;
              var curCard;
              var i = 0;
              var cnum = card.number;
              this.newLoc = null;
              for (i=0;i<10;++i) {
                curCard = this.stacks[i].top();
                if ((curCard==null)&&((cnum%13)==12)) {
                  curCard = this.stacks[i].placeholder;
                  highlight = curCard.contains(evt.x, evt.y);
                  curCard.highlight(highlight);
                  if (highlight) {
                    this.newLoc = curCard.location;
                  }
                } else if ((curCard!=null)&&(curCard.number==(cnum+1))) {
                  highlight = curCard.contains(evt.x, evt.y);
                  curCard.highlight(highlight);
                  if (highlight) {
                    this.newLoc = curCard.location;
                  }
                  //alert('' + evt.x + ', ' + evt.y + ' in ' + curCard.rect.toString());
                }
              }
              if (this.dragStackSize<=this.holeCount()) {
                for (i=0;i<4;++i) {
                  if (this.holes[i].top()==null) {
                    curCard = this.holes[i].placeholder;
                    highlight = curCard.contains(evt.x, evt.y);
                    curCard.highlight(highlight);
                    if (highlight) {
                      this.newLoc = curCard.location;
                    }
                  }
                }
              }
            },

dropCard : function(evt, card, dragger) {
             if (this.newLoc==null) {
               this.rejectCardMove(card);
             } else {
               var action = null;
               if ((this.newLoc==this.holes[0]) ||
                   (this.newLoc==this.holes[1]) ||
                   (this.newLoc==this.holes[2]) ||
                   (this.newLoc==this.holes[3])) {
                 this.newLoc.highlight(false);
                 for (var i=0;(i<4)&&(this.dragStackSize>0);++i) {
                   if (this.holes[i].top()==null) {
                     if (action==null) {
                       action = new CardAction(this.oldLoc, this.holes[i], 1);
                     } else {
                       action.addToChain(new CardAction(this.oldLoc, this.holes[i], 1));
                     }
                     --this.dragStackSize;
                   }
                 }
                 this.actions.pushAction(action);
               } else {
                 action = this.allowCardMove(card);
               }
               if (action!=null) {
                 this.putUpCards(action);
               }
             }
             this.oldLoc = null;
             this.newLoc = null;
           },

testPutUpCard : function(card) {
                  var action = null;
                  if (card!=null) {
                    var aceLoc = this.aces[card.suit];
                    var aceTop = aceLoc.top();
                    if (aceTop==null) {
                      if (card.rank=='rA') {
                        action = new CardAction(card.location, aceLoc);
                      }
                    } else if (aceTop.number==(card.number-1)) {
                      action = new CardAction(card.location, aceLoc);
                    }
                  }
                  return action;
                },

putUpCards : function(action) {
               var i;
               var nextAction;
               var worthTrying = true;
               while (worthTrying) {
                 worthTrying = false;
                 for (i=0;i<4;++i) {
                   nextAction = this.testPutUpCard(this.holes[i].top());
                   if (nextAction!=null) {
                     action.addToChain(nextAction);
                     nextAction.redo();
                     worthTrying = true;
                   }
                 }
                 for (i=0;i<10;++i) {
                   nextAction = this.testPutUpCard(this.stacks[i].top());
                   if (nextAction!=null) {
                     action.addToChain(nextAction);
                     nextAction.redo();
                     worthTrying = true;
                   }
                 }
               }
             },

deal : function() {
         var i, j;
         this.actions.clear();
         this.deck.shuffle();
         //log("this is a test");
         for (i=0;i<this.locations.length;++i) {
           this.locations[i].clear();
         }
         for (j=0;j<5;++j) {
           for (i=0;i<10;++i) {
             this.deck.dealTo(this.stacks[i], true);
           }
         }
         this.deck.dealTo(this.holes[1], true);
         this.deck.dealTo(this.holes[2], true);
         this.putUpCards(new CardAction(this.holes[0], this.holes[3]));
       }

});

