document.addEventListener('DOMContentLoaded', () => {

    const fs = require('fs');
    const path = require('path');
    const { ipcRenderer } = require('electron');

    const preloadScriptPath = path.join("..", 'lyntrplus' ,'lyntr-plus.meta.js');
    const preloadScript = fs.readFileSync(preloadScriptPath, 'utf8');

    const preloadScriptElement = document.createElement('script');
    preloadScriptElement.textContent = preloadScript;
    (document.head||document.documentElement).appendChild(preloadScriptElement);

    ipcRenderer.send('preload-ready');


});
