'use strict'

const Token = require('./token')
const config = require('../../config')
const request = require('request-promise')

// https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183&token=&lang=zh_CN
class AccessToken extends Token {
  constructor () {
    super('access_token')
  }

  async renew () {
    const result = await request({
      uri: 'https://api.weixin.qq.com/cgi-bin/token',
      qs: {
        grant_type: 'client_credential',
        appid: config.appID,
        secret: config.appSecret
      },
      json: true
    })

    if (result.access_token) {
      this.content = result.access_token

      await this.save()
      return this.content
    } else throw new Error(result.errmsg)
  }
}

module.exports = AccessToken
