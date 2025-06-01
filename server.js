const express = require('express');
const axios = require('axios');
const app = express();

app.get('/download', async (req, res) => {
  try {
    const { url, token, filename = 'file' } = req.query;
    
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'stream' // Quan trọng: stream dữ liệu
    });

    // Thiết lập headers
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    // Stream trực tiếp không tốn RAM
    response.data.pipe(res);
    
  } catch (error) {
    res.status(500).send('Lỗi: ' + error.message);
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Proxy server đã sẵn sàng');
});
