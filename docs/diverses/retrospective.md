# Retrospective

My thoughts on the project and the TamTour livestreams in general.

All livestreams are available on [YouTube](https://www.youtube.com/@tamtour_trophy). Note: This system was not used from
the beginning and evolved over time.

<!-- TOC -->
* [Retrospective](#retrospective)
  * [What went well?](#what-went-well)
  * [What's not optimal?](#whats-not-optimal)
  * [What would I do differently next time?](#what-would-i-do-differently-next-time)
  * [Things that could have been added (in the current setup)](#things-that-could-have-been-added-in-the-current-setup)
  * [What's the optimal setup for a livestream like this?](#whats-the-optimal-setup-for-a-livestream-like-this)
<!-- TOC -->

## What went well?

- Single dashboard for multiple software/devices → easy to control and monitor
- Static control panel → easy to change stuff on the fly, no server needed
- OBS Websockets → very reliable and no need for an extra server for overlay control
- Overlays as static browser source → easy to create and modify
- External data management in start list manager → easy to change stuff from another device on the fly
- ATEM control panel integration → easier to use than the buggy ATEM Control software
- Dante audio via [Inferno](https://gitlab.com/lumifaza/inferno).
- Usage of [OBS teleport plugin](https://github.com/fzwoch/obs-teleport) to send video between multiple
  OBS Studio instances → easy to separate scenes for different purposes (e. g. main stream and projector)

## What's not optimal?

- Control panel is a bit of a mess code-wise, as it's pure JavaScript/HTML/CSS
- The communication between control panel and browser source is a unidirectional event system, which makes it hard to
  keep track of the current state (e.g., which overlay is currently shown) and can lead to multiple overlays being shown
  at the same time or overlays dismissing one another.
- ATEM switcher integration is sometimes unstable due to the amount of requests. Batch support fixed most issues,
  though. Websocket support would probably help, but it's not available in openswitcher proxy.
- Usage of moderator microphone equipment in older venues led to multiple issues. It's better to have a dedicated
  setup for the livestream that is independent of the venue's equipment.

## What would I do differently next time?

- Use a modern framework for the control panel (React, Angular, ...) and use TypeScript instead of JavaScript.
- Use an already existing standard for overlays (like [OGraf](https://ograf.ebu.io/)) to help simplify the code.
- Use a local server (e. g. Node.js) to manage the connections with all software/devices to make it easier to control
  everything from one place without configuring everything multiple times. This would also simplify the usage of a
  Stream Deck or similar.
- Look into ways to mix video directly in OBS Studio instead of using an external switcher. The ATEM Mini Pro is
  a great product, but it lacks advanced mixing features and its audio inputs are not optimal.

## Things that could have been added (in the current setup)

- Control panel:
    - ATEM flying key: "transition to" command & presets
    - Macro-Builder for complex actions
    - Manual YT timestamp entry creation
- Camera tally lights (e. g. using <https://www.tallyarbiter.com/>
  or <https://github.com/AronHetLam/ATEM_tally_light_with_ESP8266>)
- Spotify integration (e. g. song management, current track display, control playback)

## What's the optimal setup for a livestream like this?

- **Local server**: A local server as a proxy / central hub for all external connections and state management.
    - OBS Studio via Websockets (possibly multiple instances)
    - Start list manager via its API
    - Spotify via its API
    - Event sourced
- **Control panel**: Modern framework, communicates only with the local server via Websockets.
- **Audio**: Only digital via Dante and DVS (Dante Virtual Soundcard) or open source alternatives
  like [Inferno](https://gitlab.com/lumifaza/inferno).
- **Video**: Converted to IP streams as early as possible and mixed directly in OBS Studio.
    - Usage of OBS multiview.
    - [OBS teleport plugin](https://github.com/fzwoch/obs-teleport) if multiple OBS instances are used that need to
      share video sources (e.g. for projector output).
- **Stream Deck**: An Elgato Stream Deck (or similar) for easy control of different systems.
    - e.g. using [Bitfocus Companion](https://bitfocus.io/companion) to support many services
    - integration with the local server for custom actions
    - connection with lightning control system (e.g. via ArtNet > DMX)
- **Intercom**: Dedicated intercom system for communication between the crew members.
- No external video switcher.
