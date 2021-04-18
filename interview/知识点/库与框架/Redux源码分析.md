
redux源码分析
===

## redux
redux本身只提供了几个接口
* `createStore`，接收`reducer`并创建一个store仓库
* `store.dispatch`，提交`action`
* `store.getState`，获取当前的`state`

```js
const [ADD, MINUS] = [1, 2];
let reducer = function(currentState, action) {
    let newState = Object.assign({}, currentState);

    const {type, payload} = action
    switch (type) {
        case ADD:
            newState.count += payload;
            return newState;
        case MINUS:
            ADD;
            newState.count -= payload;
            return newState;
        default:
            return currentState;
            break;
    }
};
let initState = {
    count: 0
};
let store = Redux.createStore(reducer, initState);

store.subscribe(() => {
    console.log("stateChange", store.getState());
});

addBtn.onclick = function() {
    store.dispatch({ type: ADD, payload: 10 });
};
minusBtn.onclick = function() {
    store.dispatch({ type: MINUS, payload: 3 });
};
```
数据是单向流动的
```
getState()->初始化视图->用户交互触发事件->dispatch提交action
->reducer根据action更新state->通知`subscribe`订阅者更新->getState获取最新的state
```
### createStore
大致就是一个发布订阅模型：在dispatch时执行注册的reducer函数，然后通知在`subscribe`注册的回调函数

```js
// preloadedState 表示当前的state
// enhancer表示扩展createStore
export default function createStore(reducer, preloadedState, enhancer) {
  // 进行了一些参数类型的检测 处理preloadedState和enhancer

  // 通过闭包维护下面的变量
  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false

  if (typeof enhancer == 'function') {
    // enhancer可以是Redux.applyMiddleware()等方法返回的增强版createStore
    return enhancer(createStore)(reducer, preloadedState)
  }

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  // 返回当前state
  function getState() {
    if (isDispatching) {
      throw new Error()
    }

    return currentState
  }

  function subscribe(listener) {
    if (isDispatching) {
      throw new Error()
    }

    let isSubscribed = true

    ensureCanMutateNextListeners()
    nextListeners.push(listener)
    
    // 返回一个取消订阅的方法
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      nextListeners.splice(index, 1)
      currentListeners = null
    }
  }

  // 提交action，这是修改state的唯一方法
  function dispatch(action) {
    // 类型检测保证action是一个携带type属性的对象
    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      // 调用reducer，并传入currentState和action
      currentState = currentReducer(currentState, action)
    } finally {
      isDispatching = false
    }
    // 通知订阅者执行回调
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  // 修改reducer，一般情况下较少用到
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    currentReducer = nextReducer
    dispatch({ type: ActionTypes.REPLACE })
  }

  // react observable
  function observable() {
    const outerSubscribe = subscribe
    return {
      subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

 
  dispatch({ type: ActionTypes.INIT })
	// 返回store的一些方法
  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}

```

当需要处理的action过多时，reducer就会非常庞大，可以通过`combineReducers`将多个reducer合并成一个

### combineReducers
```js
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  // 获取有效的reducer
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)
  let unexpectedKeyCache
  let shapeAssertionError
  try {
    // 为每个reducer执行，reducer(undefined, { type: ActionTypes.INIT })判断默认返回state是否为空，如果未空则抛出异常
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }
    
    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      // 至少需要有一个reducer中返回一个全新的state
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }
    // 当state上某个key被删除时也视为改变
    hasChanged =
      hasChanged || finalReducerKeys.length !== Object.keys(state).length
    // 只有改变时才返回新的全局State，如果所有reducer都未返回新的state，且全局state上的属性未被删除，则返回旧state
    return hasChanged ? nextState : state
  }
}
```

可以看见传入`combineReducers`的对象是一个`<key, reducer`的Map结构，且初始化的全局state与该对象包含相同的`key`值

```js
let initState = {
    base: {
        count: 0
    },
    user: {
        name: "shymean"
    }
};
// 每个reducer需要返回默认的state，即调用reducer(undefined, { type: ActionTypes.INIT })时和reducer(undefined, {type: ActionTypes.PROBE_UNKNOWN_ACTION()}不能返回undefined
let baseReducer = function(currentState = {}, action) {}
let userReducer = function(currentState = {}, action) {}

let reducer = Redux.combineReducers({
    base: baseReducer, // 与initState包含相同的键名
    user: userReducer
});
```

### bindActionCreators

