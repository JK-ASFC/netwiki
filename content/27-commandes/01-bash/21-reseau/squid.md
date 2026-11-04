---
title: "squid"
description: "Bash — squid (Proxy & cache web) : Serveur mandataire (proxy) et cache HTTP/HTTPS : filtre, journalise et met en cache le trafic web sortant."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Proxy & cache web |
| **Commande type** | `squid -k reconfigure` |

## Rôle

Serveur mandataire (proxy) et cache HTTP/HTTPS : filtre, journalise et met en cache le trafic web sortant.

## Options

| Option | Rôle |
| --- | --- |
| `-k ‹parse/reconfigure/rotate/shutdown/check›` | envoie une instruction au démon : parse (vérifie la conf), reconfigure (la relit sans couper les connexions), rotate (fait tourner les journaux), shutdown (arrêt propre), check (testé s'il tourne) |
| `-z` | INITIALISE les répertoires de cache : à lancer une seule fois avant le premier démarrage |
| `-N` | reste en avant-plan sans se détacher (débogage) |
| `-f ‹fichier.conf›` | utilise un autre fichier que /etc/squid/squid.conf |
| `-d ‹niveau›` | affiche les messages de débogage jusqu'au niveau indiqué |
| `-v` | affiche la version et les options de compilation |

## Exemples

**Vérifier la conf**

```bash
sudo squid -k parse
```

**Recharger sans couper**

```bash
sudo squid -k reconfigure
```

**Initialiser le cache**

```bash
sudo squid -z
```

**Suivre les accès**

```bash
sudo tail -f /var/log/squid/access.log
```

*Mots-clés : proxy cache web squid filtrage acl port 3128 mandataire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
