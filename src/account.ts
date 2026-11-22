export interface AccountIdentity {
  readonly name: string;
  readonly email?: string;
  readonly avatarUrl?: string;
}

const graphemes = new Intl.Segmenter();

export function accountInitials(name: string): string {
  return name.trim().split(/\s+/u).filter(Boolean).slice(0, 2)
    .map((word) => graphemes.segment(word)[Symbol.iterator]().next().value?.segment.toUpperCase()).join('');
}