action是diaptch与reducer约定的一个参数对象，必须包含type属性，一种常见的开发方式是通过工厂函数返回特定`type`的action，这种函数被称为`ActionCreators`
```js
// 返回一个类型为ADD_TODO的action
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  };
}
// 使用
let action = addTodo('eat')
dispatch(action)
```
action总是与`dispatch`紧密相连的，因此可以把他们封装在一个函数内
```js
function bindActionCreator(actionCreator, dispatch) {
  return function() {
    // 首先调用actionCreator创建一个action，然后调用dispatch提交action
    return dispatch(actionCreator.apply(this, arguments))
  }
}
```
`Redux.bindActionCreators`可以接收一个对象并返回`bindActionCreator`封装后的新对象，新对象上的每个属性都可以看做是提交特定action的方法

```js
let boundActionCreators = bindActionCreators({addTodo}, dispatch)
// 这样完成封装，其他地方完全不需知道dispatch，且action更方便定义，避免字面量对象可维护性较差的问题
boundActionCreators.addTodo('eat)
```

源码内部只是遍历了一下配置参数，依次调用`bindActionCreator`
```js
export default function bindActionCreators(actionCreators, dispatch) {
  // 单个时直接返回一个方法
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch)
  }

  const boundActionCreators = {}
  // 传入的为{addTodo}类似的对象时，会依次调用bindActionCreator并将返回值挂载到boundActionCreators，最后统一返回
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key]
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
    }
  }
  return boundActionCreators
}
```

### applyMiddleware
可以通过中间件来扩展redux，完成特性功能，下面是一个日志中间件的实现
```js
function logger({ getState, dispatch }) {
    // next代表下一个中间件，action表示当前接收到的动作
    return next => action => {
        console.log("before change", action);
        // 调用 middleware 链中下一个 middleware 的 dispatch。
        let val = next(action);
        console.log("after change", getState(), val);
        return val;
    };
}

let createStoreWithMiddleware = Redux.applyMiddleware(logger)(Redux.createStore)
// 可以把中间件看做是增强版的createStore
let store = createStoreWithMiddleware(reducer, initState);
// 也可以使用createStore第三个参数enhancer
// let store = Redux.createStore(reducer,initState,Redux.applyMiddleware(logger));
```
可见看见中间件的一些特征
* 中间件接收参数包括`getState`和`dispatch`
* 中间件返回的是一个函数，该函数接收下一个中间件next作为参数，并返回一个接收action的新的dispatch方法
* 只有手动调用`next(action)`才会执行下一个中间件

简而言之，一个最基本的中间件应该是下面这个样子的，通过柯里化的方式定义中间件
```js
const pureMiddleware = ({dispatch, getState}) => next => action => next(action)
```

柯里化是函数式编程里面的一个概念，其功能是把多个参数的函数编程一个接收单一参数的函数，并返回一个接收余下参数的新函数
```js
// 普通实现
const add = (a, b) => a + b

// 柯里化实现
const add = (a) => (b) => a + b
const add10 = add(10) // 一个可以复用的add(10)函数
add10(20) // 30
add10(30) // 30
const add100 = add(100) // 依次类推，可以生成高度复用的新函数
```

此外需要了解`compose`的概念，`compose`是函数式编程里面的**组合**，其功能是将多个单功能的函数合并为一个函数
```js
 // 组合函数, 如compose(f, g, h)会返回 (...args) => f(g(h(...args)))
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }
  // 返回的是一个组合后的函数
  // 调用时，funcs列表中的方法，从后向前依次调用，并将上一个方法的返回值作为作为下一个方法的参数
 
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```
以下面为例
```js
var funcs = [
    (a)=>{
        console.log(a)
        return a+1
    },
    (b)=>{
        console.log(b)
        return b+2
    }
]
var res = compose(...funcs)
console.log(res(1)) // 1,3,4
```

现在来看`applyMiddleware`的源码，这里的代码十分精彩，短短几行就实现了一个完整的中间件系统
```js
export default function applyMiddleware(...middlewares) {
  // 返回的是一个接收createStore参数的闭包，中间件通过middlewares参数列表维护
  return createStore => (...args) => {
    // 创建原始的store
    const store = createStore(...args)

    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    // 每个中间件都包含统一参数：getState和dispatch
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args) // 这里使用闭包，让每个中间件维持对组合dispatch的引用
    }
    // 初始化store时，中间件按参数顺序依次调用，每个中间件返回的是 next => action => next(action) 统一格式
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // compose(...chain)返回的是一个组合的 next => action => next(action) 方法
    // compose(...chain)(store.dispatch)会将store.dispatch作为最后一个next中间件传入，返回一个组合后的dispatch
    dispatch = compose(...chain)(store.dispatch)
    // compose是按照从右向左的顺序支持函数列表，因此当在视图中调用dispatch(action)时，只有在最后一个中间件中调用next(action)才会触发真实的store.dispatch(action)
    // 在此之前state未更新，在此之后state已更新，最后一个中间件执行完毕，控制权返回上一个中间件的next后面部分，依次退出调用栈
    // 如果前面某个中间件未调用next，则后面所有的中间件都不会执行
    return {
      ...store,
      dispatch  // 返回一个增强了dispatch的store
    }
  }
}
```
集合中间件的格式，我们可以了解到

