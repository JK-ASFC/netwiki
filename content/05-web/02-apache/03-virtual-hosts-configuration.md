---
title: Virtual hosts et configuration de base
description: Déclarer des virtual hosts par nom et par IP, sections Directory/Files/Location, Options et AllowOverride, .htaccess, alias, redirections, mod_rewrite, pages d'erreur, documents par défaut, journaux par site et types MIME.
tags: [apache, virtualhost, htaccess, mod_rewrite, redirection, configuration]
icon: layers
---

## Virtual host par nom

```apache /etc/apache2/sites-available/intranet.conf
<VirtualHost *:80>
    ServerName intranet.exemple.fr
    ServerAlias intranet www.intranet.exemple.fr
    ServerAdmin webmaster@exemple.fr
    DocumentRoot /srv/www/intranet/public

    <Directory /srv/www/intranet/public>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/intranet-error.log
    CustomLog ${APACHE_LOG_DIR}/intranet-access.log combined
</VirtualHost>
```

```bash
sudo mkdir -p /srv/www/intranet/public && echo "OK" | sudo tee /srv/www/intranet/public/index.html
sudo a2ensite intranet && sudo apache2ctl configtest && sudo systemctl reload apache2
apache2ctl -S          # vérifier quel vhost répond à quel nom
```

> [!IMPORTANT]
> Le **premier** virtual host déclaré pour un couple IP:port est le **vhost par défaut** : il répond à toute requête dont le `Host` ne correspond à aucun `ServerName`/`ServerAlias`. Créez un vhost `000-default` neutre (403 ou page générique) pour ne jamais exposer un site métier par erreur.

```apache /etc/apache2/sites-available/000-default.conf
<VirtualHost *:80>
    ServerName default.invalid
    DocumentRoot /var/www/empty
    <Location />
        Require all denied
    </Location>
</VirtualHost>
```

### Par IP ou par port

```apache
Listen 8081
<VirtualHost 192.168.10.20:80>    # uniquement sur cette IP
    ServerName ancien.exemple.fr
    DocumentRoot /srv/www/ancien
</VirtualHost>
<VirtualHost *:8081>              # sur un port dédié
    ServerName admin.exemple.fr
    DocumentRoot /srv/www/admin
</VirtualHost>
```

## Sections Directory et droits d'accès

```apache
# Interdiction globale par défaut (présente dans apache2.conf / httpd.conf)
<Directory />
    Options None
    AllowOverride None
    Require all denied
</Directory>

<Directory /srv/www/intranet/public>
    Options -Indexes +FollowSymLinks -MultiViews
    AllowOverride None
    Require all granted
</Directory>

# Fichiers sensibles
<FilesMatch "^\.(env|git|ht)">
    Require all denied
</FilesMatch>
<DirectoryMatch "/\.git">
    Require all denied
</DirectoryMatch>
```

### Options

| Option | Effet |
| --- | --- |
| `Indexes` | Liste le contenu d'un dossier sans document par défaut (à désactiver) |
| `FollowSymLinks` / `SymLinksIfOwnerMatch` | Suivre les liens symboliques (toujours / si même propriétaire) |
| `ExecCGI` | Autoriser l'exécution CGI |
| `Includes` / `IncludesNOEXEC` | SSI |
| `MultiViews` | Négociation de contenu (`page` → `page.fr.html`) |
| `None` / `All` | Aucune / toutes (sauf MultiViews) |

`+Option` / `-Option` modifie l'héritage ; sans signe, la liste **remplace** celle héritée.

### Require (autorisation, 2.4)

```apache
Require all granted
Require all denied
Require ip 10.0.0.0/8 192.168.1.0/24
Require host exemple.fr
Require valid-user
Require group admins
Require env interne

<RequireAll>
    Require ip 10.0.0.0/8
    Require valid-user
</RequireAll>
<RequireAny>
    Require ip 10.0.0.0/8
    Require ldap-group CN=GG_Intranet,OU=Groupes,DC=corp,DC=exemple,DC=fr
</RequireAny>
```

> [!NOTE]
> La syntaxe 2.2 (`Order allow,deny`, `Allow from`, `Deny from`) est **obsolète** ; elle ne fonctionne qu'avec `mod_access_compat`. Ne mélangez pas les deux syntaxes.

## .htaccess

`AllowOverride` précise ce qu'un `.htaccess` peut modifier :

