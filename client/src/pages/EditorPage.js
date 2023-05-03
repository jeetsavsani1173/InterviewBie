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
import axios from "axios";
import Chat from "../components/Chat";

function EditorPage() {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
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

      // listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          // just ignore own username -> just notify other user excluding it self.
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );

      //  listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter((clients) => clients.socketId !== socketId);
        });
      });
    };
    init();
    // clearing the listner -> othervise memory will be lick
    return () => {
      socketRef.current.disconnect();
      // for unsubscribing any event of socket.io
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID.");
      console.log(err);
    }
  };

  const leaveRoom = () => {
    reactNavigator("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  const inputClicked = () => {
    const inputArea = document.getElementById("input");
    inputArea.placeholder = "Enter your input here";
    inputArea.value = "";
    inputArea.disabled = false;
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    inputLabel.classList.remove("notClickedLabel");
    inputLabel.classList.add("clickedLabel");
    outputLabel.classList.remove("clickedLabel");
    outputLabel.classList.add("notClickedLabel");
  };

  const outputClicked = () => {
    const inputArea = document.getElementById("input");
    inputArea.placeholder =
      "You output will apear here, Click 'Run code' to see it";
    inputArea.value = "";
    inputArea.disabled = true;
    const inputLabel = document.getElementById("inputLabel");
    const outputLabel = document.getElementById("outputLabel");
    inputLabel.classList.remove("clickedLabel");
    inputLabel.classList.add("notClickedLabel");
    outputLabel.classList.remove("notClickedLabel");
    outputLabel.classList.add("clickedLabel");
  };

  const runCode = () => {
    const lang = document.getElementById("languageOptions").value;
    const input = document.getElementById("input").value;
    const code = codeRef.current;

    toast.loading("Running Code....");

    const encodedParams = new URLSearchParams();
    encodedParams.append("LanguageChoice", lang);
    encodedParams.append("Program", code);
    encodedParams.append("Input", input);

    const options = {
      method: "POST",
      url: "https://code-compiler.p.rapidapi.com/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "9c3e085493msh36c969795ac1650p1624b9jsn1c1d760832b1",
        "X-RapidAPI-Host": "code-compiler.p.rapidapi.com",
      },
      data: encodedParams,
    };

    console.log(options);

    axios
      .request(options)
      .then(function (response) {
        let message = response.data.Result;
        if (message === null) {
          message = response.data.Errors;
        }
        outputClicked();
        document.getElementById("input").value = message;
        toast.dismiss();
        toast.success("Code compilation complete");
      })
      .catch(function (error) {
        toast.dismiss();
        toast.error("Code compilation unsuccessful");
        document.getElementById("input").value =
          "Something went wrong, Please check your code and input.";
      });
  };

  return (
    <>
      <div className="mainWrap">
        <div className="asideWrap">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/logo-3.png" alt="logo" />
            </div>
            <h3 style={{ alignItems: "center" }}>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <label>
            Select Language:
            <select id="languageOptions" className="seLang" defaultValue="17">
              <option value="1">C#</option>
              <option value="4">Java</option>
              <option value="5">Python</option>
              <option value="6">C (gcc)</option>
              <option value="7">C++ (gcc)</option>
              <option value="8">PHP</option>
              <option value="11">Haskell</option>
              <option value="12">Ruby</option>
              <option value="13">Perl</option>
              <option value="17">Javascript</option>
              <option value="20">Golang</option>
              <option value="21">Scala</option>
              <option value="37">Swift</option>
              <option value="38">Bash</option>
              <option value="43">Kotlin</option>
              <option value="60">TypeScript</option>
            </select>
          </label>
          <button className="btn runBtn" onClick={runCode}>
            Run Code
          </button>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap">
          <Editor
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
          <div className="IO-container">
            <label
              id="inputLabel"
              className="clickedLabel"
              onClick={inputClicked}
            >
              Input
            </label>
            <label
              id="outputLabel"
              className="notClickedLabel"
              onClick={outputClicked}
            >
              Output
            </label>
          </div>
          <textarea
            id="input"
            className="inputArea textarea-style"
            placeholder="Enter your input here"
          ></textarea>
        </div>
        <div className="chatWrap">
          <Chat socketRef={socketRef} roomId={roomId} />
        </div>
      </div>
    </>
  );
}

export default EditorPage;
