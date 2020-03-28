const logRoute = (request, response, next) => {

  let payload = {
    ipAddress: request.ip,
    protocol: request.protocol,
    method: request.method,
    url: request.originalUrl,
    userAgent: request.headers["user-agent"] || null,
  }
  console.log(`${payload.method} | ${payload.url} | ${payload.ipAddress} | ${payload.userAgent}`)
  next()
}

module.exports = {
  logRoute
}
