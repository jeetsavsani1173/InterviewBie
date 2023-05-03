import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Chat({ socketRef, roomId }) {
  const [toggle, setToggle] = useState("chat");
  const [messageList, setMessageList] = useState([]);
  const [typed, setTyped] = useState("");
  const location = useLocation();
  const username = location.state?.username;

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      if (typed) {
        const messageData = {
          room: roomId,
          author: username,
          message: typed,
        };
        socketRef.current.emit("send_message", messageData);
        setMessageList((list) => [...list, messageData]);
        setTyped("");
      }
    }
  };

  useEffect(() => {
    socketRef?.current?.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef.current]);

  const inputClicked = () => {
    // const inputArea = document.getElementById("input");
    // inputArea.placeholder = "Enter your input here";
    // inputArea.value = "";
    // inputArea.disabled = false;
    // const chatsection = document.getElementById("chat__section");
    // chatsection.appendChild("videoClass");
    // chatsection.removeChild("chatClass");
    const chatLable = document.getElementById("chatLable");
    const videoLable = document.getElementById("videoLable");
    chatLable.classList.remove("notClickedLabel");
    chatLable.classList.add("clickedLabel");
    videoLable.classList.remove("clickedLabel");
    videoLable.classList.add("notClickedLabel");
    setToggle("chat");
  };

  const outputClicked = () => {
    // const inputArea = document.getElementById("input");
    // inputArea.placeholder =
    //   "You output will apear here, Click 'Run code' to see it";
    // inputArea.value = "";
    // inputArea.disabled = true;
    // const chatsection = document.getElementById("chat__section");
    // chatsection.appendChild("chatClass");
    // chatsection.removeChild("videoClass");
    const chatLable = document.getElementById("chatLable");
    const videoLable = document.getElementById("videoLable");
    chatLable.classList.remove("clickedLabel");
    chatLable.classList.add("notClickedLabel");
    videoLable.classList.remove("notClickedLabel");
    videoLable.classList.add("clickedLabel");
    setToggle("video");
  };

  const SendMessage = (e) => {
    e.preventDefault();
    if (typed) {
      const messageData = {
        room: roomId,
        author: username,
        message: typed,
      };
      socketRef.current.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setTyped("");
    }
  };

  const handleChange = (e) => {
    setTyped(e.target.value);
  };
  return (
    <div className="chat">
      <section className="chat__section">
        <div className="butan">
          <label id="chatLable" className="clickedLabel" onClick={inputClicked}>
            Chat
          </label>
          <label
            id="videoLable"
            className="notClickedLabel"
            onClick={outputClicked}
          >
            Video
          </label>
        </div>
        {toggle === "chat" ? (
          <div className="chatClass">
            <div className="brand">
              <h3>Wassup Chat of : {username}</h3>
            </div>
            <div className="message__area">
              {messageList?.map((message) => (
                <div
                  className={`message ${
                    message.author === username ? "outgoing" : "incoming"
                  }`}
                >
                  <h4>{message.author}</h4>
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
            <div className="chatSend">
              <textarea
                id="textarea"
                cols="30"
                rows="1"
                value={typed}
                placeholder="Write a message..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              ></textarea>
              <button className="btn sendBtn" onClick={SendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="videoClass">
            <h1 style={{ color: "white" }}>Video section</h1>
          </div>
        )}
      </section>
    </div>
  );
}

export default Chat;
