// Card class
// ----------
// The Card class encapsulates a particular card, including its DOM
// representation, its state, its location, etc. There are also a bunch of
// standalone functions and variables related to it.

Effect.Queues.get('cardscope');

function Card(cardname, number, parent, faceup) {
  var nodes = CardDOM.createCardDOM(cardname, 'cardback', 'notrump', parent);
  this.name = cardname;
  this.number = number;
  this.node = nodes[0];
  this.rankNode = nodes[1];
  this.faceup = false;
  if ((number>=0)&&(number<52)) {
    this.rank = Card.ranklist[number%13];
    this.suit = Card.suitlist[Math.floor(number/13)];
  } else {
    this.rank = 'cardback';
    this.suit = 'notrump';
  }
  this.rect = rectFromNode(this.node);
  this.child = null;
  this.childDX = Card.childDX;
  this.childDY = Card.childDY;
  this.parent = null;
  if (faceup) flipOver();
  Card.allcards[''+cardname] = this;
}

Object.extend(Card, {

childDX: 4,
childDY: 50,
allcards: [],
cardRegex: new RegExp('^card_(.*)_(suit|rank|surf)$'),
ranklist : [ 'rA', 'r2', 'r3', 'r4', 'r5', 'r6',
     'r7', 'r8', 'r9', 'r10', 'rJ', 'rQ', 'rK' ],
suitlist : [ 'spades', 'hearts', 'diamonds', 'clubs' ],

getCardByName: function(cardname) {
  return this.allcards[''+cardname];
},

getCardByID: function(cardID) {
  var matches = this.cardRegex.exec(cardID);
  return (matches==null) ? null : this.allcards[matches[1]];
},

findParentCard: function(obj) {
  obj = $(obj);
  while (obj) {
    var matches = this.cardRegex.exec(obj.id);
    if (matches!=null) {
      return this.allcards[matches[1]];
    } else {
      obj = obj.parentNode;
    }
  }
  return null;
}

});

