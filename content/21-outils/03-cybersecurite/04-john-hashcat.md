---
title: John the Ripper et Hashcat — audit de mots de passe
description: Auditer la robustesse des mots de passe avec John the Ripper et Hashcat dans un cadre autorisé — principes (empreintes, sel, coût), formats courants (NTLM, Kerberos, bcrypt, sha512crypt, archives), attaques par dictionnaire, règles, masques et hybrides, GPU, alternative défensive DSInternals pour Active Directory (mots de passe faibles, réutilisés, divulgués), traitement des résultats et protection des données.
tags: [john the ripper, hashcat, mots de passe, audit, ntlm, dsinternals, active directory]
icon: key-round
---

**John the Ripper** (*Jumbo*, GPL) et **Hashcat** (MIT) testent des mots de passe candidats contre des **empreintes** : ils mesurent combien de mots de passe d'un ensemble résisteraient à un attaquant qui aurait volé la base. Hashcat exploite massivement les **GPU** ; John reconnaît un très grand nombre de formats et extrait les empreintes de fichiers (archives, coffres, clés).

> [!IMPORTANT]
> **Cadre strict** : un audit de mots de passe se fait sur **mandat écrit** (direction, RSSI, DPO), sur des empreintes obtenues légitimement, sur une machine isolée et chiffrée, avec destruction des empreintes et des résultats en fin de mission. Ne jamais afficher ni stocker les mots de passe trouvés en clair dans un rapport : seulement des **statistiques** et la liste des comptes à faire changer.

## Principes

| Notion | Effet sur l'audit |
| --- | --- |
| Empreinte rapide sans sel (**NTLM**, MD5) | Des milliards d'essais par seconde sur GPU : les mots de passe courts ou prévisibles tombent vite |
| Empreinte lente avec sel (**bcrypt**, sha512crypt, PBKDF2, Argon2) | Quelques milliers d'essais par seconde : seuls les mots de passe très faibles tombent |
| Politique de mot de passe | La longueur compte davantage que la complexité imposée (« Printemps2026! » respecte la complexité mais tombe en quelques secondes avec des règles) |

## Utilisation

```bash
# John : détection automatique du format, dictionnaire + règles
john --wordlist=/srv/audit/listes/fr-courants.txt --rules=Jumbo empreintes.txt
john --show empreintes.txt | tail -1             # bilan (à ne pas conserver en clair)
zip2john archive.zip > archive.hash               # extraire l'empreinte d'un fichier protégé (mot de passe oublié)

# Hashcat : -m = type d'empreinte, -a = mode d'attaque
hashcat -m 1000 -a 0 ntlm.txt fr-courants.txt -r rules/best66.rule        # NTLM, dictionnaire + règles
hashcat -m 1000 -a 3 ntlm.txt ?u?l?l?l?l?l?d?d?d?d                          # masque : Majuscule + 5 minuscules + 4 chiffres
hashcat -m 1000 -a 6 ntlm.txt entreprise.txt ?d?d?d?d?s                     # hybride : mot de la liste + 4 chiffres + symbole
hashcat -m 3200 -a 0 bcrypt.txt fr-courants.txt                              # bcrypt (lent)
hashcat --show -m 1000 ntlm.txt --username | wc -l
```

| Mode Hashcat (`-m`) | Format |
| --- | --- |
| 1000 | NTLM (Windows) |
| 13100 | Kerberos 5 TGS-REP (*Kerberoasting* : comptes de service avec SPN) |
| 18200 | Kerberos AS-REP (comptes sans pré-authentification) |
| 1800 | sha512crypt (`$6$`, Linux) |
| 3200 | bcrypt |
| 22000 | WPA-PBKDF2 (Wi-Fi WPA2-PSK) |

Dictionnaires : listes de mots de passe divulgués (rockyou, listes françaises), **dictionnaire de l'entreprise** (nom, produits, villes, saisons, équipes sportives locales) + **règles** (majuscule initiale, chiffres et année en fin, substitutions).

## Alternative défensive pour Active Directory : DSInternals

Pour mesurer la qualité des mots de passe AD **sans les casser**, le module PowerShell **DSInternals** compare les empreintes à des listes de mots de passe interdits et divulgués (base *Have I Been Pwned* en empreintes NTLM), et détecte les mots de passe **réutilisés** entre comptes, vides, ou les comptes administrateurs sans protection.

```powershell
Install-Module DSInternals
# Sur une copie de la base AD (sauvegarde IFM d'un DC, dans le cadre du mandat), hors production
$cle = Get-BootKey -SystemHiveFilePath 'D:\Audit\IFM\registry\SYSTEM'
Get-ADDBAccount -All -DatabasePath 'D:\Audit\IFM\Active Directory\ntds.dit' -BootKey $cle |
  Test-PasswordQuality -WeakPasswordHashesSortedFile 'D:\Audit\pwned-passwords-ntlm-ordered-by-hash.txt' -IncludeDisabledAccounts |
  Out-File D:\Audit\rapport-qualite.txt
```

Le rapport liste les comptes concernés (mot de passe divulgué, partagé, n'expire jamais, stocké de façon réversible…) sans révéler les mots de passe.

## Après l'audit

- Forcer le changement des comptes trouvés ; traiter en priorité les comptes **privilégiés** et de **service** (gMSA quand c'est possible).
- Renforcer la politique : longueur minimale (14+), **liste de mots de passe interdits** (Microsoft Entra Password Protection, filtres), MFA, sensibilisation.
- Rejouer l'audit périodiquement et comparer les statistiques.
- Détruire de façon sûre empreintes, copies de la base et résultats.

Voir aussi [[01-active-directory/09-securite-durcissement|sécurité d'Active Directory]].
