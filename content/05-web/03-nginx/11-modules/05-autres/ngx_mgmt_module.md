---
title: "ngx_mgmt_module"
description: "Module nginx ngx_mgmt_module — Le module ngx_mgmt_module active la vérification de licence et le rapport d'utilisation de NGINX Plus. C'est obligatoire pour chaque instance NGINX Plus depuis la version 1.27.2 (NGINX Plus R33)."
tags: [nginx, module, ngx_mgmt_module]
icon: puzzle
---

Le module `ngx_mgmt_module` active la vérification de licence et le rapport d'utilisation de NGINX Plus. C'est obligatoire pour chaque instance NGINX Plus depuis la version 1.27.2 ([NGINX Plus R33](https://docs.nginx.com/nginx/releases/#r33)).

Un fichier de licence JWT nommé `license.jwt` doit se trouver dans `/etc/nginx/` sous Linux, `/usr/local/etc/nginx/` sous FreeBSD, ou au chemin indiqué par la directive [[12-directives/license-token|license_token]]. Le fichier de licence est disponible sur [MyF5](https://my.f5.com).

Le rapport d'utilisation est envoyé directement ou via un [[12-directives/proxy|mandataire]] au point de terminaison de licences de F5 [[12-directives/usage-report|toutes les heures]], par une connexion [[12-directives/ssl-verify-mgmt|sécurisée]]. Dans les environnements réseau restreints, le rapport peut être [[12-directives/usage-report|envoyé]] à [F5 NGINX Instance Manager](https://docs.nginx.com/nginx-management-suite/about/), qui le transmet au point de terminaison de licences de F5.

Par défaut, si le [[12-directives/enforce-initial-report|rapport d'utilisation initial]] n'est pas reçu par le point de terminaison de licences de F5, nginx cesse de traiter le trafic.

Le renouvellement automatique de la licence est pris en charge depuis la version 1.29.0 ([NGINX Plus R35](https://docs.nginx.com/nginx/releases/#r35)) pour les instances qui envoient directement leur rapport au point de terminaison de licences de F5. Lors du renouvellement, NGINX télécharge le JWT mis à jour et l'applique sans [[10-guides/01-introduction/switches|rechargement]] de la configuration. La licence mise à jour est stockée dans le répertoire [[12-directives/state-path-mgmt|state_path]].

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
mgmt {
    # in case if custom path is required
    license_token custom/file/path/license.jwt;

    # in case of reporting to NGINX Instance Manager
    usage_report endpoint=NIM_FQDN;
}
```

## Directives

- [[12-directives/mgmt|mgmt]]
- [[12-directives/enforce-initial-report|enforce_initial_report]]
- [[12-directives/license-token|license_token]]
- [[12-directives/license-pending-token|license_pending_token]]
- [[12-directives/proxy|proxy]]
- [[12-directives/proxy-username|proxy_username]]
- [[12-directives/proxy-password|proxy_password]]
- [[12-directives/resolver-mgmt|resolver]]
- [[12-directives/ssl-crl-mgmt|ssl_crl]]
- [[12-directives/ssl-trusted-certificate-mgmt|ssl_trusted_certificate]]
- [[12-directives/ssl-verify-mgmt|ssl_verify]]
- [[12-directives/state-path-mgmt|state_path]]
- [[12-directives/usage-report|usage_report]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
