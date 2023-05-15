import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Chat({ socketRef, roomId }) {
  // const [myStream, setMyStream] = useState();
  // const [remoteStream, setRemoteStream] = useState();
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
    const chatLable = document.getElementById("chatLable");
    const videoLable = document.getElementById("videoLable");
    chatLable.classList.remove("notClickedLabel");
    chatLable.classList.add("clickedLabel");
    videoLable.classList.remove("clickedLabel");
    videoLable.classList.add("notClickedLabel");
    setToggle("chat");
  };

  const outputClicked = () => {
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

  const meeting = async (element) => {
    const appID = 1154485049;
    const serverSecret = "083fcd1eb81a1764dcb456c096c675c5";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      username
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
    });
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
            {/* <h1 style={{ color: "white" }}>Video section</h1> */}
            {/* <button className="btn">My Stream</button> */}
            <div ref={meeting} style={{ width: "100%", height: "70vh" }}></div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Chat;
