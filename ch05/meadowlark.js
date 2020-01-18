const expess = require('express')
const expressHandlebars = require('express-handlebars')
const handlers = require('./lib/handlers')

const app = expess()
const port = process.env.PORT || 3000

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.get('/', handlers.home)

app.get('/about', handlers.about)

app.use(expess.static(__dirname + '/public'))

// custom 404 page
app.use(handlers.notFound)

// custom 500 page
app.use(handlers.serverError)

if (require.main === module){
  app.listen(port, () =>
    console.log(`Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate` )
  )
} else {
  module.exports = app
}