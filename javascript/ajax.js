
function XHRfactory() {
  this.pool = [];
}

XHRfactory.prototype = {

poolSize : 0,

createXHR : function() {
              var i = -1;
              var xhr = false;
              var funcs = [
                function() { return new XMLHttpRequest(); },
                function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
                function() { return new ActiveXObject("Microsoft.XMLHTTP"); },
                function() { alert("No XMLHttpRequest!"); return false; }
              ];
              try {
                xhr = funcs[++i]();
              } catch (trymicrosoft) {
                try {
                  xhr = funcs[++i]();
                } catch (othermicrosoft) {
                  try {
                    xhr = funcs[++i]();
                  } catch (failed) {
                    xhr = funcs[++i]();
                  }
                }
              }

              this.createXHR = funcs[i];
              XHRfactory.prototype.createXHR = funcs[i];
              return xhr;
            },

retrieveXHR : function() {
                var xhr = false;
                if (this.poolSize > 0) {
                  xhr = this.pool[--this.poolSize];
                } else {
                  xhr = this.createXHR();
                }
                return xhr;
              },

releaseXHR : function(xhr) {
               this.pool[this.poolSize++] = xhr;
             }
};

////////////////////////////////////////////////////////////////////////////////

function AJAXresult(xhr, reqObj) {
  this.reqObj = reqObj;
  this.xhr = xhr;
  this.text = xhr.responseText;
  this.xml = xhr.responseXML;
}

AJAXresult.prototype = {

headers : function() {
            return xhr.getAllResponseHeaders();
          },

headerValue : function(label) {
                return xhr.getResponseHeader(label);
              }
};

////////////////////////////////////////////////////////////////////////////////

function AJAXrequest(url, post, xml, asynch, username, password) {
  this.url = url;
  this.post = (post==null) ? false : post;
  this.xml = (xml==null) ? false : xml;
  this.asynch = (asynch==null) ? true : asynch;
  this.username = username;
  this.password = password;
}

AJAXrequest.prototype = {

xhr : null,
period : null,
timer : null,
factory : new XHRfactory(),

wrapMethod : function(method, context) {
               var wrapped = method;
               if (context != null) {
                 wrapped = function() {
                   var obj = context;
                   var func = method;
                   func.apply(obj, arguments);
                 }
               }
               return wrapped;
             },

startTimer : function() {
               if (this.period != null) {
                 var self = this;
                 var goFunc = function() {
                   var req = self;
                   req.go(req.callbackFunc, null,
                       req.content, req.period);
                 }
                 this.timer = setTimeout(goFunc, this.period);
                 return true;
               }
               return false;
             },

stopTimer : function() {
              clearTimeout(this.timer);
              this.timer = null;
            },

resetTimer : function() {
               if (this.timer != null) {
                 this.stopTimer();
                 this.startTimer();
               }
             },

ajaxCallback : function() {
                 if (this.xhr.readyState == 4) {
                   if (this.xhr.status != 200) {
                     alert("HTTP request failed: status "+this.xhr.status);
                   } else {
                     var callback = this.callbackFunc;
                     callback(new AJAXresult(this.xhr, this));
                   }
                   this.factory.releaseXHR(this.xhr);
                   this.xhr = null;
                   if (!(this.startTimer()) &&
                       this.onCompletedRequest!=null)
                     this.onCompletedRequest(this);
                 }
               },

inflight : function() {
             return ((this.xhr!=null)||(this.timer!=null));
           },

           // callbackObj is optional, as is content and period
go : function(callbackFunc, callbackObj, content, period) {
       if (this.inflight()) {
         return false;
       }
       this.timer = null;
       this.callbackFunc = this.wrapMethod(callbackFunc, callbackObj);
       this.content = content;
       this.period = period;
       this.xhr = this.factory.retrieveXHR();
       var self = this;
       if (this.post) {
         if (this.xml)
           xhr.setRequestHeader('Content-Type', 'text/xml');
         else
           xhr.setRequestHeader('Content-Type',
               'application/x-www-form-urlencoded');
       }
       this.xhr.open(this.post?"POST":"GET", this.url, this.asynch,
           this.username, this.password);
       this.xhr.onreadystatechange = this.wrapMethod(this.ajaxCallback, this);
       if (this.post && this.xml)
         this.xhr.send(content);
       else
         this.xhr.send(escape(content));
       return true;
     },

abort : function() {
          if (this.xhr==null) {
            alert("Trying to abort when no request is in progress.");
          } else {
            this.stopTimer();
            this.xhr.abort();
            this.factory.releaseXHR(this.xhr);
            this.xhr = null;
          }
        }

};

////////////////////////////////////////////////////////////////////////////////

function AJAXreqFactory(url, post, xml, asynch, username, password) {
  this.pool = [null];
  this.url = url;
  this.post = post;
  this.xml = xml;
  this.asynch = asynch;
  this.username = username;
  this.password = password;
  this.onCompletedRequest =
    AJAXrequest.prototype.wrapMethod(this.releaseReq, this);
}

AJAXreqFactory.prototype = {

poolSize : 0,

wrapMethod : AJAXrequest.prototype.wrapMethod,

createReq : function() {
              var req = new AJAXrequest(this.url, this.post, this.xml,
                  this.asynch, this.username, this.password);
              req.onCompletedRequest = this.onCompletedRequest;
            },

retrieveReq : function() {
                var req = this.pool.pop();
                if (req==null) {
                  this.pool.push(null);
                  req = this.createREQ();
                }
                return req;
              },

releaseReq : function(req) {
               this.pool.push(req);
             }

};

