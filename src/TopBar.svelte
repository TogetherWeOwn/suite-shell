<script lang="ts">
  import type { Snippet } from 'svelte';
  import AccountMenu from './AccountMenu.svelte';
  import AppSwitcher from './AppSwitcher.svelte';
  import Icon from './Icon.svelte';
  import { defaultRegistry, type AppIcon, type SuiteApp } from './registry.js';
  import type { AccountIdentity } from './account.js';

  let {
    productName, productHref, productIcon, currentAppId, apps = defaultRegistry,
    search, account, accountHref, settingsHref, settingsLabel,
    onMenuClick, menuExpanded, menuControls, onSignOut,
  }: {
    productName: string;
    productHref: string;
    productIcon?: AppIcon;
    currentAppId?: string;
    apps?: readonly SuiteApp[];
    search?: Snippet;
    account?: AccountIdentity;
    accountHref?: string;
    settingsHref?: string;
    settingsLabel?: string;
    onMenuClick?: () => void;
    menuExpanded?: boolean;
    menuControls?: string;
    onSignOut?: () => void;
  } = $props();

  const defaultAccountHref = defaultRegistry.find((app) => app.id === 'account')!.href;
  let currentIcon = $derived<AppIcon | 'app'>(productIcon ?? apps.find((app) => app.id === currentAppId)?.icon ?? 'app');
  let manageHref = $derived(accountHref ?? apps.find((app) => app.id === 'account')?.href ?? defaultAccountHref);
</script>

<header class="suite-top-bar">
  <div class="suite-top-leading">
    {#if onMenuClick}
      <button class="suite-icon-button" type="button" aria-label="Navigation menu"
        aria-expanded={menuExpanded} aria-controls={menuControls} onclick={onMenuClick}>
        <Icon name="menu" />
      </button>
    {/if}
    <a class="suite-product" href={productHref}>
      <span class="suite-product-icon"><Icon name={currentIcon} /></span>
      <span>{productName}</span>
    </a>
  </div>
  {#if search}
    <div class="suite-search">{@render search()}</div>
  {/if}
  <div class="suite-top-actions">
    {#if settingsHref}
      <a class="suite-icon-button" href={settingsHref} aria-label="Settings"><Icon name="settings" /></a>
    {/if}
    <AppSwitcher {apps} {currentAppId} />
    {#if account}
      <AccountMenu {account} accountHref={manageHref} {settingsHref} {settingsLabel} {onSignOut} />
    {/if}
  </div>
</header>
