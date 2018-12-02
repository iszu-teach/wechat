'use strict'

const url = require('url')
const config = require('../config')
const Router = require('koa-router')
const { ForbiddenError } = require('../lib/errors')
const { getTokens, jsapiTicket } = require('../lib/wechat')

const router = new Router()

// 获取用于微信 jsapi 初始化的 signedPackage
router.get('jsapi', async (ctx, next) => {
  if (url.parse(ctx.query.url).hostname.endsWith('iszu.cn')) {
    const [, ticket] = await getTokens()
    ctx.result = jsapiTicket.sign(ticket, ctx.query.url)

    ctx.result.appId = config.appID
    ctx.result.rawString = undefined

    return next()
  } else throw new ForbiddenError()
})

module.exports = router
