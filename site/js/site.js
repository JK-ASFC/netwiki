// NetWiki — site de présentation : animations, onglets, démo des commandes, liens de téléchargement.
// Copyright (c) 2026 JK-ASFC — licence MIT.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduit = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REPO = 'JK-ASFC/netwiki';
  document.documentElement.classList.remove('no-js');

  // ------------------------------------------------------------------ navigation
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#burger');
  const links = $('#nav-links');
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  // Section visible → lien actif
  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        navLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${en.target.id}`));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  navLinks.forEach((a) => {
    const s = $(a.getAttribute('href'));
    if (s) spy.observe(s);
  });

  // ------------------------------------------------------------------ apparition au défilement + compteurs
  const countUp = (el) => {
    const target = Number(el.dataset.count.replace(/\D/g, ''));
    if (!target || reduit) return;
    const t0 = performance.now();
    const dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))).toLocaleString('fr-FR').replace(/\u202f/g, ' ');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        en.target.classList.add('seen');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 60}ms`;
    io.observe(el);
  });

  // ------------------------------------------------------------------ accueil : nom tapé et terminal d'arrière-plan
  const name = $('#type-name');
  if (name && !reduit) {
    const MOT = 'NetWiki';
    let k = 0;
    name.innerHTML = '';
    const tape = () => {
      k++;
      name.innerHTML = `${MOT.slice(0, Math.min(k, 3))}<i>${k > 3 ? MOT.slice(3, k) : ''}</i>`;
      if (k < MOT.length) setTimeout(tape, 110 + Math.random() * 70);
    };
    setTimeout(tape, 500);
  }

  const term = $('#term-bg');
  if (term) {
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
    const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    let html = '';
    let i = 0;
    let c = 0;
    const tape = () => {
      const [prompt, cmd] = LIGNES[i % LIGNES.length];
      if (c === 0) html += `<span class="p">${esc(prompt)}</span>`;
      if (c < cmd.length) html += esc(cmd[c++]);
      else {
        html += '\n';
        i++;
        c = 0;
      }
      const lignes = html.split('\n');
      if (lignes.length > 30) html = lignes.slice(-30).join('\n');
      term.innerHTML = html;
      if (!document.hidden) setTimeout(tape, c === 0 ? 160 : 18 + Math.random() * 28);
      else setTimeout(tape, 1000);
    };
    if (reduit) {
      term.innerHTML = LIGNES.map(([p, cmd]) => `<span class="p">${esc(p)}</span>${esc(cmd)}`).join('\n');
    } else tape();
  }

  // Effet de lumière qui suit la souris sur les cartes
  $$('.card').forEach((card) =>
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    })
  );

  // ------------------------------------------------------------------ onglets (exemples, comment ça marche)
  $$('[data-tabs]').forEach((list) => {
    const panels = $(`[data-panels="${list.dataset.tabs}"]`);
    const buttons = $$('button', list);
    const select = (btn, focus) => {
      buttons.forEach((b) => {
        const on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        $(`#${b.dataset.tab}`, panels)?.classList.toggle('on', on);
      });
      if (focus) btn.focus();
      $$('video', panels).forEach((v) => {
        if (v.closest('.on') && !reduit) v.play().catch(() => {});
        else v.pause();
      });
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    buttons.forEach((b, i) => {
      b.setAttribute('aria-controls', b.dataset.tab);
      b.tabIndex = i === 0 ? 0 : -1;
      b.addEventListener('click', () => select(b));
      b.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!d) return;
        e.preventDefault();
        select(buttons[(i + d + buttons.length) % buttons.length], true);
      });
    });
  });

  // ------------------------------------------------------------------ agrandissement des captures
  const lb = $('#lightbox');
  const lbImg = $('img', lb);
  const closeLb = () => {
    lb.hidden = true;
    lbImg.removeAttribute('src');
  };
  document.addEventListener('click', (e) => {
    const img = e.target.closest('.gallery .window img, .card-shot, .window.small img, #hero-window img');
    if (!img) return;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lb.hidden = false;
  });
  lb.addEventListener('click', closeLb);
  addEventListener('keydown', (e) => e.key === 'Escape' && !lb.hidden && closeLb());

  // ------------------------------------------------------------------ démo : correspondance des commandes
  const VENDORS = [
    ['Cisco IOS', 'SW-PARIS(config)#'],
    ['ArubaOS-Switch', 'SW-PARIS(config)#'],
    ['AOS-CX', 'SW-PARIS(config)#'],
    ['HPE Comware', '[SW-PARIS]'],
    ['Huawei VRP', '[SW-PARIS]'],
    ['Juniper Junos', 'admin@SW-PARIS#'],
    ['ALE OmniSwitch (AOS 8)', '->'],
  ];
  const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  /** « `a` ; `b` (note) » → [{ cmd: 'a' }, { cmd: 'b', note: 'note' }] */
  function parseCell(cell) {
    return cell.split(/\s;\s/).map((part) => {
      const codes = [...part.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      const note = part.replace(/`[^`]+`/g, '').replace(/^[\s:,;(]+|[\s:,;)]+$/g, '').replace(/[()]/g, '').trim();
      return { codes, note };
    });
  }

  async function demo() {
    const tasksEl = $('#demo-tasks');
    const out = $('#demo-out');
    if (!tasksEl) return;
    let data;
    try {
      data = await (await fetch('data.json')).json();
    } catch {
      out.innerHTML = '<p class="dim">Démo indisponible.</p>';
      return;
    }
    const show = (t) => {
      out.innerHTML = VENDORS.filter(([v]) => t.cmds[v])
        .map(([v, prompt], n) => {
          const lines = parseCell(t.cmds[v]);
          const text = lines.flatMap((l) => l.codes).join('\n');
          const body = lines
            .map((l) =>
              l.codes.length
                ? l.codes.map((c) => `<span class="p">${escHtml(prompt)} </span>${escHtml(c)}`).join('\n') + (l.note ? `  <span style="color:#6b7394"># ${escHtml(l.note)}</span>` : '')
                : `<span style="color:#6b7394"># ${escHtml(l.note)}</span>`
            )
            .join('\n');
          return `<div class="cmd" style="animation-delay:${n * 45}ms"><div class="cmd-head"><span class="lights"><i></i><i></i><i></i></span>${escHtml(v)}
            ${text ? `<button class="copy" data-copy="${escHtml(text)}">${data.icons.copy}<span>Copier</span></button>` : ''}</div><pre>${body}</pre></div>`;
        })
        .join('');
    };
    data.corr.forEach((t, i) => {
      const b = document.createElement('button');
      b.textContent = t.task;
      b.setAttribute('role', 'option');
      b.addEventListener('click', () => {
        $$('button', tasksEl).forEach((x) => x.setAttribute('aria-selected', String(x === b)));
        show(t);
      });
      tasksEl.append(b);
      if (t.task === 'Créer un VLAN' || (i === 0 && !data.corr.some((x) => x.task === 'Créer un VLAN'))) b.click();
    });
    out.addEventListener('click', async (e) => {
      const btn = e.target.closest('.copy');
      if (!btn) return;
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
      } catch {
        return;
      }
      btn.classList.add('done');
      btn.innerHTML = `${data.icons.check}<span>Copié</span>`;
      setTimeout(() => {
        btn.classList.remove('done');
        btn.innerHTML = `${data.icons.copy}<span>Copier</span>`;
      }, 1600);
    });
  }
  demo();

  // ------------------------------------------------------------------ téléchargements : dernière version publiée sur GitHub
  const ua = navigator.userAgent;
  const os = /Android/i.test(ua) ? 'android' : /iPhone|iPad|iPod/i.test(ua) ? 'ios' : /Mac/i.test(ua) ? 'mac' : /Win/i.test(ua) ? 'windows' : /Linux|X11/i.test(ua) ? 'linux' : '';
  const OS_LABEL = { windows: 'Windows', mac: 'macOS', linux: 'Linux', android: 'Android' };
  $(`.dl[data-os="${os}"]`)?.classList.add('mine');

  const ASSETS = {
    setup: /^NetWiki-Setup-[\d.]+\.exe$/,
    portable: /^NetWiki-portable\.exe$/,
    dmg: /\.dmg$/,
    maczip: /-mac\.zip$/,
    appimage: /\.AppImage$/,
    deb: /\.deb$/,
    apk: /\.apk$/,
    netwiki: /\.netwiki$/,
  };
  const PRIMARY = { windows: 'setup', mac: 'dmg', linux: 'appimage', android: 'apk' };
  const mo = (n) => `${Math.round(n / 1048576)} Mo`;

  async function latestRelease() {
    const KEY = 'netwiki.release';
    try {
      const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (c && Date.now() - c.t < 3600e3) return c.r;
    } catch {}
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!res.ok) throw new Error(String(res.status));
    const r = await res.json();
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), r: { tag_name: r.tag_name, published_at: r.published_at, html_url: r.html_url, assets: r.assets } }));
    } catch {}
    return r;
  }

  latestRelease()
    .then((r) => {
      const v = String(r.tag_name || '').replace(/^v/, '');
      if (v) $$('[data-version]').forEach((el) => (el.textContent = v));
      const found = {};
      for (const [key, re] of Object.entries(ASSETS)) {
        const a = (r.assets || []).find((x) => re.test(x.name));
        if (!a) continue;
        found[key] = a;
        $$(`[data-asset="${key}"]`).forEach((el) => (el.href = a.browser_download_url));
        $$(`[data-size-of="${key}"]`).forEach((el) => (el.textContent = `· ${mo(a.size)}`));
      }
      if (r.html_url) $('#dl-page').href = r.html_url;
      const date = r.published_at ? new Date(r.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
      $('#dl-meta').textContent = `Publiée${date ? ` le ${date}` : ''} · gratuite, sans inscription · fichiers produits par la compilation automatique sur GitHub.`;
      const main = found[PRIMARY[os]];
      if (main) {
        const hero = $('#hero-dl');
        hero.href = main.browser_download_url;
        $('span', hero).textContent = `Télécharger pour ${OS_LABEL[os]}`;
      }
    })
    .catch(() => {
      // Hors ligne ou limite de l'API atteinte : les liens pointent vers la page des versions.
    });
})();
