import { SocketAddress } from "net";
import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

const fakeMessages = [
  {
    id: 1,
    name: "John Doe",
    message: "Hello, it's me",
    timestamp: "15:00",
  },
  {
    id: 2,
    name: "Jack Smith",
    message: "I'm in the office",
    timestamp: "15:01",
  },
  {
    id: 3,
    name: "Jill Williams",
    message: "Lunch time",
    timestamp: "15:02",
  },
];

const SocketHandler = (req: any, res: any) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log("Socket is connected");
      socket.emit("messages_updated", fakeMessages);

      socket.on("new_message", (data: any) => {
        data.id = fakeMessages.length + 1;
        fakeMessages.push(data);
        socket.broadcast.emit("messages_updated", fakeMessages);
      });

      // socket.on("messages_updated", () => {
      //   socket.broadcast.emit("messages_updated", fakeMessages);
      // });

      socket.on("disconnect", () => {
        console.log("Socket is disconnected");
      });
    });
  }
  res.end();
};

export default SocketHandler;
