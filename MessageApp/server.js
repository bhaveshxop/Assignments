const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const twilio = require("twilio");

// Express setup
const app = express();
const server = http.createServer(app);
const port = 3000;

// Twilio setup
const accountSid = ""; // Replace with your Twilio Account SID
const authToken = ""; // Replace with your Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

// Serve static files
app.use(express.static("public"));

// WebSocket server setup
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  console.log("WebSocket connection established");

  // Handle messages from the client
  ws.on("message", async function incoming(data) {
    const { phoneNumber, messageText } = JSON.parse(data);

    try {
      // Use Twilio to send the message
      await twilioClient.messages.create({
        to: phoneNumber,
        from: "", // Replace with your Twilio phone number
        body: messageText,
      });
      // Respond to the client with success
      ws.send(JSON.stringify({ success: true }));
    } catch (error) {
      console.error("Error sending message:", error);
      // Respond to the client with an error
      ws.send(
        JSON.stringify({ success: false, error: "Failed to send message" })
      );
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
