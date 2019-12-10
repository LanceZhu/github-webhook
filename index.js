const http = require('http')
const createHandler = require('github-webhook-handler')
const exec = require('child_process').exec

// config
const config = require('./config')

const port = config.port || 9091
const handler = createHandler({ path: config.path || '/', secret: config.secret || '' })

http.createServer((req, res) => {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(port)

handler.on('error', err => {
  console.error('Error:', err.message)
})

handler.on('push', event => {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
  if(config.script !== undefined){
    exec(config.script, (err, stdout, stderr) => {
      if(err){
        console.log(err, stderr)
      }else{
        console.log(stdout)
      }
    })
  }
})
