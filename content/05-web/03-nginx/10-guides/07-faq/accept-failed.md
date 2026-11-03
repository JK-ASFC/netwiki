---
title: "What does the following error mean in the log file:                “accept() failed (53: Software caused connection abort)                while accepting new connection on 0.0.0.0:80”?"
description: "Nginx — What does the following error mean in the log file: “accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80”?. Q: What does the following error mean in the log file: \"accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80\"?"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

Q: What does the following error mean in the log file: "accept() failed (53: Software caused connection abort) while accepting new connection on 0.0.0.0:80"?

A: Such errors stem from the connections that the clients managed to close before nginx was able to process them. For instance, this can happen in a situation when the user didn’t wait for a page heavily populated with images to load fully, and clicked on a different link. In this case user’s browser would close all of the prior connections which aren’t longer necessary. It is a non-critical error.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
