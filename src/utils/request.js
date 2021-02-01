import axios from 'axios';

const service = axios.create({
  baseURL: '',
  withCredentials: true,
  timeout: 30000
});

// request interceptor
// service.interceptors.request.use(
//     config => {
//         // do something before request is sent
//
//         // let each request carry token
//         // ['X-Token'] is a custom headers key
//         // please modify it according to the actual situation
//         config.headers['Authorization'] = getLoginInfo().token;
//         return config;
//     },
//     error => {
//         // do something with request error
//         console.log(error) // for debug
//         return Promise.reject(error)
//     }
// )
//
// // response interceptor
// service.interceptors.response.use(
//     response => {
//         const res = response.data
//         // console.log(res)
//         if (res.code === 401) {
//             alert("未登录")
//             // vue.$router.push({ path: '/login' })
//             window.location.replace("/#/login")
//         } else if (res.code === '0010') {
//             alert("权限不足")
//             // vue.$router.push({ path: '/login' })
//             window.location.replace("/#/book")
//         } else if (res.type === 'text/xml') {
//             return res
//         } else if (res.code !== '0000') {
//             return Promise.reject(new Error(res.msg || 'Error'))
//         } else {
//             return res
//         }
//     },
//     error => {
//         console.log('err' + error.code) // for debug
//         return Promise.reject(error)
//     }
// )

export default service;
