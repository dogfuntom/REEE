# REEE

## Branch-specific notes

This branch is intended to be used as a, so to speak, running last commit.
Meaning, as long as possible, it should be just a single own commit.
This single commit stores only changes needed to "convert" main codebase into Firefox-compatible codebase.
To pull new changes from main to Firefox, use rebase or merge.

---

REcommendation Engine Extension

## 3rd-party libraries

- [MVP.css](https://github.com/andybrewer/mvp/blob/v1.8/mvp.css) (Technically, not a library, but still listed here just in case.)
- [Pico.css](https://github.com/picocss/pico/blob/v1.4.3/css/pico.css) (Technically, not a library, but still listed here just in case.)
- The tree of dependencies that entails from [package.json](MetaMask/package.json).

## Branches

The main branch is Chrome branch.
(In the past, it was the opposite, Firefox version was the main branch.)

How to make Firefox branch or Firefox release:

- Remove Metamask code and UI.
- Remove webextension-polyfill (itself and from manifest).

NOTE: Chrome warns that it doesn't understand `browser_specific_setting` in manifest.json.
It's harmless, ignore it. (This the only con of having main branch = Chrome branch, instead of making a separate Chrome branch.)

## Development

### VS Code

Overall this is a folder for opening in VS Code including recommended extensions.
To build use VS Code task, or do it manually (see the task's definition or the "Other editors" section here).

### Other editors

Most likely it's easy to use any other editor, even if it doesn't have similar recommended extensions.
(Both recommended extensions are just minor conveniences atm.)
To build do manually the same thing as described in <.vscode/tasks.json>.
