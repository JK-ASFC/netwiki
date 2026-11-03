---
title: "Installing nginx"
description: "Nginx — Installing nginx. nginx can be installed differently, depending on the operating system."
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

nginx can be installed differently, depending on the operating system.

## Installation on Linux

For Linux, nginx packages from nginx.org can be used.

## Installation on FreeBSD

On FreeBSD, nginx can be installed either from the [packages](https://docs.freebsd.org/en/books/handbook/ports/#pkgng-intro) or through the [ports](https://docs.freebsd.org/en/books/handbook/ports/#ports-using) system. The ports system provides greater flexibility, allowing selection among a wide range of options. The port will compile nginx with the specified options and install it.

## Building from Sources

If some special functionality is required, not available with packages and ports, nginx can also be compiled from source files. While more flexible, this approach may be complex for a beginner. For more information, see [[10-guides/01-introduction/configure|Building nginx from Sources]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
