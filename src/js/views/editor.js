// Éditeur Markdown : CodeMirror 6 + aperçu en direct + métadonnées + collage d'images.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { syntaxHighlighting, HighlightStyle, bracketMatching, indentOnInput } from '@codemirror/language';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags as t } from '@lezer/highlight';

import { icon } from '../icons.js';
import { $, debounce, esc, toast } from '../ui.js';
import { stringifyFrontmatter } from '../frontmatter.js';
import { renderMarkdown, wireContent } from '../markdown.js';
import { actions, api, state } from '../state.js';
import { iconPicker } from '../dialogs.js';

const mdHighlight = HighlightStyle.define([
  { tag: t.heading1, fontSize: '1.45em', fontWeight: '750', color: 'var(--text)' },
  { tag: t.heading2, fontSize: '1.28em', fontWeight: '700', color: 'var(--text)' },
  { tag: t.heading3, fontSize: '1.12em', fontWeight: '700', color: 'var(--text)' },
  { tag: [t.heading4, t.heading5, t.heading6], fontWeight: '700', color: 'var(--text)' },
  { tag: t.strong, fontWeight: '700', color: 'var(--text)' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'var(--accent-hi)' },
  { tag: t.url, color: 'var(--hl-attr)', textDecoration: 'underline' },
  { tag: t.monospace, color: 'var(--hl-string)' },
  { tag: t.quote, color: 'var(--text-dim)', fontStyle: 'italic' },
  { tag: [t.processingInstruction, t.meta], color: 'var(--hl-comment)' },
  { tag: t.list, color: 'var(--accent-hi)' },
  { tag: t.contentSeparator, color: 'var(--text-faint)' },
  { tag: t.comment, color: 'var(--hl-comment)' },
]);

const TOOLS = [
  ['heading-2', 'Titre 2', (v) => linePrefix(v, '## ')],
  ['heading-3', 'Titre 3', (v) => linePrefix(v, '### ')],
  '|',
  ['bold', 'Gras (Ctrl+B)', (v) => wrap(v, '**', '**', 'texte')],
  ['italic', 'Italique (Ctrl+I)', (v) => wrap(v, '*', '*', 'texte')],
  ['code', 'Code en ligne', (v) => wrap(v, '`', '`', 'code')],
  ['link', 'Lien (Ctrl+K)', (v) => wrap(v, '[', '](https://)', 'texte')],
  ['link-2', 'Lien wiki [[…]]', (v) => wrap(v, '[[', ']]', 'Titre de la page')],
  '|',
  ['list', 'Liste à puces', (v) => linePrefix(v, '- ')],
  ['list-ordered', 'Liste numérotée', (v) => linePrefix(v, '1. ')],
  ['list-checks', 'Liste de tâches', (v) => linePrefix(v, '- [ ] ')],
  ['quote', 'Citation', (v) => linePrefix(v, '> ')],
  '|',
  ['square-code', 'Bloc de code', (v) => block(v, '```bash\n', '\n```', 'commande')],
  ['table', 'Tableau', (v) => block(v, '| Colonne 1 | Colonne 2 | Colonne 3 |\n| --- | --- | --- |\n| ', ' |  |  |\n', 'valeur')],
  ['info', 'Encadré Note', (v) => block(v, '> [!NOTE]\n> ', '\n', 'Information utile.')],
  ['lightbulb', 'Encadré Astuce', (v) => block(v, '> [!TIP]\n> ', '\n', 'Bonne pratique.')],
  ['triangle-alert', 'Encadré Attention', (v) => block(v, '> [!WARNING]\n> ', '\n', 'Point de vigilance.')],
  ['workflow', 'Diagramme Mermaid', (v) => block(v, '```mermaid\nflowchart LR\n  ', '\n```', 'A[Client] --> B[Serveur]')],
  ['minus', 'Séparateur', (v) => block(v, '\n---\n', '', '')],
];

function wrap(view, before, after, ph) {
  const { from, to } = view.state.selection.main;
  const sel = view.state.sliceDoc(from, to) || ph;
  view.dispatch({
    changes: { from, to, insert: before + sel + after },
    selection: { anchor: from + before.length, head: from + before.length + sel.length },
  });
  view.focus();
  return true;
}

function linePrefix(view, prefix) {
  const { from, to } = view.state.selection.main;
  const changes = [];
  for (let pos = from; pos <= to; ) {
    const line = view.state.doc.lineAt(pos);
    changes.push({ from: line.from, insert: prefix });
    pos = line.to + 1;
  }
  view.dispatch({ changes });
  view.focus();
  return true;
}

