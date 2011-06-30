remoteit.onFirefoxLoad = function(event) {
	document.getElementById("contentAreaContextMenu").addEventListener(
			"popupshowing", function(e) {
				remoteit.showFirefoxContextMenu(e);
			}, false);
};

remoteit.showFirefoxContextMenu = function(event) {
	// show or hide the menuitem based on what the context menu is on
	// gContextMenu Docs @ https://developer.mozilla.org/en/XUL/PopupGuide/Extensions
	document.getElementById("context-remoteit").hidden = !(gContextMenu.onImage || gContextMenu.onLink);
};

window.addEventListener("load", function() {
	remoteit.onFirefoxLoad();
}, false);
