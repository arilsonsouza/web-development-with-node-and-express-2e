const expess = require('express')
const expressHandlebars = require('express-handlebars')

const app = expess()
const port = process.env.PORT || 3000

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => res.render('home'))

app.get('/about', (req, res) => res.render('about'))

// custom 404 page
app.use((req, res) => {
  res.status(404)
  res.send('404')
})

// custom 500 page
app.use((err, req, res, next) => {
  console.error(err.message)  
  res.status(500)
  res.send('500')
})

app.listen(port, () =>
  console.log(`Express started on http://localhost:${port}; ` +
  `press Ctrl-C to terminate` )
)