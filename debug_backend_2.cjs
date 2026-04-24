const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const logFile = fs.createWriteStream('backend_debug_2.log');

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

// Wait for backend to start, then make a request to /api/v1/products
setTimeout(() => {
  console.log('Making request to /api/v1/products...');
  http.get('http://localhost:5001/api/v1/products', (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}, 8000);

setTimeout(() => {
  console.log('Stopping debug session after 20 seconds.');
  backend.kill();
  process.exit();
}, 20000);
