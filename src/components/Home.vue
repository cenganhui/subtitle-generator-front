<template>
  <div class="login">
    <h1 class="login-title">字幕生成器</h1>
    <el-row>
      <el-button :loading="loading" type="primary" @click="toBaiduGenerator()">百度rasr</el-button>
    </el-row>
    <el-row style="margin-top: 30px">
      <el-button :loading="loading" type="primary" @click="toXunfeiGenerator()">讯飞rasr</el-button>
    </el-row>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        loading: false
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
      },
      /**
       * 跳转到百度rasr页面
       */
      toBaiduGenerator() {
        this.$router.push({path: '/baidu'})
      },
      /**
       * 跳转到讯飞rasr页面
       */
      toXunfeiGenerator() {
        this.$router.push({path: '/xunfei'})
      }
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
</style>
