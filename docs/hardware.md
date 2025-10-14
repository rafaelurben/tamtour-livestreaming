---
---

# Hardware

Zurück zur [Startseite](./index.md)

## Inhalt

- [Video](#video)
- [Audio](#audio)
- [Weitere Hardware](#weitere-hardware)
- [Verkabelungsdiagramm](#verkabelungsdiagramm)

## Video

### Videomischpult

Für das Livestreaming an der TamTour haben wir ein externes Videomischpult verwendet:

- [ATEM Mini Pro](https://www.blackmagicdesign.com/products/atemmini/techspecs/W-APS-14)
    - Auflösung: Full HD
    - Anschlüsse: 4x HDMI in, 1x HDMI out, 2x audio in (1/8" mini jack), 1x USB-C, 1x RJ45

### Kameras

Damit eine Kamera für dieses Setup geeignet ist, muss sie einen "Clean HDMI Output" unterstützen. Darunter versteht sich
die Fähigkeit, live Video ohne irgendwelche Bedienelemente über den (mini/micro) HDMI-Ausgang zu übertragen. Für
Canon-Kameras befindet sich zum
Beispiel [hier](https://www.canon-europe.com/pro/infobank/which-camera-which-features/#id_2191629) eine Liste
unterstützter Kameras.

Folgende Kameras haben wir in diesem Setup erfolgreich verwendet und getestet:

- [Canon EOS 5d Mark IV](https://de.canon.ch/cameras/eos-5d-mark-iv/specifications/)
    - **Verwendung**: Hauptkamera / Zoom
    - **Video-Anschluss**: HDMI mini (Full HD)
    - **Stromversorgung**: Gleichstromkuppler (Separat erhältlich)
    - **Weitere Anschlüsse**: Audio jack in/out (3.5 mm)
- [Canon EOS R7](https://de.canon.ch/cameras/eos-r7/specifications/)
    - **Verwendung**: Hauptkamera / Zoom
    - **Video-Anschluss**: HDMI mini (Full HD)
    - **Stromversorgung**: Gleichstromkuppler (Separat erhältlich)
    - **Weitere Anschlüsse**: Audio jack in/out (3.5 mm)
- [GoPro Hero 4 Black/Silver](https://gopro.com/en/us/news/gopro-introduces-hero4-the-most-powerful-gopro-lineup-ever)
    - **Verwendung**: Bühnenrand / Weitwinkel
    - **Video-Anschluss**: HDMI micro (Full HD)
    - **Stromversorgung**: USB mini-B (Kabel separat erhältlich)
    - **Anmerkungen**: Problem mit Überhitzung bei längeren Aufnahmen, Qualität nicht optimal
- [Sony HDR-CX405](https://www.sony.ch/de/electronics/handycam-camcorder/hdr-cx405/specifications)
    - **Verwendung**: Hauptkamera / Zoom
    - **Video-Anschluss**: HDMI micro (Full HD, ohne Audio)
    - **Stromversorgung**: USB micro-B (Kabel separat erhältlich)
- [Zoom Q2n 4K](https://zoomcorp.com/media/documents/D_Q2n-4K_manual.pdf)
    - **Verwendung**: Übersicht / Weitwinkel
    - **Video-Anschluss**: HDMI micro (Full HD)
    - **Stromversorgung**: USB micro-B (Kabel separat erhältlich)
    - **Weitere Anschlüsse**: Audio jack in/out (3.5 mm)

### Video-Zubehör

- [HDMI(m) - HDMI(m) Kabel, 50m optisch (Transmedia)](https://www.digitec.ch/de/s1/product/13019665)
- HDMI(m) - HDMI(m) Kabel, 30m optisch
- HDMI(m) - HDMI(m) Kabel
- [Delock HDMI(f) - micro HDMI(m), 0.23m](https://www.digitec.ch/de/s1/product/8599105)
- [Ugreen HDMI(f) - HDMI(f)](https://www.digitec.ch/de/s1/product/20685674)
- Stative für Kameras
  - Für leichte Kameras tun's auch Mikrofonstative (z. B. König & Meyer)
- Bildschirm(e) zu Monitoring-Zwecken

**Tipp**: Optische Kabel sind wesentlich zuverlässiger bei Längen über 10m.

**Achtung**: Optische HDMI-Kabel sind typischerweise unidirektional! 

## Audio

Das Audio-Setup kann sich je nach Veranstaltungsort stark unterscheiden.

### Mikrofone

- (2x) [Sennheiser e945, Dynamisch, Superniere](https://www.sennheiser.com/de-de/catalog/products/mikrofon/e-945/e-945-009422)
  für die Instrumente auf der Bühne
- Funkmikrofone je nach Veranstaltungsort

### Audio-Zubehör

- Mikrofonstative (König & Meyer)
- XLR-Kabel (20m)
- (mini Jack zu 2x XLRf y-Kabel)
- Adapter zur Verbindung mit der lokalen Audioanlage
- Audiomischpult (z. B. [Behringer X32 Producer](https://www.behringer.com/behringer/product?modelCode=0603-ADP))

## Weitere Hardware

### Streaming-Laptop/PC

Ein Laptop (oder PC) dient als Steuer- und Livestreaming-Gerät. Das Gerät sollte folgende Spezifikationen aufweisen:

- Einigermassen aktuelle und professionelle Hardware
- Mind. 1 freier USB-C-Anschluss
- Empfohlen: RJ45-Anschluss oder entsprechender Adapter
- Empfohlen: HDMI-Anschluss oder entsprechender Adapter

### Zubehör

- Steckerleisten, Kabelrollen, Verlängerungskabel
- Kabelmanagement-Utensilien (Klebeband, Klett, etc.)
- Netzwerkequipment (Kabel, Router, ...) zur Herstellung einer Internetverbindung

## Verkabelungsdiagramm

### Einfaches Setup

Das einfachste Setup sieht folgendermassen aus.

- **Vorteil**: Einfaches Setup, wenig zusätzliche Hardware notwendig.
- **Nachteil**: Störsignale aufgrund von unsymmetrischem Audio-Signal.

[![Hardware setup](./assets/hardware-setup.svg)](./assets/hardware-setup.svg)

(Bild anklicken, um gross anzusehen / als Vektorgrafik herunterzuladen.)

### Professionelleres Setup

In einem professionelleren Setup kann das Audio direkt aus dem Mischpult via Dante und der Dante Virtual Soundcard bzw.
der Open-Source-Alternative [Inferno](https://github.com/teodly/inferno) in den Streaming-Laptop/PC eingespeist werden.
Somit wird alles Audio symmetrisch übertragen und Störsignale werden minimiert. Die Mikrofone werden dabei direkt an das
Mischpult angeschlossen.

- **Vorteil**: Bessere Audioqualität, weniger Störsignale.
- **Nachteil**: Etwas komplexeres Setup, zusätzliche Hardware notwendig.
