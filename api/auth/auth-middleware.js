const userModel = require('../users/users-model');
const bcrypt = require('bcryptjs')
/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
async function sinirli(req,res,next) {
  try {
    let isExistUser = await userModel.bul();
    if(!isExistUser){
      res.status(401).json({message:"Geçemezsiniz!"})
    }else{
      req.existUser = isExistUser;
      next();
    }
  } catch (error) {
    next(error);
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
async function usernameBostami(req,res,next) {
try {
  const {username} = req.body
  const existName = await userModel.goreBul({username});
  if(existName.length>0){
    res.status(422).json({message: "Username kullaniliyor"})
  }else{
    next();
  }
} catch (error) {
  next(error);
}
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
async function usernameVarmi(req,res,next) {
const {username} = req.body;
const [user] = await userModel.goreBul({username:username})
if(!user) {
  res.status(401).json({message:"Geçersiz kriter"})
}else {
  req.user = user;
  next();
}
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
async function sifreGecerlimi(req,res,next) {
  try {
    let { password } = req.body;
    if(!password || password.length<3){
      res.status(422).json({message:"Şifre 3 karakterden fazla olmalı"})
    }else{
      let hashPassword = bcrypt.hashSync(password,12);
      req.hashPassword = hashPassword;
      next();
    }
  } catch (error) {
    next(error);
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi
}