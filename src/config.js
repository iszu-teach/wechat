'use strict'

const path = require('path')

module.exports = {
  db: 'mongodb://localhost/',
  log: path.resolve(__dirname, '../logs/wechat.log'),
  base: 'wechat',
  port: '3001',
  root: 'http://iszu.cn',
  secret: 'iszu666',
  appID: '',
  appSecret: '',
  wechatTokenCache: path.resolve(__dirname, '../')
}
