export const it = {
	// Navigation
	nav: {
		home: 'Home',
		products: 'Prodotti',
		kiosk: 'Totem interattivo inWD',
		news: 'Notizie',
		services: 'Servizi',
		encryptedStorage: 'Archiviazione cifrata dei dati',
		linuxMigration: 'Migrazione delle workstation a Linux',
		managedInfra: 'Infrastruttura gestita',
		manifesto: 'Manifesto per chi sviluppa',
		contacts: 'Contatti',
		mainNavigation: 'Navigazione principale',
		mobileNavigation: 'Navigazione mobile',
		productsSubmenu: 'Sottomenu prodotti',
		servicesSubmenu: 'Sottomenu servizi',
		openMenu: 'Apri il menu',
		closeMenu: 'Chiudi il menu',
		switchLanguage: 'Cambia lingua'
	},

	// Home page
	home: {
		heroName: 'webdeploy',
		heroText: 'developing greatness',
		heroSubtitle: 'A look into the Future<void>',
		heroEyebrow: 'WebDeploy / open source',
		heroTagline: 'Software e infrastruttura open source per team che vogliono sistemi chiari e affidabili.',
		heroImageAlt: 'Logo di WebDeploy',
		manifestoBtn: 'Manifesto per chi sviluppa',
		systemOnline: 'Sistema attivo',
		servicesBtn: 'Scopri i servizi',
		servicesEyebrow: 'Cosa facciamo',
		servicesTitle: 'Tecnologia aperta. Supporto concreto.',
		servicesDescription: 'Supporto diretto per Linux, dati privati e infrastrutture che puoi comprendere.',
		exploreService: 'Scopri il servizio',
		aboutEyebrow: 'Il nostro approccio',
		aboutTitle: 'Strumenti aperti. Scelte chiare.',
		aboutDescription: 'Usiamo strumenti open source e processi trasparenti, per aiutarti a capire e controllare la tecnologia su cui fai affidamento.',
		hqTitle: 'La sede virtuale interattiva di WebDeploy',
		hqFrameTitle: 'Sede virtuale interattiva di WebDeploy: bar al neon e scrivanie degli sviluppatori, in 2D o 3D',
		hqHint: "Premi T o il pulsante 2D/3D per entrare · M per l'audio · C per muoverti liberamente nella scena 3D",
		aboutImageAlt: 'Illustrazione della sede di WebDeploy',
		aboutLink: 'Leggi il manifesto per chi sviluppa',
		ctaEyebrow: 'Inizia da qui',
		ctaTitle: 'Iniziamo con una conversazione',
		ctaDescription: 'Raccontaci a cosa stai lavorando e dove ti serve un partner affidabile.',
		ctaContact: 'Contatta WebDeploy',
		features: {
			linux: {
				title: 'Passa a Linux con un piano',
				details: 'Migrazione e supporto per workstation Linux stabili, utili e sotto il tuo controllo.',
				linkLabel: 'Migrazione a Linux'
			},
			privacy: {
				title: 'Archiviazione che rispetta i tuoi dati',
				details: 'Archiviazione e infrastruttura private e cifrate, pensate per mantenere i dati della tua attività sotto il tuo controllo.'
			},
			inwd: {
				title: 'Infrastruttura gestita, definita nel codice',
				details: 'Workflow Git familiari per rendere le modifiche all’infrastruttura visibili, ripetibili e più semplici da gestire.',
				linkLabel: 'Infrastruttura gestita'
			}
		}
	},

	// Services page
	services: {
		title: 'Servizi',
		metaDescription:
			'I servizi open source di WebDeploy: infrastruttura gestita, migrazione delle workstation a Linux, totem interattivi e consulenza tecnica.',
		inwd: {
			title: 'inwd - Infrastruttura gestita',
			subtitle: 'Infrastructure as Code (IaC) con workflow Git',
			diagramAlt: "Schema dell'infrastruttura inwd",
			description:
				'Trasforma la gestione della tua infrastruttura con la nostra piattaforma inwd - una soluzione completa di infrastruttura gestita che tratta i tuoi server, le tue reti e i tuoi deployment come codice. Costruita per sviluppatori che capiscono che l\'infrastruttura deve essere prevedibile, versionata e facilmente scalabile.',
			whatMakesDifferent: 'Cosa distingue inwd',
			features: [
				'Infrastruttura versionata — ogni modifica tracciata, ogni deployment riproducibile',
				'Esperienza pensata per gli sviluppatori — workflow Git familiari per la gestione dell\'infrastruttura',
				'Zero vendor lock-in — strumenti open source, processi trasparenti',
				'Trasparenza dei costi — nessun costo nascosto, nessuna sorpresa',
				'Monitoraggio 24/7 — avvisi proattivi e interventi correttivi automatici'
			],
			gitops: {
				title: 'Workflow GitOps',
				items: [
					"Gestisci l'infrastruttura attraverso pull request",
					'Pipeline di testing e validazione automatizzate',
					'Capacità di rollback con la cronologia Git',
					'Collaborazione del team attraverso code review'
				]
			},
			security: {
				title: 'Sicurezza fin dalla progettazione',
				items: [
					'Gestione dei segreti crittografata',
					'Patch di sicurezza automatizzate',
					'Monitoraggio della conformità e reporting',
					'Architettura di rete zero-trust'
				]
			},
			observability: {
				title: 'Osservabilità e monitoraggio',
				items: [
					'Metriche in tempo reale e dashboard',
					'Regole di alerting personalizzate',
					'Indicazioni per ottimizzare le prestazioni',
					'Automazione della pianificazione della capacità'
				]
			},
			multiCloud: {
				title: 'Supporto multi-cloud e ibrido',
				items: [
					'AWS, Azure, Google Cloud e on-premises',
					'Orchestrazione Kubernetes',
					'Gestione del container registry',
					'Opzioni Database as a Service'
				]
			}
		},
		linux: {
			title: 'Migrazione e gestione delle workstation Linux',
			subtitle: 'Liberati dalla dipendenza da Windows con servizi di migrazione professionali',
			description:
				'Aiuta la tua organizzazione nella transizione da workstation Windows a Linux con i nostri servizi completi di migrazione e gestione continua. Gestiamo tutto, dalla valutazione iniziale al supporto a lungo termine, assicurando che il tuo team rimanga produttivo durante tutta la transizione.',
			assessment: {
				title: 'Valutazione e pianificazione',
				items: [
					'Inventario software attuale e analisi di compatibilità',
					'Documentazione e ottimizzazione del workflow utente',
					'Piano di migrazione personalizzato con interruzioni minime',
					'Sviluppo del piano di formazione per il tuo team'
				]
			},
			transition: {
				title: 'Processo di transizione fluido',
				items: [
					'Migrazione dei dati con garanzia di assenza di perdite',
					'Sostituzione e configurazione delle applicazioni',
					'Preservazione del profilo utente e delle impostazioni',
					'Rollout graduale per minimizzare l\'impatto sul business'
				]
			},
			training: {
				title: 'Formazione e supporto',
				items: [
					'Programmi di formazione personalizzati per diversi tipi di utenti',
					'Documentazione e guide di riferimento rapido',
					'Periodo di supporto intensivo di 30 giorni post-migrazione',
					'Assistenza tecnica continua e troubleshooting'
				]
			}
		},
		kiosk: {
			title: 'Soluzioni kiosk personalizzate',
			subtitle: 'Alternative Linux ai sistemi kiosk Windows',
			description:
				'Progetta e implementa soluzioni kiosk interattive usando tecnologia open source. Ideali per negozi, strutture sanitarie e scolastiche e spazi pubblici dove affidabilità e personalizzazione contano più del vendor lock-in.',
			learnMore: 'Scopri di più sulle nostre soluzioni kiosk'
		},
		consulting: {
			title: 'Consulenza open source',
			subtitle: 'Consulenza per adottare tecnologie open source e contribuire ai relativi progetti',
			items: [
				'Valutazione tecnologica — valuta alternative open source a soluzioni proprietarie',
				'Sviluppo personalizzato — costruisci soluzioni usando framework e strumenti open source',
				'Coinvolgimento della comunità — aiuta la tua organizzazione a contribuire ai progetti open source',
				'Conformità delle licenze — assicura una corretta gestione delle licenze open source'
			]
		},
		cta: {
			title: 'Vuoi iniziare?',
			description:
				'Ogni progetto inizia con la comprensione delle tue esigenze uniche. Discutiamo di come il nostro approccio orientato agli sviluppatori può risolvere le tue sfide infrastrutturali e tecnologiche.',
			contactUs: 'Contattaci:',
			careers: 'Lavora con noi:'
		}
	},

	// Totem/Kiosk page
	totem: {
		heroName: 'Totem interattivo inWD',
		diagramAlt: 'Schema del totem inWD Kiosk',
		heroTagline: "L'alternativa open source basata su Linux ai sistemi kiosk Windows",
		requestDemo: 'Richiedi una demo',
		learnMore: 'Scopri di più',
		features: {
			openSource: {
				title: 'Fondamenta open source',
				details:
					'Basato sul solido Sonmi OS di m4ss.net, una distribuzione Linux progettata per applicazioni kiosk e soluzioni IoT industriali.'
			},
			windowsFree: {
				title: "L'alternativa senza Windows",
				details:
					"Liberati dal vendor lock-in, dai costi di licenza e dagli aggiornamenti forzati. La nostra soluzione basata su Linux ti dà il pieno controllo sull'ambiente del tuo totem."
			},
			developer: {
				title: 'Progettato per gli sviluppatori',
				details:
					'Completamente personalizzabile tramite Infrastructure as Code (IaC), per dare agli sviluppatori la libertà di creare esattamente ciò di cui la tua attività ha bisogno.'
			}
		},
		whyLinux: {
			title: 'Perché scegliere Linux invece di Windows per i totem?',
			freedom: {
				title: 'Libertà e controllo',
				items: [
					'Nessun aggiornamento forzato che interrompa il funzionamento del totem',
					'Personalizzazione completa: modifica qualsiasi cosa in base alle tue esigenze',
					'Nessun costo di licenza: riduci in modo significativo i costi operativi',
					'Piena proprietà del tuo stack hardware e software'
				]
			},
			security: {
				title: 'Sicurezza rafforzata',
				items: [
					'Kernel Linux irrobustito, con una superficie di attacco minima',
					"La trasparenza dell'open source: nessuna backdoor nascosta e nessuna telemetria",
					'Permessi granulari: limita esattamente ciò a cui gli utenti possono accedere',
					'Codice verificato dalla comunità, nel rispetto delle migliori pratiche di sicurezza'
				]
			},
			performance: {
				title: 'Prestazioni superiori',
				items: [
					'Sistema operativo leggero: più risorse per la tua applicazione',
					"Stabile e affidabile: l'uptime di Linux si misura in anni, non in giorni",
					'Nessun processo in background che consuma risorse, come la telemetria di Windows',
					'Ottimizzato per sistemi embedded e totem'
				]
			}
		},
		sonmi: {
			title: 'Basato su Sonmi OS, in partnership con m4ss.net',
			description:
				"La nostra soluzione per totem sfrutta Sonmi OS, un'innovativa distribuzione Linux sviluppata da m4ss.net, una startup tecnologica specializzata in soluzioni IoT industriali.",
			features: [
				"Affidabilità di livello industriale, grazie all'esperienza di m4ss.net nell'IoT",
				'Principi etici nella tecnologia: entrambe le aziende sostengono EFF e FSF',
				"Attenzione all'ambiente: attività alimentate al 100% da energia pulita",
				"Etica hacker: cambiare le regole del gioco attraverso l'innovazione"
			]
		},
		iac: {
			title: 'Gestione tramite Infrastructure as Code (IaC)',
			description:
				'A differenza delle tradizionali soluzioni kiosk basate su Windows, inWD Kiosk è gestito interamente tramite IaC:',
			features: [
				'Configurazioni versionate: traccia ogni modifica',
				'Deployment riproducibili: configurazioni identiche in ogni sede',
				'Provisioning automatizzato: installa decine di totem senza fatica',
				'Workflow GitOps: gestisci i totem come un software moderno'
			]
		},
		applications: {
			title: 'Applicazioni concrete',
			description: 'Ideale per le organizzazioni che cercano alternative nei mercati dominati da Windows:',
			items: [
				"Enti pubblici in transizione verso l'open source",
				'Negozi che hanno bisogno di soluzioni affidabili ed economiche',
				'Istituti scolastici che sostengono iniziative FOSS',
				'Strutture sanitarie che richiedono sistemi sicuri e stabili',
				'Eventi e fiere che richiedono esperienze personalizzabili'
			]
		},
		cta: {
			title: 'Vuoi dire addio ai totem Windows?',
			description:
				"Unisciti al numero crescente di aziende che scelgono alternative open source attente all'esperienza degli sviluppatori, all'affidabilità dei sistemi e alla trasparenza dei costi.",
			button: 'Richiedi oggi la tua demo',
			email: 'Email',
			partnership: 'Partnership',
			poweredBy: 'Basato su'
		}
	},

	// Developer Manifesto
	manifesto: {
		title: 'Manifesto per chi sviluppa',
		coreBeliefs: 'Da qui partiamo',
		devExp: {
			title: 'Basta lottare con gli strumenti',
			description:
				'Costruiamo software e infrastruttura per chi sviluppa. Docs chiare, strumenti utili, meno ostacoli nel workflow. Il tuo stack deve aiutarti a lavorare.'
		},
		openSource: {
			title: 'Il FOSS è il punto di partenza',
			description:
				'Scegliamo il FOSS per la libertà di leggere, modificare e condividere il codice. Il costo è solo una parte del discorso. Quella libertà guida le nostre scelte tecniche.'
		},
		workLife: {
			title: 'Il burnout non è una feature',
			description:
				'Fare buon software non dovrebbe costarti la vita fuori dal lavoro. Vogliamo un modo di lavorare che possiamo reggere nel tempo.',
			items: [
				'Scegli il posto in cui lavori meglio: ufficio, casa o altrove.',
				'Lavora negli orari in cui ti trovi meglio. Ci adattiamo al tuo ritmo.',
				'Gestisci il tuo lavoro. La libertà comporta responsabilità.'
			],
			note: 'Ci fidiamo di te. Conta il lavoro fatto bene, più delle ore sul cartellino.'
		},
		techPhilosophy: 'Come costruiamo',
		quality: {
			title: 'Pensa alla prossima modifica',
			description:
				'Costruiamo software che duri. Il codice scritto di fretta lascia debito tecnico a chi deve modificarlo dopo. Investiamo tempo fin dall\'inizio.'
		},
		docs: {
			title: 'Docs as code',
			description:
				'La documentazione fa parte di ogni feature che rilasciamo. RTFM funziona solo se abbiamo scritto un manuale che vale la pena leggere.'
		},
		tools: {
			title: 'Automatizza il lavoro ripetitivo',
			description:
				'Investiamo in tooling, automazione e infrastruttura per togliere di mezzo il lavoro ripetitivo. Se continui a fare la stessa cosa a mano, probabilmente dovrebbe farla uno script.'
		},
		community: {
			title: 'Contribuiamo al FOSS',
			description:
				'Il nostro lavoro dipende dall\'open source. Contribuiamo all\'ecosistema e condividiamo quello che sappiamo.'
		},
		howWeWork: 'Come lavoriamo',
		purpose: {
			title: 'Prima il problema, poi il codice',
			description:
				'Costruiamo feature che servono a chi le usa. Il codice deve risolvere un problema, non riempire una presentazione.'
		},
		iterative: {
			title: 'Rilascia. Impara. Ripeti.',
			description:
				'Usiamo CI/CD per rilasciare spesso, raccogliere feedback e migliorare. Il software migliora quando chi lo usa può dirci cosa non funziona.'
		},
		learning: {
			title: 'Trova il tempo per imparare',
			description:
				'Dedichiamo tempo a imparare, sperimentare e capire gli strumenti che usiamo.'
		},
		growth: {
			title: 'Cresciamo a un ritmo che reggiamo',
			description:
				'Non sacrifichiamo il nostro modo di lavorare o la qualità del codice per crescere più in fretta. Un\'azienda più grande con software peggiore è un pessimo upgrade.'
		},
		cta: 'Stai costruendo qualcosa? Raccontaci dove lo stack ti complica il lavoro.',
		getInTouch: 'Parliamone'
	},

	// Contacts
	contacts: {
		title: 'Contatti',
		business: {
			title: 'Richieste commerciali',
			description:
				'Vuoi parlare delle tue esigenze di infrastruttura open source? Siamo qui per aiutarti a sfuggire al vendor lock-in e abbracciare soluzioni developer-friendly.',
			location: 'Sede'
		},
		address: 'Via Puccini 15, 43123 Parma (PR), Italia',
		map: {
			loading: 'Caricamento della mappa…',
			error: 'Impossibile caricare la mappa',
			popupCity: '43123 Parma (PR), Italia'
		},
		careers: {
			title: 'Unisciti al nostro team',
			description:
				'Lavora con noi, non per noi. Cerchiamo sviluppatori che condividono la nostra passione per l\'open source, l\'esperienza degli sviluppatori e le pratiche di lavoro sostenibili.',
			perks: 'Lavoro da remoto • Orari flessibili • Open source • Equilibrio tra lavoro e vita privata'
		}
	},

	// Early Access (funnel NIS2/CRA)
	earlyAccess: {
		title: 'Early access NIS2/CRA',
		subtitle: 'Hosting progettato per essere conforme a NIS2 e CRA, con evidenze pronte per l\'audit.',
		benefitsTitle: 'Cosa ottieni',
		benefits: [
			'Gap analysis NIS2/CRA per PMI e MSP: 25 minuti di lettura, zero buzzword',
			'Dove sei oggi rispetto a NIS2 e CRA e cosa ti manca davvero',
			'Un piano concreto per i prossimi 90 giorni',
			'Posto in lista per l\'early access riservato a 10 PMI italiane'
		],
		form: {
			email: 'Email aziendale',
			name: 'Nome e cognome',
			company: 'Azienda',
			emailPlaceholder: 'nome@azienda.it',
			rolePlaceholder: 'Il tuo ruolo',
			roleA: 'CTO / IT manager',
			roleB: 'C-level / Titolare',
			roleC: 'Compliance officer / DPO',
			submit: 'Iscriviti alla lista per l\'accesso anticipato',
			sending: 'Invio in corso...',
			successTitle: 'Ci siamo quasi',
			success:
				'Ti abbiamo inviato un\'email: conferma l\'iscrizione e ricevi la gap analysis NIS2/CRA.',
			error:
				'Qualcosa non ha funzionato. Controlla l\'email e la spunta sul consenso, poi riprova.',
			errorSubmit:
				'Invio non riuscito. Riprova tra poco; se il problema persiste scrivici a info@webdeploy.it.',
			consent:
				'Acconsento al trattamento dei miei dati per ricevere comunicazioni sull\'early access WebDeploy. Posso revocare il consenso in qualsiasi momento. Vedi <a href="/privacy" class="text-primary hover:underline">Privacy</a> e <a href="/privacy#dpa" class="text-primary hover:underline">DPA</a>.',
			gdprNote:
				'Doppio opt-in: riceverai un\'email di conferma. Niente spam, nessuna cessione a terzi.'
		},
		confirmed: {
			title: 'Iscrizione confermata',
			subtitle: 'Sei dentro. La tua gap analysis NIS2/CRA sta arrivando nella tua casella email.',
			nextTitle: 'Cosa succede ora',
			next: [
				'Controlla l\'email: trovi il link per scaricare la gap analysis NIS2/CRA',
				'Una sola email a settimana, sempre concreta, niente spam',
				'Tra poche settimane apriamo l\'early access a 10 PMI italiane — sei già in lista'
			],
			cta: 'Scopri l\'infrastruttura gestita',
			tagline: 'developing greatness'
		}
	},

	// News
	news: {
		title: 'Notizie',
		pageDescription: 'Ultime notizie e aggiornamenti da WebDeploy',
		readMore: 'Leggi di più',
		backToNews: 'Notizie',
		interestedSimilar: 'Ti interessa una soluzione simile per la tua istituzione?',
		interestedTourism: 'Ti interessa un\'app turistica per la tua città?',
		contactUs: 'Contattaci',
		share: 'Condividi',
		shareOnLinkedIn: 'Condividi su LinkedIn',
		shareOnInstagram: 'Condividi su Instagram',
		linkCopied: 'Link copiato. Puoi incollarlo nella tua Storia Instagram.',
		copyFailed: 'Impossibile copiare il link. Copialo dalla barra degli indirizzi.',
		shareText: 'Leggi questo articolo:',
		popupBlocked: 'Popup bloccato. Apertura in una nuova scheda.',
		openSourceRelease: {
			title: 'webdeploy.it è ora open source',
			imageAlt: 'webdeploy.it è ora open source con licenza AGPL-3.0',
			date: '17/04/2026',
			description:
				'Il codice sorgente di webdeploy.it è ora pubblico sotto licenza AGPL-3.0. Costruito con SvelteKit, Tailwind CSS e Leaflet — scelte tecniche guidate da documentazione facile da leggere per gli LLM.',
			intro:
				'Il sito che stai leggendo in questo momento è open source. Abbiamo appena pubblicato il codice sorgente completo di webdeploy.it sul nostro repository pubblico, sotto la GNU Affero General Public License v3.0. Il vero codice di produzione — un\'applicazione statica SvelteKit, alcuni componenti Svelte, un po\' di Tailwind CSS e una mappa Leaflet con tile OpenStreetMap. Puoi clonarlo, forkarlo, ospitarlo sui tuoi server o semplicemente leggerne il codice.',
			whatHappened: 'Cosa abbiamo pubblicato',
			whatHappenedDescription:
				'Tutto ciò che compone il sito in produzione è ora nel repository: l\'app SvelteKit in src/, le traduzioni in inglese e italiano, la libreria di componenti, i design token del tema retro-cyberpunk, il Dockerfile e la configurazione della pipeline CI. Nessun sottomodulo privato, nessuna dipendenza chiusa — ciò che cloni è esattamente ciò che gira su webdeploy.it.',
			stackTitle: 'Lo stack',
			stackIntro: 'Il sito è volutamente piccolo. Tre strumenti fanno quasi tutto il lavoro:',
			stack: [
				'SvelteKit con l\'adapter statico — prerenderizzato in HTML puro e servito come file statici.',
				'Tailwind CSS v4 — costruito attorno ai design token @theme e a uno stile retrò a raggio zero con ombre nette.',
				'Leaflet con tile OpenStreetMap — uno stack per le mappe senza chiavi e senza vendor proprietari, introdotto al posto di Mapbox prima della pubblicazione.'
			],
			whyFrameworks: 'Perché questi framework',
			whyFrameworksDescription:
				'SvelteKit e Tailwind CSS sono stati scelti soprattutto perché la loro documentazione di riferimento è chiara, coerente e facile da leggere per i large language model. In un flusso di sviluppo assistito dall\'AI questo conta più di quanto sembri: una documentazione ben strutturata si traduce direttamente in meno allucinazioni, meno suggerimenti sbagliati e meno correzioni manuali quando si fa pair programming con un coding agent. Leaflet è stato scelto per un motivo diverso — il suo footprint ridotto, la licenza permissiva e l\'integrazione nativa con le tile OpenStreetMap lo rendono la scelta naturale per uno stack per le mappe completamente aperto e senza chiavi.',
			whyLicense: 'Perché AGPL-3.0',
			whyLicenseDescription:
				'L\'AGPL è una licenza copyleft forte: chiunque può usare, modificare e ridistribuire il codice, ma le modifiche distribuite tramite rete devono essere condivise sotto gli stessi termini. È coerente con il nostro modo di pensare l\'infrastruttura — mantenere il web pubblico onestamente aperto, senza permettere a fork commerciali di richiudere silenziosamente il sorgente.',
			howToContribute: 'Come contribuire',
			howToContributeDescription:
				'I contributi sono benvenuti. Il repository include una guida CONTRIBUTING, un Code of Conduct, template per issue e pull request, e un CHANGELOG che segue Keep a Changelog. Inizia con npm install && npm run dev dentro src/, apri un\'issue o una pull request e mantieni i commit piccoli — i prefissi conventional-commit (feat, fix, docs, refactor) rendono il changelog facile da mantenere.',
			callToAction: 'Leggi il codice',
			callToActionDescription:
				'Se vuoi vedere come è costruito end-to-end un sito aziendale piccolo, statico e privacy-first, il codice è tutto lì. Forkalo, mettigli una stella, eseguilo localmente, smontalo — è esattamente il motivo per cui esiste.',
			visitRepo: 'Vai alla pagina iniziale'
		},
		websiteLaunch: {
			title: 'Ti diamo il benvenuto nel nuovo sito WebDeploy',
			imageAlt: 'Logo di WebDeploy',
			date: '31/12/2025',
			description:
				'Siamo entusiasti di annunciare il lancio del nostro primo sito web ufficiale, con la nostra caratteristica estetica retro-cyberpunk.',
			intro:
				'Dopo anni in cui abbiamo lasciato parlare i nostri progetti, WebDeploy ha finalmente una casa. Questo non è un redesign - è il nostro primo sito web, costruito da zero per riflettere esattamente chi siamo: sostenitori dell\'open source, attenti all\'esperienza degli sviluppatori e convinti che la tecnologia debba rispettare chi la usa.',
			whatsNew: 'Cosa c\'è di nuovo',
			features: [
				'Design retro-cyberpunk: un\'estetica unica che riflette la nostra etica hacker',
				'Completamente bilingue: traduzioni complete in inglese e italiano',
				'Attenzione alla privacy: nessun cookie di tracciamento, solo analisi delle visite con Matomo ospitato sui nostri server',
				'Fondamenta open source: costruito interamente con tecnologie FOSS',
				'Leggero e veloce: niente bloat, solo quello che serve'
			],
			techStack: 'Una nota sullo sviluppo web moderno',
			techDescription:
				'Saremo onesti: abbiamo sempre preferito i linguaggi vanilla. C\'è qualcosa di profondamente soddisfacente nel capire ogni riga di codice che scrivi, senza strati di astrazione che nascondono cosa sta realmente accadendo. Quando padroneggi i fondamentali - HTML, CSS e JavaScript puri - ottieni un livello di controllo e comprensione che nessun framework può replicare.',
			technologies: [
				'Detto questo, abbiamo costruito questo sito con Svelte - e se devi usare un framework, Svelte è uno dei pochi che possiamo raccomandare.',
				'Ciò che ha reso interessante questo progetto è come gli LLM hanno cambiato l\'equazione. I framework e le librerie moderne sono ampiamente documentati con esempi precisi per pattern UI specifici. Questo li rende ideali per lo sviluppo assistito dall\'AI.',
				'Gli LLM eccellono nel generare codice specifico per framework perché i dati di training sono ricchi di documentazione ben strutturata ed esempi. Il codice vanilla richiede una comprensione più profonda che deriva dallo studio e dalla pratica.',
				'Quindi, mentre il nostro cuore resta con gli approcci vanilla per chi è disposto a investire tempo per imparare veramente, riconosciamo che la combinazione di strumenti ben documentati e assistenza AI ha reso i framework più pratici che mai per lo sviluppo rapido.'
			],
			designPhilosophy: 'Filosofia del design',
			designDescription:
				'L\'estetica retro-cyberpunk è più di un semplice stile visivo - rappresenta i nostri valori. L\'interfaccia ispirata al terminale, i colori neon e gli effetti CRT rendono omaggio all\'età d\'oro dell\'informatica, quando gli sviluppatori conoscevano intimamente le loro macchine. Ogni elemento è progettato per sembrare sia nostalgico che proiettato al futuro, un promemoria che a volte i vecchi modi hanno ancora molto da insegnarci.',
			whatsNext: 'Cosa c\'è in arrivo',
			whatsNextDescription:
				'Questo lancio è solo l\'inizio. Aggiungeremo più contenuti, case study e risorse nei prossimi mesi. Segui gli aggiornamenti sui nostri progetti e servizi.',
			thanks: 'Grazie per aver visitato la nostra nuova casa digitale!'
		},
		galleriaPilotta: {
			title: 'Tavolo interattivo Galleria Pilotta',
			date: '10/11/2023',
			description:
				'Tavolo interattivo per il Complesso della Pilotta con capacità di zoom per opere d\'arte e dipinti in restauro.',
			intro:
				'La nostra soluzione di tavolo interattivo per il museo del Complesso della Pilotta offre ai visitatori un modo immersivo per esplorare la collezione d\'arte. L\'interfaccia multi-touch permette agli utenti di ingrandire i dettagli di ogni dipinto, rivelando lavori di restauro e dettagli nascosti che non sarebbero visibili a occhio nudo.',
			keyFeatures: 'Caratteristiche principali',
			features: [
				'Capacità di zoom ad alta risoluzione per esaminare le opere d\'arte in dettaglio',
				'Visualizzazione dei dipinti attualmente in restauro',
				'Interfaccia multi-touch che supporta più utenti simultanei',
				'Costruito sulla nostra piattaforma Linux inWD Kiosk'
			],
			collaboration: 'Progetto completato in collaborazione con il Complesso della Pilotta, Parma.'
		},
		rimini: {
			title: 'Visita Rimini con Rimini Xperience',
			date: '07/07/2022',
			description: 'Un\'app turistica per Rimini, disponibile su Google Play.',
			intro:
				'Rimini Xperience è un\'applicazione turistica mobile progettata per aiutare i visitatori a scoprire la bellissima città di Rimini. L\'app fornisce guide interattive, punti di interesse e raccomandazioni locali per migliorare l\'esperienza turistica.',
			appFeatures: 'Funzionalità dell\'app',
			features: [
				'Mappe interattive della città con punti di interesse',
				'Guide audio per le principali attrazioni',
				'Raccomandazioni di ristoranti e alloggi locali',
				'Modalità offline per l\'uso senza connessione internet'
			],
			downloadTitle: 'Scarica l\'app',
			downloadDescription: 'Rimini Xperience è disponibile su Google Play Store.',
			downloadButton: 'Scaricala su Google Play',
			collaboration: 'App sviluppata in collaborazione con l\'ente turistico di Rimini.'
		},
		impeccable: {
			title: 'Standard web che abbiamo applicato a questo sito',
			date: '28/01/2026',
			description:
				'Un approfondimento sugli standard web, le funzionalità CSS e le best practice di sviluppo che abbiamo applicato per migliorare il nostro sito - dall\'accessibilità all\'ottimizzazione delle performance.',
			intro:
				'Quando abbiamo lanciato il sito WebDeploy, funzionava ma mancava di rifinitura. Usando Impeccable.style come guida, abbiamo affrontato sistematicamente accessibilità, performance, design responsive e animazioni. Ecco cosa abbiamo applicato.',
			whatIsImpeccable: 'Un approccio sistematico',
			whatIsImpeccableDescription:
				'Impeccable.style organizza le best practice dello sviluppo web in aree specifiche: audit di accessibilità, hardening dell\'interfaccia, design del movimento, adattamento cross-device, ottimizzazione delle performance, normalizzazione del design system e rifinitura finale. Ogni area ci ha insegnato standard e tecniche che ora applichiamo a ogni progetto.',
			commandsUsed: 'Cosa abbiamo implementato',
			commands: [
				{
					name: 'Standard di accessibilità',
					description: 'Conformità WCAG e design inclusivo',
					details: 'Abbiamo implementato link per saltare al contenuto principale, dedicati a chi naviga con la tastiera, attributi ARIA appropriati (aria-expanded, aria-haspopup, role="menu"), indicatori :focus-visible visibili, e testo per screen reader sui link esterni. La media query prefers-reduced-motion disabilita le animazioni per chi ne ha bisogno.'
				},
				{
					name: 'Resilienza dell\'interfaccia',
					description: 'Gestire i casi limite con eleganza',
					details: 'Abbiamo aggiunto utility CSS per overflow del testo (line-clamp, truncate), stati di caricamento ed errore per componenti asincroni, e un sistema di logging solo per sviluppo che mantiene pulite le console in produzione preservando la debuggabilità durante lo sviluppo.'
				},
				{
					name: 'Design del movimento CSS',
					description: 'Animazioni intenzionali con standard web',
					details: 'Abbiamo usato proprietà CSS personalizzate per curve di easing (ease-out-quart, ease-out-expo), l\'API IntersectionObserver per mostrare gli elementi durante lo scorrimento, trasformazioni CSS per animazioni performanti, e la proprietà will-change per suggerire l\'accelerazione GPU.'
				},
				{
					name: 'CSS responsive e adattivo',
					description: 'Tecniche moderne di layout',
					details: 'Abbiamo implementato env(safe-area-inset-*) per dispositivi con notch, fogli di stile @media print, meta tag viewport-fit=cover, target touch minimi di 44px secondo le linee guida WCAG, e CSS aspect-ratio per contenitori immagine stabili.'
				},
				{
					name: 'Core Web Vitals',
					description: 'Metriche di performance che contano',
					details: 'Abbiamo ottimizzato il Largest Contentful Paint con precaricamento font e fetchpriority="high", prevenuto il Cumulative Layout Shift con dimensioni esplicite delle immagini, usato loading="lazy" e decoding="async" per immagini sotto il fold, e applicato CSS containment per ottimizzare il rendering.'
				},
				{
					name: 'Proprietà CSS personalizzate',
					description: 'Costruire un design system manutenibile',
					details: 'Abbiamo creato oltre 50 proprietà CSS personalizzate (design token) per colori, ombre, tipografia e spaziatura. Questo ha eliminato i valori hardcoded, abilitato il theming e reso il codice più facile da mantenere. L\'integrazione con @theme di Tailwind CSS v4 ha reso tutto fluido.'
				},
				{
					name: 'Font privacy-first',
					description: 'Self-hosting per maggiore controllo',
					details: 'Siamo passati dal CDN Google Fonts a dichiarazioni @font-face self-hosted con subsetting unicode-range appropriato. Questo elimina le richieste a terze parti, migliora la privacy e ci dà pieno controllo sul comportamento di caricamento dei font.'
				}
			],
			results: 'Standard applicati',
			resultsIntro: 'Attraverso questo processo, abbiamo applicato standard web e best practice a ogni livello del sito:',
			resultsList: [
				'WCAG 2.1 AA: skip link, ruoli ARIA, navigazione da tastiera, indicatori di focus, supporto reduced motion',
				'Core Web Vitals: precaricamento font, lazy loading, dimensioni esplicite, CSS containment, hint GPU',
				'Funzionalità CSS: proprietà personalizzate, aspect-ratio, env() safe areas, @media print, line-clamp',
				'API moderne: IntersectionObserver, Clipboard API, Web Share API, matchMedia per preferenze di movimento',
				'Privacy: font self-hosted, nessuna richiesta CDN di terze parti, analytics senza cookie'
			],
			philosophy: 'Il valore degli standard',
			philosophyDescription:
				'Gli standard web esistono perché risolvono problemi reali. Gli standard di accessibilità assicurano che tutti possano usare il web. Gli standard di performance migliorano l\'esperienza utente e la SEO. Gli standard CSS forniscono soluzioni manutenibili e portabili. Imparare questi standard - invece di affidarsi alla magia dei framework - ti dà conoscenze trasferibili che funzionano con qualsiasi stack tecnologico.',
			callToAction: 'Risorse',
			callToActionDescription:
				'Impeccable.style fornisce un approccio strutturato per imparare e applicare questi standard web. La documentazione spiega non solo cosa fare, ma perché ogni pratica è importante.',
			learnMore: 'Documentazione',
			visitImpeccable: 'Visita Impeccable.style'
		},
		fosdem2026: {
			title: 'FOSDEM 2026: regolamentazione e infrastruttura',
			imageAlt: "FOSDEM 2026 all'ULB di Bruxelles",
			date: '04/02/2026',
			description:
				'La nostra esperienza al FOSDEM 2026 a Bruxelles - dalle devroom su CRA e SBOM alla scoperta di progetti open source innovativi come metal-stack.io.',
			descriptionBeforeLink:
				'La nostra esperienza al FOSDEM 2026 a Bruxelles - dalle devroom su CRA e SBOM alla scoperta di progetti open source innovativi come ',
			descriptionAfterLink: '.',
			intro:
				'Lo scorso weekend abbiamo partecipato al FOSDEM 2026 a Bruxelles, la più grande conferenza europea dedicata al software libero e open source. Ospitata all\'Université libre de Bruxelles (ULB), l\'edizione di quest\'anno ha riunito migliaia di sviluppatori, maintainer e appassionati di open source per due giorni di interventi, workshop e incontri della comunità.',
			whatIsFosdem: 'Cos\'è il FOSDEM?',
			whatIsFosdemDescription:
				'FOSDEM (Free and Open Source Software Developers\' European Meeting) è un evento annuale organizzato dalla comunità, per la comunità. Senza necessità di registrazione e completamente gratuito, incarna lo spirito dell\'open source. La conferenza presenta centinaia di talk su molteplici track, dallo sviluppo del kernel alle tecnologie web, dalla sicurezza alla documentazione.',
			craRoom: 'La devroom CRA',
			craRoomDescription:
				'Una delle devroom di quest\'anno era dedicata al Cyber Resilience Act (CRA). Il regolamento europeo sta ridefinendo come il software open source verrà sviluppato, distribuito e mantenuto. I talk hanno coperto le implicazioni pratiche per i maintainer, i requisiti di conformità e come la comunità open source si sta organizzando per affrontare queste nuove sfide preservando la natura collaborativa dello sviluppo FOSS.',
			sbomRoom: 'SBOM e sicurezza della supply chain',
			sbomRoomDescription:
				'Il track dedicato ai Software Bill of Materials (SBOM) ha affrontato una delle preoccupazioni più pressanti nello sviluppo software moderno: la sicurezza della supply chain. Le sessioni hanno esplorato strumenti per generare e utilizzare SBOM, l\'integrazione con le pipeline CI/CD e come le organizzazioni possono sfruttare gli SBOM per la gestione delle vulnerabilità.',
			community: 'La comunità open source',
			communityDescription:
				'Ciò che rende il FOSDEM speciale non è solo il contenuto tecnico, ma la comunità stessa. Conversazioni nei corridoi, incontri spontanei e la comprensione condivisa che l\'open source è più del codice - è un movimento collaborativo. Incontrare maintainer di progetti che usiamo quotidianamente, discutere sfide con colleghi che affrontano problemi simili e scoprire nuove soluzioni a vecchi problemi - questo è ciò che ci fa tornare anno dopo anno.',
			visitFosdem: 'Visita il FOSDEM'
		}
	},

	// Footer
	footer: {
		tagline: 'developing greatness',
		description: 'Infrastruttura open source e soluzioni orientate agli sviluppatori.',
		product: 'Prodotto',
		resources: 'Risorse',
		company: 'Azienda',
		careers: 'Lavora con noi',
		copyright: 'Copyright © 2026 WebDeploy S.R.L.',
		registeredOffice: 'Sede legale',
		privacy: 'Informativa sulla privacy'
	},

	// Privacy Policy
	privacy: {
		title: 'Informativa sulla privacy',
		intro: 'WebDeploy S.R.L. si impegna a proteggere la tua privacy. Questa pagina spiega come gestiamo i tuoi dati quando visiti il nostro sito web.',
		analyticsTitle: 'Analisi delle visite',
		analyticsText: 'Utilizziamo Matomo, una piattaforma di analytics self-hosted e orientata alla privacy. La nostra configurazione è progettata per rispettare la tua privacy:',
		analyticsFeatures: [
			'Nessun cookie viene impostato sul tuo dispositivo',
			'Gli indirizzi IP sono anonimizzati',
			'L\'impostazione Do Not Track del browser è rispettata',
			'I dati sono memorizzati sui server di Hetzner Online GmbH a Falkenstein, in Sassonia (Germania)'
		],
		optOutTitle: 'Disattiva l\'analisi delle visite',
		optOutText: 'Anche se utilizziamo un tracciamento rispettoso della privacy, puoi disattivare completamente l\'analisi delle visite:',
		dataTitle: 'Dati raccolti',
		dataText: 'Raccogliamo solo dati anonimi e aggregati per capire come viene utilizzato il nostro sito:',
		dataItems: [
			'Pagine visitate e tempo trascorso',
			'Sito web di provenienza',
			'Tipo di browser e dimensione dello schermo',
			'Paese (derivato dall\'IP anonimizzato)'
		],
		contactTitle: 'Contatti',
		contactText: 'Per qualsiasi domanda relativa alla privacy, contattaci a:',
		marketingTitle: 'Marketing e pubblicità',
		marketingText:
			'Con il tuo consenso esplicito usiamo il pixel di Meta (Facebook/Instagram) per misurare l\'efficacia delle campagne pubblicitarie e per il retargeting. Il pixel imposta cookie e viene caricato solo dopo il consenso, che puoi negare o revocare in qualsiasi momento cancellando i cookie del sito. Senza consenso, nessuno script pubblicitario viene caricato.',
		dpaTitle: 'Accordo sul trattamento dei dati (DPA)',
		dpaText:
			'Quando WebDeploy S.R.L. tratta dati personali per tuo conto in qualità di responsabile del trattamento, lo fa sulla base di un accordo sul trattamento dei dati (DPA) conforme all\'art. 28 GDPR: finalità e durata del trattamento definite, misure di sicurezza tecniche e organizzative, elenco dei sub-responsabili, assistenza per le richieste degli interessati, e cancellazione o restituzione dei dati al termine del servizio. Richiedi il testo del DPA scrivendo a info@webdeploy.it.',
		optOut: {
			OptOutComplete: 'Opt-out completato. Le tue visite a questo sito non verranno registrate dallo strumento di Web Analytics.',
			OptOutCompleteBis: 'Se elimini i cookie, incluso quello di opt-out, o cambi computer o browser, dovrai ripetere la procedura.',
			YouMayOptOut2: 'Puoi scegliere di impedire a questo sito web di aggregare e analizzare le azioni che intraprendi qui.',
			YouMayOptOut3: 'Ciò proteggerà la tua privacy, ma impedirà al proprietario di imparare dalle tue azioni e di creare un\'esperienza migliore per te e per gli altri utenti.',
			OptOutErrorNoCookies: 'Per disattivare il monitoraggio, i cookie devono essere abilitati.',
			OptOutErrorNotHttps: 'La funzione di esclusione dal monitoraggio (opt-out) potrebbe non funzionare perché questo sito non è stato caricato tramite HTTPS. Ricarica la pagina per verificare se il tuo stato di rinuncia è cambiato.',
			YouAreNotOptedOut: 'Al momento non hai disattivato il monitoraggio.',
			UncheckToOptOut: 'Deseleziona la casella per disattivare il monitoraggio.',
			YouAreOptedOut: 'Al momento hai disattivato il monitoraggio.',
			CheckToOptIn: 'Seleziona la casella per consentire il monitoraggio.'
		}
	},

	// Common
	common: {
		email: 'Email',
		phone: 'Telefono',
		learnMore: 'Scopri di più',
		contactUs: 'Contattaci',
		requestDemo: 'Richiedi una demo',
		skipToContent: 'Vai al contenuto principale',
		opensInNewTab: '(si apre in una nuova scheda)',
		emailUs: 'Scrivi a info@webdeploy.it'
	},

	// Error page
	error: {
		pageTitle: 'Errore',
		codeLabel: 'CODICE_ERRORE',
		statusLine: 'STATO: RIPRISTINO_DISPONIBILE',
		notFoundTitle: 'Pagina non trovata',
		serverErrorTitle: 'Errore interno del server',
		forbiddenTitle: 'Accesso negato',
		genericTitle: 'Si è verificato un errore',
		notFoundText: 'La pagina che cerchi non esiste o è stata spostata.',
		serverErrorText: 'I nostri server hanno riscontrato un errore imprevisto. Riprova più tardi.',
		forbiddenText: 'Non hai i permessi per accedere a questa risorsa.',
		genericText: 'Si è verificato un errore imprevisto. Riprova.',
		returnHome: 'Torna alla pagina iniziale',
		goBack: 'Torna indietro',
		needHelp: 'Ti serve aiuto? Scrivici a'
	},

	// Cookie / marketing consent
	consent: {
		title: 'Privacy e cookie',
		body: 'Usiamo Matomo (analytics senza cookie, sempre attivo) e, solo con il tuo consenso, il pixel Meta per misurare le campagne pubblicitarie. Dettagli nell\'<a href="/privacy" class="text-primary hover:underline">informativa sulla privacy</a>.',
		accept: 'Accetta i cookie di marketing',
		reject: 'Rifiuta i cookie di marketing'
	}
};
