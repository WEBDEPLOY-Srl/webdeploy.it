<script lang="ts">
    import { t, locale } from "$lib/i18n";
    import LanguageSwitcher from "./LanguageSwitcher.svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    let mobileMenuOpen = $state(false);
    let productsDropdownOpen = $state(false);
    let servicesDropdownOpen = $state(false);

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function toggleProductsDropdown() {
        productsDropdownOpen = !productsDropdownOpen;
        servicesDropdownOpen = false;
    }

    function toggleServicesDropdown() {
        servicesDropdownOpen = !servicesDropdownOpen;
        productsDropdownOpen = false;
    }

    function closeAllDropdowns() {
        productsDropdownOpen = false;
        servicesDropdownOpen = false;
    }

    function handleDropdownKeydown(
        event: KeyboardEvent,
        dropdownType: "products" | "services",
    ) {
        if (event.key === "Escape") {
            if (dropdownType === "products") {
                productsDropdownOpen = false;
            } else {
                servicesDropdownOpen = false;
            }
            (event.target as HTMLElement)?.focus();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            const menu = (event.currentTarget as HTMLElement)?.querySelector(
                '[role="menu"]',
            );
            const firstItem = menu?.querySelector(
                '[role="menuitem"]',
            ) as HTMLElement;
            firstItem?.focus();
        }
    }

    function handleMenuItemKeydown(event: KeyboardEvent) {
        const menuItems = Array.from(
            (
                event.currentTarget as HTMLElement
            )?.parentElement?.querySelectorAll('[role="menuitem"]') || [],
        ) as HTMLElement[];
        const currentIndex = menuItems.indexOf(
            event.currentTarget as HTMLElement,
        );

        if (event.key === "ArrowDown") {
            event.preventDefault();
            const nextItem = menuItems[currentIndex + 1] || menuItems[0];
            nextItem?.focus();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const prevItem =
                menuItems[currentIndex - 1] || menuItems[menuItems.length - 1];
            prevItem?.focus();
        } else if (event.key === "Escape") {
            closeAllDropdowns();
        }
    }
</script>

<header
    class="sticky top-0 z-40 w-full bg-background-dark/95 border-b-2 border-primary/30 backdrop-blur-sm"
