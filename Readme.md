# firefly-demo: HOW TO START

1. power the raspberry pi (the pi will boot automatically)

2. power the led matrix

3. wait for the pi to boot.

4. open a terminal and type "sudo ./firefly.sh"
   (the server and everything will start automatically)

5. start chromium in kiosk by type the following (without doubble quotes) in a new terminal:
   "/usr/bin/chromium-browser --disable-session-crashed-bubble --disable-infobars --kiosk --no-first-run --incognito --disable-pinch --overcroll-history-navigation=0 --force-device-scale-factor=2.0 'https://localhost:3001/interface'"

   you can leave this kiosk by clicking strg and f4.

6. connect your phone to the website showing in the console (https:.../)

# to-do:

# links:

https://docs.circuitpython.org/projects/neopixel/en/latest/api.html#neopixel.NeoPixel
https://learn.adafruit.com/easy-neopixel-graphics-with-the-circuitpython-pixel-framebuf-library/image-drawing-with-python
https://kongmunist.medium.com/accessing-the-iphone-accelerometer-with-javascript-in-ios-14-and-13-e146d18bb175
