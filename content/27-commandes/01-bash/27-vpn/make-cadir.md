---
title: "make-cadir"
description: "Bash — make-cadir (OpenVPN / PKI) : Crée un espace de travail Easy-RSA autonome, prêt à recevoir une PKI."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | OpenVPN / PKI |
| **Commande type** | `make-cadir ~/easy-rsa` |

## Rôle

Crée un espace de travail Easy-RSA autonome, prêt à recevoir une PKI.

## Options

| Option | Rôle |
| --- | --- |
| `‹dossier›` | crée le dossier et y place les liens vers Easy-RSA |
| `(contenu créé)` | easyrsa, vars.example, x509-types/, openssl-easyrsa.cnf |
| `(étape suivante)` | cp vars.example vars, puis ./easyrsa init-pki |
| `(pourquoi)` | isole la PKI des fichiers du paquet, qu'une mise à jour écraserait |

## Exemples

**Créer l'espace de travail**

```bash
make-cadir ~/easy-rsa
```

**S'y placer et préparer vars**

```bash
cd ~/easy-rsa && cp vars.example vars
```

**Enchaîner sur la PKI**

```bash
./easyrsa init-pki
```

## Dans les autres shells

- [[27-commandes/03-macos/28-vpn/make-cadir|make-cadir (macOS)]]

*Mots-clés : easyrsa pki ca autorité dossier vars openvpn certificat espace travail*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
