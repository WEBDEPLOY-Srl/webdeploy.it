export const it = {
	// Navigation
	nav: {
		home: 'Home',
		products: 'Prodotti',
		kiosk: 'Totem interattivo inWD',
		news: 'Notizie',
		services: 'Servizi',
		encryptedStorage: 'Archiviazione Dati Cifrata',
		linuxMigration: 'Migrazione Assistita a Linux',
		managedInfra: 'Infrastruttura Automatizzata',
		manifesto: 'Manifesto dello Sviluppatore',
		contacts: 'Contatti'
	},

	// Home page
	home: {
		heroName: 'webdeploy',
		heroText: 'developing greatness',
		heroTagline: 'A look into the Future<void>',
		manifestoBtn: 'Manifesto dello Sviluppatore',
		servicesBtn: 'I Nostri Servizi',
		systemOnline: 'Sistema Attivo',
		systemCapabilities: 'Funzionalità',
		capabilities: 'del Sistema',
		capabilitiesLine1: 'Infrastruttura open source',
		capabilitiesLine2: 'Approccio developer-first',
		ctaTitle: 'Pronto a migliorare il tuo workflow?',
		ctaDescription: 'Infrastruttura open source per sviluppatori moderni',
		ctaContact: 'Contattaci',
		ctaServices: 'I_Nostri_Servizi',
		features: {
			linux: {
				title: 'Transizione Assistita a Workstation Linux',
				details:
					"Devi fidarti dei tuoi dispositivi, smettere di sperare che Windows Update non perda il tuo lavoro, e iniziare a fare affidamento su sistemi open-source stabili, sia che si tratti di un'azienda privata o, a maggior ragione di un'istituzione pubblica!"
			},
			privacy: {
				title: 'Archiviazione Dati Cifrata',
				details:
					"Mantieni i tuoi dati privati! Scegli un'archiviazione file crittografata end-to-end che ci impedisce di guardare, utilizzare o vendere i tuoi dati personali a terze parti, a differenza di molti altri fornitori di servizi."
			},
			inwd: {
				title: "Scegli inwd per un'infrastruttura gestita",
				details:
					"Ospita la logica specifica della tua azienda all'interno di un'infrastruttura fidata, che non ti inganna."
			}
		}
	},

	// Services page
	services: {
		title: 'Servizi',
		inwd: {
			title: 'inwd - Infrastruttura Gestita',
			subtitle: "Infrastructure as Code (IaC) per l'era moderna",
			description:
				'Trasforma la gestione della tua infrastruttura con la nostra piattaforma inwd - una soluzione completa di infrastruttura gestita che tratta i tuoi server, reti e deployment come codice. Costruita per sviluppatori che capiscono che l\'infrastruttura deve essere prevedibile, versionata e facilmente scalabile.',
			whatMakesDifferent: 'Cosa Rende inwd Diverso',
			features: [
				'Infrastruttura Versionata - Ogni modifica tracciata, ogni deployment riproducibile',
				'Esperienza Developer-First - Workflow Git familiari per la gestione dell\'infrastruttura',
				'Zero Vendor Lock-in - Strumenti open source, processi trasparenti',
				'Trasparenza dei Costi - Nessun costo nascosto, nessuna sorpresa',
				'Monitoraggio 24/7 - Alert proattivi e rimedio automatizzato'
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
				title: 'Sicurezza by Design',
				items: [
					'Gestione dei segreti crittografata',
					'Patch di sicurezza automatizzate',
					'Monitoraggio della conformità e reporting',
					'Architettura di rete zero-trust'
				]
			},
			observability: {
				title: 'Osservabilità & Monitoraggio',
				items: [
					'Metriche in tempo reale e dashboard',
					'Regole di alerting personalizzate',
					'Insights per ottimizzazione delle prestazioni',
					'Automazione della pianificazione della capacità'
				]
			},
			multiCloud: {
				title: 'Supporto Multi-Cloud & Ibrido',
				items: [
					'AWS, Azure, Google Cloud e on-premises',
					'Orchestrazione Kubernetes',
					'Gestione del container registry',
					'Opzioni Database as a Service'
				]
			}
		},
		linux: {
			title: 'Migrazione e Gestione di Workstation Linux',
			subtitle: 'Liberati dalla dipendenza da Windows con servizi di migrazione professionali',
			description:
				'Aiuta la tua organizzazione nella transizione da workstation Windows a Linux con i nostri servizi completi di migrazione e gestione continua. Gestiamo tutto, dalla valutazione iniziale al supporto a lungo termine, assicurando che il tuo team rimanga produttivo durante tutta la transizione.',
			assessment: {
				title: 'Valutazione & Pianificazione',
				items: [
					'Inventario software attuale e analisi di compatibilità',
					'Documentazione e ottimizzazione del workflow utente',
					'Timeline di migrazione personalizzata con minima interruzione',
					'Sviluppo del piano di formazione per il tuo team'
				]
			},
			transition: {
				title: 'Processo di Transizione Fluido',
				items: [
					'Migrazione dati con garanzia zero perdita di dati',
					'Sostituzione e configurazione delle applicazioni',
					'Preservazione del profilo utente e delle impostazioni',
					'Rollout graduale per minimizzare l\'impatto sul business'
				]
			},
			training: {
				title: 'Formazione & Supporto',
				items: [
					'Programmi di formazione personalizzati per diversi tipi di utenti',
					'Documentazione e guide di riferimento rapido',
					'Periodo di supporto intensivo di 30 giorni post-migrazione',
					'Assistenza tecnica continua e troubleshooting'
				]
			}
		},
		kiosk: {
			title: 'Soluzioni Kiosk Personalizzate',
			subtitle: 'Alternative Linux ai sistemi kiosk Windows',
			description:
				'Progetta e implementa soluzioni kiosk interattive usando tecnologia open source. Perfetto per retail, sanità, istruzione e spazi pubblici dove affidabilità e personalizzazione contano più del vendor lock-in.',
			learnMore: 'Scopri di più sulle nostre soluzioni kiosk'
		},
		consulting: {
			title: 'Consulenza Open Source',
			subtitle: 'Guida esperta per adottare e contribuire a tecnologie open source',
			items: [
				'Valutazione Tecnologica - Valuta alternative open source a soluzioni proprietarie',
				'Sviluppo Personalizzato - Costruisci soluzioni usando framework e strumenti open source',
				'Coinvolgimento della Comunità - Aiuta la tua organizzazione a contribuire ai progetti open source',
				'Conformità delle Licenze - Assicura una corretta gestione delle licenze open source'
			]
		},
		cta: {
			title: 'Pronto per Iniziare?',
			description:
				'Ogni progetto inizia con la comprensione delle tue esigenze uniche. Discutiamo di come il nostro approccio orientato agli sviluppatori può risolvere le tue sfide infrastrutturali e tecnologiche.',
			contactUs: 'Contattaci:',
			careers: 'Lavora con noi:'
		}
	},

	// Totem/Kiosk page
	totem: {
		heroName: 'Totem interattivo inWD',
		heroTagline: 'Un totem interattivo sicuro, personalizzabile e intelligente per il tuo business.',
		requestDemo: 'Richiedi una demo!',
		learnMore: 'Scopri di più',
		features: {
			openSource: {
				title: 'Mostra ciò che vuoi',
				details: 'Il totem viene ottimizzato per mostrare esclusivamente il software desiderato.'
			},
			windowsFree: {
				title: 'Aumenta il coinvolgimento',
				details: 'Perfetto per digital signage e promozioni interattive.'
			},
			developer: {
				title: 'Adattabile a diversi settori',
				details: 'Retail, turismo, sanità, pubblica amministrazione, eventi ed altro.'
			}
		},
		whyLinux: {
			title: 'Perché scegliere il Totem inWD?',
			freedom: {
				title: 'Completamente personalizzabile',
				items: [
					'Adattabile alle tue esigenze, dal branding al design fisico',
					'Pronto per il white-label',
					'Personalizzabile con il tuo logo, colori e identità visiva'
				]
			},
			security: {
				title: 'Ambiente sicuro e controllato',
				items: [
					'Basato su sistema Linux',
					"Solo il software essenziale per un'esperienza utente sicura",
					'Sistema Linux avanzato per garantire stabilità'
				]
			},
			performance: {
				title: 'Versatile per molteplici applicazioni',
				items: [
					'Ideale per punti informativi, pubblicità, ticketing',
					'Check-in ed interazioni con gli utenti',
					'IoT-ready con gestione remota'
				]
			}
		},
		sonmi: {
			title: 'Caratteristiche principali',
			description: 'Sicurezza, personalizzazione e connettività avanzata.',
			features: [
				'Sicurezza Linux avanzata - stabilità e prevenzione accessi non autorizzati',
				'Design white-label - adattabile alla tua identità aziendale',
				'Hardware personalizzabile - dalla struttura del totem ai dispositivi connessi',
				'Connettività avanzata - Wi-Fi, Bluetooth, NFC, QR Code, RFID'
			]
		},
		iac: {
			title: 'Display premium e struttura resistente',
			description: 'Qualità e durabilità per ogni ambiente.',
			features: [
				'Schermo HD/4K touchscreen con tecnologia multi-touch',
				'Materiali durevoli, adatti per uso interno',
				'Monitoraggio delle interazioni degli utenti',
				'Perfetto per segnaletica digitale interattiva'
			]
		},
		applications: {
			title: 'Dove puoi utilizzare inWD Kiosk?',
			description: 'Ideale per:',
			items: [
				'Retail e centri commerciali - Segnaletica digitale, promozioni e postazioni self-service',
				'Turismo e trasporti - Guide interattive, biglietteria e check-in',
				'Ospedali e sanità - Check-in pazienti e chioschi informativi',
				'Pubblica amministrazione ed eventi - Punti informativi self-service'
			]
		},
		cta: {
			title: 'Contattaci!',
			description: 'Rivoluziona la tua comunicazione digitale con il Totem inWD!',
			button: 'Richiedi una demo',
			email: 'Email',
			partnership: 'Partnership',
			poweredBy: 'Sviluppato da'
		}
	},

	// Developer Manifesto
	manifesto: {
		title: 'Manifesto dello Sviluppatore',
		coreBeliefs: 'I Nostri Valori Fondamentali',
		devExp: {
			title: 'Esperienza Developer First',
			description:
				'Crediamo che sviluppatori felici creino software eccezionale. Quando gli sviluppatori hanno gli strumenti giusti, documentazione chiara e workflow senza attriti, producono il loro miglior lavoro. Tutto ciò che costruiamo inizia con la domanda: "Come possiamo migliorare la vita dello sviluppatore?"'
		},
		openSource: {
			title: "L'Open Source è la Nostra Presa di Posizione",
			description:
				"Il software open source promuove innovazione, trasparenza e collaborazione. Scegliamo l'open source perché rappresenta libertà, comunità e l'avanzamento collettivo della tecnologia. Il nostro impegno verso il FOSS guida ogni decisione tecnica che prendiamo."
		},
		workLife: {
			title: 'Work-Life Balance, Ridefinito',
			description:
				'Rifiutiamo il mito che un grande software richieda di sacrificare la vita personale. La vera produttività viene da pratiche sostenibili, non dal burnout.',
			items: [
				'Lavora dove ti senti produttivo - ufficio, casa, caffetteria o una spiaggia a Bali',
				'Lavora quando sei al meglio - mattiniero o nottambulo, ci adattiamo al tuo ritmo',
				'Ma gestisciti, coder! - la libertà viene con responsabilità e autodisciplina'
			],
			note: 'Questa non è flessibilità ingenua - è fiducia matura in professionisti che capiscono che consegnare lavoro di qualità conta più che timbrare il cartellino.'
		},
		techPhilosophy: 'La Nostra Filosofia Tecnica',
		quality: {
			title: 'Qualità Prima della Velocità',
			description:
				'Costruiamo del software che dura. I lavori frettolosi creano debito tecnico, utenti frustrati e sviluppatori stressati. Investiamo tempo in anticipo per risparmiare innumerevoli ore dopo.'
		},
		docs: {
			title: 'Documentazione come Codice',
			description:
				'Se non è documentato, non esiste. Una documentazione chiara e completa non è un ripensamento - è parte integrante di ogni funzionalità che rilasciamo.'
		},
		tools: {
			title: 'Strumenti che Potenziano',
			description:
				"Investiamo in strumenti per sviluppatori, automazione e infrastruttura che elimina compiti ripetitivi e permette agli sviluppatori di concentrarsi sulla risoluzione di problemi reali."
		},
		community: {
			title: 'Comunità Prima della Competizione',
			description:
				"Contribuiamo all'ecosistema open source che rende possibile il nostro lavoro. La conoscenza condivisa è conoscenza moltiplicata."
		},
		howWeWork: 'Come Lavoriamo',
		purpose: {
			title: 'Sviluppo Orientato allo Scopo',
			description:
				'Ogni riga di codice ha uno scopo. Costruiamo funzionalità di cui gli utenti hanno realmente bisogno, non metriche che fanno bella figura nelle riunioni.'
		},
		iterative: {
			title: 'Eccellenza Iterativa',
			description:
				'Grazie al CI/CD rilasciamo e raccogliamo frequentemente feedback e miglioriamo ad ogni iterazione.'
		},
		learning: {
			title: 'Apprendimento Continuo',
			description:
				"La tecnologia evolve rapidamente. Dedichiamo tempo all'apprendimento, alla sperimentazione e al rimanere aggiornati con le best practice del settore."
		},
		growth: {
			title: 'Crescita Sostenibile',
			description:
				'Cresciamo a un ritmo che mantiene i nostri valori. Scalare velocemente a spese della cultura o della qualità del codice non è successo - è una scorciatoia verso il fallimento.'
		},
		cta: 'Pronto a lavorare con sviluppatori che danno priorità alla tua esperienza?',
		getInTouch: 'Contattaci'
	},

	// Contacts
	contacts: {
		title: 'Contatti',
		business: {
			title: 'Richieste Business',
			description:
				'Pronto a discutere le tue esigenze di infrastruttura open source? Siamo qui per aiutarti a sfuggire al vendor lock-in e abbracciare soluzioni developer-friendly.',
			location: 'Sede'
		},
		careers: {
			title: 'Unisciti al Nostro Team',
			description:
				'Lavora con noi, non per noi. Cerchiamo sviluppatori che condividono la nostra passione per l\'open source, l\'esperienza developer e le pratiche di lavoro sostenibili.',
			perks: 'Remote-friendly • Orari flessibili • Focus open source • Work-life balance'
		}
	},

	// Early Access (funnel NIS2/CRA)
	earlyAccess: {
		title: 'Early access NIS2/CRA',
		subtitle: 'Hosting conforme a NIS2 e CRA by design. Compliance gestita. Senza drama.',
		benefitsTitle: 'Cosa ottieni',
		benefits: [
			'Gap-analysis NIS2/CRA per PMI e MSP: 12 pagine, 15 minuti, zero buzzword',
			'Dove sei oggi rispetto a NIS2 e CRA e cosa ti manca davvero',
			'Un piano concreto per i prossimi 90 giorni',
			'Posto in lista per l\'early access riservato a 10 PMI italiane'
		],
		form: {
			email: 'Email aziendale',
			name: 'Nome e cognome',
			company: 'Azienda',
			rolePlaceholder: 'Il tuo ruolo',
			roleA: 'CTO / IT manager',
			roleB: 'C-level / Titolare',
			roleC: 'Compliance officer / DPO',
			submit: 'Iscriviti all\'early access',
			sending: 'Invio in corso...',
			successTitle: 'Ci siamo quasi',
			success:
				'Ti abbiamo inviato un\'email: conferma l\'iscrizione e ricevi subito la gap-analysis NIS2/CRA.',
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
			subtitle: 'Sei dentro. La tua gap-analysis NIS2/CRA sta arrivando nella tua casella email.',
			nextTitle: 'Cosa succede ora',
			next: [
				'Controlla l\'email: trovi il link per scaricare la gap-analysis NIS2/CRA',
				'Una sola email a settimana, sempre concreta, niente spam',
				'Tra poche settimane apriamo l\'early access a 10 PMI italiane — sei già in lista'
			],
			cta: 'Scopri l\'infrastruttura gestita',
			tagline: 'Compliance gestita. Senza drama.'
		}
	},

	// News
	news: {
		title: 'Notizie',
		pageDescription: 'Ultime notizie e aggiornamenti da WebDeploy',
		readMore: 'Leggi di più',
		backToNews: 'Notizie',
		interestedSimilar: 'Interessato a una soluzione simile per la tua istituzione?',
		interestedTourism: 'Interessato a un\'app turistica per la tua città?',
		contactUs: 'Contattaci',
		share: 'Condividi',
		shareOnLinkedIn: 'Condividi su LinkedIn',
		shareOnInstagram: 'Condividi su Instagram',
		linkCopied: 'Link copiato. Puoi incollarlo nella tua Storia Instagram.',
		copyFailed: 'Impossibile copiare il link. Copialo dalla barra degli indirizzi.',
		popupBlocked: 'Popup bloccato. Apertura in una nuova scheda.',
		openSourceRelease: {
			title: 'WebDeploy.it è ora Open Source',
			date: '17/04/2026',
			description:
				'Il codice sorgente di webdeploy.it è ora pubblico sotto licenza AGPL-3.0. Costruito con SvelteKit, Tailwind CSS e Leaflet — scelte tecniche guidate da documentazione facile da leggere per gli LLM.',
			intro:
				'Il sito che stai leggendo in questo momento è open source. Abbiamo appena pubblicato il codice sorgente completo di webdeploy.it sul nostro repository pubblico, sotto la GNU Affero General Public License v3.0. Niente marketing — un\'applicazione statica SvelteKit, alcuni componenti Svelte, un po\' di Tailwind CSS e una mappa Leaflet con tile OpenStreetMap. Puoi clonarlo, forkarlo, self-hostarlo o semplicemente leggerne il codice.',
			whatHappened: 'Cosa Abbiamo Pubblicato',
			whatHappenedDescription:
				'Tutto ciò che compone il sito in produzione è ora nel repository: l\'app SvelteKit in src/, le traduzioni in inglese e italiano, la libreria di componenti, i design token del tema retro-cyberpunk, il Dockerfile e la configurazione della pipeline CI. Nessun sottomodulo privato, nessuna dipendenza chiusa — ciò che cloni è esattamente ciò che gira su webdeploy.it.',
			stackTitle: 'Lo Stack',
			stackIntro: 'Il sito è volutamente piccolo. Tre strumenti fanno quasi tutto il lavoro:',
			stack: [
				'SvelteKit con l\'adapter statico — prerenderizzato in HTML puro e servito come file statici.',
				'Tailwind CSS v4 — costruito attorno ai design token @theme e a uno stile retrò a raggio zero con ombre nette.',
				'Leaflet con tile OpenStreetMap — uno stack mappe senza chiavi e senza vendor proprietari, introdotto al posto di Mapbox prima della pubblicazione.'
			],
			whyFrameworks: 'Perché Questi Framework',
			whyFrameworksDescription:
				'SvelteKit e Tailwind CSS sono stati scelti soprattutto perché la loro documentazione di riferimento è chiara, coerente e facile da leggere per i large language model. In un flusso di sviluppo assistito dall\'AI questo conta più di quanto sembri: una documentazione ben strutturata si traduce direttamente in meno allucinazioni, meno suggerimenti sbagliati e meno correzioni manuali quando si fa pair programming con un coding agent. Leaflet è stato scelto per un motivo diverso — il suo footprint ridotto, la licenza permissiva e l\'integrazione nativa con le tile OpenStreetMap lo rendono la scelta naturale per uno stack mappe completamente aperto e senza chiavi.',
			whyLicense: 'Perché AGPL-3.0',
			whyLicenseDescription:
				'L\'AGPL è una licenza copyleft forte: chiunque può usare, modificare e ridistribuire il codice, ma le modifiche distribuite tramite rete devono essere condivise sotto gli stessi termini. È coerente con il nostro modo di pensare l\'infrastruttura — mantenere il web pubblico onestamente aperto, senza permettere a fork commerciali di richiudere silenziosamente il sorgente.',
			howToContribute: 'Come Contribuire',
			howToContributeDescription:
				'I contributi sono benvenuti. Il repository include una guida CONTRIBUTING, un Code of Conduct, template per issue e pull request, e un CHANGELOG che segue Keep a Changelog. Inizia con npm install && npm run dev dentro src/, apri un\'issue o una pull request e mantieni i commit piccoli — i prefissi conventional-commit (feat, fix, docs, refactor) rendono il changelog facile da mantenere.',
			callToAction: 'Leggi il Codice',
			callToActionDescription:
				'Se vuoi vedere come è costruito end-to-end un sito aziendale piccolo, statico e privacy-first, il codice è tutto lì. Forkalo, mettigli una stella, eseguilo localmente, smontalo — è esattamente il motivo per cui esiste.',
			visitRepo: 'Apri webdeploy.it'
		},
		websiteLaunch: {
			title: 'Benvenuti nel Nuovo Sito WebDeploy',
			date: '31/12/2025',
			description:
				'Siamo entusiasti di annunciare il lancio del nostro primo sito web ufficiale, con la nostra caratteristica estetica retro-cyberpunk.',
			intro:
				'Dopo anni in cui abbiamo lasciato parlare i nostri progetti, WebDeploy ha finalmente una casa. Questo non è un redesign - è il nostro primo sito web, costruito da zero per riflettere esattamente chi siamo: sostenitori dell\'open source, developer-first ed orientati ad una tecnologia che rispetta i suoi utenti.',
			whatsNew: 'Cosa c\'è di Nuovo',
			features: [
				'Design retro-cyberpunk: Un\'estetica unica che riflette la nostra etica hacker',
				'Completamente bilingue: Traduzioni complete in inglese e italiano',
				'Privacy-focused: Nessun cookie di tracciamento, solo analitiche con Matomo self-hosted',
				'Fondamenta open source: Costruito interamente con tecnologie FOSS',
				'Leggero e veloce: Niente bloat, solo quello che serve'
			],
			techStack: 'Una Nota sullo Sviluppo Web Moderno',
			techDescription:
				'Saremo onesti: abbiamo sempre preferito i linguaggi vanilla. C\'è qualcosa di profondamente soddisfacente nel capire ogni riga di codice che scrivi, senza strati di astrazione che nascondono cosa sta realmente accadendo. Quando padroneggi i fondamentali - HTML, CSS e JavaScript puri - ottieni un livello di controllo e comprensione che nessun framework può replicare.',
			technologies: [
				'Detto questo, abbiamo costruito questo sito con Svelte - e se devi usare un framework, Svelte è uno dei pochi che possiamo raccomandare.',
				'Ciò che ha reso interessante questo progetto è come gli LLM hanno cambiato l\'equazione. I framework e le librerie moderne sono ampiamente documentati con esempi precisi per pattern UI specifici. Questo li rende ideali per lo sviluppo assistito dall\'AI.',
				'Gli LLM eccellono nel generare codice specifico per framework perché i dati di training sono ricchi di documentazione ben strutturata e esempi. Il codice vanilla richiede una comprensione più profonda che deriva dallo studio e dalla pratica.',
				'Quindi, mentre il nostro cuore resta con gli approcci vanilla per chi è disposto a investire tempo per imparare veramente, riconosciamo che la combinazione di strumenti ben documentati e assistenza AI ha reso i framework più pratici che mai per lo sviluppo rapido.'
			],
			designPhilosophy: 'Filosofia del Design',
			designDescription:
				'L\'estetica retro-cyberpunk è più di un semplice stile visivo - rappresenta i nostri valori. L\'interfaccia ispirata al terminale, i colori neon e gli effetti CRT rendono omaggio all\'età d\'oro dell\'informatica, quando gli sviluppatori conoscevano intimamente le loro macchine. Ogni elemento è progettato per sembrare sia nostalgico che proiettato al futuro, un promemoria che a volte i vecchi modi hanno ancora molto da insegnarci.',
			whatsNext: 'Cosa c\'è in Arrivo',
			whatsNextDescription:
				'Questo lancio è solo l\'inizio. Aggiungeremo più contenuti, case study e risorse nei prossimi mesi. Restate sintonizzati per aggiornamenti sui nostri progetti e servizi.',
			thanks: 'Grazie per aver visitato la nostra nuova casa digitale!'
		},
		galleriaPilotta: {
			title: 'Tavolo interattivo Galleria Pilotta',
			date: '10/11/2023',
			description:
				'Tavolo interattivo per il Complesso della Pilotta con capacità di zoom per opere d\'arte e dipinti in restauro.',
			intro:
				'La nostra soluzione di tavolo interattivo per il museo del Complesso della Pilotta offre ai visitatori un modo immersivo per esplorare la collezione d\'arte. L\'interfaccia multi-touch permette agli utenti di zoomare sui dettagli di ogni dipinto, rivelando lavori di restauro e dettagli nascosti che non sarebbero visibili a occhio nudo.',
			keyFeatures: 'Caratteristiche Principali',
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
			description: 'Applicazione turistica di Rimini disponibile su Google Play Store.',
			intro:
				'Rimini Xperience è un\'applicazione turistica mobile progettata per aiutare i visitatori a scoprire la bellissima città di Rimini. L\'app fornisce guide interattive, punti di interesse e raccomandazioni locali per migliorare l\'esperienza turistica.',
			appFeatures: 'Funzionalità dell\'App',
			features: [
				'Mappe interattive della città con punti di interesse',
				'Guide audio per le principali attrazioni',
				'Raccomandazioni di ristoranti e alloggi locali',
				'Modalità offline per l\'uso senza connessione internet'
			],
			downloadTitle: 'Scarica l\'App',
			downloadDescription: 'Rimini Xperience è disponibile su Google Play Store.',
			downloadButton: 'Scaricala su Google Play',
			collaboration: 'Sviluppato in collaborazione con l\'ente turistico di Rimini.'
		},
		impeccable: {
			title: 'Standard Web Che Abbiamo Applicato a Questo Sito',
			date: '28/01/2026',
			description:
				'Un approfondimento sugli standard web, le funzionalità CSS e le best practice di sviluppo che abbiamo applicato per migliorare il nostro sito - dall\'accessibilità all\'ottimizzazione delle performance.',
			intro:
				'Quando abbiamo lanciato il sito WebDeploy, funzionava ma mancava di rifinitura. Usando Impeccable.style come guida, abbiamo affrontato sistematicamente accessibilità, performance, design responsive e animazioni. Ecco cosa abbiamo applicato.',
			whatIsImpeccable: 'Un Approccio Sistematico',
			whatIsImpeccableDescription:
				'Impeccable.style organizza le best practice dello sviluppo web in aree specifiche: audit di accessibilità, hardening dell\'interfaccia, design del movimento, adattamento cross-device, ottimizzazione delle performance, normalizzazione del design system e rifinitura finale. Ogni area ci ha insegnato standard e tecniche che ora applichiamo a ogni progetto.',
			commandsUsed: 'Cosa Abbiamo Implementato',
			commands: [
				{
					name: 'Standard di Accessibilità',
					description: 'Conformità WCAG e design inclusivo',
					details: 'Abbiamo implementato link skip-to-content per utenti da tastiera, attributi ARIA appropriati (aria-expanded, aria-haspopup, role="menu"), indicatori :focus-visible visibili, e testo per screen reader sui link esterni. La media query prefers-reduced-motion disabilita le animazioni per chi ne ha bisogno.'
				},
				{
					name: 'Resilienza dell\'Interfaccia',
					description: 'Gestire i casi limite con eleganza',
					details: 'Abbiamo aggiunto utility CSS per overflow del testo (line-clamp, truncate), stati di caricamento ed errore per componenti asincroni, e un sistema di logging solo per sviluppo che mantiene pulite le console in produzione preservando la debuggabilità durante lo sviluppo.'
				},
				{
					name: 'Design del Movimento CSS',
					description: 'Animazioni intenzionali con standard web',
					details: 'Abbiamo usato proprietà CSS custom per curve di easing (ease-out-quart, ease-out-expo), l\'API IntersectionObserver per reveal al scroll, trasformazioni CSS per animazioni performanti, e la proprietà will-change per suggerire l\'accelerazione GPU.'
				},
				{
					name: 'CSS Responsive e Adattivo',
					description: 'Tecniche moderne di layout',
					details: 'Abbiamo implementato env(safe-area-inset-*) per dispositivi con notch, fogli di stile @media print, meta tag viewport-fit=cover, target touch minimi di 44px secondo le linee guida WCAG, e CSS aspect-ratio per contenitori immagine stabili.'
				},
				{
					name: 'Core Web Vitals',
					description: 'Metriche di performance che contano',
					details: 'Abbiamo ottimizzato il Largest Contentful Paint con precaricamento font e fetchpriority="high", prevenuto il Cumulative Layout Shift con dimensioni esplicite delle immagini, usato loading="lazy" e decoding="async" per immagini sotto il fold, e applicato CSS containment per ottimizzare il rendering.'
				},
				{
					name: 'Proprietà CSS Custom',
					description: 'Costruire un design system manutenibile',
					details: 'Abbiamo creato oltre 50 proprietà CSS custom (design token) per colori, ombre, tipografia e spaziatura. Questo ha eliminato i valori hardcoded, abilitato il theming e reso il codebase più manutenibile. L\'integrazione con @theme di Tailwind CSS v4 ha reso tutto fluido.'
				},
				{
					name: 'Font Privacy-First',
					description: 'Self-hosting per maggiore controllo',
					details: 'Siamo passati dal CDN Google Fonts a dichiarazioni @font-face self-hosted con subsetting unicode-range appropriato. Questo elimina le richieste a terze parti, migliora la privacy e ci dà pieno controllo sul comportamento di caricamento dei font.'
				}
			],
			results: 'Standard Applicati',
			resultsIntro: 'Attraverso questo processo, abbiamo applicato standard web e best practice a ogni livello del sito:',
			resultsList: [
				'WCAG 2.1 AA: Skip link, ruoli ARIA, navigazione da tastiera, indicatori di focus, supporto reduced motion',
				'Core Web Vitals: Precaricamento font, lazy loading, dimensioni esplicite, CSS containment, hint GPU',
				'Funzionalità CSS: Proprietà custom, aspect-ratio, env() safe areas, @media print, line-clamp',
				'API Moderne: IntersectionObserver, Clipboard API, Web Share API, matchMedia per preferenze di movimento',
				'Privacy: Font self-hosted, nessuna richiesta CDN di terze parti, analytics senza cookie'
			],
			philosophy: 'Il Valore degli Standard',
			philosophyDescription:
				'Gli standard web esistono perché risolvono problemi reali. Gli standard di accessibilità assicurano che tutti possano usare il web. Gli standard di performance migliorano l\'esperienza utente e la SEO. Gli standard CSS forniscono soluzioni manutenibili e portabili. Imparare questi standard - invece di affidarsi alla magia dei framework - ti dà conoscenze trasferibili che funzionano con qualsiasi stack tecnologico.',
			callToAction: 'Risorse',
			callToActionDescription:
				'Impeccable.style fornisce un approccio strutturato per imparare e applicare questi standard web. La documentazione spiega non solo cosa fare, ma perché ogni pratica è importante.',
			learnMore: 'Documentazione',
			visitImpeccable: 'Visita Impeccable.style'
		},
		fosdem2026: {
			title: 'FOSDEM 2026: Regolamentazione e Infrastruttura',
			date: '04/02/2026',
			description:
				'La nostra esperienza al FOSDEM 2026 a Bruxelles - dalle devroom su CRA e SBOM alla scoperta di progetti open source innovativi come metal-stack.io.',
			descriptionBeforeLink:
				'La nostra esperienza al FOSDEM 2026 a Bruxelles - dalle devroom su CRA e SBOM alla scoperta di progetti open source innovativi come ',
			descriptionAfterLink: '.',
			intro:
				'Lo scorso weekend abbiamo partecipato al FOSDEM 2026 a Bruxelles, la più grande conferenza free e open source software in Europa. Ospitata all\'Université libre de Bruxelles (ULB), l\'edizione di quest\'anno ha riunito migliaia di sviluppatori, maintainer e appassionati di open source per due giorni di talk, workshop e community building.',
			whatIsFosdem: 'Cos\'è il FOSDEM?',
			whatIsFosdemDescription:
				'FOSDEM (Free and Open Source Software Developers\' European Meeting) è un evento annuale organizzato dalla comunità, per la comunità. Senza necessità di registrazione e completamente gratuito, incarna lo spirito dell\'open source. La conferenza presenta centinaia di talk su molteplici track, dallo sviluppo del kernel alle tecnologie web, dalla sicurezza alla documentazione.',
			craRoom: 'La Devroom CRA',
			craRoomDescription:
				'Una delle devroom di quest\'anno era dedicata al Cyber Resilience Act (CRA). Il regolamento europeo sta ridefinendo come il software open source verrà sviluppato, distribuito e mantenuto. I talk hanno coperto le implicazioni pratiche per i maintainer, i requisiti di conformità e come la comunità open source si sta organizzando per affrontare queste nuove sfide preservando la natura collaborativa dello sviluppo FOSS.',
			sbomRoom: 'SBOM e Sicurezza della Supply Chain',
			sbomRoomDescription:
				'Il track dedicato ai Software Bill of Materials (SBOM) ha affrontato una delle preoccupazioni più pressanti nello sviluppo software moderno: la sicurezza della supply chain. Le sessioni hanno esplorato strumenti per generare e consumare SBOM, l\'integrazione con le pipeline CI/CD e come le organizzazioni possono sfruttare gli SBOM per la gestione delle vulnerabilità.',
			community: 'La Comunità Open Source',
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
		privacy: 'Privacy Policy'
	},

	// Privacy Policy
	privacy: {
		title: 'Privacy Policy',
		intro: 'WebDeploy S.R.L. si impegna a proteggere la tua privacy. Questa pagina spiega come gestiamo i tuoi dati quando visiti il nostro sito web.',
		analyticsTitle: 'Analytics',
		analyticsText: 'Utilizziamo Matomo, una piattaforma di analytics self-hosted e orientata alla privacy. La nostra configurazione è progettata per rispettare la tua privacy:',
		analyticsFeatures: [
			'Nessun cookie viene impostato sul tuo dispositivo',
			'Gli indirizzi IP sono anonimizzati',
			'L\'impostazione Do Not Track del browser è rispettata',
			'I dati sono memorizzati sui server di Hetzner Online GmbH in Falkenstein, Bavaria'
		],
		optOutTitle: 'Disattiva Analytics',
		optOutText: 'Anche se utilizziamo un tracciamento rispettoso della privacy, puoi disattivare completamente le analytics:',
		dataTitle: 'Dati Raccolti',
		dataText: 'Raccogliamo solo dati anonimi e aggregati per capire come viene utilizzato il nostro sito:',
		dataItems: [
			'Pagine visitate e tempo trascorso',
			'Sito web di provenienza',
			'Tipo di browser e dimensione dello schermo',
			'Paese (derivato dall\'IP anonimizzato)'
		],
		contactTitle: 'Contatti',
		contactText: 'Per qualsiasi domanda relativa alla privacy, contattaci a:',
		dpaTitle: 'Accordo sul trattamento dei dati (DPA)',
		dpaText:
			'Quando WebDeploy S.R.L. tratta dati personali per tuo conto in qualità di responsabile del trattamento, lo fa sulla base di un accordo sul trattamento dei dati (DPA) conforme all\'art. 28 GDPR: finalità e durata del trattamento definite, misure di sicurezza tecniche e organizzative, elenco dei sub-responsabili, assistenza per le richieste degli interessati, e cancellazione o restituzione dei dati al termine del servizio. Richiedi il testo del DPA scrivendo a info@webdeploy.it.',
		optOut: {
			OptOutComplete: 'Opt-out completato. Le tue visite a questo sito non verranno registrate dallo strumento di Web Analytics.',
			OptOutCompleteBis: 'Nota che se cancelli i tuoi cookie, cancelli anche il cookie di opt-out, e se cambi computer o browser web, devi fare nuovamente la procedura di opt-out.',
			YouMayOptOut2: 'Puoi scegliere di impedire a questo sito web di aggregare e analizzare le azioni che intraprendi qui.',
			YouMayOptOut3: 'Ciò proteggerà la tua privacy, ma impedirà al proprietario di imparare dalle tue azioni e di creare un\'esperienza migliore per te e per gli altri utenti.',
			OptOutErrorNoCookies: 'La funzione per l\'opt-out dal monitoraggio richiede che siano abilitati i cookies.',
			OptOutErrorNotHttps: 'La funzione di esclusione dal monitoraggio (opt-out) potrebbe non funzionare perché questo sito non è stato caricato su HTTPS. Ricarica la pagina per verificare se il tuo stato di rinuncia è cambiato.',
			YouAreNotOptedOut: 'Al momento le tue visite vengono tracciate.',
			UncheckToOptOut: 'Togli la spunta a questa casella per escluderti (opt-out).',
			YouAreOptedOut: 'Al momento le tue visite non vengono tracciate.',
			CheckToOptIn: 'Metti la spunta a questa casella per abilitarti (opt-in).'
		}
	},

	// Common
	common: {
		email: 'E-Mail',
		phone: 'Telefono',
		learnMore: 'Scopri di più',
		contactUs: 'Contattaci',
		requestDemo: 'Richiedi Demo'
	}
};
