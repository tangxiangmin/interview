#!/bin/bash

#部署到tangxiangmin.github.io域名
dir=../tangxiangmin.github.io
cp -r -f ./_book $dir
rm -rf $dir/interview
mv $dir/_book $dir/interview

echo "deploy done!"