'use strict'
const path = require('path')

module.exports = {
  db: 'mongodb://szuwechat:szu0408@localhost:28018/',
  log: path.resolve(__dirname, '../../logs/wechat.log'),
  base: 'wechat',
  port: '3001',
  root: 'https://szuwechat.cn',
  secret: 'szu0408',
  appID: 'wx44bb58ea4fb385a7',
  appSecret: 'ec6441eff9c6ae3ca909c4a9bf34ea30',
  wechatTokenCache: path.resolve(__dirname, '../../')
}
