<template>
  <div class="home">
    <el-row display="margin-top: 10px">
      <el-button type="primary" @click="createConnection()">连接</el-button>
      <el-button type="primary" @click="startBaidu()">开始</el-button>
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
        dataForm: {
          baidu_appid: 123,
          baidu_appkey: 'abc',
        },
      }
    },
    beforeDestroy() {
      let disconnectMsg = {
        code: 888,
        msg: 'I quit'
      }
      this.sendWebSocketMsg(disconnectMsg)
    },
    created() {
      this.init()
    },
    methods: {
      createConnection() {
        this.initWebSocket()
      },
      // 初始化 websocket
      initWebSocket() {
        // 连接服务端
        this.websock = new WebSocket("ws://127.0.0.1:8000/ws-channel/")
        // 指定事件回调
        this.websock.onmessage = this.websocketOnMessage
        this.websock.onopen = this.websocketOnOpen
        this.websock.onerror = this.websocketOnError
        this.websock.onclose = this.websocketOnClose
      },
      // 发送消息
      sendWebSocketMsg(msg) {
        this.websock.send(JSON.stringify(msg))
      },
      websocketOnMessage(e) {
        console.log(e.data)
        let message = JSON.parse(e.data)
        if (message.code === 200) {
          this.responseList.push(message)
          // console.log(this.responseList)
        }
      },
      websocketOnOpen(e) {
        // console.log(e)
        console.log("已连接")
        let connectedMsg = {
          code: 200,
          msg: 'I am client'
        }
        this.sendWebSocketMsg(connectedMsg)
      },
      websocketOnError(e) {
        console.log(e)
      },
      websocketOnClose(e) {
        // console.log(e)
        console.log("断开连接", e.code + " " + e.reason + " " + e.wasClean)
      },
      // 开始语音识别
      startBaidu() {
        let startMsg = {
          code: 201,
          msg: 'start'
        }
        this.sendWebSocketMsg(startMsg)
      },
      init() {
      },
    },
  }
</script>
