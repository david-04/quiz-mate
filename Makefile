autorun help:
	   echo "  build ........ build the frontend" \
	&& echo "  publish ...... publish the package to NPM" \
	&& echo "  release ...... build the frontend and package a new release" \
	&& echo "  unrelease .... git-revert all release artifacts" \
	&& echo "  uplift ....... upgrade all dependencies to the latest version"

build:
	. bin/build.sh

release:
	. bin/release.sh

unrelease:
	. bin/unrelease.sh

publish:
	. bin/publish.sh

uplift:
	$(MAKE) -C frontend uplift && echo "" && $(MAKE) -C backend uplift
