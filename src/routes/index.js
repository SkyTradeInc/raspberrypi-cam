const crypto = require('crypto')
const express = require('express');
const router = express.Router();
// const tf = require('@tensorflow/tfjs')
const tfnode = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd')
const logger = require('../components/logger');
const path = require('path');
const fs = require('fs');

// (function loadImage() {
//
// })();

const io = require('../server');
let ready = false
let busy = false

class ObjectTracker {
  constructor() {
    this.model = null
    this.ready = false
    this.init()
  }

  init() {
    cocoSsd.load().then((model) => {
        this.model = model
        this.ready = true
        const self = this
        fs.readFile('/Users/E/raspberrypi-cam/people.jpeg', function (err, data) {
          if (err) throw err;
          const imageBuffer = data
          const tfimage = tfnode.node.decodeImage(imageBuffer)
          console.log(tfimage)
          self.detect(tfimage)
        });
    })
  }

  detect(image) {
    this.model.detect(image)
      .then(predictions => {
        busy = false
        console.log(predictions.length)
        for(let i = 0; i < predictions.length; i++) {
          console.log(predictions[i].class)
        }
      })
      .catch(console.log)
  }
}

const tracker = new ObjectTracker()

let writeImage = false

io.on('connect', (socket) => {
  console.log('Camera Connected')
  socket.on('image', (img) => {
    if(tracker.ready && !busy) {
      busy = true
      if(!writeImage) {
        writeImage = true
        fs.writeFile('test.jpeg', img, function(err){
                    if (err) throw err
                    console.log('File saved.')
                })
      }

      const tfimage = tfnode.node.decodeImage(img)

      tracker.detect(tfimage)
    }
  })
})

const {
  logRoute,
} = require('../middleware')


router.get('/', logRoute, (request, response) => {
  response.send('API Status: ONLINE')
})

router.get('/ping', logRoute, (request, response) => {
  response.send('Pong')
})

router.post('/webhook', logRoute, (request, response) => {
  console.log(request.body.condition)
})


module.exports = router
