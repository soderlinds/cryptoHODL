const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({ 
    target: 'https://api.coingecko.com', 
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api/v3'
    }
}));

app.listen(3001, () => {
    console.log('Proxy server listening on port 3001');
});