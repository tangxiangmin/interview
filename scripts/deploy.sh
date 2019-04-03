#!/bin/bash

#部署到tangxiangmin.github.io域名
dir=../tangxiangmin.github.io
now=`date +%Y%m%d%H%M%S`
# 编译
gitbook build
if [ $? -eq 0 ]; then
    cp -r -f ./_book $dir
    # 自动推送
    cd $dir
    rm -rf interview
    mv _book interview
    
    git add .
    git commit -m "update /interview at: $now"
    git pull origin master
    git push

    # 切回目录
    cd ../interview

    echo "deploy done!"
else
    echo "gitbook build failed"
fi

