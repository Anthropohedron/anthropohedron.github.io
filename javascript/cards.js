// Card class
// ----------
// The Card class encapsulates a particular card, including its DOM
// representation, its state, its location, etc. There are also a bunch of
// standalone functions and variables related to it.

//alert(navigator.userAgent.toLowerCase());
/*
var pipsURL = (navigator.userAgent.toLowerCase().indexOf('msie')>=0) ?
  'images/pips.gif' : 'images/pips.png';
/**/
var pipsURL = 'images/pips.png';
/**/
var rankURL = 'images/ranks.png';
var faceURL = 'images/faces.png';
var childDX = 4;
var childDY = 50;
var allcards = [];
var cardRegex = new RegExp('^card_(.*)_(suit|rank|surf)$');

function createTLDOM(parent) {
  var node = DOMhelper.newDiv(parent, 'rankTL');
  node = DOMhelper.newImgspan(node);
  node = DOMhelper.newImg(node, rankURL);
  node = DOMhelper.newDiv(parent, 'tagpipTL');
  node = DOMhelper.newImgspan(node);
  node = DOMhelper.newImg(node, pipsURL);
}

function createPipDOM(parent, num) {
  var node = DOMhelper.newDiv(parent, 'pip'+num.toString(16).toUpperCase());
  node = DOMhelper.newImgspan(node);
  node = DOMhelper.newImg(node, pipsURL);
}

function createFaceDOM(parent) {
  var pnode = DOMhelper.newDiv(parent, 'face');
  var node = DOMhelper.newSpan(pnode, 'faceimg');
  node = DOMhelper.newImg(node, faceURL);
  var pipTable = DOMhelper.newTag(pnode, 'table', 'pips');
  pipTable = DOMhelper.newTag(pipTable, 'tbody');

  var pipRow = DOMhelper.newTag(pipTable, 'tr');
  pnode = DOMhelper.newTag(pipRow, 'td', 'topRow');
  createPipDOM(pnode, 1);
  pnode = DOMhelper.newTag(pipRow, 'td', 'centerCol');
  pnode.rowSpan = 3;
  createPipDOM(pnode, 5);
  createPipDOM(pnode, 6);
  createPipDOM(pnode, 7);
  createPipDOM(pnode, 8);
  pnode = DOMhelper.newTag(pipRow, 'td', 'topRow');
  createPipDOM(pnode, 9);

  pipRow = DOMhelper.newTag(pipTable, 'tr');
  pnode = DOMhelper.newTag(pipRow, 'td');
  createPipDOM(pnode, 2);
  DOMhelper.newDiv(pnode, 'sep');
  createPipDOM(pnode, 3);
  pnode = DOMhelper.newTag(pipRow, 'td');
  createPipDOM(pnode, 10);
  DOMhelper.newDiv(pnode, 'sep');
  createPipDOM(pnode, 11);

  pipRow = DOMhelper.newTag(pipTable, 'tr');
  pnode = DOMhelper.newTag(pipRow, 'td', 'bottomRow');
  createPipDOM(pnode, 4);
  pnode = DOMhelper.newTag(pipRow, 'td', 'bottomRow');
  createPipDOM(pnode, 12);
}

function createBRDOM(parent) {
  var node = DOMhelper.newDiv(parent, 'tagpipBR');
  node = DOMhelper.newImgspan(node);
  node = DOMhelper.newImg(node, pipsURL);
  node = DOMhelper.newDiv(parent, 'rankBR');
  node = DOMhelper.newImgspan(node);
  node = DOMhelper.newImg(node, rankURL);
}

function createCardDOM(cardname, rank, suit, parent) {
  if (parent==null) {
    parent = document.body;
  }
  var cardNode = DOMhelper.newDiv(parent, suit);
  var rankNode = DOMhelper.newDiv(cardNode, rank);
  cardNode.id = 'card_' + cardname + '_suit';
  rankNode.id = 'card_' + cardname + '_rank';
  var cardTable = DOMhelper.newTag(rankNode, 'table', 'cardLayout');
  cardTable = DOMhelper.newTag(cardTable, 'tbody');
  var tableRow = DOMhelper.newTag(cardTable, 'tr');

  createTLDOM(DOMhelper.newTag(tableRow, 'td', 'rankTLbox'));
  createFaceDOM(DOMhelper.newTag(tableRow, 'td', 'faceBox'));
  createBRDOM(DOMhelper.newTag(tableRow, 'td', 'rankBRbox'));

  var surf = DOMhelper.newDiv(rankNode, 'surface');
  surf.id = 'card_' + cardname + '_surf';

  return [cardNode, rankNode];
}

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

