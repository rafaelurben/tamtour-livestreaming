# pyatem-proxy

The `pyatem-proxy.exe` is a simplified and bundled version of the [openswitcher-proxy](https://docs.openswitcher.org/proxy.html) module of the [pyatem](https://git.sr.ht/~martijnbraam/pyatem) library.
It has been created using [pyinstaller](https://pypi.org/project/pyinstaller/) on Windows 11.

I have absolutely no clue how to use c modules in python, so I just deleted the mediaconvertmodule.c file and removed all references to it.
If it doesn't work, it's because I'm clueless.

## Usage

- Download <a href="./pyatem-proxy.exe" download>pyatem-proxy.exe</a>
- Download the <a href="./proxy.toml" download>proxy.toml</a> config file and edit it to your needs
- See [here](https://docs.openswitcher.org/proxy.html) for configuration options
- Run `pyatem-proxy.exe` in the same directory as the `proxy.toml` file
