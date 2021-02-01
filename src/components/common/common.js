/**
 * notification 通知
 */
export default ({
  notificationSuccess(that, msg) {
    that.$notify({
      title: '成功',
      message: msg,
      type: 'success'
    })
  },
  notificationWarning(that, msg) {
    that.$notify({
      title: '警告',
      message: msg,
      type: 'warning'
    })
  },
  notificationInfo(that, msg) {
    that.$notify.info({
      title: '消息',
      message: msg
    })
  },
  notificationError(that, msg) {
    that.$notify.error({
      title: '错误',
      message: msg
    })
  },
  confimNotification(that, msg, callback, errorCallback) {
    that.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      callback()
    }).catch(() => {
      errorCallback()
    })
  }
})