| Valeur | Directives autorisées |
| --- | --- |
| `None` | Aucune (Apache ne lit même pas les fichiers : plus rapide, plus sûr) |
| `All` | Toutes |
| `AuthConfig` | Authentification |
| `FileInfo` | Rewrite, en-têtes, types MIME, pages d'erreur |
| `Indexes` | Listes de répertoires, `DirectoryIndex` |
| `Limit` | `Require` (ancien style) |
| `Options=Indexes,FollowSymLinks` | Options limitées |

> [!TIP]
> `.htaccess` est utile pour les applications qui le fournissent (WordPress, Laravel) ou l'hébergement mutualisé. Sur un serveur que vous administrez, placez les règles dans le vhost avec `AllowOverride None` : Apache évite alors de chercher un `.htaccess` dans chaque dossier parent à chaque requête.

## Alias, redirections, pages d'erreur

```apache
Alias /docs /srv/partage/documentation
<Directory /srv/partage/documentation>
    Require all granted
</Directory>

Redirect permanent /ancienne-page https://www.exemple.fr/nouvelle-page
RedirectMatch 301 ^/blog/(.*)$ https://blog.exemple.fr/$1

DirectoryIndex index.php index.html
ErrorDocument 404 /erreurs/404.html
ErrorDocument 503 "Maintenance en cours"
AddDefaultCharset UTF-8
AddType application/manifest+json .webmanifest
AddType font/woff2 .woff2
```

## mod_rewrite

```apache
RewriteEngine On

# Forcer HTTPS (dans le vhost *:80)
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# Forcer le www
RewriteCond %{HTTP_HOST} ^exemple\.fr$ [NC]
RewriteRule ^ https://www.exemple.fr%{REQUEST_URI} [R=301,L]

# Contrôleur frontal (application PHP / SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.php [L]

# Bloquer des agents malveillants
RewriteCond %{HTTP_USER_AGENT} (sqlmap|nikto|masscan) [NC]
RewriteRule ^ - [F]

# Mode maintenance sauf pour une IP
RewriteCond %{REMOTE_ADDR} !^10\.0\.10\.5$
RewriteCond %{DOCUMENT_ROOT}/maintenance.html -f
RewriteCond %{REQUEST_URI} !/maintenance.html
RewriteRule ^ /maintenance.html [R=503,L]
ErrorDocument 503 /maintenance.html
```

| Drapeau | Effet |
| --- | --- |
| `L` | Dernière règle |
| `R=301` / `R=302` | Redirection externe |
| `NC` | Insensible à la casse |
| `QSA` | Conserver la chaîne de requête et y ajouter |
| `QSD` | Supprimer la chaîne de requête |
| `F` / `G` | 403 / 410 |
| `P` | Transmettre au proxy (préférer `ProxyPass`) |
| `E=var:val` | Définir une variable d'environnement |
| `END` | Arrêter tout traitement de réécriture (y compris `.htaccess`) |

```apache
# Déboguer les règles (2.4)
LogLevel alert rewrite:trace3
```

Dans un **vhost**, le motif de `RewriteRule` reçoit le chemin **avec** le `/` initial ; dans un `.htaccess` ou un `<Directory>`, **sans**. Source fréquente d'erreurs lors de la migration de règles.

## Variables et inclusions

```apache
Define DOMAINE exemple.fr
Define WWW /srv/www

<VirtualHost *:80>
    ServerName www.${DOMAINE}
    DocumentRoot ${WWW}/site
    Include /etc/apache2/snippets/securite-entetes.conf
</VirtualHost>
```

### Macros (mod_macro) : un modèle pour de nombreux sites

```apache
<Macro SiteSimple $nom $racine>
    <VirtualHost *:80>
        ServerName $nom
        DocumentRoot $racine
        <Directory $racine>
            Require all granted
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/$nom-error.log
        CustomLog ${APACHE_LOG_DIR}/$nom-access.log combined
    </VirtualHost>
</Macro>
Use SiteSimple wiki.exemple.fr /srv/www/wiki
Use SiteSimple docs.exemple.fr /srv/www/docs
UndefMacro SiteSimple
```

## Répertoires personnels (mod_userdir)

```bash
sudo a2enmod userdir     # http://serveur/~utilisateur → ~/public_html
```

À n'activer que sur des serveurs pédagogiques ou de développement.

## Format de journal personnalisé

```apache
LogFormat "%a %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\" %D %{Host}i" vhost_combined_tps
CustomLog ${APACHE_LOG_DIR}/access.log vhost_combined_tps
```

`%D` = durée en microsecondes, `%a` = IP cliente (réelle avec `mod_remoteip` derrière un proxy).
