'use strict'

const AccessToken = require('./access-token')
const JsapiTicket = require('./jsapi-ticket')

const accessToken = new AccessToken()
const jsapiTicket = new JsapiTicket()

function getToken (token, ...args) {
  return token.read().then(result => {
    if (result) return result
    else return token.renew(...args)
  })
}

function getTokens () {
  return getToken(accessToken).then(accessToken => {
    return Promise.all([accessToken, getToken(jsapiTicket, accessToken)])
  })
}

module.exports = {
  getTokens,
  accessToken,
  jsapiTicket
}
