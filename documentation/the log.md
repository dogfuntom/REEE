The Log
===

Contains non-categorized content.
Most important content should be categorized properly eventually.
The rest should be kept here, just in case.
Most recent is at the top.

Good news, `.mjs` files are treated the same as `.js` now
---

The problem described previously is no longer a problem.

Renamed all `.mjs` files to `.js`
---

It turns out `@ts-check` doesn't work with `.mjs` files
(more accurately, it can work in isolation but it fails to link globals.d.ts to it or import it in other files).

Without it, IntelliSense won't work too (again, more accurately, it will kinda barely work).

See also: <https://github.com/Microsoft/TypeScript/issues/27957>.

Tried `window.close()` instead of `browser.windows` API
---

Using the former leads to „leave page“ confirmation dialog,
which is a completely useless dialog in this case.

Removed all the Youtube Watchmarker code
---

(Together with jquery mentioned below.)

- It's not used in current version.
- It wasn't changed in any important way for our experiments so far.
- It won't be used in release version without heavy changes.
- It's always available at <https://github.com/sniklaus/youtube-watchmarker> for our inspiration.

Thus, there's no point in commiting it to git or being bound by its license.

jquery.js
---

Using full jquery is bad taste but it's not that important for an extension (as opposed to website),
so let's settle on jquery-slim.js compromise for now.
Later could migrate to Cash (because of TypeScript Types), Umbrella JS or Chibi.
But not Zepto (because Cash is better).
