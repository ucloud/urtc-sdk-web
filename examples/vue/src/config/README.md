本目录中需要创建 index.js 文件，并配置 AppId 和 AppKey，示例代码：

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