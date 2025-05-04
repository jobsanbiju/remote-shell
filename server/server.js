const WebSocket = require('ws');
const pty = require('node-pty');
const os = require('os');

const wss = new WebSocket.Server({ port: 3000 }, () => {
  console.log("WebSocket server started on ws://127.0.0.1:3000");
});

wss.on('connection', function connection(ws) {
  const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.onData(data => ws.send(data));
  ws.on('message', msg => ptyProcess.write(msg));
  ws.on('close', () => ptyProcess.kill());
});
