// État partagé de l'interface et registre d'actions (rempli par app.js) pour éviter les imports circulaires.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
export const state = {
  settings: {},
  info: {},
  view: { type: 'home' },
  history: [],
  hIndex: -1,
  filter: '',
  editor: null,
  pendingHighlight: null,
};

export const actions = {};

export const api = window.netwiki;
