const express = require('express')
const router = require('./router/router')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = new express()

app.use(session({
  secret:'userLogin',
  resave:false,
  saveUninitialized:true
}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.engine('html', require('express-art-template'))

app.use('/node_modules/', express.static('./node_modules/'))

app.use(router)
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('127.0.0.1:3000 started.')
})


