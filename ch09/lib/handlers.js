const fortune = require('./fortune')
const VALID_EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@' +
'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
'(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$')

class NewsletterSignup {
  constructor({ name, email }) {
    this.name = name
    this.email = email
  }

  async save () {

  }
}

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => 
  res.render('about', { fortune: fortune.getFortune() })

exports.newsletterSignup = (req, res) =>  {
  res.render('newsletter-signup', { csrf: 'CSRF token goes here'})
}

exports.newsletterSignupProcess = (req, res) => {
  const { name = '', email = '' } = req.body

  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid.'
    }
    return res.redirect(303, '/newsletter-signup')
  }

  new NewsletterSignup({ name, email }).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for newsletter.'
      }
      return res.redirect(303, '/newsletter-archive')
    })    
    // eslint-disable-next-line no-unused-vars
    .catch(err => {
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.'
      }
      return res.redirect(303, '/newsletter-archive')
    })
}

exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' })
}

exports.newsletterArchive = (req, res) => res.render('newsletter-archive')

exports.api = {
  newsletterSignup: (req, res) => {
    const { _csrf, name, email } = req.body
    console.log(`CSRF (from hidden form field): ${_csrf}`)
    console.log(`Name (from visible form field): ${name}`)
    console.log(`Email (from visible form field): ${email}`)
    res.send({ result: 'success' })
  },

  vacationPhotoContest: (req, res, fields, files) => {
    console.log('field data: ', fields)
    console.log('files: ', files)
    res.send({ result: 'success' })
  },

  vacationPhotoContestError: (req, res, message) => {
    res.send({ result: 'error', error: message })
  }
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you')
}

exports.vacationPhotoContest = (req, res) => {
  const now = new Date()
  res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() })
}

exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date()
  res.render('contest/vacation-photo-ajax', { year: now.getFullYear(), month: now.getMonth() })
}

exports.vacationPhotoContestThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you')
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('field data: ', fields)
  console.log('files: ', files)
  res.redirect(303, '/contest/vacation-photo-thank-you')
}

exports.sectionTest = (req, res) => res.render('section-test')

exports.notFound = (req, res) => res.render('404')

// express recognizes the error handler by way of its four
// arguments, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => {
  console.log(`Internal server error: ${err.message}`)
  res.render('500')
}
/* eslint-enable no-unused-vars */