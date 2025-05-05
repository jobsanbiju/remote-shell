const WebSocket = require("ws");
const pty = require("node-pty");

const wss = new WebSocket.Server({ port: 3000 });
console.log("WebSocket server started on ws://127.0.0.1:3000");

// 🔐 Set your password here
const PASSWORD = "reapershell";

wss.on("connection", function connection(ws) {
  let authed = false;
  let shell = null;

  ws.on("message", function incoming(message) {
    // 🛡️ First message must be the password
    if (!authed) {
      if (message.toString().trim() === PASSWORD) {
        authed = true;
        shell = pty.spawn("bash", [], {
          name: "xterm-color",
          cols: 80,
          rows: 30,
          cwd: process.env.HOME,
          env: process.env
        });

        // forward shell output to browser
        shell.on("data", (data) => {
          ws.send(data);
        });

        // cleanup on disconnect
        ws.on("close", () => {
          if (shell) shell.kill();
        });

      } else {
        // ❌ Wrong password
        ws.send("❌ Wrong password. Closing...\r\n");
        ws.close();
      }
      return; // stop processing further
    }

    // ⌨️ If authenticated, forward input to shell
    if (authed && shell) {
      shell.write(message);
    }
  });
});
