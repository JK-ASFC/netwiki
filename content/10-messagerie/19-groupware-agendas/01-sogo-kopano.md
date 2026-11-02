---
title: SOGo et Kopano
description: Groupware libres — SOGo (Alinto, GPL : webmail, agendas et contacts partagés CalDAV/CardDAV, ActiveSync, compatible Outlook et Thunderbird ; paquets communautaires nightly ou dépôts de la distribution, sogo.conf, sources LDAP/Active Directory, PostgreSQL ou MySQL, memcached, Apache ou NGINX, sogo-tool, alarmes) et Kopano Core Community (alternative à Exchange, projet en sommeil, successeur grommunio), installation sous Debian/Ubuntu et RHEL, sécurité, sauvegarde et dépannage.
tags: [sogo, kopano, grommunio, groupware, caldav, carddav, activesync, webmail]
icon: calendar-days
---

## SOGo

**SOGo** (Alinto, GPL) est un **groupware** qui s'ajoute à un serveur de messagerie existant ([[01-postfix/01-presentation|Postfix]] + [[02-dovecot/01-presentation-installation|Dovecot]]) : webmail, **agendas** et **carnets d'adresses** partagés (protocoles **CalDAV** et **CardDAV**), délégations, **ActiveSync** pour les smartphones et Outlook, synchronisation avec Thunderbird. Il est utilisé par de nombreuses universités et collectivités, et intégré à des suites comme Mailcow.

| Composant | Rôle |
| --- | --- |
| `sogod` | Service SOGo (port local 20000) |
| Base PostgreSQL ou MySQL | Préférences, agendas, contacts, sessions |
| Annuaire LDAP / Active Directory ou table SQL | Comptes et authentification |
| IMAP / SMTP | Messagerie (Dovecot, Postfix) |
| memcached | Cache |
| Apache ou NGINX | Interface web, proxy vers `sogod` |

Paquets : les **versions de production** des dépôts d'Alinto sont réservées aux clients sous contrat ; la communauté utilise les **compilations nightly** (dépôt `packages.sogo.nu`, section *Development (nightly builds)*) ou les paquets des distributions (`apt install sogo` sous Debian/Ubuntu, EPEL sous RHEL).

```bash
sudo apt install -y sogo sope4.9-gdl1-postgresql memcached postgresql apache2      # nom du paquet SOPE selon la version
sudo -u postgres psql -c "CREATE ROLE sogo LOGIN PASSWORD 'MdpSogo2026';" -c "CREATE DATABASE sogo OWNER sogo;"
```

Configuration `/etc/sogo/sogo.conf` (liste de propriétés) :

```text
{
  SOGoProfileURL = "postgresql://sogo:MdpSogo2026@localhost:5432/sogo/sogo_user_profile";
  OCSFolderInfoURL = "postgresql://sogo:MdpSogo2026@localhost:5432/sogo/sogo_folder_info";
  OCSSessionsFolderURL = "postgresql://sogo:MdpSogo2026@localhost:5432/sogo/sogo_sessions_folder";
  SOGoLanguage = French;
  SOGoTimeZone = Europe/Paris;
  SOGoMailDomain = corp.exemple.fr;
  SOGoIMAPServer = "imaps://imap.corp.exemple.fr:993";
  SOGoSMTPServer = "smtp://smtp.corp.exemple.fr:587/?tls=YES";
  SOGoMailingMechanism = smtp;
  SOGoSMTPAuthenticationType = PLAIN;
  SOGoMemcachedHost = 127.0.0.1;
  SOGoUserSources = (
    {
      type = ldap;
      CNFieldName = cn;
      UIDFieldName = sAMAccountName;
      IDFieldName = sAMAccountName;
      bindFields = (sAMAccountName);
      baseDN = "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr";
      bindDN = "CN=svc-sogo,OU=Services,DC=corp,DC=exemple,DC=fr";
      bindPassword = "MdpServiceSogo2026";
      hostname = "ldaps://dc01.corp.exemple.fr:636";
      canAuthenticate = YES;
      isAddressBook = YES;
      id = annuaire;
      displayName = "Annuaire de l'entreprise";
    }
  );
}
```

```bash
sudo a2enmod proxy proxy_http headers rewrite && sudo a2enconf SOGo && sudo systemctl restart apache2   # configuration Apache fournie
sudo systemctl enable --now sogo
```

Interface : `https://mail.corp.exemple.fr/SOGo` ; URL CalDAV/CardDAV pour les clients : `https://mail.corp.exemple.fr/SOGo/dav/jk@corp.exemple.fr/`. ActiveSync : paquet complémentaire et proxy de `/Microsoft-Server-ActiveSync` vers SOGo.

<!-- CAPTURE: Agenda partagé dans l'interface web de SOGo | _assets/sogo-agenda.png -->

Exploitation :

```bash
sudo -u sogo sogo-tool backup /srv/sauvegardes/sogo ALL          # agendas, contacts et préférences de tous les comptes
sudo -u sogo sogo-tool restore -F ALL /srv/sauvegardes/sogo jk     # restaure tous les dossiers d'un compte (-p : préférences seules)
sudo -u sogo sogo-tool expire-sessions 60
sudo tail -f /var/log/sogo/sogo.log
```

Alarmes par courriel des événements : tâche planifiée `sogo-ealarms-notify` chaque minute (fichier cron fourni par le paquet, à activer).

## Kopano Core Community

**Kopano** (AGPL) est une alternative libre à Microsoft Exchange (MAPI, agenda, webapp, intégration Outlook via Z-Push). Le projet communautaire n'évolue plus guère : pour une nouvelle installation, préférer **grommunio** (successeur libre et activement maintenu, compatible Outlook/Exchange) ou l'association SOGo + Dovecot. Les installations Kopano existantes reposent sur les services `kopano-server`, `kopano-dagent`, `kopano-spooler`, `kopano-gateway` et l'administration `kopano-admin` (`kopano-admin -l` liste les comptes) ; planifier leur migration.

Commandes : [[90-aide-memoire|aide-mémoire]].
