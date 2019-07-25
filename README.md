# Macropress Router

[Express](http://expressjs.com/) Router inspired by ZEIT's [Micro](https://github.com/zeit/micro) controllers style.

## Why?

If you're using express to build a JSON API while using `async/await` syntax, then dealing with express callback style will force you to add some boilerplate code in each controller.

```js
const myController = async (req, res, next) => {
  try {
    data = await some_code()
    return res.status(200).json(data)
  } catch (err) {
    return next(err)
  }
}

expressRouter.get('/', myController)
```

## What does `macropress-router` do?

It's a bit opinionated implementation inspired by zeit's micro that allows you to get rid of the boilerplate code. So you can do the same functionality with less code.

```js
const myController = async (req, res) => {
  data = await some_code()
  return data
}

macropressRouter.get('/', myController)
```

### Behaviour

Macropress overrides express router methods to automatically wrap async controllers with the boilerplate code so you don't have to do it manually
- If the controller returns a JSON serializable object it will call `res.json` on the return with a default status code 200
- If the controller returned `undefined` or `null`, it will respond with statuc code 204
- If the controller failed with any error, it will pass it to next
- If the controller already handled its logic by calling `res.send` or `next`, it will respect the controller and do nothing

### Overriden methods

```js
[
  'checkout', 'copy', 'delete', 'get', 'head', 'lock', 'merge', 'mkactivity',
  'mkcol', 'move', 'm-search', 'notify', 'options', 'patch', 'post', 'purge',
  'put', 'report', 'search', 'subscribe', 'trace', 'unlock', 'unsubscribe'
]
```

If for some reason you need to use the original methods they're accessible using `${methodName}Sync` (ex: `getSync`)

## Example

```js
const MacropressRouter = require('macropress-router')
const express = require('express')

const app = express()
const router = new MacropressRouter()

const myController = async (req, res) => {
  const data = { hello: 'world' }
  return data
}

router.get('/', myController)

app.use(router)

app.listen()
```
