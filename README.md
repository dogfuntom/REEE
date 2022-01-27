# REEE

REcommendation Engine Extension

## 3rd-party libraries

- [MVP.css](https://github.com/andybrewer/mvp/blob/v1.8/mvp.css) (Technically, not a library, but still listed here just in case.)
- [Pico.css](https://github.com/picocss/pico/blob/v1.4.3/css/pico.css) (Technically, not a library, but still listed here just in case.)
- The tree of dependencies that entails from [package.json](MetaMask/package.json).

## Branches

The main branch is Chrome branch.
(In the past, it was the opposite, Firefox version was the main branch.)

The difference required for publishing a Firefox release:

- webextension-polyfill must be removed (itself and from manifest).
  (Extensions that depend on early-access 3rd-parties will be rejected, and webextension-polyfill didn't reach 1.0 release yet.)

NOTE: Chrome warns that it doesn't understand `browser_specific_setting` in manifest.json.
It's harmless, ignore it. (This is the only con of having main branch == Chrome branch, instead of making a separate Chrome branch.)

## Development

### VS Code

Overall this is a folder for opening in VS Code including recommended extensions.

### Other editors

Most likely it's easy to use any other editor, even if it doesn't have similar recommended extensions.
(The recommended extensions are just minor conveniences atm.)
