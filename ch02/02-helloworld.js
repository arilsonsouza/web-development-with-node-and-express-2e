const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3000

function serveStaticFiles(res, path, contentType, responseCode = 200) {
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text-plain' })
      return res.end('500 - Internal Error')
    }
    res.writeHead(responseCode, { 'Content-Type': contentType })
    res.end(data)
  })
}

const server = http.createServer((req, res) => {
  // normalize url by removing querystring, optional
  // trailing slash, and making it lowercase
  const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase()

  switch (path) {
    case '':
      serveStaticFiles(res, '/public/home.html', 'text/html')
      break
    case '/about':
      serveStaticFiles(res, '/public/about.html', 'text/html')
      break    
    case '/img/logo.png':
      serveStaticFiles(res, '/public/img/logo.png', 'image/png')
      break
      default:
        serveStaticFiles(res, '/public/404.html', 'text/html', 404)
      break
  }  
})

server.listen(port, () => console.log(`Server started on port ${port}; press Ctrl-C to terminate...`))
