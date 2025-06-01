const express = require('express');
const axios = require('axios');
const app = express();

app.get('/download', async (req, res) => {
  try {
    const { id, token, filename = 'file' } = req.query;
    
    // Gọi trực tiếp Google Drive API
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    const response = await axios.get(driveUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'stream' // Quan trọng: Stream dữ liệu
    });

    // Thiết lập headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // Pipe dữ liệu từ Google Drive → Render → Người dùng
    response.data.pipe(res);
    
  } catch (error) {
    res.status(500).send('Lỗi: ' + error.message);
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy đã sẵn sàng'));
