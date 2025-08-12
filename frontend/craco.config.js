const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Force CRACO to read PostCSS plugins from postcss.config.js
  style: {
    postcss: {
      mode: 'file',
    },
  },
};
