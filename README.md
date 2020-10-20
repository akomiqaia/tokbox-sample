# Tokbox-sample


## How to run? 

- `cd` into backend and run `yarn` and then `yarn start`. this will start node server on localhost 8080.
- Then just open `index.html` in your browser



## Challenges to do

- [x] Enable users to connect to each other
- [x] Enable chat functionality in the video call
- [ ] Enable Screen sharing 



## Challenges encountered

1. Can not workout how to stop screen sharing. 
    - then replace the video camera view of the user with a screen share.

The documentation mentions ```"You can publish a stream that uses a video view of your screen (instead of a camera) as the  source. A client connected to the session can subscribe to the stream (and view it), just as they  would subscribe to a stream that uses a camera as the source."``` 

Based on this when we want to screen share we have to detect the publisher type and display either user camera view or the screen view.