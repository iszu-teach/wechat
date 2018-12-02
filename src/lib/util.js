'use strict'

const crypto = require('crypto')

/**
 * 对 `data` 进行 sha1 加密
 *
 * @param {any} data 要加密的数据
 * @returns {String} 加密后的数据
 */
function sha1 (data) {
  return crypto.createHash('sha1').update(data).digest('hex')
}

/**
 * 返回当前时间戳
 *
 * @returns {Number} 当前时间戳
 */
function timestamp () {
  return Math.floor(Date.now() / 1000)
}

/**
 * 生成随机字符串
 *
 * @param {Number} length 要生成的随机字符串的长度
 * @returns {String} 随机字符串
 */
function randomString (length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''

  for (let i = length; i > 0; i--) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }

  return result
}

module.exports = {
  sha1,
  timestamp,
  randomString
}
