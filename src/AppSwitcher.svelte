<script lang="ts">
  import Icon from './Icon.svelte';
  import Popover from './Popover.svelte';
  import { defaultRegistry, type SuiteApp } from './registry.js';

  let { apps = defaultRegistry, currentAppId }: {
    apps?: readonly SuiteApp[];
    currentAppId?: string;
  } = $props();

  const columns = 3;
  let list = $state<HTMLUListElement>();

  function move(event: KeyboardEvent, index: number) {
    if (!list || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const rtl = getComputedStyle(list).direction === 'rtl';
    let next: number;
    switch (event.key) {
      case 'ArrowLeft': next = index + (rtl ? 1 : -1); break;
      case 'ArrowRight': next = index + (rtl ? -1 : 1); break;
      case 'ArrowUp': next = index - columns; break;
      case 'ArrowDown': next = index + columns; break;
      case 'Home': next = 0; break;
      case 'End': next = apps.length - 1; break;
      default: return;
    }
    event.preventDefault();
    const horizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    if (next < 0 || next >= apps.length || (horizontal && Math.floor(next / columns) !== Math.floor(index / columns))) return;
    list.querySelectorAll('a')[next]?.focus();
  }
</script>

{#if apps.length}
  <Popover label="Suite apps">
    {#snippet icon()}<Icon name="apps" />{/snippet}
    <nav aria-label="Apps">
      <h2 class="suite-app-heading">Apps</h2>
      <ul class="suite-app-grid" role="list" style:--suite-grid-columns={columns} bind:this={list}>
        {#each apps as app, index (app.id)}
          <li>
            <a href={app.href} aria-current={app.id === currentAppId ? 'page' : undefined}
              onkeydown={(event) => move(event, index)}>
              <span class="suite-app-icon" data-icon={app.icon}><Icon name={app.icon ?? 'app'} /></span>
              <span>{app.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </Popover>
{/if}
