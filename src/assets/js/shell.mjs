// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { initializeNavigation } from './navigation.mjs';
import { initializeConsent } from './consent.mjs';
import { onIdle } from './activation.mjs';
import { debug } from './logger.mjs';

for (const initialize of [initializeConsent, initializeNavigation]) {
	try {
		initialize();
	} catch {
		debug('Shell', initialize.name + ' could not initialize');
	}
}

// Analytics still runs on a passive visit. Input and departure can start it sooner.
const startAnalytics = onIdle(() => {
	for (const event of ['pointerdown', 'keydown', 'pagehide']) window.removeEventListener(event, startAnalytics, true);
	void import('./matomo.mjs')
		.then(({ initializeMatomo }) => initializeMatomo())
		.catch(() => debug('Analytics', 'Cookieless tracking could not initialize'));
});
for (const event of ['pointerdown', 'keydown', 'pagehide']) window.addEventListener(event, startAnalytics, true);