attachCard : function(card, dx, dy) {
               //alert('Attached to ' + this.toString());
               if (this.child==null) {
                 if (card!=null) {
                   this.childDX = 1*dx;
                   this.childDY = 1*dy;
                   card.detach();
                   this.child = card;
                   card.parent = this;
                   card.moveTo(this.rect.left+this.childDX, this.rect.top+this.childDY,
                       this.getZ()+1);
                 }
               } else {
                 this.child.attachCard(card);
               }
             },

reattach : function(dx, dy) {
             this.childDX = 1*dx;
             this.childDY = 1*dy;
             if (this.child!=null) {
               this.child.moveTo(this.rect.left+this.childDX, this.rect.top+this.childDY,
                   this.getZ()+1);
               this.child.reattach(dx, dy);
             }
           },

moveTo : function(x, y, z) {
           this.node.style.left = '' + x + 'px';
           this.node.style.top  = '' + y + 'px';
           this.rect.updateFromNode(this.node);
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

moveBy : function(dx, dy, z) {
           this.moveTo(dx + this.rect.left, dy + this.rect.top, z);
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
                this.node.style.margin = nm + ' ' + nm + ' ' + nm + ' ' + nm;
                this.node.style.borderWidth = '4px';
                this.node.style.borderColor = '#22CC22';
                if (this.faceup)
                  this.node.style.backgroundColor = '#F8FFF8';
              } else if ((!lit) && (this.oldBorderWidth!=null)) {
                this.node.style.margin = '0px 0px 0px 0px';
                this.node.style.borderWidth = this.oldBorderWidth;
                this.oldBorderWidth = null;
                this.node.style.borderColor = 'gray';
                if (this.faceup)
                  this.node.style.backgroundColor = 'white';
              }
            },

isRed : function() {
          return ((this.suit==this.suitlist[1]) ||
              (this.suit==this.suitlist[2]));
        },

getZ : function() { return 1*this.node.style.zIndex; },

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

toString : function() { return 'Card: ' + this.rank + ' of ' + this.suit; },

ranklist : [ 'rA', 'r2', 'r3', 'r4', 'r5', 'r6',
         'r7', 'r8', 'r9', 'r10', 'rJ', 'rQ', 'rK' ],
suitlist : [ 'spades', 'hearts', 'diamonds', 'clubs' ]

};

function Card(cardname, number, parent, faceup) {
  var nodes = createCardDOM(cardname, 'cardback', 'notrump', parent);
  this.name = cardname;
  this.number = number;
  this.node = nodes[0];
  this.rankNode = nodes[1];
  this.faceup = false;
  if ((number>=0)&&(number<52)) {
    this.rank = this.ranklist[number%13];
    this.suit = this.suitlist[Math.floor(number/13)];
  } else {
    this.rank = 'cardback';
    this.suit = 'notrump';
  }
  this.rect = rectFromNode(this.node);
  this.child = null;
  this.childDX = childDX;
  this.childDY = childDY;
  this.parent = null;
  if (faceup) flipOver();
  allcards[''+cardname] = this;
}

function getCardByName(cardname) {
  return allcards[''+cardname];
}

function getCardByID(cardID) {
  var matches = cardRegex.exec(cardID);
  return (matches==null) ? null : allcards[matches[1]];
}

function findParentCard(obj) {
  while (obj) {
    var matches = cardRegex.exec(obj.id);
    if (matches!=null) {
      return allcards[matches[1]];
    } else {
      obj = obj.parentNode;
    }
  }
  return null;
}

function findParentCardByID(objectID) {
  var ret = null;
  if ((objectID!=null)&&(objectID!="")) {
    var obj = $(objectID);
    ret = findParentCard(obj);
  }
  return ret;

}
