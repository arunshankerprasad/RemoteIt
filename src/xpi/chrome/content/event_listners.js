const STATE_START=Components.interfaces.nsIWebProgressListener.STATE_START;const STATE_STOP=Components.interfaces.nsIWebProgressListener.STATE_STOP;const STATE_IS_REQUEST=Components.interfaces.nsIWebProgressListener.STATE_IS_REQUEST;var remoteitListener={QueryInterface:function(a){if(a.equals(Components.interfaces.nsIWebProgressListener)||a.equals(Components.interfaces.nsISupportsWeakReference)||a.equals(Components.interfaces.nsISupports)){return this;}throw Components.results.NS_NOINTERFACE;},onStateChange:function(b,a,d,f){if(d&STATE_IS_REQUEST){try{if(remoteit.shouldWeHandleThisURL(a.name)){a.suspend();a.cancel(Components.results.NS_BINDING_ABORTED);openUILinkIn(remoteit.remoteIt(a.name),"current");}}catch(c){alert(c);}}if(d&STATE_STOP){}},onLocationChange:function(b,a,c){},onProgressChange:function(c,b,a,e,f,d){},onStatusChange:function(b,a,d,c){},onSecurityChange:function(b,a,c){}};gBrowser.addProgressListener(remoteitListener);