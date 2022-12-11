# tamtour-overlay-system

This is a tool used to control and display overlay animations in OBS Studio from a web browser. It is used for the [TamTour Trophy](https://tamtour.ch).

## Setup

- Add the `source.html` file as a browser source in OBS Studio
- Enable `Enable Websocket Server` in `Tools > obs-websocket settings` in OBS Studio
- Copy the password
- Open `source.html` in a browser and login with the password

## Debugging

- Open OBS Studio with the `--remote-debugging-port=9222` flag
- Open browser source debugger (<http://localhost:9222/>) in a Chromium-based browser

## Folder structure

- tamtour-overlay-system
  - README.md (this file)
  - browsersource
    - source.html (Add as OBS Studio browser source)
    - static
      - css
        - fonts.css
      - js
        - overlay.js
  - controlpanel
    - control.html (Open in browser)
    - static
      - css
        - fonts.css
      - js
        - connection.js
        - obs-ws.min.js
  - resources (Not in repository, add manually)
    - fonts
      - Arial-Rounded-MT-Bold.ttf
    - overlays
      - default.png
    - names.json
    - sponsorsvideo.webm
