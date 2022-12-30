autorun :
	$(info )
	$(info $()  build ........ build the frontend)
	$(info $()  publish ...... publish the package to NPM)
	$(info $()  release ...... build the frontend and package a new release)
	$(info $()  unrelease .... git-revert all release artifacts)

build:
	./scripts/build.sh

release:
	./scripts/release.sh

unrelease:
	./scripts/unrelease.sh

publish:
	cd dist && npm publish
