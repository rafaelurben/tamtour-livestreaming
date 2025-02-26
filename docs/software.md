---
---

# Software

Zurück zur [Startseite](./index.md)

## Software-Komponenten

### Open Broadcaster Studio (OBS)

[OBS Studio](https://obsproject.com/) ist ein beliebtes Open Source Projekt für Videoaufnahmen und Live-Streaming.

- OBS setzt das Video und Overlays zusammen und überträgt den Stream auf YouTube.
- Die Ausgabe des [ATEM Mini Pro](./hardware.md#videomischpult) gelangt über USB als Webcam- & Mikrofon-Input in OBS.
- Die Overlays stammen aus der **Browser-Quelle** und werden durch das [Control Panel](#control-panel) gesteuert.
- OBS kann Übergangsanimationen einblenden. (→ Siehe auch [OBS-Stinger](./diverses/obs-stinger.md))

### Overlay Browser-Quelle

Die Browser-Quelle in OBS (<https://rafaelurben.ch/tamtour-livestreaming/browsersource/>) kann Overlays einblenden, wenn
sie über das C**ontrol Panel** entsprechend gesteuert wird.

### Switcher-proxy

Der [switcher-proxy](https://rafaelurben.ch/tamtour-livestreaming/switcherproxy/) stellt über das Netzwerk eine
Verbindung zum **ATEM Mini Pro** her und ermöglicht es, dieses über eine einfachere Schnittstelle vom **Control Panel**
aus zu steuern.

### Startlisten-Manager

Der [Startlisten-Manager](https://app.rafaelurben.ch/admin/tamtour_startlistmanager/) dient dazu, die Startlisten- und
Startinfo-Overlays zu planen. Ausserdem dient er zur Erstellung und Aktualisierung der geplanten Live-Streams auf
YouTube.

### Control Panel

Das [Control panel](https://rafaelurben.ch/tamtour-livestreaming/controlpanel/) vereint diverse Komponenten als zentrale
Steuereinheit. Über dieses...

- werden Startlisten aus dem **Startlisten-Manager** geladen.
- wird **OBS Studio** und die **Overlay Browser-Quelle** darin gesteuert.
- wird via **switcher-proxy** das ATEM Mini Pro gesteuert.

Für ein optimales Erlebnis sollte das Control Panel direkt auf dem Streaming-Laptop geöffnet werden. Dies ist jedoch
nicht zwingend notwendig, benötigt anderenfalls aber weitere Netzwerkkonfigurationen.

## Einrichtung (vereinfacht)

Voraussetzung: Hardware verbunden und ATEM Mini Pro eingeschaltet.

1. OBS einrichten
    1. OBS-Studio herunterladen öffnen
    2. Gewünschte Szenen einrichten
    3. Browser-Quelle in OBS Studio hinzufügen
    4. OBS Websocket-Server aktivieren (`Enable Websocket Server` in `Tools > obs-websocket settings`)
    5. Streaming-Key hinterlegen
2. switcher-proxy einrichten
    1. switcher-proxy & Konfigurationsdatei herunterladen
    2. Konfigurationsdatei korrekt befüllen
    3. switcher-proxy starten
3. Startlistenmanager einrichten
    1. In Startlistenmanager einloggen
    2. API-Key erstellen
4. Control panel einrichten
    1. Control panel öffnen
    2. Mit OBS verbinden
    3. Mit ATEM verbinden
    4. Mit API (Startlistenmanager) verbinden
5. GO!
