const fortune = require('./fortune')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => 
  res.render('about', { fortune: fortune.getFortune() })

exports.newsletterSignup = (req, res) =>  {
  res.render('newsletter-signup', { csrf: 'CSRF token goes here'})
}

exports.newsletterSignupProcess = (req, res) => {
  const { form } = req.query
  const { _csrf, name, email } = req.body
  console.log(`Form (from querystring): ${form}`)
  console.log(`CSRF (from hidden form field): ${_csrf}`)
  console.log(`Name (from visible form field): ${name}`)
  console.log(`Email (from visible form field): ${email}`)
  res.redirect(303, '/newsletter-signup/thank-you')
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you')
}

exports.sectionTest = (req, res) => res.render('section-test')

exports.notFound = (req, res) => res.render('404')

// express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500')
/* eslint-enable no-unused-vars */