import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Chat({ socketRef, roomId }) {
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
  }, [socketRef.current]);

  const handleChange = (e) => {
    setTyped(e.target.value);
  };
  return (
    <div className="chat">
      <section className="chat__section">
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
          {/* <div className="incoming message">
            <h4>Jeet S</h4>
            <p>hello How Are you yash ?</p>
          </div>
          <div className="outgoing message">
            <h4>Yash P</h4>
            <p>hye Jeet, I am fine!</p>
          </div> */}
        </div>
        <div>
          <textarea
            id="textarea"
            cols="30"
            rows="1"
            value={typed}
            placeholder="Write a message..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          ></textarea>
          {/* <button lable="textarea" onClick={sendMessageHandler} className="btn">
            send
          </button> */}
        </div>
      </section>
    </div>
  );
}

export default Chat;
