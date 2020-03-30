const crypto = require('crypto')
const express = require('express');
const router = express.Router();
const tfnode = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd')
const logger = require('../components/logger');
const path = require('path');
const fs = require('fs');


const io = require('../server');
let ready = false
let busy = false

class ObjectTracker {
  constructor() {
    this.model = null
    this.ready = false
    this.send={}
    this.init()
  }

  init() {
    cocoSsd.load().then((model) => {
        this.model = model
        this.ready = true
        const self = this
        fs.readFile('people.jpeg', function (err, data) {
          if (err) throw err;
          const imageBuffer = data
          var base64 = Buffer.from(data).toString('base64');
          base64='data:image/png;base64,'+base64;
          self.send.image=base64
          const tfimage = tfnode.node.decodeImage(imageBuffer)
          console.log(tfimage)
          self.detect(tfimage)
        });
    })
  }

  detect(image) {
   return this.model.detect(image)
      .then(predictions => {
        busy = false
        this.send.prediction = predictions
      })
      .catch(console.log)
  }
}

const tracker = new ObjectTracker()



io.on('connect', (socket) => {
  console.log('Camera Connected')
  socket.on('image', (img) => {
    if(tracker.ready && !busy) {
      busy = true
      var base64 = Buffer.from(img).toString('base64');
      base64='data:image/png;base64,'+base64;
      console.log(base64,"img")
      tracker.send.image=base64
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

router.get('/img',logRoute,(request,response)=>{
    if(tracker.ready) {
    response.send(tracker.send)
    }
})

router.post('/webhook', logRoute, (request, response) => {
  console.log(request.body.condition)
})


module.exports = router
