const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.resolve('startup_log_v2.txt');
console.log('Attempting to write to:', logFile);

try {
    const logStream = fs.createWriteStream(logFile);
    logStream.write('Starting diagnosis v2...\n');

    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    console.log(`Spawning ${cmd} run dev...`);

    const child = spawn(cmd, ['run', 'dev'], {
        cwd: process.cwd(),
        shell: true
    });

    child.stdout.on('data', (data) => {
        const s = data.toString();
        // console.log(s); 
        logStream.write(s);
    });

    child.stderr.on('data', (data) => {
        const s = `ERROR: ${data.toString()}`;
        // console.error(s);
        logStream.write(s);
    });

    child.on('error', (err) => {
        logStream.write(`SPAWN ERROR: ${err.message}\n`);
        logStream.end();
    });

    setTimeout(() => {
        logStream.write('\nDiagnosis timed out (5s), killing process...');
        child.kill();
        logStream.end();
        process.exit(0);
    }, 5000);

} catch (e) {
    console.error('FATAL SCRIPT ERROR:', e);
}
