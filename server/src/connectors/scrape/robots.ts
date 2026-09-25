// Lecture de robots.txt (RFC 9309) : groupe « searchit » s'il existe, sinon « * ».
// La règle la plus longue qui correspond l'emporte ; à longueur égale, Allow gagne.

export interface RobotsRule {
  allow: boolean;
  pattern: string;
  re: RegExp;
}

function toRegExp(pattern: string): RegExp {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
}

/** Règles applicables à l'agent `agent` (en minuscules, ex. « searchit »). */
export function parseRobots(text: string, agent: string): RobotsRule[] {
  const groups = new Map<string, RobotsRule[]>();
  let current: string[] = [];
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, '').trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (!lastWasAgent) current = [];
      current.push(value.toLowerCase());
      for (const a of current) if (!groups.has(a)) groups.set(a, []);
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    // « Disallow: » vide = tout est permis : aucune règle.
    if ((field === 'allow' || field === 'disallow') && current.length && value) {
      for (const a of current) groups.get(a)!.push({ allow: field === 'allow', pattern: value, re: toRegExp(value) });
    }
  }
  const mine = [...groups.keys()].find((a) => a !== '*' && agent.startsWith(a));
  return groups.get(mine ?? '*') ?? [];
}

/** `pathWithQuery` commence par « / » (ex. « /recherche/rtx%205070/ »). */
export function isAllowed(rules: RobotsRule[], pathWithQuery: string): boolean {
  let best: RobotsRule | null = null;
  for (const r of rules) {
    if (!r.re.test(pathWithQuery)) continue;
    if (!best || r.pattern.length > best.pattern.length || (r.pattern.length === best.pattern.length && r.allow)) best = r;
  }
  return best ? best.allow : true;
}
