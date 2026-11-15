<script lang="ts">
    import { t } from "$lib/i18n";
    import LanguageSwitcher from "./LanguageSwitcher.svelte";
    import { availableLocales } from "$lib/stores/locale.svelte";
    import { slide } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { onDestroy, tick } from "svelte";
    import { afterNavigate } from "$app/navigation";

    type DropdownType = "products" | "services";

    let mobileMenuOpen = $state(false);
    let productsDropdownOpen = $state(false);
    let servicesDropdownOpen = $state(false);
    let mobileServicesOpen = $state(false);
    let closeTimer: ReturnType<typeof setTimeout> | undefined;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function closeMobileMenu() {
        mobileMenuOpen = false;
    }

    // The disclosure always starts collapsed: however the menu closes
    // (hamburger, item click) and on every navigation, including back/forward.
    $effect(() => {
        if (!mobileMenuOpen) mobileServicesOpen = false;
    });

    afterNavigate(() => {
        mobileServicesOpen = false;
    });

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
            if (!isDropdownOpen(dropdownType)) return;
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
    class="site-header sticky top-0 z-40 w-full backdrop-blur-sm"
>
    <div class="site-header__container max-w-7xl mx-auto">
        <div class="site-header__inner flex items-center justify-between">
            <!-- Logo -->
            <a
                href="/"
                class="site-logo flex items-center group"
                onclick={closeMobileMenu}
            >
                <div
                    class="flex items-center justify-center border border-primary group-hover:bg-primary transition-colors"
                >
                    <img
                        src="/webdeploy-icon.png"
                        alt="WEBDEPLOY"
                        width="48"
                        height="48"
                        class="block h-12 w-12"
                    />
                </div>
            </a>

            <!-- Desktop Navigation -->
            <nav class="site-nav hidden xl:flex" aria-label={t("nav.mainNavigation")}>
                <!-- Products Dropdown -->
                <div
                    role="presentation"
                    class="relative dropdown-container"
                    onpointerenter={(e) =>
                        handleDropdownPointerEnter(e, "products")}
                    onpointerleave={handleDropdownPointerLeave}
                    onfocusout={closeDropdownsOnFocusOut}
                >
                    <button
                        class="transition-all flex items-center gap-1"
                        aria-expanded={productsDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="products-menu"
                        onclick={() => toggleDropdown("products")}
                        onkeydown={(e) => handleDropdownKeydown(e, "products")}
                    >
                        {t("nav.products")}
                        <span
                            class="pixel-icon pixel-icon-chevron-down"
                            aria-hidden="true"
                        ></span>
                    </button>
                    <div
                        id="products-menu"
                        role="menu"
                        aria-label={t("nav.productsSubmenu")}
                        class="dropdown-menu absolute top-full left-0 mt-2 bg-surface-dark min-w-[200px] transition-[opacity,transform] duration-200 origin-top ease-out-quint {productsDropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'}"
                    >
                        <a
                            href="/totem"
                            role="menuitem"
                            class="block px-4 py-3 hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.kiosk")}
                        </a>
                    </div>
                </div>

                <a
                    href="/news"
                    class="hover:underline decoration-2 underline-offset-4 transition-all flex items-center"
                >
                    {t("nav.news")}
                </a>

                <!-- Services Dropdown -->
                <div
                    role="presentation"
                    class="relative dropdown-container"
                    onpointerenter={(e) =>
                        handleDropdownPointerEnter(e, "services")}
                    onpointerleave={handleDropdownPointerLeave}
                    onfocusout={closeDropdownsOnFocusOut}
                >
                    <button
                        class="transition-all flex items-center gap-1"
                        aria-expanded={servicesDropdownOpen}
                        aria-haspopup="true"
                        aria-controls="services-menu"
                        onclick={() => toggleDropdown("services")}
                        onkeydown={(e) => handleDropdownKeydown(e, "services")}
                    >
                        {t("nav.services")}
                        <span
                            class="pixel-icon pixel-icon-chevron-down"
                            aria-hidden="true"
                        ></span>
                    </button>
                    <div
                        id="services-menu"
                        role="menu"
                        aria-label={t("nav.servicesSubmenu")}
                        class="dropdown-menu absolute top-full left-0 mt-2 bg-surface-dark min-w-[250px] transition-[opacity,transform] duration-200 origin-top ease-out-quint {servicesDropdownOpen
                            ? 'opacity-100 visible translate-y-0'
                            : 'opacity-0 invisible -translate-y-2'}"
                    >
                        <a
                            href="https://inwd.org"
                            role="menuitem"
                            class="block px-4 py-3 hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.managedInfra")}
                            <span aria-hidden="true">&nbsp;↗</span>
                        </a>
                        <a
                            href="/services/linux-workstations"
                            role="menuitem"
                            class="block px-4 py-3 hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.linuxMigration")}
                        </a>
                        <a
                            href="/services/backup"
                            role="menuitem"
                            class="block px-4 py-3 hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.backup")}
                        </a>
                        <a
                            href="/services/consulting"
                            role="menuitem"
                            class="block px-4 py-3 hover:bg-primary/10 border-b border-slate-700 min-h-[44px] flex items-center"
                            onclick={closeAllDropdowns}
                            onkeydown={handleMenuItemKeydown}
                        >
                            {t("nav.consulting")}
                        </a>
                    </div>
                </div>

                <a
                    href="/developer-manifesto"
                    class="hover:underline decoration-2 underline-offset-4 transition-all flex items-center"
                >
                    {t("nav.manifesto")}
                </a>

                <a
                    href="/contacts"
                    class="hover:underline decoration-2 underline-offset-4 transition-all flex items-center"
                >
                    {t("nav.contacts")}
                </a>
            </nav>

            <!-- Right side: Language switcher + Mobile menu -->
            <div class="site-header__controls flex items-center">
                {#if availableLocales.length > 1}
                    <LanguageSwitcher />
                {/if}

                <!-- Mobile menu button -->
                <button
                    class="site-menu-toggle header-control xl:hidden"
                    onclick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <span
                        class="pixel-icon {mobileMenuOpen
                            ? 'pixel-icon-close'
                            : 'pixel-icon-menu'}"
                        aria-hidden="true"
                    ></span>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Navigation -->
    {#if mobileMenuOpen}
        <nav
            id="mobile-menu"
            class="site-mobile-nav xl:hidden bg-surface-dark overflow-hidden"
            aria-label={t("nav.mobileNavigation")}
            transition:slide={{ duration: 250, easing: quintOut }}
        >
            <div class="px-4 py-4 space-y-1">
                <a
                    href="/totem"
                    class="block px-4 hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    {t("nav.kiosk")}
                </a>
                <a
                    href="/news"
                    class="block px-4 hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    {t("nav.news")}
                </a>
                <button
                    type="button"
                    class="mobile-nav-trigger block w-full px-4 hover:bg-primary/10 flex items-center justify-between text-left"
                    aria-expanded={mobileServicesOpen}
                    aria-controls="mobile-services-menu"
                    onclick={() => (mobileServicesOpen = !mobileServicesOpen)}
                >
                    {t("nav.services")}
                    <span
                        class="pixel-icon pixel-icon-chevron-down transition-transform {mobileServicesOpen
                            ? 'rotate-180'
                            : ''}"
                        aria-hidden="true"
                    ></span>
                </button>
                <div
                    id="mobile-services-menu"
                    class="mobile-nav-sub space-y-1"
                    hidden={!mobileServicesOpen}
                    role="group"
                    aria-label={t("nav.servicesSubmenu")}
                >
                    <a
                        href="https://inwd.org"
                        class="block px-4 hover:bg-primary/10 flex items-center"
                        onclick={closeMobileMenu}
                    >
                        {t("nav.managedInfra")}
                        <span aria-hidden="true">&nbsp;↗</span>
                    </a>
                    <a
                        href="/services/linux-workstations"
                        class="block px-4 hover:bg-primary/10 flex items-center"
                        onclick={closeMobileMenu}
                    >
                        {t("nav.linuxMigration")}
                    </a>
                    <a
                        href="/services/backup"
                        class="block px-4 hover:bg-primary/10 flex items-center"
                        onclick={closeMobileMenu}
                    >
                        {t("nav.backup")}
                    </a>
                    <a
                        href="/services/consulting"
                        class="block px-4 hover:bg-primary/10 flex items-center"
                        onclick={closeMobileMenu}
                    >
                        {t("nav.consulting")}
                    </a>
                </div>
                <a
                    href="/developer-manifesto"
                    class="block px-4 hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    {t("nav.manifesto")}
                </a>
                <a
                    href="/contacts"
                    class="block px-4 hover:bg-primary/10 flex items-center"
                    onclick={closeMobileMenu}
                >
                    {t("nav.contacts")}
                </a>
            </div>
        </nav>
    {/if}
</header>
