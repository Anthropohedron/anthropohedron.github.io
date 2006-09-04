// CardAction class
// ----------------
// Represents a single card movement.

function CardAction(src, dst, depth) {
  this.src = src;
  this.dst = dst;
  this.depth = (depth==null) ? 1 : depth;
  this.tmpStack = new Stack();
  if (!((src instanceof CardLocation) && (dst instanceof CardLocation))) {
    alert('invalid arguments to CardAction constructor');
  }
}

CardAction.prototype = {

next : null,

addToChain : function(action) {
               if (action instanceof CardAction) {
                 var end = this;
                 while (end.next != null) end = end.next;
                 end.next = action;
               }
             },

redo : function() {
         var i;
         for (i=0;i<this.depth;++i)
           this.tmpStack.push(this.src.pop());
         for (i=0;i<this.depth;++i)
           this.dst.push(this.tmpStack.pop());
         if (this.next!=null) {
           this.next.redo();
         }
       },

undo : function() {
         var i;
         if (this.next!=null) {
           this.next.undo();
         }
         for (i=0;i<this.depth;++i)
           this.tmpStack.push(this.dst.pop());
         for (i=0;i<this.depth;++i)
           this.src.push(this.tmpStack.pop());
       }

};

////////////////////////////////////////////////////////////////////////////////
// CardActionList class
// --------------------
// Represents a sequence of card movements which can be undone and redone.

function CardActionList() {
  this.done = new Stack();
  this.undone = new Stack();
}

CardActionList.prototype = {

clear : function() {
          this.done.clear();
          this.undone.clear();
        },

pushAction : function(action, noundo) {
               if (action instanceof CardAction) {
                 this.undone.clear();
                 if ((noundo!=null)&&(noundo)) {
                   this.done.clear();
                 } else {
                   this.done.push(action);
                 }
                 action.redo();
               }
             },

undo : function() {
         var action = this.done.pop();
         if (action!=null) {
           action.undo();
           this.undone.push(action);
         }
       },

redo : function() {
         var action = this.undone.pop();
         if (action!=null) {
           action.redo();
           this.done.push(action);
         }
       }

};

