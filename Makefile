autorun help:
	   echo "  build ........ build the frontend" \
	&& echo "  publish ...... publish the package to NPM" \
	&& echo "  release ...... build the frontend and package a new release" \
	&& echo "  unrelease .... git-revert all release artifacts" \
	&& echo "  uplift ....... upgrade all dependencies to the latest version"

build:
	./scripts/build.sh

release:
	./scripts/release.sh

unrelease:
	./scripts/unrelease.sh

publish:
	cd dist && npm publish

uplift:
	$(MAKE) -C frontend uplift && echo "" && $(MAKE) -C backend uplift
