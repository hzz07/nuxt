<template>
    <div class="page-register">
      <article class="header">
        <header>
          <a href="/" class="site-logo"></a>
          <span class="login">
            <em class="bold"> 已有美团账号?</em>
            <a href="/login">
              <el-button type='primary' size="small">登陆</el-button>
            </a>
          </span>
        </header>

      </article>
      <section>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="昵称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱">
            </el-input>
            <el-button size="mini"
                      round @click="sendMsg">发送验证码</el-button>
            <span class="status">{{statusMsg}}</span>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <el-input v-model="ruleForm.code" placeholder="请输入验证码" maxlength="4">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="ruleForm.pwd" placeholder="请输入密码" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="cpwd">
            <el-input v-model="ruleForm.cpwd" placeholder="请输入密码" type="password">
            </el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="register">同意以下协议并注册</el-button>
            <div class="error">{{error}}</div>
          </el-form-item>
          <el-form-item >
            <a class="f1" href="http://www.meituan.com/about/terms" target="_blank">《美团网用户协议》</a>
          </el-form-item>
        </el-form>
      </section>
    </div>
</template>

<script>
  import CryptoJS from 'crypto-js'
    export default {
        layout: "blank",
      data(){
          return{
            statusMsg:'',
            error:'',
            ruleForm:{
              name:'',
              code:'',
              pwd:'',
              cpwd:''
            },
            rules:{
              name:[{
                required:true,
                type:'string',
                message:'请输入昵称',
                trigger:'blur'
              }],
              email:[{
                required:true,
                type:'email',
                message:'请输入邮箱',
                trigger:'blur'
              }],
              pwd:[{
                required:true,
                message:'创建密码',
                trigger:'blur'
              }],
              cpwd: [{
                required: true,
                message: '确认密码',
                trigger: 'blur'
              }, {
                validator: (rule, value, callback) => {
                  if (value === '') {
                    callback(new Error('请再次输入密码'))
                  } else if (value !== this.ruleForm.pwd) {
                    callback(new Error('两次输入密码不一致'))
                  } else {
                    callback()
                  }
                },
                trigger: 'blur'
              }]
            }
          }
      },
      methods:{
        sendMsg(){
            const self = this;
            let namePass
            let emailPass
            //判断点击验证码是不是在跑定时器
            // if(self.timerid ){
            //   return false
            // }
            //判断input内容是否通过eleui的表单校验
            this.$refs['ruleForm'].validateField('name',(vaild)=>{
              namePass = vaild
            })
            self.statusMsg = ''
            if (namePass) {
              return false
            }
            this.$refs['ruleForm'].validateField('email', (valid) => {
              emailPass = valid
            })
            //如果都通过校验
            if (!namePass && !emailPass) {
              //发送axios请求  axios 在nuxt全局中引用
              self.$axios.post('/users/verify', {
                //对中文进行编码
                username: encodeURIComponent(self.ruleForm.name),
                email: self.ruleForm.email

              }).then(({
                         status,
                         data
                       }) => {
                if (status === 200 && data && data.code === 0) {
                  let count = 10;
                  self.statusMsg = `验证码已发送,剩余${count--}秒`
                  self.timerid = setInterval(function () {
                    self.statusMsg = `验证码已发送,剩余${count--}秒`
                    if (count === 0) {
                      self.statusMsg = ''
                      clearInterval(self.timerid)
                      console.log(clearInterval(self.timerid))
                    }
                  }, 1000)
                } else {
                  self.statusMsg = data.msg
                }
              })
            }

        },
        register(){
          let self = this;
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              self.$axios.post('/users/signup', {
                username: window.encodeURIComponent(self.ruleForm.name),
                password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
                email: self.ruleForm.email,
                code: self.ruleForm.code
              }).then(({
                         status,
                         data
                       }) => {
                if (status === 200) {
                  if (data && data.code === 0) {
                    location.href = '/login'
                  } else {
                    self.error = data.msg
                  }
                } else {
                  self.error = `服务器出错，错误码:${status}`
                }
                setTimeout(function () {
                  self.error = ''
                }, 1500)
              })
            }
          })
        }
      },
      computed:{

      }
    }
</script>

<style lang="scss">
  @import "@/assets/css/register/index.scss";
</style>
