# tamtour-livestreaming

This is a tool used to control and display overlay animations in OBS Studio from a web browser. It is used for
the [TamTour Trophy Live Streams](https://youtube.com/@tamtour_trophy).

This project is no longer in active development because the TamTour Trophy ended.
See [retrospective](docs/diverses/retrospective.md) for my thoughts about this project.

## Repo content

This repository contains the following parts:

- `controlpanel`: The control panel page
- `browsersource`: The page loaded as a browser source in OBS Studio to display overlays
- `startlistmanager`: A Django app to manage the start lists and YouTube live streams
- `switcherproxy`: A proxy that connects to an ATEM video mixer
- `docs`: Documentation

## Technical details

The control panel sends commands to the OBS Studio websocket
server ([obs-websocket](https://github.com/obsproject/obs-websocket))
via [obs-websocket-js](https://github.com/obs-websocket-community-projects/obs-websocket-js). The browser
source ([obs-browser](https://github.com/obsproject/obs-browser)) receives the commands as events and displays the
overlay accordingly.

### Debugging the browser source

- Open OBS Studio with the `--remote-debugging-port=9222` flag
- Open browser source debugger (<http://localhost:9222/>) in a Chromium-based browser
