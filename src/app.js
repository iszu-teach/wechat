'use strict'

const Koa = require('koa')
const config = require('./config')
const rewrite = require('koa-rewrite')
const bodyParser = require('koa-bodyparser')
const { loggerMiddleware } = require('./lib/logger')
const { responseHandler, errorHandler } = require('./lib/response')

const app = new Koa()
const router = require('./routes')

// 先require一次db来连接数据库
require('./lib/db')

app.use(loggerMiddleware)
app.use(errorHandler)
app.use(bodyParser())
app.use(rewrite(`/${config.base}/*`, '/$1'))
app.use(router.routes())
app.use(responseHandler)

module.exports = app
