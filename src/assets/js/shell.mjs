// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import { initializeNavigation } from './navigation.mjs';
import { initializeConsent } from './consent.mjs';
import { initializeMatomo } from './matomo.mjs';
import { debug } from './logger.mjs';

for (const initialize of [initializeNavigation, initializeConsent, initializeMatomo]) {
	try {
		initialize();
	} catch {
		debug('Shell', initialize.name + ' could not initialize');
	}
}
