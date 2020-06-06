<template>
  <div class="app-container">
    <div style="text-align: center;">
      <el-row>
        <el-col :span="24"><h2>扫码支付</h2></el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <qrcode :value="msg" :options="options"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><h4>请使用微信或支付宝（沙箱）手机客户端扫一扫 {{msg}}</h4></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import VueQrcode from '@chenfengyuan/vue-qrcode'
import {getStorage} from "@/utils/Storage";

const protocol = window.location.protocol
const host = window.location.host

export default {
  components: {
    'qrcode': VueQrcode
  },
  name: "PayQrCode",
  data() {
    return {
      msg: '',
      options: {
        height: 300,
        width: 300
      }
    }
  },
  created() {
    const tenantId = getStorage({ name: 'tenantId' })
    this.msg = `${protocol}//${host}/FDP-pay-business/pay?tenant_id=`+tenantId
  }
}
</script>

<style scoped>

</style>
