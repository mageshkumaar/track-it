const logger = require('../../../shared/logger')
const i18n = require('i18n')
const config = require('../../../config/config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const unAuthorizedUrls = [
  '/login',
  '/register'
]

const authMiddleware = async (req, res, next) => {
  try {
    let token = getTokenFromRequest(req)
    const isUnAuthorizedUrl = unAuthorizedUrls.includes(req.url)
    // If the token it not available and the url is an unauthorized
    // url, we can skip the check
    if (token === undefined) {
      if (isUnAuthorizedUrl) {
        next()
        clearCurrentUser(req)
        return
      } else {
        throw new Error(`Token not available for the request - ${req.url}`)
      }
    }
    // Get the user from the token
    let currentUser = await getUserFromToken(token)
    if (currentUser === undefined) {
      throw new Error('Invalid Token')
    } else {
      // Check whether the user is trying to access unauthorized url
      // while having a valid token. If found to be true, redirect
      if (isUnAuthorizedUrl) {
        return res.status(302).send({
          message: i18n.__('user.already.loggedin')
        })
      } else {
        req.currentUser = currentUser
        next()
        clearCurrentUser(req)
        return
      }
    }
  } catch (e) {
    logger.error(e.stack)
    return res.status(401).send({
      error: i18n.__('user.auth.failed')
    })
  }
}

/**
 * Checks the authorization header of the request and returns the
 * token. If token is not avilable, or any unexpected stuff
 * happens, `undefined` is returned.
 *
 * @param {Request} req
 */
const getTokenFromRequest = (req) => {
  let token
  try {
    if (req.headers.authorization && req.headers.authorization.trim().length > 0) {
      let headerValue = req.headers.authorization.split(' ')
      if (headerValue[0] === 'Bearer') {
        token = headerValue[1]
      }
    }
  } catch (e) {
    logger.error(e.stack)
    token = undefined
  }
  return token
}

/**
 * Parses the token using jwt and validated whether the
 * obtained token is a valid token by comparing the
 * token with the available tokens in the database
 * and returns a user
 *
 * @param {String} token to be parsed
 */
const getUserFromToken = async (token) => {
  let user
  try {
    const payload = jwt.verify(token, config.jwt.secret_key, config.jwt.options)
    const userByToken = await User.findById(payload.id)
    if (!userByToken.token.includes(token)) {
      throw new Error('Token not available in the user')
    }
    user = userByToken.toJSON()
  } catch (e) {
    logger.error(e.stack)
    user = undefined
  }
  return user
}

/**
 * Clears a custom property from the request object
 * that will be set when the authenticated user
 * request arrives
 *
 * @param {Request} req current http request
 */
const clearCurrentUser = (req) => {
  if (req.currentUser) {
    delete req.currentUser
  }
}
module.exports = authMiddleware
