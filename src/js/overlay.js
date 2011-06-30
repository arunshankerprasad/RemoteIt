var remoteit = {
	onLoad : function() {
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("remoteit-strings");
	},

	onMenuItemCommand : function(e) {
		var promptService = this.getPromptService();
		// promptService.alert(window,
		// this.strings.getString("helloMessageTitle"),
		// this.strings.getString("helloMessage"));

		var href = gContextMenu.target.href;
		promptService.alert(window, this.strings
				.getString("deRemoteItMessageTitle"), this.deRemoteIt(href));
	},

	getPromptService : function() {
		return Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
	},

	onToolbarButtonCommand : function(e) {
		var promptService = this.getPromptService();

		var href = gBrowser.currentURI.spec;
		promptService.alert(window, this.strings
				.getString("deRemoteItMessageTitle"), this.deRemoteIt(href));
	},

	shouldWeHandleThisURL : function(url) {
		if (url.indexOf("workplace.plus.net") != -1
				&& url.indexOf("remote.plus.net") == -1) {
			return true;
		}
		return false;
	},

	deRemoteIt : function(url) {
		var deRemoted = url;
		return deRemoted;
	},

	remoteIt : function(url) {
		var remoted = url;
		return remoted;
	}

};

window.addEventListener("load", function() {
	remoteit.onLoad();
}, false);
