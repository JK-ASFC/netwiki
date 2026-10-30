// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from './icons.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

export function normalize(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

const DATE_FMT = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
const RTF = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });

export function formatDate(ms) {
  return ms ? DATE_FMT.format(new Date(ms)) : '';
}

export function relativeTime(ms) {
  if (!ms) return '';
  const diff = (ms - Date.now()) / 1000;
  const steps = [
    [60, 'second'],
    [3600, 'minute'],
    [86400, 'hour'],
    [604800, 'day'],
    [2629800, 'week'],
    [31557600, 'month'],
    [Infinity, 'year'],
  ];
  const div = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800, month: 2629800, year: 31557600 };
  for (const [limit, unit] of steps) {
    if (Math.abs(diff) < limit) return RTF.format(Math.round(diff / div[unit]), unit);
  }
  return formatDate(ms);
}

// ---------------------------------------------------------------- notifications

export function toast(message, type = 'success', ms = 2800) {
  const ico = { success: 'circle-check', error: 'circle-x', info: 'info' }[type] || 'info';
  const el = h(`<div class="toast ${type}">${icon(ico, 18)}<span>${esc(message)}</span></div>`);
  $('#toasts').append(el);
  setTimeout(() => {
    el.classList.add('out');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }, ms);
}

// ---------------------------------------------------------------- modales

function closeBackdrop(bd) {
  return new Promise((res) => {
    bd.classList.add('closing');
    setTimeout(() => {
      bd.remove();
      res();
    }, 150);
  });
}

/**
 * Ouvre une modale. `actions` : [{ label, kind: 'primary'|'danger'|'ghost', value }]
 * `value` peut être une fonction : son résultat est renvoyé ; si elle renvoie `false`, la modale reste ouverte.
 */
export function modal({ title, body = '', actions = [{ label: 'Fermer', kind: 'primary', value: true }], width = 520, onMount }) {
  return new Promise((resolve) => {
    const bd = h(`<div class="backdrop center"><div class="modal" style="width:${width}px" role="dialog" aria-modal="true">
      <div class="modal-head"><h3>${esc(title)}</h3><button class="icon-btn sm" data-x>${icon('x', 16)}</button></div>
      <div class="modal-body"></div><div class="modal-foot"></div></div></div>`);
    const mBody = $('.modal-body', bd);
    if (typeof body === 'string') mBody.innerHTML = body;
    else mBody.append(body);
    const foot = $('.modal-foot', bd);
    let done = false;
    const finish = async (v) => {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', onKey, true);
      await closeBackdrop(bd);
      resolve(v);
    };
    const run = async (a) => {
      const v = typeof a.value === 'function' ? await a.value(mBody) : a.value;
      if (v === false) return;
      finish(v);
    };
    actions.forEach((a) => {
      const b = h(`<button class="btn ${a.kind || ''}">${a.icon ? icon(a.icon, 16) : ''}${esc(a.label)}</button>`);
      b.onclick = () => run(a);
      foot.append(b);
    });
    if (!actions.length) foot.remove();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        finish(null);
      } else if (e.key === 'Enter' && !e.shiftKey && e.target.tagName !== 'TEXTAREA') {
        const primary = actions.find((a) => a.kind === 'primary' || a.kind === 'danger');
        if (primary) {
          e.preventDefault();
          e.stopPropagation();
          run(primary);
        }
      }
    };
    document.addEventListener('keydown', onKey, true);
    $('[data-x]', bd).onclick = () => finish(null);
    bd.addEventListener('mousedown', (e) => {
      if (e.target === bd) finish(null);
    });
    $('#overlays').append(bd);
    onMount?.(mBody, finish);
    setTimeout(() => $('input, select, textarea', mBody)?.focus(), 30);
  });
}

/** `message` est du HTML déjà échappé par l'appelant ; `html: true` l'insère tel quel (sans paragraphe englobant). */
export function confirmDialog(title, message, { danger = false, ok = 'Confirmer', cancel = 'Annuler', html = false } = {}) {
  return modal({
    title,
    body: html ? message : `<p>${message}</p>`,
    width: html ? 520 : 440,
    actions: [
      { label: cancel, kind: 'ghost', value: null },
      { label: ok, kind: danger ? 'danger' : 'primary', value: true },
    ],
  }).then((v) => v === true);
}

export function promptDialog(title, { label = '', value = '', placeholder = '', ok = 'Valider' } = {}) {
  return modal({
    title,
    width: 460,
    body: `<div class="field"><label>${esc(label)}</label><input class="input" value="${esc(value)}" placeholder="${esc(placeholder)}"></div>`,
    actions: [
      { label: 'Annuler', kind: 'ghost', value: null },
      {
        label: ok,
        kind: 'primary',
        value: (b) => {
          const v = $('input', b).value.trim();
          return v || false;
        },
      },
    ],
    onMount: (b) => $('input', b).select(),
  });
}

// ---------------------------------------------------------------- menu contextuel

let openMenu = null;

export function closeContextMenu() {
  openMenu?.remove();
  openMenu = null;
}

/** items : [{ label, icon, action, danger, kbd } | '-'] */
export function contextMenu(x, y, items) {
  closeContextMenu();
  const m = h('<div class="ctxmenu" role="menu"></div>');
  for (const it of items) {
    if (it === '-') {
      m.append(document.createElement('hr'));
      continue;
    }
    const b = h(
      `<button class="${it.danger ? 'danger' : ''}">${icon(it.icon || 'dot', 15)}<span>${esc(it.label)}</span>${it.kbd ? `<kbd>${esc(it.kbd)}</kbd>` : ''}</button>`
    );
    b.onclick = () => {
      closeContextMenu();
      it.action();
    };
    m.append(b);
  }
  document.body.append(m);
  const r = m.getBoundingClientRect();
  m.style.left = Math.min(x, innerWidth - r.width - 8) + 'px';
  m.style.top = Math.min(y, innerHeight - r.height - 8) + 'px';
  openMenu = m;
}

document.addEventListener('mousedown', (e) => {
  if (openMenu && !openMenu.contains(e.target)) closeContextMenu();
});
window.addEventListener('blur', closeContextMenu);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContextMenu();
});

// ---------------------------------------------------------------- infobulles (data-tip)

let tipEl = null;
let tipTimer = null;
document.addEventListener('mouseover', (e) => {
  const t = e.target.closest?.('[data-tip]');
  clearTimeout(tipTimer);
  tipEl?.remove();
  tipEl = null;
  if (!t) return;
  tipTimer = setTimeout(() => {
    tipEl = h(`<div class="tooltip">${esc(t.dataset.tip)}</div>`);
    document.body.append(tipEl);
    const r = t.getBoundingClientRect();
    const tr = tipEl.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(8, Math.min(left, innerWidth - tr.width - 8));
    const top = r.bottom + 8 + tr.height > innerHeight ? r.top - tr.height - 8 : r.bottom + 8;
    tipEl.style.left = left + 'px';
    tipEl.style.top = top + 'px';
  }, 50);
});
document.addEventListener('mousedown', () => {
  clearTimeout(tipTimer);
  tipEl?.remove();
  tipEl = null;
});

// ---------------------------------------------------------------- effet « projecteur » sur les cartes

document.addEventListener('pointermove', (e) => {
  const card = e.target.closest?.('.card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
});
