import React, { useState, useEffect } from "react";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import "./App.css";

interface SesionDetails {
  apiKey: string;
  sessionId: string;
  token: string;
}

function App() {
  const [sessionDetails, setSessionDetails] = useState<
    SesionDetails | undefined
  >();

  useEffect(() => {
    const url = "http://localhost:8080/";
    fetch(url)
      .then((data) => data.json())
      .then((data) => setSessionDetails(data));
  }, []);
  console.log(sessionDetails)
  return (
    sessionDetails ? (
      <OTSession
        apiKey={sessionDetails.apiKey}
        sessionId={sessionDetails.sessionId}
        token={sessionDetails.token}
      >
        <OTPublisher />
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    ) : (<div>Loading</div>)
  );

  // <div className="App">
  //   <div id="videos">
  //     <div id="subscriber"></div>
  //     <div id="publisher"></div>
  //     <div id="screen-preview"></div>
  //     <button id="start-screensahre">Share screen</button>
  //     <button id="stop-screensahre"> STOP Share screen</button>
  //   </div>
  //   <div id="textchat">
  //     <p id="history"></p>
  //     <form>
  //       <input
  //         type="text"
  //         placeholder="Input your text here"
  //         id="msgTxt"
  //       ></input>
  //     </form>
  //   </div>
  // </div>
}

export default App;
