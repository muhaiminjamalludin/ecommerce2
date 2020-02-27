//Check if we on dev mode or production mode, kite implement .env utk dev mode bkn production mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()//load everyting in .env
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY




const express = require('express')
const app = express()
const fs = require('fs')// allow us to read different file , perlu utk read json file
const stripe = require('stripe')(stripeSecretKey)//nk gne stripe api + secret key to activate
const { getHome, getStore } = require('./Route/index');

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))


//handle get request n render
app.get(, function (req, res) {
  fs.readFile('items.json', function (error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('store.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data)
      })
    }
  })
})

app.post('/purchase', function (req, res) {
  fs.readFile('items.json', function (error, data) {
    if (error) {
      res.status(500).end()
    } else {
      //info from stripe handle here
      console.log('purchase')
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.shirt.concat(itemsJson.jacket)
      let total = 0
      //accses the json object
      req.body.items.forEach(function (item) {
        //cari item dlm object- kalo id dlm array same dgn id json kite bole access the price
        const itemJson = itemsArray.find(function (i) {
          return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
      })

      //gne stripe utk charge user- then we use promise utk handle kalo transaction berjaya n handle kalo fail
      stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,//id yg akn dicaj
        currency: 'myr'
      }).then(function () {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })
      }).catch(function () {
        console.log('Charge Fail')
        res.status(500).end()
      })
    }
  })
})

app.listen(5000)