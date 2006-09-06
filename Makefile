SCRIPTACULOUS= \
	scriptaculous/prototype.js	\
	scriptaculous/builder.js	\
	scriptaculous/controls.js	\
	scriptaculous/dragdrop.js	\
	scriptaculous/effects.js	\
	scriptaculous/scriptaculous.js	\
	scriptaculous/slider.js	
CARDSCRIPTS= \
	javascript/findDOM.js	\
	javascript/css.js	\
	javascript/stack.js	\
	javascript/undo.js	\
	javascript/dnd.js	\
	javascript/cards.js	\
	javascript/game.js	\
	javascript/ajax.js	\
	javascript/xmlrpc.js	\
	javascript/netgame.js	\
	javascript/location.js	\
	javascript/deck.js	\
	javascript/rect.js

combined.js: $(SCRIPTACULOUS) $(CARDSCRIPTS)
	cat $^ > $@
