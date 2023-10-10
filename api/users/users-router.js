// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!
const mw = require('../auth/auth-middleware');
const userModel = require('./users-model');
const router = require('express').Router();

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */
router.get('/',mw.sinirli,(req,res,next) => {
  const {user} = req.existUser;
  try {
    if(user){
      res.status(200).json({user});
      next();
    }else {
      res.status(401).json({message:"Geçemezsiniz!"})
    }
  } catch (error) {
    next(error)
  }
})

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;