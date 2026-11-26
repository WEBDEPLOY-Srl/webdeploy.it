// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { assess, categories, missingPath, targets, version } from '../scripts/lighthouse-gate.mjs';
import { sitemap } from '../build-tools/documents.mjs';
import { pages } from '../data/pages.mjs';
import { site } from '../data/site.mjs';

/** @typedef {import('../scripts/lighthouse-types.d.ts').LighthouseReport} Report */
/** @type {import('../scripts/lighthouse-types.d.ts').Expectations} */
const expectations = JSON.parse(await readFile(new URL('../scripts/lighthouse-expectations.json', import.meta.url), 'utf8'));

/** @param {string} path @returns {Report} */
function sample(path) {
	const origin = 'http://127.0.0.1:18080';
	const score = () => ({score: 1, auditRefs: [{id:'ordinary', weight:1}]});
	const {trackerScript, collectionEndpoint} = expectations.performance99;
	const requests = [{url:origin+path,resourceType:'Document',statusCode:path===missingPath?404:200}];
	if (path !== missingPath) requests.push({url:trackerScript,resourceType:'Script',statusCode:200},
		{url:collectionEndpoint+'?rec=1',resourceType:'Ping',statusCode:204});
	return { lighthouseVersion: version, requestedUrl: origin + path, finalDisplayedUrl: origin + path,
		fetchTime: '2026-11-19T00:00:00Z', configSettings: {
			formFactor:'mobile', throttlingMethod:'simulate',
			screenEmulation:{mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},
			throttling:{rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4}
		},
		categories: {performance:score(),accessibility:score(),'best-practices':score(),seo:score()},
		audits: {ordinary:{score:1},'network-requests': {score:null,details:{items:requests}}} };
}

test('the Lighthouse inventory covers every declared location in both presets', () => {
	const paths = targets(sitemap(pages, site.url));
	assert.equal(paths.length, 15);
	assert.equal(new Set(paths).size, 15);
	assert.ok(paths.includes('/newsletter') && paths.includes('/newsletter/confirmed') && paths.includes(missingPath));
	assert.throws(() => targets('<urlset/>'), /inventory/);
	assert.deepEqual(Object.keys(expectations.pages).sort(), [missingPath, '/newsletter/confirmed']);
	assert.deepEqual(expectations.pages['/newsletter/confirmed'], {seo:['is-crawlable']});
	assert.deepEqual(expectations.pages[missingPath].seo, ['http-status-code','is-crawlable']);
	assert.ok(expectations.pages[missingPath].mainDocument404?.evidence.endsWith('/mobile/404.json'));
	assert.equal(expectations.performance99.preset, 'mobile');
	assert.deepEqual(expectations.performance99.audits, ['total-blocking-time']);
	assert.ok(expectations.performance99.profiledCallers.some(({path, evidence}) =>
		path === '/assets/build/0ed881c4c4798e9c/js/matomo.mjs' &&
		evidence === 'adapter-profiles/0ed881c4c4798e9c.json'
	));
	assert.ok(expectations.performance99.profiledCallers.some(({path, evidence}) =>
		path === '/assets/build/ea4fe3630e09b44d/js/matomo.mjs' &&
		evidence === 'adapter-profiles/ea4fe3630e09b44d.json'
	));
	assert.equal(expectations.newsMobilePerformance97.path, '/news');
	assert.equal(expectations.newsMobilePerformance97.preset, 'mobile');
	assert.equal(expectations.newsMobilePerformance97.minimumScore, 0.97);
	assert.deepEqual(expectations.newsMobilePerformance97.audits, ['largest-contentful-paint', 'total-blocking-time']);
});

