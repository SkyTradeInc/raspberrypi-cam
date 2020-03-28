const dotenv = require('dotenv').config()
const fs = require('fs')
const jwt = require('jsonwebtoken');

const createToken = () => {
  return jwt.sign(
    {
      loggedIn: true,
    },
      process.env.JWT_SECRET || '3H68CCXXJf+5U%ps=TQg*4JWk826FqXjHBjY',
    {
      expiresIn: '1w'
    }
  )
};

const verifyToken = (request, response, next) => {
  const { token} = request.headers;
  if(!token) return errorResponse(response, 'Token missing', null, 401);
  jwt.verify(token, process.env.JWT_SECRET || '3H68CCXXJf+5U%ps=TQg*4JWk826FqXjHBjY', (error, decoded) => {
    if(error) return errorResponse(response, 'Token invalid or expired', null, 401);
    request.token = token;
    next();
  })
};

const successResponse = (response, message = null, data = null) => {
  response.status(200).send({
    success: true,
    timestamp: Date.now(),
    message,
    data
  })
}

const errorResponse = (response, message, data = null, status = 403) => {
  response.status(status).send({
    success: false,
    timestamp: Date.now(),
    message
  });
};

const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (error, data) {
      if (error) return reject(error);
      return resolve(data);
    });
  });
};

const writeFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', (error) => {
      if(error) return reject(error);
      return resolve(true);
    })
  })
}

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(()=>{
      resolve(true)
    }, ms)
  })
}

const average = (array) => array.reduce((a, b) => a + b) / array.length;

module.exports = {
  verifyToken,
  createToken,
  successResponse,
  errorResponse,
  readFile,
  writeFile,
  average,
  sleep,
}
