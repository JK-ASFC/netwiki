---
title: Configuration du serveur et durcissement
description: Structure de sshd_config (Include, ordre de priorité, blocs Match), authentification par clés uniquement, restrictions par groupe et par adresse, délais et limites, redirections, choix cryptographiques et audit avec ssh-audit, bannière, pénalités par source, journalisation et liste de contrôle.
tags: [openssh, sshd_config, durcissement, sécurité, cryptographie, match]
icon: shield
---

## Règles de lecture de sshd_config

- Les fichiers `Include` (en général `/etc/ssh/sshd_config.d/*.conf`, inclus **en tête**) sont lus avant le reste.
- Pour la plupart des mots-clés, **la première valeur rencontrée l'emporte** : un réglage dans `sshd_config.d/10-durcissement.conf` prime donc sur une valeur plus bas dans `sshd_config`.
- Les blocs `Match` (à la fin) surchargent pour un utilisateur, un groupe, une adresse.
- Vérifier la configuration **effective** : `sshd -T` (avec `-C user=alice,host=x,addr=10.0.10.5` pour simuler un `Match`).

## Configuration durcie

```sshconfig /etc/ssh/sshd_config.d/10-durcissement.conf
# --- Écoute
Port 22
ListenAddress 10.0.10.21                # interface d'administration uniquement
AddressFamily inet

# --- Authentification
PermitRootLogin no                      # ou « prohibit-password » si l'automatisation l'exige
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no         # à « yes » seulement pour un second facteur (OTP)
PermitEmptyPasswords no
AuthenticationMethods publickey
MaxAuthTries 3
LoginGraceTime 30
MaxStartups 10:30:60                    # refuse progressivement les connexions non authentifiées en rafale
UsePAM yes
StrictModes yes

# --- Qui peut se connecter
AllowGroups ssh-admins sftp-users

# --- Sessions
ClientAliveInterval 300
ClientAliveCountMax 2                   # déconnexion après ~10 min sans réponse
MaxSessions 4

# --- Fonctions à désactiver par défaut
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
AllowStreamLocalForwarding no
PermitTunnel no
GatewayPorts no
PermitUserEnvironment no

# --- Informations
Banner /etc/ssh/banniere.txt
PrintMotd no
DebianBanner no                         # Debian/Ubuntu : ne pas annoncer la distribution
LogLevel VERBOSE                        # journalise l'empreinte de la clé utilisée
```

```text /etc/ssh/banniere.txt
Accès réservé aux personnes autorisées. Toute connexion est journalisée.
```

```bash
sudo sshd -t && sudo systemctl reload ssh      # « reload » ne coupe pas les sessions ouvertes
```

> [!CAUTION]
> Avant de désactiver les mots de passe ou de changer le port, **gardez une session ouverte** et testez une nouvelle connexion dans un second terminal. Sur un serveur distant sans console hors bande, une erreur peut vous enfermer dehors.

## Exceptions avec Match

```sshconfig /etc/ssh/sshd_config (fin du fichier)
# Administrateurs : redirections autorisées depuis le bastion seulement
Match Group ssh-admins Address 10.0.10.5
    AllowTcpForwarding yes
    AllowAgentForwarding no

# Compte d'automatisation : uniquement depuis le serveur Ansible, commande forcée possible
Match User ansible Address 10.0.30.10
    AuthenticationMethods publickey
    PermitRootLogin no

# Prestataires : mot de passe + OTP, sans redirection
Match Group prestataires
    AuthenticationMethods publickey,keyboard-interactive

# SFTP : voir l'article dédié
Match Group sftp-users
    ChrootDirectory /srv/sftp/%u
    ForceCommand internal-sftp
```

Critères de `Match` : `User`, `Group`, `Host`, `LocalAddress`, `LocalPort`, `Address` (IP/CIDR du client, négation avec `!`), `RDomain`, `All`.

## Cryptographie

Les versions récentes d'OpenSSH ont des valeurs par défaut sûres. Pour un profil strict (serveurs récents uniquement) :

```sshconfig /etc/ssh/sshd_config.d/20-crypto.conf
KexAlgorithms mlkem768x25519-sha256,sntrup761x25519-sha512,curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes128-ctr
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com,umac-128-etm@openssh.com
HostKeyAlgorithms ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,sk-ssh-ed25519@openssh.com,rsa-sha2-512,rsa-sha2-256
PubkeyAcceptedAlgorithms ssh-ed25519,ssh-ed25519-cert-v01@openssh.com,sk-ssh-ed25519@openssh.com,sk-ssh-ed25519-cert-v01@openssh.com,rsa-sha2-512,rsa-sha2-256
RequiredRSASize 3072
```