test('a truthful 404 and noindex are the only approved SEO failures', () => {
	for (const path of ['/newsletter/confirmed', missingPath]) {
		const report = sample(path);
		report.categories.seo.score = 0.7;
		for (const id of expectations.pages[path].seo) {
			report.categories.seo.auditRefs.push({id,weight:1});
			report.audits[id] = {score:0};
		}
		const check = (/** @type {boolean} */ strict) => assess(report, report.requestedUrl, 'mobile', expectations, strict);
		assert.deepEqual(check(false).failures, []);
		assert.deepEqual(check(false).exceptions, expectations.pages[path].seo);
		assert.equal(check(true).failures.length, 1);
		report.categories.seo.auditRefs.push({id:'another-failure',weight:1});
		report.audits['another-failure'] = {score:0};
		assert.equal(check(false).failures.length, 1);
	}
});

test('the quality gate fails low, missing, wrong-route or unscorable results and premature marketing', () => {
	const report = sample('/');
	const check = () => assess(report, report.requestedUrl, 'mobile', expectations, false);
	assert.deepEqual(check().failures, []);
	for (const category of categories) {
		report.categories[category].score = 0.99999;
		assert.equal(check().failures.length, 1);
		report.categories[category].score = 1;
	}
	report.categories.performance.score = null;
	assert.ok(check().failures.some((reason) => reason.includes('Unscorable')));
	report.categories.performance.score = 1;
	report.finalDisplayedUrl += 'wrong';
	report.configSettings.formFactor = 'desktop';
	report.runtimeError = {code:'FAILED_DOCUMENT',message:'No document'};
	report.audits['network-requests'].details?.items?.push({url:'https://connect.facebook.net/example.js'});
	assert.equal(check().failures.length, 4);
});

test('only a single network console error for the exact missing document qualifies', () => {
	const report = sample(missingPath);
	const url = report.requestedUrl;
	const expected = expectations.pages[missingPath].mainDocument404;
	assert.ok(expected);
	const entry = {source:'network',description:expected.description,sourceLocation:{type:'source-location',urlProvider:'network',url}};
	report.categories['best-practices'] = {score:0.96,auditRefs:[{id:'errors-in-console',weight:1}]};
	const items = [entry];
	report.audits['errors-in-console'] = {score:0,details:{items}};
	const check = () => assess(report,url,'mobile',expectations,false);
	assert.deepEqual(check().exceptions, ['errors-in-console']);
	assert.equal(assess(report,url,'mobile',expectations,true).failures.length,1);
	items.push(entry);
	assert.equal(check().failures.length,1);
	items.pop();
	entry.sourceLocation.url += '/other-resource';
	assert.equal(check().failures.length,1);
	entry.sourceLocation.url = url;
	entry.description = 'Unrelated error';
	assert.equal(check().failures.length,1);
});

test('a reported 100 cannot pass with blocked requests or modified mobile throttling', () => {
	const report = sample('/');
	report.configSettings.blockedUrlPatterns = ['*'];
	assert.equal(assess(report, report.requestedUrl, 'mobile', expectations, false).failures.length, 1);
	report.configSettings.blockedUrlPatterns = [];
	assert.ok(report.configSettings.throttling);
	report.configSettings.throttling.cpuSlowdownMultiplier = 1;
	assert.equal(assess(report, report.requestedUrl, 'mobile', expectations, false).failures.length, 1);
});

/** @returns {Report} */
function trackerVisit() {
	const report = sample('/privacy');
	const {trackerScript, profiledCallers} = expectations.performance99;
	const caller = new URL(profiledCallers[0].path, report.requestedUrl).href;
	const ids = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift'];
	report.categories.performance = {score:0.99, auditRefs:ids.map((id) => ({id,weight:1}))};
	for (const id of ids) report.audits[id] = {score:1,scoreDisplayMode:'numeric',numericValue:100};
	report.audits['total-blocking-time'].score = 0.98;
	report.audits.interactive = {score:null,numericValue:400};
	report.audits['network-requests'].details?.items?.push({url:caller,resourceType:'Script',statusCode:200});
	report.audits['bootup-time'] = {score:1,details:{items:[{url:trackerScript,total:90},{url:caller,scripting:100}]}};
	report.audits['third-parties-insight'] = {score:1,details:{items:[{subItems:{items:[{url:trackerScript,mainThreadTime:20}]}}]}};
	report.audits['long-tasks'] = {score:0,details:{debugData:{
		urls:[trackerScript,caller,'Unattributable'],
		tasks:[{urlIndex:1,startTime:240,duration:110},{urlIndex:0,startTime:150,duration:90},
			{urlIndex:2,startTime:0,duration:60}]}}};
	return report;
}

