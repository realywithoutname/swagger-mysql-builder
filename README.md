### A tool to build mysql schema by knex.js with swagger.json.

## start
~~~
  npm i swagger-mysql-builder --save
~~~

### use
The demo can be find [here](https://github.com/realywithoutname/decorator-doc/tree/develop/example/express).
~~~ javascript
  ...
  let swdd = require('decorator-doc')
  let smb = require('swagger-mysql-builder')
  let db = smb(swdd())
  // or
  app.use(smb(swdd(), true))
  swdd.autoRoute(router)
  ...
~~~
> `decorator-doc` is a swagger generate, you can get it from [here](https://github.com/realywithoutname/decorator-doc)
### api
- builder(Object: swaggerJSON, Boolean: asMiddleware)
  - swaggerJSON `required` general swagger.json.
  - asMiddleware `optional` return will used to middleware. if `true`, return a function. otherwise return a knex instance.

> koa 1.x can't use as middleware, so `asMiddleware` argument is invalid.

The builder will get database  configure use [config](https://github.com/lorenwest/node-config). like
~~~ javascript
  let client = config.get('database')
~~~