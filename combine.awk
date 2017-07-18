#!/usr/bin/awk -f

BEGIN { stylesheets = 0; scripts = 0; }

/^<link/ {
	fname = $6;
	if (!stylesheets) {
		printf("cat %s > packaged/combined.css\n", fname) |"sh -x";
		$6 = "combined.css";
		stylesheets = 1;
		print;
	} else {
		printf("cat %s >> packaged/combined.css\n", fname) |"sh -x";
	}
	next;
}

/^<script/ {
	fname = $6;
	if (!scripts) {
		printf("cat %s > packaged/combined.js\n", fname) |"sh -x";
		$6 = "combined.js";
		scripts = 1;
		print;
	} else {
		printf("cat %s >> packaged/combined.js\n", fname) |"sh -x";
	}
	next;
}

{ print }

