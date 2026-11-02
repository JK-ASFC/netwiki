---
title: step-ca et step CLI
description: step-ca et step CLI (Smallstep, Apache 2.0) — autorité de certification interne moderne : installation (paquets Debian/RHEL, Windows, macOS, Docker), step ca init (AC racine et intermédiaire, ou intermédiaire signée par une AC existante comme AD CS), provisioners (JWK, ACME, OIDC, X5C, SSHPOP, cloud), serveur ACME interne pour Certbot, acme.sh, Traefik, Caddy et cert-manager, certificats de courte durée et renouvellement (step ca renew --daemon), certificats SSH utilisateurs et hôtes, politiques et modèles, step CLI comme couteau suisse (inspect, certificate create, crypto), sauvegarde et protection de la clé racine.
tags: [step-ca, smallstep, step cli, pki, acme, ssh, certificats]
icon: info
---

**step-ca** fournit une **AC interne** simple à opérer, avec un serveur **ACME** : tous les outils qui savent parler à Let's Encrypt (Certbot, acme.sh, Caddy, Traefik, [[37-ingress-certificats-dns/03-cert-manager|cert-manager]]) obtiennent alors automatiquement des certificats internes de **courte durée**. Il émet aussi des **certificats SSH** pour remplacer les clés `authorized_keys` dispersées. **step CLI** est en outre un excellent outil de manipulation de certificats.

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | Paquets `.deb` `step-cli` et `step-ca` (dépôt Smallstep ou versions GitHub) |
| RHEL | Paquets `.rpm` |
| Windows | `winget install Smallstep.step` (CLI) ; step-ca : binaire |
| macOS | `brew install step` |
| Docker | `smallstep/step-ca` |

## Initialiser l'AC

```bash
step ca init --name "AC Interne Corp" --dns ca.corp.exemple.fr --address :443 --provisioner admin@corp.exemple.fr --deployment-type standalone
# crée l'AC racine (à mettre hors ligne ensuite) et l'AC intermédiaire utilisée par le service
step ca provisioner add acme --type ACME
step ca provisioner add sso --type OIDC --client-id … --client-secret … --configuration-endpoint https://sso.corp.exemple.fr/realms/corp/.well-known/openid-configuration
sudo systemctl enable --now step-ca              # service fourni par le paquet (ou step-ca $(step path)/config/ca.json)
```

Variante d'entreprise : générer seulement une **AC intermédiaire** signée par l'AC racine existante (AD CS) pour rester dans la même chaîne de confiance.

## Utiliser

```bash
step ca bootstrap --ca-url https://ca.corp.exemple.fr --fingerprint <empreinte-racine> --install   # sur un poste : faire confiance à l'AC
step ca certificate srv-app-01.corp.exemple.fr srv.crt srv.key --not-after 720h
step ca renew --daemon srv.crt srv.key --exec "systemctl reload nginx"     # renouvellement automatique
sudo certbot certonly --standalone --server https://ca.corp.exemple.fr/acme/acme/directory -d srv-app-02.corp.exemple.fr
step certificate inspect https://intranet.corp.exemple.fr --short
step ssh certificate jk@corp.exemple.fr id_ecdsa       # certificat SSH utilisateur (provisioner OIDC : connexion SSO)
```

Sauvegarder la configuration, la base (`db/`) et surtout la **clé racine** (hors ligne, coffre ou HSM). Suite : [[02-ejbca|EJBCA]] · [[90-aide-memoire|aide-mémoire]].
