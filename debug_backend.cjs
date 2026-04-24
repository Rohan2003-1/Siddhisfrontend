const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = fs.createWriteStream('backend_debug.log');

console.log('Starting backend debug session...');

const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.resolve(__dirname, '../backend'),
  shell: true
});

backend.stdout.on('data', (data) => {
  console.log(`STDOUT: ${data}`);
  logFile.write(data);
});

backend.stderr.on('data', (data) => {
  console.error(`STDERR: ${data}`);
  logFile.write(data);
});

setTimeout(() => {
  console.log('Stopping debug session after 15 seconds.');
  backend.kill();
  process.exit();
}, 15000);