function block(view, before, after, ph) {
  const { from, to } = view.state.selection.main;
  const line = view.state.doc.lineAt(from);
  const sel = view.state.sliceDoc(from, to) || ph;
  const lead = line.text.trim() && from === line.to ? '\n\n' : line.text.trim() ? '\n' : '';
  const insert = lead + before + sel + after;
  const start = from + lead.length + before.length;
  view.dispatch({ changes: { from, to, insert }, selection: { anchor: start, head: start + sel.length } });
  view.focus();
  return true;
}

/**
 * Ouvre l'éditeur. `page` : page existante, ou { isNew, folder, title, fm, body } pour une nouvelle.
 */
export function renderEditor(view, page) {
  const fm = { ...(page.fm || {}) };
  const body = (page.body || '').replace(/^(\s*\n)+/, '');
  let iconName = fm.icon || '';
  const mode = state.settings.editorMode || 'split';

  view.innerHTML = `<div class="editor">
    <div class="ed-bar">
      <div class="ed-title">${icon('pencil-line', 17)}<span>${esc(page.isNew ? 'Nouvel article' : page.title)}</span><i class="dirty-dot"></i></div>
      <div class="segmented" id="ed-mode"><span class="thumb"></span>
        <button data-mode="edit">${icon('code', 14)}Source</button>
        <button data-mode="split">${icon('columns-2', 14)}Divisé</button>
        <button data-mode="preview">${icon('eye', 14)}Aperçu</button>
      </div>
      <button class="btn ghost sm" data-ed="cancel">Annuler</button>
      <button class="btn primary sm" data-ed="save">${icon('save', 15)}Enregistrer<kbd style="margin-left:4px;background:transparent;color:inherit;border-color:rgba(255,255,255,.3)">Ctrl S</kbd></button>
    </div>
    <div class="ed-meta">
      <div class="field"><label>Titre</label><input class="input" id="ed-f-title" value="${esc(fm.title || page.title || '')}" placeholder="Titre de l'article"></div>
      <div class="field"><label>Description</label><input class="input" id="ed-f-desc" value="${esc(fm.description || '')}" placeholder="Résumé affiché sous le titre et dans la recherche"></div>
      <div class="field"><label>Étiquettes (séparées par des virgules)</label><input class="input" id="ed-f-tags" value="${esc((page.tags || fm.tags || []).join?.(', ') || '')}" placeholder="dns, linux, sécurité"></div>
      <div class="field"><label>Icône</label><button class="icon-pick" id="ed-f-icon" data-tip="Choisir une icône">${icon(iconName || 'file-text', 18)}</button></div>
    </div>
    <div class="ed-tools" id="ed-tools"></div>
    <div class="ed-panes mode-${mode}" id="ed-panes">
      <div class="ed-source" id="ed-source"></div>
      <div class="ed-preview" id="ed-preview"></div>
    </div>
  </div>`;

  const preview = $('#ed-preview', view);
  const previewPage = page.isNew ? { path: `${page.folder ? page.folder + '/' : ''}_nouveau.md` } : page;
  const updatePreview = () => {
    const { el } = renderMarkdown(cm.state.doc.toString(), previewPage);
    preview.innerHTML = '';
    preview.append(el);
    wireContent(preview);
  };
  const updatePreviewLater = debounce(updatePreview, 180);

  const setDirty = (d) => {
    state.editor.dirty = d;
    $('.dirty-dot', view).classList.toggle('on', d);
  };

  const save = async () => {
    const title = $('#ed-f-title', view).value.trim() || 'Sans titre';
    const tags = $('#ed-f-tags', view)
      .value.split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const data = { ...fm, title, description: $('#ed-f-desc', view).value.trim(), tags, icon: iconName || undefined };
    if (!iconName) delete data.icon;
    const content = stringifyFrontmatter(data, cm.state.doc.toString());
    try {
      let path = page.path;
      if (page.isNew) path = await api.createPage(page.folder || '', title, content);
      else await api.write(page.path, content);
      setDirty(false);
      toast('Article enregistré');
      await actions.reload();
      actions.navigate({ type: 'page', path }, { replace: true, force: true });
    } catch (err) {
      toast(`Échec de l'enregistrement : ${err.message}`, 'error', 5000);
    }
  };

  const cm = new EditorView({
    parent: $('#ed-source', view),
    state: EditorState.create({
      doc: body,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightActiveLine(),
        drawSelection(),
        history(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightSelectionMatches(),
        EditorView.lineWrapping,
        markdown({ base: markdownLanguage }),
        syntaxHighlighting(mdHighlight),
        placeholder('Rédigez en Markdown… (# titres, ```code```, > [!NOTE], [[lien wiki]], ```mermaid)'),
        keymap.of([
          { key: 'Mod-s', run: () => (save(), true), preventDefault: true },
          { key: 'Mod-b', run: (v) => wrap(v, '**', '**', 'texte') },
          { key: 'Mod-i', run: (v) => wrap(v, '*', '*', 'texte') },
          { key: 'Mod-k', run: (v) => wrap(v, '[', '](https://)', 'texte') },
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
          indentWithTab,
        ]),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            setDirty(true);
            updatePreviewLater();
          }
        }),
        EditorView.domEventHandlers({
          paste: (e) => handleFiles(e, e.clipboardData?.files),
          drop: (e) => handleFiles(e, e.dataTransfer?.files),
        }),
      ],
    }),
  });

  async function handleFiles(e, files) {
    const images = [...(files || [])].filter((f) => f.type.startsWith('image/'));
    if (!images.length) return false;
    e.preventDefault();
    if (page.isNew) {
      toast("Enregistrez d'abord l'article pour y coller des images.", 'info', 4000);
      return true;
    }
    for (const f of images) {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const name = f.name && f.name !== 'image.png' ? f.name : `capture-${Date.now()}.png`;
      const rel = await api.saveAsset(page.path, name, bytes);
      const pos = cm.state.selection.main.head;
      cm.dispatch({ changes: { from: pos, insert: `![${name.replace(/\.[^.]+$/, '')}](${rel})\n` } });
    }
    toast(images.length > 1 ? `${images.length} images ajoutées` : 'Image ajoutée');
    return true;
  }

  state.editor = { dirty: false, save, cm };

  // barre d'outils
  const tools = $('#ed-tools', view);
  for (const tool of TOOLS) {
    if (tool === '|') {
      tools.insertAdjacentHTML('beforeend', '<span class="sep"></span>');
      continue;
    }
    const [ic, tip, fn] = tool;
    const b = document.createElement('button');
    b.className = 'icon-btn sm';
    b.dataset.tip = tip;
    b.innerHTML = icon(ic, 16);
    b.onclick = () => fn(cm);
    tools.append(b);
  }
  tools.insertAdjacentHTML(
    'beforeend',
    `<span class="spacer"></span><span style="font-size:12px;color:var(--text-faint)">Collez ou glissez une image pour l'insérer · Ctrl+F pour chercher</span>`
  );

  // métadonnées → état modifié
  ['#ed-f-title', '#ed-f-desc', '#ed-f-tags'].forEach((sel) => $(sel, view).addEventListener('input', () => setDirty(true)));
  $('#ed-f-icon', view).onclick = async () => {
    const chosen = await iconPicker(iconName);
    if (chosen === null) return;
    iconName = chosen;
    $('#ed-f-icon', view).innerHTML = icon(iconName || 'file-text', 18);
    setDirty(true);
  };

  // modes d'affichage
  const seg = $('#ed-mode', view);
  const applyMode = (m) => {
    $('#ed-panes', view).className = `ed-panes mode-${m}`;
    seg.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    const on = seg.querySelector('button.on');
    const thumb = seg.querySelector('.thumb');
    thumb.style.left = on.offsetLeft + 'px';
    thumb.style.width = on.offsetWidth + 'px';
    if (m !== 'edit') updatePreview();
  };
  seg.querySelectorAll('button').forEach((b) => {
    b.onclick = () => {
      actions.saveSettings({ editorMode: b.dataset.mode });
      applyMode(b.dataset.mode);
    };
  });
  requestAnimationFrame(() => applyMode(mode));

  // défilement synchronisé source → aperçu
  cm.scrollDOM.addEventListener(
    'scroll',
    () => {
      const s = cm.scrollDOM;
      const ratio = s.scrollTop / Math.max(1, s.scrollHeight - s.clientHeight);
      preview.scrollTop = ratio * (preview.scrollHeight - preview.clientHeight);
    },
    { passive: true }
  );

  view.querySelector('[data-ed="save"]').onclick = save;
  view.querySelector('[data-ed="cancel"]').onclick = () => actions.back(page.isNew ? null : { type: 'page', path: page.path });

  updatePreview();
  setTimeout(() => (page.isNew ? $('#ed-f-title', view).select() : cm.focus()), 60);
}
