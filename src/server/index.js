// websocket-server.js
import http from "http";
import { Server } from "socket.io";

// Function to initialize WebSocket server
export function initializeWebSocketServer() {
  const server = http.createServer(() => {
    // Handle HTTP requests if needed
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle chat messages
    socket.on("chat message", (message) => {
      io.emit("chat message", message); // Broadcast the message to all connected clients
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  server.listen(3001, () => {
    console.log("WebSocket server listening on port 3001");
  });
}
