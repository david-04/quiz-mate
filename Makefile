autorun :
	$(info $()  build ........ build the frontend)
	$(info $()  publish ...... publish the package to NPM)
	$(info $()  release ...... build the frontend and package a new release)
	$(info $()  unrelease .... git-revert all release artifacts)
	$(info $()  uplift ....... upgrade all dependencies to the latest version)

build:
	./scripts/build.sh

release:
	./scripts/release.sh

unrelease:
	./scripts/unrelease.sh

publish:
	cd dist && npm publish

uplift:
	cd frontend && yarn set version latest && yarn up "*@latest"
	cd backend && yarn set version latest && yarn up "*@latest"
