
## CI持续集成

在CI环境下通过authToken登录 

```
npm login

# 输入账号密码和email

vs ~/.npmrc

# 查看刚才登录的token
//localhost:4873/:_authToken="/TiXccHN9neTL6b9B7Ir7bgFWRyTAAfLp2bf/AU9PBs="

# 然后执行npm config set <上面这一串host+token的字符串>
npm config set //localhost:4873/:_authToken="/TiXccHN9neTL6b9B7Ir7bgFWRyTAAfLp2bf/AU9PBs="

# 如果后续像使用yarn安装私有仓库的包，还需要配置always-auth，这样可以保证yarn走这个配置
npm config set always-auth true
```