const { Router } = require('express')

const wrapAsyncCallback = (callback) => {
  return async (req, res, next) => {
    try {
      let nextCalled = false
      const wrappedNext = (...args) => { nextCalled = true; return next(...args) }
      const retPromise = callback(req, res, wrappedNext)
      if (res.headersSent || !retPromise || typeof retPromise.then !== 'function') return
      const ret = await retPromise
      if (nextCalled) return
      if (ret === null || ret === undefined) return res.status(204).send()
      return res.status(res.statusCode || 200).json(ret)
    } catch (err) {
      next(err)
    }
  }
}

const wrap = (callback) => {
  if (callback instanceof Array) return callback.map(wrap)
  return wrapAsyncCallback(callback)
}

const METHODS = [
  'checkout', 'copy', 'delete', 'get', 'head', 'lock', 'merge', 'mkactivity',
  'mkcol', 'move', 'm-search', 'notify', 'options', 'patch', 'post', 'purge',
  'put', 'report', 'search', 'subscribe', 'trace', 'unlock', 'unsubscribe'
]

const AsyncRouter = function (...args) {
  const router = new Router(...args)

  for (const method of METHODS) {
    router[method + 'Sync'] = router[method]
    router[method] = (path, ...callbacks) => {
      return router[method + 'Sync'](path, wrap(callbacks))
    }
  }
  return router
}

module.exports = AsyncRouter
