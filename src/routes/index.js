'use strict'

const fs = require('fs')
const Router = require('koa-router')

const router = new Router()

// 读取所有路由（除了index.js），并注册这些路由
const routes = fs.readdirSync(__dirname).filter(route => route !== 'index.js')
for (const route of routes) {
  if (route.toLowerCase().endsWith('.js')) {
    const externalRouter = require(`./${route}`)
    if (externalRouter instanceof Router) {
      router.use(externalRouter.routes())
    }
  }
}

module.exports = router
