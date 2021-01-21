const path = require("path");
// 导入处理 history 模式的模块
const history = require("connect-history-api-fallback");
// 导入 express
const express = require("express");

const app = express();
// 注册处理history模式的中间件
app.use(history());
//处理静态资源的中间件，网站根目录 dist
app.use(express.static(path.join(__dirname, "dist")));

// 开启服务器
app.listen(3000, () => {
  console.log("服务器启动，端口：3000");
});
