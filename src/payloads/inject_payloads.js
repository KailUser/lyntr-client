const { readFileSync } = require('fs');
const { join } = require('path');
const vm = require('vm');

function injectJavaScript(filePath) {
    try {
        // Читаем файл с JavaScript кодом
        const code = readFileSync(filePath, 'utf8');
        // Создаем новый контекст для безопасного выполнения кода
        const script = new vm.Script(code);
        // Выполняем скрипт
        script.runInThisContext();
        console.log('JavaScript code has been injected and executed from:', filePath);
    } catch (err) {
        console.error('Failed to inject and execute code:', err);
    }
}
