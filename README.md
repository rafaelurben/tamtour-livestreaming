# tamtour-livestreaming

This is a tool used to control and display overlay animations in OBS Studio from a web browser. It is used for the [TamTour Trophy](https://tamtour.ch).

## Repo content

This repository contains the following parts:

- `browsersource`: The page loaded as a browser source in OBS Studio
- `controlpanel`: The control panel page
- `startlistmanager`: A Django app to manage the start lists
- `docs`: Documentation

## Setup

- Add the `browsersource/index.html` file as a browser source in OBS Studio
- Enable `Enable Websocket Server` in `Tools > obs-websocket settings` in OBS Studio
- Copy the password
- Open `controlpanel/index.html` in a browser and login with the password

## Technical details

The control panel sends commands to the OBS Studio websocket server ([obs-websocket](https://github.com/obsproject/obs-websocket)) via [obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js). The browser source ([obs-browser](https://github.com/obsproject/obs-browser)) receives the commands as events and displays the overlay accordingly.

### Debugging the browser source

- Open OBS Studio with the `--remote-debugging-port=9222` flag
- Open browser source debugger (<http://localhost:9222/>) in a Chromium-based browser
