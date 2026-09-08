UUID := ubuntu-slack-notification-cleaner@thymus16.github.io

.PHONY: check package install

check:
	npm run check

package:
	mkdir -p dist
	gnome-extensions pack --force --out-dir=dist --extra-source=matching.js --extra-source=LICENSE .

install: package
	gnome-extensions install --force dist/$(UUID).shell-extension.zip
