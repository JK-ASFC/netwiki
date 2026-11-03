---
title: "Paramètres de la ligne de commande"
description: "Nginx — Paramètres de la ligne de commande. nginx prend en charge les paramètres de ligne de commande suivants :"
tags: [nginx, guide]
icon: book-open
---

nginx prend en charge les paramètres de ligne de commande suivants :

- `-?` | `-h` — affiche l'aide des paramètres de ligne de commande.
- `-c file` — utilise un autre *fichier* de configuration que celui par défaut.
- `-e file` — utilise un autre *fichier* de journal d'erreurs que celui par défaut (1.19.5). La valeur spéciale `stderr` sélectionne la sortie d'erreur standard.
- `-g directives` — définit des [[11-modules/01-coeur/ngx_core_module|directives de configuration globales]], par exemple

  ```
  nginx -g "pid /var/run/nginx.pid; worker_processes `sysctl -n hw.ncpu`;"
  ```
- `-l unix:socket | port` — active l'[API REST de contrôle de nginx](https://docs.nginx.com/nginx/admin-guide/basic-functionality/runtime-control#control-api) sur la socket de domaine UNIX ou le port indiqués (1.31.5).

  > [!NOTE]
  > De la version 1.29.8 à la version 1.31.5, ce paramètre faisait partie de notre [abonnement commercial](https://nginx.com/products/).
- `-p prefix` — définit le préfixe de chemin de nginx, c'est-à-dire le répertoire qui contiendra les fichiers du serveur (valeur par défaut : */usr/local/nginx*).
- `-q` — supprime les messages autres que les erreurs pendant le test de la configuration.
- `-s signal` — envoie un *signal* au processus maître. L'argument *signal* peut valoir :

  - `stop` — arrêt rapide
  - `quit` — arrêt propre
  - `reload` — recharge la configuration, démarre de nouveaux processus de travail avec la nouvelle configuration et arrête proprement les anciens.
  - `reopen` — rouvre les fichiers journaux
- `-t` — teste le fichier de configuration : nginx vérifie la syntaxe de la configuration, puis tente d'ouvrir les fichiers qu'elle référence.
- `-T` — comme `-t`, mais affiche en plus les fichiers de configuration sur la sortie standard (1.9.2).
- `-v` — affiche la version de nginx.
- `-V` — affiche la version de nginx, celle du compilateur et les paramètres de configure.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
