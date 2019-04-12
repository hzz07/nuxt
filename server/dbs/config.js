export default {
  dbs:"mongodb://127.0.0.1:27017/mt",
  redis:{
    get host (){
      return '127.0.0.1'
    },
    get port(){
      return 6379
    }
  },
  smtp:{
    //配置邮箱
    get host(){
      return 'smtp.qq.com'
    },
    //写自己的邮箱
    get user(){
      return 'xxxxx@qq.com'
    },
    //设置自己邮箱可以使用程序发送邮箱
    get pass(){
      return 'xxxxxxx'
    },
    //生成四位随机验证码
    get code(){
      return Math.random().toString(16).slice(2,6).toUpperCase()
    },
    //全局设置验证码过期时间
    get expire(){
      return ()=>{
        return new Date().getTime()+60*60*1000

      }
    }


  }

}
