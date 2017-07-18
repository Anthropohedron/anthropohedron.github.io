.FAKE: all

all: packaged/images packaged/combined.css packaged/combined.js packaged/index.html

packaged:
	mkdir -p $@

packaged/combined.js: packaged/index.html
packaged/combined.css: packaged/index.html

packaged/images: images
	rm -rf $@
	cp -a $< $@

packaged/index.html: index.html combine.awk packaged
	awk -F '"' -f combine.awk $< > $@

clean:
	find . -name '*~' -print0 | xargs -0 rm -f
	rm -rf packaged
