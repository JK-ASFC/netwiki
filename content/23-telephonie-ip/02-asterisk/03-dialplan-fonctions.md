---
title: Asterisk — dialplan et fonctions téléphoniques
description: Écrire le dialplan d'Asterisk (extensions.conf) — contextes, extensions et motifs, priorités et same, variables et fonctions, appels internes, messagerie vocale, routes sortantes avec restrictions (national, international, urgences), appels entrants par SDA, serveur vocal interactif (Background, WaitExten), horaires (GotoIfTime), files d'attente (queues.conf), conférences (ConfBridge), interception, parcage, transfert, enregistrement (MixMonitor), sous-programmes (Gosub), AstDB et commandes CLI associées.
tags: [asterisk, dialplan, extensions.conf, svi, ivr, queue, voicemail, confbridge]
icon: workflow
---

## Structure

Le dialplan est organisé en **contextes** (`[interne]`), qui contiennent des **extensions** (numéros ou motifs), elles-mêmes composées de **priorités** exécutées dans l'ordre. Le contexte d'un endpoint (`context=interne` dans PJSIP) détermine **ce qu'il a le droit d'appeler** : c'est la base de la sécurité.

```asterisk
; /etc/asterisk/extensions.conf
[general]
static=yes
writeprotect=yes

[globals]
TRUNK=operateur
NUM_STANDARD=0123456789
```

| Motif | Correspond à |
| --- | --- |
| `_X` / `_Z` / `_N` | Un chiffre 0-9 / 1-9 / 2-9 |
| `_[1-5]` | Un chiffre de l'ensemble |
| `.` | Un ou plusieurs caractères |
| `!` | Zéro ou plusieurs caractères (numérotation anticipée) |
| `_1XXX` | Numéros internes 1000 à 1999 |
| `_0[1-79]XXXXXXXX` | Numéros nationaux français (hors 08) |

| Extensions spéciales | Usage |
| --- | --- |
| `s` | Début (pas de numéro composé, ex. SVI) |
| `i` / `t` | Choix invalide / délai dépassé |
| `h` | Exécutée au raccrochage |

## Appels internes et messagerie

```asterisk
[interne]
include => sorties-nationales
include => fonctions

exten => _1XXX,1,NoOp(Appel interne de ${CALLERID(num)} vers ${EXTEN})
 same => n,GotoIf(${DB_EXISTS(renvoi/${EXTEN})}?renvoi)
 same => n,Dial(PJSIP/${EXTEN},20,tTkK)
 same => n,GotoIf($["${DIALSTATUS}" = "BUSY"]?occupe)
 same => n,VoiceMail(${EXTEN}@default,u)
 same => n,Hangup()
 same => n(occupe),VoiceMail(${EXTEN}@default,b)
 same => n,Hangup()
 same => n(renvoi),Dial(Local/${DB_RESULT}@interne,30)
 same => n,Hangup()
```

| Élément | Explication |
| --- | --- |
| `same => n` | Priorité suivante de la même extension |
| `Dial(PJSIP/1002,20,tTkK)` | Appeler 20 s ; `t`/`T` autorisent le transfert, `k`/`K` le parcage |
| `${DIALSTATUS}` | `ANSWER`, `BUSY`, `NOANSWER`, `CHANUNAVAIL`, `CONGESTION` |
| `VoiceMail(1001@default,u)` | Messagerie avec annonce « indisponible » (`b` : « occupé ») |

```ini
; /etc/asterisk/voicemail.conf
[general]
format=wav
attach=yes
serveremail=telephonie@exemple.fr
maxmsg=100
maxsecs=180

[default]
1001 => 4826,Alice Martin,alice.martin@exemple.fr
1002 => 7391,Bruno Petit,bruno.petit@exemple.fr
```

## Fonctions utilisateur

```asterisk
[fonctions]
; consulter sa messagerie
exten => *97,1,VoiceMailMain(${CALLERID(num)}@default)
 same => n,Hangup()
; conférence
exten => 800,1,Answer()
 same => n,ConfBridge(800,default_bridge,default_user)
; parcage et reprise (res_parking : 701-720 par défaut)
exten => 700,1,Park()
; interception d'un poste qui sonne
exten => _*8XXXX,1,PickupChan(PJSIP/${EXTEN:2})
; écho (test de la voix et du délai)
exten => *43,1,Answer()
 same => n,Playback(demo-echotest)
 same => n,Echo()
; renvoi inconditionnel : *21*numéro / annulation : #21
exten => _*21*X.,1,Set(DB(renvoi/${CALLERID(num)})=${EXTEN:4})
 same => n,Playback(beep)
 same => n,Hangup()
exten => #21,1,NoOp(${DB_DELETE(renvoi/${CALLERID(num)})})
 same => n,Playback(beep)
 same => n,Hangup()
```

`${EXTEN:4}` retire les 4 premiers caractères ; `DB()` lit/écrit dans la base interne **AstDB** (`database show renvoi`) ; l'extension `_1XXX` vérifie le renvoi avec `DB_EXISTS()` avant de faire sonner le poste.

## Routes sortantes et restrictions

Séparez les droits en contextes que vous incluez selon les profils :

