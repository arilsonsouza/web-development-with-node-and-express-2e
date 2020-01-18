const expess = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather')

const app = expess()
const port = process.env.PORT || 3000

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section: function(name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
}))
app.set('view engine', 'handlebars')
app.set('view cache', true)

app.use(expess.static(__dirname + '/public'))
app.use(weatherMiddleware)

app.get('/', handlers.home)

// app.get('/about', handlers.about)
app.get('/section-test', handlers.sectionTest)


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