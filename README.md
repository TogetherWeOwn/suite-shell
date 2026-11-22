# suite-shell

Shared Svelte 5 navigation for the Riaklo suite. The package provides a top bar, an app switcher, an account menu, and the light and dark Kofra console colours. It does not manage sessions or route requests.

## Install

Pin a Git tag rather than tracking `main`. Installing from Git builds the package with its `prepare` script; allow that script for this dependency in your package manager. The package is not published on npm.

```sh
npm install github:TogetherWeOwn/suite-shell#v0.1.0
```

## Use

```svelte
<script lang="ts">
  import { TopBar, createAppRegistry, defaultRegistry } from 'suite-shell';
  import 'suite-shell/styles.css';

  const apps = createAppRegistry(defaultRegistry.map((app) =>
    app.id === 'drive' ? { ...app, href: 'https://drive.example.com' } : app,
  ));
  const account = { name: 'Example Member', email: 'member@example.com' };
  let foldersOpen = $state(false);
</script>

<TopBar
  productName="Riaklo Mail"
  productHref="/inbox"
  currentAppId="mail"
  {apps}
  {account}
  settingsHref="/settings"
  menuControls="folders"
  menuExpanded={foldersOpen}
  onMenuClick={() => { foldersOpen = !foldersOpen; }}
>
  {#snippet search()}
    <form role="search" action="/search">
      <input type="search" name="q" aria-label="Search mail" placeholder="Search mail" />
    </form>
  {/snippet}
</TopBar>
<nav id="folders" aria-label="Mail folders" hidden={!foldersOpen}><a href="/inbox">Inbox</a></nav>
```

- Use `createAppRegistry` with trusted app configuration. It checks for unique IDs and absolute HTTPS links without credentials. The default includes Mail, Drive, and Account; add Docs or Sheets only when they have destinations. Pass an empty registry to hide the switcher.
- The switcher uses real links: arrows move within the three-column grid, Home and End jump to the first and last apps, and Tab and Enter work as usual. Escape closes a panel and returns focus to its trigger.
- Provide `accountHref` to override the Account registry link. Wire `onSignOut` to the host application's actual sign-out flow; absent a callback, no sign-out action is rendered. Pass `avatarUrl` on the account object to use an image instead of initials. Component URL props should come from trusted configuration.
- The `AppSwitcher` and `AccountMenu` exports can also be used separately. `AccountMenu` requires `account` and `accountHref`.
- The shell follows the system theme by default. Add `data-suite-theme="light"` or `data-suite-theme="dark"` to an ancestor to override it. Import `suite-shell/tokens.css` instead if you only need the `--suite-color-*` variables. The design uses IBM Plex Sans when the host app supplies it, with a system fallback.

## Develop

```sh
npm ci --ignore-scripts
npm run lint
npm run typecheck
npm exec -- playwright install chromium
npm test
npm run build
```

Use Node.js 24 for development. The browser tests exercise keyboard and pointer interactions and fail on serious or critical axe findings in light and dark mode. The styles use `light-dark()`, supported in current Chromium, Firefox, and Safari.

MIT; see [LICENSE](LICENSE).
