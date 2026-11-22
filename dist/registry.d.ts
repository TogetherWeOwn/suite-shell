export type AppIcon = 'mail' | 'drive' | 'account' | 'docs' | 'sheets';
export interface SuiteApp {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly icon?: AppIcon;
}
/** Define the launched apps in display order. Omit apps that are not ready. */
export declare function createAppRegistry(apps: readonly SuiteApp[]): readonly SuiteApp[];
export declare const defaultRegistry: readonly SuiteApp[];