/** @param {Report} report @param {boolean} [strict] @returns {ReturnType<typeof assess>} */
function evaluateVisit(report, strict = false) {
	return assess(report, report.requestedUrl, 'mobile', expectations, strict);
}

test('only an exact 99 can use the corroborated tracker expectation and strict keeps the raw scores', () => {
	const report = trackerVisit();
	const gate = evaluateVisit(report);
	assert.equal(gate.scores.performance, 99);
	assert.deepEqual(gate.failures, []);
	assert.deepEqual(gate.exceptions, ['Matomo Performance 99 (total-blocking-time)']);
	assert.equal(gate.performanceAttribution?.creditedBlockingMs, 70);
	assert.equal(gate.performanceAttribution.windowBlockingMs, 100);
	assert.deepEqual(evaluateVisit(report, true).exceptions, []);
	assert.equal(evaluateVisit(report, true).failures.length, 1);
	for (const score of [0.98,0.9899,0.995]) {
		report.categories.performance.score = score;
		assert.equal(evaluateVisit(report).failures.length, 1);
	}
});

test('the current aggregate build ID uses its newly recorded Matomo profile', () => {
	const report = trackerVisit();
	const profile = expectations.performance99.profiledCallers.find(({path}) =>
		path === '/assets/build/0ed881c4c4798e9c/js/matomo.mjs'
	);
	assert.ok(profile);
	const previous = new URL(expectations.performance99.profiledCallers[0].path, report.requestedUrl).href;
	const current = new URL(profile.path, report.requestedUrl).href;
	const requests = report.audits['network-requests'].details?.items;
	const cpu = report.audits['bootup-time'].details?.items;
	const tasks = report.audits['long-tasks'].details?.debugData;
	assert.ok(requests && cpu && tasks);
	for (const item of [...requests,...cpu]) if (item.url === previous) item.url = current;
	tasks.urls[1] = current;
	const gate = evaluateVisit(report);
	assert.deepEqual(gate.failures, []);
	assert.equal(gate.adapterNotice, undefined);
	assert.equal(gate.performanceAttribution?.profiledCaller, current);
});

