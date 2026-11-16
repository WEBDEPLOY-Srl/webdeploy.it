import { site } from './site';

/** What a footer entry does: go to a page, or open the cookie settings. */
export type FooterLink =
	| { labelKey: string; href: string; external?: boolean }
	| { labelKey: string; action: 'cookieSettings' };

export interface FooterGroup {
	titleKey: string;
	links: FooterLink[];
}

/** The footer columns, in order. Label keys are looked up with `t()`. */
export const footerGroups: FooterGroup[] = [
	{
		titleKey: 'footer.product',
		links: [
			{ labelKey: 'nav.kiosk', href: '/totem' },
			{ labelKey: 'nav.linuxMigration', href: '/services/linux-workstations' },
			{ labelKey: 'nav.backup', href: '/services/backup' },
			{ labelKey: 'nav.consulting', href: '/services/consulting' },
			{ labelKey: 'nav.news', href: '/news' }
		]
	},
	{
		titleKey: 'footer.resources',
		links: [
			{ labelKey: 'footer.newsletter', href: '/newsletter' },
			{ labelKey: 'nav.manifesto', href: '/developer-manifesto' },
			{ labelKey: 'footer.source', href: site.sourceUrl, external: true }
		]
	},
	{
		titleKey: 'footer.company',
		links: [
			{ labelKey: 'nav.contacts', href: '/contacts' },
			{ labelKey: 'footer.careers', href: `mailto:${site.contact.careersEmail}` },
			{ labelKey: 'footer.privacy', href: '/privacy' },
			{ labelKey: 'footer.security', href: '/security' },
			{ labelKey: 'footer.cookieSettings', action: 'cookieSettings' }
		]
	}
];
