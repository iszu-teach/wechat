'use strict'

const qs = require('querystring')
const Token = require('./token')
const config = require('../../config')
const request = require('request-promise')
const { sha1, timestamp, randomString } = require('../util')

// https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115&token=&lang=zh_CN
class JsapiTicket extends Token {
  constructor () {
    super('jsapi_ticket')
  }

  async renew (access_token) {
    const result = await request({
      uri: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
      qs: {
        type: 'jsapi',
        access_token
      },
      json: true
    })

    if (result.ticket) {
      this.content = result.ticket

      await this.save()
      return this.content
    } else throw new Error(result.errmsg)
  }

  sign (jsapi_ticket, url) {
    const signedPackage = {
      appId: config.appID,
      nonceStr: randomString(16),
      timestamp: timestamp()
    }

    // 签名时忽略hash部分
    if (url.indexOf('#') !== -1) {
      url = url.slice(0, url.indexOf('#'))
    }

    const query = qs.unescape(qs.stringify({
      jsapi_ticket,
      noncestr: signedPackage.nonceStr,
      timestamp: signedPackage.timestamp,
      url
    }))

    signedPackage.signature = sha1(query)
    signedPackage.rawString = query

    return signedPackage
  }
}

module.exports = JsapiTicket
