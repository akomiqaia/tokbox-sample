const screenShareButton = document.querySelector("#start-screensahre");
const stopScreenShareButton = document.querySelector("#stop-screensahre");

// publisher.on("streamCreated", function (event) {
//   console.log("The publisher started streaming.");
// });

function initializeSession(apiKey, sessionId, token) {
  const session = OT.initSession(apiKey, sessionId);
  // Subscribe to a newly created stream
  session.on("streamCreated", function (event) {
    console.log(event.stream)
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
        name: "user stream"
      },
      handleError
    );
  });
  // Create a publisher
  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      name: "just a publisher",
      width: "100%",
      height: "100%",
    },
    handleError
  );
  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
  
  sendMessagesInChat(session)

  screenShareButton.addEventListener("click", () => {
    shareScreen(session, "start");
  });

  stopScreenShareButton.addEventListener("click", () => {
    shareScreen(session, "stop");
  });
}


function shareScreen(session, state) {
  const screenSharingPublisher = OT.initPublisher(
    "screen-preview",
    {
      insertMode: "append",
      name: "screenShare",
      videoSource: "screen",
      width: "100%",
      height: "100%",
    },
    handleError
  );
  if (state === "stop") {
    session.unpublish()
    preventDefault(screenSharingPublisher)
  }
  OT.checkScreenSharingCapability(function (response) {
    if (!response.supported || response.extensionRegistered === false) {
      // This browser does not support screen sharing.
    } else if (response.extensionInstalled === false) {
      // Prompt to install the extension.
    } else {
      session.publish(screenSharingPublisher);
    }
  });
 
}
function sendMessagesInChat(session) {
  // chat section
  var msgHistory = document.querySelector("#history");
  session.on("signal:msg", function signalCallback(event) {
    var msg = document.createElement("p");
    msg.textContent = event.data;
    msg.className =
      event.from.connectionId === session.connection.connectionId
        ? "mine"
        : "theirs";
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });
  // Text chat
  var form = document.querySelector("form");
  var msgTxt = document.querySelector("#msgTxt");

  // Send a signal once the user enters data in the form
  form.addEventListener("submit", function submit(event) {
    event.preventDefault();

    session.signal(
      {
        type: "msg",
        data: msgTxt.value,
      },
      function signalCallback(error) {
        if (error) {
          console.error("Error sending signal:", error.name, error.message);
        } else {
          msgTxt.value = "";
        }
      }
    );
  });
}
// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    console.error(error.message);
  }
}


const url = "http://localhost:8080/";

fetch(url)
  .then((data) => data.json())
  .then((data) => {
    const { apiKey, sessionId, token } = data;
    initializeSession(apiKey, sessionId, token);
  });
