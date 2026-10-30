---
title: Softphones SIP (Windows, Linux, macOS, mobiles)
description: Choisir et configurer un softphone SIP — Linphone (toutes plateformes), MicroSIP (Windows), Zoiper, Bria, Jami, Telephone (macOS), Baresip et PJSUA (ligne de commande), applications des IPBX (3CX, Teams, Rainbow, MiCollab) ; paramètres de compte (domaine, transport TLS, SRTP, STUN), installation par OS, audio et casques, sécurité, tests en ligne de commande et dépannage.
tags: [softphone, linphone, microsip, zoiper, baresip, pjsua, sip, windows, linux, macos]
icon: laptop
---

## Panorama

| Logiciel | Windows | Linux | macOS | Android/iOS | Licence |
| --- | --- | --- | --- | --- | --- |
| **Linphone** | ✅ | ✅ | ✅ | ✅ | Libre (GPLv3) |
| **MicroSIP** | ✅ | — | — | — | Libre, très léger |
| **Zoiper** | ✅ | ✅ | ✅ | ✅ | Gratuit limité / payant |
| **Bria** | ✅ | — | ✅ | ✅ | Payant (abonnement) |
| **Jami** | ✅ | ✅ | ✅ | ✅ | Libre, pair-à-pair (comptes SIP aussi) |
| **Telephone** | — | — | ✅ | — | Libre |
| **Baresip** | ✅ | ✅ | ✅ | — | Libre, ligne de commande |
| **PJSUA** | ✅ | ✅ | ✅ | — | Libre (outil de test PJSIP) |
| Applications des IPBX | 3CX, [[10-teams-phone/01-teams-phone-direct-routing\|Teams]], Rainbow, MiCollab, Webex… | | | | Selon l'IPBX |

## Installation

```powershell
# Windows (winget)
winget install --id MicroSIP.MicroSIP -e
winget install --id BelledonneCommunications.Linphone -e
```

```bash
# Debian / Ubuntu
sudo apt install linphone-desktop baresip
# Fedora
sudo dnf install linphone-desktop
# Flatpak (toutes distributions)
flatpak install flathub com.belledonnecommunications.linphone
```

```bash
# macOS (Homebrew)
brew install --cask linphone
brew install baresip
```

Si un identifiant de paquet a changé, recherchez-le : `winget search linphone`, `apt search linphone`, `brew search linphone`.

## Paramètres d'un compte SIP

| Paramètre | Exemple | Remarque |
| --- | --- | --- |
| Identifiant / numéro | `1001` | — |
| Identifiant d'authentification | `1001` | Parfois différent du numéro |
| Mot de passe | (fourni par l'administrateur) | Jamais transmis par courriel en clair |
| Domaine / serveur | `pbx.exemple.fr` | FQDN pour TLS |
| Transport | **TLS** (port 5061) | UDP uniquement sur le LAN |
| Chiffrement média | **SRTP** obligatoire | — |
| STUN / ICE | `stun.exemple.fr` | Hors du LAN sans VPN ni SBC |
| Codecs | Opus, G.722, G.711 A-law | Opus pour les réseaux instables |

## Ligne de commande : tests et automatisation

```bash
# PJSUA : enregistrer un compte et appeler un numéro (sans carte son)
pjsua --id sip:1001@pbx.exemple.fr --registrar sip:pbx.exemple.fr \
      --realm '*' --username 1001 --password 'Xq7vR2pL9mZt4KwBn3Hs' \
      --null-audio sip:1002@pbx.exemple.fr
```

```bash
# Baresip : compte dans ~/.baresip/accounts
echo '<sip:1001@pbx.exemple.fr;transport=tls>;auth_pass=Xq7vR2pL9mZt4KwBn3Hs;mediaenc=srtp-mand' >> ~/.baresip/accounts
baresip
# dans baresip : /dial 1002   puis   /hangup   /quit
```

## Audio et confort

- Casque **USB ou DECT** filaire de préférence ; le Bluetooth ajoute de la latence et bascule parfois en qualité « mains libres ».
- Annulation d'écho activée dans le softphone, désactivée dans les « améliorations » du pilote si elles entrent en conflit.
- Désactiver les économies d'énergie de la carte Wi-Fi et du réseau pendant les appels (Windows : gestion de l'alimentation de l'adaptateur).

## Sécurité

- [ ] Compte SIP dédié au softphone (pas celui du poste de bureau), mot de passe propre
- [ ] TLS + SRTP, ou VPN, hors du réseau de l'entreprise
- [ ] Mot de passe non enregistré sur des postes partagés
- [ ] Mises à jour automatiques activées (le client est une surface d'attaque, voir l'incident 3CX de 2023)

## Dépannage

| Symptôme | Piste |
| --- | --- |
| `408` / pas d'enregistrement | DNS, transport, pare-feu local (Windows Defender : autoriser l'application) |
| Audio absent hors du bureau | NAT : activer STUN/ICE, passer par le VPN ou un SBC |
| Voix hachée | Wi-Fi, charge CPU, Opus avec correction d'erreurs (FEC) |
| Micro inactif (macOS) | Autoriser l'accès au micro : *Réglages Système → Confidentialité et sécurité → Microphone* |

Analyse détaillée : [[15-diagnostic-voip/01-sngrep-wireshark-sipp|outils de diagnostic VoIP]].
