// En-tête YAML minimal (sous-ensemble) : `clé: valeur`, `clé: [a, b]` et listes `- élément`.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;

function unquote(v) {
  v = v.trim();
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try {
      return JSON.parse(v);
    } catch {
      return v.slice(1, -1);
    }
  }
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) return v.slice(1, -1).replace(/''/g, "'");
  return v;
}

function splitList(inner) {
  const out = [];
  let cur = '';
  let quote = null;
  for (const ch of inner) {
    if (quote) {
      cur += ch;
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      cur += ch;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out.map(unquote).filter((s) => s !== '');
}

function coerce(v) {
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return v;
}

export function parseFrontmatter(raw) {
  const m = FM_RE.exec(raw);
  if (!m) return { data: {}, body: raw };
  const data = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = /^\s+-\s+(.*)$|^-\s+(.*)$/.exec(line);
    if (item && listKey) {
      data[listKey].push(unquote(item[1] ?? item[2]));
      continue;
    }
    const kv = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value.trim() === '') {
      data[key] = [];
      listKey = key;
      continue;
    }
    listKey = null;
    const v = value.trim();
    data[key] = v.startsWith('[') && v.endsWith(']') ? splitList(v.slice(1, -1)) : coerce(unquote(v));
  }
  return { data, body: raw.slice(m[0].length) };
}

function quote(v, inList = false) {
  const s = String(v);
  if (s === '' || /^[\s\[\]{}"'#&*!|>%@`-]|\s$|: | #/.test(s) || (inList && /,/.test(s)) || /^(true|false|-?\d+(\.\d+)?)$/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

export function stringifyFrontmatter(data, body) {
  const lines = [];
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    if (Array.isArray(v)) lines.push(`${k}: [${v.map((x) => quote(x, true)).join(', ')}]`);
    else if (typeof v === 'number' || typeof v === 'boolean') lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${quote(v)}`);
  }
  const cleanBody = body.replace(/^\s*\n/, '');
  return lines.length ? `---\n${lines.join('\n')}\n---\n\n${cleanBody}` : cleanBody;
}
