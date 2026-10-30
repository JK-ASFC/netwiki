// Pont sécurisé entre le renderer et le processus principal.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
const { contextBridge, ipcRenderer } = require('electron');

const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args);

contextBridge.exposeInMainWorld('netwiki', {
  platform: process.platform,
  info: () => invoke('app:info'),
  getSettings: () => invoke('settings:get'),
  setSettings: (patch) => invoke('settings:set', patch),
  setTitleBar: (colors) => invoke('win:titlebar', colors),

  load: () => invoke('wiki:load'),
  write: (rel, content) => invoke('wiki:write', rel, content),
  createPage: (folderRel, title, content) => invoke('wiki:create-page', folderRel, title, content),
  createFolder: (parentRel, meta) => invoke('wiki:create-folder', parentRel, meta),
  setFolderMeta: (rel, meta) => invoke('wiki:folder-meta', rel, meta),
  move: (rel, targetFolderRel) => invoke('wiki:move', rel, targetFolderRel),
  duplicate: (rel) => invoke('wiki:duplicate', rel),
  remove: (rel) => invoke('wiki:delete', rel),
  saveAsset: (pageRel, fileName, bytes) => invoke('wiki:save-asset', pageRel, fileName, bytes),
  reveal: (rel) => invoke('wiki:reveal', rel),
  openDataDir: () => invoke('wiki:open-data-dir'),
  chooseDataDir: () => invoke('wiki:choose-data-dir'),
  resetDataDir: () => invoke('wiki:reset-data-dir'),
  restoreSeeds: () => invoke('wiki:restore-seeds'),
  exportPdf: (title) => invoke('wiki:export-pdf', title),
  openExternal: (url) => invoke('shell:open-external', url),

  exportPack: () => invoke('pack:export'),
  choosePack: () => invoke('pack:choose'),
  applyPack: (token) => invoke('pack:apply', token),
  checkUpdates: () => invoke('updates:check'),
  downloadPack: (url) => invoke('updates:download-pack', url),
  openReleasePage: (url) => invoke('updates:open-page', url),

  onChanged: (cb) => ipcRenderer.on('wiki:changed', () => cb()),
});
