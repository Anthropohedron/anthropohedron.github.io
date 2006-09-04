function newTag(parent, tagname, classname) {
  var node = document.createElement(tagname);
  parent.appendChild(node);
  if (classname) node.className = classname;
  return node;
}

function newDiv(parent, classname) {
  return newTag(parent, 'div', classname);
}

function newZbox(parent) { return newDiv(parent, 'zerobox'); }

function newSpan(parent, classname) {
  var node = document.createElement('span');
  parent.appendChild(node);
  node.className = classname;
  return node;
}

function newImgspan(parent) { return newSpan(parent, 'imgspan'); }

function newImg(parent, url) {
  var node = document.createElement('img');
  parent.appendChild(node);
  node.src = url;
  return node;
}

function stripPX(len) {
  var pos = len.indexOf('px');
  if (pos<1) return null;
  return (len.substring(0, pos))*1;
}

