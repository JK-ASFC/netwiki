// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icons } from 'lucide';

const cache = new Map();

const toPascal = (name) => String(name).replace(/(^|[-_ ]+)([a-z0-9])/gi, (_, __, c) => c.toUpperCase());

export function hasIcon(name) {
  return !!name && !!icons[toPascal(name)];
}

/** Renvoie le SVG (chaîne) d'une icône Lucide, ou l'emoji tel quel si `name` n'est pas une icône connue. */
export function icon(name, size = 18, cls = '') {
  const key = `${name}|${size}|${cls}`;
  if (cache.has(key)) return cache.get(key);
  const node = name ? icons[toPascal(name)] : null;
  let out;
  if (node) {
    const inner = node
      .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`)
      .join('');
    out = `<svg class="i ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  } else if (name) {
    out = `<span class="emoji-icon ${cls}" style="font-size:${Math.round(size * 0.95)}px;width:${size}px;height:${size}px">${String(name).replace(/[<>&"]/g, '')}</span>`;
  } else {
    out = icon('file-text', size, cls);
  }
  cache.set(key, out);
  return out;
}

/** Sélection d'icônes proposées dans le sélecteur (toutes les icônes Lucide restent utilisables par leur nom). */
export const ICON_CHOICES = [
  'file-text', 'book-open', 'notebook-pen', 'folder', 'folder-open', 'globe', 'network', 'server', 'server-cog', 'database',
  'hard-drive', 'cpu', 'monitor', 'laptop', 'router', 'wifi', 'cable', 'ethernet-port', 'radio-tower', 'satellite-dish',
  'cloud', 'cloud-cog', 'shield', 'shield-check', 'shield-alert', 'lock', 'key-round', 'fingerprint', 'user', 'users',
  'user-cog', 'building-2', 'landmark', 'activity', 'gauge', 'chart-line', 'bell-ring', 'radar', 'eye', 'search',
  'terminal', 'square-terminal', 'code', 'braces', 'file-code', 'settings', 'settings-2', 'sliders-horizontal', 'wrench', 'hammer',
  'download', 'upload', 'package', 'boxes', 'layers', 'workflow', 'git-branch', 'split', 'merge', 'repeat',
  'refresh-cw', 'history', 'archive', 'save', 'bug', 'life-buoy', 'circle-help', 'info', 'triangle-alert', 'zap',
  'rocket', 'flame', 'sparkles', 'star', 'bookmark', 'tag', 'list-checks', 'clipboard-list', 'calendar', 'clock',
  'mail', 'send', 'message-square', 'phone', 'link', 'map', 'compass', 'layout-dashboard', 'table', 'scale',
];
