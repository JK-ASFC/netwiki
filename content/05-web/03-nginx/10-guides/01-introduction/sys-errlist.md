---
title: "Un message « ‘sys_errlist’ is deprecated; use ‘strerror’ or ‘strerror_r’ instead »"
description: "Nginx — Un message « ‘sys_errlist’ is deprecated; use ‘strerror’ or ‘strerror_r’ instead ». Q : Lors de la compilation de nginx 0.7.66, 0.8.35 ou supérieur sous Linux, les avertissements suivants apparaissent :"
tags: [nginx, guide]
icon: book-open
---

Q : Lors de la compilation de nginx 0.7.66, 0.8.35 ou supérieur sous Linux, les avertissements suivants apparaissent :

```c
warning: `sys_errlist' is deprecated;
    use `strerror' or `strerror_r' instead
warning: `sys_nerr' is deprecated;
    use `strerror' or `strerror_r' instead
```

R : C'est normal : nginx doit utiliser les obsolètes sys\_errlist\[\] et sys\_nerr dans les gestionnaires de signaux, car les fonctions strerror() et strerror\_r() ne sont pas sûres vis-à-vis des signaux asynchrones (Async-Signal-Safe).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
