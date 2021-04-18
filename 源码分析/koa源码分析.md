
koa源码分析
===


koa对外暴露的API很少，也很便于我们理解
```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```

## Application类
从`package.json`的`main`字段开始，找到整个库的入口文件`lib/application.js`

```js
// lib/application.js
module.exports = class Application extends Emitter {
    constructor(options) {
        super();
        options = options || {};
        // ...初始化相关参数
        this.middleware = [];
        this.context = Object.create(context);
        this.request = Object.create(request); // request包含header、url、method等多个接口
        this.response = Object.create(response);// response包含status、headers等接口
    }
    use(fn) {
        // 检测fn是不是合格的中间件
        this.middleware.push(fn);
        return this;
    }
    // 通过createServer启动一个node服务
    listen(...args) {
        const server = http.createServer(this.callback());
        return server.listen(...args);
    }
   
}
```

忽略大部分代码之后，可以看见整个koa源码是非常精简的，主要就提供了一个`Application`类，每个app实例对象暴露了`use`和`listen`两个方法。此外由于继承了`Emitter`类，app实例也可以使用诸如`on`、`emit`等事件通信方法。

接下来看看传入`http.createServer`中`this.callback`的逻辑

## 中间件
```js
class Application extends Emitter {
    // ...
    callback() {
        // 组合中间件
        const fn = compose(this.middleware);
        if (!this.listenerCount('error')) this.on('error', this.onerror);
        const handleRequest = (req, res) => {
            // `createContext`封装了`http.createServer`中的`request`和`response`对象，并将其挂载到了context上，
            // 这也是我们为什么能拿到`ctx.request`和`ctx.response`的原因
            const ctx = this.createContext(req, res);
            return this.handleRequest(ctx, fn);
        };
        return handleRequest;
    }
    // 辅助函数
    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res;
        res.statusCode = 404;
        const onerror = err => ctx.onerror(err);
        // respond实际上是封装了的响应处理函数，在内部调用ctx.resoponse.end(ctx.body)的方式将数据返回给浏览器
        const handleResponse = () => respond(ctx);
        onFinished(res, onerror);
        // 开始执行组合后的中间件函数
        return fnMiddleware(ctx).then(handleResponse).catch(onerror);
    }
}
```
可见，整个流程大致为
* 通过`compose(this.middleware)`组合了整个中间件链，返回`fnMiddleware`
* 接收到请求时，会调用`handleRequest`，
    * 首先调用`createContext`封装本次请求context，
    * 然后调用`this.handleRequest(ctx, fnMiddleware)`处理本次请求
* 处理本次请求的具体逻辑在 `fnMiddleware(ctx).then(handleResponse).catch(onerror)`中

因此我们目前只需要弄明白`compose`中组合中间件的方式，就能大致了解整个koa的工作方式了。

