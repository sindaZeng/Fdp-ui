<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
           label-position="left">
    <el-form-item prop="mobile">
      <span class="svg-container"><svg-icon icon-class="tel"/></span>
      <el-input
        ref="mobile"
        v-model="loginForm.mobile"
        placeholder="手机号码"
        name="mobile"
        type="text"
        tabindex="1"
        autocomplete="on"/>
    </el-form-item>
    <el-form-item prop="code">
                  <span class="svg-container">
                    <svg-icon icon-class="code"/>
                  </span>
      <el-input
        v-model="loginForm.code"
        placeholder="验证码"
        autocomplete="off" @keyup.enter.native="handleLogin">
        <template slot="append">
          <span :class="[{display:msgKey}]" class="msg-text" @click="handleSend">{{ msgText }}</span></template>
      </el-input>
    </el-form-item>

    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
               @click.native.prevent="handleLogin">登录
    </el-button>
  </el-form>
</template>

<script>
import request from "@/utils/request";

const MSGINIT = '发送验证码',
  MSGSCUCCESS = '${time}秒后重发',
  MSGTIME = 60
const reg = /^1[3|4|5|7|8][0-9]\d{8}$/

export default {
  name: "MobileLogin",
  data() {
    const validateCode = (rule, value, callback) => {
      if (value.length != 6) {
        callback(new Error('请输入6位数的验证码'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    }
    return {
      msgText: MSGINIT,
      msgTime: MSGTIME,
      msgKey: false,
      loading: false,
      loginForm: {
        mobile: '',
        code: ''
      },
      loginRules: {
        mobile: [{required: true, trigger: 'blur', validator: validatePhone}],
        code: [{required: true, trigger: 'change', validator: validateCode}],
      },
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/loginByMobile', this.loginForm)
            .then(() => {
              this.$router.push({path: this.redirect || '/', query: this.otherQuery})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    handleSend() {
      if (!this.loginForm.mobile) {
        return
      } else if (this.msgKey || !reg.test(this.loginForm.mobile)) {
        return
      }
      request({
        url: '/admin/mobile/' + this.loginForm.mobile,
        method: 'get'
      }).then(response => {
        if (response.data.data) {
          this.$message.success('验证码发送成功')
        } else {
          this.$message.error(response.data.msg)
        }
      })
      this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
      this.msgKey = true
      const time = setInterval(() => {
        this.msgTime--
        this.msgText = MSGSCUCCESS.replace('${time}', this.msgTime)
        if (this.msgTime === 0) {
          this.msgTime = MSGTIME
          this.msgText = MSGINIT
          this.msgKey = false
          clearInterval(time)
        }
      }, 1000)

    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/login.scss";
</style>
