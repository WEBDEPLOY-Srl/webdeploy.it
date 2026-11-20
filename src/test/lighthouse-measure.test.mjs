// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { classifyAttempt, measureCell, quietDuration, verifiedRecord, waitForQuiet } from '../scripts/lighthouse-measure.mjs';

/** @typedef {import('../scripts/lighthouse-types.d.ts').Measurement} Measurement */
/** @typedef {import('../scripts/lighthouse-types.d.ts').QuietWindow} QuietWindow */

/** @param {number} benchmark @param {number} score @param {string} [error] @returns {Measurement} */
function sample(benchmark, score, error) {
	const category = () => ({score,auditRefs:[]});
	return {
		exitCode:error ? 1 : 0,
		report:{lighthouseVersion:'13.6.0',requestedUrl:'http://127.0.0.1/',finalDisplayedUrl:'http://127.0.0.1/',
			fetchTime:'2026-11-19',environment:{benchmarkIndex:benchmark},configSettings:{formFactor:'mobile',throttlingMethod:'simulate'},
			categories:{performance:category(),accessibility:category(),'best-practices':category(),seo:category()},audits:{},
			runtimeError:error ? {code:error,message:'Synthetic collection error'} : undefined},
		lab:{startedUtc:'2026-11-19',finishedUtc:'2026-11-19',load1Start:2,load1End:2,cpuIdlePercent:85,benchmarkIndex:benchmark}
	};
}

/** @returns {Promise<QuietWindow>} */
async function quiet() {
	const sample = {utc:'2026-11-19',load1Start:1,load1End:1,idlePercent:90,durationMs:5000};
	return {qualified:true,waitedMs:20_000,requiredMs:20_000,consecutiveMs:20_000,samples:[sample,sample,sample,sample]};
}

/** @param {import('node:test').TestContext} t @param {Measurement[]} outcomes */
async function runSequence(t, outcomes) {
	const directory = await mkdtemp(join(tmpdir(), 'wd-lighthouse-attempts-'));
	t.after(() => rm(directory, {recursive:true,force:true}));
	await mkdir(join(directory,'mobile'));
	let checks = 0;
	let runs = 0;
	const record = await measureCell(directory,'/','mobile',false,{remainingMs:60_000},async (file) => {
		const value = outcomes[runs++];
		assert.ok(value, 'A valid score must not cause another attempt');
		await writeFile(file, JSON.stringify(value.report));
		await writeFile(file + '.lab.json',JSON.stringify(value.lab));
		await writeFile(file + '.log',value.report?.runtimeError?.message ?? '');
		return value;
	}, async () => { checks++; return quiet(); });
	assert.equal(checks,runs);
	assert.deepEqual(JSON.parse(await readFile(join(directory,'attempts/mobile/home/attempts.json'),'utf8')),record);
	assert.deepEqual(await verifiedRecord(directory,'/','mobile'),record);
	return {directory,record,runs};
}

test('the host must remain below load 3 and above 70% CPU idle continuously', async () => {
	const interval = {utc:'2026-11-19',load1Start:2,load1End:2.99,idlePercent:70.01,durationMs:5_000};
	assert.equal(quietDuration(15_000,interval),20_000);
	for (const change of [{idlePercent:70},{load1Start:3},{load1End:3},{durationMs:60_000}])
		assert.equal(quietDuration(15_000,{...interval,...change}),0);
	assert.equal((await waitForQuiet({remainingMs:0})).qualified,false);
});

test('runtime failures get at most two fresh attempts; the first valid low score is final', async (t) => {
	const bad = sample(1500,0,'NO_NAVSTART');
	const {directory,record,runs} = await runSequence(t,[bad,sample(1400,0,'NO_FCP'),sample(1100,0.90)]);
	assert.equal(runs,3);
	assert.deepEqual(record.attempts.map((a) => a.status),['runtime-error','runtime-error','measured']);
	assert.equal(record.selected,3);
	assert.equal(JSON.parse(await readFile(join(directory,'mobile/home.json'),'utf8')).categories.performance.score,0.90);
});

test('a low benchmark invalidates even a 100 and the qualified remeasurement wins regardless of score', async (t) => {
	const {record,runs} = await runSequence(t,[sample(999.9,1),sample(1000,0.84)]);
	assert.equal(runs,2);
	assert.equal(record.selected,2);
	assert.deepEqual(record.attempts.map((a) => [a.status,a.hostDegraded]),[['host-degraded',true],['measured',false]]);
});

test('exhausted measurement and host retries fail closed and preserve all raw attempts', async (t) => {
	const bad = sample(800,0,'NO_NAVSTART');
	const failed = await runSequence(t,[bad,bad,bad]);
	assert.equal(failed.runs,3);
	assert.equal(failed.record.selected,null);
	assert.ok(failed.record.attempts.every((a) => a.hostDegraded && a.raw && a.log && a.conditions));
	const slow = await runSequence(t,[sample(950,1),sample(999,1)]);
	assert.equal(slow.runs,2);
	assert.equal(slow.record.selected,null);
	assert.equal(slow.record.outcome,'host-degraded');
});

test('the ordinary branded 404 has explicit expected-error evidence; the scored navigation does not', () => {
	const expected = sample(1500,0,'ERRORED_DOCUMENT_REQUEST');
	assert.equal(classifyAttempt(expected,true).status,'measured');
	assert.equal(classifyAttempt(expected,false).status,'runtime-error');
	assert.equal(classifyAttempt(sample(900,0,'ERRORED_DOCUMENT_REQUEST'),true).status,'host-degraded');
});

test('a populated numerical report is retained even when the launcher reports a separate exit error', async (t) => {
	const low = sample(1450,0.91);
	low.exitCode = 1;
	const {directory,record,runs} = await runSequence(t,[low]);
	assert.equal(runs,1);
	assert.equal(record.selected,1);
	assert.match(await readFile(join(directory,'mobile/home.json.error'),'utf8'),/after producing a numerical report/);
});

test('replay rejects a substituted canonical report or a changed quiet window', async (t) => {
	const {directory} = await runSequence(t,[sample(1000,0.98)]);
	const name = join(directory,'attempts/mobile/home/01.json.quiet.json');
	const window = await quiet();
	window.samples[0] = {...window.samples[0], load1End:3};
	await writeFile(name,JSON.stringify(window));
	await assert.rejects(verifiedRecord(directory,'/','mobile'), /quiet qualification/);
});

test('runtime and degraded retries have independent limits and no numerical score is discarded', async (t) => {
	const {record,runs} = await runSequence(t, [
		sample(1400,0,'NO_NAVSTART'),sample(900,1),sample(1200,0,'NO_FCP'),sample(1500,0.97)
	]);
	assert.equal(runs,4);
	assert.deepEqual(record.attempts.map((a)=>a.status),['runtime-error','host-degraded','runtime-error','measured']);
	assert.equal(record.selected,4);
});

test('an expired quiet budget records a host timeout without invoking a browser', async (t) => {
	const directory = await mkdtemp(join(tmpdir(), 'wd-lighthouse-timeout-'));
	t.after(() => rm(directory,{recursive:true,force:true}));
	await mkdir(join(directory,'mobile'));
	const record = await measureCell(directory,'/','mobile',false,{remainingMs:0},async () => assert.fail('Host did not qualify'));
	assert.equal(record.outcome,'host-timeout');
	assert.equal(record.selected,null);
	assert.deepEqual(await verifiedRecord(directory,'/','mobile'),record);
});
