const { spawn } = require('child_process');
const path = require('path');

const runScript = (scriptName) => {
  return new Promise((resolve, reject) => {
    console.log(`Running ${scriptName}...`);
    const proc = spawn('node', [scriptName], {
      cwd: path.resolve(__dirname, '../backend'),
      shell: true
    });

    proc.stdout.on('data', (data) => console.log(`${scriptName} STDOUT: ${data}`));
    proc.stderr.on('data', (data) => console.error(`${scriptName} STDERR: ${data}`));

    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited with code ${code}`));
    });
  });
};

const main = async () => {
  try {
    await runScript('seedCategories.js');
    await runScript('seedProducts.js');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

main();
