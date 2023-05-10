"use strict";
const app = require("./app");
const http = require("http");

const port = 5000;
app.set("port", port);

const server = http.createServer(app);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log("API rodando na porta " + port);
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "ferragem" + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}
function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === "string" ? "ferragem " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}
