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
	return { lighthouseVersion: version, requestedUrl: origin + path, finalDisplayedUrl: origin + path,
		fetchTime: '2026-11-19T00:00:00Z', configSettings: {
			formFactor:'mobile', throttlingMethod:'simulate',
			screenEmulation:{mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},
			throttling:{rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4}
		},
		categories: {performance:score(),accessibility:score(),'best-practices':score(),seo:score()},
		audits: {ordinary:{score:1},'network-requests': {score:null,details:{items:[{url:origin+path,resourceType:'Document',statusCode:path===missingPath?404:200}]}}} };
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
	assert.deepEqual(expectations.performance99.audits, ['total-blocking-time','largest-contentful-paint']);
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
	const {trackerScript, collectionEndpoint, profiledCaller} = expectations.performance99;
	const caller = new URL(profiledCaller, report.requestedUrl).href;
	const ids = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','speed-index','cumulative-layout-shift'];
	report.categories.performance = {score:0.99, auditRefs:ids.map((id) => ({id,weight:1}))};
	for (const id of ids) report.audits[id] = {score:1,scoreDisplayMode:'numeric',numericValue:100};
	report.audits['total-blocking-time'].score = 0.98;
	report.audits.interactive = {score:null,numericValue:400};
	report.audits['network-requests'].details?.items?.push({url:trackerScript,resourceType:'Script',statusCode:200},
		{url:caller,resourceType:'Script',statusCode:200},{url:collectionEndpoint+'?rec=1',resourceType:'Ping',statusCode:204});
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

test('a slow LCP needs a credited tracker task at paint', () => {
	const report = trackerVisit();
	report.audits['largest-contentful-paint'].score = 0.97;
	assert.equal(evaluateVisit(report).failures.length, 1);
	report.audits['largest-contentful-paint'].numericValue = 230;
	assert.equal(evaluateVisit(report).failures.length, 0);
});

test('tracker execution and successful collection need independent evidence in the same report', () => {
	for (const id of ['bootup-time','third-parties-insight','network-requests','long-tasks','interactive']) {
		const report = trackerVisit();
		delete report.audits[id];
		assert.ok(evaluateVisit(report).failures.length, id);
	}
	for (const endpoint of ['https://analytics.inwd.org.example/matomo.php','https://analytics.inwd.org/other/matomo.php']) {
		const report = trackerVisit();
		const collection = report.audits['network-requests'].details?.items?.at(-1);
		assert.ok(collection);
		collection.statusCode = 503;
		assert.ok(evaluateVisit(report).failures.length);
		collection.statusCode = 204;
		collection.url = endpoint;
		assert.ok(evaluateVisit(report).failures.length);
	}
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