compse是引入的[`koa-compose`](https://github.com/koajs/compose/blob/master/index.js)，其实现大致如下

```js
function compose(middleware) {
    // ...检查中间件的类型：middleware列表必须为数组，每个中间件必须为函数
    
    // 返回的就是上面的fnMiddleware，执行fnMiddleware后返回的实际上是一个promise对象
    return function (context, next) {
        let index = -1
        return dispatch(0)
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            // 如果middleware列表已经调用完毕，如果传入了额外的next，则下一次会调用next方法，
            // 可以看见在上面的fnMiddleware中此处并没有传值
            if (i === middleware.length) fn = next
            // 如果无fn了，则表示中间件已经从第一个依次执行到最后一个中间件了
            if (!fn) return Promise.resolve()
            try {
                // 把ctx和next传入到中间件中，可以看见我们在中间件中调用的next实际上就是dispatch.bind(null, i + 1))
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}
```
从上面的代码中我们可以看见，每个中间件的格式为
```js
function mid(ctx, next){}
// next被包装成dispatch.bind(null, i + 1))的性能
```
在中间件逻辑中，需要手动调用`next`才会执行下一个中间件；此外每个dispatch返回的实际上是一个promise，因此如果希望实现**洋葱模型**的中间件调用顺序，就必须等待dispatch执行完毕才行
```js
async function mid(ctx, next){
    await next() // 必须在此处暂停等待下一个中间件执行完毕，否则中间件执行顺序就会发生错乱
}
```


## koa-router
简单实用
```js
const router = new Router()
router.get("/", (ctx,next)=>{})
router.get("/index", (ctx,next)=>{})

app.use(router.routes()).use(router.allowedMethods())
```
我们从`package.json`中`main`字段找到入口文件
```js
function Router(opts) {
  if (!(this instanceof Router)) {
    return new Router(opts);
  }
  this.opts = opts || {};
  this.methods = this.opts.methods || [
    'HEAD',
    'OPTIONS',
    'GET',
    'PUT',
    'PATCH',
    'POST',
    'DELETE'
  ];

  this.params = {};
  this.stack = [];
}
// methods包含['get'、'post']等多种http请求方法，在此处实现快速注册
methods.forEach(function (method) {
  Router.prototype[method] = function (name, path, middleware) {
    var middleware;
    // 收集该路由的中间件
    if (typeof path === 'string' || path instanceof RegExp) {
      middleware = Array.prototype.slice.call(arguments, 2);
    } else {
      middleware = Array.prototype.slice.call(arguments, 1);
      path = name;
      name = null;
    }   
    // 统一调用`register`方法
    this.register(path, [method], middleware, {
      name: name
    });
    return this;
  };
});
```
然后看看`this.register`方法的实现
```js
Router.prototype.register = function (path, methods, middleware, opts) {
  opts = opts || {};

  var router = this;
  var stack = this.stack;
  // ...支持数组类型的path

  // 生成一个Route对象，route包含一些特定的方法，方便通过req.url匹配到实际的Route对象
  var route = new Layer(path, methods, middleware, {
    end: opts.end === false ? opts.end : true,
    name: opts.name,
    sensitive: opts.sensitive || this.opts.sensitive || false,
    strict: opts.strict || this.opts.strict || false,
    prefix: opts.prefix || this.opts.prefix || "",
    ignoreCaptures: opts.ignoreCaptures
  });

  if (this.opts.prefix) {
    route.setPrefix(this.opts.prefix);
  }

  // add parameter middleware
  Object.keys(this.params).forEach(function (param) {
    route.param(param, this.params[param]);
  }, this);

  // 将route对象保存起来
  stack.push(route);

  return route;
};

```

`Router.prototype.routes`
```js
Router.prototype.routes = Router.prototype.middleware = function () {
  var router = this;

  var dispatch = function dispatch(ctx, next) {
    // 通过闭包维持对于router的引用
    var path = router.opts.routerPath || ctx.routerPath || ctx.path;
    var matched = router.match(path, ctx.method); // 找到匹配的route对象
    var layerChain, layer, i;

    if (ctx.matched) {
      ctx.matched.push.apply(ctx.matched, matched.path);
    } else {
      ctx.matched = matched.path;
    }

    ctx.router = router;

    if (!matched.route) return next();

    var matchedLayers = matched.pathAndMethod
    var mostSpecificLayer = matchedLayers[matchedLayers.length - 1]
    ctx._matchedRoute = mostSpecificLayer.path;
    if (mostSpecificLayer.name) {
      ctx._matchedRouteName = mostSpecificLayer.name;
    }
    // 插入一些系列中间件
    layerChain = matchedLayers.reduce(function(memo, layer) {
      memo.push(function(ctx, next) {
        ctx.captures = layer.captures(path, ctx.captures);
        ctx.params = layer.params(path, ctx.captures, ctx.params);
        ctx.routerName = layer.name;
        return next();
      });
      return memo.concat(layer.stack);
    }, []);
    // 这里同样调用了koa-compose
    return compose(layerChain)(ctx, next);
  };

  dispatch.router = this;
  // 然后中间件
  return dispatch;
};

```
`Router.prototype.allowedMethods`
```js
Router.prototype.allowedMethods = function (options) {
  options = options || {};
  var implemented = this.methods;

  return function allowedMethods(ctx, next) {
    return next().then(function() {
      var allowed = {};

      if (!ctx.status || ctx.status === 404) {
        ctx.matched.forEach(function (route) {
          route.methods.forEach(function (method) {
            allowed[method] = method;
          });
        });

        var allowedArr = Object.keys(allowed);

        if (!~implemented.indexOf(ctx.method)) {
          if (options.throw) {
            var notImplementedThrowable;
            if (typeof options.notImplemented === 'function') {
              notImplementedThrowable = options.notImplemented(); // set whatever the user returns from their function
            } else {
              notImplementedThrowable = new HttpError.NotImplemented();
            }
            throw notImplementedThrowable;
          } else {
            ctx.status = 501;
            ctx.set('Allow', allowedArr.join(', '));
          }
        } else if (allowedArr.length) {
          if (ctx.method === 'OPTIONS') {
            ctx.status = 200;
            ctx.body = '';
            ctx.set('Allow', allowedArr.join(', '));
          } else if (!allowed[ctx.method]) {
            if (options.throw) {
              var notAllowedThrowable;
              if (typeof options.methodNotAllowed === 'function') {
                notAllowedThrowable = options.methodNotAllowed(); // set whatever the user returns from their function
              } else {
                notAllowedThrowable = new HttpError.MethodNotAllowed();
              }
              throw notAllowedThrowable;
            } else {
              ctx.status = 405;
              ctx.set('Allow', allowedArr.join(', '));
            }
          }
        }
      }
    });
  };
};
```