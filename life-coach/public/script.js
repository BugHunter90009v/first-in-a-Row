// WebSocket连接
let ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);
let messageHistory = [];

// DOM元素
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const loadingIndicator = document.getElementById('loading');

// 消息处理函数
function appendMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;

    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// 发送消息
async function sendMessage() {
    const content = userInput.value.trim();
    if (!content) return;

    // 禁用输入和按钮
    userInput.disabled = true;
    sendButton.disabled = true;
    loadingIndicator.classList.add('active');

    // 显示用户消息
    appendMessage(content, true);

    // 更新消息历史
    messageHistory.push({"role": "user", "content": content});

    // 发送到服务器
    ws.send(JSON.stringify({
        messages: messageHistory
    }));

    // 清空输入框
    userInput.value = '';
}

// WebSocket事件处理
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'content') {
        // 如果是第一个响应，创建新的AI消息元素
        if (!document.querySelector('.message.ai:last-child') || 
            document.querySelector('.message.ai:last-child').dataset.complete === 'true') {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message ai';
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            messageDiv.appendChild(contentDiv);
            messagesContainer.appendChild(messageDiv);
        }

        // 获取最后一个AI消息元素并追加内容
        const lastAiMessage = document.querySelector('.message.ai:last-child .message-content');
        lastAiMessage.textContent += data.content;

        // 滚动到底部
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // 更新消息历史
        if (!messageHistory[messageHistory.length - 1] || 
            messageHistory[messageHistory.length - 1].role !== 'assistant') {
            messageHistory.push({"role": "assistant", "content": ''});
        }
        messageHistory[messageHistory.length - 1].content += data.content;
    } else if (data.type === 'error') {
        appendMessage('抱歉，发生了一些错误。请稍后重试。', false);
    }
};

ws.onclose = () => {
    appendMessage('连接已断开。请刷新页面重试。', false);
};

ws.onerror = () => {
    appendMessage('连接出错。请检查网络连接后重试。', false);
};

// 启用输入和发送按钮
ws.onopen = () => {
    userInput.disabled = false;
    sendButton.disabled = false;
    loadingIndicator.classList.remove('active');
};

// 事件监听器
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// 在每次响应完成后重置状态
ws.addEventListener('message', () => {
    userInput.disabled = false;
    sendButton.disabled = false;
    loadingIndicator.classList.remove('active');
});