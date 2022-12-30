autorun :
	$(info )
	$(info $()  build ........ build the frontend)
	$(info $()  release ...... build the frontend and package a new release)
	$(info $()  unrelease .... revert the release)

build:
	./scripts/build.sh

release:
	./scripts/release.sh

unrelease:
	./scripts/unrelease.sh
