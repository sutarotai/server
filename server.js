const express = require('express');
const axios = require('axios');
const app = express();

app.get('/proxy', async (req, res) => {
  try {
    const { url, token, filename = 'download' } = req.query;
    
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    
    response.data.pipe(res);
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
