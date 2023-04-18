const server = require('./server')
const envConfig = require('dotenv').config()

if (envConfig.error) throw envConfig.error

if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.LOCAL_PORT
  server.listen(PORT, function () {
    console.log('Listening on port', PORT)
  })
} else {
  console.log('You dont have a url configured.')
}
