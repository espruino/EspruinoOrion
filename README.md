EclipseOrion
===========


Espruino plugin for Eclipse Orion.

Simply:

* Host this on an HTTPS capable webserver
* Add plugin.html to Eclipse Orion
* Run index.html in a new window
* Connect Espruino to your AUDIO JACKS (wiring below)
* In Orion, open a file, go to 'Tools', and click 'Send to Espruino'

How it works
----------

Data is sent and received at 9600 baud using your headphone and microphone jacks - no local software needed!

When you click 'Send to Espruino' in Orion, a cookie is set with the code in.

The Terminal (index.html) reads this code and converts it to sound waves which it sends to Espruino.


Connections
----------

* Connect Espruino GND to the sheath on both headphone and microphone jacks
* Connect Espruino A9 (TX) to a 10k resistor, and connect that to the microphone Left+Right
* Connect a 10k resistor to the microphone sheath and connect that to microphone Left+Right too
* Connect Espruino A10 (RX) to the Left channel of the headphone jack
* Connect a 40k resistor between the headphone jack left channel and the headphone jack sheath

This creates: 
* A potential divider to convert the 3.3v Espruino TX signal to a 1.6v signal for the microphone
* A bias to 1.6v for Espruino's RX (by default Espruino turns on an internal 40k pullup resistor on the Usart to stop noise getting in)
