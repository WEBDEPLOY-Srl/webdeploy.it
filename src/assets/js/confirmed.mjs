// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { newsletterEvent } from './matomo.mjs';

let origin = '';
try {
	origin = new URL(document.referrer).origin;
} catch {
	/* Direct visits have no referrer. */
}
if (origin === 'https://newsletter.webdeploy.it') newsletterEvent('newsletter_confirmed');
