'use strict'

const fs = require('mz/fs')
const path = require('path')
const config = require('../../config')
const { timestamp } = require('../util')

class Token {
  constructor (name) {
    this.name = name
  }

  cacheFile () {
    return path.join(config.wechatTokenCache, this.name + '.json')
  }

  read () {
    return fs.readFile(this.cacheFile(), 'utf8').then(data => {
      const token = JSON.parse(data)
      if (timestamp() <= token.expire_time) {
        this.content = token[this.name]
        return this.content
      } else return null
    }).catch(() => null)
  }

  save () {
    return fs.writeFile(this.cacheFile(), JSON.stringify({
      [this.name]: this.content,
      expire_time: timestamp() + 7100
    }), { encoding: 'utf8' })
  }
}

module.exports = Token
