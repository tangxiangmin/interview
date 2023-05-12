

git 
===

一些场景下的git使用方法

## git flow工作流

参考：[git-flow 的工作流程](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow/)

git flow主要用于约定整个开发团队的工作流程，最主要的是约定各种分支及checkout规范，报货master、develop、feature、hotfix、release分支等

## git cz 规范提交信息

全局安装[commitizen](https://www.npmjs.com/package/commitizen)，然后使用命令行提交commit

```
# 安装时间可能会有点久
npm install -g commitizen

npm install -g cz-conventional-changelog

echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc

# 切换到项目，使用cz 替换commit命令 
git cz
# 依次选择后续步骤
```

建议使用[全局设置](https://www.npmjs.com/package/commitizen#conventional-commit-messages-as-a-global-utility)

## git把某一次的commit转移到另外的分支上去

我正在分支1开发，突然来了一个需求紧急上线

正常情况下，应该stash 当前正在开发的内容，然后单独从master分支切一个出来开发新需求；手忙脚乱开发完毕时发现：哦豁，忘记切分支，把改动提交到当前分支了

但是我只想合并这次提交的改动，分支1上的代码还不成熟，不想合并

那么问题来了
> git如何把某一次的commit转移到另外的分支上去呢？

可以使用`cherry-pick`来实现，
* 从稳定分支如master，切一个分支2出来
* 在分支2上使用`git cherry-pick commitId`，其中commitId就是最新需求的那次提交号

当然，cherry-pick也可以转移多次的commit。

## gitkeep文件

参考：[什么是 .gitkeep](https://www.gonever.com/post/25)

git不会不跟踪空文件夹。如果你的项目文件夹里边有任何的空文件夹，Git 都会忽略掉。

但某些时候期望能够将空目录进行提交，保证仓库中是完整的代码版本，这时候可以使用`.gitkeep`文件。

这是因为在空文件夹里边添加了一个文件之后，Git 就会开始跟踪这个文件夹——无论这个文件是什么，内容如何，名字是什么。

那为什么什么是 .gitkeep 呢？实际上，这个名字是社区起的，其他人可以容易的把它和 .gitignore 联系起来。Git 并没有给这个文件任何的像 .gitignore 文件一样的特殊权限。

如果你想跟踪你上游项目的空文件夹，那么你就在这个文件夹中创建一个 .gitkeep 文件。其他开发者很容易就会理解这是干什么用的。通常来说，assets 文件夹和 log 文件夹需要这样做。记住，不要把 .gitkeep 添加到 .gitignore 文件中，那样的话空文件夹就从你的文件系统中消失了。

## git reset误删除找回

参考:[Git Reset hard误操作回滚恢复代码](https://blog.csdn.net/u011450490/article/details/60119210)

记一次悲惨经历：某天深夜，正噼里啪啦地在develop分支上写着带啊吗，突然需要回滚看看之前的提交，切个分支出去然后reset

```
git checkout -b tmp
```

手速太快了，没有看提示，以为成功切过去了，直接调用
```
git reset --hard head^^^
```

万万没想到之前本地存在这个`tmp`分支，导致checkout -b失败了，导致回退了develop分支上的代码。

GG，这意味着我熬夜三个小时的功能白写了

不甘心，一通搜索，找到解决办法
* 打开项目目录`/.git/logs/refs/heads/branch_name`，打开文件，找到对应的版本号
* `git reset --hard 需要恢复的xxx版本号`

完事大吉，惊出一身冷汗。

碎觉，这件事情告诉我们，不要熬夜写代码。

## git revert撤销某次提交

拿到一个需求A，在feature分支哼哧哼哧做完commit之后，又继续做其他功能B、C。假设这个feature分支收集了3个commit:A、B、C，正准备上线的时候，产品说功能A先不上吧，改回第一版~

reset肯定是不行的，reset到commit A时，会把B和C的代码也给回滚了。这时候可以使用`git revert`

git revert是用于“撤销”某一个版本，以达到取消该版本的修改的目的。

首先
```
git revert -n 需要撤销的commitId
```
然后重新提交
```
git commit -m "revert A"
```

修改完成，提测吧。

等待后面产品说，功能A还是修改一下吧，这个时候怎么办？可以对revert的操作继续进行revert，相当于撤销 ”撤销A版本的改动“的改动，禁止套娃~

## git lfs 大文件

参考：[git lfs操作指南](https://zzz.buzz/zh/2016/04/19/the-guide-to-git-lfs/)

当项目中包含了大量的大文件之后，提交、下载仓库就会变得越来越慢，这在包含静态资源的前端项目中比较常见，解决办法是使用git lfs(Large File Storage, 大文件存储)

其思路是把音乐、图片、视频等指定的任意文件存在 Git 仓库之外，而在 Git 仓库中用一个占用空间 1KB 不到的文本指针来代替的小工具。


## git ignore语法规则

参考：[.gitignore 规则写法 - 在已忽略文件夹中不忽略指定文件、文件夹](http://www.07net01.com/2017/02/1815747.html#pinglun)


在已忽略文件夹中不忽略指定文件夹
```shell
/node_modules/*
!/node_modules/layer/
```

在已忽略文件夹中不忽略指定文件
```shell
/node_modules/*
!/node_modules/layer/layer.js
```

其他
* 以斜杠“/”开头表示目录；
* 以星号“*”通配多个字符；
* 以问号“?”通配单个字符
* 以方括号“[]”包含单个字符的匹配列表；
* 以叹号“!”表示不忽略(跟踪)匹配到的文件或目录；

## 批量删除git tag

在lerna等monorepo项目中，通过git tag来管理发布的包版本，在测试期间可能希望执行注入移除tag，重新发布等操作，因此需要了解移除git tag的操作

删除本地tag：
```
git tag -d v1.1.1
```

批量删除本地tag
```
git tag | grep "v1.1.*" | xargs git tag -d
```

删除远程tag
```
git push origin --delete tag v1.1.1
```

批量删除远程tag
```
git show-ref --tag | awk '/v1.1.[0-9]{1}[0-9]{0,}$/ {print ":" $2}' | xargs git push origin
```