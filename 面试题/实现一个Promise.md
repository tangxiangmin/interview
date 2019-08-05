实现一个Promise
===

下面是一个Promise的简单实现，实现了构造函数和链式调用的then方法

```js
const PROMISE_STATUS = {
    PENDING: 1,
    RESOLVED: 2,
    REJECTED: 3
};

let util = {
    isFunc(fn) {
        return typeof fn === "function";
    },
    isPromise(obj) {
        return obj && this.isFunc(obj.then);
    }
};

function MyPromise(exector) {
    this.status = PROMISE_STATUS.PENDING;
    this.val = undefined;
    this.reason = undefined;

    this.resolveCallback = undefined;
    this.rejectCallback = undefined;

    let resolve = val => {
        if (this.status === PROMISE_STATUS.PENDING) {
            this.status = PROMISE_STATUS.RESOLVED;
            this.val = val;

            if (util.isFunc(this.resolveCallback)) {
                this.resolveCallback();
            }
        }
    };

    let reject = reason => {
        if (this.status === PROMISE_STATUS.PENDING) {
            this.status = PROMISE_STATUS.REJECTED;
            this.reason = reason;
            if (util.isFunc(this.rejectCallback)) {
                this.rejectCallback();
            }
        }
    };

    // 在构造函数中立即执行exector，并由用户根据业务手动调用resolve或者reject
    exector(resolve, reject);
}

MyPromise.prototype.then = function(onFull, onReject) {
    return new MyPromise((resolve, reject) => {
        let success = () => {
            // 具体的返回值有Promise A+规范决定, 根据onFull 的结果处理后面一个then的调用，
            // 1. 如果onFull结果为报错，进入catch，调用reject
            // 2. 如果onFull结果为Promise，则根据promise的状态调用resolve或者reject
            // 3. 如果onFull结果为普通值，则直接调用resolve
            try {
                let result = onFull(this.val);
                if (util.isPromise(result)) {
                    result.then(
                        res => {
                            resolve(res);
                        },
                        e => {
                            reject(e);
                        }
                    );
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        };

        let error = () => {
            let reason = util.isFunc(onReject) ? onReject(this.reason) : this.reason;
            reject(reason);
        };

        if (this.status === PROMISE_STATUS.RESOLVED) {
            success();
        } else if (this.status === PROMISE_STATUS.REJECTED) {
            error();
        } else if (this.status === PROMISE_STATUS.PENDING) {
            this.resolveCallback = success;
            this.rejectCallback = error;
        }
    });
};

let myPromise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("setTimeout result");
    }, 100);
});

let myP2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        
        resolve("async2 result");
    }, 100);
});

myPromise
    .then(res => {
        console.log("res1: ", res);
        throw 'onfull error'
        return myP2;
    })
    .then(
        res => {
            console.log("res2: ", res);
            return res;
        },
        err => {
            console.log(err);
        }
    )
    .then(res => {
        console.log(res); // res2:
    })
    .then(res => {
        console.log(res); // undefined
    });

```