var DOMhelper = {

newTag: function(parent, tagname, classname) {
  var node = document.createElement(tagname);
  parent.appendChild(node);
  if (classname) node.className = classname;
  return node;
},

newDiv: function(parent, classname) {
  return this.newTag(parent, 'div', classname);
},

newZbox: function(parent) { return this.newDiv(parent, 'zerobox'); },

newSpan: function(parent, classname) {
  var node = document.createElement('span');
  parent.appendChild(node);
  node.className = classname;
  return node;
},

newImgspan: function(parent) { return this.newSpan(parent, 'imgspan'); },

newImg: function(parent, url) {
  var node = document.createElement('img');
  parent.appendChild(node);
  node.src = url;
  return node;
},

stripPX: function(len) {
  var pos = len.indexOf('px');
  if (pos<1) return null;
  return (len.substring(0, pos))*1;
}

};

var CardDOM = Object.extend(new Object(), DOMhelper);
Object.extend(CardDOM, {

/*
pipsURL: (navigator.userAgent.toLowerCase().indexOf('msie')>=0) ?
  'images/pips.gif' : 'images/pips.png',
/**/
pipsURL: 'images/pips.png',
/**/
rankURL: 'images/ranks.png',
faceURL: 'images/faces.png',

createTLDOM: function(parent) {
  var node = this.newDiv(parent, 'rankTL');
  node = this.newImgspan(node);
  node = this.newImg(node, this.rankURL);
  node = this.newDiv(parent, 'tagpipTL');
  node = this.newImgspan(node);
  node = this.newImg(node, this.pipsURL);
},

createPipDOM: function(parent, num) {
  var node = this.newDiv(parent, 'pip'+num.toString(16).toUpperCase());
  node = this.newImgspan(node);
  node = this.newImg(node, this.pipsURL);
},

createFaceDOM: function(parent) {
  var pnode = this.newDiv(parent, 'face');
  var node = this.newSpan(pnode, 'faceimg');
  node = this.newImg(node, this.faceURL);
  var pipTable = this.newTag(pnode, 'table', 'pips');
  pipTable = this.newTag(pipTable, 'tbody');

  var pipRow = this.newTag(pipTable, 'tr');
  pnode = this.newTag(pipRow, 'td', 'topRow');
  this.createPipDOM(pnode, 1);
  pnode = this.newTag(pipRow, 'td', 'centerCol');
  pnode.rowSpan = 3;
  this.createPipDOM(pnode, 5);
  this.createPipDOM(pnode, 6);
  this.createPipDOM(pnode, 7);
  this.createPipDOM(pnode, 8);
  pnode = this.newTag(pipRow, 'td', 'topRow');
  this.createPipDOM(pnode, 9);

  pipRow = this.newTag(pipTable, 'tr');
  pnode = this.newTag(pipRow, 'td');
  this.createPipDOM(pnode, 2);
  this.newDiv(pnode, 'sep');
  this.createPipDOM(pnode, 3);
  pnode = this.newTag(pipRow, 'td');
  this.createPipDOM(pnode, 10);
  this.newDiv(pnode, 'sep');
  this.createPipDOM(pnode, 11);

  pipRow = this.newTag(pipTable, 'tr');
  pnode = this.newTag(pipRow, 'td', 'bottomRow');
  this.createPipDOM(pnode, 4);
  pnode = this.newTag(pipRow, 'td', 'bottomRow');
  this.createPipDOM(pnode, 12);
},

createBRDOM: function(parent) {
  var node = this.newDiv(parent, 'tagpipBR');
  node = this.newImgspan(node);
  node = this.newImg(node, this.pipsURL);
  node = this.newDiv(parent, 'rankBR');
  node = this.newImgspan(node);
  node = this.newImg(node, this.rankURL);
},

createCardDOM: function(cardname, rank, suit, parent) {
  if (parent==null) {
    parent = document.body;
  }
  var cardNode = this.newDiv(parent, 'suit ' + suit);
  var rankNode = this.newDiv(cardNode, 'rank ' + rank);
  cardNode.id = 'card_' + cardname + '_suit';
  rankNode.id = 'card_' + cardname + '_rank';
  var cardTable = this.newTag(rankNode, 'table', 'cardLayout');
  cardTable = this.newTag(cardTable, 'tbody');
  var tableRow = this.newTag(cardTable, 'tr');

  this.createTLDOM(this.newTag(tableRow, 'td', 'rankTLbox'));
  this.createFaceDOM(this.newTag(tableRow, 'td', 'faceBox'));
  this.createBRDOM(this.newTag(tableRow, 'td', 'rankBRbox'));

  var surf = this.newDiv(rankNode, 'surface');
  surf.id = 'card_' + cardname + '_surf';

  return [cardNode, rankNode];
}

});

