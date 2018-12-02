'use strict'

class CodedError extends Error {
  constructor (message, code = -1) {
    super(message)
    this.code = code
  }
}

module.exports = {
  /**
   * 带有错误代码的错误类
   */
  CodedError,
  /**
   * 拒绝访问 (1)
   */
  ForbiddenError: class ForbiddenError extends CodedError {
    constructor (message) {
      super('Forbidden', 1)
    }
  },
  /**
   * 无效的用户输入 (2)
   */
  InvalidUserInputError: class InvalidUserInputError extends CodedError {
    constructor (message) {
      super(message, 2)
    }
  }
}
