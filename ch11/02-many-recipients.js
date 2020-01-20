const nodemailer = require('nodemailer')

const { credentials } = require('./config')

const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password
  }
})

async function main () {
  const largeRecipientList = new Array(2000).fill().map((_, idx) => `customer${idx}@nowhere.com`)
  // largeRecipientList is an array of email addresses
  const recipientLimit = 100
  const batches = largeRecipientList.reduce((batches, r) => {
    const lastBatch = batches[batches.length - 1]
    if(lastBatch.length < recipientLimit)
      lastBatch.push(r)
    else
      batches.push([r])
    return batches
  }, [[]])
  try {
    const results = await Promise.all(batches.map(batch =>
      mailTransport.sendMail({
        from: '"Meadowlark Travel", <info@meadowlarktravel.com>',
        to: batch.join(', '),
        subject: 'Special price on Hood River travel package!',
        text: 'Book your trip to scenic Hood River now!',
      })
    ))
    console.log(results)
  } catch(err) {
    console.log('at least one email batch failed: ' + err.message)
  }
}

main()