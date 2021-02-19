<template>
  <div class="login">
    <el-row>
      <el-col :span="8">
        <h1 class="login-title">腾讯rasr</h1>
        <el-form
          :model="authForm"
          :rules="authRules"
          ref="authForm"
          label-width="auto"
          class="login-form"
        >
          <el-form-item>
            <el-button type="primary" @click="createConnection()">连接服务端</el-button>
            <el-button type="primary" @click="disconnectWs()">断开服务端</el-button>
          </el-form-item>
          <el-form-item label="appId" prop="appId">
            <el-input v-model="authForm.appId"></el-input>
          </el-form-item>
          <el-form-item label="secretId" prop="secretId">
            <el-input v-model="authForm.secretId"></el-input>
          </el-form-item>
          <el-form-item label="secretKey" prop="secretKey">
            <el-input v-model="authForm.secretKey"></el-input>
          </el-form-item>
          <el-form-item label="engineModelType" prop="engineModelType">
            <el-select v-model="authForm.engineModelType" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!--            <el-input v-model="authForm.engineModelType"></el-input>-->
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" @click="startTencentRasr('authForm')">开始</el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="primary"
                     href="https://cloud.tencent.com/document/product/1093/48982#.E9.94.99.E8.AF.AF.E7.A0.81">文档
            </el-link>
            <el-link type="primary"
                     href="https://console.cloud.tencent.com/" style="margin-left: 50px">控制台
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="16">
        <textarea class="text-font" v-model="content" style="width: 80%; height: 500px" border readonly></textarea>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        content: '',
        responseList: [],
        authForm: {
          appId: '',
          secretId: '',
          secretKey: '',
          engineModelType: '16k_zh'
        },
        options: [
          {
            label: '16k 中文普通话通用',
            value: '16k_zh'
          }, {
            label: '16k 粤语',
            value: '16k_ca'
          }, {
            label: '16k 英语',
            value: '16k_en'
          }, {
            label: '16k 日语',
            value: '16k_ja'
          }, {
            label: '医疗',
            value: '16k_zh_medical'
          }, {
            label: '中文教育',
            value: '16k_zh_edu'
          }, {
            label: '英文教育',
            value: '16k_en_edu'
          }
        ],
        authRules: {
          appId: [{required: true, message: '请输入appId', trigger: 'blur'}],
          secretId: [{required: true, message: '请输入secretId', trigger: 'blur'}],
          secretKey: [{required: true, message: '请输入secretKey', trigger: 'blur'}],
          engineModelType: [{required: true, message: '请输入engineModelType', trigger: 'blur'}]
        },
        loading: false
      }
    },
    /**
     * 被销毁前执行断开ws
     */
    beforeDestroy() {
      this.disconnectWs()
      clearInterval(this.timer)
    },
    created() {
      this.init()
    },
    methods: {
      createConnection() {
        this.initWebSocket()
      },
      /**
       * 初始化ws
       */
      initWebSocket() {
        // 连接服务端
        this.websock = new WebSocket("ws://127.0.0.1:8000/tencent-ws-channel/")
        // 指定事件回调
        this.websock.onmessage = this.websocketOnMessage
        this.websock.onopen = this.websocketOnOpen
        this.websock.onerror = this.websocketOnError
        this.websock.onclose = this.websocketOnClose
      },
      /**
       * 发送消息
       * @param msg
       */
      sendWebSocketMsg(msg) {
        this.websock.send(JSON.stringify(msg))
      },
      /**
       * 接收消息回调
       * @param e
       */
      websocketOnMessage(e) {
        console.log(e.data)
        let message = JSON.parse(e.data)
        if (message.code === 200) {
          console.log(message)
        }
        // 201 表示服务端开始调用识别
        if (message.code === 201) {
          this.lib.notificationInfo(this, "开始录音识别")
        }
        // 202 表示服务端返回识别内容
        if (message.code === 202) {
          this.content = message.result
          // this.responseList.push(message)
        }
        // 203 表示服务端识别结束
        if (message.code === 203) {
          this.content = message.result
          clearInterval(this.timer)
          this.lib.notificationInfo(this, "录音识别结束")
        }
      },
      /**
       * 建立ws连接回调
       * @param e
       */
      websocketOnOpen(e) {
        console.log("已连接")
        this.lib.notificationSuccess(this, "连接成功")
      },
      websocketOnError(e) {
        console.log(e)
      },
      websocketOnClose(e) {
        console.log("断开连接", e.code + " " + e.reason + " " + e.wasClean)
        this.lib.notificationInfo(this, "连接断开")
      },
      /**
       * 断开ws
       */
      disconnectWs() {
        let disconnectMsg = {
          code: 888,
          msg: 'client: I quit'
        }
        this.sendWebSocketMsg(disconnectMsg)
        clearInterval(this.timer)
      },
      /**
       * 发送开始腾讯语音识别消息
       * @param authForm 鉴权信息
       */
      startTencentRasr(authForm) {
        // 判空
        this.$refs[authForm].validate((valid) => {
          if (valid) {
            this.loading = true
            let startMsg = {
              code: 201,
              msg: 'client: start tencent rasr',
              auth: {
                app_id: this.authForm.appId,
                secret_id: this.authForm.secretId,
                secret_key: this.authForm.secretKey,
                engine_model_type: this.authForm.engineModelType
              }
            }
            console.log(startMsg)
            this.sendWebSocketMsg(startMsg)
            // 定时任务，每隔1s向服务端获取一次识别内容
            this.timer = setInterval(this.getResult, 1000)
            this.loading = false
          } else {
            this.loading = false
            this.lib.notificationWarning(this, '鉴权失败')
            return false
          }
        })
      },
      /**
       * 获取识别内容
       */
      getResult() {
        let getMsg = {
          code: 202,
          msg: 'client: get result'
        }
        this.sendWebSocketMsg(getMsg)
        console.log('get get')
      },
      init() {
      },
    }
  }
</script>

<style>
  .login {
    width: 100%;
    height: 100%;
    /*position: relative;*/
  }

  .login-form {
    width: 500px;
    margin: auto;
    /*position: absolute;*/
    top: 20%;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
  }

  .text-font {
    font-size: 30px;
    font-family: Calibri;
  }
</style>
