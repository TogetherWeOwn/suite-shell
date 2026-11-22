import { type AccountIdentity } from './account.js';
type $$ComponentProps = {
    account: AccountIdentity;
    accountHref: string;
    settingsHref?: string;
    settingsLabel?: string;
    onSignOut?: () => void;
};
declare const AccountMenu: import("svelte").Component<$$ComponentProps, {}, "">;
type AccountMenu = ReturnType<typeof AccountMenu>;
export default AccountMenu;
