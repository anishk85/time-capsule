import sys
import json
import warnings
from transformers import pipeline
import torch

warnings.filterwarnings("ignore")
torch.set_printoptions(profile="none")

import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["TRANSFORMERS_VERBOSITY"] = "error"

# Load sentiment analysis model
try:
    classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion")
except Exception as e:
    print(json.dumps({"error": f"Model Load Error: {str(e)}"}))
    sys.exit(1)

def classify_text(text):
    try:
        result = classifier(text)[0]
        return result["label"]
    except Exception as e:
        return f"Classification Error: {str(e)}"

try:
    title = sys.argv[1] if len(sys.argv) > 1 else ""
    message = sys.argv[2] if len(sys.argv) > 2 else ""

    if not title or not message:
        raise ValueError("Title and message cannot be empty.")

    title_sentiment = classify_text(title)
    message_sentiment = classify_text(message)

    # ✅ Print JSON output (only this, no extra logs)
    print(json.dumps({"title": title_sentiment, "message": message_sentiment}))

except Exception as e:
    print(json.dumps({"error": str(e)}))

sys.stdout.flush()
