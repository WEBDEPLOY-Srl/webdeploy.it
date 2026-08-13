<script lang="ts">
    import { t, locale } from "$lib/i18n";
    import LanguageSwitcher from "./LanguageSwitcher.svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { onDestroy, tick } from "svelte";

    type DropdownType = "products" | "services";

    let mobileMenuOpen = $state(false);
    let productsDropdownOpen = $state(false);
    let servicesDropdownOpen = $state(false);
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    function openDropdown(dropdownType: DropdownType) {
        clearTimeout(closeTimer);
        productsDropdownOpen = dropdownType === "products";
        servicesDropdownOpen = dropdownType === "services";
    }

    function isDropdownOpen(dropdownType: DropdownType) {
        return dropdownType === "products"
            ? productsDropdownOpen
            : servicesDropdownOpen;
    }

    function toggleDropdown(dropdownType: DropdownType) {
        if (isDropdownOpen(dropdownType)) {
            closeAllDropdowns();
        } else {
            openDropdown(dropdownType);
        }
    }

    function closeAllDropdowns() {
        clearTimeout(closeTimer);
        productsDropdownOpen = false;
        servicesDropdownOpen = false;
    }

    // Grace period so a pointer that clips a corner or a sub-pixel edge on its
    // way to the submenu doesn't dismiss it; re-entering the container cancels.
    function scheduleCloseDropdowns() {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAllDropdowns, 150);
    }

    // A tap also emits the compatibility hover events, which would open the
    // submenu just for the click that follows to toggle it straight back shut.
    // Touch opens on click only.
    function handleDropdownPointerEnter(
        event: PointerEvent,
        dropdownType: DropdownType,
    ) {
        if (event.pointerType !== "touch") {
            openDropdown(dropdownType);
        }
    }

    function handleDropdownPointerLeave(event: PointerEvent) {
        if (event.pointerType !== "touch") {
            scheduleCloseDropdowns();
        }
    }

    function closeDropdownsOnFocusOut(event: FocusEvent) {
        const container = event.currentTarget as HTMLElement;
        if (!container.contains(event.relatedTarget as Node | null)) {
            closeAllDropdowns();
        }
    }

    function dropdownContainerOf(element: HTMLElement | null) {
        return element?.closest(".dropdown-container") ?? null;
    }

    // Without hover there is nothing to dismiss an open submenu, so a pointer
    // press anywhere outside the dropdowns has to.
    $effect(() => {
        if (!productsDropdownOpen && !servicesDropdownOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!dropdownContainerOf(event.target as HTMLElement)) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    });

    onDestroy(() => clearTimeout(closeTimer));

    async function handleDropdownKeydown(
        event: KeyboardEvent,
        dropdownType: DropdownType,
    ) {
        const trigger = event.currentTarget as HTMLElement;

        if (event.key === "Escape") {
            closeAllDropdowns();
            trigger.focus();
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            openDropdown(dropdownType);
            // The menu is `visibility: hidden` until the state lands, and a
            // hidden element cannot take focus.
            await tick();
            const firstItem = dropdownContainerOf(trigger)?.querySelector(
                '[role="menuitem"]',
            ) as HTMLElement | null;
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
            const trigger = dropdownContainerOf(
                event.currentTarget as HTMLElement,
            )?.querySelector("button") as HTMLElement | null;
            closeAllDropdowns();
            trigger?.focus();
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
                    onpointerenter={(e) =>
                        handleDropdownPointerEnter(e, "products")}
                    onpointerleave={handleDropdownPointerLeave}
                    onfocusout={closeDropdownsOnFocusOut}
                >
                    <button
                        class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-all flex items-center gap-1 min-h-[44px]"
                        aria-expanded={productsDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="products-menu"
                        onclick={() => toggleDropdown("products")}
                        onkeydown={(e) => handleDropdownKeydown(e, "products")}
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
                        class="dropdown-menu absolute top-full left-0 mt-2 bg-surface-dark border-2 border-primary/30 min-w-[200px] transition-all duration-200 origin-top ease-out-quint {productsDropdownOpen
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
                    onpointerenter={(e) =>
                        handleDropdownPointerEnter(e, "services")}
                    onpointerleave={handleDropdownPointerLeave}
                    onfocusout={closeDropdownsOnFocusOut}
                >
                    <button
                        class="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-all flex items-center gap-1 min-h-[44px]"
                        aria-expanded={servicesDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="services-menu"
                        onclick={() => toggleDropdown("services")}
                        onkeydown={(e) => handleDropdownKeydown(e, "services")}
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
                        class="dropdown-menu absolute top-full left-0 mt-2 bg-surface-dark border-2 border-primary/30 min-w-[250px] transition-all duration-200 origin-top ease-out-quint {servicesDropdownOpen
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
