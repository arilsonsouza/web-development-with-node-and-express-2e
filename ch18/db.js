const mongoose = require('mongoose')
const { credentials } = require('./config')

if (!credentials.mongo.connectionString) {
  console.log('MongoDB connection string missing')
  process.exit(1)
}

mongoose.connect(credentials.mongo.connectionString, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log('MongoDB connection established'))

const Vacation = require('./models/vacation')

Vacation.find((err, vacations) => {
  if(err) return console.error(err)
  if(vacations.length) return

  new Vacation({
    name: 'Hood River Day Trip',
    slug: 'hood-river-day-trip',
    category: 'Day Trip',
    sku: 'HR199',
    description: 'Spend a day sailing on the Columbia and ' + 
      'enjoying craft beers in Hood River!',
    price: 99.95,
    tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
    inSeason: true,
    maximumGuests: 16,
    available: true,
    packagesSold: 0,
  }).save()

  new Vacation({
    name: 'Oregon Coast Getaway',
    slug: 'oregon-coast-getaway',
    category: 'Weekend Getaway',
    sku: 'OC39',
    description: 'Enjoy the ocean air and quaint coastal towns!',
    price: 269.95,
    tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
    inSeason: false,
    maximumGuests: 8,
    available: true,
    packagesSold: 0,
  }).save()

  new Vacation({
      name: 'Rock Climbing in Bend',
      slug: 'rock-climbing-in-bend',
      category: 'Adventure',
      sku: 'B99',
      description: 'Experience the thrill of climbing in the high desert.',
      price: 289.95,
      tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
      inSeason: true,
      requiresWaiver: true,
      maximumGuests: 4,
      available: false,
      packagesSold: 0,
      notes: 'The tour guide is currently recovering from a skiing accident.',
  }).save()
})

const VacationInSeasonListener = require('./models/vacationInSeasonListener')
const User = require('./models/user')

module.exports = {
  getVacations: async (options = {}) => Vacation.find(options),
  getVacationBySku: async sku => Vacation.findOne({ sku }),
  addVacationInSeasonListener: async (email, sku) => {
    await VacationInSeasonListener.updateOne(
      { email },
      { $push: { skus: sku } },
      { upsert: true }
    )
  },

  getUserById: async id => User.findById(id),
  getUserByAuthId: authId => User.findOne({ authId }),
  addUser: async data => new User(data).save(),
  close: () => mongoose.connection.close(),
}