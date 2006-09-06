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

newZbox: function(parent) {
		 return this.newDiv(parent, 'zerobox');
	 },

newSpan: function(parent, classname) {
		 var node = document.createElement('span');
		 parent.appendChild(node);
		 node.className = classname;
		 return node;
	 },

newImgspan: function(parent) {
		    return this.newSpan(parent, 'imgspan');
	    },

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
