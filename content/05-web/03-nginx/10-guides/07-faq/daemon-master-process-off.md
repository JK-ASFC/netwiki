---
title: "Can I run nginx with “daemon off” or                “master_process off” settings                in a production environment?"
description: "Nginx — Can I run nginx with “daemon off” or “master_process off” settings in a production environment?. Q: Can I run nginx with \"daemon off\" or \"master_process off\" settings in a production environment?"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

Q: Can I run nginx with "daemon off" or "master\_process off" settings in a production environment?

A: First of all, both "daemon on|off" and "master\_process on|off" directives were intended to be used primarily for nginx code development.

While many people use "daemon off" in production it wasn’t really meant for that. Since version 1.0.9 it is now quite safe to run nginx in production with "daemon off", though. Bear in mind that non-stop upgrade is not an option with "daemon off".

In a development environment, using "master\_process off", nginx can run in the foreground without the master process and can be terminated simply with ^C (SIGINT). This is somewhat similar to running Apache with an 'X' command-line option. However you should NEVER run nginx in production with "master\_process off".

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
