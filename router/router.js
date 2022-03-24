const express = require('express')
const user = require('../dao/user')
const role = require('../dao/role')
const md5 = require('blueimp-md5')
const { route } = require('express/lib/application')

const router = express.Router()


router.get('/home', function(req, res){
  res.render('./home.html')
})
router.get('/index', function(req, res){
  res.render('./index.html')
})

router.get('/header_notlogin', function(req, res){
  res.render('./header_notlogin.html')
})

router.get('/header_index', function(req, res){
  res.render('./header_index.html')
})

// router.get('/*', function(req, res, next) {
//   res.locals.data = req.session.username;
//   next();
// });


// サインアップ画面へ
router.get('/register', function (req, res) {
  // console.log(req.app.locals)
  // if (!req.session.roles) {
  //   req.session.roles = {}
  //   role.findAll().then((data) =>{
  //     if (data.length > 0){
  //       for(let i = 0; i < data.length; i ++){
  //         req.session.roles[data[i].id.toString()] = data[i].name;
  //       }
  //     }
  //   })    
  // }

  res.render('./register.html')
})

router.get('/getRoles', async function(req, res){  
  var roles = {}
  await role.findAll().then((data) =>{
    if (data.length > 0){
      for(let i = 0; i < data.length; i ++){
        roles[data[i].id.toString()] = data[i].name;
      }
    }
  })
  res.send(roles)
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
  req.body.password = md5(req.body.password)
  user.findOne(req.body).then(data => {
    if (data.length > 0) {
      if (data[0].password == req.body.password) {
        
        var hour = 3600000
        req.session.cookie.expires = new Date(Date.now() + hour)
        req.session.cookie.maxAge = hour
        req.session.isLogin = true
        return res.send({
          success: true,
          msg: 'Login Successed.'
        })
      }
    }
    return res.send({
      success: false,
      msg: 'Login failed. Please check your account or password.'
    })

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


