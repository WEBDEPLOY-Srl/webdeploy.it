# Accessibility

This is the accessibility statement for the public site at <https://webdeploy.it>, built from this
repository.

## Target

The site aims to meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) level AA. It is not claimed to conform
in full: the checks below find many problems but not all, and the known limits are listed further down.

## What the design provides

- A skip link to the main content, one `h1` per page and an English document language.
- Header disclosure buttons expose lists of links. Tab moves through them, arrow keys also move between links, and Escape closes a disclosure and restores focus. The mobile menu scrolls in landscape.
- Visible focus styles, and reduced-motion support for the animated decoration and the demos.
- Text and interface colours chosen for contrast on the dark background.

## How it is tested

Every push runs the Playwright suite in `src/e2e/` in Firefox and Chromium against production nginx (see [CONTRIBUTING.md](./CONTRIBUTING.md)):

- [axe-core](https://github.com/dequelabs/axe-core) scans every sitemap page, the confirmation page, the branded 404 and the cookie banner. All default rules run on each page. The newsletter test runs the complete rule set with consent visibly pending and after dismissal, and checks that both states cover the same rules. The home page with its banner visible also runs the WCAG A/AA checks. Any reported violation fails the check.
- Keyboard tests cover the header menus and the mobile menu.
- Every page is checked for one `h1`, a title, a description, and a clean browser console. Indexable pages have a canonical link.

Run `npm run build` in `src/`, start the production nginx image and run
`E2E_BASE_URL=http://127.0.0.1:18080 npm run test:e2e`. The no-JavaScript tests cover navigation,
the newsletter explanation and the 404 recovery link. Browser tests also exercise the form
at three phone sizes, equal consent controls, focus restoration, the product demos and map access.

Automated rules cover only part of WCAG. Changes to layout, navigation or interactive parts are also
checked with the keyboard in both browsers. Statement updated on 2026-11-18.

## Known limits

- No audit with a screen reader or by an external accessibility specialist has been carried out yet.
- The cookie banner is a complementary landmark named “Privacy & cookies” directly through its accessible label. It also contains a level-two heading for heading navigation. The measured banner height reserves scroll space for keyboard focus. On first appearance it leaves focus in place. Opening Cookie settings moves focus into the banner; Close, Escape and a decision return focus to the footer control.
- The contact page map is a third-party OpenStreetMap map (Leaflet). Its address is also given as text
  on the page. The map initializes on proximity or keyboard focus and uses Leaflet’s keyboard controls.
- The animated desktop and kiosk demos are decorative; they respect reduced-motion settings but have no
  text transcript of what they show.
- The retro look uses a pixel font and a scanline overlay that some readers may find harder to read;
  there is no switch to turn the overlay off.
- The site is available in English only.

## Feedback

If something on the site is hard or impossible to use, write to <info@webdeploy.it> with the page, what
you were trying to do and, if you can, your browser and assistive technology. You may also open an issue
in the repository. Reports are read and fixed in the order they affect people's ability to use the site.