* `chain`中保存的都是`next => action => {next(action)}`的方法
* 通过`compose`返回了一个组合函数，将`store.dispatch`作为参数传递给组合函数，组合函数执行时会逆序调用chain中的方法，并将上一个方法的返回值作为作为下一个方法
* 这里的上一个方法就是`action => {next(action)}`，跟原始的`store.dispatch`结构一致，因此组合函数最后的返回值可以理解为是经过组合函数包装后的`dispatch`

所以根据源码，则中间件的执行顺序应该是

```
正常同步调用next，在dispatch前执行next前面的代码部分，在dispatch后执行next后面的部分
mid1 before next -> mid2 before next -> mid3 before next-> dispatch -> mid3 after next -> mid2 after next -> mid1 after next

正常同步调用，如果在mid2中未调用next，则
mid1 before next -> mid2 full -> mid1 after next

如果在mid2中是异步调用next，则
mid1 before nex -> mid2 full sync -> mid1 after next -> mid2 async before next -> mid3 before next -> dispatch -> mid3 after next -> mid2 async after next
```

此外需要注意的是，在中间件的执行中，不能手动调用传入的组合`dispatch`，而应该通过next调用下一个中间件，否则会出现死循环。

## redux-thunk
如果需要提交异步的动作，并在异步任务完成后在更新state时，可以使用`redux-thunk`中间件，
```js
let store = Redux.createStore(reducer,initState,Redux.applyMiddleware(logger, logger2, thunk));
function asycnAction(dispatch, getState, extra){
    setTimeout(() => {
        dispatch({
            type: UPDATE,
            payload: Math.random().toString()
        });
    }, 100);
}
store.dispatch(asycnAction);
```

下面是`redux-thunk`的源码，其概念和实现都很简单，主要是支持了函数类型的`action`，并传入dispatch让用户在action的逻辑中手动调用
```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // 如果收到的是一个action，就将middlewareAPI上的dispatch传给action，在action中由用户自行调用dispatch一个同步的action
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }
    // 如果是函数类型的action，则不会进入下一个中间件，避免死循环，因此使用thunk中间件的顺序也很重要
    // 对于某个中间件而言，如果监听所有的action，在applyMiddleware时则应该放在thunk前面；如果只想监听常规的非函数action，则应该放在thunk后面
    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware; // 暴露createThunkMiddleware 方法，允许用户为每个actino传入额外参数
```

## redux-saga
[Redux-Saga](https://redux-saga-in-chinese.js.org/)使用了 ES6 的 Generator 功能，让redux中异步流程更易于读取，写入和测试

基础使用
```js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

const Api = {
    async fetchUser() {
        return { name: 'xxx', age: 10 }
    }
}

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
    try {
        const user = yield call(Api.fetchUser, action.payload.userId);
        yield put({ type: "USER_FETCH_SUCCEEDED", user: user });
    } catch (e) {
        yield put({ type: "USER_FETCH_FAILED", message: e.message });
    }
}

function* mySaga() {
    // 允许每一个异步的dispatch访问，则使用takeEvery
    // yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
    // 如果只希望最后一个请求成功发送，则使用takeLatest
    yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
}

let reducre = function (state, action) {
    switch (action.type) {
        case 'USER_FETCH_SUCCEEDED':
            return { user: action.user }
    }
    return { user: null }
}

const sagaMiddleware = createSagaMiddleware()

let store = createStore(reducre, applyMiddleware(sagaMiddleware))
store.subscribe(() => {
    console.log('subscribe:', store.getState())
})

sagaMiddleware.run(mySaga)

for (var i = 0; i < 4; ++i) {
    getUserInfo() // 上面使用了takeLatest，只有最后一次请求会触发`USER_FETCH_SUCCEEDED`
}

function getUserInfo() {
    store.dispatch({
        type: 'USER_FETCH_REQUESTED',
        payload: {
            userId: 10
        }
    })
}
```

// todo 源码分析