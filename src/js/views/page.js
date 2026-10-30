// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { icon } from '../icons.js';
import { esc, formatDate, relativeTime } from '../ui.js';
import { iconOf, siblingsOf, tintOf } from '../store.js';
import { highlightTerms, renderMarkdown, wireContent } from '../markdown.js';
import { state } from '../state.js';
import { crumbsHtml } from './folder.js';

let spyCleanup = null;

export function renderPage(view, page, { anchor, terms } = {}) {
  spyCleanup?.();
  const tint = tintOf(page);
  const words = (page.body.match(/\S+/g) || []).length;
  const minutes = Math.max(1, Math.round(words / 220));
  const fav = (state.settings.favorites || []).includes(page.path);
  const { prev, next } = siblingsOf(page);
  const { el, toc } = renderMarkdown(page.body.replace(/^\s*#\s+.+\n/, ''), page);
  const showToc = state.settings.showToc !== false && toc.length > 1;

  view.innerHTML = `<div class="page-wrap ${showToc ? '' : 'no-toc'}">
    <article class="page ${state.settings.readingWidth === 'wide' ? 'reading-wide' : ''}" style="${tint ? `--tint:${tint}` : ''}">
      ${crumbsHtml(page)}
      <header class="page-head">
        <div class="page-head-top">
          <div class="page-icon">${icon(iconOf(page), 26)}</div>
          <div class="page-title"><h1>${esc(page.title)}</h1>${page.description ? `<p class="desc">${esc(page.description)}</p>` : ''}</div>
          <div class="page-actions">
            <button class="icon-btn ${fav ? 'active' : ''}" data-act="fav" data-tip="${fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">${icon('star', 18)}</button>
            <button class="btn sm" data-act="edit">${icon('pencil', 15)}Modifier</button>
            <button class="icon-btn" data-act="more" data-tip="Plus d'actions">${icon('ellipsis', 18)}</button>
          </div>
        </div>
        <div class="page-meta">
          <span data-tip="${esc(formatDate(page.mtime))}">${icon('clock', 14)}Modifié ${esc(relativeTime(page.mtime))}</span>
          <span>${icon('book-open', 14)}${minutes} min de lecture</span>
          <span>${icon('text', 14)}${words.toLocaleString('fr-FR')} mots</span>
          ${page.tags.length ? `<div class="tags">${page.tags.map((t) => `<span class="tag" data-tag="${esc(t)}">${icon('hash', 11)}${esc(t)}</span>`).join('')}</div>` : ''}
        </div>
      </header>
      <div class="page-body"></div>
      <nav class="page-nav">
        ${prev ? `<a data-page="${esc(prev.path)}"><small>${icon('arrow-left', 13)}Précédent</small><b>${esc(prev.title)}</b></a>` : ''}
        ${next ? `<a class="next" data-page="${esc(next.path)}"><small>Suivant${icon('arrow-right', 13)}</small><b>${esc(next.title)}</b></a>` : ''}
      </nav>
    </article>
    ${
      showToc
        ? `<aside class="toc"><div class="toc-title">${icon('list', 13)}Sur cette page</div><ul><span class="toc-ind"></span>${toc
            .map((t) => `<li class="l${t.level}"><a data-anchor="${esc(t.id)}">${esc(t.text)}</a></li>`)
            .join('')}</ul></aside>`
        : ''
    }
  </div>`;

  const body = view.querySelector('.page-body');
  body.append(el);
  wireContent(body);

  if (showToc) spyCleanup = scrollSpy(view, toc);

  if (terms?.length) {
    const hits = highlightTerms(el, terms);
    if (hits[0] && !anchor) {
      hits[0].classList.add('current');
      requestAnimationFrame(() => hits[0].scrollIntoView({ block: 'center', behavior: 'instant' }));
    }
  }
  if (anchor) requestAnimationFrame(() => scrollToAnchor(view, anchor, 'instant'));
}

export function scrollToAnchor(view, id, behavior = 'smooth') {
  const target = view.querySelector(`#${CSS.escape(id)}`);
  if (!target) return;
  const top = target.getBoundingClientRect().top - view.getBoundingClientRect().top + view.scrollTop - 16;
  view.scrollTo({ top, behavior });
}

function scrollSpy(view, toc) {
  const items = [...view.querySelectorAll('.toc li')];
  const ind = view.querySelector('.toc-ind');
  const heads = toc.map((t) => view.querySelector(`#${CSS.escape(t.id)}`));
  let current = -1;
  const update = () => {
    const limit = view.getBoundingClientRect().top + 120;
    let idx = 0;
    heads.forEach((hd, i) => {
      if (hd && hd.getBoundingClientRect().top <= limit) idx = i;
    });
    if (view.scrollTop + view.clientHeight >= view.scrollHeight - 4) idx = heads.length - 1;
    if (idx === current) return;
    current = idx;
    items.forEach((li, i) => li.classList.toggle('on', i === idx));
    const li = items[idx];
    if (li && ind) {
      ind.style.top = li.offsetTop + 'px';
      ind.style.height = li.offsetHeight + 'px';
      li.scrollIntoView({ block: 'nearest' });
    }
  };
  view.addEventListener('scroll', update, { passive: true });
  requestAnimationFrame(update);
  return () => view.removeEventListener('scroll', update);
}
