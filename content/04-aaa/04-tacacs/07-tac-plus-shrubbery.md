---
title: Serveur tac_plus (Shrubbery)
description: Le serveur TACACS+ historique tac_plus (version F4.0.4 de Shrubbery Networks, dérivée de Cisco) — installation, options de lancement, syntaxe du fichier (key, host, group, user, service, cmd, acl), mots de passe et PAM, attributs Cisco/NX-OS/Junos, attributs facultatifs, comptabilité et migration vers tac_plus-ng.
tags: [tacacs+, tac_plus, shrubbery, serveur, linux, configuration, migration]
icon: server
---

**tac_plus** est le serveur publié par Cisco dans les années 1990 (version F4.0.4), repris et maintenu par **Shrubbery Networks**. C'est celui que décrivent la plupart des tutoriels et des configurations existantes. Il reste fonctionnel mais n'évolue plus guère : pour un nouveau déploiement, préférez [[04-tacacs/06-tac-plus-ng|tac_plus-ng]].

## Installation

Selon la distribution, un paquet peut exister (`tacacs+` sur d'anciennes Debian, ports BSD). Sinon, compiler les sources de Shrubbery :

```bash
sudo apt install build-essential flex bison libpam0g-dev libwrap0-dev
wget https://shrubbery.net/pub/tac_plus/tacacs-F4.0.4.28.tar.gz
tar xzf tacacs-F4.0.4.28.tar.gz && cd tacacs-F4.0.4.28
./configure --prefix=/usr/local --sysconfdir=/etc
make && sudo make install
```

| Option | Rôle |
| --- | --- |
| `-C fichier` | Fichier de configuration |
| `-P` | Vérifier la syntaxe et quitter |
| `-G` | Rester au premier plan (systemd) |
| `-d niveau` | Débogage (somme de drapeaux : 8 = autorisation, 16 = authentification, 32 = mots de passe, 64 = comptabilité, 128 = configuration…) |
| `-l fichier` | Fichier journal |
| `-p port` | Port d'écoute (49 par défaut) |

```systemd /etc/systemd/system/tac_plus.service
[Unit]
Description=Serveur TACACS+ tac_plus
After=network-online.target

[Service]
ExecStartPre=/usr/local/sbin/tac_plus -P -C /etc/tac_plus.conf
ExecStart=/usr/local/sbin/tac_plus -G -C /etc/tac_plus.conf
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

## Syntaxe du fichier

```tacplus /etc/tac_plus.conf
# Clé par défaut (équipements non déclarés individuellement)
key = "Cle-Par-Defaut-Longue-Et-Aleatoire"

# Clé propre à un équipement
host = 10.20.0.1 {
    key = "Cle-Datacenter-Differente"
}

# Journal de comptabilité
accounting file = /var/log/tac_plus/acct.log

# Mot de passe enable global (niveau 15)
user = $enab15$ {
    login = des a9Bc0dEfGhIjK
}

# ACL : adresses d'administrateurs autorisées (expression régulière)
acl = admins-autorises {
    permit = ^10\.0\.5\.
}

group = admins {
    default service = permit          # toutes les commandes
    acl = admins-autorises
    service = exec {
        priv-lvl = 15
    }
}

group = lecture {
    service = exec {
        priv-lvl = 1
    }
    cmd = show       { permit .* }
    cmd = ping       { permit .* }
    cmd = traceroute { permit .* }
    cmd = exit       { permit .* }
    cmd = terminal   { permit "^length" }
}

group = noc {
    default service = permit
    service = exec { priv-lvl = 15 }
    cmd = reload { deny .* }
    cmd = write  { deny "^erase" permit .* }
    cmd = delete { deny .* }
}

user = alice {
    member = admins
    login = PAM                        # mot de passe vérifié par PAM (comptes système, SSSD, AD)
}

user = bob {
    member = lecture
    login = des q1W2e3R4t5Y6u          # hachage DES (crypt) — à éviter, préférer PAM
    expires = "Dec 31 2026"
}

user = noc1 {
    member = noc
    login = file /etc/tac_plus.passwd  # fichier au format /etc/passwd
}
```

### Directives principales

| Directive | Rôle |
| --- | --- |
| `key` | Clé partagée (globale ou dans un bloc `host`) |
| `host = adresse { … }` | Réglages propres à un équipement : clé, invites |
| `accounting file` | Fichier de comptabilité |
| `group` / `user` | Groupes et utilisateurs ; `member` pour l'appartenance |
| `login = PAM` / `cleartext "…"` / `des …` / `file …` | Méthode de vérification du mot de passe |
| `enable = …` | Mot de passe enable propre à l'utilisateur |
| `default service = permit` | Autoriser toute commande non citée (sinon, tout est refusé) |
| `service = exec { … }` | Attributs renvoyés à l'ouverture du shell |
| `cmd = commande { permit regex  deny regex }` | Autorisation par commande ; les expressions portent sur les **arguments** |
| `acl = nom { permit = regex }` | Restreindre par adresse de l'administrateur |
| `expires` | Date d'expiration du compte |

> [!IMPORTANT]
> Dans `cmd = show { permit .* }`, `show` est la commande et l'expression régulière porte sur les **arguments** (`running-config`, `interfaces status`…). Les règles sont évaluées dans l'ordre et la première qui correspond gagne.

### Attributs des autres constructeurs

```tacplus
group = admins-multi {
    default service = permit
    service = exec {
        priv-lvl = 15                                  # Cisco IOS / IOS XE
        optional shell:roles = "\"network-admin\""     # Cisco NX-OS (facultatif : ignoré par IOS)
    }
    service = junos-exec {
        local-user-name = super                        # Juniper
    }
    service = fortigate {
        admin_prof = super_admin                       # FortiGate
    }
}
```

Le mot-clé `optional` envoie l'attribut sous forme facultative (`attribut*valeur`) : un équipement qui ne le connaît pas l'ignore au lieu de refuser l'autorisation.

## Journal de comptabilité

Chaque ligne est un enregistrement tabulé :

```text
Nov  3 10:42:17  10.0.10.5  alice  tty2  10.0.5.20  stop  task_id=118  timezone=UTC  service=shell  priv-lvl=15  cmd=interface GigabitEthernet1/0/1 <cr>
Nov  3 10:42:25  10.0.10.5  alice  tty2  10.0.5.20  stop  task_id=119  timezone=UTC  service=shell  priv-lvl=15  cmd=shutdown <cr>
```

Colonnes : date, équipement, utilisateur, ligne, adresse de l'administrateur, type (`start`, `stop`, `update`), puis les attributs.

## Migrer vers tac_plus-ng

| tac_plus (Shrubbery) | tac_plus-ng |
| --- | --- |
| `key = …` global ou `host = … { key }` | `device nom { address = … key = … }` |
| `group = … { service = exec { priv-lvl = 15 } }` | `profile … { script { if (service == shell) { if (cmd == "") { set priv-lvl = 15 permit } … } } }` |
| `default service = permit` | `permit` en fin de script |
| `cmd = show { permit .* }` | `if (cmd =~ /^show /) permit` |
| `login = PAM` | `password login = mavis` avec un module MAVIS (PAM ou LDAP) |
| `member = groupe` | `member = groupe` + règle dans `ruleset` |
| `accounting file = …` | `log acctlog { destination = … }` + `accounting log = acctlog` |

Démarche : écrire la configuration tac_plus-ng à côté, la vérifier avec `tac_plus-ng -P`, la lancer sur un second serveur, rediriger quelques équipements de test, comparer les journaux, puis basculer le reste.
