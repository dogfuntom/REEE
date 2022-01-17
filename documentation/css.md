CSS
===

A perfect CSS framework for the current stage of REEE development would be like this:

- Simple, not a huge monstrosity for big projects.
- Released, not alpha or beta or preview.
- Downloaded from GitHub (or similar), not CDN, not unpkg.
- Low priority:
  - Built-in-like¹ top menu with logo on the left and menu items on the right.
  - Built-in-like¹ full-width sections.
  - Automatic dark theme.

¹ Built-in-like means there's an example on how to do it.
Existence of such example shows that authors specifically aimed for compatibility with such a use case.
(However, anyway, usually it's not hard to override/extend the framework and do it without explicit support.)

Currently using
---

- Pico.css: has everything from the list above.
  - Full-width is explicitly supported with .container-fluid.
  - As a bonus, it has automatic dark mode.
  - Con: grid is poor, they recommend 3rd-party Flexbox or Bootstrap (grid-only) instead.
    And Flexbox is not a good fit for our case (not sure about Bootstrap).
    However, it's not a big deal because CSS Grid Layout is easy enough to use and fit to our needs directly (without any frameworks).

Almost a perfect fit
---

- Picnic CSS: seems to fit all the requirements listed above.
  - Top menu is implemented with outdated hacks. This decreases maintainability for no good reason.

Not much of a perfect fit
---

- BareCSS: top menu is hacky and not semantic; full-width is fake (only background is full-width).
- Bonsai.css: no top menu.
  (Instead, there's a left vertical menu. It's a good choice for them because they have a ton of menu items. But we have very few.)
- Marx: no low priorities.
- Skeleton: no low priorities.
