---
title: tiledMap教程汇总
tags:
---

* [官方文档](https://doc.mapeditor.org/en/stable/manual/introduction/)
* https://www.cnblogs.com/zilongshanren/archive/2011/04/11/2012852.html
* https://www.bilibili.com/video/av94433721?zw
* http://www.iigrowing.cn/?p=7868
* https://blog.csdn.net/potato47/article/details/51366481

基本概念

* 图块资源，导入一张图片，可以选择图片上的部分图片作为贴图
* 地图，生成的`.tsx`文件（不是react的jsx），实际上是xml文件
* 层
    * 图层，图层主要用于隔离不同层级的贴图，方便管理和层叠限制；在同一个图层中，一个方块只能放置一张贴图
    * 对象层，主要用于需要进行移动、变换形态、显示或隐藏等逻辑的元素，可以通过API得到对应对象

操作
* 放置
* 橡皮擦删除
* 选区
* 复制

在游戏引擎中使用TiledMap

tiled动画编辑

应该是flag动画编辑之后，需要ctrl + s保存一下，然后一起放到creator的source目录下才行，不然在tiledmap中预览动画，但在creator中是静止的。

如果不能确定flag.tsx是否保存，可以使用vscode 之类的编辑器查看一下里面的xml，如果没有animation 标签，就说明没有保存或者动画没有编辑成功

