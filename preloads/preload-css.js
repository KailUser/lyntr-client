
document.addEventListener('DOMContentLoaded', () => {

  const fs = require('fs');
  const path = require('path');
  const { ipcRenderer } = require('electron');

  const cssFilePath = path.join(__dirname, '..', 'style.css');
  const cssFile = fs.readFileSync(cssFilePath, 'utf8');

  const styleElement = document.createElement('style');
  styleElement.textContent = cssFile;
  (document.head||document.documentElement).appendChild(styleElement);

  ipcRenderer.send('preload-ready');

});
