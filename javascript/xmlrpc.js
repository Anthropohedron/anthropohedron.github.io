function XMLdoc(rootTag) {
  this.xml = this.createDoc(rootTag);
  if (this.xml.documentElement) {
    this.documentElement = this.xml.documentElement;
  } else { //crackheaded brokenness in Safari
    var nodes = this.xml.getElementsByTagName(""+rootTag);
    if (nodes.length==1) {
      this.documentElement = nodes.item(0);
    } else {
      this.documentElement = this.createElement(""+rootTag);
      this.xml.appendChild(this.documentElement);
    }
  }
}

XMLdoc.prototype = {

  createDoc: function(root) {
    var func;
    if (document.implementation &&
        document.implementation.createDocument) {
      func = function(rootTag) {
        return document.implementation.createDocument("",
            ""+rootTag, null);
      }
    } else if (window.ActiveXObject) {
      func = function(rootTag) {
        var xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.appendChild(xml.createElement(""+rootTag));
        return xml;
      }
    } else {
      func = function() {
        alert("Your browser can't create XML documents");
        return false;
      }
    }
    this.createDoc = func;
    XMLdoc.prototype.createDoc = func;
    return func(root);
  },

  createElement: function(tag) { return this.xml.createElement(tag); },

  createLeafNode: function(tag, text) {
    var node = this.createElement(""+tag);
    var textNode = this.createTextNode(""+text);
    node.appendChild(textNode);
    return node;
  },

  createCDATASection: function(text) {
    return this.xml.createCDATASection(text);
  },

  createTextNode: function(text) { return this.xml.createTextNode(text); },

  serializeDoc: function() {
    var func;
    if (document.implementation &&
        document.implementation.createLSSerializer
       ) { //DOM standard
      var outerWriter =
        document.implementation.createLSSerializer();
      func = function() {
        var writer = outerWriter;
        return '<?xml version="1.0" encoding="UTF-8"?>'+
          writer.writeToString(this.xml);
      }
    } else if (doc.xml) { //IE
      func = function() {
        return '<?xml version="1.0" encoding="UTF-8"?>'+
          this.xml.xml;
      }
    } else if (typeof XMLSerializer != 'undefined') { //Mozilla
      var outerWriter = new XMLSerializer();
      func = function() {
        var writer = outerWriter;
        return '<?xml version="1.0" encoding="UTF-8"?>'+
          writer.serializeToString(this.xml);
      }
    } else { //Unsupported
      func = function() {
        alert("Your browser can't serialize XML documents");
        return false;
      }
    }
    this.serializeDoc = func;
    XMLdoc.prototype.serializeDoc = func;
    return this.serializeDoc();
  }

};

////////////////////////////////////////////////////////////////////////////////

function XMLRPCmethodCall(methodName) {
  this.method = "<methodName>"+methodName+"</methodName>";
}

function XMLRPCfault(val) {
  this.value = val;
}

