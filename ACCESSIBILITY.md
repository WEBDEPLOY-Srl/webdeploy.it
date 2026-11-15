# Accessibility

This is the accessibility statement for the public site at <https://webdeploy.it>, built from this
repository.

## Target

The site aims to meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA. It is not claimed to conform
in full: the checks below find many problems but not all, and the known limits are listed further down.

## What the design provides

- A skip link to the main content, one `h1` per page and a document language that follows the visible
  language.
- Header menus and the mobile menu work from the keyboard: arrow keys move between items, Escape closes
  a menu and returns focus to its button.
- Visible focus styles, and reduced-motion support for the animated decoration and the demos.
- Text and interface colours chosen for contrast on the dark background.

## How it is tested

Every push runs the Playwright suite in `src/e2e/` in Firefox and Chromium against the production
build (see [CONTRIBUTING.md](./CONTRIBUTING.md)):

- [axe-core](https://github.com/dequelabs/axe-core) scans every page listed in the sitemap, and the cookie
  banner, against the WCAG 2.0, 2.1 and 2.2 A and AA rules. The build fails on any serious or critical
  violation.
- Keyboard tests cover the header menus and the mobile menu.
- Every page is checked for one `h1`, a title, a canonical link and a clean browser console.

Run it locally with `npm run build && npm run test:e2e` in `src/`.

Automated rules cover only part of WCAG. Changes to layout, navigation or interactive parts are also
checked by hand with the keyboard in both browsers. Last reviewed: 2026-11-15.

## Known limits

- No audit with a screen reader or by an external accessibility specialist has been carried out yet.
- The cookie banner is announced as a dialog but does not move focus into itself when it appears.
- The contact page map is a third-party OpenStreetMap map (Leaflet). Its address is also given as text
  on the page, but the map itself offers only the keyboard support Leaflet provides.
- The animated desktop and kiosk demos are decorative; they respect reduced-motion settings but have no
  text transcript of what they show.
- The retro look uses a pixel font and a scanline overlay that some readers may find harder to read;
  there is no switch to turn the overlay off.
- The site is available in English only.

## Feedback

If something on the site is hard or impossible to use, write to <info@webdeploy.it> with the page, what
you were trying to do and, if you can, your browser and assistive technology. You may also open an issue
in the repository. Reports are read and fixed in the order they affect people's ability to use the site.
