---
title: LDAP / Active Directory et sécurité
description: Connecter GitLab à Active Directory (configuration LDAP dans gitlab.rb, filtre de groupe, vérification avec gitlab-rake), synchronisation des groupes (EE), SSO SAML/OIDC, rôles et visibilité des projets, branches protégées et approbations, jetons d'accès, double authentification, restrictions d'inscription et durcissement de l'instance.
tags: [gitlab, ldap, active directory, saml, sécurité, 2fa, branches protégées, jetons]
icon: shield-check
---

## Active Directory par LDAP

```gitlabrb /etc/gitlab/gitlab.rb
gitlab_rails['ldap_enabled'] = true
gitlab_rails['prevent_ldap_sign_in'] = false
gitlab_rails['ldap_servers'] = {
  'main' => {
    'label' => 'Compte de l\'entreprise',
    'host' => 'dc1.corp.exemple.fr',
    'port' => 636,
    'encryption' => 'simple_tls',
    'verify_certificates' => true,
    'tls_options' => { 'ca_file' => '/etc/gitlab/trusted-certs/ac-ad.crt' },
    'uid' => 'sAMAccountName',
    'bind_dn' => 'CN=svc_gitlab,OU=Services,DC=corp,DC=exemple,DC=fr',
    'password' => 'MotDePasseCompteService',
    'active_directory' => true,
    'base' => 'OU=Utilisateurs,DC=corp,DC=exemple,DC=fr',
    'user_filter' => '(memberOf:1.2.840.113556.1.4.1941:=CN=GG_GitLab,OU=Groupes,DC=corp,DC=exemple,DC=fr)',
    'lowercase_usernames' => true,
    'attributes' => { 'username' => ['sAMAccountName'], 'email' => ['mail'], 'name' => 'cn' }
  }
}
```

```bash
sudo gitlab-ctl reconfigure
sudo gitlab-rake gitlab:ldap:check          # liste les premiers utilisateurs trouvés
```

- Le filtre `memberOf:1.2.840.113556.1.4.1941:=` inclut les **groupes imbriqués** (règle de correspondance AD).
- Un utilisateur désactivé ou retiré du groupe AD est **bloqué** par GitLab lors de la vérification périodique.
- Placez l'AC de l'annuaire dans `/etc/gitlab/trusted-certs/` (prise en compte au `reconfigure`).
- Le mot de passe du compte de service peut être stocké chiffré : `gitlab-rake gitlab:ldap:secret:edit`.

| Fonction | Édition |
| --- | --- |
| Authentification LDAP / AD | CE et EE |
| **Synchronisation des groupes** AD → groupes GitLab (`group_base`, *LDAP Group Sync*) | EE Premium |
| SAML / OIDC (Entra ID, Keycloak, ADFS) | CE (instance), EE (groupes) |

```gitlabrb Exemple OIDC (Keycloak / Entra ID)
gitlab_rails['omniauth_allow_single_sign_on'] = ['openid_connect']
gitlab_rails['omniauth_block_auto_created_users'] = false
gitlab_rails['omniauth_providers'] = [
  {
    name: "openid_connect",
    label: "SSO entreprise",
    args: {
      name: "openid_connect",
      scope: ["openid", "profile", "email"],
      response_type: "code",
      issuer: "https://sso.corp.exemple.fr/realms/infra",
      discovery: true,
      client_auth_method: "query",
      uid_field: "preferred_username",
      pkce: true,
      client_options: {
        identifier: "gitlab",
        secret: "SecretClient",
        redirect_uri: "https://gitlab.corp.exemple.fr/users/auth/openid_connect/callback"
      }
    }
  }
]
```

## Rôles et visibilité

| Rôle | Droits principaux |
| --- | --- |
| Guest | Tickets, lecture limitée |
| Reporter | Lecture du code, tickets |
| **Developer** | Push sur les branches non protégées, demandes de fusion, pipelines |
| **Maintainer** | Fusion dans les branches protégées, paramètres du projet, variables CI |
| Owner | Gestion du groupe/projet, suppression |

Visibilité des projets : **privé** (membres), **interne** (tout utilisateur connecté), public (à désactiver sur une instance d'entreprise : *Admin → Settings → Visibility*).

## Protéger le code

| Réglage (projet) | Effet |
| --- | --- |
| Branches protégées (`main`) | Push interdit, fusion réservée aux Maintainers |
| Règles d'approbation | N approbations requises (EE : règles par fichier, `CODEOWNERS`) |
| *Pipelines must succeed* | Fusion seulement si la CI réussit |
| Étiquettes protégées (`v*`) | Création réservée |
| Push rules (EE) | Messages, taille des fichiers, secrets interdits |

## Jetons et accès machine

| Type | Usage |
| --- | --- |
| Jeton d'accès **personnel** | Scripts d'un utilisateur (portée et expiration limitées) |
| Jeton d'accès de **projet / groupe** | Automatisations rattachées à un projet (compte robot) |
| **Clés de déploiement** | Accès SSH en lecture (ou écriture) à un seul dépôt |
| Jeton de job CI (`CI_JOB_TOKEN`) | Accès temporaire pendant un job |

## Durcissement de l'instance

- [ ] Inscription désactivée, **2FA obligatoire** (*Require all users to set up two-factor authentication*) ou SSO avec MFA
- [ ] Projets publics interdits, visibilité par défaut privée
- [ ] Expiration maximale des jetons, révocation des jetons inutilisés
- [ ] Limites de débit (*Rate limits*) et protection contre le force brute (Rack Attack)
- [ ] Mises à jour mensuelles (correctifs de sécurité fréquents)
- [ ] HTTPS uniquement, port SSH filtré, interface d'administration non exposée sur Internet
- [ ] Journaux d'audit (EE) et journaux d'authentification envoyés au SIEM
