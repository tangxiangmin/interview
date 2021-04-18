Dva源码分析
===

[dva](https://dvajs.com/guide/)是一个将React、React-Router、Redux、Redux-saga、fetch封装起来的轻量应用框架。

## 基本使用

```js
import React from 'react'
import dva, {connect, router} from 'dva'
const {HashRouter, Route, Router} = router

const model = {
    namespace: 'index_model',
    state: {
        text: 'hello'
    },
    effects: {
        * asyncGetInfo({payload = {}}, {call, put}) {
        }
    },
    reducers: {
        updateData: (state, {payload}) => {
            return {...state, ...payload}
        }
    }
}

let IndexPage = ({text, dispatch}) => {
    const update = () => {
        dispatch({
            type: 'index_model/updateData',
            payload: {
                text: Math.random()
            }
        })
    }
    return (<div>
        <p> index {text}</p>
        <p>
            <button onClick={update}>click</button>
        </p>
    </div>)
}


let WrapIndexPage = connect(({index_model}) => {
    return {...index_model}
})(IndexPage)

const routes = [
    {
        path: '/',
        component: WrapIndexPage,
    }
]
const AppRouter = ({history}) => {
    console.log(history)
    let route = <HashRouter history={history} routes={routes}>
        <Route component={WrapIndexPage}></Route>
    </HashRouter>
    return (
        <div>
            hello
            {route}
        </div>
    )
}

const app = dva({
    onError(error) {
        console.log(error)
    },
})

app.model(model)
app.router(AppRouter)
app.start('#app')

```