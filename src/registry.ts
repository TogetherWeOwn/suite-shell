export type AppIcon = 'mail' | 'drive' | 'account' | 'docs' | 'sheets';

export interface SuiteApp {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon?: AppIcon;
}

/** Define the launched apps in display order. Omit apps that are not ready. */
export function createAppRegistry(apps: readonly SuiteApp[]): readonly SuiteApp[] {
  const ids = new Set<string>();
  return Object.freeze(apps.map((app) => {
    if (!app.id.trim() || !app.label.trim()) throw new Error('App ID and label must not be blank');
    if (ids.has(app.id)) throw new Error(`Duplicate app ID: ${app.id}`);
    ids.add(app.id);
    // Validate the href as it will appear in a document, not just as a
    // standalone URL (the browser resolves `https:example.com` against base).
    const url = /^https:\/\/[^/\\]/i.test(app.href) && URL.canParse(app.href) ? new URL(app.href) : null;
    if (!url || url.protocol !== 'https:' || url.username || url.password) {
      throw new Error('App URL must be an absolute HTTPS URL without credentials');
    }
    return Object.freeze({ ...app });
  }));
}

export const defaultRegistry = createAppRegistry([
  { id: 'mail', label: 'Mail', href: 'https://mail.riaklo.com', icon: 'mail' },
  { id: 'drive', label: 'Drive', href: 'https://drive.riaklo.com', icon: 'drive' },
  { id: 'account', label: 'Account', href: 'https://account.riaklo.com', icon: 'account' },
]);
