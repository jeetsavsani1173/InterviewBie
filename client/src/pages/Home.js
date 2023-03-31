import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID & username is required");
      return;
    }
    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <img className="image1" src="/background.jpg" alt="logo" />
      <div className="formWrapper">
        <img className="homePageLogo" src="/logo-3.png" alt="logo" />
        <h4 className="mainLabel">Paste Invitation ROOM ID:</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ROOM ID"
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            onKeyUp={handleInputEnter}
          />
          <div className="btnP">
            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>
          </div>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="/" className="createNewBtn">
              New Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Build with ❤️ By{" "}
          <a href="https://github.com/jeetsavsani1173">Jeet Savsani</a>
        </h4>
      </footer>
    </div>
  );
}

export default Home;
