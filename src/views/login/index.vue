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
        <pwdLogin v-if="state =='form-login' || state ==''"/>
        <mobileLogin v-if="state =='mobile-login'"/>
        <div v-if="state =='form-login' || state ==''" style="text-align:center">
          <span style="font-size: 12px;cursor: pointer;" @click="handleLoginWay('mobile-login')">手机短信登录</span></div>
        <div v-if="state == 'mobile-login'" style="text-align:center">
          <span style="font-size: 12px;cursor: pointer" @click="handleLoginWay('form-login')">账号密码登录</span></div>
      </div>
      <p class="third-text">其他登录方式</p>
        <div class="social-signup-container">
          <div class="sign-btn">
            <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
          </div>
          <div class="sign-btn" @click="thirdHandleClick('tencent')">
            <span class="qq-svg-container"><svg-icon icon-class="qq" class="icon" /></span>
          </div>
      </div>
    </div>
    <div class="footer-container">
      <a href="http://www.beian.miit.gov.cn/">Copyright © 2020-2021 粤ICP备19038132号</a>
    </div>
  </div>
</template>

<script>

import request from '@/utils/request'
import {setStorage} from '@/utils/Storage'
import pwdLogin from './pwdlogin'
import mobileLogin from './mobilelogin'
import { util } from '@/utils/util'

export default {
  name: 'Login',
  components: {
    pwdLogin,
    mobileLogin
  },
  data() {
    return {
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
        debugger
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
    // this.getTenantList()
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
    thirdHandleClick(way) {
      let url
      const redirect_uri = encodeURIComponent(window.location.origin + '/#/auth-redirect')
      if (way === 'tencent') {
        const client_id = '101887822'
        url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=xhuicloud-qq-login&client_id=${client_id}&redirect_uri=${redirect_uri}`
      }
      util(url, way, 540, 540)
    }
  }
}
</script>

<style lang="scss" scoped>
  $bg: #fff; //背景颜色
  $dark_gray: #889aa4;
  $light_gray: #13a1de; //字体颜色

  .form-container {
    position: relative;
    margin: 0 auto;
    width: 400px;
    padding: 0 40px;
    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);
    background-color: #fff;
    border-radius: 3px;
  }

  .head-conatiner {
    text-align: center;
    line-height: 40px;
  }

  .body-container {
    line-height: 50px;
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
  }

  .footer-container {
    color: #040b0e;
    width: 100%;
    position: fixed;
    bottom: 30px;
    text-align: center;
  }

  .third-text {
    width: 400px;
    height: 20px;
    margin-top: 10px;
    margin-left: -40px;
    margin-bottom: 10px;
    font-size: 12px;
    text-align: center;
    line-height: 10px;
    color: #b4b4b4;
    background: url('../../assets/login_images/login-icon.png') no-repeat 0 -74px;
  }


  .social-signup-container {
    margin: 20px 0;
    text-align: center;
    .sign-btn {
      display: inline-block;
      cursor: pointer;
    }
    .icon {
      color: #fff;
      font-size: 24px;
      margin-top: 8px;
    }
    .wx-svg-container,
    .qq-svg-container {
      display: inline-block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      padding-top: 1px;
      border-radius: 4px;
      margin-bottom: 20px;
      margin-right: 5px;
    }
    .wx-svg-container {
      background-color: #24da70;
    }
    .qq-svg-container {
      background-color: #6BA2D6;
      margin-left: 50px;
    }
  }
</style>
