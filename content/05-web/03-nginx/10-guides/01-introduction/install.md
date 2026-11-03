---
title: "Installer nginx"
description: "Nginx — Installer nginx. nginx s'installe de façon différente selon le système d'exploitation."
tags: [nginx, guide]
icon: book-open
---

nginx s'installe de façon différente selon le système d'exploitation.

## Installation sous Linux

Sous Linux, on peut utiliser les paquets nginx de nginx.org.

## Installation sous FreeBSD

Sous FreeBSD, nginx s'installe soit à partir des [paquets](https://docs.freebsd.org/en/books/handbook/ports/#pkgng-intro), soit avec le système des [ports](https://docs.freebsd.org/en/books/handbook/ports/#ports-using). Les ports offrent plus de souplesse, avec un large choix d'options : le port compile nginx avec les options indiquées et l'installe.

## Compilation à partir des sources

Si une fonction particulière, absente des paquets et des ports, est nécessaire, nginx peut aussi être compilé à partir des sources. Plus souple, cette méthode peut être complexe pour un débutant. Pour plus d'informations, voir [[10-guides/01-introduction/configure|Compiler nginx à partir des sources]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
