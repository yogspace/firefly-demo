# firefly-demo: HOW TO START

1. power the raspberry pi (the pi will boot automatically)

2. power the led matrix

3. wait for the pi to boot.

4. open a terminal and go to the repo folder "cd Desktop/server"

5. create 2 new Tabs in the terminal

6. in the first terminal type "node main.js" to start the server
   in the second terminal type "sudo python neopixels.py" to start the led process
   in the third terminal type the following command to start the chrome kiosk window (all commands without the doublequotes btw.):
   "/usr/bin/chromium-browser --disable-session-crashed-bubble --disable-infobars --kiosk --no-first-run --incognito --disable-pinch --overcroll-history-navigation=0 'https://localhost:3001/interface'"

   you can leave this kiosk by clicking strg and f4.

7. connect your phone to the website showing in the first terminals console (https:.../).

# to-do:

# links:

https://docs.circuitpython.org/projects/neopixel/en/latest/api.html#neopixel.NeoPixel
https://learn.adafruit.com/easy-neopixel-graphics-with-the-circuitpython-pixel-framebuf-library/image-drawing-with-python
https://kongmunist.medium.com/accessing-the-iphone-accelerometer-with-javascript-in-ios-14-and-13-e146d18bb175
