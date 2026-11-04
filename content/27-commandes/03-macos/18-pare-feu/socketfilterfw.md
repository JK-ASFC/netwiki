---
title: "socketfilterfw"
description: "macOS — socketfilterfw (Pare-feu applicatif (ALF)) : Pilote le pare-feu applicatif de macOS (celui du panneau Réglages > Réseau > Coupe-feu) : il autorise ou bloque par APPLICATION plutôt que par port. Souvent aliasé tant le chemin est long."
tags: [macos, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu applicatif (ALF) |
| **Commande type** | `/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate` |

## Rôle

Pilote le pare-feu applicatif de macOS (celui du panneau Réglages > Réseau > Coupe-feu) : il autorise ou bloque par APPLICATION plutôt que par port. Souvent aliasé tant le chemin est long.

## Options

| Option | Rôle |
| --- | --- |
| `--getglobalstate` | indique si le pare-feu est activé |
| `--setglobalstate ‹on/off›` | active ou désactive le pare-feu |
| `--getstealthmode` | état du mode furtif (la machine ignore les pings et scans) |
| `--setstealthmode ‹on/off›` | active/désactive le mode furtif |
| `--setblockall ‹on/off›` | bloque TOUTES les connexions entrantes (sauf services de base) |
| `--listapps` | liste les applications et leur autorisation |
| `--add ‹/chemin/app›` | ajoute une application aux règles |
| `--blockapp ‹/chemin/app›` | bloque les connexions entrantes d'une app |
| `--unblockapp ‹/chemin/app›` | autorise de nouveau une app |
| `--setloggingmode ‹on/off›` | active/désactive la journalisation |

## Exemples

**État du pare-feu**

```zsh
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

**Activer le pare-feu**

```zsh
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
```

**Activer le mode furtif**

```zsh
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setstealthmode on
```

**Lister les apps autorisées**

```zsh
/usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

*Mots-clés : pare-feu firewall applicatif socketfilterfw alf application furtif stealth bloquer réglages coupe-feu*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
