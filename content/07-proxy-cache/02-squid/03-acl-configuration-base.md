---
title: ACL et configuration de base
description: Types d'ACL Squid (sources, destinations, domaines, expressions régulières, ports, méthodes, horaires, utilisateurs), logique d'évaluation de http_access, listes externes, règles par plages horaires, proxy parent, en-têtes transmis, DNS, limitation de bande passante (delay pools) et pages d'erreur.
tags: [squid, acl, http_access, filtrage, delay pools, cache_peer]
icon: list-checks
---

## Principe des ACL

1. On **définit** des ACL : `acl <nom> <type> <valeurs…>` (une même ACL répétée sur plusieurs lignes est un **OU**).
2. On les **combine** dans des règles `http_access allow|deny <acl1> <acl2> …` (les ACL d'une même ligne sont un **ET** ; `!` = négation).
3. Les règles `http_access` sont évaluées **de haut en bas** ; la **première** qui correspond décide. Si aucune ne correspond, Squid applique l'**inverse de la dernière règle** : terminez toujours par `http_access deny all`.

## Types d'ACL courants

| Type | Exemple | Teste |
| --- | --- | --- |
| `src` | `acl bureaux src 10.20.0.0/16` | IP du client |
| `dst` | `acl reseau_interne dst 10.0.0.0/8` | IP de destination (résolution DNS nécessaire) |
| `dstdomain` | `acl reseaux_sociaux dstdomain .facebook.com .tiktok.com` | Domaine demandé (`.` = sous-domaines inclus) |
| `dstdom_regex` | `acl jeux dstdom_regex -i (^\|\.)(jeux\|games)\.` | Expression régulière sur le domaine |
| `url_regex` / `urlpath_regex` | `acl exe urlpath_regex -i \.(exe\|msi\|bat)$` | URL complète / chemin (HTTP en clair ou HTTPS déchiffré) |
| `port` | `acl SSL_ports port 443` | Port de destination |
| `method` | `acl CONNECT method CONNECT` | Méthode HTTP |
| `time` | `acl heures_bureau time MTWHF 08:00-18:30` | Jour (S M T W H F A) et heure |
| `proxy_auth` | `acl authentifies proxy_auth REQUIRED` | Utilisateur authentifié |
| `external` | `acl grp_web external ad_groupe GG-Internet` | Résultat d'un helper (groupe AD) |
| `browser` | `acl vieux_ie browser MSIE` | User-Agent |
| `ssl::server_name` | `acl banques ssl::server_name .banque-a.fr .banque-b.fr` | SNI (pour SSL Bump) |
| `maxconn` | `acl trop_de_conn maxconn 50` | Connexions simultanées par IP |
| `rep_mime_type` | `acl videos rep_mime_type -i ^video/` | Type MIME de la réponse (`http_reply_access`) |

> [!NOTE]
> Dans un tableau Markdown, les `|` des expressions régulières sont échappés ; dans `squid.conf`, écrivez-les normalement : `(^|\.)(jeux|games)\.`.

### Listes dans des fichiers

```squid
acl sites_bloques dstdomain "/etc/squid/listes/sites-bloques.txt"
acl sites_autorises dstdomain "/etc/squid/listes/liste-blanche.txt"
acl postes_direction src "/etc/squid/listes/ip-direction.txt"
```

Un élément par ligne. Après modification : `squid -k reconfigure`.

## Exemple de politique complète

```squid /etc/squid/squid.conf (extrait)
acl localnet src 10.0.0.0/8
acl SSL_ports port 443 8443
acl Safe_ports port 80 443 21 8080 8443
acl CONNECT method CONNECT

acl serveurs src 10.0.20.0/24
acl depots_maj dstdomain .debian.org .ubuntu.com .microsoft.com .windowsupdate.com .rockylinux.org
acl liste_blanche dstdomain "/etc/squid/listes/liste-blanche.txt"
acl liste_noire dstdomain "/etc/squid/listes/liste-noire.txt"
acl heures_bureau time MTWHF 08:00-19:00
acl reseaux_sociaux dstdomain .facebook.com .instagram.com .tiktok.com .x.com
acl executables urlpath_regex -i \.(exe|msi|scr|bat|ps1)$

# 1. Protections de base
http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localhost manager
http_access deny manager
http_access deny to_localhost

# 2. Serveurs : uniquement les dépôts de mises à jour
http_access allow serveurs depots_maj
http_access deny serveurs

# 3. Interdictions pour tous
http_access deny liste_noire
http_access deny executables !liste_blanche

# 4. Réseaux sociaux uniquement hors heures de bureau
http_access deny reseaux_sociaux heures_bureau

# 5. Le reste du réseau interne
http_access allow localnet
http_access deny all
```

> [!TIP]
> Placez les règles les plus **fréquentes** et les moins coûteuses en premier : chaque requête parcourt la liste. Les ACL qui déclenchent une authentification ou un helper externe (groupes AD) doivent arriver après les règles simples par IP.

## Accès en fonction de la réponse

```squid
acl telechargements_video rep_mime_type -i ^video/
http_reply_access deny telechargements_video
http_reply_access allow all
```

## Proxy parent (chaînage)

Pour faire sortir Squid via un proxy amont (proxy du groupe, SWG cloud) :

```squid
cache_peer proxy-groupe.exemple.com parent 8080 0 no-query default login=PASSTHRU
never_direct allow all                  # tout passe par le parent…
always_direct allow reseau_interne      # …sauf les destinations internes
acl reseau_interne dstdomain .corp.exemple.fr
```

## En-têtes et confidentialité

```squid
forwarded_for delete            # ne pas révéler les IP internes (X-Forwarded-For)
via off                         # pas d'en-tête Via
request_header_access X-Forwarded-For deny all
httpd_suppress_version_string on
```

## DNS

```squid
dns_nameservers 10.0.10.53 10.0.10.54
positive_dns_ttl 6 hours
negative_dns_ttl 1 minute
dns_v4_first on                 # (selon version) privilégier IPv4 si l'IPv6 sortant est défaillant
```

## Limitation de bande passante (delay pools)

```squid
delay_pools 2

# Pool 1 : téléchargements volumineux limités à 2 Mo/s au total
delay_class 1 1
delay_parameters 1 2000000/2000000
acl gros_fichiers urlpath_regex -i \.(iso|zip|7z|mp4|mkv)$
delay_access 1 allow gros_fichiers
delay_access 1 deny all

# Pool 2 : réseau invité, 500 Ko/s par client
delay_class 2 2
delay_parameters 2 -1/-1 500000/500000
acl invites src 10.50.0.0/16
delay_access 2 allow invites
delay_access 2 deny all
```

| `delay_class` | Seau(x) |
| --- | --- |
| 1 | Un seau global |
| 2 | Global + un seau par hôte (dernier octet de l'IP) |
| 3 | Global + par réseau /24 + par hôte |
| 4 | Comme 3 + par utilisateur authentifié |
| 5 | Par étiquette (`tag` d'un helper) |

## Pages d'erreur

```squid
error_directory /usr/share/squid/errors/fr
deny_info ERR_ACCES_REFUSE_CHARTE liste_noire           # page personnalisée pour une ACL
deny_info https://intranet.exemple.fr/charte-internet reseaux_sociaux   # redirection
```

Créez `ERR_ACCES_REFUSE_CHARTE` dans le dossier des erreurs (HTML avec les codes `%U` URL, `%a` utilisateur, `%i` IP).

## Limites et délais

```squid
request_header_max_size 64 KB
request_body_max_size 0          # illimité (envois) — fixer une limite si besoin
read_timeout 15 minutes
connect_timeout 30 seconds
client_lifetime 1 day
```
