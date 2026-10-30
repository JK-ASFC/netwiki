---
title: "Configuration : actions, Redis, Bayes, DKIM, listes, limites, antivirus"
description: Configurer Rspamd par local.d et override.d — proxy milter, contrôleur et mot de passe, seuils d'action, Redis, Bayes, en-têtes ajoutés, signature DKIM et ARC (rspamadm dkim_keygen), greylisting, listes personnalisées (multimap), limitation de débit des comptes authentifiés, ClamAV, résolveur DNS et listes de réputation.
tags: [rspamd, local.d, milter, bayes, redis, dkim, arc, multimap, ratelimit, clamav]
icon: settings-2
---

## Principe : local.d et override.d

| Répertoire | Effet |
| --- | --- |
| `/etc/rspamd/*.conf`, `modules.d/` | Configuration fournie : **ne pas modifier** (écrasée aux mises à jour) |
| `/etc/rspamd/local.d/<fichier>` | **Fusionné** avec le fichier d'origine du même nom (cas général) |
| `/etc/rspamd/override.d/<fichier>` | **Remplace** entièrement la section |

```bash
sudo rspamadm configtest && sudo systemctl reload rspamd
sudo rspamadm configdump actions          # configuration effective d'un module
```

## Proxy milter et contrôleur

```rspamd /etc/rspamd/local.d/worker-proxy.inc
bind_socket = "127.0.0.1:11332";
milter = yes;
timeout = 120s;
upstream "local" {
  default = yes;
  self_scan = yes;            # le proxy analyse lui-même (pas de worker séparé à appeler)
}
```

```bash
rspamadm pw                                # saisir le mot de passe → hachage $2$…
```

```rspamd /etc/rspamd/local.d/worker-controller.inc
bind_socket = "127.0.0.1:11334";
password = "$2$xxxxxxxxxxxxxxxx$yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy";
enable_password = "$2$…";                 # mot de passe des opérations d'écriture (apprentissage, cartes)
```

Publiez l'interface web derrière un reverse proxy HTTPS avec restriction d'accès :

```nginx
location /rspamd/ {
    allow 10.0.99.0/24;
    deny all;
    proxy_pass http://127.0.0.1:11334/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## Seuils d'action

```rspamd /etc/rspamd/local.d/actions.conf
greylist = 4;
add_header = 6;
rewrite_subject = null;     # désactivé
reject = 15;
```

Commencez prudemment (rejet élevé, en-tête bas), observez l'historique, puis ajustez.

## Redis, Bayes et en-têtes

```rspamd /etc/rspamd/local.d/redis.conf
servers = "127.0.0.1:6379";
```

```rspamd /etc/rspamd/local.d/classifier-bayes.conf
backend = "redis";
autolearn = true;            # apprend automatiquement sur les scores très hauts/bas
min_learns = 200;            # Bayes actif après 200 spams et 200 hams appris
```

```rspamd /etc/rspamd/local.d/milter_headers.conf
use = ["x-spamd-bar", "x-spam-level", "authentication-results"];
authenticated_headers = ["authentication-results"];
extended_spam_headers = false;
```

`extended_spam_headers = true` ajoute le détail des symboles (`X-Spamd-Result`) : pratique pour diagnostiquer, mais à réserver aux messages internes.

## Signature DKIM et ARC

```bash
sudo mkdir -p /var/lib/rspamd/dkim
sudo rspamadm dkim_keygen -b 2048 -s s2025 -d exemple.fr \
     -k /var/lib/rspamd/dkim/exemple.fr.s2025.key | sudo tee /var/lib/rspamd/dkim/exemple.fr.s2025.txt
sudo chown -R _rspamd:_rspamd /var/lib/rspamd/dkim && sudo chmod 640 /var/lib/rspamd/dkim/*.key
```

```rspamd /etc/rspamd/local.d/dkim_signing.conf
path = "/var/lib/rspamd/dkim/$domain.$selector.key";
selector = "s2025";
sign_authenticated = true;     # messages des utilisateurs authentifiés (submission)
sign_local = true;             # messages des réseaux locaux (mynetworks)
use_domain = "header";         # domaine du From:
allow_username_mismatch = true;
```

```bash
sudo cp /etc/rspamd/local.d/dkim_signing.conf /etc/rspamd/local.d/arc.conf   # ARC : mêmes clés
```

Publiez le contenu du fichier `.txt` en DNS (`s2025._domainkey.exemple.fr`) — démarche complète dans [[01-postfix/06-spf-dkim-dmarc|SPF, DKIM et DMARC]]. L'utilisateur système est `_rspamd` sous Debian/Ubuntu (`rspamd` sous RHEL).

## Greylisting

```rspamd /etc/rspamd/local.d/greylist.conf
servers = "127.0.0.1:6379";
timeout = 5min;
expire = 35d;
whitelisted_ip = "/etc/rspamd/local.d/maps/greylist_exclusions.map";
```

Le greylisting ne s'applique qu'aux messages dont le score atteint le seuil `greylist`.

## Listes personnalisées (multimap)

```rspamd /etc/rspamd/local.d/multimap.conf
EXPEDITEURS_CONFIANCE {
  type = "from";
  filter = "email:domain";
  map = "/etc/rspamd/local.d/maps/expediteurs_confiance.map";
  score = -6.0;
  description = "Domaines partenaires de confiance";
}
EXPEDITEURS_BLOQUES {
  type = "from";
  map = "/etc/rspamd/local.d/maps/expediteurs_bloques.map";
  action = "reject";
  message = "Expéditeur refusé";
}
IP_INTERNES {
  type = "ip";
  map = "/etc/rspamd/local.d/maps/ip_internes.map";
  score = -10.0;
}
```

```text /etc/rspamd/local.d/maps/expediteurs_confiance.map
partenaire.fr
fournisseur-critique.com
```

> [!WARNING]
> Une liste blanche par **domaine d'expéditeur** est facilement usurpable : combinez-la avec un contrôle d'authentification (symbole DMARC/DKIM valide) ou préférez des scores négatifs modérés.

## Limitation de débit des comptes authentifiés

Un compte compromis qui envoie du spam ruine la réputation de vos IP : limitez les envois.

```rspamd /etc/rspamd/local.d/ratelimit.conf
rates {
  par_utilisateur {
    selector = "user.lower";
    bucket = {
      burst = 100;
      rate = "100 / 1h";
    }
  }
}
```

## Antivirus (ClamAV)

```rspamd /etc/rspamd/local.d/antivirus.conf
clamav {
  type = "clamav";
  servers = "/var/run/clamav/clamd.ctl";
  symbol = "CLAM_VIRUS";
  action = "reject";
  scan_mime_parts = true;
  max_size = 20000000;
}
```

## DNS et listes de réputation

```rspamd /etc/rspamd/local.d/options.inc
dns {
  nameserver = ["127.0.0.1:53"];     # résolveur local (Unbound) : indispensable pour les listes DNS
  timeout = 1s;
  retransmits = 2;
}
```

Les listes Spamhaus refusent les requêtes passant par des résolveurs publics ; pour un usage professionnel, utilisez le module **Spamhaus DQS** avec une clé.