>
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            <!-- Logo -->
            <a
                href="/"
                class="flex items-center gap-3 group"
                onclick={closeMobileMenu}
            >
                <div
                    class="flex items-center justify-center border-2 border-primary p-1 group-hover:bg-primary transition-colors"
                >
                    <img
                        src="/webdeploy-icon.png"
                        alt="WebDeploy"
                        width="32"
                        height="32"
                        class="block h-8 w-8"
                    />
                </div>
                <span
                    class="text-3xl font-display font-bold tracking-widest text-white uppercase group-hover:text-primary transition-colors"
                >
                    WebDeploy<span class="animate-pulse">_</span>
                </span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex gap-8" aria-label="Main navigation">
                <!-- Products Dropdown -->
                <div
                    class="relative dropdown-container"
                    onmouseleave={() => (productsDropdownOpen = false)}
                >
                    <button
                        class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-all flex items-center gap-1 min-h-[44px]"
                        aria-expanded={productsDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="products-menu"
                        onclick={toggleProductsDropdown}
                        onkeydown={(e) => handleDropdownKeydown(e, "products")}
                        onmouseenter={() => (productsDropdownOpen = true)}
                    >
                        <span aria-hidden="true">&gt;</span>
                        {t("nav.products")}
                        <span
                            class="material-symbols-outlined text-sm"
                            aria-hidden="true">expand_more</span
                        >
                    </button>
                    <div
                        id="products-menu"
                        role="menu"
                        aria-label="Products submenu"
                        class="absolute top-full left-0 mt-2 bg-surface-dark border-2 border-primary/30 min-w-[200px] transition-all duration-200 origin-top ease-out-quint {productsDropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'}"
                    >
                        <a
                            href="/totem"
                            role="menuitem"
                            class="block px-4 py-3 text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.kiosk")}
                        </a>
                    </div>
                </div>

                <a
                    href="/news"
                    class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-all min-h-[44px] flex items-center"
                >
                    <span aria-hidden="true">&gt;</span>
                    {t("nav.news")}
                </a>

                <!-- Services Dropdown -->
                <div
                    class="relative dropdown-container"
                    onmouseleave={() => (servicesDropdownOpen = false)}
                >
                    <button
                        class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-all flex items-center gap-1 min-h-[44px]"
                        aria-expanded={servicesDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="services-menu"
                        onclick={toggleServicesDropdown}
                        onkeydown={(e) => handleDropdownKeydown(e, "services")}
                        onmouseenter={() => (servicesDropdownOpen = true)}
                    >
                        <span aria-hidden="true">&gt;</span>
                        {t("nav.services")}
                        <span
                            class="material-symbols-outlined text-sm"
                            aria-hidden="true">expand_more</span
                        >
                    </button>
                    <div
                        id="services-menu"
                        role="menu"
                        aria-label="Services submenu"
                        class="absolute top-full left-0 mt-2 bg-surface-dark border-2 border-primary/30 min-w-[250px] transition-all duration-200 origin-top ease-out-quint {servicesDropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'}"
                    >
                        <a
                            href="/services#inwd"
                            role="menuitem"
                            class="block px-4 py-3 text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.managedInfra")}
                        </a>
                        <a
                            href="/services#linux"
                            role="menuitem"
                            class="block px-4 py-3 text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.linuxMigration")}
                        </a>
                    </div>
                </div>

                <a
                    href="/developer-manifesto"
                    class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-all min-h-[44px] flex items-center"
                >
                    <span aria-hidden="true">&gt;</span>
                    {t("nav.manifesto")}
                </a>

                <a
                    href="/contacts"
                    class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary hover:underline decoration-2 underline-offset-4 transition-all min-h-[44px] flex items-center"
                >
                    <span aria-hidden="true">&gt;</span>
                    {t("nav.contacts")}
                </a>
            </nav>

            <!-- Right side: Language switcher + Mobile menu -->
            <div class="flex items-center gap-4">
                <LanguageSwitcher />

                <!-- Mobile menu button -->
                <button
                    class="lg:hidden text-primary border-2 border-primary p-2 hover:bg-primary hover:text-black transition-colors"
                    onclick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <span class="material-symbols-outlined">
                        {mobileMenuOpen ? "close" : "menu"}
                    </span>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
        <nav
            class="lg:hidden bg-surface-dark border-t-2 border-primary/30 overflow-hidden"
            aria-label="Mobile navigation"
            transition:slide={{ duration: 250, easing: quintOut }}
        >
            <div class="px-4 py-4 space-y-1">
                <a
                    href="/totem"
                    class="block px-4 py-4 min-h-[48px] text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    <span aria-hidden="true">&gt;</span>&nbsp;{t("nav.kiosk")}
                </a>
                <a
                    href="/news"
                    class="block px-4 py-4 min-h-[48px] text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    <span aria-hidden="true">&gt;</span>&nbsp;{t("nav.news")}
                </a>
                <a
                    href="/services"
                    class="block px-4 py-4 min-h-[48px] text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    <span aria-hidden="true">&gt;</span>&nbsp;{t(
                        "nav.services",
                    )}
                </a>
                <a
                    href="/developer-manifesto"
                    class="block px-4 py-4 min-h-[48px] text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    <span aria-hidden="true">&gt;</span>&nbsp;{t(
                        "nav.manifesto",
                    )}
                </a>
                <a
                    href="/contacts"
                    class="block px-4 py-4 min-h-[48px] text-sm font-mono text-slate-400 hover:text-primary hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    <span aria-hidden="true">&gt;</span>&nbsp;{t(
                        "nav.contacts",
                    )}
                </a>
            </div>
        </nav>
    {/if}
</header>
