export interface AccountIdentity {
    readonly name: string;
    readonly email?: string;
    readonly avatarUrl?: string;
}
export declare function accountInitials(name: string): string;
