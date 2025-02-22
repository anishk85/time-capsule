import sys
import json
import warnings
from transformers import pipeline
import torch

# ✅ Suppress warnings & unnecessary logs
warnings.filterwarnings("ignore")
torch.set_printoptions(profile="none")

# ✅ Prevent "Using CPU" log messages
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

# ✅ Load sentiment analysis model (without logging device info)
try:
    classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)

def classify_text(text):
    try:
        result = classifier(text)[0]
        return result["label"]
    except Exception as e:
        return str(e)

# Get inputs from Node.js
title = sys.argv[1]
message = sys.argv[2]

# Run classification
title_sentiment = classify_text(title)
message_sentiment = classify_text(message)

# ✅ Print ONLY JSON output for Node.js
print(json.dumps({"title": title_sentiment, "message": message_sentiment}))
sys.stdout.flush()