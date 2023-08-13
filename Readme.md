# firefly-demo

1. start the server: "node server.js"
2. start neopixels: "sudo python neopixels.py"
3. start chromium in kiosk:
   /usr/bin/chromium-browser --disable-session-crashed-bubble --disable-infobars --kiosk --no-first-run --incognito --disable-pinch --overcroll-history-navigation=0 'https://localhost:3001/interface'
   
4. connect your phone to the website in the console
5. den Kiosk Modus kann man mit strg und f4 verlassen.

# to-do:

- styling
- neuer Lichtpunkt fliegt rein (positives Ende)
- Smartphone wird weggelegt und Punkte beruhigen sich

# links:

https://docs.circuitpython.org/projects/neopixel/en/latest/api.html#neopixel.NeoPixel
https://learn.adafruit.com/easy-neopixel-graphics-with-the-circuitpython-pixel-framebuf-library/image-drawing-with-python
https://kongmunist.medium.com/accessing-the-iphone-accelerometer-with-javascript-in-ios-14-and-13-e146d18bb175
