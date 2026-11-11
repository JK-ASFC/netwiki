---
title: Documenso, OpenSign et LibreSign
description: Signature électronique auto-hébergée — notions (signature simple, avancée, qualifiée au sens d'eIDAS, piste d'audit, certificat de signature PAdES, horodatage) puis Documenso (AGPL : Next.js, PostgreSQL, certificat .p12 de signature, SMTP, modèles, liens directs, API et webhooks, Docker port 3000), OpenSign (AGPL : Node.js et MongoDB, modèles, signataires multiples, rappels, Docker Compose) et LibreSign (application Nextcloud : signature PDF avec certificats via OpenSSL ou CFSSL, demande de signature, validation) ; valeur juridique et choix.
tags: [documenso, opensign, libresign, signature électronique, eidas, pdf, nextcloud, docusign]
icon: signature
---

Ces outils remplacent DocuSign ou Yousign pour faire **signer en ligne** contrats, bons de commande, chartes ou procès-verbaux, tout en gardant les documents sur ses serveurs.

## Valeur juridique (eIDAS)

| Niveau | Principe | Exemple |
| --- | --- | --- |
| **Simple** | Consentement exprimé électroniquement + piste d'audit | Signature par lien envoyé par courriel |
| **Avancée** | Liée au signataire de façon unique, identification renforcée, détection de toute modification | Certificat personnel, vérification d'identité |
| **Qualifiée** | Avancée + certificat qualifié délivré par un prestataire de confiance qualifié | Équivalente à la signature manuscrite |

Les outils auto-hébergés produisent en général une **signature simple** solide : le PDF final est **scellé** par un certificat de la plate-forme (PAdES), accompagné d'un **certificat d'audit** (adresses, horodatages, adresses IP, empreintes). Cela suffit pour la plupart des documents courants ; certains actes exigent un niveau avancé ou qualifié via un prestataire qualifié.

## Documenso

**Documenso** (AGPL) est l'alternative libre la plus aboutie à DocuSign : interface moderne, signataires multiples et ordonnés, champs (signature, date, texte, case), modèles, liens de signature directs, équipes, API et webhooks.

```bash
# Certificat de scellement des PDF (auto-signé ou délivré par une AC)
openssl req -x509 -newkey rsa:4096 -keyout cle.pem -out cert.pem -days 1095 -nodes -subj "/CN=Signature Exemple SA"
openssl pkcs12 -export -out signature.p12 -inkey cle.pem -in cert.pem -passout pass:'…'

docker run -d --name documenso -p 127.0.0.1:3000:3000 \
  -v /srv/documenso/signature.p12:/opt/documenso/cert.p12:ro \
  -e NEXTAUTH_SECRET='…' -e NEXT_PRIVATE_ENCRYPTION_KEY='…' -e NEXT_PRIVATE_ENCRYPTION_SECONDARY_KEY='…' \
  -e NEXT_PUBLIC_WEBAPP_URL=https://signature.exemple.fr \
  -e NEXT_PRIVATE_DATABASE_URL='postgresql://documenso:…@db:5432/documenso' \
  -e NEXT_PRIVATE_DIRECT_DATABASE_URL='postgresql://documenso:…@db:5432/documenso' \
  -e NEXT_PRIVATE_SIGNING_PASSPHRASE='…' \
  -e NEXT_PRIVATE_SMTP_TRANSPORT=smtp-auth -e NEXT_PRIVATE_SMTP_HOST=smtp.exemple.fr -e NEXT_PRIVATE_SMTP_PORT=587 \
  -e NEXT_PRIVATE_SMTP_USERNAME=signature -e NEXT_PRIVATE_SMTP_PASSWORD='…' \
  -e NEXT_PRIVATE_SMTP_FROM_ADDRESS=signature@exemple.fr -e NEXT_PRIVATE_SMTP_FROM_NAME="Signature Exemple" \
  documenso/documenso:latest
```

Le dépôt fournit un fichier Docker Compose complet (application + PostgreSQL). Désactiver l'inscription publique (`NEXT_PUBLIC_DISABLE_SIGNUP=true`) une fois les comptes créés.

## OpenSign

**OpenSign** (AGPL) offre des fonctions proches : signataires multiples, ordre de signature, rappels automatiques, modèles, champs, signature par dessin, saisie ou image, certificat de complétion.

```bash
git clone https://github.com/OpenSignLabs/OpenSign && cd OpenSign
cp .env.local_dev .env              # adapter : URL publique, clé maître, MongoDB, SMTP, stockage (local ou S3)
docker compose up -d                 # client web, serveur (Parse Server / Node.js), MongoDB
```

## LibreSign (Nextcloud)

**LibreSign** (AGPL) est une **application Nextcloud** : on demande la signature d'un PDF stocké dans Nextcloud, les signataires (internes ou externes) signent dans le navigateur.

```bash
sudo -u www-data php occ app:install libresign
sudo -u www-data php occ libresign:install --java --pdftk --jsignpdf     # dépendances de signature
sudo -u www-data php occ libresign:configure:openssl --cn="Signature Exemple" --o="Exemple SA" --c=FR
```

- Une **autorité racine** interne (OpenSSL ou CFSSL) délivre un certificat à chaque signataire : la signature PDF est cryptographique (vérifiable dans Acrobat ou LibreSign).
- Page de **validation** publique d'un document signé (QR code apposé).
- Idéal si les documents vivent déjà dans [[09-fichiers-partage/08-nextcloud/01-presentation-installation|Nextcloud]].

## Choisir

| Besoin | Outil |
| --- | --- |
| Remplacer DocuSign, signataires externes nombreux | Documenso |
| Fonctions comparables, rappels, MongoDB | OpenSign |
| Documents déjà dans Nextcloud, certificats par signataire | LibreSign |
| Signature qualifiée (actes sensibles) | Prestataire de confiance qualifié (liste de confiance européenne) |

Dans tous les cas : sauvegarder la base **et** les PDF signés avec leurs certificats d'audit, protéger la clé de scellement (droits stricts, coffre de secrets) et synchroniser l'horloge (NTP) pour des horodatages fiables.

Voir aussi : [[02-stirling-pdf-gotenberg|Stirling-PDF et Gotenberg]]. Commandes : [[90-aide-memoire|aide-mémoire]].
