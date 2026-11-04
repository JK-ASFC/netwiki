---
title: "New-SelfSignedCertificate"
description: "PowerShell — New-SelfSignedCertificate (Cryptographie / PKI) : Génère un certificat auto-signe (tests, RDP, WinRM)."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Cryptographie / PKI |
| **Commande type** | `New-SelfSignedCertificate -DnsName srv.lan -CertStoreLocation Cert:\LocalMachine\My` |

## Rôle

Génère un certificat auto-signe (tests, RDP, WinRM).

## Options

| Option | Rôle |
| --- | --- |
| `-DnsName ‹nom›` | nom(s) |
| `-CertStoreLocation ‹chemin›` | magasin |
| `-NotAfter ‹date›` | date d'expiration : un objet DateTime PowerShell, ex (Get-Date).AddYears(2) |
| `-KeyUsage ‹usage›` | usages |

## Exemples

**Cert pour un service**

```powershell
New-SelfSignedCertificate -DnsName srv.lan -CertStoreLocation Cert:\LocalMachine\My
```

*Mots-clés : certificat auto-signe tls pki winrm rdp new-selfsignedcertificate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
