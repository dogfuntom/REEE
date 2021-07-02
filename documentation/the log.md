The Log
===

Contains uncategorized content.
Most important content should be categorized properly eventually.
The rest should be kept here, just in case.
Most recent is at the top.

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
