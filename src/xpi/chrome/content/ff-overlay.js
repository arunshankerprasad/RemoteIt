remoteit.onFirefoxLoad=function(a){document.getElementById("contentAreaContextMenu").addEventListener("popupshowing",function(b){remoteit.showFirefoxContextMenu(b)},false)};remoteit.showFirefoxContextMenu=function(a){document.getElementById("context-remoteit").hidden=!(gContextMenu.onImage||gContextMenu.onLink)};window.addEventListener("load",function(){remoteit.onFirefoxLoad()},false);