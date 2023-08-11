import board
import neopixel
import socketio
import json


#num_pixels = 768
num_pixels = 512
pixels = neopixel.NeoPixel(board.D18, num_pixels, auto_write = False)

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def setColorPixel(data):
    data = json.loads(data)
    print('message received with ', data)
    print(data["id"]);
    pixels[data['id']] = (data['color']['r'], data['color']['g'], data['color']['b'])
    pixels.show()
    #sio.emit('my response', {'response': 'my response'})

@sio.event
def setColorCanvas(data):
    data = json.loads(data)
    print('message received with ', data) 
    pixels.fill((data['r'], data['g'], data['b']))
    pixels.show()
        #sio.emit('my response', {'response': 'my response'})


@sio.event
def setColorCanvasArray(data):
    print(data)
    data = json.loads(data)
    print('message received with ', data)
    for pixel in data:
        #print(pixel["id"]);
        pixels[pixel['id']] = (pixel['color']['r'], pixel['color']['g'], pixel['color']['b'])
    pixels.show()

@sio.event
def clear(data):
    pixels.fill((0, 0, 0))
    pixels.show()
    #sio.emit('my response', {'response': 'my response'})


@sio.event
def disconnect():
    print('disconnected from server')

sio.connect('http://localhost:3000')
#sio.wait()

#for x in range(0, num_pixels):
#    pixels[x] = (20, 20, 20)
#    pixels[x] = (0, 0, 0)

