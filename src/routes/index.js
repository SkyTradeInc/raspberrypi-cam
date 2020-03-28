const crypto = require('crypto')
const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs')
const cocoSsd = require('@tensorflow-models/coco-ssd')
const logger = require('../components/logger');

const io = require('../server');
let ready = false

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
    })
  }

  detect(image) {
    this.model.detect(image)
      .then(predictions => {
        console.log(predictions)
      })
      .catch(console.log)
  }
}

const tracker = new ObjectTracker()

io.on('connect', (socket) => {
  console.log('Camera Connected')
  socket.on('image', async (img) => {
    if(tracker.ready) {
      tracker.detect(img)

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
