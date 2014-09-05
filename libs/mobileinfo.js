/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

// Use only the info about the first SIM for the time being
var mobileInfo = (function() {
  var networkID = "001 0001";
  var mcc = urlParams.mcc || "310"; // United States
  var mnc = urlParams.mnc || "001";

  var mobileConnections = window.navigator.mozMobileConnections;
  if (!mobileConnections && window.navigator.mozMobileConnection) {
    mobileConnections = [ window.navigator.mozMobileConnection ];
  }

  if (mobileConnections) {
    var networkInfo = mobileConnections[0].voice.network;
    mcc = networkInfo.mcc;
    mnc = networkInfo.mnc;
    networkID = mnc + " (" + networkInfo.shortName + ")";
  }

  return {
    networkID: networkID,
    mcc: mcc,
    mnc: mnc,
  };
})();
