# switcher-proxy

In order to connect to an ATEM video mixer from the control panel, the panel requires a proxy that can handle HTTP
requests to communicate with the mixer.

For that, `openswitcher-proxy` (part of the `pyatem` / Open Switcher project) is used.

Links to the original project:

- Homepage: <https://openswitcher.org/>
- Docs: <https://docs.openswitcher.org/>
- Source: <https://git.sr.ht/~martijnbraam/pyatem>

## Modified version

In order to incorporate some small changes, a fork has been created.

- Source: <https://github.com/rafaelurben/pyatem>

Changes made to the original version:

- Added bulk commands to get faster and more efficient responses
- Fixed a small issue with wrong datatypes that led to server errors when trying to change ColorGenerator colors
- Allow cross-origin requests

### Linux

```bash
sudo apt-get install git python3 python3-pip python3-setuptools python3-usb python3-zeroconf libhandy-1-dev cmake meson
git clone https://github.com/rafaelurben/pyatem
cd pyatem
sudo cp 100-blackmagicdesign.rules /etc/udev/rules.d/100-blackmagicdesign.rules
sudo ./openswitcher-install.sh
```

Usage:

- Run the above commands to install everything
- Download the <a href="./proxy.toml" download>proxy.toml</a> config file and edit it to your needs
- Run `openswitcher-proxy --config path/to/proxy.toml`

### Windows

The `pyatem-proxy.exe` is a simplified and bundled version of
the [openswitcher-proxy](https://docs.openswitcher.org/proxy.html) module.

The file has been created using [pyinstaller](https://pypi.org/project/pyinstaller/) on Windows 11.

Usage: 

- Download <a href="./pyatem-proxy.exe" download>pyatem-proxy.exe</a>
- Download the <a href="./proxy.toml" download>proxy.toml</a> config file and edit it to your needs
- Run `pyatem-proxy.exe` in the same directory as the `proxy.toml` file

## Configuration

See [docs](https://docs.openswitcher.org/proxy.html) for configuration options
