
## monorepo方案

对于多个项目重复的代码，可以将其抽取成独立的npm包，但同时维护多个npm包的时候，包管理比较麻烦，尤其是在多个包存在依赖关系的时候。因此大型前端项目走逐渐采用`monorepo`作为项目代码的管理方式，主要特点是在单个仓库中管理多个npm包

https://segmentfault.com/a/1190000039157365

https://rainylog.com/post/monorepo-think/

https://blog.mayandev.top/2021/02/22/tech/what-is-monorepo/

这样就可以尽可能复用代码了。


各种 monorepo 技术方案  https://segmentfault.com/a/1190000038683978

## lerna 

lerna提供了一种快速搭建monorepo仓库的方式，参考:[lerna管理前端packages的最佳实践](http://www.sosout.com/2018/07/21/lerna-repo.html)

```
lerna init

# 创建模块1
lerna create test1

# 创建模块2
lerna create test2

# 将test1添加为test2的依赖
lerna add test1 --scope test2

# 提交代码
git add . 
git commit

# 修改git tag，更新所有模块版本号，发布包到对应的npm仓库
lerna publish
```

> lerna 可以单独发布某一个模块，而不是全量发布所有模块？

在 `Fixed/Locked`（默认）模式下面，所有包的版本号都是一致的，维护在`lerna.json`的`version`中

参考[issue1691](https://github.com/lerna/lerna/issues/1691)、[issue1055](https://github.com/lerna/lerna/issues/1055)，基于lerna的使用git tag的特性，要么全量发布，要么都不发布


可以通过`lerna init --independent`选择`Independent`独立模式，每个包可以拥有自己的版本号，由每个包自己的package.json维护

相关的命令可以直接查看[源码](https://github.com/lerna/lerna/tree/main/commands)

## yarn workspaces

https://zhuanlan.zhihu.com/p/71385053

https://segmentfault.com/a/1190000025173538

使用实践：由于yarn和lerna在功能上有较多的重叠,我们采用yarn官方推荐的做法,用yarn来处理依赖问题，用lerna来处理发布问题

```
# 快速创建模块
lerna create mod1 -y
lerna create mod2 -y

# 声明依赖,mod2添加依赖mod1
yarn workspace mod2 add mo1

# 本地开发一通修改，mod2会即时获取mod1模块的内容，本地开发调试很方便

# 使用git-cz规范commit，lerna可以根据提交信息自动生成
git add .
git cz  

# 提交之后可以查看有哪些包版本变化了，但是没有推送到仓库上
lerna updated
```
发现一个奇怪的问题，当本地仅仅是修改了代码，还没有commit时，`lerna updated`无法查看到包的变化。需要提交之后，才能看见变化。如果存在某个包的变化之后，再继续修改其他的包，其他的包及时没有提交，也可以查看到对应包的变化。

举个例子：
* 修改mod1，未提交时，lerna updated 返回空
* 修改mod1,然后提交，未进行发布，lerna updated 返回mod1
* 此时再修改磨mod2，不进行提交和发布，lerna updated 返回mod1 和 mod2

可以研究一下lerna updated的原理。
