// CardDragger class
// -----------------
// This manages a card being dragged around the playing field. It mostly
// manages mouse events.

function CardDragger(game) {
  this.game = game;
  var self = this;
  this.handlers = [
      [ this.mouseDown, 'mousedown' ],
      [ this.mouseMove, 'mousemove' ],
      [ this.mouseUp, 'mouseup' ],
      [ this.click, 'click' ],
      [ this.dblClick, 'dblclick' ]
    ];
  this.handlers.each(function(fn)
      { fn[0] = fn[0].bindAsEventListener(self); });
}

CardDragger.prototype = {

  dragCard: null,
  cX: 0,
  cY: 0,
  oldZ: 0,

  observeElement: function(element) {
    this.handlers.each(function(h) { Event.observe(element, h[1], h[0]); });
    element = null;
  },

  isAnimating: function() {
    var queue = Effect.Queues.get('cardscope');
    return queue.effects.detect(function(e) { return e.state != 'finished'; });
  },

  mouseDown: function(evt) {
    var element = Event.element(evt);
    Event.stop(evt);
    if (this.isAnimating()) return;
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

  mouseMove: function(evt) {
    Event.stop(evt);
    if (this.isAnimating()) return;
    if (this.dragCard!=null) {
      this.dragCard.moveTo(Event.pointerX(evt) - this.cX, Event.pointerY(evt) - this.cY);
      this.game.movedCard(evt, this.dragCard, this);
      //return true;
    }
    return false;
  },

  mouseUp: function(evt) {
    Event.stop(evt);
    if (this.isAnimating()) return;
    if (this.dragCard!=null) {
      var card = this.dragCard;

      this.dragCard = null;
      card.setZ(this.oldZ);
      this.game.dropCard(evt, card, this);
      //return true;
    }
    return false;
  },

  click: function(evt) {
    var element = Event.element(evt);
    Event.stop(evt);
    if (this.isAnimating()) return;
    var card = Card.findParentCard(element);
    if (card!=null) {
      this.game.clickCard(card, this);
    }
    return false;
  },

  dblClick: function(evt) {
    var element = Event.element(evt);
    Event.stop(evt);
    if (this.isAnimating()) return;
    var card = Card.findParentCard(element);
    if (card!=null) {
      this.game.dblclickCard(card, this);
    }
    return false;
  }

};

