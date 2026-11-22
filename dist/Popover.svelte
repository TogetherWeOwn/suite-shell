<script lang="ts">
  import { tick, type Snippet } from 'svelte';

  let { label, icon, children }: {
    label: string;
    icon: Snippet;
    children: Snippet<[close: () => void]>;
  } = $props();

  const id = $props.id();
  let open = $state(false);
  let wrapper: HTMLDivElement;
  let trigger: HTMLButtonElement;
  let panel: HTMLDivElement;

  function close(restoreFocus = false) {
    open = false;
    if (restoreFocus) trigger.focus();
  }

  function fitPanel() {
    if (!open || !panel || !trigger) return;
    panel.style.removeProperty('--suite-panel-shift');
    panel.style.removeProperty('--suite-panel-max-height');
    const bounds = panel.getBoundingClientRect();
    const anchor = trigger.getBoundingClientRect();
    const { clientWidth, clientHeight } = document.documentElement;
    const edge = 8;
    const gap = 4;
    const x = bounds.left < edge ? edge - bounds.left : Math.min(0, clientWidth - edge - bounds.right);

    // On short screens, the panel can cover the search row, but must not
    // cover its own trigger. Standalone controls can also open upwards.
    let top = Math.min(bounds.top, Math.max(anchor.bottom + gap, clientHeight - 160));
    let available = clientHeight - edge - top;
    const above = anchor.top - gap - edge;
    if (available < Math.min(96, bounds.height) && above > available) {
      available = Math.min(bounds.height, above);
      top = anchor.top - gap - available;
    }
    panel.style.setProperty('--suite-panel-shift', `${x}px ${top - bounds.top}px`);
    panel.style.setProperty('--suite-panel-max-height', `${Math.max(0, available)}px`);
  }

  async function toggle() {
    if (open) {
      close(true);
      return;
    }
    open = true;
    await tick();
    if (!open) return;
    fitPanel();
    panel.querySelector<HTMLElement>('a[href], button:not(:disabled)')?.focus();
  }

  function dismissOutside(event: PointerEvent | FocusEvent) {
    if (open && !event.composedPath().includes(wrapper)) close();
  }

  function onKeydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape' && !event.defaultPrevented && event.composedPath().includes(wrapper)) {
      event.preventDefault();
      close(true);
    }
  }
</script>

<svelte:window onresize={fitPanel} />
<svelte:document onpointerdown={dismissOutside} onfocusin={dismissOutside} onkeydown={onKeydown} />

<div class="suite-popover" bind:this={wrapper}>
  <button class="suite-icon-button" type="button" aria-label={label}
    aria-expanded={open} aria-controls={id} onclick={toggle} bind:this={trigger}>
    {@render icon()}
  </button>
  <div class="suite-popover-panel" {id} hidden={!open} tabindex="-1" bind:this={panel}>
    {@render children(() => close(true))}
  </div>
</div>
