import { dev } from '$app/environment';

/**
 * Development-only logging utility.
 * All logs are suppressed in production builds.
 */

type LogLevel = 'log' | 'warn' | 'error';

function createLogger(prefix: string) {
	const log = (level: LogLevel, ...args: unknown[]) => {
		if (dev) {
			console[level](`[${prefix}]`, ...args);
		}
	};

	return {
		log: (...args: unknown[]) => log('log', ...args),
		warn: (...args: unknown[]) => log('warn', ...args),
		error: (...args: unknown[]) => log('error', ...args)
	};
}

// Pre-configured loggers for different modules
export const logI18n = createLogger('i18n');
export const logAnalytics = createLogger('Analytics');
export const logPrivacy = createLogger('Privacy');
export const logShare = createLogger('Share');
export const logAnimation = createLogger('Animation');
export const logMap = createLogger('LeafletMap');

// Generic logger factory for new modules
export { createLogger };
