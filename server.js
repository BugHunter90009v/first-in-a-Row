const express = require('express');
const http = require('http');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');

// 配置环境变量
dotenv.config();

const app = express();
const server = http.createServer(app);

// API配置
const API_KEY = process.env.API_KEY;
const API_URL = process.env.API_URL;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 调试路由
app.get('/debug', (req, res) => {
  res.json({
    env: process.env.NODE_ENV,
    apiKey: API_KEY ? '已配置' : '未配置',
    apiUrl: API_URL ? '已配置' : '未配置'
  });
});

// API路由处理
app.post('/api/chat', async (req, res) => {
  console.log('收到聊天请求:', req.body);
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    try {
      const messages = req.body.messages || [];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-r1-250120',
          messages: [
            {"role": "system", "content": "你是一个专业的生活教练AI助手，善于倾听、分析和给出建设性的建议。你的目标是通过对话帮助用户发现自己的潜力，克服困难，实现个人成长。"},
            ...messages
          ],
          stream: true,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        console.error('API请求失败:', response.status, await response.text());
        throw new Error(`API请求失败: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') continue;

          try {
            const parsedLine = JSON.parse(line.replace(/^data: /, ''));
            if (parsedLine.choices && parsedLine.choices[0].delta.content) {
              res.write(`data: ${JSON.stringify({
                type: 'content',
                content: parsedLine.choices[0].delta.content
              })}\n\n`);
            }
          } catch (e) {
            console.error('解析响应数据出错:', e);
          }
        }
      }
    } catch (error) {
      console.error('处理消息时出错:', error);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: '服务器处理请求时出错'
      })}\n\n`);
      res.end();
    }
  } finally {
    res.end();
  }
});

// 设置超时
server.timeout = 60000; // 60秒

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});