<template>
  <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
           label-position="left">
    <el-form-item prop="username">
      <span class="svg-container"><svg-icon icon-class="user"/></span>
      <el-input
        ref="username"
        v-model="loginForm.username"
        placeholder="用户名"
        name="username"
        type="text"
        tabindex="1"
        autocomplete="on"/>
    </el-form-item>

    <el-tooltip v-model="capsTooltip" content="大写已打开!" placement="right" manual>
      <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          autocomplete="on"
          @keyup.native="checkCapslock"
          @blur="capsTooltip = false"
          @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
      </el-form-item>
    </el-tooltip>

    <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
               @click.native.prevent="handleLogin">登录
    </el-button>
  </el-form>
</template>

<script>
import {setStorage} from "@/utils/Storage";
import request from "@/utils/request";

export default {
  name: "PwdLogin",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else if (value.length > 11) {
        callback(new Error('密码不能超过11位'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'change', validator: validatePassword}],
      },
    }
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const {key} = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
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
    handleTenant(value) {
      setStorage({name: 'tenantId', content: value})
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
    getTenantList() {
      request({
        url: '/admin/tenant/list',
        method: 'get'
      }).then(response => {
        this.tenantList = response.data.data
      })
    },
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $light_gray: #0c0c0c; //输入框字体颜色
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui   css */
  .login-container {
    .el-input {
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px #E5E5E5 inset !important;
          -webkit-text-fill-color: $light_gray !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #fff; //背景颜色
  $dark_gray: #889aa4;
  $light_gray: #13a1de; //字体颜色

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 50px 35px 35px;
    height: 250px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
</style>
