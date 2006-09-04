// Logger class
// ------------
// An error log class

// Example: var logger = new Logger("My App Name");
function Logger(name) {
  this.name = ""+name;
  this.win = null;
  this.list = null;
}

Logger.prototype = {

    // Example: logger.log("My Message");
log : function(msg) {
        var doc = null;
        if ((this.win==null)||(this.win.closed)) {
          var re = new RegExp("[^a-zA-Z]");
          this.win = window.open("about:blank", "log_"+this.name.replace(re, "_"));
          doc = this.win.document;
          doc.open("text/html","replace");
          doc.writeln('<HTML><HEAD><TITLE>'+this.name+' Log</TITLE></HEAD>');
          doc.writeln('<BODY BGCOLOR="#FFFFFF">');
          doc.writeln('<CENTER><FORM><TABLE BORDER="0" WIDTH="80%"><TR>');
          doc.writeln('<TD><H1>'+this.name+' Log</H1></TD>');
          doc.writeln('<TD ALIGN="right"><INPUT TYPE="BUTTON" VALUE="Clear" onClick="document.logger.clear()"></TD></TR></TABLE>');
          doc.writeln('<div id="listdiv" style="border:solid 1px gray;margin:10px 10px 10px 10px;text-align:left;overflow:auto;width:80%;height:80%;"><OL ID="list"></OL></div>');
          doc.writeln('</FORM></CENTER></BODY></HTML>');
          doc.close();
          this.listdiv = doc.getElementById("listdiv");
          this.list = doc.createElement("OL");
          this.listdiv.appendChild(this.list);
          doc.logger = this;
        } else {
          doc = this.win.document;
        }
        var item = doc.createElement("LI");
        item.appendChild(doc.createTextNode(""+msg));
        this.list.appendChild(item);
      }

      // this will probably only be called by the buttons in the log window
clear : function() {
          var newList = this.win.document.createElement("OL");
          this.listdiv.replaceChild(newList, this.list);
          this.list = newList;
        }

};

