/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sourcePath = path.resolve(__dirname, '.env');
const targetPath = path.resolve(__dirname, 'dist/.env');
fs.copyFile(sourcePath, targetPath, (err) => {
  if (err) {
    console.error('复制文件时出错:', err);
  } else {
    console.log('文件已成功复制到目标位置。');
  }
});
