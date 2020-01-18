const express = require('express')
const expressHandlebars = require('express-handlebars')
const app = express()

app.disable('x-powered-by')
// the followind is needed to use views
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

app.get('/no-layout', (req, res) => {
  res.render('no-layout', { layout: null})
})

app.get('*', (req, res) => res.send('Check out the "<a href="/no-layout">no layout</a>" page!'))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/no-layout\n`))