# Test Android de NetWiki

Appareil : Android SDK built for x86_64 — versionCode=10000 minSdk=23 targetSdk=35 versionName=1.0.0 Failed to write while dumping service package: Broken pipe

| | Étape | Détail |
| --- | --- | --- |

![demarrage](01-demarrage.png)


![premier-lancement](02-premier-lancement.png)

| ✅ | Premier lancement : choix des mises à jour | Mises à jour de NetWiki |

![mise-a-jour-proposee](03-mise-a-jour-proposee.png)

| ✅ | Mise à jour proposée au démarrage (version de test 1.0.0) | NetWiki 1.46.0 est disponible |
| ✅ | Bouton Retour : ferme la fenêtre | fermée |

![accueil](04-accueil.png)

| ✅ | Écran d’accueil |  |

![article](05-article.png)

| ✅ | Ouverture d’un article | Présentation et installation |

![partager](06-partager.png)

| ✅ | Fenêtre Partager / exporter |  |

![pdf-enregistre](07-pdf-enregistre.png)

| ✅ | Enregistrer en PDF (Téléchargements) | -rwxrwx--- 1 u0_a119 media_rw 501267 2026-11-03 13:38 Présentation\ et\ installation.pdf |

![partage-pdf](08-partage-pdf.png)

| ✅ | Partager le PDF (sélecteur d’Android) |  |

![impression](09-impression.png)

| ✅ | Imprimer (boîte d’impression d’Android) |  |

![partage-texte](10-partage-texte.png)

| ✅ | Partager le texte (Markdown) |  |

![theme-clair](11-theme-clair.png)

| ✅ | Thème clair (barres système) |  |

![parametres](12-parametres.png)

| ✅ | Paramètres → Mises à jour |  |

![notification](13-notification.png)

| ✅ | Notification de nouvelle version (tâche de fond) | notification affichée ; nouveaux articles : true |

![depuis-notification](14-depuis-notification.png)

| ✅ | Notification touchée → fenêtre de mise à jour | NetWiki 1.46.0 est disponible |
| ✅ | Téléchargement vérifié (refus d’un APK signé par une autre clé) | SIGNATURE La nouvelle version est signée avec la clé officielle de JK-ASFC, différente de celle de l'application installée (ancienne version de test). Désinstallez NetWiki une seule fois puis installez la nouvelle version : les mises à jour suivantes seront automatiques. |
| ✅ | Empreinte incorrecte refusée | Empreinte du fichier téléchargé incorrecte : mise à jour annulée. |

![autorisation-installation](15-autorisation-installation.png)

| ✅ | Autorisation « Installer des applications inconnues » |  |

![apres-retour](16-apres-retour.png)

| ✅ | Bouton Retour : article → accueil → sortie | accueil puis application en arrière-plan |

![tiroir-applications](17-tiroir-applications.png)

| ✅ | Icône dans le tiroir d’applications |  |
