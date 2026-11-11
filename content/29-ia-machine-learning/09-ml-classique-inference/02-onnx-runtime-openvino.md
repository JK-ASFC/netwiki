---
title: ONNX Runtime et OpenVINO
description: Exécuter des modèles efficacement en production — format ONNX (export depuis PyTorch, scikit-learn avec skl2onnx, Hugging Face Optimum, inspection avec Netron), ONNX Runtime (MIT, Microsoft : fournisseurs d'exécution CPU, CUDA, TensorRT, DirectML, OpenVINO, CoreML ; sessions, quantification dynamique et statique, optimisation de graphe, onnxruntime-genai pour les LLM) et OpenVINO (Intel, Apache 2.0 : CPU, GPU intégré et NPU Intel, conversion ovc, benchmark_app, optimum-intel, OpenVINO Model Server) ; gains attendus et choix.
tags: [onnx, onnx runtime, openvino, inférence, quantification, intel, npu, tensorrt, production]
icon: chart-line
---

Un modèle entraîné dans un framework n'est pas forcément le plus efficace à exécuter. **ONNX** est un **format d'échange** standard ; **ONNX Runtime** et **OpenVINO** sont des **moteurs d'inférence** optimisés qui accélèrent l'exécution, surtout sur **CPU** et sur matériel hétérogène, sans dépendre du framework d'origine.

## Exporter en ONNX

```bash
python3 -m pip install onnx onnxruntime skl2onnx "optimum[onnxruntime]"
```

```python
# Depuis PyTorch
import torch
torch.onnx.export(modele.eval(), torch.randn(1, 3, 224, 224), "modele.onnx",
                  input_names=["entree"], output_names=["sortie"],
                  dynamic_axes={"entree": {0: "lot"}, "sortie": {0: "lot"}}, opset_version=17)

# Depuis scikit-learn
from skl2onnx import to_onnx
onx = to_onnx(pipeline_sklearn, X_app[:1].astype("float32"))
open("pipeline.onnx", "wb").write(onx.SerializeToString())
```

```bash
# Modèle Hugging Face (classification, plongements, traduction…)
optimum-cli export onnx --model intfloat/multilingual-e5-small e5-onnx/
python3 -c "import onnx; m = onnx.load('modele.onnx'); onnx.checker.check_model(m); print([i.name for i in m.graph.input])"
```

**Netron** (application ou site web) visualise un fichier ONNX : entrées, sorties, couches.

## ONNX Runtime

```python
import numpy as np, onnxruntime as ort

print(ort.get_available_providers())
session = ort.InferenceSession("modele.onnx", providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
sortie = session.run(None, {"entree": np.random.rand(8, 3, 224, 224).astype(np.float32)})
```

| Fournisseur d'exécution | Matériel | Paquet |
| --- | --- | --- |
| CPU | Tout processeur | `onnxruntime` |
| CUDA, TensorRT | NVIDIA | `onnxruntime-gpu` |
| DirectML | Tout GPU sous Windows | `onnxruntime-directml` |
| OpenVINO | CPU, GPU, NPU Intel | `onnxruntime-openvino` |
| CoreML | Apple | inclus sur macOS |

```python
# Quantification dynamique INT8 : modèle ~4 fois plus petit, souvent 2–3 fois plus rapide sur CPU
from onnxruntime.quantization import quantize_dynamic, QuantType
quantize_dynamic("modele.onnx", "modele-int8.onnx", weight_type=QuantType.QInt8)
```

Toujours **mesurer la précision** après quantification sur un jeu de validation. Pour les LLM, **onnxruntime-genai** fournit la boucle de génération (utilisé notamment sur les PC à NPU).

## OpenVINO

**OpenVINO** (Intel, Apache 2.0) optimise l'inférence sur **CPU Intel et AMD**, **GPU intégrés et Arc**, et **NPU** des processeurs Intel Core Ultra. Il lit ONNX, PyTorch, TensorFlow et son format IR (`.xml` + `.bin`).

```bash
python3 -m pip install openvino "optimum[openvino]"
ovc modele.onnx --output_model modele_ir/modele        # conversion en IR (option --compress_to_fp16)
benchmark_app -m modele_ir/modele.xml -d CPU -hint throughput
benchmark_app -m modele_ir/modele.xml -d GPU
```

```python
import openvino as ov
core = ov.Core()
print(core.available_devices)                         # ['CPU', 'GPU', 'NPU']
compile = core.compile_model("modele_ir/modele.xml", "AUTO", {"PERFORMANCE_HINT": "LATENCY"})
resultat = compile(entree)[0]
```

```bash
# LLM et modèles Hugging Face optimisés pour Intel
optimum-cli export openvino --model Qwen/Qwen2.5-1.5B-Instruct --weight-format int4 qwen-ov/
```

**OpenVINO Model Server** (image `openvino/model_server`) sert des modèles en gRPC/REST (API compatible KServe et OpenAI pour les LLM).

## Quand les utiliser ?

| Situation | Solution |
| --- | --- |
| Serveur sans GPU, modèle de vision ou de texte de taille modeste | ONNX Runtime CPU + quantification INT8, ou OpenVINO |
| Parc de PC Intel avec NPU | OpenVINO ou ONNX Runtime + fournisseur OpenVINO |
| GPU NVIDIA, latence minimale | ONNX Runtime + TensorRT |
| Application Windows sur GPU variés | ONNX Runtime DirectML |
| Grands LLM sur GPU de centre de données | [[02-serveurs-inference/01-vllm-tgi\|vLLM]] plutôt qu'ONNX |

Voir aussi : [[01-scikit-learn-boosting|scikit-learn et boosting]] · [[08-frameworks-ml/01-pytorch-tensorflow-jax|PyTorch]] · [[10-mlops-serving/01-bentoml-kserve-seldon|déploiement de modèles]]. Commandes : [[90-aide-memoire|aide-mémoire]].
