// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
export interface ExternalTraffic {
	all: string[];
	meta: string[];
	metaRequests: string[];
	listmonk: Array<{ method: string; url: string; body: string | null }>;
}
export interface SiteFixtures {
	traffic: ExternalTraffic;
	consoleProblems: string[];
	cspViolations: string[];
}
declare global {
	interface Window {
		reportCspViolation(detail: string): Promise<void>;
	}
}
