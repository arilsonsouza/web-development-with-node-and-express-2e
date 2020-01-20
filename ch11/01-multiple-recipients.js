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
  try {
    const result = await mailTransport.sendMail({
      from: '"Meadowlark Travel" <info@meadowlarktravel.com>',
      to: 'joe@gmail.com, "Jane Customer" <jane@yahoo.com>, fred@hotmail.com',
      subject: 'Your Meadowlark Travel Tour',
      text:  'Thank you for booking your trip with Meadowlark Travel.  ' +
      'We look forward to your visit!'
    })
    console.log('mailt sent successfully: ', result)
  } catch (err) {
    console.log('could not send email: ' + err.message)
  }
}

main()