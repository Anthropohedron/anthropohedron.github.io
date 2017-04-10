SCRIPTACULOUS=                         \
	scriptaculous/prototype.js     \
	scriptaculous/effects.js       \
	scriptaculous/builder.js       \
	scriptaculous/controls.js      \
	scriptaculous/dragdrop.js      \
	scriptaculous/scriptaculous.js \
	scriptaculous/slider.js
CARDSCRIPTS=                     \
	javascript/dom_helper.js \
	javascript/stack.js      \
	javascript/undo.js       \
	javascript/dnd.js        \
	javascript/cards.js      \
	javascript/game.js       \
	javascript/ajax.js       \
	javascript/xmlrpc.js     \
	javascript/netgame.js    \
	javascript/location.js   \
	javascript/deck.js       \
	javascript/rect.js
LIB=                     \
	lib/js.cookie.js 

combined.js: $(LIB) $(SCRIPTACULOUS) $(CARDSCRIPTS)
	cat $^ > $@

clean:
	find . -name '*~' -print0 | xargs -0 rm -f