```asterisk
[sorties-nationales]
; urgences : toujours autorisées
exten => _1[578],1,Goto(urgence,${EXTEN},1)
exten => 112,1,Goto(urgence,${EXTEN},1)
exten => 114,1,Goto(urgence,${EXTEN},1)
; national (hors numéros surtaxés 08)
exten => _0[1-79]XXXXXXXX,1,Set(CALLERID(num)=${NUM_STANDARD})
 same => n,Dial(PJSIP/${EXTEN}@${TRUNK},60)
 same => n,Hangup()

[sorties-internationales]
exten => _00Z.,1,NoOp(International autorisé pour ${CALLERID(num)})
 same => n,Set(GROUP(international)=sortant)
 same => n,GotoIf($[${GROUP_COUNT(international)} > 2]?limite)
 same => n,Dial(PJSIP/${EXTEN}@${TRUNK},60)
 same => n,Hangup()
 same => n(limite),Playback(all-circuits-busy-now)
 same => n,Hangup()

[urgence]
exten => _X.,1,Dial(PJSIP/${EXTEN}@${TRUNK})
 same => n,Hangup()
```

Un profil « direction » inclut `sorties-internationales` ; les autres non. La limite `GROUP_COUNT` plafonne les appels internationaux simultanés (protection contre la fraude).

## Appels entrants, horaires et SVI

```asterisk
[entrant]
; SDA directes
exten => 0123456701,1,Goto(interne,1001,1)
exten => 0123456702,1,Goto(interne,1002,1)
; numéro principal → serveur vocal
exten => 0123456789,1,Goto(svi,s,1)
exten => _X.,1,Goto(svi,s,1)

[svi]
exten => s,1,Answer()
 same => n,Set(CHANNEL(language)=fr)
 same => n,GotoIfTime(08:30-18:00,mon-fri,*,*?ouvert,1)
 same => n,Playback(custom/fermeture)
 same => n,VoiceMail(1000@default,u)
 same => n,Hangup()

exten => ouvert,1,Background(custom/bienvenue)
 same => n,WaitExten(5)

exten => 1,1,Queue(commercial,t,,,120)
 same => n,VoiceMail(1000@default,u)
 same => n,Hangup()
exten => 2,1,Dial(PJSIP/1010,30)
 same => n,VoiceMail(1010@default,u)
exten => i,1,Playback(option-is-invalid)
 same => n,Goto(svi,ouvert,1)
exten => t,1,Goto(svi,ouvert,1)
```

Les annonces personnalisées (`custom/bienvenue`) se déposent dans `/var/lib/asterisk/sounds/fr/custom/` (WAV 8 kHz mono 16 bits ou format natif `.alaw`/`.g722`). Les jours fériés s'ajoutent par des `GotoIfTime` supplémentaires (`*,*,25,dec`) ou une table dans AstDB.

## Files d'attente

```ini
; /etc/asterisk/queues.conf
[general]
persistentmembers=yes

[commercial]
strategy=rrmemory
timeout=20
retry=5
wrapuptime=10
maxlen=20
musicclass=default
announce-frequency=60
announce-holdtime=yes
joinempty=no
leavewhenempty=yes
member => PJSIP/1001
member => PJSIP/1002
```

| Stratégie | Distribution |
| --- | --- |
| `ringall` | Tous les membres sonnent |
| `rrmemory` | Tour de rôle, en reprenant après le dernier |
| `leastrecent` / `fewestcalls` | Le moins récemment / le moins sollicité |
| `random` | Aléatoire |
| `linear` | Ordre de déclaration |

## Enregistrement et sous-programmes

```asterisk
[sous-programmes]
exten => enregistrer,1,Set(FICHIER=${STRFTIME(${EPOCH},,%Y%m%d-%H%M%S)}-${CALLERID(num)}-${UNIQUEID})
 same => n,MixMonitor(${FICHIER}.wav,b)
 same => n,Return()
```

Appel depuis une route : `same => n,Gosub(sous-programmes,enregistrer,1)` avant le `Dial`. Les fichiers vont dans `/var/spool/asterisk/monitor/` ; informez les interlocuteurs (obligation légale) et purgez selon la durée de conservation définie.

## Transfert et fonctionnalités

```ini
; /etc/asterisk/features.conf
[featuremap]
blindxfer => #1
atxfer => *2
automixmon => *3
```

Ces codes sont actifs pendant l'appel si les options `t`/`T` (transfert) ou `x`/`X` (enregistrement) sont passées à `Dial`. Les postes IP proposent aussi leurs propres touches de transfert (via `REFER`).

## Commandes CLI du dialplan

| Commande | Usage |
| --- | --- |
| `dialplan reload` | Recharger `extensions.conf` |
| `dialplan show interne` | Afficher un contexte |
| `dialplan show 0612345678@interne` | Quelle extension correspond à un numéro dans un contexte |
| `queue show commercial` | État d'une file (membres, appels en attente) |
| `queue add member PJSIP/1003 to commercial` / `queue pause member PJSIP/1003` | Gérer les membres |
| `voicemail show users` | Boîtes vocales |
| `confbridge list` / `confbridge kick 800 all` | Conférences |
| `database show renvoi` / `database put renvoi 1001 0612345678` | AstDB |
| `channel originate PJSIP/1001 extension 1002@interne` | Déclencher un appel de test |
| `core show applications` / `core show application Dial` | Aide sur les applications |
| `core show functions` / `core show function CALLERID` | Aide sur les fonctions |

Suite : [[04-securite-exploitation-cli|sécurité, exploitation et CLI]].
