# Retrospective

My thoughts on the project and the TamTour livestreams in general.

## What went well?

- Single dashboard for multiple software/devices → easy to control and monitor
- Static control panel → easy to change stuff on the fly, no server needed
- OBS Websockets → very reliable and no need for an extra server for overlay control
- Overlays as static browser source → easy to create and modify
- External data management in start list manager → easy to change stuff on the fly
- ATEM control panel integration → easier to use than the buggy ATEM Control software

## What's not optimal?

- Control panel is a bit of a mess code-wise, as it's pure JavaScript/HTML/CSS
- The communication between control panel and browser source is a unidirectional event system, which makes it hard to
  keep track of the current state (e.g., which overlay is currently shown) and can lead to multiple overlays being shown
  at the same time or overlays dismissing one another.
- ATEM switcher integration is sometimes unstable due to the amount of requests. Websocket support would probably help,
  but it's not available in openswitcher proxy.

## What would I do differently next time?

- Use a modern framework for the control panel (React, Angular, ...) and use TypeScript instead of JavaScript.
- Use an already existing standard for overlays (like [OGraf](https://ograf.ebu.io/)) to help simplify the code.
- Look into ways to mix video directly in OBS Studio instead of using an external switcher. The ATEM Mini Pro is
  a great product, but it lacks advanced mixing features and its audio inputs are not optimal.

## Things that could have been added

- ATEM flying key: "transition to" command & presets
- Macro-Builder for complex actions
- Camera tally lights (e. g. using https://github.com/AronHetLam/ATEM_tally_light_with_ESP8266)