test('only /news mobile Performance 97 or higher can waive complete LCP and TBT metrics', () => {
	const report = sample('/news');
	const metrics = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift'];
	report.categories.performance.score = 0.97;
	report.categories.performance.auditRefs = metrics.map((id) => ({id,weight:1}));
	for (const id of metrics) report.audits[id] = {score:1,scoreDisplayMode:'numeric',numericValue:100};
	report.audits['largest-contentful-paint'] = {score:0.93,scoreDisplayMode:'numeric',numericValue:2325};
	/** @param {Report} sampleReport @param {import('../scripts/lighthouse-types.d.ts').Preset} [preset] @param {boolean} [strict] */
	const evaluate = (sampleReport, preset = 'mobile', strict = false) =>
		assess(sampleReport, sampleReport.requestedUrl, preset, expectations, strict);
	const accepted = evaluate(report);
	assert.deepEqual(accepted.failures, []);
	assert.deepEqual(accepted.exceptions, [
		'Owner-accepted /news mobile Performance 97 (only failing audits: largest-contentful-paint)'
	]);
	assert.deepEqual(evaluate(report, 'mobile', true).exceptions, []);
	assert.equal(evaluate(report, 'mobile', true).failures[0], 'performance: largest-contentful-paint');

	const score99 = structuredClone(report);
	score99.categories.performance.score = 0.99;
	assert.deepEqual(evaluate(score99).failures, []);
	assert.match(evaluate(score99).exceptions[0], /Performance 99/);

	const bothAudits = structuredClone(report);
	bothAudits.categories.performance.auditRefs.push({id:'total-blocking-time',weight:1});
	bothAudits.audits['total-blocking-time'] = {score:0.97,scoreDisplayMode:'numeric',numericValue:60};
	assert.deepEqual(evaluate(bothAudits).failures, []);
	const tbtOnly = structuredClone(report);
	tbtOnly.audits['largest-contentful-paint'].score = 1;
	tbtOnly.audits['total-blocking-time'] = {score:0.97,scoreDisplayMode:'numeric',numericValue:60};
	assert.deepEqual(evaluate(tbtOnly).failures, []);
	const otherCategory = structuredClone(report);
	otherCategory.categories.accessibility.score = 0.99;
	assert.deepEqual(evaluate(otherCategory).failures, ['accessibility: category below 100']);
	assert.equal(evaluate(otherCategory).exceptions.length, 1);

	const desktop = structuredClone(report);
	desktop.configSettings.formFactor = 'desktop';
	desktop.configSettings.screenEmulation = {mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false};
	desktop.configSettings.throttling = {rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1};
	assert.ok(evaluate(desktop, 'desktop').failures.includes('performance: largest-contentful-paint'));

	const otherPage = structuredClone(report);
	otherPage.requestedUrl = 'http://127.0.0.1:18080/privacy';
	otherPage.finalDisplayedUrl = otherPage.requestedUrl;
	const documentRequest = otherPage.audits['network-requests']?.details?.items?.[0];
	assert.ok(documentRequest);
	documentRequest.url = otherPage.requestedUrl;
	assert.ok(evaluate(otherPage).failures.includes('performance: largest-contentful-paint'));
	const queryUrl = structuredClone(report);
	queryUrl.requestedUrl += '?source=gate-test';
	queryUrl.finalDisplayedUrl = queryUrl.requestedUrl;
	const queriedDocument = queryUrl.audits['network-requests']?.details?.items?.[0];
	assert.ok(queriedDocument);
	queriedDocument.url = queryUrl.requestedUrl;
	assert.ok(evaluate(queryUrl).failures.includes('performance: largest-contentful-paint'));

	const belowMinimum = structuredClone(report);
	belowMinimum.categories.performance.score = 0.96;
	assert.ok(evaluate(belowMinimum).failures.includes('performance: largest-contentful-paint'));
	const missingAudit = structuredClone(report);
	delete missingAudit.audits['largest-contentful-paint'];
	assert.ok(evaluate(missingAudit).failures.includes('performance: largest-contentful-paint'));

	const unrelatedAudit = structuredClone(report);
	unrelatedAudit.audits['speed-index'] = {score:0.9,scoreDisplayMode:'numeric',numericValue:1800};
	assert.deepEqual(evaluate(unrelatedAudit).failures, ['performance: largest-contentful-paint, speed-index']);

	const clsNotApplicable = structuredClone(report);
	clsNotApplicable.audits['cumulative-layout-shift'].score = null;
	clsNotApplicable.audits['cumulative-layout-shift'].scoreDisplayMode = 'notApplicable';
	assert.ok(evaluate(clsNotApplicable).failures.includes('performance: largest-contentful-paint'));
	const missingClsReference = structuredClone(report);
	missingClsReference.categories.performance.auditRefs = missingClsReference.categories.performance.auditRefs
		.filter((ref) => ref.id !== 'cumulative-layout-shift');
	assert.ok(evaluate(missingClsReference).failures.includes('performance: largest-contentful-paint'));
	const missingClsAudit = structuredClone(report);
	delete missingClsAudit.audits['cumulative-layout-shift'];
	assert.ok(evaluate(missingClsAudit).failures.includes('performance: largest-contentful-paint, cumulative-layout-shift'));
	const informativeSpeedIndex = structuredClone(report);
	informativeSpeedIndex.audits['speed-index'].score = null;
	informativeSpeedIndex.audits['speed-index'].scoreDisplayMode = 'informative';
	assert.ok(evaluate(informativeSpeedIndex).failures.includes('performance: largest-contentful-paint'));
});

