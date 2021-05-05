Electron
===

> Electron 是一个使用 JavaScript, HTML 和 CSS 等 Web 技术创建原生程序的框架，它负责比较难搞的部分，你只需把精力放在你的应用的核心上即可

参考
* [官网](https://electronjs.org)
* [electron-api-demos](https://github.com/electron/electron-api-demos)，一个展示相关API的应用项目
* [PicGo](https://github.com/Molunerfinn/PicGo)，使用Vue和Electron开发的一个类似iPic的上传图片到图床的工具
* 之前的整理：[使用Electron实现一个iPic](https://www.shymean.com/article/%E4%BD%BF%E7%94%A8Electron%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAiPic)

进程和线程的区别：每个进程都有自己独立的一块内存空间，一个进程可以有多个线程；线程是 进程中的一个执行任务（控制单元），负责当前进程中程序的执行。一个进程至少有一个线程，一个进程可以运行多个线程，多个线程可共享数据

electron 主进程和渲染进程，每个页面都有渲染进程、还是只有一个渲染进程？主进程和渲染进程如何通信：利用 ipcMain 和 ipcRenderer 模块，类似于eventBus？能否手写一个简单的eventBus?在离开某个页面时，可能需要取消相关事件的监听，有没有更合适的封装？了解过hooks吗？

electron页面请求的接口会有跨域吗？怎么解决？可以直接关闭`web-security`开关
