---
title: scikit-learn, XGBoost, LightGBM et CatBoost
description: Apprentissage automatique sur données tabulaires — scikit-learn (BSD : estimateurs, Pipeline et ColumnTransformer, validation croisée, recherche d'hyperparamètres, métriques, détection d'anomalies IsolationForest, regroupement, sauvegarde avec joblib et skops) et les bibliothèques de gradient boosting XGBoost, LightGBM et CatBoost (installation, GPU, variables catégorielles, arrêt précoce, importance des variables) ; cas d'usage en exploitation (anomalies de journaux, prévision de capacité, classement de tickets) et choix.
tags: [scikit-learn, xgboost, lightgbm, catboost, machine learning, données tabulaires, gradient boosting, python]
icon: chart-line
---

Pour des **données tabulaires** (métriques, journaux agrégés, tickets, inventaire), l'apprentissage profond est rarement nécessaire : **scikit-learn** et les bibliothèques de **gradient boosting** donnent d'excellents résultats, s'entraînent en minutes sur CPU et s'expliquent plus facilement.

## scikit-learn

```bash
python3 -m pip install scikit-learn pandas joblib
```

```python
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

df = pd.read_csv("tickets.csv")                       # categorie, priorite, site, delai_h, nb_relances, escalade (0/1)
X, y = df.drop(columns="escalade"), df["escalade"]
prep = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["categorie", "priorite", "site"]),
    ("num", StandardScaler(), ["delai_h", "nb_relances"]),
])
modele = Pipeline([("prep", prep), ("clf", RandomForestClassifier(n_estimators=300, class_weight="balanced", n_jobs=-1))])

X_app, X_test, y_app, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
print(cross_val_score(modele, X_app, y_app, cv=5, scoring="f1").mean())
modele.fit(X_app, y_app)
print(classification_report(y_test, modele.predict(X_test)))
joblib.dump(modele, "escalade.joblib")
```

| Besoin | Estimateurs |
| --- | --- |
| Classification / régression | `LogisticRegression`, `RandomForest*`, `HistGradientBoosting*` |
| Détection d'anomalies | `IsolationForest`, `LocalOutlierFactor`, `OneClassSVM` |
| Regroupement | `KMeans`, `DBSCAN`, `AgglomerativeClustering` |
| Réduction de dimension | `PCA`, `TruncatedSVD` |
| Texte simple | `TfidfVectorizer` + `LinearSVC` (classement de tickets) |
| Réglages | `GridSearchCV`, `RandomizedSearchCV`, `HalvingGridSearchCV` |

Toujours encapsuler le prétraitement dans un **Pipeline** : sinon, des informations du jeu de test fuient dans l'entraînement et les scores sont trop optimistes.

> [!WARNING]
> `joblib` et `pickle` exécutent du code au chargement : ne charger que des modèles produits en interne. Le format **skops** (`skops.io`) permet un chargement plus sûr avec liste de types autorisés.

## Gradient boosting

| Bibliothèque | Origine | Points forts |
| --- | --- | --- |
| **XGBoost** | Communauté DMLC (Apache 2.0) | Référence, robuste, GPU, distribué (Spark, Dask) |
| **LightGBM** | Microsoft (MIT) | Très rapide sur gros volumes, faible mémoire |
| **CatBoost** | Yandex (Apache 2.0) | Variables **catégorielles** natives, bons résultats sans réglage |

```bash
python3 -m pip install xgboost lightgbm catboost
```

```python
import xgboost as xgb, lightgbm as lgb
from catboost import CatBoostClassifier

m1 = xgb.XGBClassifier(n_estimators=1000, learning_rate=0.05, max_depth=6, early_stopping_rounds=50,
                       tree_method="hist", device="cuda")            # device="cpu" sans GPU
m1.fit(X_app_num, y_app, eval_set=[(X_val_num, y_val)], verbose=False)

m2 = lgb.LGBMClassifier(n_estimators=1000, learning_rate=0.05, num_leaves=63)
m2.fit(X_app_num, y_app, eval_set=[(X_val_num, y_val)], callbacks=[lgb.early_stopping(50)])

m3 = CatBoostClassifier(iterations=1000, learning_rate=0.05, cat_features=["categorie", "priorite", "site"], verbose=0)
m3.fit(X_app, y_app, eval_set=(X_val, y_val), early_stopping_rounds=50)

print(sorted(zip(m3.get_feature_importance(), X_app.columns), reverse=True)[:5])
m1.save_model("modele.json")                                         # format portable XGBoost
```

L'**arrêt précoce** sur un jeu de validation évite le surapprentissage ; la bibliothèque **SHAP** explique les prédictions variable par variable.

## Cas d'usage en exploitation

| Cas | Approche |
| --- | --- |
| Anomalies dans les métriques ou journaux agrégés | `IsolationForest` sur des fenêtres (volume, taux d'erreur, latence) |
| Prévoir la saturation d'un disque ou d'un lien | Régression avec variables calendaires (boosting) |
| Prioriser ou router des tickets | TF-IDF + classifieur linéaire, ou CatBoost sur les champs structurés |
| Détecter des connexions suspectes | Boosting sur des caractéristiques de sessions, revu par un analyste |

Le modèle reste une **aide** : fixer des seuils, mesurer les faux positifs et réentraîner régulièrement (les données dérivent).

Voir aussi : [[02-onnx-runtime-openvino|ONNX Runtime et OpenVINO]] · [[11-experiences-annotation/01-clearml-aim|suivi d'expériences]]. Commandes : [[90-aide-memoire|aide-mémoire]].
