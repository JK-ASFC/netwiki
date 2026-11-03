---
title: "MDPrivateKeys"
description: "Directive Apache MDPrivateKeys (mod_md) — Définit le type et la taille des clés privées générées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le type et la taille des clés privées générées. |
| **Syntaxe** | `MDPrivateKeys type [ params... ]` |
| **Valeur par défaut** | `MDPrivateKeys RSA 2048` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive permet de définir les paramètres de construction des clés privées pour les domaines gérés. Vous pouvez configurer plusieurs types de clés privées et le module obtiendra un certificat pour chaque clé.

La recommandation actuelle (en 2017) est de 2048 bits au minimum, et une valeur inférieure ne sera pas acceptée. Des valeurs supérieures offriront une plus grande sécurité mais seront plus gourmandes en ressources, et augmenteront donc la charge de votre serveur, ce qui pourra (ou non) être gênant pour vous.

D'autres types de clés seront supportés dans le futur. Vous pouvez par exemple configurer une clé RSA et une clé Elliptic Curve (EC) de façon à ce que deux certificats soient créés pour le domaine concerné. Lors d'une connexion avec un client, c'est la première clé supportée par ce dernier qui sera utilisée.

Comme les clés et certificats EC sont plus petits, vous pouvez les proposer en premier pour tous les clients modernes compatibles, ce qui peut accélérer la phase de négociation. Ajoutez tout de même une clé RSA pour supporter les clients plus anciens.

**Exemple**

```apache
MDPrivateKeys secp256r1 rsa3072
```

Les types EC supportés dépendent du CA que vous utilisez. Par exemple, Let's encrypt supporte les courbes elliptiques 'secp256r1' et 'secp384r1'.

Chaque type de clé et certificat est stocké dans son fichier propre au sein de l'espace de stockage MD. Le type de clé constitue une partie du nom de fichier avec une convention de nommage présentant une compatibilité ascendante avec les certificats RSA. Vous pouvez ainsi continuer à partager ces fichiers avec les autres applications.

Notez que cette directive n'aura d'effet que sur les nouvelles clés. Toute clé préexistante ne sera pas affectée. En outre, seules les clés privées générées pour les certificats sont concernées, les clés de comptes ACME n'étant pas affectées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
