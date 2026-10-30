---
title: Installation (Linux, macOS, Windows)
description: Installer Postfix sur Debian/Ubuntu (debconf, paquets de tables LDAP/MySQL/PCRE) et RHEL (alternatives mta), prérequis réseau (nom, DNS inverse, port 25 sortant), pare-feu, fichiers et commandes essentielles (postconf, postmap, postfix check), Postfix intégré à macOS, et options sous Windows.
tags: [postfix, installation, postconf, postmap, pare-feu, macos, windows]
icon: download
---

## Prérequis

| Élément | Exigence |
| --- | --- |
| Nom d'hôte | FQDN stable (`mx1.exemple.fr`) utilisé dans le `HELO` |
| DNS inverse (PTR) | L'IP publique se résout vers ce nom, et ce nom vers cette IP (**FCrDNS**) — à demander à l'hébergeur |
| Port 25 sortant | Souvent bloqué (Azure, AWS, GCP, FAI) : demander l'ouverture ou passer par un relais |
| Réputation de l'IP | Vérifier qu'elle n'est pas listée (Spamhaus, etc.) avant la mise en production |
| Heure | Synchronisée (signatures, journaux) |

## Debian / Ubuntu

```bash
sudo apt install postfix                # debconf : « Site Internet » ou « Système satellite »
# Tables optionnelles
sudo apt install postfix-pcre postfix-ldap postfix-mysql postfix-lmdb
sudo dpkg-reconfigure postfix           # relancer l'assistant
sudo systemctl enable --now postfix
postconf mail_version
```

| Type debconf | Usage |
| --- | --- |
| Site Internet | Serveur qui envoie et reçoit directement |
| Site Internet utilisant un smarthost | Reçoit directement, envoie via un relais |
| Système satellite | Envoie tout via un relais, ne reçoit rien (« null client ») |
| Local uniquement | Courrier entre comptes locaux |

## RHEL / Rocky / Alma

```bash
sudo dnf install postfix postfix-pcre postfix-ldap postfix-mysql
sudo systemctl disable --now sendmail 2>/dev/null
sudo alternatives --set mta /usr/sbin/sendmail.postfix
sudo systemctl enable --now postfix
sudo firewall-cmd --permanent --add-service={smtp,smtps,smtp-submission} && sudo firewall-cmd --reload
```

Par défaut, RHEL n'écoute que sur `localhost` (`inet_interfaces = localhost`) : à adapter pour un relais ou un MX.

## Fichiers et commandes

| Élément | Rôle |
| --- | --- |
| `/etc/postfix/main.cf` | Paramètres globaux |
| `/etc/postfix/master.cf` | Services (ports, démons, options par service) |
| `/etc/aliases` | Alias locaux (`newaliases` après modification) |
| Tables `hash:`, `lmdb:`, `pcre:`, `ldap:`, `mysql:` | Correspondances (domaines, utilisateurs, routes…) |
| `postconf -n` | Paramètres modifiés (configuration effective) |
| `postconf -d <param>` | Valeur par défaut |
| `postconf -e 'param = valeur'` | Modifier `main.cf` |
| `postconf -M` / `-P` | Lire `master.cf` / ses options `-o` |
| `postmap /etc/postfix/table` | Compiler une table `hash:`/`lmdb:` |
| `postmap -q clé type:table` | Tester une recherche |
| `postfix check` | Vérifier droits et configuration |
| `postfix reload` | Recharger sans interruption |

```bash
sudo postconf -n
sudo postfix check && sudo postfix reload
```

> [!TIP]
> Les distributions récentes privilégient `lmdb:` à `hash:` (Berkeley DB obsolète). Utilisez `default_database_type = lmdb` si le paquet est disponible, et le même type dans toutes les références de tables.

## Journaux

```bash
sudo journalctl -u postfix -f              # ou /var/log/mail.log (Debian), /var/log/maillog (RHEL)
# Postfix ≥ 3.4 peut écrire lui-même son journal :
sudo postconf -e 'maillog_file = /var/log/postfix.log'
```

## macOS

macOS intègre Postfix (utilisé par `sendmail` et `mail` pour les envois locaux) :

```bash
sudo postfix start
sudo postconf -n                          # /etc/postfix/main.cf
echo "Test" | mail -s "Test macOS" admin@exemple.fr
```

Usage typique : faire relayer les alertes d'un Mac vers un relais d'entreprise (`relayhost`). Pour un vrai serveur, préférez Linux.

## Windows

Postfix n'existe pas nativement sous Windows. Options :

| Besoin | Solution |
| --- | --- |
| Relais SMTP pour applications Windows | Relais Postfix Linux interne, ou service d'envoi du fournisseur (Microsoft 365, SES…) |
| Tester l'envoi depuis une application | [[07-mailpit/01-presentation-installation\|Mailpit]] |
| Exécuter Postfix localement | WSL 2 ou conteneur Docker |
| Ancien relais SMTP d'IIS 6 | Fonctionnalité obsolète (prévue dans la feuille de route) |
