import { WebSocketServer } from "ws";
import usbDetect from "usb-detection";

const server = new WebSocketServer({ port: 3000 });
usbDetect.startMonitoring();

server.on("connection", (socket) => {
  // send a message to the client
  socket.send(
    JSON.stringify({
      type: "hello from server",
      content: "Connection from server successfully hahhah",
    })
  );

  usbDetect.on("add", function (device) {
    if (device.deviceName.match("Storage")) {
      socket.send(
        JSON.stringify({
          type: "usbDetect",
          content: ["add", device],
        })
      );
    }
  });
  usbDetect.on("remove", function (device) {
    if (device.deviceName.match("Storage")) {
      console.log("remove", device);
      socket.emit("usbDetect", "remove", device);
      socket.send(
        JSON.stringify({
          type: "usbDetect",
          content: ["remove haha", device],
        })
      );
    }
  });

  // receive a message from the client
  socket.on("message", (data) => {
    const packet = JSON.parse(data);

    switch (packet.type) {
      case "hello from client":
        console.log(packet.content);
        break;
    }
  });
});
