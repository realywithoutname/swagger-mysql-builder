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
  let db = knex({...})
  smb(swdd(), db)
  swdd.autoRoute(router)
  ...
~~~
> `decorator-doc` is a swagger generate, you can get it from [here](https://github.com/realywithoutname/decorator-doc)
### api
- builder(Object: swaggerJSON, Object: db)
  - swaggerJSON `required` general swagger.json.
  - db `required` knex instance.
