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
    if (!open) return;
    panel.style.removeProperty('--suite-panel-shift');
    const { left, right } = panel.getBoundingClientRect();
    const edge = 8;
    const viewport = document.documentElement.clientWidth;
    const shift = left < edge ? edge - left : Math.min(0, viewport - edge - right);
    if (shift) panel.style.setProperty('--suite-panel-shift', `${shift}px`);
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
  <div class="suite-popover-panel" {id} hidden={!open} bind:this={panel}>
    {@render children(() => close(true))}
  </div>
</div>
