<script lang="ts">
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import Popover from './Popover.svelte';
  import { accountInitials, type AccountIdentity } from './account.js';

  let { account, accountHref, settingsHref, settingsLabel = 'Settings', onSignOut }: {
    account: AccountIdentity;
    accountHref: string;
    settingsHref?: string;
    settingsLabel?: string;
    onSignOut?: () => void;
  } = $props();

  const initials = $derived(accountInitials(account.name));
  const label = $derived(initials ? `${initials}, Account menu` : 'Account menu');
</script>

<Popover {label}>
  {#snippet icon()}<Avatar {account} />{/snippet}
  {#snippet children(close)}
    <div class="suite-account-heading">
      <Avatar {account} large />
      <strong>{account.name}</strong>
      {#if account.email}<span>{account.email}</span>{/if}
    </div>
    <ul class="suite-account-actions" role="list">
      <li><a href={accountHref}><Icon name="account" /> Manage your account</a></li>
      {#if settingsHref}
        <li><a href={settingsHref}><Icon name="settings" /> {settingsLabel}</a></li>
      {/if}
      {#if onSignOut}
        <li>
          <button type="button" onclick={() => { close(); onSignOut?.(); }}>
            <Icon name="sign-out" /> Sign out
          </button>
        </li>
      {/if}
    </ul>
  {/snippet}
</Popover>
