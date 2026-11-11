---
title: scikit-learn, boosting, ONNX Runtime et OpenVINO — aide-mémoire
description: Paquets et extraits pour scikit-learn (pipeline, validation croisée, sauvegarde), XGBoost, LightGBM, CatBoost, export et vérification ONNX, fournisseurs ONNX Runtime, quantification et commandes OpenVINO (ovc, benchmark_app, optimum-cli).
tags: [aide-mémoire, scikit-learn, xgboost, lightgbm, catboost, onnx runtime, openvino]
icon: terminal
---

Explications : [[01-scikit-learn-boosting|scikit-learn et boosting]] · [[02-onnx-runtime-openvino|ONNX Runtime et OpenVINO]].

```bash
# Installation
python3 -m pip install scikit-learn xgboost lightgbm catboost shap skops
python3 -m pip install onnx onnxruntime skl2onnx "optimum[onnxruntime]"     # onnxruntime-gpu pour NVIDIA
python3 -m pip install openvino "optimum[openvino]"

# ONNX
optimum-cli export onnx --model ORG/MODELE dossier-onnx/
python3 -c "import onnxruntime as ort; print(ort.get_available_providers())"
python3 -c "import onnx; onnx.checker.check_model(onnx.load('modele.onnx'))"

# OpenVINO
ovc modele.onnx --output_model ir/modele
benchmark_app -m ir/modele.xml -d CPU -hint throughput
python3 -c "import openvino as ov; print(ov.Core().available_devices)"
optimum-cli export openvino --model ORG/MODELE --weight-format int4 dossier-ov/
```

```python
# Évaluation rapide scikit-learn
from sklearn.model_selection import cross_val_score
print(cross_val_score(pipeline, X, y, cv=5, scoring="f1").mean())

# Quantification dynamique ONNX
from onnxruntime.quantization import quantize_dynamic, QuantType
quantize_dynamic("modele.onnx", "modele-int8.onnx", weight_type=QuantType.QInt8)
```

| Métrique | Usage |
| --- | --- |
| Précision / rappel / F1 | Classes déséquilibrées (escalade, fraude, anomalie) |
| ROC AUC | Qualité de classement global |
| MAE / RMSE | Régression (prévision de capacité) |
