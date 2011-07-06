// var myExt_urlBarListener = {
// QueryInterface : function(aIID) {
// if (aIID.equals(Components.interfaces.nsIWebProgressListener)
// || aIID.equals(Components.interfaces.nsISupportsWeakReference)
// || aIID.equals(Components.interfaces.nsISupports))
// return this;
// throw Components.results.NS_NOINTERFACE;
// },
//
// onLocationChange : function(aProgress, aRequest, aURI) {
// myExtension.processNewURL(aURI);
// },
//
// onStateChange : function(a, b, c, d) {
// },
// onProgressChange : function(a, b, c, d, e, f) {
// },
// onStatusChange : function(a, b, c, d) {
// },
// onSecurityChange : function(a, b, c) {
// }
// };
//
// var myExtension = {
// oldURL : null,
//
// init : function() {
// // Listen for webpage loads
// gBrowser.addProgressListener(myExt_urlBarListener,
// Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
// },
//
// uninit : function() {
// gBrowser.removeProgressListener(myExt_urlBarListener);
// },
//
// processNewURL : function(aURI) {
// if (aURI.spec == this.oldURL)
// return;
//
// // now we know the url is new...
// this.oldURL = aURI.spec;
// }
// };

const
STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
const
STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
const
STATE_IS_REQUEST = Components.interfaces.nsIWebProgressListener.STATE_IS_REQUEST;

var remoteitListener = {
	QueryInterface : function(aIID) {
		if (aIID.equals(Components.interfaces.nsIWebProgressListener)
				|| aIID.equals(Components.interfaces.nsISupportsWeakReference)
				|| aIID.equals(Components.interfaces.nsISupports))
			return this;
		throw Components.results.NS_NOINTERFACE;
	},

	onStateChange : function(aWebProgress, aRequest, aFlag, aStatus) {
		// If you use remoteitListener for more than one tab/window, use
		// aWebProgress.DOMWindow to obtain the tab/window which triggers the
		// state change
		if (aFlag & STATE_IS_REQUEST) {
			// alert(aRequest.name);
			// typeof aRequest != "undefined"
			try {
				var url = aRequest.name;
				remoteItUtils.debug("Handling new request : " + url);
				if (remoteItUtils.shouldWeHandleThisURL(url)) {
					remoteItUtils.debug("Going to interrupt current request");

					aRequest.suspend();
					aRequest.cancel(Components.results.NS_BINDING_ABORTED);
					openUILinkIn(remoteit.remoteIt(aRequest.name), "current");
				}
			} catch (exp) {
				remoteit.handleExceptions(exp);
			}
			// This fires when the load event is initiated
		}
		if (aFlag & STATE_STOP) {
			// This fires when the load finishes
		}
	},

	onLocationChange : function(aProgress, aRequest, aURI) {
		// This fires when the location bar changes; that is load event is
		// confirmed
		// or when the user switches tabs. If you use remoteitListener for more
		// than
		// one tab/window,
		// use aProgress.DOMWindow to obtain the tab/window which triggered the
		// change.
	},

	// For definitions of the remaining functions see related documentation
	onProgressChange : function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {
	},
	onStatusChange : function(aWebProgress, aRequest, aStatus, aMessage) {
	},
	onSecurityChange : function(aWebProgress, aRequest, aState) {
	}
}
// Register the listener
gBrowser.addProgressListener(remoteitListener);

// window.addEventListener("load", function() {
// myExtension.init()
// }, false);
// window.addEventListener("unload", function() {
// myExtension.uninit()
// }, false);
