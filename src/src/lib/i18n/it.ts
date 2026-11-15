export const it = {
	// Navigation
	nav: {
		products: 'Prodotti',
		kiosk: 'Totem interattivo inWD™',
		news: 'Notizie',
		services: 'Servizi',
		linuxMigration: 'Migrazione delle workstation a Linux',
		backup: 'Backup cifrati',
		consulting: 'Consulenza open source',
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
		metaTitle: 'Infrastruttura open source, Linux e backup cifrati',
		metaDescription: 'WEBDEPLOY gestisce infrastruttura open source per team che vogliono sistemi affidabili: server gestiti con inWD, migrazione a Linux, backup cifrati e chioschi.',
		heroSubtitle: 'A look into the Future<void>',
		heroTagline: 'Software e infrastruttura open source per team che vogliono sistemi chiari e affidabili.',
		manifestoBtn: 'Manifesto per chi sviluppa',
		servicesBtn: 'Scopri i servizi',
		servicesEyebrow: 'Cosa facciamo',
		servicesTitle: 'Tecnologia aperta. Supporto concreto.',
		servicesDescription: 'Supporto diretto per Linux, dati privati e infrastrutture che puoi comprendere.',
		aboutEyebrow: 'Il nostro approccio',
		aboutTitle: 'Strumenti aperti. Scelte chiare.',
		aboutDescription: 'Usiamo strumenti open source e processi trasparenti, per aiutarti a capire e controllare la tecnologia su cui fai affidamento.',
		licenceLink: 'Licenza',
		toolGroups: {
			company: 'Per gestire l’azienda',
			infrastructure: 'Infrastruttura',
			operations: 'Servizi gestiti'
		},
		aboutLink: 'Leggi il manifesto per chi sviluppa',
		ctaTitle: 'Iniziamo con una conversazione',
		ctaDescription: 'Raccontaci a cosa stai lavorando e dove ti serve un partner affidabile.',
		ctaContact: 'Contatta WEBDEPLOY™',
		serviceSections: {
			linux: {
				title: 'Workstation Linux',
				subtitle: 'Passa a Linux con un piano',
				lead: 'Portiamo il tuo team da Windows a postazioni Linux dopo aver verificato con te che ogni programma e ogni dispositivo funzioni ancora. Poi ogni postazione viene registrata in inWD e gestita da remoto.',
				points: [
					'Elenchi di software e periferiche scritti con te',
					'Un test concordato con te per ogni voce di quegli elenchi',
					'Una postazione di prova prima che qualcuno cambi',
					'Registrata in inWD e gestita da remoto dopo il passaggio'
				],
				linkLabel: 'Migrazione a Linux',
				imageAlt: 'Scrivania nera con quattro monitor, uno su un braccio rialzato, tastiera e mouse, e un PC tower con luci rosse sotto'
			},
			privacy: {
				title: 'Archiviazione cifrata dei backup',
				subtitle: 'Backup che rispettano i tuoi dati',
				lead: 'Archiviazione e backup privati e cifrati, basati su BorgBackup, pensati per mantenere i dati della tua attività sotto il tuo controllo, con risposte chiare su dove si trovano e chi può leggerli.',
				points: [
					'Cifratura dei dati a riposo e in transito',
					'Software open source, senza vincoli proprietari',
					'Accessi decisi da te, verificati e documentati',
					'Backup con BorgBackup, deduplicati e cifrati prima di lasciare i tuoi computer'
				],
				linkLabel: 'Backup cifrati',
				imageAlt: 'Logo di BorgBackup',
				imageCredit:
					'Logo di BorgBackup © The Borg Collective, licenza BSD 3-Clause, ricolorato da WEBDEPLOY™. WEBDEPLOY™ non è affiliata né approvata dal progetto BorgBackup.'
			},
			inwd: {
				title: 'Infrastruttura gestita inWD™',
				subtitle: 'L’infrastruttura cresce selvatica. inWD™ la tiene curata.',
				lead: 'Monitoraggio, report e aggiornamenti gestiti per i server e le applicazioni che usi già. Tu li ospiti, noi li teniamo in salute.',
				points: [
					'Nessuna migrazione: i tuoi sistemi restano in sede, sui tuoi server o nel cloud',
					'Monitoraggio: sai cosa è attivo, con un heartbeat per ogni risorsa gestita',
					'Manutenzione: pacchetti, certificati e dipendenze aggiornati in un ciclo continuo',
					'Report: una traccia di cosa è gestito, cosa ha richiesto attenzione e cosa è cambiato'
				],
				linkLabel: 'Infrastruttura curata',
				imageAlt: 'Emblema Trunk / Rack di inWD: un tronco spezzato con tre unità rack e rametti con foglie alle radici'
			}
		}
	},

	// Service pages
	services: {
		cards: {
			consulting: {
				toolsLabel: 'Strumenti open source che usiamo ogni giorno'
			}
		},
		linux: {
			title: 'Migrazione di postazioni a Linux',
			metaDescription:
				'Come WEBDEPLOY porta le postazioni da Windows a Linux: elenchi di software e dispositivi concordati con te, test concordati, una postazione di prova, poi gestione inWD.',
			imageAlt: 'Emblema inWD Host gestito: un rack di tre server con spie di stato, ricoperto di foglie e vegetazione',
			subtitle: 'Da Windows a Linux, verificato prima che qualcuno cambi',
			description:
				'Una migrazione funziona solo se tutto ciò che il tuo team usa funziona ancora il giorno del passaggio. Per questo, prima di cambiare qualsiasi macchina, concordiamo con te cosa deve funzionare e come lo verificheremo.',
			inventory: {
				title: 'Ogni programma e ogni dispositivo, in elenco',
				subtitle: 'Niente da scoprire dopo',
				body: 'Insieme a te scriviamo due elenchi: una distinta del software (SBoM) con ogni programma usato dal tuo team, e una distinta delle periferiche come stampanti, scanner, etichettatrici, lettori di tessere e tavolette di firma. Per ogni voce troviamo la versione Linux, un sostituto o un modo per continuare a usarla.',
				examplesLabel: 'Voci di esempio',
				examples: [
					{ item: 'Documenti d\'ufficio', result: 'LibreOffice, provato sui tuoi file' },
					{ item: 'Posta e calendario', result: 'Thunderbird, con i tuoi account' },
					{ item: 'Applicazioni web', result: 'Firefox, ogni accesso verificato' },
					{ item: 'Etichettatrice', result: 'Driver Linux, etichette di prova stampate' },
					{ item: 'Lettore di tessere', result: 'Provato con i servizi che lo usano' }
				],
				examplesNote: 'I tuoi elenchi li scriviamo con te, voce per voce.'
			},
			testing: {
				title: 'Test concordati con te',
				subtitle: 'Pronto vuol dire test superato',
				body: 'Per ogni voce dei due elenchi definiamo con te il test da superare. Una voce è pronta quando il suo test è superato, non quando lo diciamo noi.',
				points: [
					'Stampare una fattura vera sulla tua stampante',
					'Scansionare nella cartella condivisa',
					"Aprire i file e i modelli dell'anno scorso",
					'Accedere ai servizi web che usi ogni giorno'
				]
			},
			testMachine: {
				title: 'Una postazione da provare prima',
				subtitle: 'I problemi li trova una persona, non tutti',
				body: 'Prima del passaggio ricevi una postazione Linux su cui lavorare. Chi la usa, per quanto tempo e per quali attività lo concordiamo con te, così chi userà Linux ogni giorno trova i problemi prima che tutti cambino.',
				demo: {
					label: 'Demo interattiva di una postazione KDE Plasma',
					controls: 'Prova la postazione',
					files: 'Apri i file',
					browser: 'Apri il browser',
					office: 'Scrivi un documento',
					print: 'Stampa un\'etichetta di prova',
					printQueue: 'Coda di stampa',
					printer: 'Etichettatrice',
					ready: 'Pronta',
					completed: 'Completato',
					noticeTitle: 'Etichetta di prova stampata',
					noticeBody: 'Etichettatrice · test-label.pdf'
				},
				imageCaption:
					"Nella foto: la nostra postazione, una configurazione molto ampia. La postazione di prova che ricevi è configurata come le macchine che il tuo team userà davvero.",
				imageAlt: 'Scrivania nera con quattro monitor, uno su un braccio rialzato, tastiera e mouse, e un PC tower con luci rosse sotto'
			},
			support: {
				title: 'Manutenzione dopo il passaggio',
				subtitle: 'Registrata in inWD',
				body: 'Dopo il passaggio ogni postazione viene registrata in inWD, il nostro servizio gestito, come avviene per un server. Una volta registrata, la aggiorniamo e risolviamo i problemi da remoto dal pannello inWD su console.inwd.org, senza che nessuno debba portarci le macchine.',
				link: 'Scopri inWD',
				imageAlt: 'Emblema inWD Tronco / Rack: un tronco spezzato con tre unità rack, rametti con foglie alle radici'
			}
		},
		backup: {
			title: 'Backup cifrati',
			metaDescription:
				'Backup cifrati con BorgBackup inclusi in inWD: cifrati prima di lasciare le tue macchine, open source, accessi decisi da te e un ripristino verificato ogni mese.',
			subtitle: 'Parte di inWD',
			description:
				'Backup che lasciano i dati della tua azienda nelle tue mani: cifrati sulle tue macchine, conservati dove solo tu puoi leggerli e ripristinati regolarmente, così sai che funzionano.',
			imageAlt: 'Logo di BorgBackup',
			imageCredit:
				'Logo BorgBackup © The Borg Collective, licenza BSD 3-Clause, ricolorato da WEBDEPLOY™. WEBDEPLOY™ non è affiliata né approvata dal progetto BorgBackup.',
			licenceLink: 'Licenza',
			sections: {
				encrypted: {
					title: 'Cifrati prima di lasciare le tue macchine',
					subtitle: 'Lo storage vede solo dati cifrati',
					body: 'BorgBackup cifra e deduplica i dati sul tuo server, quindi ciò che viaggia e ciò che viene conservato è già cifrato. La deduplicazione mantiene piccolo ogni backup giornaliero.'
				},
				open: {
					title: 'Open source, nessun vincolo',
					subtitle: 'Leggibili anche senza di noi',
					body: 'Borg è software open source. I tuoi backup restano leggibili con strumenti standard e liberamente disponibili, che tu continui o meno a lavorare con noi.'
				},
				access: {
					title: 'Accessi decisi da te',
					subtitle: 'Verificati e documentati',
					body: 'Chi può leggere i tuoi backup e chi può avviare un ripristino lo decidiamo con te, lo mettiamo per iscritto e lo verifichiamo.'
				},
				restore: {
					title: 'Un ripristino verificato ogni mese',
					subtitle: 'Un backup conta quando si ripristina',
					body: 'Ogni mese ripristiniamo dai tuoi backup e controlliamo il risultato, così sai che funzionano prima del giorno in cui ti servono.'
				}
			},
			inwd: {
				title: 'Parte di inWD',
				body: 'I backup cifrati sono inclusi in inWD, il nostro servizio di infrastruttura gestita. Tutti i dettagli sono sul sito di inWD.',
				cta: 'Visita inwd.org'
			}
		},
		consulting: {
			title: 'Consulenza open source',
			metaDescription:
				'Consulenza open source di WEBDEPLOY: valutazione tecnologica, sviluppo su misura, coinvolgimento nelle comunità e conformità delle licenze.',
			subtitle: 'Consulenza per adottare tecnologie open source e contribuire ai relativi progetti',
			items: [
				'Valutazione tecnologica — valuta alternative open source a soluzioni proprietarie',
				'Sviluppo personalizzato — costruisci soluzioni usando framework e strumenti open source',
				'Coinvolgimento della comunità — aiuta la tua organizzazione a contribuire ai progetti open source',
				'Conformità delle licenze — assicura una corretta gestione delle licenze open source'
			]
		}
	},

	// Totem/Kiosk page
	totem: {
		heroName: 'Totem interattivo inWD™',
		diagramAlt: 'Totem nero verticale con codice verde sullo schermo',
		metaDescription:
			"inWD Kiosk: un totem interattivo da interno su Linux open source. Mostra l'app o il sito che scegli ed è aggiornato e assistito da remoto da WEBDEPLOY.",
		heroTagline: 'Totem interattivo da interno su Linux open source, aggiornato e assistito da remoto',
		requestDemo: 'Parliamone',
		learnMore: 'Cosa è incluso',
		demo: {
			label: 'Demo interattiva del totem',
			caption:
				"L'interfaccia su questo chiosco è una demo. Possiamo usare quella che hai già, oppure progettare e sviluppare quella che ti serve.",
			switchLabel: 'Sistema del totem',
			windows: 'Totem Windows',
			inwd: 'inWD™ Kiosk',
			brand: 'inWD™ Kiosk',
			welcome: 'Benvenuto',
			prompt: 'Tocca un riquadro per esplorare',
			back: 'Indietro',
			footer: 'M4SS Linux Embedded Machine',
			hours: {
				title: 'Orari di apertura',
				items: ['Lun–Ven 9:00–19:00', 'Sabato 10:00–18:00', 'Domenica chiuso']
			},
			map: {
				title: 'Orientati',
				items: ['Piano terra: reception, bar', 'Primo piano: mostra', 'Secondo piano: biblioteca']
			},
			events: {
				title: 'Oggi',
				items: ['10:30 Visita guidata', '14:00 Workshop open source', '17:00 Linux install party']
			},
			updating: 'Aggiornamenti in corso',
			complete: '% completato',
			dontTurnOff: 'Non spegnere il totem. Ci vorrà un po’.'
		},
		features: {
			linux: {
				title: 'Linux open source',
				details:
					"Il totem usa una distribuzione Linux ingegnerizzata su misura per l'Industrial IoT. Esegue solo lo stretto necessario per mostrare l'interfaccia che scegli, che sia un'app o un sito web."
			},
			security: {
				title: 'Dati cifrati',
				details:
					'Dati locali, comunicazioni e operazioni sono protetti con la crittografia. I dati sono cifrati e trasferiti end-to-end con protocolli che forniscono autenticazione, riservatezza e integrità. Il traffico di rete è monitorato per prevenire accessi non autorizzati.'
			},
			noLockIn: {
				title: 'Nessun vendor lock-in',
				details:
					"Il sistema non dipende da software proprietario né da licenze di software di terze parti. L'hardware può essere riutilizzato per altri scopi e il software sovrascritto."
			}
		},
		included: {
			title: 'Cosa include inWD Kiosk',
			hardware: {
				title: 'Hardware',
				items: [
					'Un totem da interno; la nostra configurazione di riferimento usa un monitor da 55 pollici',
					'Touch tramite un frame a infrarossi, separato dallo schermo: un componente danneggiato si sostituisce da solo, in modo più economico e rapido',
					'Connessione via cavo Ethernet o Wi-Fi, per l’assistenza remota e una gamma più ampia di software'
				]
			},
			software: {
				title: 'Software',
				items: [
					"M4SS Linux Embedded Machine, una distribuzione Linux ridotta a ciò che serve all'interfaccia scelta",
					"Un'architettura aperta: sullo schermo si può mostrare qualsiasi applicativo scelto",
					'Configurazione da remoto, aggiornamenti OTA e monitoraggio dei totem tramite inWD, il nostro servizio gestito'
				]
			},
			branding: {
				title: 'Il tuo marchio',
				items: [
					'White labelling: uno spazio fisico tra la base e il monitor ospita il tuo marchio',
					"La struttura si può verniciare in tutto o in parte, per adattarla all'ambiente"
				]
			}
		},
		technology: {
			title: 'Basato su S451 di M4SS',
			description:
				"Il totem usa S451, una tecnologia di M4SS Srl progettata per dispositivi Industrial IoT. M4SS ha sviluppato internamente know-how, procedure e software per generare una distribuzione Linux, chiamata M4SS Linux Embedded Machine. S451 è già impiegata in diversi settori industriali, a cui ora si aggiungono i totem interattivi.",
			listTitle: 'La stessa tecnologia ci permette di realizzare sistemi per:',
			features: [
				'Acquisizione dati da macchine e sensori',
				'Edge computing, con software personalizzato',
				'Trasferimento dati in sicurezza',
				'Archiviazione dati affidabile',
				'Cybersecurity (monitoring IDS/IPS)'
			]
		},
		support: {
			title: 'Assistenza e manutenzione',
			description:
				"I sistemi sono aggiornati costantemente e gli aggiornamenti partono periodicamente. Le nuove vulnerabilità nei pacchetti di sistema sono trattate in ordine di gravità. Ogni vulnerabilità del software installato viene analizzata e, in base alla gravità, si definiscono procedure di mitigazione; la gravità è valutata con il punteggio CVSS a partire da tipologia (secondo lo standard OWASP), vettore di attacco, interazione utente e complessità dell'attacco.",
			features: [
				'Assistenza tecnica da remoto tramite una piattaforma di ticketing dedicata',
				'inWD: ogni totem è registrato nel nostro servizio gestito, che si occupa di configurazione da remoto, aggiornamenti OTA (over-the-air) del sistema operativo del totem e monitoraggio',
				'Dipendenze: aggiornamento periodico di ciò che serve al software scelto per funzionare',
				'Non incluso: interventi sulla tua rete locale per ospitare l’hardware'
			],
			link: 'Visita inwd.org'
		},
		applications: {
			title: 'Cosa può mostrare',
			description: "Il totem mostra l'applicazione che scegli, per esempio:",
			items: [
				'Orari di apertura e informazioni per i visitatori',
				"Mappe e indicazioni dentro un edificio",
				'Programmi di eventi',
				'Una web app o un sito che già gestisci'
			]
		},
		cta: {
			title: 'Parliamone',
			description:
				"Raccontaci cosa deve mostrare il totem e dove sarà installato. Ti risponderemo con una proposta che copre l'hardware, l'aspetto e il servizio di assistenza.",
			button: 'Scrivici',
			email: 'Email',
			partnership: 'Tecnologia',
			poweredBy: 'S451 di'
		}
	},

	// Developer Manifesto
	manifesto: {
		title: 'Manifesto per chi sviluppa',
		eyebrow: 'Come pensiamo',
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
				"Costruiamo software che duri. Il codice scritto di fretta lascia debito tecnico a chi deve modificarlo dopo. Investiamo tempo fin dall'inizio."
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
				"Il nostro lavoro dipende dall'open source. Contribuiamo all'ecosistema e condividiamo quello che sappiamo."
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
				"Non sacrifichiamo il nostro modo di lavorare o la qualità del codice per crescere più in fretta. Un'azienda più grande con software peggiore è un pessimo upgrade."
		},
		cta: 'Stai costruendo qualcosa? Raccontaci dove lo stack ti complica il lavoro.',
		getInTouch: 'Parliamone'
	},

	// Contacts
	contacts: {
		title: 'Contatti',
		eyebrow: 'Contattaci',
		lead: 'Scrivici, chiamaci o passa nel nostro ufficio a Parma.',
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
				"Lavora con noi, non per noi. Cerchiamo sviluppatori che condividono la nostra passione per l'open source, l'esperienza degli sviluppatori e le pratiche di lavoro sostenibili.",
			perks: 'Lavoro da remoto • Orari flessibili • Open source • Equilibrio tra lavoro e vita privata'
		}
	},

	// News
	news: {
		title: 'Notizie',
		metaDescription: 'Notizie da WEBDEPLOY: avvisi di sicurezza, eventi open source e aggiornamenti sui nostri servizi Linux, infrastruttura e backup.',
		readMore: 'Leggi di più',
		backToNews: 'Notizie',
		contactUs: 'Contattaci',
		share: 'Condividi',
		shareOnLinkedIn: 'Condividi su LinkedIn',
		shareOnInstagram: 'Condividi su Instagram',
		linkCopied: 'Link copiato. Puoi incollarlo nella tua Storia Instagram.',
		copyFailed: 'Impossibile copiare il link. Copialo dalla barra degli indirizzi.',
		instagramStoryLinkCopied: 'Link copiato: incollalo nella storia con lo sticker link.',
		instagramDesktop: 'Link copiato. Le storie di Instagram si creano solo dall\'app sul telefono.',
		shareText: 'Leggi questo articolo:',
		popupBlocked: 'Popup bloccato. Apertura in una nuova scheda.',
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
				"Lo scorso weekend abbiamo partecipato al FOSDEM 2026 a Bruxelles, la più grande conferenza europea dedicata al software libero e open source. Ospitata all'Université libre de Bruxelles (ULB), l'edizione di quest'anno ha riunito migliaia di sviluppatori, maintainer e appassionati di open source per due giorni di interventi, workshop e incontri della comunità.",
			whatIsFosdem: 'Cos\'è il FOSDEM?',
			whatIsFosdemDescription:
				"FOSDEM (Free and Open Source Software Developers' European Meeting) è un evento annuale organizzato dalla comunità, per la comunità. Senza necessità di registrazione e completamente gratuito, incarna lo spirito dell'open source. La conferenza presenta centinaia di talk su molteplici track, dallo sviluppo del kernel alle tecnologie web, dalla sicurezza alla documentazione.",
			craRoom: 'La devroom CRA',
			craRoomDescription:
				"Una delle devroom di quest'anno era dedicata al Cyber Resilience Act (CRA). Il regolamento europeo sta ridefinendo come il software open source verrà sviluppato, distribuito e mantenuto. I talk hanno coperto le implicazioni pratiche per i maintainer, i requisiti di conformità e come la comunità open source si sta organizzando per affrontare queste nuove sfide preservando la natura collaborativa dello sviluppo FOSS.",
			sbomRoom: 'SBOM e sicurezza della supply chain',
			sbomRoomDescription:
				"Il track dedicato ai Software Bill of Materials (SBOM) ha affrontato una delle preoccupazioni più pressanti nello sviluppo software moderno: la sicurezza della supply chain. Le sessioni hanno esplorato strumenti per generare e utilizzare SBOM, l'integrazione con le pipeline CI/CD e come le organizzazioni possono sfruttare gli SBOM per la gestione delle vulnerabilità.",
			community: 'La comunità open source',
			communityDescription:
				"Ciò che rende il FOSDEM speciale non è solo il contenuto tecnico, ma la comunità stessa. Conversazioni nei corridoi, incontri spontanei e la comprensione condivisa che l'open source è più del codice - è un movimento collaborativo. Incontrare maintainer di progetti che usiamo quotidianamente, discutere sfide con colleghi che affrontano problemi simili e scoprire nuove soluzioni a vecchi problemi - questo è ciò che ci fa tornare anno dopo anno.",
			visitFosdem: 'Visita il FOSDEM'
		},
		php2shell: {
			title: 'PHP2Shell: RCE senza login nel core di PHP, patcha subito',
			metaDescription: 'PHP2Shell (CVE-2026-109618 e CVE-2026-109619): vulnerabilità critiche di PHP che permettono l\'esecuzione di codice da remoto. Versioni colpite e come aggiornare.',
			imageAlt:
				'Illustrazione ad acquerello: un elefante gigante rattoppato si nasconde tra rack di server coperti di rampicanti con spie rosse accese, mentre un giovane elfo lo indica tenendo per mano una compagna',
			date: '22/10/2026',
			description:
				'CVE-2026-109618 e CVE-2026-109619: due bug nel motore di PHP danno esecuzione di codice sul server con una sola richiesta HTTP, senza login. WordPress, Drupal, Magento e quasi tutto lo stack PHP sono esposti. Versioni fixate, backport per PHP 7 e mitigazioni.',
			intro:
				'21 ottobre 2026: il progetto PHP rilascia le patch per PHP2Shell. I dettagli erano trapelati il giorno prima della disclosure coordinata e watchTowr, Cloudflare e altri vedono già traffico di exploit. Se hai un PHP esposto al web e non aggiornato, parti dal presupposto che sia già un bersaglio.',
			whatTitle: 'Il bug in breve',
			whatDescription:
				"Due bug distinti nel core di PHP, entrambi CVSS v4.0 9.2. Scattano mentre PHP gestisce la richiesta, prima che giri una sola riga della tua applicazione: niente login, niente plugin vulnerabile, niente codice tuo di mezzo. Basta una richiesta HTTP per eseguire codice con l'utente del worker web.",
			cves: [
				"CVE-2026-109618 (OOM corruption): se PHP va in out-of-memory mentre i dati della richiesta sono inizializzati solo a metà, lo stato corrotto porta all'esecuzione di codice.",
				"CVE-2026-109619 (stale global state): stato globale legato alla richiesta che sopravvive al free della sua memoria. Porta all'esecuzione di codice e fa trapelare memoria del worker PHP."
			],
			appsTitle: 'Chi è nel mirino',
			appsDescription:
				'Il bug sta nel runtime, non nell\'applicazione: qualunque cosa giri su un PHP vulnerabile è esposta, anche un "Hello World". Exploit senza autenticazione già dimostrati su:',
			appsList: [
				'CMS: WordPress, Drupal, Joomla, MediaWiki',
				'E-commerce: Magento / Adobe Commerce',
				'Collaboration e webmail: Nextcloud, Roundcube',
				'Pannelli e billing: phpMyAdmin, WHMCS',
				'Framework: Laravel, Symfony e tutto quello che ci gira sopra'
			],
			appsNote:
				'Aggiornare WordPress, i plugin o Nextcloud qui non serve: il fix va nel binario PHP sul server.',
			runtimesTitle: 'SAPI esposte',
			runtimesList: [
				'Apache + mod_php: il caso peggiore',
				'PHP-FPM e php-cgi dietro Nginx o Apache',
				'FrankenPHP e LiteSpeed'
			],
			fixedTitle: 'Versioni fixate',
			fixedDescription:
				'Porta PHP a una di queste release, o installa il pacchetto patchato della tua distro:',
			fixedList: [
				'PHP 8.5.12',
				'PHP 8.4.27',
				'PHP 8.3.36',
				'PHP 8.2.35 (EOL il 31 dicembre 2026: pianifica già il salto)'
			],
			legacyTitle: 'Sei ancora su PHP 7.4, 8.0 o 8.1?',
			legacyDescription:
				'Rami EOL, quindi nessuna release ufficiale. Il security team di PHP ha però pubblicato backport minimali del fix nel repository php-src. Se compili PHP da sorgente, li trovi qui:',
			legacyLinks: [
				{ label: 'PHP 7.4', url: 'https://github.com/php/php-src/tree/PHP-7.4-CVE-2026-109618-109619' },
				{ label: 'PHP 8.0', url: 'https://github.com/php/php-src/tree/PHP-8.0-CVE-2026-109618-109619' },
				{ label: 'PHP 8.1', url: 'https://github.com/php/php-src/tree/PHP-8.1-CVE-2026-109618-109619' }
			],
			legacyNote:
				"Se usi i pacchetti della distro, controlla gli advisory del vendor o di un provider di extended support per avere build patchate. Da PHP 5.4 a 7.3 non c'è nessun fix: l'unica via è migrare a una versione supportata.",
			mitigationTitle: 'Non puoi patchare subito?',
			mitigationDescription:
				"L'advisory ufficiale elenca mitigazioni temporanee. Riducono la superficie d'attacco, ma il buco resta aperto:",
			mitigationList: [
				'session.upload_progress.enabled = 0 in php.ini o nel pool FPM, poi restart di tutti i worker. ini_set() e .user.ini non bastano: si applicano troppo tardi',
				'post_max_size = 8M (32M se ti servono gli upload), con upload_max_filesize sotto quel valore',
				'Su PHP 8.5: fatal_error_backtraces = 0',
				'Regole WAF sui vettori noti davanti al sito: Cloudflare le ha già attivate su tutti i piani, free compreso'
			],
			mitigationNote:
				'Se non puoi aggiornare subito, CERT-EU, il servizio di cybersicurezza delle istituzioni europee, raccomanda di isolare dalla rete pubblica i sistemi esposti su internet finché il fix non è applicato e verificato.',
			sourcesTitle: 'RTFM: fonti e advisory',
			sources: [
				{ label: 'Advisory di sicurezza PHP (php.net)', url: 'https://www.php.net/archive/2026.php#2026-10-21-5' },
				{ label: 'GHSA-w8hw-w9fx-j79w: CVE-2026-109618', url: 'https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w' },
				{ label: 'GHSA-6wmf-4rv5-p3rp: CVE-2026-109619', url: 'https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp' },
				{ label: 'CERT-EU security advisory 2026-018', url: 'https://cert.europa.eu/publications/security-advisories/2026-018/' },
				{ label: 'Il sito della ricerca PHP2Shell', url: 'https://www.php2shell.com/' },
				{ label: 'watchTowr: PHP2Shell FAQ', url: 'https://watchtowr.com/intelligence/php-cve-2026-109618-faq/' }
			],
			visitAdvisory: 'Leggi l\'advisory di PHP'
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
		copyright: 'Copyright © 2026 WEBDEPLOY S.R.L.',
		trademarks: 'WEBDEPLOY™ e inWD™ sono marchi di WEBDEPLOY S.R.L.',
		registeredOffice: 'Sede legale',
		security: 'Sicurezza',
		privacy: 'Informativa sulla privacy',
		source: 'Codice sorgente'
	},

	// Pagina Sicurezza
	security: {
		title: 'Sicurezza',
		heading: 'La sicurezza in WEBDEPLOY',
		metaDescription:
			'Chi è responsabile della sicurezza delle informazioni in WEBDEPLOY SRL e come segnalare una vulnerabilità.',
		responsibleTitle: 'Chi è responsabile',
		responsibleText:
			"Federico Bologni, Amministratore Unico di WEBDEPLOY SRL, è responsabile della sicurezza delle informazioni, compresi l'hardening dell'infrastruttura, la gestione delle vulnerabilità, la risposta agli incidenti e la divulgazione coordinata dei problemi di sicurezza.",
		reportingTitle: 'Segnalare una vulnerabilità',
		reportingIntro:
			'Se ritieni di aver trovato una vulnerabilità di sicurezza nei nostri siti, servizi o infrastruttura, segnalala via email a',
		includeTitle: 'Indica per favore:',
		includeItems: [
			'Una descrizione del problema e del sistema, URL o componente interessato',
			'I passaggi per riprodurlo, oppure una proof of concept',
			"L'impatto che ritieni abbia",
			'Come possiamo contattarti e se desideri essere citato'
		],
		acknowledgement:
			'Ci impegniamo a confermare la ricezione di ogni segnalazione entro 5 giorni lavorativi e a tenerti aggiornato mentre analizziamo e correggiamo il problema.',
		disclosure:
			'Ti chiediamo di non rendere pubblico il problema, né di comunicarlo ad altri, finché non abbiamo rilasciato una correzione e concordato con te una data di divulgazione.',
		safeHarbour:
			"Non intraprenderemo né sosterremo azioni legali contro chi ci segnala una vulnerabilità in buona fede, si impegna ragionevolmente a evitare violazioni della privacy, distruzione di dati e interruzioni del servizio, accede solo ai dati necessari a dimostrare il problema e ci concede un tempo ragionevole per correggerlo prima di qualsiasi divulgazione.",
		approachTitle: 'Il nostro approccio',
		approachItems: [
			'Una configurazione di hardening di base sui server che gestiamo, con firewall e fail2ban',
			'Aggiornamenti regolari di sistema operativo e pacchetti sui server che gestiamo',
			'Backup cifrati e fuori sede con BorgBackup',
			'Rilevamento delle intrusioni con Suricata sugli host gestiti',
			'Seguiamo i bollettini di sicurezza di CERT-EU ed ENISA'
		],
		companyLabel: 'Dati societari'
	},

	// Privacy Policy
	privacy: {
		title: 'Informativa sulla privacy',
		intro: 'WEBDEPLOY S.R.L. si impegna a proteggere la tua privacy. Questa pagina spiega come gestiamo i tuoi dati quando visiti il nostro sito web.',
		analyticsTitle: 'Analisi delle visite',
		analyticsText: 'Utilizziamo Matomo, una piattaforma di analytics self-hosted e orientata alla privacy. La nostra configurazione è progettata per rispettare la tua privacy:',
		analyticsFeatures: [
			'Nessun cookie viene impostato sul tuo dispositivo',
			'Gli indirizzi IP sono anonimizzati',
			"L'impostazione Do Not Track del browser è rispettata",
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
			"Paese (derivato dall'IP anonimizzato)"
		],
		contactTitle: 'Contatti',
		contactText: 'Per qualsiasi domanda relativa alla privacy, contattaci a:',
		marketingTitle: 'Marketing e pubblicità',
		marketingText:
			"Con il tuo consenso esplicito usiamo il pixel di Meta (Facebook/Instagram) per misurare l'efficacia delle campagne pubblicitarie e per il retargeting. Il pixel imposta cookie e viene caricato solo dopo il consenso, che puoi negare o revocare in qualsiasi momento cancellando i cookie del sito. Senza consenso, nessuno script pubblicitario viene caricato.",
		dpaTitle: 'Accordo sul trattamento dei dati (DPA)',
		dpaText:
			"Quando WEBDEPLOY S.R.L. tratta dati personali per tuo conto in qualità di responsabile del trattamento, lo fa sulla base di un accordo sul trattamento dei dati (DPA) conforme all'art. 28 GDPR: finalità e durata del trattamento definite, misure di sicurezza tecniche e organizzative, elenco dei sub-responsabili, assistenza per le richieste degli interessati, e cancellazione o restituzione dei dati al termine del servizio. Richiedi il testo del DPA scrivendo a info@webdeploy.it.",
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
		phone: 'Telefono',
		skipToContent: 'Vai al contenuto principale',
		opensInNewTab: '(si apre in una nuova scheda)',
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
		body: 'Usiamo Matomo (analytics senza cookie, sempre attivo) e, solo con il tuo consenso, il pixel Meta per misurare le campagne pubblicitarie. Dettagli nell\'<a href="/privacy" class="text-primary underline underline-offset-2">informativa sulla privacy</a>.',
		accept: 'Accetta i cookie di marketing',
		reject: 'Rifiuta i cookie di marketing'
	}
};
