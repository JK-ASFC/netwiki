---
title: Realm
description: Realm — base de données objet embarquée pour applications mobiles et de bureau (Android, iOS, .NET, Flutter, React Native, Node.js), composants communautaires (Apache 2.0) : modèle objet, fichiers .realm, chiffrement, migrations de schéma, Realm Studio pour inspecter et modifier les fichiers, fin du service MongoDB Atlas Device Sync (2025) et alternatives (SQLite, PowerSync, ObjectBox).
tags: [realm, mobile, base embarquée, android, ios, realm studio]
icon: info
---

**Realm** stocke des **objets** directement dans un fichier `.realm` au sein d'une application mobile ou de bureau, avec mises à jour réactives de l'interface. Racheté par MongoDB, il servait de client hors ligne à **Atlas Device Sync** ; MongoDB a déprécié ce service (fin en 2025) et les SDK Realm sont désormais maintenus par la communauté.

Pour l'administrateur ou le support, Realm apparaît surtout lors du **diagnostic d'une application** : examiner ou corriger un fichier `.realm` récupéré sur un poste ou un appareil.

## Realm Studio

Application de bureau (Windows, macOS, Linux) depuis les versions GitHub `realm/realm-studio` : ouvrir un fichier `.realm` (clé de chiffrement de 64 octets en hexadécimal si l'application chiffre), parcourir les classes, modifier ou exporter (CSV, schéma).

<!-- CAPTURE: Realm Studio — ouverture d'un fichier .realm et vue des objets | _assets/realm-studio.png -->

## Points d'attention

- Les fichiers sont liés à une **version de format** : une ancienne version de Studio ne lit pas un fichier écrit par un SDK récent (et inversement, l'ouverture peut **mettre à jour** le format — travailler sur une copie).
- Chiffrement AES-256 optionnel ; la clé est gérée par l'application (Keychain/Keystore).
- Nouveau projet : SQLite (avec Room, GRDB, Drift…), ou des solutions de synchronisation maintenues (PowerSync, ObjectBox, Couchbase Lite).

Commandes : [[90-aide-memoire|aide-mémoire]].
