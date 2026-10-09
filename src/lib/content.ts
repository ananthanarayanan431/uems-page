import { getEntry } from 'astro:content';
import type { CollectionEntry, CollectionKey } from 'astro:content';

/** Load one content file (src/content/<name>.json), validated against its schema. */
export async function content<K extends CollectionKey>(name: K): Promise<CollectionEntry<K>['data']> {
  const entry = await getEntry(name as any, name as any);
  if (!entry) throw new Error(`Missing content file: src/content/${name}.json`);
  return entry.data as CollectionEntry<K>['data'];
}

export type RichPart = { text: string; em: boolean };

/**
 * Splits "Plain *emphasised* plain" into parts. Components render the parts
 * themselves (not via set:html) so scoped styles still apply to the <em>.
 */
export function rich(s: string): RichPart[] {
  return s
    .split(/\*([^*]+)\*/)
    .map((text, i) => ({ text, em: i % 2 === 1 }))
    .filter((p) => p.text !== '');
}

/** Replaces {offices} with the office list from site.json. */
export function fill(s: string, site: { offices: string[] }): string {
  return s.replaceAll('{offices}', site.offices.join(' · '));
}
