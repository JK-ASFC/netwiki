---
title: Référence complète des commandes
description: Référence exhaustive des outils ClamAV — clamscan (toutes les options : sélection, actions, formats scannés, alertes heuristiques, limites de ressources, PUA, DLP), clamdscan (client du démon : multiscan, fdpass, stream, ping), freshclam (mise à jour des bases, démon, hooks), sigtool (hachages, signatures, CVD, cdiff, signatures détachées), clamd, clamconf, clamonacc, clamdtop et clambc.
tags: [clamav, clamscan, clamdscan, freshclam, sigtool, référence, antivirus]
icon: terminal
---

Référence exhaustive des outils **ClamAV** (1.x). Explications et intégrations : [[01-presentation-installation|ClamAV]] · [[02-integrations-exploitation|intégrations]]. Codes de retour des scanners : **0** rien, **1** virus trouvé, **2** erreur.

## clamscan — analyse autonome

```bash
clamscan [options] [fichier|répertoire|-]
clamscan -r -i --remove /srv/partage        # récursif, n'afficher que les infectés, supprimer
clamscan -r --move=/quarantaine --log=/var/log/clamscan.log /home
```

### Affichage et journal

| Option | Rôle |
| --- | --- |
| `-v, --verbose` · `-a, --archive-verbose` | Verbeux · noms des fichiers dans les archives |
| `-i, --infected` · `-o, --suppress-ok-results` | N'afficher que les infectés · masquer les « OK » |
| `--bell` · `--no-summary` · `--quiet` · `--stdout` | Bip à la détection · pas de résumé · erreurs seules · tout sur stdout |
| `-l, --log=FICHIER` · `-f, --file-list=FICHIER` | Journal · liste de fichiers à scanner |
| `--gen-json` · `--json-store-{html,pdf}-uris` · `--json-store-extra-hashes` | Métadonnées JSON des fichiers |
| `--log-hash` · `--hash-alg=md5\|sha1\|sha2-256` · `--hash-hint` | Hachage par fichier |
| `--log-file-type` · `--file-type-hint=pe\|elf\|zip` | Type de fichier |
| `--tempdir=DIR` · `--leave-temps` · `--force-to-disk` | Fichiers temporaires |

### Base et sélection

| Option | Rôle |
| --- | --- |
| `-d, --database=FICHIER\|DIR` | Base de signatures à charger |
| `--official-db-only[=yes\|no]` | Seulement les signatures officielles |
| `--fail-if-cvd-older-than=JOURS` | Échec si la base est trop ancienne |
| `-r, --recursive` · `-z, --allmatch` | Récursif · continuer après une correspondance |
| `--cross-fs[=yes\|no]` | Traverser les systèmes de fichiers |
| `--follow-dir-symlinks=0\|1\|2` · `--follow-file-symlinks=0\|1\|2` | Suivi des liens symboliques |
| `--exclude=REGEX` · `--exclude-dir=REGEX` | Exclure (répétable) |
| `--include=REGEX` · `--include-dir=REGEX` | Restreindre (répétable) |

### Actions sur les fichiers infectés

```bash
--remove[=yes|no]        # supprimer
--move=DIRECTORY         # déplacer en quarantaine
--copy=DIRECTORY         # copier
```

### Détection, formats et heuristiques

| Option | Rôle |
| --- | --- |
| `--bytecode[=yes\|no]` · `--bytecode-unsigned` · `--bytecode-timeout=N` | Moteur *bytecode* (recommandé activé) |
| `--detect-pua[=yes\|no]` · `--include-pua=CAT` · `--exclude-pua=CAT` | Applications potentiellement indésirables |
| `--detect-structured` · `--structured-ssn-format=0\|1\|2` · `--structured-{ssn,cc}-count=N` | DLP : numéros de sécurité sociale / cartes bancaires |
| `--scan-mail` · `--phishing-sigs` · `--phishing-scan-urls` | Courriel et hameçonnage |
| `--heuristic-alerts[=yes\|no]` · `--heuristic-scan-precedence` | Détection algorithmique |
| `--normalize[=yes\|no]` | Normaliser HTML/script (mettre `no` pour la compatibilité YARA) |
| `--scan-pe\|elf\|ole2\|pdf\|swf\|html\|xmldocs\|hwp3\|archive\|image` | Activer/désactiver un format (`[=yes\|no]`) |
| `--scan-image-fuzzy-hash` | Hachage flou d'images |
| `--statistics=none\|bytecode\|pcre` | Statistiques d'exécution |
| `--nocerts` · `--dumpcerts` | Authenticode (PE) : désactiver / afficher la chaîne |

### Alertes (`[=yes|no]`)

`--alert-broken` (PE/ELF cassés), `--alert-encrypted` / `--alert-encrypted-archive` / `--alert-encrypted-doc`, `--alert-macros` (macros VBA OLE2), `--alert-exceeds-max`, `--alert-phishing-ssl`, `--alert-phishing-cloak`, `--alert-partition-intersection`.

### Limites de ressources (anti-*zip bomb*)

`--max-scantime` (ms, défaut 120000), `--max-filesize` (défaut 100 Mo), `--max-scansize` (400 Mo), `--max-files` (10000), `--max-recursion` (17), `--max-dir-recursion` (15), `--max-embeddedpe`, `--max-htmlnormalize`, `--max-htmlnotags`, `--max-scriptnormalize`, `--max-ziptypercg`, `--max-partitions`, `--max-iconspe`, `--max-rechwp3`, `--pcre-match-limit`, `--pcre-recmatch-limit`, `--pcre-max-filesize`.

## clamdscan — client du démon clamd

