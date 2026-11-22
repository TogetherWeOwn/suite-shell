import { type Snippet } from 'svelte';
type $$ComponentProps = {
    label: string;
    icon: Snippet;
    children: Snippet<[close: () => void]>;
};
declare const Popover: import("svelte").Component<$$ComponentProps, {}, "">;
type Popover = ReturnType<typeof Popover>;
export default Popover;
