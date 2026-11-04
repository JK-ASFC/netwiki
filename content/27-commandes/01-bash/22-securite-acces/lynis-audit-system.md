---
title: "lynis audit system"
description: "Bash — lynis audit system (Audit / Durcissement) : Lance l'audit de sécurité du système : des centaines de tests (configuration, paquets, réseau, authentification, journalisation...), puis un indice de durcissement et la liste des avertissements et suggestions."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Durcissement |
| **Commande type** | `lynis audit system --quick` |

## Rôle

Lance l'audit de sécurité du système : des centaines de tests (configuration, paquets, réseau, authentification, journalisation...), puis un indice de durcissement et la liste des avertissements et suggestions.

## Options

| Option | Rôle |
| --- | --- |
| `--quick` | pas de pause entre les sections (-Q) |
| `--quiet` | silencieux, implique --quick (-q) |
| `--warnings-only` | silencieux sauf les avertissements |
| `--cronjob` | options sûres pour une tâche planifiée |
| `--pentest` | scan sans privilèges |
| `--forensics` | audite un système monté ou en marche |
| `--auditor ‹nom›` | nom de l'auditeur dans le rapport |
| `--profile ‹fichier›` | profil de scan alternatif |
| `--tests ‹identifiants›` | exécute seulement ces tests |
| `--tests-from-category ‹catégorie›` | une catégorie de tests |
| `--tests-from-group ‹groupe›` | un groupe de tests |
| `--logfile ‹fichier›` | journal à un autre emplacement |
| `--report-file ‹fichier›` | rapport à un autre emplacement |
| `--no-log` | n'écrit aucun journal sur le disque |
| `--no-plugins` | n'exécute aucun plugin |
| `--plugin-dir ‹dossier›` | dossier des plugins |
| `--no-colors` | sortie sans couleurs |
| `--reverse-colors` | couleurs pour fond clair |
| `--verbose` | plus de détails à l'écran |
| `--debug` | informations de débogage |
| `--developer` | détails pour écrire des tests |
| `--wait` | pause après chaque section |
| `--upload` | envoie à Lynis Enterprise |
| `--use-cwd` | exécute depuis le dossier courant |
| `(codes de sortie) 0 1 64 65 66 78` | à tester dans un script |
| `(distant) lynis audit system remote ‹hôte›` | commandes pour un scan distant |
| `(ensuite) lynis show details ‹TEST-ID›` | détail d'un test du rapport |

## Exemples

**Audit complet**

```bash
sudo lynis audit system
```

**Sans pause, avec un nom d'auditeur**

```bash
sudo lynis audit system --quick --auditor "The Auditor"
```

**Audit planifié, sortie archivée**

```bash
sudo lynis audit system --cronjob --report-file /var/log/lynis/rapport.dat > /var/log/lynis/rapport.txt
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis-audit-system|lynis audit system (macOS)]]

*Mots-clés : lynis audit system sécurité durcissement hardening indice avertissements suggestions rapport pentest cron*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
