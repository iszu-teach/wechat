'use strict'

const qs = require('querystring')
const jwt = require('jsonwebtoken')
const config = require('../config')
const Router = require('koa-router')
const extract = require('url-querystring')
const request = require('request-promise')
const WechatUser = require('../models/wechat-user')

/**
 * 生成微信 OAuth 的 URL
 *
 * @param {String} redirectURL OAuth 成功后要重定向的位置
 * @param {String} state 下一个状态
 * @param {Boolean} userInfo 是否要获取用户完整信息
 * @returns
 */
function generateCodeURL(redirectURL, state, userInfo = false) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
  const q = {
    appid: config.appID,
    redirect_uri: redirectURL,
    response_type: 'code',
    scope: userInfo ? 'snsapi_userinfo' : 'snsapi_base',
    state
  }
  return url + qs.stringify(q) + '#wechat_redirect'
}

/**
 * 获取用于读取用户信息的 access_token
 *
 * @param {String} code 从 OAuth 中获取的登录成功码
 * @returns {Promise<Object>}
 */
function getAccessToken (code) {
  return request({
    uri: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    qs: {
      appid: config.appID,
      secret: config.appSecret,
      code: code,
      grant_type: 'authorization_code'
    },
    json: true
  })
}

/**
 * 读取用户信息
 *
 * @param {String} access_token
 * @param {String} openid 要读取的用户的 openid
 * @returns {Promise<Object>}
 */
function getUserInfo (access_token, openid) {
  return request({
    uri: 'https://api.weixin.qq.com/sns/userinfo',
    qs: {
      access_token,
      openid,
      lang: 'zh_CN'
    },
    json: true
  })
}

/**
 * 将使用`url-querystring`转换的 url 对象重新装换为 url
 *
 * @param {Object} extracted
 * @returns {String}
 */
function stringify (extracted) {
  return extracted.url + '?' + qs.stringify(extracted.qs)
}

const router = new Router()

/**
 * 微信登录
 *
 * 一次微信登录分为下面几个步骤：
 * 1. 访问 `/login`, 此时将会跳转到微信的 OAuth, 并将状态设为 `checkUser`
 * 2. 微信返回 `/login?code=...`, 此时得到一个可以获取用户 `openid` 的 `code`
 * 3. 检查数据库, 是否已保存此用户的信息
 *    1. 如果不存在, 则再次跳转到微信的 OAuth, 并将状态设为 `getUserInfo`
 *    2. 如果存在, 将登录 `token` 传给前端, 结束
 * 4. 微信再次返回一个 `code`, 这次返回的 `code` 可以用来获取用户信息
 * 5. 获取用户信息并写入数据库, 将登录 `token` 传给前端, 结束
 */
router.get('/login', async (ctx, next) => {
  const { code, state, redirect } = ctx.query
  let user

  if (!code) {
    // 1
    return ctx.redirect(generateCodeURL(config.root + ctx.originalUrl, 'checkUser'))
  } else {
    if (state === 'checkUser' || state === 'getUserInfo') {
      const accessToken = await getAccessToken(code)
      if (!accessToken.errcode) {
        if (state === 'checkUser') {
          // 2, 3.1
          if (ctx.query.openid == null) {
            const redirectData = extract(config.root + ctx.originalUrl)
            delete redirectData.qs.code
            delete redirectData.qs.state
            return ctx.redirect(generateCodeURL(stringify(redirectData), 'getUserInfo', true))
          } else {
            // 如果在 querystring 存在 openid 这一项，则跳过用户信息获取阶段
            user = { _id: accessToken.openid }
          }
        } else {
          // 4
          const userInfo = await getUserInfo(accessToken.access_token, accessToken.openid)
          if (!userInfo.errcode) {
            // 5
            await WechatUser.findByIdAndUpdate(accessToken.openid, userInfo, { upsert: true })
            user = { _id: accessToken.openid }
          } else throw new Error(userInfo.errmsg)
        }
      } else throw new Error(accessToken.errmsg)
    }
  }

  // 将登录 `token` 传给前端
  if (user != null) {
    const token = jwt.sign({ sub: user._id }, config.secret, { expiresIn: '30 minutes' })
    if (redirect) {
      // 若有给定的重定向位置, 重定向到这个位置
      // 并在 querystring 中添加 `token` 这一项
      const redirectData = extract(redirect)
      redirectData.qs.token = token
      ctx.redirect(stringify(redirectData))
    } else {
      // 否则通过 JSON 返回
      ctx.result = token
    }
  }

  return next()
})

module.exports = router
