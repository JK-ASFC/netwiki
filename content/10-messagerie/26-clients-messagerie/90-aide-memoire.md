---
title: Clients de messagerie — aide-mémoire
description: Emplacements et commandes de Thunderbird (profils, stratégies, autoconfig, journaux), Evolution (EWS, sauvegarde, arrêt), KMail (akonadictl), Claws Mail, et adresses CalDAV/CardDAV pour DAVx5 et les clients natifs.
tags: [aide-mémoire, thunderbird, evolution, kmail, claws mail, davx5, caldav, carddav]
icon: terminal
---

Explications : [[01-thunderbird|Thunderbird]] · [[02-evolution-kmail-claws|Evolution, KMail, Claws Mail]] · [[03-davx5-sogo-connector|DAVx5, SOGo Connector]].

## Thunderbird

| Élément | Emplacement |
| --- | --- |
| Profil | `~/.thunderbird/` · `%APPDATA%\Thunderbird\Profiles\` · `~/Library/Thunderbird/Profiles/` |
| Stratégies | `/etc/thunderbird/policies/policies.json` · ADMX (Windows) · `distribution/policies.json` |
| Autoconfig | `https://autoconfig.<domaine>/mail/config-v1.1.xml` |
| Vérification | `about:policies`, `about:config`, `about:support` |

```bash
thunderbird -P                                  # gestionnaire de profils
MOZ_LOG=IMAP:5 MOZ_LOG_FILE=/tmp/imap.log thunderbird
curl -s https://autoconfig.exemple.fr/mail/config-v1.1.xml | head
```

## Evolution, KMail

```bash
evolution --force-shutdown
akonadictl status ; akonadictl restart ; akonadictl fsck
```

## Adresses CalDAV / CardDAV

| Serveur | URL |
| --- | --- |
| Nextcloud | `https://cloud.exemple.fr/remote.php/dav` |
| SOGo | `https://mail.exemple.fr/SOGo/dav` |
| Radicale | `https://dav.exemple.fr/` |
| Baïkal | `https://dav.exemple.fr/dav.php` |

```bash
curl -sI https://cloud.exemple.fr/.well-known/caldav     # redirection 301 attendue vers l'URL DAV
```
