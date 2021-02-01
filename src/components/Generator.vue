<template>
  <div class="login">
    <h1 class="login-title">百度rasr</h1>
    <el-row>
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
        <el-form-item label="appid" prop="appid">
          <el-input v-model="authForm.appid"></el-input>
        </el-form-item>
        <el-form-item label="appkey" prop="appkey">
          <el-input v-model="authForm.appkey"></el-input>
        </el-form-item>
        <el-form-item label="dev_pid" prop="dev_pid">
          <el-input v-model="authForm.dev_pid"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="startBaiduRasr('authForm')">开始</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table :data="responseList" style="width: 100%" border>
        <el-table-column prop="code" label="code" min-width="100">
          <template slot-scope="scope"> {{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column prop="message" label="内容" min-width="100">
          <template slot-scope="scope"> {{ scope.row.message }}</template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        input: '',
        responseList: [],
        authForm: {
          appid: '21967891',
          appkey: '6vrWBXxGPCm08nDzfsjFdNd3',
          dev_pid: '15372'
        },
        authRules: {
          appid: [{required: true, message: '请输入appid', trigger: 'blur'}],
          appkey: [{required: true, message: '请输入appkey', trigger: 'blur'}],
          dev_pid: [{required: true, message: '请输入dev_pid', trigger: 'blur'}]
        },
        loading: false
      }
    },
    /**
     * 被销毁前执行断开ws
     */
    beforeDestroy() {
      this.disconnectWs()
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
        this.websock = new WebSocket("ws://127.0.0.1:8000/baidu-ws-channel/")
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
        if (message.code === 200 || message.code === 201 || message.code === 202) {
          this.responseList.push(message)
          // console.log(this.responseList)
        }
        if (message.code === 201) {
          this.lib.notificationInfo(this, "开始录音识别")
        }
        if (message.code === 202) {
          this.lib.notificationInfo(this, "录音识别结束")
        }
      },
      /**
       * 建立ws连接回调
       * @param e
       */
      websocketOnOpen(e) {
        // console.log(e)
        console.log("已连接")
        this.lib.notificationSuccess(this, "连接成功")
        // let connectedMsg = {
        //   code: 200,
        //   msg: 'I am client'
        // }
        // this.sendWebSocketMsg(connectedMsg)
      },
      websocketOnError(e) {
        console.log(e)
      },
      websocketOnClose(e) {
        // console.log(e)
        console.log("断开连接", e.code + " " + e.reason + " " + e.wasClean)
        this.lib.notificationInfo(this, "连接断开")
      },
      /**
       * 断开ws
       */
      disconnectWs() {
        let disconnectMsg = {
          code: 888,
          msg: 'I quit'
        }
        this.sendWebSocketMsg(disconnectMsg)
      },
      /**
       * 发送开始百度语音识别消息
       * @param authForm 鉴权信息
       */
      startBaiduRasr(authForm) {
        // 判空
        this.$refs[authForm].validate((valid) => {
          if (valid) {
            this.loading = true
            let startMsg = {
              code: 201,
              msg: 'start',
              appid: this.authForm.appid,
              appkey: this.authForm.appkey,
              dev_pid: this.authForm.dev_pid
            }
            // console.log(startMsg)
            this.sendWebSocketMsg(startMsg)
            this.loading = false
            //   console.log(this.loginForm.username);
            //   alert("submit!");
          } else {
            this.loading = false
            // this.lib.notificationWarning(this, '登录失败')
            return false
          }
        })
      },
      init() {
      },
    },
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
</style>
