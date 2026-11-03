---
title: "Méthodes de traitement des connexions"
description: "Nginx — Méthodes de traitement des connexions. nginx prend en charge plusieurs méthodes de traitement des connexions. La disponibilité de chacune dépend de la plate-forme. Sur les plates-formes qui en prennent en charge plusieurs, nginx choisit normalement…"
tags: [nginx, guide]
icon: book-open
---

nginx prend en charge plusieurs méthodes de traitement des connexions. La disponibilité de chacune dépend de la plate-forme. Sur les plates-formes qui en prennent en charge plusieurs, nginx choisit normalement automatiquement la plus efficace. Si besoin, on peut toutefois choisir explicitement la méthode avec la directive [[12-directives/use|use]].

Les méthodes de traitement des connexions suivantes sont prises en charge :

- `select` : méthode standard. Le module correspondant est compilé automatiquement sur les plates-formes qui n'ont pas de méthode plus efficace. Les paramètres de configuration `--with-select_module` et `--without-select_module` permettent de forcer ou d'empêcher sa compilation.
- `poll` : méthode standard. Le module correspondant est compilé automatiquement sur les plates-formes qui n'ont pas de méthode plus efficace. Les paramètres de configuration `--with-poll_module` et `--without-poll_module` permettent de forcer ou d'empêcher sa compilation.
- `kqueue` : méthode efficace utilisée sous FreeBSD 4.1+, OpenBSD 2.9+, NetBSD 2.0 et macOS.
- `epoll` : méthode efficace utilisée sous Linux 2.6+.

  > [!NOTE]
  > Les options `EPOLLRDHUP` (Linux 2.6.17, glibc 2.8) et `EPOLLEXCLUSIVE` (Linux 4.5, glibc 2.24) sont prises en charge depuis la version 1.11.3.

  > [!NOTE]
  > Certaines distributions anciennes, comme SuSE 8.2, fournissent des correctifs qui ajoutent la prise en charge d'epoll aux noyaux 2.4.
- `/dev/poll` : méthode efficace utilisée sous Solaris 7 11/99+, HP/UX 11.22+ (eventport), IRIX 6.5.15+ et Tru64 UNIX 5.1A+.
- `eventport` : ports d'événements, méthode utilisée sous Solaris 10+ (en raison de problèmes connus, il est recommandé d'utiliser plutôt la méthode `/dev/poll`).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