test('other weighted audits, missing measurements and other categories remain independent failures', () => {
	const report = trackerVisit();
	report.audits['speed-index'].score = 0.99;
	assert.equal(evaluateVisit(report).exceptions.length, 0);
	report.audits['speed-index'].score = null;
	report.audits['speed-index'].scoreDisplayMode = 'error';
	assert.equal(evaluateVisit(report).failures.length, 1);
	report.categories.performance.auditRefs = report.categories.performance.auditRefs.filter((ref) => ref.id !== 'speed-index');
	assert.equal(evaluateVisit(report).failures.length, 1);
	const valid = trackerVisit();
	valid.categories.accessibility.score = 0.99;
	assert.equal(evaluateVisit(valid).failures.length, 1);
});

test('LCP and desktop Performance 99 remain raw failures even when Matomo dominates', () => {
	const report = trackerVisit();
	report.audits['largest-contentful-paint'].score = 0.97;
	report.audits['largest-contentful-paint'].numericValue = 230;
	assert.equal(evaluateVisit(report).failures.length, 1);
	report.audits['total-blocking-time'].score = 1;
	assert.equal(evaluateVisit(report).failures.length, 1);
	const desktop = trackerVisit();
	desktop.configSettings.formFactor = 'desktop';
	desktop.configSettings.screenEmulation = {mobile:false, width:1350, height:940, deviceScaleFactor:1, disabled:false};
	desktop.configSettings.throttling = {rttMs:40, throughputKbps:10240, cpuSlowdownMultiplier:1};
	const gate = assess(desktop, desktop.requestedUrl, 'desktop', expectations, false);
	assert.deepEqual(gate.exceptions, []);
	assert.deepEqual(gate.failures, ['performance: total-blocking-time']);
});

test('tracker execution and successful collection need independent evidence in the same report', () => {
	for (const id of ['bootup-time','third-parties-insight','network-requests','long-tasks','interactive']) {
		const report = trackerVisit();
		delete report.audits[id];
		assert.ok(evaluateVisit(report).failures.length, id);
	}
	for (const endpoint of ['https://analytics.inwd.org.example/matomo.php','https://analytics.inwd.org/other/matomo.php']) {
		const report = trackerVisit();
		const collection = report.audits['network-requests'].details?.items?.find((item) => item.resourceType === 'Ping');
		assert.ok(collection);
		collection.statusCode = 503;
		assert.ok(evaluateVisit(report).failures.length);
		collection.statusCode = 204;
		collection.url = endpoint;
		assert.ok(evaluateVisit(report).failures.length);
	}
});

test('a passive non-404 navigation requires exactly one tracker script and successful collection', () => {
	for (const strict of [false,true]) {
		const report = sample('/');
		const requests = report.audits['network-requests'].details?.items;
		assert.ok(requests);
		const [,script, collection] = requests;
		requests.splice(1);
		assert.equal(evaluateVisit(report, strict).failures.length, 2);
		requests.push(script);
		assert.equal(evaluateVisit(report, strict).failures.length, 1);
		requests.push(collection, {...script,url:script.url+'?duplicate=1'});
		assert.equal(evaluateVisit(report, strict).failures.length, 1);
		requests.pop();
		assert.deepEqual(evaluateVisit(report, strict).failures, []);
		script.statusCode = 503;
		assert.equal(evaluateVisit(report, strict).failures.length, 1);
		script.statusCode = 200;
		collection.statusCode = 403;
		assert.equal(evaluateVisit(report, strict).failures.length, 1);
		collection.statusCode = 204;
		collection.url = 'https://analytics.inwd.org/another/matomo.php';
		assert.equal(evaluateVisit(report, strict).failures.length, 1);
		assert.deepEqual(evaluateVisit(sample(missingPath), strict).failures, []);
	}
});

