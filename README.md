# REEE

REcommendation Engine Extension

## How to install

The extension is not in Firefox's or Chrome's extension store yet.
It's still possible to try it using `about:debugging#/runtime/this-firefox` page in Firefox.
(Chrome support is coming soon.)

## 3rd-party libraries

> This extension doesn't use any 3rd-party libraries at all. However, a single third-party CSS (cascading style sheets) [file](https://www.google.com/url?q=https://github.com/andybrewer/mvp/blob/v1.7.3/mvp.css&sa=D&source=hangouts&ust=1627250707060000&usg=AFQjCNGh2OJ82r5cB8XGt_Br3br89C0HWw) is used: [MVP.css](https://andybrewer.github.io/mvp/).

This is what is written on main fork. This fork is different in this aspect. It uses some libs through Deno, and those are themselves use more libs, this is a mess.

## Development

### VS Code

Overall this is a folder for opening in VS Code including recommended extensions.
To build just use VS Code task, or do it manually (see the task's definition or the "Other editors" section here).

### Other editors

Of course, most likely it's easy to use any other editor, even if it doesn't have similar recommended extensions.
(Both recommendations are just minor conveniences so far.)
To build open terminal in _src folder and type `deno bundle _src/metamaskPrototype.js _build/metamask.bundle.js`.
