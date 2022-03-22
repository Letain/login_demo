const express = require('express')
const user = require('./user')
const md5 = require('blueimp-md5')

const router = express.Router()

// サインアップ画面へ
router.get('/register', function (req, res) {
  res.render('./register.html')
})

// サインアップ動作
router.post('/register', function (req, res) {
  console.log(req.body)
  user.findOne(req.body).then((data) => {
    if (data.length > 0) {
      return res.send({
        success: false,
        msg: 'Register failed, there already an account has been taken.'
      })
    }
    user.save(req.body).then(() => {
      res.send({
        success: true,
        msg: 'Register successed!'
      })
    }).catch((err) => {
      console.log(err)
    })
  }).catch((err) => {
    console.log(err)
  })
})

// ログイン画面へ
router.get('/login', function (req, res) {
  res.render('./login.html')
})

// ログイン動作
router.post('/login', function (req, res) {
  req.body.user_password = md5(req.body.user_password)
  user.findOne(req.body).then(data => {
    if (data.length > 0) {
      if (data[0].user_password == req.body.user_password) {
        
        var hour = 3600000
        req.session.cookie.expires = new Date(Date.now() + hour)
        req.session.cookie.maxAge = hour
        req.session.isLogin = true
        return res.send({
          success: true,
          msg: 'Login Successed.'
        })
      }
      return res.send({
        success: false,
        msg: 'Login failed. Please check your account or password.'
      })
    }

  })
})

// ログアウト画面へ
router.get('/logout', function (req, res) {
  res.render('./logout.html')
})

// ログアウト動作
router.post('/dologout', function (req, res) {
  req.session.isLogin = false
  return res.send({
    success: true,
    msg: 'Logout Successed.'
  })
})

// ホームへ
router.get('/', function (req, res) {
  console.log(req.session)
  if (req.session.isLogin) {
    res.render('./index.html')
  } else {
    res.render('./login.html')
  }
})

module.exports = router


