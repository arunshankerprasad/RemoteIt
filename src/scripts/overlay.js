var remoteItUtils = {

	DEBUG : false,

	shouldWeHandleThisURL : function(url) {
		if ((this.url_utils.isProblemUrl(url) || this.url_utils.isJobUrl(url) || this.url_utils.isTaskUrl(url) || url
				.indexOf("workplace.plus.net") != -1)
				&& url.indexOf("remote.plus.net") == -1) {
			return true;
		}
		return false;
	},

	debug : function(msg) {
		if (this.DEBUG) {
			alert(msg);
		}
	},

	url_utils : {
		remote_plus_net : "remote.plus.net",
		remote_plus_net_url_base : "https://remote.plus.net/",
		dana_info_handle : ",DanaInfo=",
		ssl_handle : ",SSL",
		problem_url : "https://remote.plus.net/programme_tool/,DanaInfo=workplace.plus.net,SSL+problem.html?problem_id=",
		job_url : "https://remote.plus.net/programme_tool/,DanaInfo=workplace.plus.net,SSL+job.html?job_id=",
		task_url : "https://remote.plus.net/programme_tool/,DanaInfo=workplace.plus.net,SSL+pr_edit_tasks.html?task_id=",

		deRemote : function(input) {
			remoteItUtils.debug("DeRemote: " + input);
			// Covert something like
			// https://remote.plus.net/apps/blagnys@portal.plus.net/kbdfaults/confirm/,DanaInfo=workplace.plus.net,SSL+cli
			// to https://workplace.plus.net/apps/blagnys@portal.plus.net/kbdfaults/confirm/cli
			var proto = (this.shouldWeUseSSLForDeRemote(input) ? "https://" : "http://");
			return input.replace(/(ftp|http|https|file):\/\/remote.plus.net\//gim, "").replace(
					/^(.*?),DanaInfo=(.*?),SSL\+(.*?$)/gim, proto + "$2/$1$3");
		},

		convert : function(input) {
			remoteItUtils.debug("Convert: " + input);
			if (this.isProblemUrl(input)) {
				remoteItUtils.debug("Convert problem URL");
				return this.getProblemUrl(input);
			} else if (this.isJobUrl(input)) {
				remoteItUtils.debug("Convert job URL");
				return this.getJobUrl(input);
			} else if (this.isTaskUrl(input)) {
				remoteItUtils.debug("Convert task URL");
				return this.getTaskUrl(input);
			} else {
				remoteItUtils.debug("Workplace URL");
				return this.getRemotedURL(input);
			}
		},

		getRemotedURL : function(input) {

			// Covert something like https://workplace.plus.net/apps/blagnys@portal.plus.net/kbdfaults/confirm/cli
			// to
			// https://remote.plus.net/apps/blagnys@portal.plus.net/kbdfaults/confirm/,DanaInfo=workplace.plus.net,SSL+cli
			var ssl = (this.shouldWeUseSSL(input) ? this.ssl_handle : "");
			return this.remote_plus_net_url_base
					+ input.replace(/(ftp|http|https|file):\/\//gim, "").replace(/^(.*?)\/?(.*?\/?.*?)([^\/]*$)/gim,
							"$2" + this.dana_info_handle + "$1" + ssl + "+$3");
			// .replace(/[\S]+(\b|$)/gim, "$&");
		},

		isProblemUrl : function(kwrd) {
			return kwrd.replace(/(ftp|http|https|file):\/\//gim, "").search(/(p|problem):/gim) != -1;
		},

		isJobUrl : function(kwrd) {
			return kwrd.replace(/(ftp|http|https|file):\/\//gim, "").search(/(j|job):/gim) != -1;
		},

		isTaskUrl : function(kwrd) {
			return kwrd.replace(/(ftp|http|https|file):\/\//gim, "").search(/(t|task):/gim) != -1;
		},

		getProblemUrl : function(kwrd) {
			return this.problem_url + kwrd.replace(/(ftp|http|https|file):\/\//gim, "").replace(/^.*?(p|problem):(.*)\/(.*)/gim, "$2");
		},

		getJobUrl : function(kwrd) {
			return this.job_url + kwrd.replace(/(ftp|http|https|file):\/\//gim, "").replace(/^.*?(j|job):(.*)\/(.*)/gim, "$2");
		},

		getTaskUrl : function(kwrd) {
			return this.task_url + kwrd.replace(/(ftp|http|https|file):\/\//gim, "").replace(/^.*?(t|task):(.*)\/(.*)/gim, "$2");
		},

		shouldWeUseSSL : function(input) {
			return input.indexOf("workplace.plus.net") != -1;
		},

		shouldWeUseSSLForDeRemote : function(input) {
			return input.indexOf(this.ssl_handle) != -1;
		}
	},
	copyLinkToClipboard : function(copyURL, copyLabel) {

		// generate the Unicode and HTML versions of the Link

		var textUnicode = copyURL;
		if (copyLabel == null) {
			copyLabel = copyURL;
		}
		var textHtml = ("<a href=\"" + copyURL + "\">" + copyLabel + "</a>");

		// make a copy of the Unicode

		var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		if (!str)
			return false; // couldn't get string obj
		str.data = textUnicode; // unicode string?

		// make a copy of the HTML

		var htmlstring = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		if (!htmlstring)
			return false; // couldn't get string obj
		htmlstring.data = textHtml;

		// add Unicode & HTML flavors to the transferable widget

		var trans = Components.classes["@mozilla.org/widget/transferable;1"]
				.createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return false; // no transferable widget found

		trans.addDataFlavor("text/unicode");
		// *2 because it's unicode
		trans.setTransferData("text/unicode", str, textUnicode.length * 2);

		trans.addDataFlavor("text/html");
		// *2 because it's unicode
		trans.setTransferData("text/html", htmlstring, textHtml.length * 2);

		// copy the transferable widget!
		var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"]
				.getService(Components.interfaces.nsIClipboard);
		if (!clipboard)
			return false; // couldn't get the clipboard

		clipboard.setData(trans, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
		return true;

	}
};

var remoteit = {
	onLoad : function() {
		// initialization code
		this.initialized = true;
		this.strings = document.getElementById("remoteit-strings");
		remoteItUtils.DEBUG = (this.strings.getString("remoteItDebugMode") == "TRUE") ? true : false;
	},

	getPromptService : function() {
		return Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
				.getService(Components.interfaces.nsIPromptService);
	},

	onLinkMenuItemCommand : function(e) {
		var promptService = this.getPromptService();
		// promptService.alert(window,
		// this.strings.getString("helloMessageTitle"),
		// this.strings.getString("helloMessage"));

		var copyURL = this.deRemoteIt(gContextMenu.target.href);
		remoteItUtils.copyLinkToClipboard(copyURL, null);
		// promptService.alert(window, this.strings.getString("deRemoteItMessageTitle"), this.deRemoteIt(href));
	},

	onNonLinkMenuItemCommand : function(e) {
		var promptService = this.getPromptService();

		var copyURL = this.deRemoteIt(gBrowser.currentURI.spec);
		remoteItUtils.copyLinkToClipboard(copyURL, null);
		// promptService.alert(window, this.strings.getString("deRemoteItMessageTitle"), this.deRemoteIt(href));
	},

	deRemoteIt : function(url) {
		return remoteItUtils.url_utils.deRemote(url);
	},

	remoteIt : function(url) {
		return remoteItUtils.url_utils.convert(url);
	},

	handleException : function(exp) {
		alert(exp);
	}

};

window.addEventListener("load", function() {
	remoteit.onLoad();
}, false);
