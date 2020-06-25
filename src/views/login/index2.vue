<!--<template>-->
<!--  <div class="login-container">-->
<!--    <div class="form-container">-->
<!--      <div class="head-conatiner">-->
<!--        <h4 class="select-h4">-->
<!--          <el-select v-model="tenant"-->
<!--                     class="form-select"-->
<!--                     placeholder="请选择租户"-->
<!--                     @change="handleTenant">-->
<!--            <el-option v-for="tenant in tenantList"-->
<!--                       :key="tenant.id"-->
<!--                       :label="tenant.name"-->
<!--                       :value="tenant.id"></el-option>-->
<!--          </el-select>-->
<!--        </h4>-->
<!--      </div>-->
<!--      <div class="body-container">-->
<!--        <pwdLogin v-if="state =='form-login' || state ==''"/>-->
<!--        <mobileLogin v-if="state =='mobile-login'"/>-->
<!--      </div>-->
<!--      <div class="footer-container">-->
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <div class="grid-content bg-purple" v-if="state =='form-login' || state ==''"-->
<!--                 style="font-size: 14px;cursor: pointer;" @click="handleLoginWay('mobile-login')"><span >手机短信登录</span>-->
<!--            </div>-->
<!--            <div class="grid-content bg-purple" v-if="state == 'mobile-login'"-->
<!--                 style="font-size: 14px;cursor: pointer" @click="handleLoginWay('form-login')">-->
<!--              <span>账号密码登录</span></div>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <div class="grid-content bg-purple">-->
<!--              <img src="http://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_1.png">-->
<!--            </div>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="copyright-container">-->
<!--      <a href="http://www.beian.miit.gov.cn/">Copyright © 2020-2021 粤ICP备19038132号</a>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->

<!--import request from '@/utils/request'-->
<!--import {setStorage} from '@/utils/Storage'-->
<!--import pwdLogin from './pwdlogin'-->
<!--import mobileLogin from './mobilelogin'-->

<!--export default {-->
<!--  name: 'Login',-->
<!--  components: {-->
<!--    pwdLogin,-->
<!--    mobileLogin-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      tenant: '',-->
<!--      tenantList: [],-->
<!--      state: '',-->
<!--      redirect: undefined,-->
<!--      otherQuery: {}-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    $route: {-->
<!--      handler: function (route) {-->
<!--        const query = route.query-->
<!--        if (query) {-->
<!--          this.redirect = query.redirect-->
<!--          this.otherQuery = this.getOtherQuery(query)-->
<!--        }-->
<!--      },-->
<!--      immediate: true-->
<!--    }-->
<!--  },-->
<!--  created() {-->
<!--    this.getTenantList()-->
<!--  },-->
<!--  methods: {-->
<!--    handleTenant(value) {-->
<!--      setStorage({name: 'tenantId', content: value})-->
<!--    },-->
<!--    getOtherQuery(query) {-->
<!--      return Object.keys(query).reduce((acc, cur) => {-->
<!--        if (cur !== 'redirect') {-->
<!--          acc[cur] = query[cur]-->
<!--        }-->
<!--        return acc-->
<!--      }, {})-->
<!--    },-->
<!--    handleLoginWay(value) {-->
<!--      this.state = value-->
<!--    },-->
<!--    getTenantList() {-->
<!--      request({-->
<!--        url: '/admin/tenant/list',-->
<!--        method: 'get'-->
<!--      }).then(response => {-->
<!--        this.tenantList = response.data.data-->
<!--      })-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--  $bg: #fff; //背景颜色-->
<!--  $dark_gray: #889aa4;-->
<!--  $light_gray: #13a1de; //字体颜色-->

<!--  .form-container {-->
<!--    position: relative;-->
<!--    margin: 0 auto;-->
<!--    width: 380px;-->
<!--    padding: 0 40px;-->
<!--    box-sizing: border-box;-->
<!--    box-shadow: 0 7px 25px rgba(0, 0, 0, 0.08);-->
<!--    background-color: #fff;-->
<!--    border-radius: 3px;-->
<!--  }-->

<!--  .head-conatiner {-->
<!--    text-align: center;-->
<!--    line-height: 40px;-->
<!--  }-->

<!--  .footer-container {-->
<!--    line-height: 50px;-->
<!--  }-->

<!--  .body-container {-->
<!--    line-height: 50px;-->
<!--  }-->

<!--  .form-select {-->
<!--    input {-->
<!--      color: #333;-->
<!--      font-size: 14px;-->
<!--      font-weight: 400;-->
<!--      border: none;-->
<!--      text-align: center;-->
<!--    }-->
<!--  }-->

<!--  .select-h4 {-->
<!--    color: #333;-->
<!--    margin-bottom: -20px;-->
<!--    font-weight: 500;-->
<!--    font-size: 22px;-->
<!--    text-align: center;-->
<!--    letter-spacing: 4px;-->
<!--  }-->

<!--  .login-container {-->
<!--    min-height: 100%;-->
<!--    width: 100%;-->
<!--    background-color: $bg;-->
<!--    overflow: hidden;-->
<!--    display: flex;-->
<!--    align-items: center;-->
<!--    position: relative;-->
<!--    margin: 0 auto;-->

<!--    .form-select {-->
<!--      input {-->
<!--        color: #333;-->
<!--        font-size: 14px;-->
<!--        font-weight: 400;-->
<!--        border: none;-->
<!--        text-align: center;-->
<!--      }-->
<!--    }-->

<!--    .copyright-container {-->
<!--      color: #13a1de;-->
<!--      width: 100%;-->
<!--      position: fixed;-->
<!--      bottom: 30px;-->
<!--      text-align: center;-->
<!--    }-->
<!--  }-->
<!--</style>-->
