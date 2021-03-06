const expess = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const multiparty = require('multiparty')
const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)
const csrf = require('csurf')

const { credentials } = require('./config')
const handlers = require('./lib/handlers')
const weatherMiddleware = require('./lib/middleware/weather')
const createAuth = require('./lib/auth')

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cookieParser(credentials.cookieSecret))
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
  // store: new RedisStore({
  //   url: credentials.redis.url
  // })
}))

// security configuration
const auth = createAuth(app, {
	// baseUrl is optional; it will default to localhost if you omit it;
	// it can be helpful to set this if you're not working on
	// your local machine.  For example, if you were using a staging server,
	// you might set the BASE_URL environment variable to
	// https://staging.meadowlark.com
    baseUrl: process.env.BASE_URL,
    providers: credentials.authProviders,
    successRedirect: '/account',
    failureRedirect: '/unauthorized',
})
// auth.init() links in Passport middleware:
auth.init()
// now we can specify our auth routes:
auth.registerRoutes()

app.use(csrf({ cookie: true }))
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken
  next()
})

app.get('/', handlers.home)

app.get('/vacations', handlers.listVacations)
app.get('/notify-me-when-in-season', handlers.notifyWhenInSeasonForm)
app.post('/notify-me-when-in-season', handlers.notifyWhenInSeasonProcess)
app.get('/set-currency/:currency', handlers.setCurrency)

app.get('/newsletter-signup', handlers.newsletterSignup)
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess)
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou)

app.get('/newsletter', handlers.newsletter)

app.get('/about', handlers.about)
app.get('/section-test', handlers.sectionTest)

app.get('/contest/vacation-photo-thank-you', handlers.vacationPhotoContestThankYou)
app.get('/contest/vacation-photo', handlers.vacationPhotoContest)
app.get('/contest/vacation-photo-ajax', handlers.vacationPhotoContestAjax)

app.post('/contest/vacation-photo/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err) return handlers.api.vacationPhotoContestError(req, res, err.message)
    handlers.vacationPhotoContestProcess(req, res, fields, files)
  })
})

//api
const cors = require('cors')
app.use('/api', cors())
const vhost = require('vhost')
app.get('/', vhost('api.*', handlers.getVacationsApi))
app.get('/api/vacations', handlers.getVacationsApi)
app.get('/api/vacation/:sku', handlers.getVacationBySkuApi)
app.post('/api/vacation/:sku/notify-when-in-season', handlers.addVacationInSeasonListenerApi)
app.delete('/api/vacation/:sku', handlers.requestDeleteVacationApi)

app.post('/api/newsletter-signup', handlers.api.newsletterSignup)
app.post('/api/vacation-photo-contest/:year/:month', (req, res) => {
  const form = new multiparty.Form()
  form.parse(req, (err, fields, files) => {
    if (err) return handlers.api.vacationPhotoContestError(req, res, err.message)
    handlers.api.vacationPhotoContest(req, res, fields, files)
  })
})



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