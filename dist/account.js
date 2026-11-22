const graphemes = new Intl.Segmenter();
export function accountInitials(name) {
    return name.trim().split(/\s+/u).filter(Boolean).slice(0, 2)
        .map((word) => graphemes.segment(word)[Symbol.iterator]().next().value?.segment.toUpperCase()).join('');
}