Card.prototype = {

intersectArea : function(card) {
  var c;
  for (c = this.parent; c!=null; c = c.parent) {
    if (c==card) {
      return 0;
    }
  }
  for (c = this; c!=null; c = c.child) {
    if (c==card) {
      return 0;
    }
  }
  var dx = Math.abs(this.rect.right - card.rect.right);
  var dy = Math.abs(this.rect.bottom - card.rect.bottom);
  var w = this.rect.right - this.rect.left;
  var h = this.rect.bottom - this.rect.top;
  if ((dx>=w)||(dy>=h)) {
    return 0;
  }
  return (w-dx)*(h-dy);
},

intersects : function(card) { return (this.intersectArea(card)>0); },

contains : function(x, y) { return (this.rect.containsPoint(x, y)); },

reposition : function(x, y) {
  if (this.parent==null) {
    this.moveTo(x, y);
  } else {
    this.parent.reposition(x, y);
  }
},

detach : function() {
  if (this.parent!=null) {
    this.parent.child = null;
    this.parent = null;
  }
},

attachCard : function(card, dx, dy, dealing) {
  //alert('Attached to ' + this.toString());
  if (this.child==null) {
    if (card!=null) {
      this.childDX = 1*dx;
      this.childDY = 1*dy;
      card.detach();
      this.child = card;
      card.parent = this;
      var x = this.destination ? this.destination[0] : this.rect.left;
      var y = this.destination ? this.destination[1] : this.rect.top;
      x += this.childDX;
      y += this.childDY;
      if (dealing) {
        card.moveTo(x, y, this.getZ()+1);
      } else {
        card.animateMoveTo(x, y, this.getZ()+1);
      }
    }
  } else {
    this.child.attachCard(card, null, null, dealing);
  }
},

reattach : function(dx, dy) {
  this.childDX = 1*dx;
  this.childDY = 1*dy;
  if (this.child!=null) {
    this.child.moveTo(this.rect.left+this.childDX,
        this.rect.top+this.childDY,
        this.getZ()+1);
    this.child.reattach(dx, dy);
  }
},

moveTo : function(x, y, z) {
  this.node.style.left = '' + x + 'px';
  this.node.style.top  = '' + y + 'px';
  this.resetAfterMove({ card: this });
  if (z==null) {
    z = this.getZ() + 1;
  } else {
    this.node.style.zIndex = z;
    ++z;
  }
  if (this.child!=null) {
    this.child.moveTo(x+this.childDX, y+this.childDY, z);
  }
},

resetAfterMove : function(obj) {
  obj = obj.card;
  obj.rect.updateFromNode(obj.node);
  if (obj.destination) {
    obj.node.style.zIndex = obj.destination[2];
    obj.destination = null;
  }
},

animateMoveTo : function(x, y, z, duration) {
  var dx = x - (this.destination ?
      this.destination[0] : parseInt(this.node.style.left));
  var dy = y - (this.destination ?
      this.destination[1] : parseInt(this.node.style.top));
  if (!duration) duration = 0.25;
  var options = { queue: { position: "end", scope: "cardscope" },
    duration: duration,
    fps: 60,
    transition: Effect.Transitions.sinoidal,
    afterFinish: this.resetAfterMove };
  this.buildMoveEffect(dx, dy, z, options);
},

buildMoveEffect : function(dx, dy, z, baseOptions) {
  var x = parseInt(this.node.style.left);
  var y = parseInt(this.node.style.top);
  var oldZ = this.getZ();
  if (this.destination) {
    x = this.destination[0];
    y = this.destination[1];
    this.resetAfterMove({ card: this });
  }
  var options = Object.extend({}, baseOptions);
  options.beforeStart = function() {
    this.node.style.zIndex = oldZ+25;
  }.bind(this);
  if (z==null) z = this.getZ();
  this.destination = [
    x+dx,
    y+dy,
    z ];
  var effect = new Effect.MoveBy(this.node, dy, dx, options);
  effect.card = this;
  if (this.child!=null) {
    this.child.buildMoveEffect(dx, dy, z+1, baseOptions);
  }
},

changeTo : function(rank, suit) {
  this.rank = rank;
  this.suit = suit;
  this.rankNode.className = rank;
  this.node.className = suit;
},

flipOver : function() {
  if (this.faceup) {
    this.rankNode.className = 'cardback';
    this.node.className = 'notrump';
    this.faceup = false;
  } else {
    this.rankNode.className = this.rank;
    this.node.className = this.suit;
    this.faceup = true;
  }
},

setFaceUp : function(faceup) { if (faceup!=this.faceup) this.flipOver(); },

highlight : function(lit) {
  if ((lit) && (this.oldBorderWidth==null)) {
    this.oldBorderWidth = this.node.style.borderWidth;
    var nm = (DOMhelper.stripPX(this.oldBorderWidth) - 4)+'px';
    this.node.style.margin = nm;
    this.node.style.borderWidth = '4px';
    this.node.style.borderColor = '#22CC22';
    if (this.faceup)
      this.node.style.backgroundColor = '#F8FFF8';
  } else if ((!lit) && (this.oldBorderWidth!=null)) {
    this.node.style.margin = '0px';
    this.node.style.borderWidth = this.oldBorderWidth;
    this.oldBorderWidth = null;
    this.node.style.borderColor = 'gray';
    if (this.faceup)
      this.node.style.backgroundColor = 'white';
  }
},

isRed : function() {
  return ((this.suit==Card.suitlist[1]) ||
      (this.suit==Card.suitlist[2]));
},

getZ : function() {
  var z = this.destination ? this.destination[2] : 1*this.node.style.zIndex;
  return z;
},

setZ : function(z) {
  this.node.style.zIndex = z;
  if (this.child!=null) {
    this.child.setZ((1*z)+1);
  }
},

show : function(visible) {
  if (visible) {
    this.node.style.display = 'block';
  } else {
    this.node.style.display = 'none';
  }
},

isShown : function() { return (this.node.style.display!='none'); },

makePlaceholder : function() { this.rankNode.className = 'cardplace'; },

makeCardback : function() { this.rankNode.className = 'cardback'; },

toString : function() { return 'Card: ' + this.rank + ' of ' + this.suit; }

};

