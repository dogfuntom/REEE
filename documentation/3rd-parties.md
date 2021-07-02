Third-party libraries
===

- [MVP.css v1.7.3](https://github.com/andybrewer/mvp/blob/v1.7.3/mvp.css) : Technically, it's not even a library, but including it here just in case.

Chrome version
---

Note that there's no Chrome version yet, it's just a plan for the future.

And the plan is simple: use the [polyfill for `browser.*`](https://github.com/mozilla/webextension-polyfill).

Technically, it's safe to include it in Firefox version too. But in practice it may result in failed review because reviewer may consider it 3rd-party and not a stable release (because atm there's no stable release of this polyfill).
