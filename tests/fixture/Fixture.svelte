<script lang="ts">
  import { AccountMenu, AppSwitcher, TopBar, createAppRegistry, defaultRegistry } from 'suite-shell';

  const apps = createAppRegistry([
    ...defaultRegistry.map((app) => app.id === 'drive' ? { ...app, href: 'https://drive.example.com' } : app),
    { id: 'docs', label: 'Docs', href: 'https://docs.example.com', icon: 'docs' },
  ]);
  const query = new URLSearchParams(window.location.search);
  const theme = query.get('theme') ?? undefined;
  const hostTheme = query.get('host-theme');
  if (hostTheme) document.documentElement.dataset.theme = hostTheme;
  const standalone = query.has('standalone');
  const account = { name: 'Example Member', email: 'member@example.com' };
  let navOpen = $state(false);
  let signOutRequested = $state(false);
</script>

<div class="fixture" data-suite-theme={theme}>
  {#if standalone}
    <div class="standalone">
      <AppSwitcher {apps} />
      <AccountMenu {account} accountHref="https://account.example.com" />
    </div>
  {:else}
  <TopBar
    productName="Riaklo Mail"
    productHref="/mail"
    currentAppId="mail"
    {apps}
    {account}
    accountHref="https://account.example.com"
    settingsHref="/settings"
    menuExpanded={navOpen}
    menuControls="side-nav"
    onMenuClick={() => { navOpen = !navOpen; }}
    onSignOut={() => { signOutRequested = true; }}
  >
    {#snippet search()}
      <form role="search">
        <input type="search" aria-label="Search mail" placeholder="Search mail" />
      </form>
    {/snippet}
  </TopBar>
  <nav id="side-nav" aria-label="Mail folders" hidden={!navOpen}><a href="/inbox">Inbox</a></nav>
  {/if}
  <main>
    <h1>Inbox</h1>
    <button type="button">Outside</button>
    <p role="status">{signOutRequested ? 'Sign-out requested' : ''}</p>
  </main>
</div>

<style>
  :global(body) { margin: 0; }
  .fixture {
    min-height: 100vh;
    background: var(--suite-color-bg);
    color: var(--suite-color-ink);
    font-family: var(--suite-font-family);
  }
  .standalone { display: flex; justify-content: space-between; padding: 8px; }
  main { padding: 16px; }
  form { width: 100%; }
  input { width: 100%; }
</style>
