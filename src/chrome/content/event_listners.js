var myExt_urlBarListener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onLocationChange: function(aProgress, aRequest, aURI)
  {
    myExtension.processNewURL(aURI);
  },

  onStateChange: function(a, b, c, d) {},
  onProgressChange: function(a, b, c, d, e, f) {},
  onStatusChange: function(a, b, c, d) {},
  onSecurityChange: function(a, b, c) {}
};

var myExtension = {
  oldURL: null,
  
  init: function() {
    // Listen for webpage loads
    gBrowser.addProgressListener(myExt_urlBarListener,
        Components.interfaces.nsIWebProgress.NOTIFY_LOCATION);
  },
  
  uninit: function() {
    gBrowser.removeProgressListener(myExt_urlBarListener);
  },

  processNewURL: function(aURI) {
    if (aURI.spec == this.oldURL)
      return;
    
    // now we know the url is new...
    alert(aURI.spec);
    this.oldURL = aURI.spec;
  }
};

const STATE_START = Components.interfaces.nsIWebProgressListener.STATE_START;
const STATE_STOP = Components.interfaces.nsIWebProgressListener.STATE_STOP;
const STATE_IS_REQUEST = Components.interfaces.nsIWebProgressListener.STATE_IS_REQUEST;
var myListener =
{
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onStateChange: function(aWebProgress, aRequest, aFlag, aStatus)
  {
   // If you use myListener for more than one tab/window, use
   // aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
   if(aFlag & STATE_IS_REQUEST)
   {
	   alert(aWebProgress.DOMWindow.getSelection().value);
     // This fires when the load event is initiated
   }
   if(aFlag & STATE_STOP)
   {
     // This fires when the load finishes
   }
  },

  onLocationChange: function(aProgress, aRequest, aURI)
  {
   // This fires when the location bar changes; that is load event is confirmed
   // or when the user switches tabs. If you use myListener for more than one tab/window,
   // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
  },

  // For definitions of the remaining functions see related documentation
  onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) { },
  onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) { },
  onSecurityChange: function(aWebProgress, aRequest, aState) { }
}
gBrowser.addProgressListener(myListener);

window.addEventListener("load", function() {myExtension.init()}, false);
window.addEventListener("unload", function() {myExtension.uninit()}, false);