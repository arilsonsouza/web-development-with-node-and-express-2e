const fortune = require('./fortune')
const db = require('../db')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => 
  res.render('about', { fortune: fortune.getFortune() })

exports.newsletterSignup = (req, res) =>  {
  res.render('newsletter-signup', { csrf: 'CSRF token goes here'})
}

exports.setCurrency = (req, res) => {
  req.session.currency = req.params.currency
  return res.redirect(303, '/vacations')
}

function convertFromUSD(value, currency) {
  switch (currency) {
    case 'USD': return value * 1
    case 'GBP': return value * 0.79
    case 'BTC': return value * 0.000078
    default: return NaN
  }
}

exports.listVacations = async (req, res) => {
  const vacations = await db.getVacations({ available: true })
  const currency = req.session.currency || 'USD'
  const context = {
    currency,
    vacations: vacations.map(vacation => ({
      sku: vacation.sku,
      name: vacation.name,
      description: vacation.description,
      price: '$' + vacation.price.toFixed(2),
      inSeason: vacation.inSeason
    }))
  }
  switch (currency) {
    case 'USD': context.currencyUSD = 'selected'; break
    case 'GBP': context.currencyUSD = 'selected'; break
    case 'BTC': context.currencyUSD = 'selected'; break
  }
  res.render('vacations', context)
}

exports.notifyWhenInSeasonForm = (req, res) => res.render('notify-me-when-in-season', { sku: req.query.sku })
exports.notifyWhenInSeasonProcess = async (req, res) => {
  const { email, sku } = req.body
  await db.addVacationInSeasonListener(email, sku)
  return res.redirect(303, '/vacations')
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

exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' })
}

exports.api = {
  newsletterSignup: (req, res) => {
    const { _csrf, name, email } = req.body
    console.log(`CSRF (from hidden form field): ${_csrf}`)
    console.log(`Name (from visible form field): ${name}`)
    console.log(`Email (from visible form field): ${email}`)
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


const pathUtils = require('path')
const fs = require('fs')

// create directory to store vacation photos (if it doesn't already exist)
const dataDir = pathUtils.resolve(__dirname, '..', 'data')
const vacationPhotoDir = pathUtils.join(dataDir, 'vacation-photos')
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)
if(!fs.existsSync(vacationPhotoDir)) fs.mkdirSync(vacationPhotoDir)

function saveContestEntry (contestName, email, year, month, photoPath) {

}
// we'll want these promise-based versions of fs functions later
const { promisify } = require('util')
const mkdir = promisify(fs.mkdir)
const rename = promisify(fs.rename)
exports.api.vacationPhotoContest = async (req, res, fields, files) => {
  const photo = files[0]
  const dir = vacationPhotoDir + '/' + Date.now()
  const path = dir + '/' + photo.originalFilename
  await mkdir(dir)
  await rename(photo.path, path)
  saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, path)
  res.send({ result: 'success' })
}

exports.getVacationsApi = async (req, res) => {
  const vacations = await db.getVacations({ available: true })
  res.json(vacations)
}

exports.getVacationBySkuApi = async (req, res) => {
  const vacation = await db.getVacationsBySku(req.params.sku)
  res.json(vacation)
}

exports.addVacationInSeasonListenerApi = async (req, res) => {
  await db.addVacationInSeasonListener(req.params.sku,
  req.body.email)
  res.json({ message: 'success' })
}

exports.requestDeleteVacationApi = async (req, res) => {
  const { email, notes } = req.body
  res.status(500).json({ message: 'not yet implemented' })
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