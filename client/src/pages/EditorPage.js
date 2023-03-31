import React, { useEffect, useRef, useState } from "react";
import ACTIONS from "../Actions";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();

  const handleErrors = (e) => {
    console.log("socket error", e);
    toast.error("Socket connection failed, please try again later.");
    reactNavigator("/");
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
    };
    init();
  }, []);

  const [clients, setClients] = useState([
    { socketId: 1, username: "Jeet S" },
    { socketId: 2, username: "Dharmesh P" },
    { socketId: 3, username: "Harshad J" },
  ]);
  return (
    <>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/logo-3.png" alt="logo" />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn">Copy ROOM ID</button>
          <button className="btn leaveBtn">Leave</button>
        </div>
        <div className="editorWrap">
          <Editor />
        </div>
        <div className="chatWrap">chat will be here</div>
      </div>
    </>
  );
}

export default EditorPage;