> [!NOTE]
> `mlkem768x25519-sha256` n'existe qu'à partir d'OpenSSH 9.9 et `sntrup761x25519-sha512` à partir de 9.0 : retirez-les de la liste sur les serveurs plus anciens (sinon `sshd -t` signale un algorithme inconnu). Sur RHEL, préférez les **politiques cryptographiques** système plutôt que ces lignes.

Ne gardez que les clés d'hôte utiles :

```sshconfig
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key
```

```bash
# Régénérer une clé RSA d'hôte de 4096 bits si l'ancienne fait 2048
sudo ssh-keygen -t rsa -b 4096 -f /etc/ssh/ssh_host_rsa_key -N "" <<< y
```

### Auditer

```bash
pipx install ssh-audit          # ou paquet ssh-audit
ssh-audit serveur.exemple.fr    # algorithmes faibles, versions vulnérables, recommandations
```

### Équipements anciens (côté client)

Pour se connecter à un vieil équipement qui ne connaît que des algorithmes retirés, **sans** affaiblir la configuration globale :

```sshconfig ~/.ssh/config
Host vieux-switch-*
    KexAlgorithms +diffie-hellman-group14-sha1
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedAlgorithms +ssh-rsa
```

## Protection contre le brute force

| Mesure | Mise en œuvre |
| --- | --- |
| Pas de mot de passe | `PasswordAuthentication no` (élimine l'intérêt du brute force) |
| Pénalités intégrées (9.8+) | `PerSourcePenalties` actif par défaut : bannit temporairement les IP fautives ; `PerSourcePenaltyExemptList 10.0.10.0/24` |
| Fail2ban / CrowdSec | Bannissement au pare-feu à partir des journaux (voir [[07-mfa-annuaire-depannage]]) |
| Filtrage réseau | Pare-feu : SSH accessible seulement depuis le VPN, le bastion ou des IP d'administration |
| Limitation de débit | `nft … tcp dport 22 ct state new limit rate 10/minute accept` |

## Restreindre une clé (authorized_keys)

```text ~/.ssh/authorized_keys
# Clé de sauvegarde : une seule commande, depuis une seule IP, sans aucune redirection
restrict,from="10.0.40.20",command="/usr/local/bin/sauvegarde-dump.sh" ssh-ed25519 AAAAC3Nza… sauvegarde@srv-backup

# Clé d'administration avec expiration (9.x)
expiry-time="20261231",from="10.0.10.0/24" ssh-ed25519 AAAAC3Nza… alice@poste-admin
```

| Option | Effet |
| --- | --- |
| `restrict` | Désactive tout (pty, redirections, agent, X11) — à combiner avec ce qu'on réautorise (`pty`, `port-forwarding`) |
| `from="…"` | IP ou réseaux source autorisés |
| `command="…"` | Commande forcée (la commande demandée est dans `$SSH_ORIGINAL_COMMAND`) |
| `expiry-time="AAAAMMJJ"` | Date d'expiration de la clé |
| `principals="…"` | Avec les certificats |

## Journalisation et audit

- `LogLevel VERBOSE` : empreinte de la clé utilisée à chaque connexion (`Accepted publickey for alice from … ssh2: ED25519 SHA256:…`).
- Envoyez `auth.log` / `secure` ou le journal systemd vers le SIEM ; alertez sur les connexions root, les échecs en rafale, les connexions hors horaires.
- Enregistrement des sessions (audit de ce qui est tapé) : bastion avec enregistrement (Teleport, Warpgate, `tlog` sur RHEL, PAM `pam_tty_audit`).

## Liste de contrôle

- [ ] OpenSSH à jour (avis de sécurité, ex. regreSSHion CVE-2024-6387 corrigée en 9.8)
- [ ] Clés uniquement, `PermitRootLogin no`, `AllowGroups` restrictif
- [ ] Redirections, agent et X11 désactivés par défaut, autorisés par `Match` si besoin
- [ ] Algorithmes vérifiés avec `ssh-audit`, clés d'hôte Ed25519 / RSA ≥ 3072
- [ ] Accès réseau limité (VPN, bastion, listes d'IP), protection contre le brute force
- [ ] Clés d'hôte vérifiées par les clients (certificats d'hôte ou SSHFP)
- [ ] `LogLevel VERBOSE`, journaux centralisés
- [ ] Revue périodique des `authorized_keys` (départs, clés orphelines) — ou certificats à durée limitée
