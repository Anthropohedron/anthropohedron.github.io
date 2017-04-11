// Rectangle class
// ---------------
// This represents a rectangle in absolute document coordinates. Mostly
// useful for intersection tests.
//
// Note: pure JS, no libraries (except DOM)

Rectangle.prototype = {

containsPoint : function(x, y) {
                  var dx = x - this.left;
                  var dy = y - this.top;
                  var w = this.right - this.left;
                  var h = this.bottom - this.top;
                  return ((dx>=0)&&(dy>=0)&&(dx<=w)&&(dy<=h));
                },

intersects : function(rect) {
               //alert('Intersecting...\nUs: '+this.toString()+'\n Them: '+rect.toString());
               return ((
                     ((this.top<=rect.bottom) && (this.top>=rect.top)) ||
                     ((rect.top<=this.bottom) && (rect.top>=this.top))
                     )
                   && (
                     ((this.left<=rect.right) && (this.left>=rect.left)) ||
                     ((rect.left<=this.right) && (rect.left>=this.left))
                     ));
             },

width : function() { return (this.right - this.left); },

height : function() { return (this.bottom - this.top); },

toString : function() {
             return ''
               + this.top    + ', '
               + this.left   + ', '
               + this.bottom + ', '
               + this.right;
           },

updateFromNode : function(node) {
                   /*
                      this.top = (node.style.top) ? node.style.top :
                      ((node.style.pixelTop) ? node.style.pixelTop : node.offsetTop);
                      this.left = (node.style.left) ? node.style.left :
                      ((node.style.pixelLeft) ? node.style.pixelLeft : node.offsetLeft);
                      this.right = this.left +
                      (node.offsetWidth) ? node.offsetWidth : node.clip.width;
                      this.bottom = this.top +
                      (node.offsetHeight) ? node.offsetHeight : node.clip.height;
                    */
                   if (node!=null) {
                     this.top = node.offsetTop;
                     this.left = node.offsetLeft;
                     this.right = this.left + node.offsetWidth;
                     this.bottom = this.top + node.offsetHeight;
                   } else {
                     alert("Null node");
                   }
                 }

};

function Rectangle(top, left, width, height) {
  this.top = top;
  this.left = left;
  this.bottom = top + height;
  this.right = left + width;
}

function rectFromNode(node) {
  var rect = new Rectangle(0, 0, 0, 0);
  rect.updateFromNode(node);
  return rect;
}

