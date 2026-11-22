<script lang="ts">
  import type { AppIcon } from './registry.js';

  let { name }: { name: AppIcon | 'menu' | 'apps' | 'settings' | 'sign-out' | 'app' } = $props();
</script>

<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
  stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  {#if name === 'mail'}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  {:else if name === 'drive'}
    <path d="M8 4h8l6 11-4 5H6l-4-5L8 4Zm0 0 6 11m2-11-6 11m-8 0h20" />
  {:else if name === 'account'}
    <circle cx="12" cy="8" r="3" />
    <path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" />
  {:else if name === 'docs'}
    <path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6" />
  {:else if name === 'sheets'}
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M5 9h14M5 15h14M12 9v12" />
  {:else if name === 'menu'}
    <path d="M4 6h16M4 12h16M4 18h16" />
  {:else if name === 'apps'}
    <path d="M5 5h.01M12 5h.01M19 5h.01M5 12h.01M12 12h.01M19 12h.01M5 19h.01M12 19h.01M19 19h.01" stroke-width="3" />
  {:else if name === 'settings'}
    <path d="m10 3-1 3-3 1-3 1 1 3v2l-1 3 3 1 3 1 1 3h4l1-3 3-1 3-1-1-3v-2l1-3-3-1-3-1-1-3h-4Z" />
    <circle cx="12" cy="12" r="3" />
  {:else if name === 'sign-out'}
    <path d="M10 4H4v16h6m0-8h10m-4-4 4 4-4 4" />
  {:else}
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 4v16M4 8h16" />
  {/if}
</svg>
