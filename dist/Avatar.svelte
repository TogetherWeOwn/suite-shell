<script lang="ts">
  import Icon from './Icon.svelte';
  import { accountInitials, type AccountIdentity } from './account.js';

  let { account, large = false }: { account: AccountIdentity; large?: boolean } = $props();
  let failedSrc = $state<string>();
  const initials = $derived(accountInitials(account.name));
</script>

<span class="suite-avatar" class:suite-avatar-large={large} aria-hidden="true">
  {#if account.avatarUrl && account.avatarUrl !== failedSrc}
    {#key account.avatarUrl}
      <img src={account.avatarUrl} alt="" referrerpolicy="no-referrer"
        onerror={(event) => { failedSrc = event.currentTarget.getAttribute('src') ?? undefined; }} />
    {/key}
  {:else if initials}
    {initials}
  {:else}
    <Icon name="account" />
  {/if}
</span>
