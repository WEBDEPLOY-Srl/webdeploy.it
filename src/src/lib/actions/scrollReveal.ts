import { logAnimation } from '$lib/utils/logger';

/**
 * Svelte action for scroll-triggered reveal animations.
 * Uses IntersectionObserver to add 'is-visible' class when element enters viewport.
 *
 * Usage: <div use:scrollReveal={{ delay: 100 }} class="scroll-animate">
 */
export function scrollReveal(
	node: HTMLElement,
	options: { delay?: number; threshold?: number } = {}
) {
	const { delay = 0, threshold = 0.1 } = options;

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		// Show immediately for users who prefer reduced motion
		node.classList.add('is-visible');
		return { destroy() {} };
	}

	// Apply delay via CSS custom property
	if (delay > 0) {
		node.style.transitionDelay = `${delay}ms`;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('is-visible');
					// Once visible, stop observing
					observer.unobserve(node);
					logAnimation.log('Element revealed:', node.className.slice(0, 50));
				}
			});
		},
		{ threshold, rootMargin: '0px 0px -50px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
