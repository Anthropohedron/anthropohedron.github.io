CARDSCRIPTS=                     \
	javascript/dom_helper.js \
	javascript/stack.js      \
	javascript/undo.js       \
	javascript/dnd.js        \
	javascript/cards.js      \
	javascript/game.js       \
	javascript/location.js   \
	javascript/deck.js       \
	javascript/rect.js
LIB=                     \
	lib/js.cookie.js 
NETWORKING=                   \
	javascript/ajax.js    \
	javascript/xmlrpc.js  \
	javascript/netgame.js

combined.js: $(LIB) $(CARDSCRIPTS)
	cat $^ > $@

clean:
	find . -name '*~' -print0 | xargs -0 rm -f
