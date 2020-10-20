const url = "http://localhost:8080/";

fetch(url)
  .then((data) => data.json())
  .then((data) => {
    const { apiKey, sessionId, token } = data;
    initializeSession(apiKey, sessionId, token);
  });

function initializeSession(apiKey, sessionId, token) {
  const session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on("streamCreated", function (event) {
    session.subscribe(
      event.stream,
      "subscriber",
      {
        insertMode: "append",
        width: "100%",
        height: "100%",
      },
      handleError
    );
  });

  let isScreenSharing = false

  const publisher = OT.initPublisher(
    "publisher",
    {
      insertMode: "append",
      width: "100%",
      height: "100%",
    },
    handleError
  );

  const screenSharePublisher = OT.initPublisher(
    "screen-preview",
    {
      videoSource: "screen",
      insertMode: "append",
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
      isScreenSharing ? session.publish(screenSharePublisher, handleError) : session.publish(publisher, handleError);
    }
  });

  // chat section
  let msgHistory = document.querySelector("#history");
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
  const form = document.querySelector("form");
  const msgTxt = document.querySelector("#msgTxt");

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

  // screen sahring
  const screenShareButton = document.querySelector("#start-screensahre");
  const stopScreenShareButton = document.querySelector("#stop-screensahre");
  
  console.log(stopScreenShareButton);
  screenShareButton.addEventListener("click", () => {
    // checkScreenSharingCapability(session);
    isScreenSharing = true
  });

  stopScreenShareButton.addEventListener("click", () => {
    isScreenSharing = false
  });
}

function checkScreenSharingCapability(session) {
  OT.checkScreenSharingCapability(function (response) {
    if (!response.supported || response.extensionRegistered === false) {
      // This browser does not support screen sharing.
    } else if (response.extensionInstalled === false) {
      // Prompt to install the extension.
    } else {
      // Screen sharing is available. Publish the screen.
      const publisher = OT.initPublisher(
        "screen-preview",
        { videoSource: "screen" },
        function (error) {
          if (error) {
            // Look at error.message to see what went wrong.
            handleError(error);
          } else {
            session.publish(publisher, function (error) {
              if (error) {
                // Look error.message to see what went wrong.
                handleError(error);
              }
            });
          }
        }
      );
    }
  });
}

// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
