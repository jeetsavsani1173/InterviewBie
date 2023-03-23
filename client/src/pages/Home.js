import React from "react";
// import { MDBInput } from "mdb-react-ui-kit";

function Home() {
  return (
    <div className="homePageWrapper">
      <img className="image1" src="/background.jpg" alt="logo" />
      <div className="formWrapper">
        <img className="homePageLogo" src="/logo-3.png" alt="logo" />
        {/* <img src="/logo-2.png" alt="logo" height={"150px"} /> */}
        <h4 className="mainLabel">Paste Invitation ROOM ID:</h4>
        <div className="inputGroup">
          <input type="text" className="inputBox" placeholder="ROOM ID" />
          <input type="text" className="inputBox" placeholder="USERNAME" />
          <div className="btnP">
            <button className="btn joinBtn">Join</button>
          </div>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a href="/" className="createNewBtn">
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
