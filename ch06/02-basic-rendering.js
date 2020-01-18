const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

// the followind is needed to use views
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.get('/about', (req, res) => res.render('about'))

app.get('*', (req, res) => res.send('Check out our "<a href="/about">About</a>" page!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/about\n`))