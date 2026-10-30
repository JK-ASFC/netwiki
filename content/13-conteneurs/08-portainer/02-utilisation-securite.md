---
title: Utilisation, droits, sauvegarde et dépannage
description: Utiliser Portainer au quotidien — piles Compose et déploiement GitOps depuis un dépôt Git, modèles d'applications, registres, utilisateurs, équipes et accès par environnement, authentification LDAP/Active Directory et OAuth, certificat de l'interface, sauvegarde et restauration, mise à jour, réinitialisation du mot de passe administrateur et problèmes fréquents.
tags: [portainer, stacks, gitops, ldap, oauth, rbac, sauvegarde, dépannage]
icon: settings-2
---

## Piles (stacks)

Une **pile** est un fichier Compose déployé par Portainer :

| Source | Usage |
| --- | --- |
| Éditeur web | Essais, petites piles |
| Fichier téléversé | Pile existante |
| **Dépôt Git** | Configuration versionnée ; **mise à jour automatique** par interrogation périodique ou webhook (GitOps) |

Les variables d'environnement d'une pile se saisissent dans l'interface (ou un fichier `.env` du dépôt) : n'écrivez pas de secrets dans le dépôt.

## Modèles et registres

- **App Templates** : catalogue d'applications prêtes à déployer (liste personnalisable par URL JSON).
- **Registries** : identifiants de registres privés (Harbor, GitLab, Docker Hub) utilisés lors des déploiements.

## Utilisateurs, équipes et droits

| Élément | Rôle |
| --- | --- |
| Utilisateur | Compte interne, LDAP ou OAuth |
| Équipe | Groupe d'utilisateurs (synchronisable avec les groupes LDAP) |
| Accès par environnement | Une équipe ne voit que les environnements qui lui sont attribués |
| Rôles (BE) | Administrateur d'environnement, opérateur, utilisateur standard, lecture seule… |
| Contrôle d'accès des ressources (CE) | Ressource publique (administrateurs), restreinte à des équipes, ou privée |

## Authentification centralisée

*Settings → Authentication* :

| Méthode | Paramètres principaux |
| --- | --- |
| **LDAP** | Serveur `ldaps://dc1.corp.exemple.fr:636`, compte de recherche, base de recherche (`OU=Utilisateurs,…`), filtre (`(&(objectClass=user)(memberOf=CN=GG_Portainer,…))`), attribut de nom `sAMAccountName`, synchronisation des groupes vers les équipes |
| **Microsoft Active Directory** | Assistant dédié (BE) |
| **OAuth / OIDC** | Entra ID, Keycloak, GitLab… (URL d'autorisation, de jeton, de profil, identifiant client) |

Conservez un compte administrateur **interne** de secours.

## Certificat de l'interface

*Settings → SSL certificate* : importer un certificat de l'AC d'entreprise (ou publier Portainer derrière un reverse proxy). Au démarrage : options `--sslcert` / `--sslkey` avec les fichiers montés dans le conteneur.

## Sauvegarde et restauration

- *Settings → Backup Portainer* : archive (chiffrable par mot de passe) de la configuration `/data` ; en BE, envoi planifié vers S3.
- Restauration : au premier lancement d'une nouvelle instance, choisir *Restore Portainer from backup*.
- Les **conteneurs et volumes** des environnements gérés ne sont pas dans cette sauvegarde : sauvegardez-les séparément.

## Mise à jour

```bash
docker pull portainer/portainer-ce:lts
docker stop portainer && docker rm portainer
docker run -d --name portainer --restart=always -p 9443:9443 -p 8000:8000 \
  -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:lts
```

Les données restent dans le volume `portainer_data`. Mettez à jour les **agents** vers la même version.

## Réinitialiser le mot de passe administrateur

```bash
docker stop portainer
docker run --rm -v portainer_data:/data portainer/helper-reset-password
docker start portainer
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| « Your Portainer instance timed out for security purposes » | Compte admin non créé dans les 5 minutes | Redémarrer le conteneur et créer le compte rapidement |
| Environnement « down » | Agent arrêté, port 9001 filtré, versions différentes | État de l'agent, pare-feu, même version serveur/agent |
| Agent Edge jamais connecté | Port 8000/9443 du serveur inaccessible depuis le site, URL publique incorrecte | *Settings → Edge Compute* (adresse publique), pare-feu |
| Pile Git non mise à jour | Identifiants du dépôt, intervalle de scrutation, webhook | Paramètres de la pile, journaux du serveur |
| Connexion LDAP refusée | Compte de recherche, filtre, certificat LDAPS | Bouton *Test connectivity*, AC de l'annuaire |
| `permission denied` sur le socket Docker (SELinux, Podman) | Contexte de sécurité | Options `--privileged` / `:z` selon la plate-forme |
