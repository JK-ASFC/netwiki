---
title: "A message “ ‘sys_errlist’                 is deprecated;                 use ‘strerror’ or ‘strerror_r’                 instead ”"
description: "Nginx — A message “ ‘sys_errlist’ is deprecated; use ‘strerror’ or ‘strerror_r’ instead ”. Q: While building nginx version 0.7.66, 0.8.35 or higher on Linux the following warning messages are issued:"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

Q: While building nginx version 0.7.66, 0.8.35 or higher on Linux the following warning messages are issued:

```c
warning: `sys_errlist' is deprecated;
    use `strerror' or `strerror_r' instead
warning: `sys_nerr' is deprecated;
    use `strerror' or `strerror_r' instead
```

A: This is normal: nginx has to use the deprecated sys\_errlist\[\] and sys\_nerr in signal handlers because strerror() and strerror\_r() functions are not Async-Signal-Safe.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
