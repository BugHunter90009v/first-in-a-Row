# Life Coach AI 对话网站

这是一个基于DeepSeek R1 API的个人生活教练AI对话网站。通过与AI助手的对话，获取个性化的建议和指导，帮助个人成长。

## 项目结构

```
life-coach/
├── README.md          # 项目说明文档
├── package.json       # 项目依赖配置
├── server.js          # Node.js后端服务器
├── public/           # 静态资源目录
│   ├── index.html    # 主页面
│   ├── styles.css    # 样式文件
│   └── script.js     # 前端JavaScript代码
```

## 技术栈

- 前端：HTML5 + CSS3 + JavaScript
- 后端：Node.js + Express
- API：DeepSeek R1 API
- 通信：WebSocket (用于流式响应)

## 功能特点

1. 响应式设计，适配各种设备
2. 实时对话界面，支持流式响应
3. 优雅的用户界面，提供良好的用户体验
4. 安全的API密钥管理
5. 错误处理和超时控制

## 页面布局

### 主页面 (index.html)
- 顶部标题栏：展示网站名称和主题
- 中间聊天区域：显示对话历史
- 底部输入区：消息输入框和发送按钮

### 样式设计
- 使用柔和的配色方案
- 采用Flexbox布局实现响应式设计
- 聊天气泡设计区分用户和AI消息
- 加载动画提供更好的用户体验

## 开发计划

1. 搭建基础项目结构
2. 实现前端界面设计
3. 开发Node.js后端服务
4. 集成DeepSeek R1 API
5. 实现WebSocket通信
6. 添加错误处理和优化

## 注意事项

- API请求超时设置为60秒
- 流式输出开启
- 温度参数设置为0.6
- 需要处理CORS问题