import type { NextPage } from "next";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HeadComponent } from "../components/Head";
import styles from "../styles/Home.module.css";

import { io, Socket } from "socket.io-client";
import { Send } from "tabler-icons-react";

interface IMessage {
  id: string;
  message: string;
  timestamp: string;
  name: string;
}

let socket: Socket;

const Home: NextPage = () => {
  const [name, setName] = useState("");
  const nameinput = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const messageBox = useRef<HTMLInputElement>(null);

  const submitName = (e: FormEvent) => {
    e.preventDefault();
    setName(nameinput.current!.value);
    localStorage.setItem("name", nameinput.current!.value);
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    const date = new Date();
    const messageObj = {
      message,
      timestamp: date.toLocaleDateString() + " " + date.toLocaleTimeString(),
      name,
    };

    setMessage("");
    socket?.emit("new_message", messageObj);
  };

  const initSocket = async () => {
    await fetch("/api/socket");
    socket = io();
    socket.on("connect", () => {
      console.log("connected");
    });
    // socket.on("new_message", (data: IMessage) => {
    //   setMessages([...messages, data]);
    //   console.log(data);
    // });

    socket.on("messages_updated", (data: IMessage[]) => {
      setMessages(data);
    });

    // socket.on("newest_message", (data: IMessage) => {
    //   console.log(data);
    //   setMessages([...messages, data]);
    // });
  };

  useEffect(() => {
    let name = localStorage.getItem("name");
    if (name) setName(name);

    initSocket();
  }, []);

  useEffect(() => {
    messageBox.current?.scroll({
      behavior: "smooth",
      top: messageBox.current?.scrollHeight,
    });
  }, [messages]);

  return (
    <div className={styles.container}>
      <HeadComponent />

      {name ? (
        <div className={styles.main}>
          <h1 className={styles.title}>Hey {name}</h1>
          <div className={styles.description}>
            <div className={styles.messages} ref={messageBox}>
              {messages &&
                messages.map((message) => (
                  <div
                    className={
                      "message " + (name === message.name ? "mine" : "")
                    }
                    key={message.id}
                  >
                    <div className="message-username">{message.name}</div>
                    <div className="message-text">{message.message}</div>
                    <div className="message-timestamp">{message.timestamp}</div>
                  </div>
                ))}

              <div className="bubbles">
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
                <div className="bubble"></div>
              </div>
            </div>
            <form className="input-group" onSubmit={sendMessage}>
              <input
                name="message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                style={{ display: "flex", alignItems: "center", gap: "2pt" }}
              >
                Send
                <Send />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Y-Chat! {name}</h1>
          <form
            className={"input-group " + styles.description}
            onSubmit={submitName}
          >
            <input type="text" name="name" ref={nameinput} />
            <button type="submit">Submit Name</button>
          </form>
        </div>
      )}

      <footer className={styles.footer}>
        <a href="https://yelmays.me" target="_blank" rel="noopener noreferrer">
          Made by Yelmays
        </a>
      </footer>
    </div>
  );
};

export default Home;
