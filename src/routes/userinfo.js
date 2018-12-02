'use strict'

const jwt = require('koa-jwt')
const config = require('../config')
const Router = require('koa-router')
const WechatUser = require('../models/wechat-user')

const router = new Router()

// 获取已登录用户的用户信息
router.get('userinfo', jwt({ secret: config.secret }))
router.get('userinfo', async (ctx, next) => {
  ctx.result = await WechatUser.findById(ctx.state.user && ctx.state.user.sub)
  return next()
})

module.exports = router
