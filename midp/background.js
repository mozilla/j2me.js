/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var display = document.getElementById("display");

// The splash and download screens generate many style recalculations while
// attached to the DOM, regardless of their display styles, because of their
// animations.  So instead of setting their display styles, we add/remove them
// to/from the DOM.

var splashScreen = document.getElementById('splash-screen');
display.removeChild(splashScreen);
splashScreen.style.display = 'block';
function showSplashScreen() {
  display.appendChild(splashScreen);
}
function hideSplashScreen() {
  if (splashScreen.parentNode) {
    splashScreen.parentNode.removeChild(splashScreen);
  }
}

var downloadDialog = document.getElementById('download-screen');
display.removeChild(downloadDialog);
downloadDialog.style.display = 'block';
function showDownloadScreen() {
  display.appendChild(downloadDialog);
}
function hideDownloadScreen() {
  if (downloadDialog.parentNode) {
    downloadDialog.parentNode.removeChild(downloadDialog);
  }
}

function showBackgroundScreen() {
  document.getElementById("background-screen").style.display = "block";
}
function hideBackgroundScreen() {
  document.getElementById("background-screen").style.display = "none";
}

// The exit screen is hidden by default, and we only ever show it,
// so we don't need a hideExitScreen function.
function showExitScreen() {
  document.getElementById("exit-screen").style.display = "block";
}

var bgMidletClass = null;
var bgMidletNumber = 0;
function backgroundCheck() {
  var str = MIDP.manifest["Nokia-MIDlet-bg-server"];
  if (!str) {
    showSplashScreen();
    hideBackgroundScreen();
    return;
  }

  bgMidletNumber = parseInt(str);
  bgMidletClass = MIDP.manifest["MIDlet-" + str].split(",")[2];

  DumbPipe.close(DumbPipe.open("backgroundCheck", {}));
}

Native["com/sun/midp/midlet/MIDletStateHandler.hasBGMIDlet.()Z"] = function() {
    return (bgMidletNumber ? 1 : 0);
}

Native["com/sun/midp/midlet/MIDletStateHandler.getBGMIDletAppId.()I"] = function() {
    return bgMidletNumber;
}

Native["com/sun/midp/midlet/MIDletStateHandler.getBGMIDletClassName.()Ljava/lang/String;"] = function() {
    return J2ME.newString(bgMidletClass);
}

MIDP.additionalProperties = {};

Native["com/nokia/mid/s40/bg/BGUtils.addSystemProperties.(Ljava/lang/String;)V"] = function(args) {
   console.log("addSystemProperties: " + args);
   J2ME.fromJavaString(args).split(";").splice(1).forEach(function(arg) {
     var elems = arg.split("=");
     MIDP.additionalProperties[elems[0]] = elems[1];
   });
};

document.addEventListener("visibilitychange", function() {
  visibilityChange(document.hidden);
});

function visibilityChange(hidden) {
  console.log("visibility change: " + (hidden ? "hidden" : "visible"));
  if (hidden) {
    MIDP.sendPauseAllEvent();
  } else {
    MIDP.sendActivateAllEvent();
  }
}

// If the document is hidden, then we've been started by an alarm and are in
// the background, so we show the background screen.
if (document.hidden) {
  showBackgroundScreen();
  console.log("Launched in background");
  MIDP.sendPauseAllEvent();
}
