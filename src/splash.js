// NetWiki — animation de l'écran de démarrage (terminal qui tape « NetWiki »).
// Copyright (c) 2026 JK-ASFC — licence MIT.
(() => {
  const version = new URLSearchParams(location.search).get('v') || '';
  document.getElementById('version').textContent = version ? `Version ${version}` : '';

  // ---- terminal d'arrière-plan
  const LIGNES = [
    ['sw-paris-01#', ' show vlan brief'],
    ['sw-paris-01#', ' show interfaces status'],
    ['fw-paris #', ' diagnose sniffer packet any "port 443" 4'],
    ['admin@pa-paris>', ' show session all'],
    ['root@srv01:~#', ' ss -ltnp'],
    ['PS C:\\>', ' Get-NetIPConfiguration'],
    ['[admin@mikrotik] >', ' /ip route print'],
    ['user@srx>', ' show security flow session'],
    ['*CLI>', ' pjsip show endpoints'],
    ['root@dns01:~#', ' dig @127.0.0.1 netwiki.local'],
    ['$', ' ansible-playbook site.yml --check'],
    ['<HPE>', ' display current-configuration'],
    ['$', ' kubectl get pods -A'],
    ['rtr-lyon#', ' show ip bgp summary'],
    ['$', ' netwiki --open'],
  ];
  const term = document.getElementById('terminal');
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
  let html = '';
  let i = 0;
  let c = 0;
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tapeTerminal() {
    const [prompt, cmd] = LIGNES[i % LIGNES.length];
    if (c === 0) html += `<span class="p">${esc(prompt)}</span>`;
    if (c < cmd.length) {
      html += esc(cmd[c++]);
    } else {
      html += '\n';
      i++;
      c = 0;
    }
    const lignes = html.split('\n');
    if (lignes.length > 24) html = lignes.slice(-24).join('\n');
    term.innerHTML = html;
    setTimeout(tapeTerminal, reduit ? 120 : c === 0 ? 140 : 14 + Math.random() * 22);
  }
  tapeTerminal();

  // ---- titre « NetWiki » tapé lettre par lettre
  const net = document.getElementById('net');
  const wiki = document.getElementById('wiki');
  const MOT = 'NetWiki';
  let k = 0;
  function tapeNom() {
    if (k < MOT.length) {
      k++;
      net.textContent = MOT.slice(0, Math.min(k, 3));
      wiki.textContent = k > 3 ? MOT.slice(3, k) : '';
      setTimeout(tapeNom, reduit ? 40 : 110 + Math.random() * 60);
    } else {
      document.getElementById('slogan').classList.add('on');
    }
  }
  setTimeout(tapeNom, 350);

  // ---- progression indicative
  const ETAPES = ['Chargement des articles…', 'Indexation de la recherche…', 'Coloration syntaxique…', 'Préparation de l’interface…'];
  const barre = document.getElementById('barre');
  const etape = document.getElementById('etape');
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(96, p + 4 + Math.random() * 9);
    barre.style.width = p + '%';
    etape.textContent = ETAPES[Math.min(ETAPES.length - 1, Math.floor((p / 100) * ETAPES.length))];
    if (p >= 96) clearInterval(t);
  }, 160);
})();
