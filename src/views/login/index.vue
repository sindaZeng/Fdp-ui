<template>
  <div class="login-container">
    <div class="form-container">
      <div class="head-conatiner">
        <h4 class="select-h4">
          <el-select v-model="tenant"
                     class="form-select"
                     placeholder="请选择租户"
                     @change="handleTenant">
            <el-option v-for="tenant in tenantList"
                       :key="tenant.id"
                       :label="tenant.name"
                       :value="tenant.id"></el-option>
          </el-select>
        </h4>
      </div>
      <div class="body-container">
        <pwdLogin/>
      </div>
      <div class="footer-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple" v-if="state =='form-login' || state ==''"
                 style="font-size: 14px;cursor: pointer;"><span @click="handleLoginWay('mobile-login')">手机短信登录</span>
            </div>
            <div class="grid-content bg-purple" v-if="state == 'mobile-login'" style="font-size: 14px;cursor: pointer">
              <span @click="handleLoginWay('form-login')">账号密码登录</span></div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="copyright-container">
      Copyright © 2019 xhuicloud.com
    </div>
  </div>
</template>

<script>
const MSGINIT = '发送验证码',
  MSGSCUCCESS = '${time}秒后重发',
  MSGTIME = 60
const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
import request from '@/utils/request'
import {setStorage} from '@/utils/Storage'
import pwdLogin from './pwdlogin'

export default {
  name: 'Login',
  components: {
    pwdLogin
  },
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
      tenant: '',
      tenantList: [],
      state: '',
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.getTenantList()
  },
  methods: {
    handleTenant(value) {
      setStorage({name: 'tenantId', content: value})
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handleLoginWay(value) {
      this.state = value
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

  .form-container {
    position: relative;
    margin: 0 auto;
    width: 380px;
    padding: 0 40px;
    box-sizing: border-box;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    border-radius: 3px;
  }

  .head-conatiner {
    text-align: center;
    line-height: 40px;
  }

  .footer-container {
    line-height: 50px;
  }

  .body-container {
    line-height: 50px;
  }

  .form-select {
    input {
      color: #333;
      font-size: 14px;
      font-weight: 400;
      border: none;
      text-align: center;
    }
  }

  .select-h4 {
    color: #333;
    margin-bottom: -20px;
    font-weight: 500;
    font-size: 22px;
    text-align: center;
    letter-spacing: 4px;
  }

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;
    display: flex;
    align-items: center;
    position: relative;
    margin: 0 auto;

    .form-select {
      input {
        color: #333;
        font-size: 14px;
        font-weight: 400;
        border: none;
        text-align: center;
      }
    }

    .copyright-container {
      color: #13a1de;
      width: 100%;
      position: fixed;
      bottom: 30px;
      text-align: center;
    }
  }
</style>
