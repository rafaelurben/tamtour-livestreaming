# tamtour-livestreaming

This is a tool used to control and display overlay animations in OBS Studio from a web browser. It is used for
the [TamTour Trophy Live Streams](https://youtube.com/@tamtour_trophy).

This project is no longer in active development because the TamTour Trophy ended.
See [retrospective](docs/diverses/retrospective.md) for my thoughts about this project.

## Repo content

This repository contains the following parts:

- `controlpanel`: The control panel page: controls OBS Studio, the browser source and the ATEM video mixer
- `browsersource`: The page loaded as a browser source in OBS Studio to display overlays
- `startlistmanager`: A Django app to manage the start lists and YouTube live streams
- `switcherproxy`: A proxy that connects to an ATEM video mixer
- `docs`: Documentation

## Technical details

See [docs folder](docs/index.md) (or [HTML version](https://rafaelurben.ch/tamtour-livestreaming)) for more information
about the individual parts and their technical details.

### Debugging the browser source

- Open OBS Studio with the `--remote-debugging-port=9222` flag
- Open browser source debugger (<http://localhost:9222/>) in a Chromium-based browser
