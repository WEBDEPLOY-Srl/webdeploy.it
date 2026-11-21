// @ts-check
// SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
// SPDX-License-Identifier: LicenseRef-WEBDEPLOY-Reserved

/** @satisfies {import('../types.d.ts').Content} */
export const en = {
	// Navigation
	nav: {
		products: 'Products',
		kiosk: 'inWD™ Kiosk',
		news: 'News',
		services: 'Services',
		linuxMigration: 'Linux Workstation Migration',
		backup: 'Encrypted Backups',
		consulting: 'Open Source Consulting',
		managedInfra: 'Managed Infrastructure',
		manifesto: 'Developer Manifesto',
		contacts: 'Contacts',
		mainNavigation: 'Main navigation',
		mobileNavigation: 'Mobile navigation',
		productsSubmenu: 'Products submenu',
		servicesSubmenu: 'Services submenu',
		openMenu: 'Open menu',
		closeMenu: 'Close menu',
		switchLanguage: 'Switch language'
	},

	// Home page
	home: {
		heroName: 'webdeploy',
		heroText: 'developing greatness',
		metaTitle: 'Open source infrastructure, Linux and encrypted backups',
		metaDescription:
			'WEBDEPLOY runs open source infrastructure for teams that want dependable systems: managed servers with inWD, Linux migration, encrypted backups and kiosks.',
		heroSubtitle: 'A look into the Future<void>',
		heroTagline:
			'Work and operate with open source software and infrastructure for teams that want clear, dependable systems.',
		manifestoBtn: 'Developer Manifesto',
		servicesBtn: 'Explore services',
		servicesEyebrow: 'What we do',
		servicesTitle: 'Open technology. Practical support.',
		servicesDescription:
			'Straightforward support for Linux, private data, and infrastructure you can understand.',
		aboutEyebrow: 'Our approach',
		aboutTitle: 'Open tools. Clear choices.',
		aboutDescription:
			'We use open-source tools and transparent processes, so you can understand and control the technology you rely on.',
		licenceLink: 'Licence',
		toolGroups: {
			company: 'Running the company',
			infrastructure: 'Infrastructure',
			operations: 'Managed services'
		},
		aboutLink: 'Read the developer manifesto',
		ctaTitle: 'Start with a conversation',
		ctaDescription: 'Tell us what you are working on and where you need a dependable partner.',
		ctaContact: 'Contact WEBDEPLOY™',
		serviceSections: {
			linux: {
				title: 'Linux workstations',
				subtitle: 'Move to Linux with a plan',
				lead: 'We move your team from Windows to Linux workstations after checking, with you, that every program and every device still works. Then each workstation is enrolled in inWD and maintained remotely.',
				points: [
					'Software and peripheral lists written with you',
					'A test agreed with you for every item on those lists',
					'A test workstation before anyone switches',
					'Enrolled in inWD and maintained remotely after the switch'
				],
				linkLabel: 'Linux migration',
				imageAlt:
					'Black desk with four monitors, one on a raised arm, a keyboard and mouse, and a tower PC glowing red underneath'
			},
			privacy: {
				title: 'Encrypted backup storage',
				subtitle: 'Backups that respect your data',
				lead: 'Private, encrypted storage and backups built on BorgBackup, designed to keep your business data in your hands, with clear answers about where it lives and who can read it.',
				points: [
					'Encryption for data at rest and in transit',
					'Open source software, with no proprietary lock-in',
					'Access you decide, reviewed and documented',
					'BorgBackup backups, deduplicated and encrypted before they leave your machines'
				],
				linkLabel: 'Encrypted backups',
				imageAlt: 'BorgBackup logo',
				imageCredit:
					'BorgBackup logo © The Borg Collective, BSD 3-Clause licence, recoloured by WEBDEPLOY™. WEBDEPLOY™ is not affiliated with or endorsed by the BorgBackup project.'
			},
			inwd: {
				title: 'inWD™ managed infrastructure',
				subtitle: 'Infrastructure grows wild. inWD™ keeps it tended.',
				lead: 'Managed monitoring, reporting, and patching for the servers and applications you already run. You host it. We keep it healthy.',
				points: [
					'No migration: your systems stay on-premises, on your own servers, or in the cloud',
					'Monitoring: know what is alive, with a heartbeat for every managed asset',
					'Maintenance: packages, certificates, and dependencies patched as an ongoing lifecycle',
					'Reporting: a record of what is managed, what received attention, and what changed'
				],
				linkLabel: 'Infrastructure, tended',
				imageAlt:
					'inWD Trunk / Rack emblem: a broken tree trunk with three server rack units, leafy sprigs at its roots'
			}
		}
	},

	// Service pages
	services: {
		cards: {
			consulting: {
				toolsLabel: 'Open source tools we run every day'
			}
		},
		linux: {
			title: 'Linux Workstation Migration',
			metaDescription:
				'How WEBDEPLOY moves workstations from Windows to Linux: software and device lists agreed with you, agreed tests, a test workstation, then inWD management.',
			imageAlt:
				'inWD Managed Host emblem: a three-unit server rack with status lights, overgrown with leaves and foliage',
			subtitle: 'From Windows to Linux, checked before anyone switches',
			description:
				'A migration works only if everything your team uses still works on the day they switch. So before any machine changes, we agree with you what has to work and how we will prove it.',
			inventory: {
				title: 'Every program and every device, listed',
				subtitle: 'Nothing left to find out later',
				body: 'Together with you we write two lists: a software bill of materials (SBoM) with every program your team uses, and a bill of materials for peripherals such as printers, scanners, label printers, card readers and signature pads. For each item we find the Linux version, a replacement, or a way to keep it running.',
				examplesLabel: 'Example entries',
				examples: [
					{ item: 'Office documents', result: 'LibreOffice, tested on your own files' },
					{ item: 'Email and calendar', result: 'Thunderbird, with your existing accounts' },
					{ item: 'Web applications', result: 'Firefox, every login checked' },
					{ item: 'Label printer', result: 'Linux driver, test labels printed' },
					{ item: 'Card reader', result: 'Tested with the services that use it' }
				],
				examplesNote: 'Your own lists are written with you, item by item.'
			},
			testing: {
				title: 'Tests agreed with you',
				subtitle: 'Ready means the test passed',
				body: 'For every item on both lists we define with you the test it has to pass. An item is ready when its test passes, not when we say so.',
				points: [
					'Printing a real invoice on your printer',
					'Scanning to the shared folder',
					"Opening last year's files and templates",
					'Signing in to the web services you use every day'
				]
			},
			testMachine: {
				title: 'A workstation to try first',
				subtitle: 'Problems found by one person, not by everyone',
				body: 'Before the switch you get a Linux workstation to work on. Who uses it, for how long and for which tasks is agreed with you, so the people who will use Linux every day find problems before everyone moves.',
				demo: {
					label: 'Interactive KDE Plasma workstation demo',
					controls: 'Try the workstation',
					files: 'Open files',
					browser: 'Open browser',
					office: 'Write a document',
					print: 'Print a test label',
					printQueue: 'Print queue',
					printer: 'Label printer',
					ready: 'Ready',
					completed: 'Completed',
					noticeTitle: 'Test label printed',
					noticeBody: 'Label printer · test-label.pdf'
				},
				imageCaption:
					'Pictured: our own workstation, a large setup. The test workstation you get is set up like the machines your team will actually use.',
				imageAlt:
					'Black desk with four monitors, one on a raised arm, a keyboard and mouse, and a tower PC glowing red underneath'
			},
			support: {
				title: 'Maintained after the switch',
				subtitle: 'Enrolled in inWD',
				body: 'After the switch each workstation is enrolled in inWD, our managed service, the same way a server is. Once enrolled, we keep it updated and fix problems remotely from the inWD panel at console.inwd.org, so nobody has to bring machines to us.',
				link: 'About inWD',
				imageAlt:
					'inWD Trunk / Rack emblem: a broken tree trunk with three server rack units, leafy sprigs at its roots'
			}
		},
		backup: {
			title: 'Encrypted Backups',
			metaDescription:
				'Encrypted BorgBackup backups as part of inWD: encrypted before they leave your machines, open source, access you decide, and a restore tested every month.',
			subtitle: 'Part of inWD',
			description:
				'Backups that keep your business data in your hands: encrypted on your own machines, stored where only you can read them, and restored on schedule so you know they work.',
			imageAlt: 'BorgBackup logo',
			imageCredit:
				'BorgBackup logo © The Borg Collective, BSD 3-Clause licence, recoloured by WEBDEPLOY™. WEBDEPLOY™ is not affiliated with or endorsed by the BorgBackup project.',
			licenceLink: 'Licence',
			sections: {
				encrypted: {
					title: 'Encrypted before it leaves your machines',
					subtitle: 'The storage only sees ciphertext',
					body: 'BorgBackup encrypts and deduplicates your data on your own server, so what travels and what is stored is already encrypted. Deduplication keeps every daily backup small.'
				},
				open: {
					title: 'Open source, no lock-in',
					subtitle: 'Readable without us',
					body: 'Borg is open source software. Your backups stay readable with standard, freely available tools, whether or not you keep working with us.'
				},
				access: {
					title: 'Access you decide',
					subtitle: 'Reviewed and documented',
					body: 'Who can read your backups and who can start a restore is decided with you, written down, and reviewed.'
				},
				restore: {
					title: 'A restore tested every month',
					subtitle: 'A backup counts once it restores',
					body: 'Every month we restore from your backups and check the result, so you know they work before the day you need them.'
				}
			},
			inwd: {
				title: 'Part of inWD',
				body: 'Encrypted backups come with inWD, our managed infrastructure service. All the details are on the inWD site.',
				cta: 'Visit inwd.org'
			}
		},
		consulting: {
			title: 'Open Source Consulting',
			metaDescription:
				'Open source consulting from WEBDEPLOY: technology assessment, custom development, community engagement and licence compliance.',
			subtitle: 'Expert guidance for adopting and contributing to open source technologies',
			items: [
				'Technology Assessment - Evaluate open source alternatives to proprietary solutions',
				'Custom Development - Build solutions using open source frameworks and tools',
				'Community Engagement - Help your organization contribute back to open source projects',
				'License Compliance - Ensure proper open source license management'
			]
		}
	},

	// Totem/Kiosk page
	totem: {
		heroName: 'inWD™ Kiosk',
		diagramAlt: 'Vertical black kiosk displaying green code on its screen',
		heroTagline: 'Indoor interactive kiosk on open source Linux, updated and supported remotely',
		metaDescription:
			'inWD Kiosk: an indoor interactive kiosk on open source Linux. It shows the app or website you choose and is updated and supported remotely by WEBDEPLOY.',
		requestDemo: 'Start with a conversation',
		learnMore: 'What is included',
		demo: {
			label: 'Interactive kiosk demo',
			caption:
				'The interface on this kiosk is a demo. We can run the one you already use, or design and build the one you need.',
			switchLabel: 'Kiosk system',
			windows: 'Windows kiosk',
			inwd: 'inWD™ Kiosk',
			brand: 'inWD™ Kiosk',
			welcome: 'Welcome',
			prompt: 'Tap a tile to explore',
			back: 'Back',
			footer: 'M4SS Linux Embedded Machine',
			hours: {
				title: 'Opening hours',
				items: ['Mon–Fri 9:00–19:00', 'Saturday 10:00–18:00', 'Sunday closed']
			},
			map: {
				title: 'Find your way',
				items: ['Ground floor: reception, café', 'First floor: exhibition', 'Second floor: library']
			},
			events: {
				title: 'Today',
				items: ['10:30 Guided tour', '14:00 Open source workshop', '17:00 Linux install party']
			},
			updating: 'Working on updates',
			complete: '% complete',
			dontTurnOff: 'Don’t turn off your kiosk. This will take a while.'
		},
		features: {
			linux: {
				title: 'Open source Linux',
				details:
					'The kiosk runs a Linux distribution engineered for Industrial IoT. It runs only what is needed to show the interface you designate, whether that is an app or a website.'
			},
			security: {
				title: 'Encrypted data',
				details:
					'Local data, communications and operations are protected with encryption. Data is encrypted and sent end to end using protocols that provide authentication, confidentiality and integrity. Network traffic is monitored to prevent unauthorised access.'
			},
			noLockIn: {
				title: 'No vendor lock-in',
				details:
					'The system does not depend on proprietary software or on third-party software licences. The hardware can be reused for other purposes and the software overwritten.'
			}
		},
		included: {
			title: 'What inWD Kiosk includes',
			hardware: {
				title: 'Hardware',
				items: [
					'An indoor kiosk; our reference configuration uses a 55-inch monitor',
					'Touch through an infrared frame, separate from the screen, so a damaged component can be replaced on its own, more cheaply and quickly',
					'Connection by Ethernet cable or Wi-Fi, for remote support and a wider range of software'
				]
			},
			software: {
				title: 'Software',
				items: [
					'M4SS Linux Embedded Machine, a Linux distribution reduced to what the designated interface needs',
					'An open architecture: any application you choose can be shown on the screen',
					'Remote configuration, OTA updates and monitoring of the kiosks through inWD, our managed service'
				]
			},
			branding: {
				title: 'Your brand',
				items: [
					'White labelling: a physical space between the base and the monitor holds your brand',
					'The structure can be painted fully or partly to suit its surroundings'
				]
			}
		},
		technology: {
			title: 'Built on S451 by M4SS',
			description:
				'The kiosk runs on S451, a technology from M4SS Srl designed for Industrial IoT devices. M4SS developed in-house the know-how, procedures and software to generate a Linux distribution, called M4SS Linux Embedded Machine. S451 is already used in several industrial sectors, and interactive kiosks are now part of them.',
			listTitle: 'The same technology lets us build systems for:',
			features: [
				'Data acquisition from machines and sensors',
				'Edge computing, with custom software',
				'Secure data transfer',
				'Reliable data storage',
				'Cybersecurity monitoring (IDS/IPS)'
			]
		},
		support: {
			title: 'Support and maintenance',
			description:
				'Systems are updated constantly and updates run periodically. New vulnerabilities in the system packages are prioritised by severity. Each vulnerability in the installed software is analysed, and mitigation procedures are defined according to its severity, scored with CVSS from its type (following OWASP), attack vector, user interaction and attack complexity.',
			features: [
				'Remote technical support through a dedicated ticketing platform',
				'inWD: each kiosk is enrolled in our managed service, which handles remote configuration, OTA (over-the-air) updates of the kiosk operating system and monitoring',
				'Dependencies: periodic updates of what the designated software needs to run',
				'Not included: work on your local network to host the hardware'
			],
			link: 'Visit inwd.org'
		},
		applications: {
			title: 'What it can show',
			description: 'The kiosk shows the application you designate, for example:',
			items: [
				'Opening hours and visitor information',
				'Maps and directions inside a building',
				'Event programmes',
				'A web app or website you already run'
			]
		},
		cta: {
			title: 'Start with a conversation',
			description:
				'Tell us what the kiosk has to show and where it will stand. We will come back with a proposal covering the hardware, the look and the support service.',
			button: 'Email us',
			email: 'Email',
			partnership: 'Technology',
			poweredBy: 'S451 by'
		}
	},

	// Developer Manifesto
	manifesto: {
		title: 'Developer manifesto',
		eyebrow: 'How we think',
		coreBeliefs: 'What we stand for',
		devExp: {
			title: 'Stop fighting your tools',
			description:
				'We build software and infrastructure for developers. Clear docs, useful tools, fewer obstacles in your workflow. Your stack should help you get work done.'
		},
		openSource: {
			title: 'FOSS is the starting point',
			description:
				'We choose FOSS for the freedom to inspect, modify and share software. Cost is only part of it. That freedom guides our technical decisions.'
		},
		workLife: {
			title: 'Burnout is not a feature',
			description:
				"Good software shouldn't cost you your life outside work. We want a way of working we can keep up.",
			items: [
				'Work where you get things done: at the office, at home, or elsewhere.',
				"Work when you're at your best. We adapt to your rhythm.",
				'Manage your own work. Freedom comes with responsibility.'
			],
			note: 'We trust you. Good work matters more than hours on the clock.'
		},
		techPhilosophy: 'How we build',
		quality: {
			title: 'Think about the next change',
			description:
				'We build software to last. Rushing the code leaves technical debt for the next change. We put the work in upfront.'
		},
		docs: {
			title: 'Docs as code',
			description:
				"Documentation is part of every feature we ship. RTFM only works if we've written a manual worth reading."
		},
		tools: {
			title: 'Automate the repetitive work',
			description:
				'We invest in tooling, automation and infrastructure to get repetitive tasks out of the way. If you keep doing the same thing by hand, a script should probably be doing it.'
		},
		community: {
			title: 'Give back to FOSS',
			description: 'Our work depends on open source. We contribute back and share what we know.'
		},
		howWeWork: 'How we work',
		purpose: {
			title: 'Solve a problem. Then write code.',
			description:
				'We build features people need. Code has to earn its place by solving a problem, not by making a slide deck look busy.'
		},
		iterative: {
			title: 'Ship. Learn. Repeat.',
			description:
				'We use CI/CD to release often, get feedback and improve. Software gets better when people can use it and tell us where it falls short.'
		},
		learning: {
			title: 'Make time to learn',
			description: 'We make time to learn, experiment and understand the tools we use.'
		},
		growth: {
			title: 'Grow at a pace we can sustain',
			description:
				"We won't trade how we work or the quality of our code for faster growth. A bigger company with worse software is a bad upgrade."
		},
		cta: 'Building something? Tell us where the stack gets in your way.',
		getInTouch: 'Talk to us'
	},

	// Contacts
	contacts: {
		title: 'Contacts',
		eyebrow: 'Get in touch',
		lead: 'Write to us, call, or visit our office in Parma.',
		business: {
			title: 'Business Inquiries',
			description:
				"Ready to discuss your open source infrastructure needs? We're here to help you escape vendor lock-in and embrace developer-friendly solutions.",
			location: 'Location'
		},
		newsletterLine: 'Prefer updates by email? Subscribe to WEBDEPLOY news and notices.',
		address: 'Via Puccini 15, 43123 Parma (PR), Italy',
		map: {
			loading: 'Loading map…',
			error: 'Unable to load map',
			popupCity: '43123 Parma (PR), Italy'
		},
		careers: {
			title: 'Join Our Team',
			description:
				"Work with us, not for us. We're looking for developers who share our passion for open source, developer experience, and sustainable work practices.",
			perks: 'Remote-friendly • Flexible hours • Open source focus • Work-life balance'
		}
	},

	// News
	news: {
		title: 'News',
		metaDescription:
			'News from WEBDEPLOY: security advisories, open source events and updates on our Linux, infrastructure and backup services.',
		newsletterBandTitle: 'Get WEBDEPLOY news by email',
		newsletterBandText:
			'New articles, security and regulatory notices, and news about our releases and events.',
		newsletterBandLink: 'Choose your updates',
		readMore: 'Read more',
		backToNews: 'News',
		contactUs: 'Contact Us',
		share: 'Share',
		shareOnLinkedIn: 'Share on LinkedIn',
		shareOnInstagram: 'Share on Instagram',
		linkCopied: 'Link copied. You can paste it into your Instagram Story.',
		copyFailed: 'Unable to copy the link. Please copy it from the address bar.',
		instagramStoryLinkCopied: 'Link copied: paste it into your story with the link sticker.',
		instagramDesktop: 'Link copied. Instagram Stories can only be created from the phone app.',
		shareText: 'Read this article:',
		popupBlocked: 'Popup blocked. Opening in new tab instead.',
		fosdem2026: {
			title: 'FOSDEM 2026: Regulation and Infrastructure',
			imageAlt: 'FOSDEM 2026 at ULB Brussels',
			date: '04/02/2026',
			description:
				'Our experience at FOSDEM 2026 in Brussels - from CRA and SBOM devrooms to discovering innovative open source projects like metal-stack.io.',
			descriptionBeforeLink:
				'Our experience at FOSDEM 2026 in Brussels - from CRA and SBOM devrooms to discovering innovative open source projects like ',
			descriptionAfterLink: '.',
			intro:
				"Last weekend we attended FOSDEM 2026 in Brussels, the largest free and open source software conference in Europe. Held at the Université libre de Bruxelles (ULB), this year's edition brought together thousands of developers, maintainers, and open source enthusiasts for two days of talks, workshops, and community building.",
			whatIsFosdem: 'What is FOSDEM?',
			whatIsFosdemDescription:
				"FOSDEM (Free and Open Source Software Developers' European Meeting) is an annual event organized by the community, for the community. With no registration required and completely free to attend, it embodies the open source spirit. The conference features hundreds of talks across multiple tracks, from kernel development to web technologies, from security to documentation.",
			craRoom: 'The CRA Devroom',
			craRoomDescription:
				'One of the devrooms this year was dedicated to the Cyber Resilience Act (CRA). The European regulation is reshaping how open source software will be developed, distributed, and maintained. Talks covered practical implications for maintainers, compliance requirements, and how the open source community is organizing to meet these new challenges while preserving the collaborative nature of FOSS development.',
			sbomRoom: 'SBOM and Supply Chain Security',
			sbomRoomDescription:
				'The Software Bill of Materials (SBOM) track addressed one of the most pressing concerns in modern software development: supply chain security. Sessions explored tools for generating and consuming SBOMs, integration with CI/CD pipelines, and how organizations can leverage SBOMs for vulnerability management.',
			community: 'The Open Source Community',
			communityDescription:
				"What makes FOSDEM special is not just the technical content, but the community itself. Hallway conversations, spontaneous meetups, and the shared understanding that open source is more than code - it's a collaborative movement. Meeting maintainers of projects we use daily, discussing challenges with peers facing similar issues, and discovering new solutions to old problems - this is what keeps us coming back year after year.",
			visitFosdem: 'Visit FOSDEM'
		},
		php2shell: {
			title: 'PHP2Shell: critical PHP vulnerabilities, update now',
			metaDescription:
				'PHP2Shell (CVE-2026-109618 and CVE-2026-109619): critical PHP vulnerabilities allow remote code execution. Which versions are affected and how to update.',
			imageAlt:
				"Watercolour illustration: a giant patched-up elephant hides among overgrown server racks with red warning lights, while a young elf points at it and holds a companion's hand",
			date: '22/10/2026',
			description:
				'Two critical PHP flaws, CVE-2026-109618 and CVE-2026-109619, allow unauthenticated remote code execution on WordPress, Drupal, Magento and almost any other PHP site. What is affected, which versions fix it and what to do with PHP 7.',
			intro:
				'On 21 October 2026 the PHP project released security updates for two critical vulnerabilities, nicknamed PHP2Shell. Details leaked online the day before the coordinated disclosure, and security vendors report exploitation attempts in the wild. Treat any server that runs PHP to serve web requests as exposed until it is updated.',
			whatTitle: 'What PHP2Shell is',
			whatDescription:
				'PHP2Shell is the name for two separate bugs in the PHP engine, both rated critical (CVSS v4.0 9.2). A single unauthenticated HTTP request can be enough to run code on the server with the privileges of the web worker, before any application code runs: no login, plugin or vulnerable application is needed.',
			cves: [
				'CVE-2026-109618: remote code execution through memory corruption when PHP runs out of memory while request data is only partly initialised.',
				'CVE-2026-109619: remote code execution through global state that survives after its memory has been freed; it can also leak memory from the PHP worker process.'
			],
			appsTitle: 'Popular software affected',
			appsDescription:
				'The flaw is in PHP itself, so every application running on a vulnerable PHP version is exposed. Researchers have reported unauthenticated code execution against:',
			appsList: [
				'CMS: WordPress, Drupal, Joomla, MediaWiki',
				'E-commerce: Magento (Adobe Commerce)',
				'Collaboration and webmail: Nextcloud, Roundcube',
				'Administration and billing: phpMyAdmin, WHMCS',
				'Frameworks: Laravel, Symfony and the applications built on them'
			],
			appsNote:
				'Updating WordPress, Drupal, Nextcloud or any other application does not fix the problem: PHP has to be updated on the server.',
			runtimesTitle: 'Affected setups',
			runtimesList: [
				'Apache with mod_php, the most exposed setup',
				'PHP-FPM and php-cgi behind Nginx or Apache',
				'FrankenPHP and LiteSpeed'
			],
			fixedTitle: 'Fixed versions',
			fixedDescription:
				'Update PHP to one of these releases, or to the patched package from your Linux distribution:',
			fixedList: [
				'PHP 8.5.12',
				'PHP 8.4.27',
				'PHP 8.3.36',
				'PHP 8.2.35 (PHP 8.2 reaches end of life on 31 December 2026)'
			],
			legacyTitle: 'PHP 7.4, 8.0 and 8.1',
			legacyDescription:
				'These branches are end of life and will not get an official release. The PHP security team has still published minimal source backports of the fix, for those who build PHP from source:',
			legacyLinks: [
				{
					label: 'PHP 7.4',
					url: 'https://github.com/php/php-src/tree/PHP-7.4-CVE-2026-109618-109619'
				},
				{
					label: 'PHP 8.0',
					url: 'https://github.com/php/php-src/tree/PHP-8.0-CVE-2026-109618-109619'
				},
				{
					label: 'PHP 8.1',
					url: 'https://github.com/php/php-src/tree/PHP-8.1-CVE-2026-109618-109619'
				}
			],
			legacyNote:
				"If you use distribution packages, check your vendor's advisories or an extended support provider for patched builds. PHP 5.4 to 7.3 get no fix at all: the only way out is upgrading to a supported version.",
			mitigationTitle: 'If you cannot update right away',
			mitigationDescription:
				'The PHP advisory lists temporary measures that reduce exposure. They do not make an unpatched server safe:',
			mitigationList: [
				'Set session.upload_progress.enabled = 0 in php.ini or in the FPM pool (not with ini_set() or .user.ini) and restart every worker',
				'Lower post_max_size to 8M, or 32M if uploads are needed, keeping upload_max_filesize below it',
				'On PHP 8.5, set fatal_error_backtraces = 0',
				'Put WAF rules for the known exploit vectors in front of the site: Cloudflare has deployed them for all plans'
			],
			mitigationNote:
				'Where an immediate update is not feasible, CERT-EU, the cybersecurity service of the EU institutions, recommends isolating internet-facing systems from public networks until the fix is applied and verified.',
			sourcesTitle: 'Sources and further reading',
			sources: [
				{
					label: 'PHP security advisory (php.net)',
					url: 'https://www.php.net/archive/2026.php#2026-10-21-5'
				},
				{
					label: 'GHSA-w8hw-w9fx-j79w: CVE-2026-109618',
					url: 'https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w'
				},
				{
					label: 'GHSA-6wmf-4rv5-p3rp: CVE-2026-109619',
					url: 'https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp'
				},
				{
					label: 'CERT-EU security advisory 2026-018',
					url: 'https://cert.europa.eu/publications/security-advisories/2026-018/'
				},
				{ label: 'PHP2Shell research site', url: 'https://www.php2shell.com/' },
				{
					label: 'watchTowr: PHP2Shell FAQ',
					url: 'https://watchtowr.com/intelligence/php-cve-2026-109618-faq/'
				}
			],
			visitAdvisory: 'Read the PHP advisory'
		}
	},

	// Footer
	footer: {
		tagline: 'developing greatness',
		description: 'Open source infrastructure and developer-focused solutions.',
		product: 'Product',
		resources: 'Resources',
		company: 'Company',
		careers: 'Careers',
		copyright: 'Copyright © 2026 WEBDEPLOY S.R.L.',
		trademarks: 'WEBDEPLOY™ and inWD™ are trademarks of WEBDEPLOY S.R.L.',
		registeredOffice: 'Registered office',
		shareCapital: 'Share capital: €10,000.00',
		security: 'Security',
		privacy: 'Privacy Policy',
		newsletter: 'Newsletter',
		source: 'Source code',
		cookieSettings: 'Cookie settings'
	},

	// Security page
	security: {
		title: 'Security',
		heading: 'Security at WEBDEPLOY',
		metaDescription:
			'Who is responsible for information security at WEBDEPLOY SRL, and how to report a vulnerability.',
		responsibleTitle: 'Who is responsible',
		responsibleText:
			'Federico Bologni, Amministratore Unico of WEBDEPLOY SRL, is responsible for information security, including infrastructure hardening, vulnerability management, incident response, and the coordinated disclosure of security issues.',
		reportingTitle: 'Reporting a vulnerability',
		reportingIntro:
			'If you believe you have found a security vulnerability in our websites, services or infrastructure, please report it by email to',
		includeTitle: 'Please include:',
		includeItems: [
			'A description of the issue and the affected system, URL or component',
			'Steps to reproduce it, or a proof of concept',
			'The impact you believe it has',
			'How we can contact you, and whether you would like to be credited'
		],
		acknowledgement:
			'We aim to acknowledge every report within 5 working days and to keep you informed while we investigate and fix the issue.',
		disclosure:
			'Please do not disclose the issue publicly, or to anyone else, until we have released a fix and agreed a disclosure date with you.',
		safeHarbour:
			'We will not pursue or support legal action against anyone who reports a vulnerability to us in good faith, makes a reasonable effort to avoid privacy violations, data destruction and service disruption, accesses only the data needed to demonstrate the issue, and gives us reasonable time to fix it before any disclosure.',
		approachTitle: 'Our approach',
		approachItems: [
			'A hardening baseline on the servers we manage, with a firewall and fail2ban',
			'Regular operating system and package patching on the servers we manage',
			'Encrypted, off-site backups with BorgBackup',
			'Intrusion detection with Suricata on managed hosts',
			'We follow security advisories from CERT-EU and ENISA'
		],
		companyLabel: 'Company details'
	},

	// Privacy Policy
	privacy: {
		title: 'Privacy Policy',
		intro:
			'WEBDEPLOY S.R.L. is committed to protecting your privacy. This page explains how we handle your data when you visit and use our website.',
		analyticsTitle: 'Analytics',
		analyticsText:
			'We use Matomo, a privacy-focused, self-hosted analytics platform. Our configuration is designed to respect your privacy:',
		analyticsFeatures: [
			'No cookies are set on your device',
			'IP addresses are anonymized',
			'Do Not Track browser setting is respected',
			'Data is stored on Hetzner Online GmbH servers in Falkenstein, Saxony (Germany)'
		],
		optOutTitle: 'Opt out of analytics',
		optOutText:
			'Even though we use privacy-friendly tracking, you can opt out of analytics entirely:',
		dataTitle: 'Data We Collect',
		dataText:
			'We use cookieless Matomo analytics. It retains per-visit records of pages and time spent, referrer, browser and screen size, and country derived from anonymized IP. Other website features also process personal data as described below:',
		mapText:
			'The map on the contacts page loads its tiles from OpenStreetMap (tile.openstreetmap.org, operated by the OpenStreetMap Foundation). To show the map, your browser sends your IP address and browser details to that server; we do not receive this data.',
		dataItems: [
			'Pages visited and time spent',
			'Referring website',
			'Browser type and screen size',
			'Country (derived from anonymized IP)'
		],
		contactTitle: 'Contact',
		contactText: 'For any privacy-related questions, contact us at:',
		marketingTitle: 'Marketing & advertising',
		marketingText:
			'With your explicit consent, we load the Meta (Facebook/Instagram) Pixel to measure our advertising campaigns and conversion funnels; WEBDEPLOY sees only aggregated, anonymised statistics and does not use it for retargeting. Pixel requests may disclose page URLs and parameters, referrer, browser and device data, and Meta cookie identifiers. You can change or withdraw consent at any time using Cookie settings in the footer; withdrawing stops the pixel and removes its cookies. Without consent, no advertising script is loaded.',
		newsletterTitle: 'Newsletter',
		newsletterItems: [
			'Controller and contact: WEBDEPLOY S.R.L., registered office at Via Puccini 15, 43123 Parma (PR), Italy; info@webdeploy.it; PEC legal@pec.webdeploy.it. WEBDEPLOY has appointed a Data Protection Officer, who can be reached at the PEC address legal@pec.webdeploy.it.',
			'Data processed: email address, selected lists, signup and confirmation times, the IP address recorded when the confirmation link is used, and bounce records. The web server log for the signup request includes the IP address for up to 90 days.',
			'Purposes and legal bases: two separate purposes, each based on the consent given for its list: sending WEBDEPLOY news and notices, or sending information about WEBDEPLOY services and offers. Membership records and timestamps are used as evidence of consent.',
			'Confirmation: after signup, Listmonk sends one email asking you to confirm your address. No newsletter is sent unless you confirm. One confirmation email may cover both lists you selected.',
			'Emails: each subscriber receives one welcome email after confirmation. General-list subscribers also receive one introductory email about a week after confirming that list and one email when each news post is published. Marketing-list subscribers receive messages about WEBDEPLOY services and offers. News frequency follows post publication; no fixed cadence is promised.',
			'Email measurement: open and click tracking are disabled. Links may include campaign-level parameters measured by cookieless Matomo analytics, which retains per-visit records. After ALTCHA succeeds, Matomo records newsletter_submit_initiated without the email address or selected list. This measurement sets no cookies and is not linked to your email address.',
			'Service locations: the newsletter is managed in self-hosted Listmonk and automation hosted by Hetzner in Helsinki, Finland. Email is sent through a Hetzner mail server in Falkenstein, Germany. A recipient’s own email provider may process data outside the EU.',
			'Retention in the live system: unconfirmed signups are deleted after 30 days. A withdrawn list membership is deleted within 24 hours; the email address is deleted when no other subscription remains. Bounce and complaint records are deleted on the same basis; no separate suppression list is kept.',
			'A one-off rollback copy of deleted early-access records is kept in a root-only server location for no more than 30 days after deletion, then deleted.',
			'Backups: encrypted backups may retain deleted records for up to about seven months, subject to the configured archive count and age limit.',
			'Your rights: campaign emails carry an unsubscribe link. The transactional welcome and day-7 emails carry only a manage-subscriptions link and have no unsubscribe headers; use that page to withdraw either consent. You can also request an export or deletion, contact us at info@webdeploy.it, or complain to the Italian Data Protection Authority (Garante per la protezione dei dati personali).',
			'Meta Pixel: the Lead event is sent only if you accepted marketing cookies and the pixel is loaded. At signup it sends the event name and the fixed label content_name: newsletter, never your email address or list choice. Pixel requests also disclose the page URL and its parameters, referrer, browser and device data, and Meta’s cookie identifier. For collecting and transmitting this data, WEBDEPLOY and Meta Platforms Ireland Ltd are joint controllers; Meta then processes it as an independent controller. Meta may transfer data to the United States under the EU-US Data Privacy Framework. WEBDEPLOY uses the pixel only for campaign statistics and conversion funnels and sees only aggregated, anonymised reports. You can withdraw marketing-cookie consent using Cookie settings in the footer.'
		],
		dpaTitle: 'Data Processing Agreement (DPA)',
		dpaText:
			'When WEBDEPLOY S.R.L. processes personal data on your behalf as a processor, it does so under a Data Processing Agreement (DPA) compliant with Art. 28 GDPR: defined purpose and duration, technical and organizational security measures, a list of sub-processors, assistance with data-subject requests, and deletion or return of the data at the end of the service. Request the DPA text by writing to info@webdeploy.it.',
		optOut: {
			OptOutComplete:
				'Opt-out complete; your visits to this website will not be recorded by the Web Analytics tool.',
			OptOutCompleteBis:
				'If you clear your cookies, delete the opt-out cookie, or change computers or browsers, you will need to opt out again.',
			YouMayOptOut2:
				'You may choose to prevent this website from aggregating and analyzing the actions you take here.',
			YouMayOptOut3:
				'Doing so will protect your privacy, but will also prevent the owner from learning from your actions and creating a better experience for you and other users.',
			OptOutErrorNoCookies: 'The tracking opt-out feature requires cookies to be enabled.',
			OptOutErrorNotHttps:
				'The tracking opt-out feature may not work because this site was not loaded over HTTPS. Please reload the page to check if your opt-out status changed.',
			YouAreNotOptedOut: 'You are not opted out.',
			UncheckToOptOut: 'Uncheck this box to opt out.',
			YouAreOptedOut: 'You are currently opted out.',
			CheckToOptIn: 'Check this box to opt in.'
		}
	},

	// Common
	common: {
		phone: 'Phone',
		skipToContent: 'Skip to main content',
		opensInNewTab: '(opens in a new tab)'
	},

	// Error page
	error: {
		pageTitle: 'Error',
		notFoundTitle: 'Page Not Found',
		serverErrorTitle: 'Internal Server Error',
		forbiddenTitle: 'Access Forbidden',
		genericTitle: 'Something Went Wrong',
		notFoundText: "The page you're looking for doesn't exist or has been moved.",
		serverErrorText: 'Our servers encountered an unexpected error. Please try again later.',
		forbiddenText: "You don't have permission to access this resource.",
		genericText: 'An unexpected error occurred. Please try again.',
		returnHome: 'Return Home',
		goBack: 'Go Back',
		needHelp: 'Need help? Contact us at'
	},

	// Cookie / marketing consent
	consent: {
		title: 'Privacy & cookies',
		body: 'Matomo is cookieless. Meta ads use cookies only if you accept. Read our <a href="/privacy" class="text-primary underline underline-offset-2">privacy notice</a>.',
		accept: 'Accept',
		reject: 'Reject',
		close: 'Close'
	},

	// Newsletter signup
	newsletter: {
		title: 'WEBDEPLOY newsletter',
		metaDescription: 'Choose which WEBDEPLOY news and service updates you want by email.',
		heading: 'From the workbench',
		lead: 'WEBDEPLOY news, security notices and offers by email.',
		whatTitle: 'Choose one or both lists',
		generalLabel: 'News and notices',
		generalText:
			"I agree to receive WEBDEPLOY's news by email: technical articles, security and regulatory notices, and news about its releases and events. An email is sent when a news post is published, plus one introductory email about a week after I confirm.",
		marketingLabel: 'Services and offers',
		marketingText:
			"I agree to receive emails promoting WEBDEPLOY's services (inWD, encrypted backups, Linux migration, inWD Kiosk, consulting), including offers.",
		emailLabel: 'Email address',
		emailPlaceholder: 'you@example.com',
		requiredError: 'Choose at least one email list.',
		submit: 'Subscribe',
		submitting: 'Checking your request…',
		afterSignup: 'After you subscribe',
		confirmationNote:
			'We first send one email to confirm your address; nothing else is sent until you confirm. After you confirm, you receive one welcome email.',
		withdrawalNote:
			'You can withdraw either consent at any time from any email. That subscription is then deleted within 24 hours, and your address with it once no subscription remains.',
		controllerNote: 'WEBDEPLOY S.R.L. is the data controller.',
		privacyLink: 'Read the newsletter privacy notice',
		noScript: 'Turn on JavaScript to complete the spam check.',
		success: 'Check your inbox to confirm your subscription.',
		requestError: "We couldn't complete your signup. Check your address and try again.",
		unknownResult: 'We couldn’t confirm your signup. Check your inbox before trying again in a few minutes.',
		rateLimitError: 'Too many signup attempts. Please try again later.',
		verificationError: 'The spam check could not be completed. Please try again.',
		setupError: 'The spam check could not be loaded. Reload the page to try again.',
		recentNews: 'Read our latest news',
		confirmedTitle: 'Subscription confirmed',
		confirmedText:
			'Your address is confirmed. Look for WEBDEPLOY email from newsletter@inwd.org. You can leave a list at any time using the link in an email.',
		confirmedNews: 'Read the latest article'
	}
};
