// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only

export type Category = 'performance' | 'accessibility' | 'best-practices' | 'seo';
export type Preset = 'mobile' | 'desktop';
export interface AuditReference { id: string; weight: number }
export interface Console404 {
	audit: 'errors-in-console';
	source: 'network';
	description: string;
	evidence: string;
}
export interface PerformanceExpectation {
	preset: 'mobile';
	audits: ['total-blocking-time'];
	trackerScript: string;
	collectionEndpoint: string;
	adapterCreditDecision: string;
	profiledCallers: Array<{path: string; evidence: string}>;
	decisionDate: string;
}
export interface Expectations {
	performance99: PerformanceExpectation;
	pages: Record<string, {seo: string[]; mainDocument404?: Console404}>;
}
export interface AuditItem {
	url?: string;
	statusCode?: number;
	resourceType?: string;
	startTime?: number;
	source?: string;
	description?: string;
	sourceLocation?: {type?: string; url?: string; urlProvider?: string};
	total?: number;
	scripting?: number;
	mainThreadTime?: number;
	subItems?: {items?: AuditItem[]};
}
export interface LongTask {urlIndex: number; startTime: number; duration: number}
export interface PerformanceAttribution {
	trackerScript: string;
	profiledCaller?: string;
	trackerBootupMs: number;
	callerScriptingMs: number;
	thirdPartyMainThreadMs: number;
	reportedTbtMs: number;
	windowBlockingMs: number;
	trackerBlockingMs: number;
	pairedCallerBlockingMs: number;
	creditedBlockingMs: number;
	dominates: boolean;
}
export interface AuditResult {
	score: number | null;
	scoreDisplayMode?: string;
	numericValue?: number;
	details?: {items?: AuditItem[]; debugData?: {urls: string[]; tasks: LongTask[]}};
}
export interface LighthouseReport {
	lighthouseVersion: string;
	requestedUrl: string;
	finalDisplayedUrl: string;
	fetchTime: string;
	environment?: {hostUserAgent?: string; benchmarkIndex?: number};
	configSettings: {
		formFactor: Preset;
		throttlingMethod: string;
		throttling?: {rttMs: number; throughputKbps: number; cpuSlowdownMultiplier: number};
		screenEmulation?: {mobile: boolean; width: number; height: number; deviceScaleFactor: number; disabled: boolean};
		disableStorageReset?: boolean;
		blockedUrlPatterns?: string[] | null;
	};
	runtimeError?: {code: string; message: string};
	categories: Record<Category, {score: number | null; auditRefs: AuditReference[]}>;
	audits: Record<string, AuditResult>;
}
export interface LabConditions {
	startedUtc: string;
	finishedUtc: string;
	load1Start: number;
	load1End: number;
	cpuIdlePercent: number | null;
	benchmarkIndex: number | null;
}
export interface AuditCell {
	lab?: LabConditions;
	measurement?: MeasurementRecord;
	performanceAttribution?: PerformanceAttribution;
	adapterNotice?: string;
	path: string;
	preset: Preset;
	scores: Record<Category, number | null>;
	exceptions: string[];
	failures: string[];
	metrics: Record<string, number | null>;
	requests: {matomo: number; matomoScript: number; matomoTracking: number; meta: number; tiles: number};
}
export interface GateManifest {
	revision: string;
	sourceState: 'commit' | 'working-tree';
	sourceTree?: string;
	measurementPolicy?: {minimumBenchmark:number;runtimeRetries:number;degradedRetries:number;cellQuietMs:number};
	origin: string;
	version: string;
	chrome: string;
	node: string;
	platform: string;
	browserImage: string;
	browserSha256: string;
	lockSha256: string;
	imageId?: string;
	matrix: string[];
	responses: Record<string, {status: number; noindex: boolean}>;
}

export interface HostReading {
	utc: string;
	time: number;
	load1: number;
	idle: number;
	total: number;
}
export interface QuietInterval {
	utc: string;
	load1Start: number;
	load1End: number;
	idlePercent: number;
	durationMs: number;
}
export interface QuietWindow {
	qualified: boolean;
	waitedMs: number;
	requiredMs: number;
	consecutiveMs: number;
	samples: QuietInterval[];
}
export interface WaitBudget { remainingMs: number }
export interface Measurement {
	exitCode: number;
	report: LighthouseReport | null;
	lab: LabConditions;
}
export type AttemptStatus = 'measured' | 'runtime-error' | 'host-degraded' | 'host-timeout';
export interface MeasurementAttempt {
	number: number;
	status: AttemptStatus;
	reason: string;
	hostDegraded: boolean;
	exitCode: number | null;
	benchmarkIndex: number | null;
	raw: string | null;
	log: string | null;
	conditions: string | null;
	quiet: string;
}
export interface MeasurementRecord {
	path: string;
	preset: Preset;
	ordinary404: boolean;
	selected: number | null;
	outcome: AttemptStatus;
	attempts: MeasurementAttempt[];
}
