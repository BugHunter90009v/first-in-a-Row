document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const bgColor = document.getElementById('bg-color');
  const textColor = document.getElementById('text-color');
  const fontSize = document.getElementById('font-size');
  const generateBtn = document.getElementById('generate-btn');
  const canvas = document.getElementById('preview');
  const ctx = canvas.getContext('2d');

  // 设置画布默认尺寸
  const canvasWidth = 800;
  const padding = 40;

  function generateImage() {
    const text = textInput.value.trim();
    if (!text) {
      alert('请输入要转换的文字');
      return;
    }

    // 计算文本换行
    ctx.font = `${fontSize.value}px Arial`;
    const words = text.split('');
    const lines = [];
    let currentLine = '';

    for (let word of words) {
      const testLine = currentLine + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvasWidth - (padding * 2)) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    // 计算画布高度
    const lineHeight = fontSize.value * 1.5;
    const canvasHeight = (lines.length * lineHeight) + (padding * 2);

    // 设置画布尺寸
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 绘制背景
    ctx.fillStyle = bgColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制文本
    ctx.fillStyle = textColor.value;
    ctx.font = `${fontSize.value}px Arial`;
    ctx.textBaseline = 'top';

    lines.forEach((line, index) => {
      ctx.fillText(line, padding, padding + (index * lineHeight));
    });

    // 显示预览
    canvas.style.display = 'block';

    // 下载图片
    const link = document.createElement('a');
    link.download = 'web-quote.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  generateBtn.addEventListener('click', generateImage);

  // 实时预览
  [textInput, bgColor, textColor, fontSize].forEach(input => {
    input.addEventListener('input', () => {
      if (textInput.value.trim()) {
        generateImage();
      }
    });
  });
});