// Note: this file is all pure JS, no libraries (not even DOM)
//
// Stack class
// -----------
// This is a generalized stack class. Nothing particularly interesting
// here, just a plain old stack.

function Stack() {}

Stack.prototype = []

Stack.prototype.top = function top() {
  var len = this.length;
  return len ? this[len-1] : undefined;
};

Stack.prototype.clear = function clear() {
  this.length = 0;
};

Stack.prototype.size = function size() {
  return this.length;
};

// LLQueue class
// -----------
// This is a queue class implemented with a circular doubly-linked list.
// Nothing particularly interesting here, just a plain old queue.

function LLQueue() {
  this.next = this;
  this.prev = this;
}

LLQueue.prototype = {

value : null,

enq : function(val) {
        var node = { value : val, next : this.next, prev : this };
        this.next.prev = node;
        this.next = node;
      },

deq : function() {
        var node = this.prev;
        if (node !== this) {
          this.prev = node.prev;
          this.prev.next = this;
          node.next = null;
          node.prev = null;
        }
        return node.value;
      },

isEmpty : function() {
            return (this.next === this);
          },

clear : function() {
          var cur = this;
          //avoid circular references
          while (cur.next !== null) {
            var next = cur.next;
            cur.next = null;
            cur.prev = null;
            cur = next;
          }
          this.next = this;
          this.pref = this;
        }

};

