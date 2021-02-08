import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home"
import BaiduGenerator from "@/components/BaiduGenerator"
import XunfeiGenerator from "@/components/XunfeiGenerator"
import YoudaoGenerator from "@/components/YoudaoGenerator"
import TencentGenerator from "@/components/TencentGenerator";


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/baidu',
      name: 'BaiduGenerator',
      component: BaiduGenerator
    },
    {
      path: '/xunfei',
      name: 'XunfeiGenerator',
      component: XunfeiGenerator
    },
    {
      path: '/youdao',
      name: 'YoudaoGenerator',
      component: YoudaoGenerator
    },
    {
      path: '/tencent',
      name: 'TencentGenerator',
      component: TencentGenerator
    }
  ]
})