//primary entry points are toXML(params...) and parseXML(xmldoc)
XMLRPCmethodCall.prototype = {

  dateRegex: /([0-9]{4})([01][0-9])([0-3][0-9])T([012][0-9](:[0-5][0-9]){2})/,

  //takes an XML DOM document
  //returns an array or an XMLRPCfault object
  parseXML: function(xml) {
    //assume that it is proper XML-RPC if either a <fault> node or
    //at least one <param> node is found
    var nodes = xml.getElementsByTagName("fault");
    var valueNode;
    var result;
    var i;
    if ((nodes!=null) && (nodes.length!=0)) {
      valueNode = nodes[0].childNodes[0];
      result = new XMLRPCfault(this.parseValueNode(valueNode));
    } else {
      nodes = xml.getElementsByTagName("param");
      result = [];
      for (var i=0; i<nodes.length; ++i) {
        valueNode = nodes[i].childNodes[0];
        result[i] = this.parseValueNode(valueNode);
      }
    }
    return result;
  },

  //can take any number of params (should be at least one)
  //returns an XML string
  toXML: function() {
    var xml = new XMLdoc("methodCall");
    var node = xml.createLeafNode("methodName", this.method);
    var params = xml.createElement("params");

    xml.documentElement.appendChild(node);
    xml.documentElement.appendChild(params);

    for (var i=0; i<arguments.length;++i)
      if ((typeof arguments[i]).toLowerCase() != "function") {
        node = xml.createElement("param");
        node.appendChild(this.serialize(xml, arguments[i]));
        params.appendChild(node);
      }
    return xml.serializeDoc();
  },

  /*

  indentStr: "\t",

  toXML: function() {
           var str = '<?xml version="1.0" encoding="UTF-8"?>' +
             '\n<methodCall>\n'+this.indent(1)+
             this.method+"\n"+this.indent(1)+"<params>\n";
           for (var i=0; i<arguments.length;++i)
             if (typeof(arguments[i]).toLowerCase() != "function") {
               str += this.indent(2)+"<param>"+
                 this.serialize(arguments[i], 2)+"</param>\n";
             }
           str += "\t</params>\n</methodCall>\n";
           return str;
         },

  serialize: function(obj, indent) {
               var str = "<value>";
               var i;
               switch (this.inferType(obj)) {
                 case "int":
                   str += "<int>"+obj+"</int></value>";
                 break;
                 case "double":
                   str += "<double>"+obj+"</double></value>";
                 break;
                 case "boolean":
                   obj = obj ? 1 : 0;
                   str += "<boolean>"+obj+"</boolean></value>";
                 break;
                 case "date":
                   obj = this.ISO8601format(obj);
                   str += "<dateTime.iso8601>"+obj+"</dateTime.iso8601></value>";
                 break;
                 case "string":
                   str += "<![CDATA["+obj+"]]></value>";
                 break;
                 case "array":
                   str += "<array><data>\n"
                   for (i=0;i<obj.length;++i)
                     str += this.serialize(obj[i], indent+1);
                 str += this.indent(indent)+"</data></array></value>";
                 break;
                 case "object":
                   str += "<struct>\n";
                 for (i in obj)
                   if (typeof(obj[i]).toLowerCase() != "function") {
                     str += this.indent(indent+1)+"<member>\n";
                     str += this.indent(indent+2)+"<name>"+i+"</name>\n";
                     str += this.indent(indent+2)+
                       this.serialize(obj[i], indent+2);
                     str += this.indent(indent+1)+"</member>\n";
                   }
                 str += this.indent(indent)+"</struct></value>";
                 break;
               }
               return str;
             },

  indent: function(count) {
            var str = "";
            for (var i=0;i<count;++i)
              str += indentStr;
            return str;
          },

  /*
  */

  serialize: function(xml, obj) {
    var valNode = xml.createElement("value");
    var node;
    var pnode;
    var i;
    switch (this.inferType(obj)) {
      case "int":
        valNode.appendChild(xml.createLeafNode("int", obj));
      break;
      case "double":
        valNode.appendChild(xml.createLeafNode("double", obj));
      break;
      case "boolean":
        obj = obj ? 1 : 0;
      valNode.appendChild(xml.createLeafNode("boolean", obj));
      break;
      case "date":
        obj = this.ISO8601format(obj);
      valNode.appendChild(xml.createLeafNode(
            "dateTime.iso8601", obj));
      break;
      case "string":
        valNode.appendChild(xml.createCDATASection(""+obj));
      break;
      case "array":
        pnode = xml.createElement("array");
      valNode.appendChild(pnode);
      node = xml.createElement("data");
      pnode.appendChild(node);
      for (i=0;i<obj.length;++i)
        node.appendChild(this.serialize(xml, obj[i]));
      break;
      case "object":
        pnode = xml.createElement("struct");
      for (i in obj)
        if (typeof(obj[i]).toLowerCase() != "function") {
          node = xml.createElement("member");
          pnode.appendChild(node);
          node.appendChild(xml.createLeafNode("name", i));
          node.appendChild(this.serialize(xml, obj[i]));
        }
      break;
    }
    return str;
  },

  inferType: function(obj) {
    var type = (typeof obj).toLowerCase();
    switch (type) {
      case "number":
        type = (Math.round(obj) == obj) ? "int" : "double";
      break;
      case "object":
        var ctorName = obj.constructor.name.toLowerCase();
      if ((ctorName=="date") || (ctorName=="array"))
        type = ctorName;
      break;
    }
    return type;
  },

  extractText: function(node) {
    var result;
    if (node==null)
      result = "";
    else if ((node.nodeName=="#text") ||
        (node.nodeName=="#cdata-section"))
      result = node.nodeValue;
    else
      result = this.extractText(node.childNodes[0]);
    return result;
  },

  parseValueNode: function(node) {
    var result;
    var i;
    //assert(node.name == "value")
    //assert(node.childNodes.length==1)
    node = childNodes[0];
    switch (node.nodeName) {
      case "int":
        case "i4":
        result = parseInt(this.extractText(node));
      break;
      case "double":
        result = parseFloat(this.extractText(node));
      break;
      case "boolean":
        result = parseInt(this.extractText(node));
      result = (result!=0);
      break;
      case "date.iso8601":
        result = this.extractText(node);
      result = result.replace(this.dateRegex, "$1/$2/$3 $4");
      result = new Date(result);
      break;
      case "array":
        node = node.childNodes[0];
      //assert(node.name=="data")
      result = [];
      for (i=0;i<node.childNodes.length;++i)
        //assert(node.childNodes[i].name=="value")
        result[i] = this.parseValueNode(node.childNodes[i]);
      break;
      case "struct":
        result = {};
      for (i=0;i<node.childNodes.length;++i) {
        var member = node.childNodes[i];
        //assert(member.name=="member")
        //assert(member.childNodes[0].name=="name")
        //assert(member.childNodes[1].name=="value")
        var memberName =
          this.extractText(member.childNodes[0]);
        result[memberName] =
          this.parseValueNode(member.childNodes[1]);
      }
      break;
      default: //treat it as a string
      result = this.extractText(node);
      break;
    }
    return result;
  },

  twoCharInt: function(num) {
    var shortNum = (typeof(num).toLowerCase()=="number") ?
      (num<10) : (num.length<2);
    return (shortNum?"0":"")+num;
  },

  ISO8601format: function(date) {
    var i2c = this.twoCharInt;
    return ""+date.getYear()+i2c(date.getMonth())+
      i2c(date.getDate())+"T"+i2c(date.getHours())+":"+
      i2c(date.getMinutes())+":"+i2c(date.getSeconds());
  }

};

