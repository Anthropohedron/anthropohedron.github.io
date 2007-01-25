
function NetCardGame(url) {
  this.reqFactory = new AJAXreqFactory(url, true, true);
  this.cardActionReq = new XMLRPCmethodCall("cardAction");
  this.commActionReq = new XMLRPCmethodCall("commAction");
  this.chatActionReq = new XMLRPCmethodCall("chatAction");
  this.pollActionReq = new XMLRPCmethodCall("pollAction");
  this.pollReq = this.reqFactory.retrieveReq();
  this.q = new LLQueue();
}

NetCardGame.prototype = new CardGame().subclass({

  handleTimeout: 30,
  pollTimeout: 200,
  lastActionID: 0,
  lastEventID: 0,

  handleFault: function(fault) { alert("Must override handleFault()"); },
  handleChat: function(evt) { alert("Must override handleChat()"); },
  handleCard: function(evt) { alert("Must override handleCard()"); },
  handleComm: function(evt) { alert("Must override handleComm()"); },
  handlePhase: function(evt) { alert("Must override handlePhase()"); },
  handleTurn: function(evt) { alert("Must override handleTurn()"); },

  beginGame: function() {
    this.wrappedPoll = AJAXrequest.prototype.wrapMethod(
        this.pollAction, this);
    this.wrappedHandle = AJAXrequest.prototype.wrapMethod(
        this.handleOneAction, this);
    this.pollAction();
    setTimeout(this.wrappedHandle, this.handleTimeout);
  },

  //cards can either be a number or an array
  cardAction: function(src, dst, cards) {
    var actionID = ++(this.lastActionID);
    var content = this.cardActionReq.toXML({
      id: ""+actionID, last_event_id: lastEventID,
      source: src, dest: dst, cards: cards });
    this.reqFactory.retrieveReq().go(this.ajaxResponse, this, content);
    return actionID;
  },

  //player is optional
  commAction: function(num, unit, player) {
    var actionID = ++(this.lastActionID);
    var content = this.commActionReq.toXML({
      id: ""+actionID, last_event_id: lastEventID,
      number: num, unit: unit });
    this.reqFactory.retrieveReq().go(this.ajaxResponse,
        this, content);
    return actionID;
  },

  chatAction: function(message) {
    var content = this.chatActionReq.toXML({
      last_event_id: lastEventID, message: message });
    this.reqFactory.retrieveReq().go(this.ajaxResponse,
        this, content);
  },

  pollAction: function() {
    var content = this.pollActionReq.toXML({
      last_event_id: lastEventID });
    this.pollReq.go(this.ajaxResponse, this, content);
  },

  handleOneAction: function() {
    if (!this.q.isEmpty()) {
      var evt = this.q.deq();
      switch (evt.action_type) {
        case 3: //chat
          this.handleChat(evt);
          break;
        case 4: //card
          this.handleCard(evt);
          break;
        case 5: //comm
          this.handleComm(evt);
          break;
        case 6: //phase
          this.handlePhase(evt);
          break;
        case 7: //turn
          this.handleTurn(evt);
          break;
      }
    }
  },

  ajaxResponse: function(result) {
    var response = this.pollActionReq.parseXML(result.xml);
    if (response.constructor.name=="XMLRPCfault") {
      this.handleFault(response);
    } else { //should be an array
      var len = result.length;
      var last = this.lastEventID;
      //we assume that the array is sorted and that we have
      //not missed any events, which is probably correct
      var i = 0;
      this.lastEventID = result[len-1].event_id;
      while ((i < len) && (result[i].event_id <= last))
        ++i;
      for (;i<len;++i)
        this.q.enq(result[i]);
    }
    if (result.reqObj==this.pollReq) {
      setTimeout(this.wrappedPoll, this.pollTimeout);
    }
  }

});

