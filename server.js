const WebSocket = require("ws");
const pty = require("node-pty");

const wss = new WebSocket.Server({ port: 3000 });
console.log("WebSocket server started on ws://127.0.0.1:3000");

const PASSWORD = "reapershell"; // set your password here

wss.on("connection", function connection(ws) {
  let authed = false;
  let shell;

  ws.on("message", function incoming(message) {
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

        shell.on("data", function (data) {
          ws.send(data);
        });

        ws.on("close", () => shell.kill());
      } else {
        ws.send("❌ Wrong password. Closing...\r\n");
        ws.close();
      }
      return;
    }

    if (authed && shell) {
      shell.write(message);
    }
  });
});
