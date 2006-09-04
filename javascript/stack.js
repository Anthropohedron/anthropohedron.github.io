// Stack class
// -----------
// This is a generalized stack class. Nothing particularly interesting
// here, just a plain old stack.

function Stack() {
  this.clear();
}

Stack.prototype = {

push : function(obj) {
         this.list[this.stackSize++] = obj;
       },

top : function() {
        var obj = null;
        if (this.stackSize>0) {
          obj = this.list[this.stackSize-1];
        }
        return obj;
      },

pop : function() {
        var obj = null;
        if (this.stackSize>0) {
          obj = this.list[--this.stackSize];
        }
        return obj;
      },

clear : function() {
          this.stackSize = 0;
          this.list = [];
        },

size : function() { return this.stackSize; }

};

// LLQueue class
// -----------
// This is a queue class implemented with a linked list. Nothing
// particularly interesting here, just a plain old queue.

function LLQueue() { }

LLQueue.prototype = {

value : null,
next : null,
prev : null,

enq : function(val) {
        var node = { value : val, next : this.next, prev : this };
        this.next.prev = node;
        this.next = node;
      },

deq : function() {
        var node = this.prev;
        if (node != this) {
          this.prev = node.prev;
          this.prev.next = this;
          node.next = null;
          node.prev = null;
        }
        return node.value;
      },

isEmpty : function() {
            return (this.next == null);
          },

clear : function() {
          var cur = this;
          //avoid circular references
          while (cur.next != null) {
            var next = cur.next;
            cur.next = null;
            cur.prev = null;
            cur = next;
          }
          this.next = this;
          this.pref = this;
        }

};

