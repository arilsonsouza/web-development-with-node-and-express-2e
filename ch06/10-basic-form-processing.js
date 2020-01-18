const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express()

app.disable('x-powered-by')
// the followind is needed to use views
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/thank-you', (req, res) => res.render('10-thank-you'))

app.get('*', (req, res) => res.render('10-home'))

app.post('/process-contact', (req, res) => {
  const { name, email } = req.body
  console.log(`received contact from ${name} <${email}>`)
  res.redirect(303, '/thank-you')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}\n`))