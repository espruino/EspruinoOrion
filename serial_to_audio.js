/*
 * This file is part of Espruino, a JavaScript interpreter for Microcontrollers
 *
 * Copyright (C) 2013 Gordon Williams <gw@pur3.co.uk>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

// some devices output an inverted waveform, some don't
var audio_serial_invert = false;

/** Send the given string of data out over audio. 

    This adds a 1 second preamble/postable to give the 
    capacitor time to charge (so we get a full 2V swing 
    on the output.
 
   If you send characters outside the range 0-255,
   they will be interpreted as a break (so not transmitted).
*/
function audio_serial_write(data, callback) {
  var sampleRate = 44100;
  var header = sampleRate; // 1 sec to charge/discharge the cap
  var baud = 9600;
  var samplesPerByte = parseInt(sampleRate*11/baud);
  var bufferSize = samplesPerByte*data.length/*samples*/ + header*2;
  var buffer = context.createBuffer(1, bufferSize, sampleRate);
  var b = buffer.getChannelData(0);

  for (var i=0;i<header;i++) b[i]=i / header;

  var offset = header;

  data.split("").forEach(function(c) {
    var byte = c.charCodeAt(0);
    if (byte>=0 && byte<=255) {    
      for (var i=0;i<samplesPerByte;i++) {
        var bit = Math.round(i*baud/sampleRate);
        var value = 1;
        if (bit==0) value=0; // start bit
        else if (bit==9 || bit==10) value=1; // stop bits
        else value = (byte&(1<<(bit-1))) ? 1 : 0; // data
        b[offset++] = value*2-1; 
      }
    } else {
      // just insert a pause
      for (var i=0;i<samplesPerByte;i++) 
        b[offset++] = 1; 
    }
  });

  for (var i=0;i<header;i++) b[offset+i]=1-(i / header);

  if (audio_serial_invert)
    for (var i=0;i<bufferSize;i++) b[i] = 1-b[i];

  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();

  if (callback)
    window.setTimeout(callback, 1000*bufferSize/sampleRate);
}
