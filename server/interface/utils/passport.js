import Passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'
//创建一个本地的passprot策略
Passport.use(new LocalStrategy(async function (username,password,done) {
  let where ={
    username
  };
  let result = await UserModel.findOne(where)
  if(result!=null ){
    if (result.password === password){
      return done(null,result)
    }else{
      return done(null,false,'密码错误')
    }


  }else{
    return done(null,false,'用户不存在')
  }
}))


Passport.serializeUser(function (user,done) {
  return done(null,user)
})

Passport.deserializeUser(function (user,done) {
  return done(null,user)
})

export default Passport