Accepte les options de clamscan mais en **ignore** la plupart (c'est `clamd` qui scanne selon `clamd.conf`).

```bash
clamdscan -m --fdpass -i /srv/partage         # multiscan, passage de descripteur, infectés seuls
clamdscan --config-file /etc/clamav/clamd.conf --reload
```

| Option | Rôle |
| --- | --- |
| `-c, --config-file=FICHIER` | Lire les réglages de clamd |
| `-m, --multiscan` | Analyse parallèle du contenu d'un répertoire |
| `--fdpass` | Ouvrir le fichier et passer le descripteur à clamd (socket local ; utile si clamd tourne sous un autre utilisateur) |
| `--stream` | Envoyer le contenu à clamd (au lieu du chemin) — débogage, obligatoire en TCP |
| `-z, --allmatch` | Continuer après une correspondance (incompatible avec `--multiscan`/`--stream`/`--fdpass` sur socket Unix) |
| `--remove` · `--move=DIR` · `--copy=DIR` | Quarantaine (effectuée par clamdscan, pas clamd) |
| `-p A[:I], --ping A[:I]` · `-w, --wait` | Attendre que clamd réponde / démarre |
| `--reload` | Demander à clamd de recharger la base |
| `-i` · `--no-summary` · `-l FICHIER` · `-f FICHIER` | Comme clamscan |

## freshclam — mise à jour des bases

```bash
freshclam                                 # une mise à jour
freshclam -d -c 24                         # démon, 24 vérifications/jour
```

| Option | Rôle |
| --- | --- |
| `-d, --daemon` · `-F, --foreground` · `-p, --pid=FICHIER` | Mode démon |
| `-c, --checks=N` (1–50) | Vérifications par jour |
| `--config-file=FICHIER` · `-l, --log=FICHIER` | Configuration · journal |
| `--datadir=DIR` | Répertoire d'installation des bases (absolu, accessible en écriture) |
| `-u, --user=UTILISATEUR` · `-a, --local-address=IP` | Utilisateur · IP source des téléchargements |
| `--daemon-notify=/chemin/clamd.conf` | Prévenir clamd des nouvelles bases |
| `--on-update-execute=CMD` · `--on-error-execute=CMD` · `--on-outdated-execute=CMD` | Déclencheurs (`%v` = nouvelle version ; `EXIT_n` accepté) |
| `--update-db=main\|daily\|bytecode\|safebrowsing\|<nom>` | Limiter aux bases voulues (répétable) |
| `--no-dns` · `--show-progress` · `--no-warnings` | Vérification sans DNS · progression · pas d'avertissements |

Variables : `CURL_CA_BUNDLE`, `FRESHCLAM_CLIENT_CERT`/`_KEY`/`_KEY_PASSWD`. Codes de retour spécifiques (extrait) : 52 problème réseau, 58 base illisible côté serveur, 59 miroirs désynchronisés.

## sigtool — signatures et bases

```bash
sigtool --info /var/lib/clamav/daily.cvd           # vérifier une base (MD5 + signature)
sigtool --unpack=/var/lib/clamav/main.cvd          # extraire le contenu
sigtool --md5 fichier.bin >> ma-base.hdb           # signature MD5
echo -n "chaine" | sigtool --hex-dump              # chaîne en hexadécimal
sigtool --find-sigs=REGEX | sigtool --decode-sigs  # retrouver puis décoder des signatures
```

| Domaine | Options |
| --- | --- |
| Lister / chercher | `-l, --list-sigs[=FICHIER]`, `-f, --find-sigs=REGEX`, `--decode-sigs`, `--test-sigs=BASE CIBLE` |
| Générer | `--md5`, `--sha1`, `--sha2-256` (`--sha256` déprécié), `--mdb` (hash de section PE), `--imp` (IAT), `--fuzzy-img` |
| Normaliser | `--html-normalise=F`, `--ascii-normalise=F`, `--utf16-decode=F` |
| Analyser | `--vba=F`, `--vba-hex=F`, `--print-certs=F`, `--hex-dump` |
| CVD | `-i, --info`, `-b, --build=F` (`--server`/`--unsigned`/`--hybrid`/`--cvd-version`/`--flevel`/`--no-cdiff`/`--max-bad-sigs`), `-u, --unpack=F`, `--unpack-current` |
| CDIFF | `-d, --diff=ANCIEN NOUVEAU`, `-c, --compare`, `-r, --run-cdiff=F`, `--verify-cdiff=F` |
| Signatures détachées | `--sign` (`--key`, `--cert`, `--append`), `--verify`, `--cvdcertsdir=DIR` |

## Démon et outils associés

```bash
clamd                                     # démon de scan (clamd.conf)
clamdtop                                  # tableau de bord temps réel du démon (connexions, files, hits)
clamconf                                  # afficher la configuration effective (clamd.conf + freshclam.conf)
clamconf -g clamd.conf > clamd.conf       # générer un fichier de configuration d'exemple
clamonacc                                 # analyse à l'accès (On-Access, via fanotify) — couple à clamd
clambc <fichier.cbc>                      # exécuteur/testeur de bytecode ClamAV
clamsubmit                                # soumettre un faux positif / un échantillon à ClamAV
cvdupdate                                 # (paquet Python) miroir privé des bases CVD pour un parc
```

- **clamd.conf** : `LocalSocket`, `TCPSocket`/`TCPAddr`, `MaxThreads`, `StreamMaxLength`, `OnAccessIncludePath`, `OnAccessPrevention`, `ExcludePath`, limites `Max*` (mêmes notions que clamscan).
- **On-Access** (`clamonacc` + `OnAccess*` dans clamd.conf) : analyse à la volée à l'ouverture/exécution des fichiers.

Intégrations (messagerie, partages, systemd, Docker, Windows) et exploitation : [[02-integrations-exploitation|intégrations et exploitation]] · aide-mémoire condensé : [[90-aide-memoire|aide-mémoire]].
