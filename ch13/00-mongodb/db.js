const mongoose = require('mongoose')
const { credentials } = require('./config')

if (!credentials.connectionString) {
  console.log('MongoDB connection string missing')
  process.exit(1)
}

mongoose.connect(credentials.connectionString, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(1)
})
db.once('open', () => console.log('MongoDB connection established'))

const Vacation = require('./models/vacation')

module.exports = {
  getVacations: async (options = {}) => {
      const vacations = [
      {
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and '
        + 'enjoying craft beers in Hood River!',
        location: {
        // we'll use this for geocoding later in the book
        search: 'Hood River, Oregon, USA',
        },
        price: 99.95,
        tags: ['day trip', 'hood river', 'sailing',
        'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
      }
    ]
    if (options.available !== undefined) 
      return vacations.filter(({ available }) => available === options.available)

      return vacations
  },

  addVacationInSeasonListener: async (email, sku) => {

  }
}