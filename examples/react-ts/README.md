# URTC-demo（React Typescript 版本）

## 运行步骤

1. 添加配置

src/config 目录创建 index.ts 文件，并配置 AppId 和 AppKey，示例代码：

```
const config = {
  AppId: 'urtc-xxxxxxxx',
  AppKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}

export default config;
```

> 注：
> 
> 1. AppId 和 AppKey 可从 URTC 产品中获取
> 2. AppKey 不可暴露于公网，建议生产环境时，由后端进行保存并由前端调 API 获取
2. 安装 npm 依赖包

```
npm install
```

3. 执行运行命令   

在本地demo目录下，执行以下操作：    


```
npm start
```

4. 打开页面

浏览器打开 http://localhost:3000

**注意**：由于受浏览器安全策略的限制，在访问 WebRTC 服务时，仅支持通过 http 协议访问本地 localhost 及 127.0.0.1 的服务，或通过 https 协议访问部署了服务的站点。故除了在本地进行开发测试时可以使用 http 协议以外，将服务部署至服务器时，请务必部署在支持了 https 协议的站点上。
