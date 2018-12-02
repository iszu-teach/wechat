'use strict'

const db = require('../lib/db').default
const { Schema } = require('mongoose')

const schema = new Schema({
  _id: String,
  openid: String,
  nickname: String,
  sex: Number,
  province: String,
  city: String,
  country: String,
  headimgurl: String
})

// 默认将 openid 作为 _id
schema.pre('save', function (next) {
  if (this._id == null) {
    this.set('_id', this.openid)
  }

  return next()
})

schema.set('toJSON', { versionKey: false })
schema.set('toObject', { versionKey: false })
module.exports = db.model('User', schema)