test('a changed adapter build ID emits a re-profile notice and only allows direct tracker credit', () => {
	const report = trackerVisit();
	const original = new URL(expectations.performance99.profiledCallers[0].path, report.requestedUrl).href;
	const changed = original.replace(/\/build\/[a-f0-9]{16}\//, '/build/ffffffffffffffff/');
	const requests = report.audits['network-requests'].details?.items;
	const cpu = report.audits['bootup-time'].details?.items;
	const tasks = report.audits['long-tasks'].details?.debugData;
	assert.ok(requests && cpu && tasks);
	for (const item of [...requests,...cpu]) if (item.url === original) item.url = changed;
	tasks.urls[1] = changed;
	const gate = evaluateVisit(report);
	assert.equal(gate.failures.length, 1);
	assert.match(gate.adapterNotice ?? '', /credit unavailable.*Re-profile.*ffffffffffffffff/);
	assert.equal(gate.performanceAttribution?.pairedCallerBlockingMs, 0);
	tasks.tasks[0] = {urlIndex:1,startTime:260,duration:90};
	tasks.tasks[1].duration = 110;
	assert.deepEqual(evaluateVisit(report).failures, []);
	assert.equal(evaluateVisit(report).performanceAttribution?.creditedBlockingMs, 60);
});

test('unrelated, unpaired, overlapping and unreconciled long tasks cannot excuse a 99', () => {
	const report = trackerVisit();
	const ledger = report.audits['long-tasks'].details?.debugData;
	assert.ok(ledger);
	const caller = ledger.urls[1];
	for (const wrong of ['https://other.example/matomo.js', caller.replace('f75dac30546b32f6','ffffffffffffffff')]) {
		ledger.urls[1] = wrong;
		assert.ok(evaluateVisit(report).failures.length);
	}
	ledger.urls[1] = caller;
	for (const start of [235,242]) {
		ledger.tasks[0].startTime = start;
		assert.ok(evaluateVisit(report).failures.length);
	}
	ledger.tasks[0].startTime = 240;
	report.audits['total-blocking-time'].numericValue = 120;
	assert.ok(evaluateVisit(report).failures.length);
	ledger.urls[1] = 'Unattributable';
	ledger.tasks[0].duration = 90;
	report.audits['total-blocking-time'].numericValue = 80;
	assert.equal(evaluateVisit(report).performanceAttribution?.creditedBlockingMs, 40);
	assert.ok(evaluateVisit(report).failures.length);
});

test('direct tracker blocking can qualify independently of the profiled site build', () => {
	const report = trackerVisit();
	const ledger = report.audits['long-tasks'].details?.debugData;
	assert.ok(ledger);
	ledger.urls[1] = 'Unattributable';
	ledger.tasks[0] = {urlIndex:1,startTime:260,duration:90};
	ledger.tasks[1].duration = 110;
	assert.deepEqual(evaluateVisit(report).failures, []);
	assert.equal(evaluateVisit(report).performanceAttribution?.pairedCallerBlockingMs, 0);
	const thirdParty = report.audits['third-parties-insight'].details?.items?.[0].subItems?.items?.[0];
	assert.ok(thirdParty);
	thirdParty.url = 'https://analytics.inwd.org/another-script.js';
	assert.ok(evaluateVisit(report).failures.length);
});

test('large unrelated blocking and an adapter without corroborating CPU cannot take tracker credit', () => {
	const report = trackerVisit();
	const ledger = report.audits['long-tasks'].details?.debugData;
	assert.ok(ledger);
	report.audits.interactive.numericValue = 600;
	ledger.tasks.push({urlIndex:2,startTime:350,duration:160});
	report.audits['total-blocking-time'].numericValue = 210;
	assert.equal(evaluateVisit(report).performanceAttribution?.dominates, false);
	assert.ok(evaluateVisit(report).failures.length);
	const fresh = trackerVisit();
	const boot = fresh.audits['bootup-time'].details?.items?.[1];
	assert.ok(boot);
	boot.scripting = 0;
	assert.equal(evaluateVisit(fresh).performanceAttribution?.pairedCallerBlockingMs, 0);
	assert.ok(evaluateVisit(fresh).failures.length);
});
